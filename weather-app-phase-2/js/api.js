/* =========================================================
   API module
   Contains all requests to Open-Meteo and Nominatim.
   The rest of the project does not call fetch() directly.
   ========================================================= */

const OPEN_METEO_SEARCH_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Loads weather by city name.
 * First it finds city coordinates, then it loads weather for these coordinates.
 * @param {string} city - City name typed by the user.
 * @param {string} language - Current app language.
 * @returns {Promise<object>} Place, current weather and daily forecast.
 */
export async function fetchWeatherByCity(city, language = 'bg') {
    const place = await fetchCityCoordinates(city, language);
    const weatherData = await fetchWeatherByCoordinates(place.latitude, place.longitude);

    return buildWeatherResult(place, weatherData);
}

/**
 * Loads weather by coordinates from the map or browser geolocation.
 * Reverse geocoding is used to show a readable place name.
 * @param {number} latitude - Selected latitude.
 * @param {number} longitude - Selected longitude.
 * @param {string} language - Current app language.
 * @returns {Promise<object>} Place, current weather and daily forecast.
 */
export async function fetchWeatherFromMap(latitude, longitude, language = 'bg') {
    const place = await reverseGeocode(latitude, longitude, language);
    const weatherData = await fetchWeatherByCoordinates(latitude, longitude);

    return buildWeatherResult(place, weatherData);
}

/**
 * Tries to find coordinates in both BG and EN, so the search works with Cyrillic and Latin input.
 */
async function fetchCityCoordinates(city, language) {
    const languagesToTry = language === 'bg' ? ['bg', 'en'] : ['en', 'bg'];
    let lastError = null;

    // Trying two languages makes the search friendlier for both Cyrillic and Latin input.
    for (const currentLanguage of languagesToTry) {
        try {
            return await searchCity(city, currentLanguage);
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('cityNotFound');
}

// Sends one request to the Open-Meteo Geocoding API.
async function searchCity(city, language) {
    const url = new URL(OPEN_METEO_SEARCH_URL);
    url.searchParams.set('name', city);
    url.searchParams.set('count', '1');
    url.searchParams.set('language', language);
    url.searchParams.set('format', 'json');

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('citySearchProblem');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error('cityNotFound');
    }

    return {
        ...data.results[0],
        isMapFallback: false
    };
}

/**
 * Requests current weather and daily forecast from Open-Meteo.
 */
async function fetchWeatherByCoordinates(latitude, longitude) {
    // Current data is used for the main weather card.
    const currentParams = [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'pressure_msl',
        'wind_speed_10m',
        'is_day'
    ].join(',');

    // Daily data is used for the 5-day forecast cards.
    const dailyParams = [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'wind_speed_10m_max',
        'precipitation_probability_max',
        'uv_index_max',
        'sunrise',
        'sunset'
    ].join(',');

    const url = new URL(OPEN_METEO_FORECAST_URL);
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('current', currentParams);
    url.searchParams.set('daily', dailyParams);
    url.searchParams.set('forecast_days', '6');
    url.searchParams.set('timezone', 'auto');

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('weatherLoadProblem');
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
        throw new Error('noWeatherData');
    }

    return data;
}

/**
 * Converts map coordinates into a readable place name with Nominatim.
 */
async function reverseGeocode(latitude, longitude, language) {
    try {
        const url = new URL(NOMINATIM_REVERSE_URL);
        url.searchParams.set('format', 'jsonv2');
        url.searchParams.set('lat', latitude);
        url.searchParams.set('lon', longitude);
        url.searchParams.set('zoom', '10');
        url.searchParams.set('addressdetails', '1');
        url.searchParams.set('accept-language', language);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('reverseGeocodingProblem');
        }

        const data = await response.json();
        const address = data.address || {};
        const name = getReadablePlaceName(address, data, latitude, longitude);

        return {
            name,
            country_code: address.country_code ? address.country_code.toUpperCase() : '',
            latitude,
            longitude,
            isMapFallback: name.startsWith('Point') || name.startsWith('Точка')
        };
    } catch {
        return createFallbackPlace(latitude, longitude, language);
    }
}

// Chooses the most useful name from the reverse geocoding response.
function getReadablePlaceName(address, data, latitude, longitude) {
    const cityLikeName =
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        address.municipality ||
        address.county ||
        data.name;

    if (cityLikeName) {
        return cleanPlaceName(cityLikeName);
    }

    return createFallbackPlace(latitude, longitude, 'en').name;
}

// Removes words that make place names look too long or strange.
function cleanPlaceName(name) {
    return String(name)
        .replace('Община ', '')
        .replace('Municipality of ', '')
        .trim();
}

// If no city name is found, the app still shows weather for the coordinates.
function createFallbackPlace(latitude, longitude, language) {
    const label = language === 'bg' ? 'Точка' : 'Point';

    return {
        name: `${label} ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        country_code: '',
        latitude,
        longitude,
        isMapFallback: true
    };
}

// Returns one clean object that app.js can render easily.
function buildWeatherResult(place, weatherData) {
    return {
        place,
        weather: normalizeCurrentWeather(weatherData.current),
        daily: normalizeDailyWeather(weatherData.daily)
    };
}

// Converts Open-Meteo current data names to shorter project names.
function normalizeCurrentWeather(current) {
    return {
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
        pressure: current.pressure_msl,
        windspeed: current.wind_speed_10m,
        weathercode: current.weather_code,
        is_day: current.is_day
    };
}

// Keeps only the daily fields that are needed by the forecast UI.
function normalizeDailyWeather(daily) {
    return {
        time: daily.time,
        weathercode: daily.weather_code,
        temperature_2m_max: daily.temperature_2m_max,
        temperature_2m_min: daily.temperature_2m_min,
        windspeed_10m_max: daily.wind_speed_10m_max,
        precipitation_probability_max: daily.precipitation_probability_max,
        uv_index_max: daily.uv_index_max,
        sunrise: daily.sunrise,
        sunset: daily.sunset
    };
}
