/* =========================================================
   UI module
   Handles DOM elements and screen updates. No fetch requests here.
   ========================================================= */

import {
    getWeatherCondition,
    getWeatherIcon,
    getWeatherTheme,
    getWeatherAccessory
} from './weather-codes.js';

export const elements = {
    searchForm: document.getElementById('search-form'),
    cityInput: document.getElementById('city-input'),
    unitToggle: document.getElementById('unit-toggle'),
    historySection: document.getElementById('history-section'),
    historyList: document.getElementById('history-list'),
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('error-message'),
    weatherResult: document.getElementById('weather-result'),
    cityName: document.getElementById('city-name'),
    countryName: document.getElementById('country-name'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherIconBadge: document.getElementById('weather-icon-badge'),
    temperature: document.getElementById('temperature'),
    weatherCondition: document.getElementById('weather-condition'),
    windSpeed: document.getElementById('wind-speed'),
    coordinates: document.getElementById('coordinates'),
    forecastSection: document.getElementById('forecast-section'),
    forecastList: document.getElementById('forecast-list'),
    mapStatus: document.getElementById('map-status')
};

let lastTemperatureC = null;
let lastForecastDaily = null;
let currentUnit = 'C';

export function getCityInputValue() {
    return elements.cityInput.value.trim();
}

export function setCityInputValue(city) {
    elements.cityInput.value = city;
}

export function displayWeather(place, weather) {
    hideError();

    lastTemperatureC = weather.temperature;
    currentUnit = 'C';

    const theme = getWeatherTheme(weather.weathercode, weather.is_day);

    elements.cityName.textContent = place.name;
    elements.countryName.textContent = place.country_code || '';
    elements.weatherCondition.textContent = getWeatherCondition(weather.weathercode);
    elements.windSpeed.textContent = `${weather.windspeed} km/h`;
    elements.coordinates.textContent = `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;
    elements.weatherIcon.className = `fa-solid ${getWeatherIcon(weather.weathercode)} weather-icon`;
    elements.weatherIconBadge.className = `weather-icon-badge ${theme} ${getWeatherAccessory(weather.weathercode)}`;

    setWeatherTheme(theme);
    updateTemperatureDisplay();
    elements.weatherResult.classList.remove('hidden');
}

export function renderForecast(dailyData) {
    lastForecastDaily = dailyData;
    renderForecastCards();
}

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
                <p>${getWeatherCondition(weatherCode)}</p>
                <strong>${formatTemperature(minTemp)} / ${formatTemperature(maxTemp)}</strong>
            </div>
            <div class="forecast-extra">
                <span><i class="fa-solid fa-wind"></i> ${wind} km/h</span>
                <span><i class="fa-solid fa-droplet"></i> ${rainChance}%</span>
            </div>
        `;

        elements.forecastList.appendChild(card);
    });

    elements.forecastSection.classList.remove('hidden');
}

export function toggleTemperatureUnit() {
    if (lastTemperatureC === null) {
        return;
    }

    currentUnit = currentUnit === 'C' ? 'F' : 'C';
    updateTemperatureDisplay();
    renderForecastCards();
}

function updateTemperatureDisplay() {
    if (lastTemperatureC === null) {
        elements.temperature.textContent = '--°C';
        return;
    }

    elements.temperature.textContent = formatTemperature(lastTemperatureC);
    elements.unitToggle.textContent = currentUnit === 'C' ? 'Покажи във °F' : 'Покажи във °C';
}

function formatTemperature(celsius) {
    if (currentUnit === 'C') {
        return `${Math.round(celsius)}°C`;
    }

    return `${Math.round(celsius * 9 / 5 + 32)}°F`;
}

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

function formatDayName(dateString) {
    return new Date(dateString).toLocaleDateString('bg-BG', { weekday: 'short' });
}

function formatShortDate(dateString) {
    return new Date(dateString).toLocaleDateString('bg-BG', {
        day: '2-digit',
        month: '2-digit'
    });
}

export function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
}

export function hideLoading() {
    elements.loading.classList.add('hidden');
}

export function showError(message) {
    elements.errorMessage.textContent = message;
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
