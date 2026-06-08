/* =========================================================
   App module
   Това е главният файл. Той свързва UI функциите с API функциите.
   ========================================================= */

import { fetchWeatherByCity } from './api.js';
import {
    elements,
    getCityInputValue,
    displayWeather,
    showLoading,
    hideLoading,
    showError
} from './ui.js';

// Submit event на формата за търсене.
elements.searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const city = getCityInputValue();

    if (city === '') {
        showError('Моля, въведи име на град.');
        return;
    }

    await loadWeather(city);
});

async function loadWeather(city) {
    showLoading();

    try {
        const weatherData = await fetchWeatherByCity(city);
        displayWeather(weatherData.place, weatherData.weather);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}
