/* =========================================================
   App module
   Connects UI events with API functions and localStorage history.
   ========================================================= */

import { fetchWeatherByCity } from './api.js';
import {
    elements,
    getCityInputValue,
    setCityInputValue,
    displayWeather,
    toggleTemperatureUnit,
    renderSearchHistory,
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

    await loadWeather(city, true);
});

elements.unitToggle.addEventListener('click', function () {
    toggleTemperatureUnit();
});

renderSearchHistory(getSearchHistory(), handleHistoryClick);

async function loadWeather(city, shouldSaveHistory) {
    showLoading();

    try {
        const weatherData = await fetchWeatherByCity(city);
        displayWeather(weatherData.place, weatherData.weather);

        if (shouldSaveHistory) {
            saveToHistory(city);
        }
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function handleHistoryClick(city) {
    setCityInputValue(city);
    await loadWeather(city, true);
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
