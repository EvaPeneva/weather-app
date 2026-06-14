/* =========================================================
   API module
   Contains requests to Open-Meteo and reverse geocoding.
   ========================================================= */

export async function fetchWeatherByCity(city) {
    const place = await fetchCityCoordinates(city);
    const weatherData = await fetchWeatherByCoordinates(place.latitude, place.longitude);

    return {
        place,
        weather: weatherData.current_weather,
        daily: weatherData.daily
    };
}

export async function fetchWeatherFromMap(latitude, longitude) {
    const place = await reverseGeocode(latitude, longitude);
    const weatherData = await fetchWeatherByCoordinates(latitude, longitude);

    return {
        place,
        weather: weatherData.current_weather,
        daily: weatherData.daily
    };
}

async function fetchCityCoordinates(city) {
    const languages = ['en', 'bg'];
    let lastError = null;

    for (const language of languages) {
        try {
            return await searchCity(city, language);
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Градът не е намерен. Провери дали е написан правилно.');
}

async function searchCity(city, language) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=${language}&format=json`;
    const response = await fetch(geoUrl);

    if (!response.ok) {
        throw new Error('Проблем при търсенето на града.');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error('Градът не е намерен. Провери дали е написан правилно.');
    }

    return {
        ...data.results[0],
        isMapFallback: false
    };
}

async function fetchWeatherByCoordinates(latitude, longitude) {
    const dailyParams = [
        'weathercode',
        'temperature_2m_max',
        'temperature_2m_min',
        'windspeed_10m_max',
        'precipitation_probability_max'
    ].join(',');

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=${dailyParams}&forecast_days=6&timezone=auto`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
        throw new Error('Проблем при зареждането на времето.');
    }

    const data = await response.json();

    if (!data.current_weather || !data.daily) {
        throw new Error('Няма налични данни за времето.');
    }

    return data;
}

async function reverseGeocode(latitude, longitude) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=bg`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Reverse geocoding failed.');
        }

        const data = await response.json();
        const address = data.address || {};
        const name = getReadablePlaceName(address, data, latitude, longitude);

        return {
            name,
            country_code: address.country_code ? address.country_code.toUpperCase() : '',
            latitude,
            longitude,
            isMapFallback: name.startsWith('Точка')
        };
    } catch {
        return createFallbackPlace(latitude, longitude);
    }
}

function getReadablePlaceName(address, data, latitude, longitude) {
    const cityLikeName =
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        address.municipality ||
        address.county ||
        address.state_district ||
        data.name;

    if (cityLikeName) {
        return cleanPlaceName(cityLikeName);
    }

    return createFallbackPlace(latitude, longitude).name;
}

function cleanPlaceName(name) {
    return String(name)
        .replace('Община ', '')
        .replace('Municipality of ', '')
        .trim();
}

function createFallbackPlace(latitude, longitude) {
    return {
        name: `Точка ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        country_code: '',
        latitude,
        longitude,
        isMapFallback: true
    };
}
