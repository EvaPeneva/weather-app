/* =========================================================
   UI module
   Handles DOM elements and screen updates. No fetch requests here.
   ========================================================= */

import { getWeatherCondition, getWeatherIcon, getWeatherTheme } from './weather-codes.js';

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
    temperature: document.getElementById('temperature'),
    weatherCondition: document.getElementById('weather-condition'),
    windSpeed: document.getElementById('wind-speed'),
    coordinates: document.getElementById('coordinates')
};

let lastTemperatureC = null;
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

    elements.cityName.textContent = place.name;
    elements.countryName.textContent = place.country_code || '';
    elements.weatherCondition.textContent = getWeatherCondition(weather.weathercode);
    elements.windSpeed.textContent = `${weather.windspeed} km/h`;
    elements.coordinates.textContent = `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;
    elements.weatherIcon.className = `fa-solid ${getWeatherIcon(weather.weathercode)} weather-icon`;
    setWeatherTheme(getWeatherTheme(weather.weathercode, weather.is_day));

    updateTemperatureDisplay();
    elements.weatherResult.classList.remove('hidden');
}

export function toggleTemperatureUnit() {
    if (lastTemperatureC === null) {
        return;
    }

    currentUnit = currentUnit === 'C' ? 'F' : 'C';
    updateTemperatureDisplay();
}

function updateTemperatureDisplay() {
    if (lastTemperatureC === null) {
        elements.temperature.textContent = '--°C';
        return;
    }

    if (currentUnit === 'C') {
        elements.temperature.textContent = `${Math.round(lastTemperatureC)}°C`;
        elements.unitToggle.textContent = 'Покажи във °F';
        return;
    }

    const fahrenheit = lastTemperatureC * 9 / 5 + 32;
    elements.temperature.textContent = `${Math.round(fahrenheit)}°F`;
    elements.unitToggle.textContent = 'Покажи във °C';
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
}

export function hideError() {
    elements.errorMessage.classList.add('hidden');
}
