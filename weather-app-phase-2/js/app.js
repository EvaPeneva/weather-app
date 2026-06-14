/* =========================================================
   App module
   Connects UI events with API functions, map clicks and localStorage history.
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
    renderSearchHistory,
    setMapStatus,
    showLoading,
    hideLoading,
    showError
} from './ui.js';

const HISTORY_KEY = 'weatherSearchHistory';

elements.searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const city = getCityInputValue();

    if (city === '') {
        showError('Моля, въведи име на град.');
        return;
    }

    await loadWeatherByCity(city, true);
});

elements.unitToggle.addEventListener('click', function () {
    toggleTemperatureUnit();
});

renderSearchHistory(getSearchHistory(), handleHistoryClick);
initWeatherMap(handleMapClick);

async function loadWeatherByCity(city, shouldSaveHistory) {
    showLoading();
    setMapStatus('Зареждане на данни за избрания град...');

    try {
        const weatherData = await fetchWeatherByCity(city);
        showWeatherData(weatherData);
        updateMapMarker(weatherData.place.latitude, weatherData.place.longitude, weatherData.place.name, weatherData.weather);
        setMapStatus(`Картата показва: ${weatherData.place.name}.`);

        if (shouldSaveHistory) {
            saveToHistory(city);
        }
    } catch (error) {
        showError(error.message);
        setMapStatus('Не успяхме да намерим мястото.');
    } finally {
        hideLoading();
    }
}

async function loadWeatherByCoordinates(latitude, longitude) {
    showLoading();
    setMapStatus('Зареждане на времето за избраната точка...');

    try {
        const weatherData = await fetchWeatherFromMap(latitude, longitude);
        showWeatherData(weatherData);
        if (!weatherData.place.isMapFallback) {
            setCityInputValue(weatherData.place.name);
            saveToHistory(weatherData.place.name);
            setMapStatus(`Избрано място от картата: ${weatherData.place.name}.`);
        } else {
            setCityInputValue(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            setMapStatus('Избрана е точка от картата. Няма намерено име на град, но времето е заредено по координати.');
        }

        updateMapMarker(latitude, longitude, weatherData.place.name, weatherData.weather);
    } catch (error) {
        showError(error.message);
        setMapStatus('Не успяхме да заредим времето за тази точка.');
    } finally {
        hideLoading();
    }
}

function showWeatherData(weatherData) {
    displayWeather(weatherData.place, weatherData.weather);
    renderForecast(weatherData.daily);
}

async function handleHistoryClick(city) {
    setCityInputValue(city);
    await loadWeatherByCity(city, true);
}

async function handleMapClick(latitude, longitude) {
    await loadWeatherByCoordinates(latitude, longitude);
}

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

function saveToHistory(city) {
    let history = getSearchHistory();
    const normalizedCity = city.trim();

    history = history.filter((item) => item.toLowerCase() !== normalizedCity.toLowerCase());
    history.unshift(normalizedCity);
    history = history.slice(0, 5);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderSearchHistory(history, handleHistoryClick);
}
