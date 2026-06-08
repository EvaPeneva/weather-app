/* =========================================================
   UI module
   Тук държим DOM елементите и функциите за показване на данни.
   Тук няма fetch заявки.
   ========================================================= */

import { getWeatherCondition, getWeatherIcon } from './weather-codes.js';

export const elements = {
    searchForm: document.getElementById('search-form'),
    cityInput: document.getElementById('city-input'),
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

export function getCityInputValue() {
    return elements.cityInput.value.trim();
}

export function displayWeather(place, weather) {
    hideError();

    elements.cityName.textContent = place.name;
    elements.countryName.textContent = place.country_code || '';
    elements.temperature.textContent = `${Math.round(weather.temperature)}°C`;
    elements.weatherCondition.textContent = getWeatherCondition(weather.weathercode);
    elements.windSpeed.textContent = `${weather.windspeed} km/h`;
    elements.coordinates.textContent = `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;

    elements.weatherIcon.className = `fa-solid ${getWeatherIcon(weather.weathercode)} weather-icon`;
    elements.weatherResult.classList.remove('hidden');
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
