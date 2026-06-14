/* =========================================================
   App module
   Connects UI events with API functions, map clicks, language switching and history.
   ========================================================= */

import { fetchWeatherByCity, fetchWeatherFromMap } from './api.js';
import { initWeatherMap, updateMapMarker } from './map.js';
import {
    elements,
    getCityInputValue,
    setCityInputValue,
    displayWeather,
    renderForecast,
    toggleTemperatureUnit,
    toggleLanguage,
    getCurrentLanguage,
    getCurrentUnit,
    getText,
    renderSearchHistory,
    setMapStatus,
    showLoading,
    hideLoading,
    showError
} from './ui.js';

// The history key is used in localStorage so searches stay saved after refresh.
const HISTORY_KEY = 'weatherSearchHistory';

// This variable keeps the last loaded data so the unit/language/map can be refreshed.
let lastWeatherData = null;

// The form handles both clicking the button and pressing Enter in the input.
elements.searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const city = getCityInputValue();

    if (city === '') {
        showError('errorEmpty');
        return;
    }

    await loadWeatherByCity(city, true);
});

// The unit button changes every visible temperature, including the map popup.
elements.unitToggle.addEventListener('click', function () {
    toggleTemperatureUnit();

    // If weather is already loaded, refresh the map popup with the new unit.
    if (lastWeatherData) {
        updateMapMarker(
            lastWeatherData.place.latitude,
            lastWeatherData.place.longitude,
            lastWeatherData.place.name,
            lastWeatherData.weather,
            getCurrentLanguage(),
            getCurrentUnit()
        );
    }
});

// The language button changes interface text and reloads the place name.
elements.languageToggle.addEventListener('click', async function () {
    toggleLanguage();
    renderSearchHistory(getSearchHistory(), handleHistoryClick);

    // Reloading by coordinates updates city names and reverse geocoding language.
    if (lastWeatherData) {
        await loadWeatherByCoordinates(lastWeatherData.place.latitude, lastWeatherData.place.longitude, false);
    }
});

// The location button uses the browser geolocation API.
elements.locationButton.addEventListener('click', function () {
    loadWeatherByCurrentLocation();
});

// Initial page setup: render saved history and prepare the map.
renderSearchHistory(getSearchHistory(), handleHistoryClick);
initWeatherMap(handleMapClick);

/**
 * Loads weather after a normal city search.
 * It also updates the map marker and saves the city in history when needed.
 */
async function loadWeatherByCity(city, shouldSaveHistory) {
    showLoading();
    setMapStatus(getText('cityLoading'));

    try {
        const weatherData = await fetchWeatherByCity(city, getCurrentLanguage());
        showWeatherData(weatherData);
        updateMapMarker(
            weatherData.place.latitude,
            weatherData.place.longitude,
            weatherData.place.name,
            weatherData.weather,
            getCurrentLanguage(),
            getCurrentUnit()
        );
        setMapStatus(`${getText('mapShows')} ${weatherData.place.name}.`);

        if (shouldSaveHistory) {
            saveToHistory(weatherData.place.name || city);
        }
    } catch (error) {
        showError(error.message);
        setMapStatus(getText('searchFailed'));
    } finally {
        hideLoading();
    }
}

/**
 * Loads weather by coordinates from map click or current location.
 */
async function loadWeatherByCoordinates(latitude, longitude, shouldSaveHistory = true) {
    showLoading();
    setMapStatus(getText('mapLoading'));

    try {
        const weatherData = await fetchWeatherFromMap(latitude, longitude, getCurrentLanguage());
        showWeatherData(weatherData);

        if (!weatherData.place.isMapFallback) {
            setCityInputValue(weatherData.place.name);
            setMapStatus(`${getText('mapSelected')} ${weatherData.place.name}.`);

            if (shouldSaveHistory) {
                saveToHistory(weatherData.place.name);
            }
        } else {
            setCityInputValue(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            setMapStatus(getText('mapFallback'));
        }

        updateMapMarker(latitude, longitude, weatherData.place.name, weatherData.weather, getCurrentLanguage(), getCurrentUnit());
    } catch (error) {
        showError(error.message);
        setMapStatus(getText('mapFailed'));
    } finally {
        hideLoading();
    }
}

/**
 * Uses the browser geolocation API to get the user's current position.
 */
function loadWeatherByCurrentLocation() {
    if (!navigator.geolocation) {
        showError('locationUnsupported');
        return;
    }

    showLoading();
    setMapStatus(getText('locationLoading'));

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await loadWeatherByCoordinates(latitude, longitude, true);
        },
        () => {
            hideLoading();
            showError('locationDenied');
            setMapStatus(getText('locationDenied'));
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

/**
 * Stores the latest API result and sends it to the UI module for rendering.
 */
function showWeatherData(weatherData) {
    lastWeatherData = weatherData;
    displayWeather(weatherData.place, weatherData.weather);
    renderForecast(weatherData.daily);
}

// History buttons behave like a normal search.
async function handleHistoryClick(city) {
    setCityInputValue(city);
    await loadWeatherByCity(city, true);
}

// Every map click gives latitude and longitude from Leaflet.
async function handleMapClick(latitude, longitude) {
    await loadWeatherByCoordinates(latitude, longitude, true);
}

// Reads the array of previous city searches from localStorage.
function getSearchHistory() {
    const savedHistory = localStorage.getItem(HISTORY_KEY);

    if (!savedHistory) {
        return [];
    }

    try {
        return JSON.parse(savedHistory);
    } catch {
        return [];
    }
}

/**
 * Adds a city to localStorage history, removes duplicates and keeps only 5 items.
 */
function saveToHistory(city) {
    let history = getSearchHistory();
    const normalizedCity = city.trim();

    if (normalizedCity === '') {
        return;
    }

    history = history.filter((item) => item.toLowerCase() !== normalizedCity.toLowerCase());
    history.unshift(normalizedCity);
    history = history.slice(0, 5);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderSearchHistory(history, handleHistoryClick);
}
