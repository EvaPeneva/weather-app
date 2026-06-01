/* =========================================================
   Weather App - Phase 1
   Тук е логиката: взимаме данни от API и ги показваме в HTML.
   ========================================================= */

// 1. DOM елементи - селектираме ги по id, за да ги използваме по-късно.
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const weatherResult = document.getElementById('weather-result');

const cityNameElement = document.getElementById('city-name');
const countryNameElement = document.getElementById('country-name');
const weatherIconElement = document.getElementById('weather-icon');
const temperatureElement = document.getElementById('temperature');
const weatherConditionElement = document.getElementById('weather-condition');
const windSpeedElement = document.getElementById('wind-speed');
const coordinatesElement = document.getElementById('coordinates');

// 2. Слушател за submit събитието на формата.
searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Спира презареждането на страницата.

    const city = cityInput.value.trim();

    if (city === '') {
        showError('Моля, въведи име на град.');
        return;
    }

    fetchWeather(city);
});

// 3. Асинхронна функция, която прави две заявки към Open-Meteo.
async function fetchWeather(city) {
    showLoading();

    try {
        // Първа заявка: намираме координатите на града чрез Geocoding API.
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=bg&format=json`;
        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error('Проблем при търсенето на града.');
        }

        const geoData = await geoResponse.json();

        // Ако няма results, значи градът не е намерен.
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Градът не е намерен. Провери дали е написан правилно.');
        }

        const place = geoData.results[0];
        const latitude = place.latitude;
        const longitude = place.longitude;

        // Втора заявка: с координатите взимаме текущото време.
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error('Проблем при зареждането на времето.');
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current_weather) {
            throw new Error('Няма налични данни за времето.');
        }

        displayWeather(place, weatherData.current_weather);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// 4. Показваме данните в HTML елементите.
function displayWeather(place, weather) {
    hideError();

    cityNameElement.textContent = place.name;
    countryNameElement.textContent = place.country_code || '';
    temperatureElement.textContent = `${Math.round(weather.temperature)}°C`;
    weatherConditionElement.textContent = getWeatherCondition(weather.weathercode);
    windSpeedElement.textContent = `${weather.windspeed} km/h`;
    coordinatesElement.textContent = `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;

    weatherIconElement.className = `fa-solid ${getWeatherIcon(weather.weathercode)} weather-icon`;

    weatherResult.classList.remove('hidden');
}

// 5. Показва loading съобщението и скрива старите грешки.
function showLoading() {
    loadingElement.classList.remove('hidden');
    errorElement.classList.add('hidden');
}

// 6. Скрива loading съобщението.
function hideLoading() {
    loadingElement.classList.add('hidden');
}

// 7. Показва грешка на екрана.
function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    weatherResult.classList.add('hidden');
}

// 8. Скрива съобщението за грешка.
function hideError() {
    errorElement.classList.add('hidden');
}

// 9. Превръща weathercode от API-то в разбираем текст.
function getWeatherCondition(code) {
    const conditions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };

    return conditions[code] || 'Unknown weather';
}

// 10. Превръща weathercode в Font Awesome клас за икона.
function getWeatherIcon(code) {
    const icons = {
        0: 'fa-sun',
        1: 'fa-cloud-sun',
        2: 'fa-cloud-sun',
        3: 'fa-cloud',
        45: 'fa-smog',
        48: 'fa-smog',
        51: 'fa-cloud-rain',
        53: 'fa-cloud-rain',
        55: 'fa-cloud-rain',
        56: 'fa-cloud-rain',
        57: 'fa-cloud-rain',
        61: 'fa-cloud-showers-heavy',
        63: 'fa-cloud-showers-heavy',
        65: 'fa-cloud-showers-heavy',
        66: 'fa-cloud-showers-heavy',
        67: 'fa-cloud-showers-heavy',
        71: 'fa-snowflake',
        73: 'fa-snowflake',
        75: 'fa-snowflake',
        77: 'fa-snowflake',
        80: 'fa-cloud-rain',
        81: 'fa-cloud-rain',
        82: 'fa-cloud-rain',
        85: 'fa-snowflake',
        86: 'fa-snowflake',
        95: 'fa-cloud-bolt',
        96: 'fa-cloud-bolt',
        99: 'fa-cloud-bolt'
    };

    return icons[code] || 'fa-cloud';
}
