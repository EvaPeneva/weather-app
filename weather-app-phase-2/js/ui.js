/* =========================================================
   UI module
   Handles DOM elements, translations and screen updates. No fetch requests here.
   ========================================================= */

import {
    getWeatherCondition,
    getWeatherIcon,
    getWeatherTheme,
    getWeatherAccessory
} from './weather-codes.js';

// All DOM references stay in one object, so the rest of the file is easier to read.
export const elements = {
    searchForm: document.getElementById('search-form'),
    searchLabel: document.getElementById('search-label'),
    searchButton: document.getElementById('search-button'),
    cityInput: document.getElementById('city-input'),
    unitToggle: document.getElementById('unit-toggle'),
    locationButton: document.getElementById('location-button'),
    locationButtonText: document.getElementById('location-button-text'),
    languageToggle: document.getElementById('language-toggle'),
    historySection: document.getElementById('history-section'),
    historyTitle: document.getElementById('history-title'),
    historyList: document.getElementById('history-list'),
    loading: document.getElementById('loading'),
    loadingText: document.getElementById('loading-text'),
    errorMessage: document.getElementById('error-message'),
    weatherResult: document.getElementById('weather-result'),
    cityName: document.getElementById('city-name'),
    countryName: document.getElementById('country-name'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherIconBadge: document.getElementById('weather-icon-badge'),
    temperature: document.getElementById('temperature'),
    weatherCondition: document.getElementById('weather-condition'),
    windLabel: document.getElementById('wind-label'),
    windSpeed: document.getElementById('wind-speed'),
    feelsLikeLabel: document.getElementById('feels-like-label'),
    feelsLike: document.getElementById('feels-like'),
    humidityLabel: document.getElementById('humidity-label'),
    humidity: document.getElementById('humidity'),
    pressureLabel: document.getElementById('pressure-label'),
    pressure: document.getElementById('pressure'),
    precipitationLabel: document.getElementById('precipitation-label'),
    precipitation: document.getElementById('precipitation'),
    coordinatesLabel: document.getElementById('coordinates-label'),
    coordinates: document.getElementById('coordinates'),
    comfortCard: document.getElementById('comfort-card'),
    comfortLabel: document.getElementById('comfort-label'),
    comfortScore: document.getElementById('comfort-score'),
    comfortMessage: document.getElementById('comfort-message'),
    forecastSection: document.getElementById('forecast-section'),
    forecastEyebrow: document.getElementById('forecast-eyebrow'),
    forecastTitle: document.getElementById('forecast-title'),
    forecastNote: document.getElementById('forecast-note'),
    forecastList: document.getElementById('forecast-list'),
    mapEyebrow: document.getElementById('map-eyebrow'),
    mapTitle: document.getElementById('map-title'),
    mapNote: document.getElementById('map-note'),
    mapHintMarker: document.getElementById('map-hint-marker'),
    mapHintClick: document.getElementById('map-hint-click'),
    mapStatus: document.getElementById('map-status')
};

// All interface text is stored here for the BG/EN switch.
// This makes the language change easier than editing text in many places.
const translations = {
    bg: {
        searchLabel: 'Въведи град:',
        searchPlaceholder: 'Напр. Sofia, London, Paris',
        searchButton: 'Търси',
        unitToF: 'Покажи във °F',
        unitToC: 'Покажи във °C',
        locationButton: 'Моята локация',
        languageButton: 'EN',
        historyTitle: 'Последни търсения:',
        loading: 'Зареждане на данни...',
        wind: 'Вятър',
        feelsLike: 'Усеща се като',
        humidity: 'Влажност',
        pressure: 'Налягане',
        precipitation: 'Валеж сега',
        coordinates: 'Координати',
        comfort: 'Комфорт индекс',
        comfortGreat: 'Много приятно време за излизане.',
        comfortGood: 'Добро време, но провери детайлите.',
        comfortOkay: 'Става, но не е най-комфортното време.',
        comfortBad: 'Не е много комфортно навън.',
        forecastEyebrow: 'Прогноза',
        forecastTitle: 'Следващи 5 дни',
        forecastNote: 'min / max',
        mapEyebrow: 'Карта',
        mapTitle: 'Избери място',
        mapNote: 'клик върху картата',
        mapHintMarker: 'Цветен маркер според времето',
        mapHintClick: 'Кликни върху картата',
        mapReady: 'Картата е готова. Избери точка или потърси град.',
        cityLoading: 'Зареждане на данни за избрания град...',
        mapLoading: 'Зареждане на времето за избраната точка...',
        locationLoading: 'Опитвам се да намеря твоята локация...',
        mapShows: 'Картата показва:',
        mapSelected: 'Избрано място от картата:',
        mapFallback: 'Избрана е точка от картата. Времето е заредено по координати.',
        searchFailed: 'Не успяхме да намерим мястото.',
        mapFailed: 'Не успяхме да заредим времето за тази точка.',
        locationUnsupported: 'Браузърът не поддържа геолокация.',
        locationDenied: 'Достъпът до локацията беше отказан.',
        errorEmpty: 'Моля, въведи име на град.',
        cityNotFound: 'Градът не е намерен. Провери дали е написан правилно.',
        citySearchProblem: 'Проблем при търсенето на града.',
        weatherLoadProblem: 'Проблем при зареждането на времето.',
        noWeatherData: 'Няма налични данни за времето.'
    },
    en: {
        searchLabel: 'Enter city:',
        searchPlaceholder: 'Example: Sofia, London, Paris',
        searchButton: 'Search',
        unitToF: 'Show in °F',
        unitToC: 'Show in °C',
        locationButton: 'My location',
        languageButton: 'BG',
        historyTitle: 'Recent searches:',
        loading: 'Loading weather data...',
        wind: 'Wind',
        feelsLike: 'Feels like',
        humidity: 'Humidity',
        pressure: 'Pressure',
        precipitation: 'Rain now',
        coordinates: 'Coordinates',
        comfort: 'Comfort score',
        comfortGreat: 'Very comfortable weather for going outside.',
        comfortGood: 'Good weather, but check the details.',
        comfortOkay: 'Acceptable, but not the most comfortable weather.',
        comfortBad: 'Not very comfortable outside.',
        forecastEyebrow: 'Forecast',
        forecastTitle: 'Next 5 days',
        forecastNote: 'min / max',
        mapEyebrow: 'Map',
        mapTitle: 'Choose a place',
        mapNote: 'click on the map',
        mapHintMarker: 'Colored marker by weather',
        mapHintClick: 'Click on the map',
        mapReady: 'The map is ready. Choose a point or search for a city.',
        cityLoading: 'Loading data for the selected city...',
        mapLoading: 'Loading weather for the selected point...',
        locationLoading: 'Trying to find your location...',
        mapShows: 'Map shows:',
        mapSelected: 'Selected place from map:',
        mapFallback: 'A map point was selected. Weather is loaded by coordinates.',
        searchFailed: 'We could not find this place.',
        mapFailed: 'We could not load weather for this point.',
        locationUnsupported: 'Geolocation is not supported by this browser.',
        locationDenied: 'Location access was denied.',
        errorEmpty: 'Please enter a city name.',
        cityNotFound: 'City not found. Check if it is written correctly.',
        citySearchProblem: 'Problem while searching for the city.',
        weatherLoadProblem: 'Problem while loading the weather.',
        noWeatherData: 'No weather data is available.'
    }
};

// The selected language is saved, so the app remembers it after refresh.
let currentLanguage = localStorage.getItem('weatherLanguage') || 'bg';

// These variables keep the last result, so buttons can rerender the screen.
let lastWeather = null;
let lastPlace = null;
let lastForecastDaily = null;
let currentUnit = 'C';

applyLanguage();

export function getCurrentLanguage() {
    return currentLanguage;
}

// app.js uses this to keep the map popup in the same unit as the page.
export function getCurrentUnit() {
    return currentUnit;
}

// Returns a translated text by key. If a key is missing, the key itself is returned.
export function getText(key) {
    return translations[currentLanguage][key] || key;
}

// Changes BG/EN and rerenders visible weather text.
export function toggleLanguage() {
    currentLanguage = currentLanguage === 'bg' ? 'en' : 'bg';
    localStorage.setItem('weatherLanguage', currentLanguage);
    applyLanguage();
    rerenderVisibleWeather();
    return currentLanguage;
}

// Reads the city input and removes spaces before/after the text.
export function getCityInputValue() {
    return elements.cityInput.value.trim();
}

export function setCityInputValue(city) {
    elements.cityInput.value = city;
}

/**
 * Displays current weather information in the main weather card.
 * @param {object} place - Place data from geocoding or reverse geocoding.
 * @param {object} weather - Normalized current weather data.
 */
export function displayWeather(place, weather) {
    hideError();

    lastPlace = place;
    lastWeather = weather;
    currentUnit = 'C';

    const theme = getWeatherTheme(weather.weathercode, weather.is_day);

    elements.cityName.textContent = place.name;
    elements.countryName.textContent = place.country_code || '';
    elements.weatherCondition.textContent = getWeatherCondition(weather.weathercode, currentLanguage);
    elements.windSpeed.textContent = `${Math.round(weather.windspeed)} km/h`;
    elements.feelsLike.textContent = formatTemperature(weather.apparentTemperature);
    elements.humidity.textContent = `${Math.round(weather.humidity)}%`;
    elements.pressure.textContent = `${Math.round(weather.pressure)} hPa`;
    elements.precipitation.textContent = `${weather.precipitation ?? 0} mm`;
    elements.coordinates.textContent = `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;
    elements.weatherIcon.className = `fa-solid ${getWeatherIcon(weather.weathercode)} weather-icon`;
    elements.weatherIconBadge.className = `weather-icon-badge ${theme} ${getWeatherAccessory(weather.weathercode)}`;

    setWeatherTheme(theme);
    updateTemperatureDisplay();
    updateComfortCard(weather);
    elements.weatherResult.classList.remove('hidden');
}

/**
 * Stores daily forecast data and renders the forecast cards.
 */
export function renderForecast(dailyData) {
    lastForecastDaily = dailyData;
    renderForecastCards();
}

/**
 * Switches between Celsius and Fahrenheit without another API request.
 */
export function toggleTemperatureUnit() {
    if (!lastWeather) {
        return;
    }

    currentUnit = currentUnit === 'C' ? 'F' : 'C';
    updateTemperatureDisplay();
    renderForecastCards();

    if (lastWeather.apparentTemperature !== undefined) {
        elements.feelsLike.textContent = formatTemperature(lastWeather.apparentTemperature);
    }
}

/**
 * Renders the latest searched cities as clickable buttons.
 */
export function renderSearchHistory(history, onSelectCity) {
    elements.historyList.innerHTML = '';

    if (history.length === 0) {
        elements.historySection.classList.add('hidden');
        return;
    }

    history.forEach((city) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'history-button';
        button.textContent = city;
        button.addEventListener('click', () => onSelectCity(city));

        elements.historyList.appendChild(button);
    });

    elements.historySection.classList.remove('hidden');
}

// Shows the loading message during API requests.
export function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
}

export function hideLoading() {
    elements.loading.classList.add('hidden');
}

/**
 * Shows an error message. If the value is a translation key, it is translated first.
 */
export function showError(messageOrKey) {
    elements.errorMessage.textContent = getText(messageOrKey) !== messageOrKey ? getText(messageOrKey) : messageOrKey;
    elements.errorMessage.classList.remove('hidden');
    elements.weatherResult.classList.add('hidden');
    elements.forecastSection.classList.add('hidden');
}

export function setMapStatus(message) {
    elements.mapStatus.textContent = message;
}

export function hideError() {
    elements.errorMessage.classList.add('hidden');
}

// Applies the chosen language to every static label in the interface.
function applyLanguage() {
    const text = translations[currentLanguage];

    document.documentElement.lang = currentLanguage;
    elements.searchLabel.textContent = text.searchLabel;
    elements.searchButton.textContent = text.searchButton;
    elements.cityInput.placeholder = text.searchPlaceholder;
    elements.locationButtonText.textContent = text.locationButton;
    elements.languageToggle.textContent = text.languageButton;
    elements.historyTitle.textContent = text.historyTitle;
    elements.loadingText.textContent = text.loading;
    elements.windLabel.textContent = text.wind;
    elements.feelsLikeLabel.textContent = text.feelsLike;
    elements.humidityLabel.textContent = text.humidity;
    elements.pressureLabel.textContent = text.pressure;
    elements.precipitationLabel.textContent = text.precipitation;
    elements.coordinatesLabel.textContent = text.coordinates;
    elements.comfortLabel.textContent = text.comfort;
    elements.forecastEyebrow.textContent = text.forecastEyebrow;
    elements.forecastTitle.textContent = text.forecastTitle;
    elements.forecastNote.textContent = text.forecastNote;
    elements.mapEyebrow.textContent = text.mapEyebrow;
    elements.mapTitle.textContent = text.mapTitle;
    elements.mapNote.textContent = text.mapNote;
    elements.mapHintMarker.textContent = text.mapHintMarker;
    elements.mapHintClick.textContent = text.mapHintClick;

    if (!lastWeather) {
        updateTemperatureDisplay();
        setMapStatus(text.mapReady);
    }
}

// Renders weather again after language change without losing the chosen unit.
function rerenderVisibleWeather() {
    if (lastPlace && lastWeather) {
        const oldUnit = currentUnit;
        displayWeather(lastPlace, lastWeather);
        currentUnit = oldUnit;
        updateTemperatureDisplay();
        renderForecastCards();
    }
}

/**
 * Builds the 5 forecast cards from the daily Open-Meteo arrays.
 */
function renderForecastCards() {
    elements.forecastList.innerHTML = '';

    if (!lastForecastDaily || !lastForecastDaily.time) {
        elements.forecastSection.classList.add('hidden');
        return;
    }

    const days = lastForecastDaily.time.slice(1, 6);

    days.forEach((date, index) => {
        const realIndex = index + 1;
        const weatherCode = lastForecastDaily.weathercode[realIndex];
        const theme = getWeatherTheme(weatherCode, 1);
        const card = document.createElement('article');
        const dayName = formatDayName(date);
        const maxTemp = lastForecastDaily.temperature_2m_max[realIndex];
        const minTemp = lastForecastDaily.temperature_2m_min[realIndex];
        const wind = Math.round(lastForecastDaily.windspeed_10m_max[realIndex]);
        const rainChance = lastForecastDaily.precipitation_probability_max?.[realIndex] ?? 0;
        const uvIndex = Math.round(lastForecastDaily.uv_index_max?.[realIndex] ?? 0);

        card.className = `forecast-card ${theme}`;
        card.innerHTML = `
            <div class="forecast-day">
                <strong>${dayName}</strong>
                <span>${formatShortDate(date)}</span>
            </div>
            <div class="forecast-icon-badge ${theme} ${getWeatherAccessory(weatherCode)}">
                <i class="fa-solid ${getWeatherIcon(weatherCode)}"></i>
            </div>
            <div class="forecast-info">
                <p>${getWeatherCondition(weatherCode, currentLanguage)}</p>
                <strong>${formatTemperature(minTemp)} / ${formatTemperature(maxTemp)}</strong>
            </div>
            <div class="forecast-extra">
                <span><i class="fa-solid fa-wind"></i> ${wind} km/h</span>
                <span><i class="fa-solid fa-droplet"></i> ${rainChance}%</span>
                <span><i class="fa-solid fa-sun"></i> UV ${uvIndex}</span>
            </div>
        `;

        elements.forecastList.appendChild(card);
    });

    elements.forecastSection.classList.remove('hidden');
}

// Updates the main temperature and the unit button text.
function updateTemperatureDisplay() {
    if (!lastWeather) {
        elements.temperature.textContent = '--°C';
        elements.unitToggle.textContent = getText('unitToF');
        return;
    }

    elements.temperature.textContent = formatTemperature(lastWeather.temperature);
    elements.unitToggle.textContent = currentUnit === 'C' ? getText('unitToF') : getText('unitToC');
}

// Converts Celsius to the current unit used by the user.
function formatTemperature(celsius) {
    if (currentUnit === 'C') {
        return `${Math.round(celsius)}°C`;
    }

    return `${Math.round(celsius * 9 / 5 + 32)}°F`;
}

// Updates the extra creative feature: a simple comfort score.
function updateComfortCard(weather) {
    const result = calculateComfort(weather);

    elements.comfortScore.textContent = `${result.score}/100`;
    elements.comfortMessage.textContent = getText(result.messageKey);
    elements.comfortCard.className = `comfort-card comfort-${result.level}`;
}

/**
 * Calculates a simple comfort score from temperature, wind, rain and humidity.
 */
function calculateComfort(weather) {
    let score = 100;

    // The score is simple on purpose: temperature, wind, rain and humidity reduce comfort.
    score -= Math.abs(weather.temperature - 22) * 2;
    score -= Math.max(0, weather.windspeed - 12) * 1.2;
    score -= (weather.precipitation || 0) * 18;
    score -= Math.max(0, weather.humidity - 70) * 0.4;

    score = Math.max(0, Math.min(100, Math.round(score)));

    if (score >= 80) return { score, level: 'great', messageKey: 'comfortGreat' };
    if (score >= 60) return { score, level: 'good', messageKey: 'comfortGood' };
    if (score >= 40) return { score, level: 'okay', messageKey: 'comfortOkay' };
    return { score, level: 'bad', messageKey: 'comfortBad' };
}

// Changes the background class according to the current weather.
function setWeatherTheme(themeName) {
    const themeClasses = [
        'weather-clear',
        'weather-cloudy',
        'weather-rainy',
        'weather-snowy',
        'weather-stormy',
        'weather-foggy',
        'weather-night'
    ];

    document.body.classList.remove(...themeClasses);
    document.body.classList.add(themeName);
}

// Formats the weekday in the selected language.
function formatDayName(dateString) {
    const locale = currentLanguage === 'bg' ? 'bg-BG' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, { weekday: 'short' });
}

function formatShortDate(dateString) {
    const locale = currentLanguage === 'bg' ? 'bg-BG' : 'en-US';

    return new Date(dateString).toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit'
    });
}
