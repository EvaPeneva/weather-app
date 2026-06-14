/* =========================================================
   API module
   Contains only requests to the Open-Meteo APIs.
   ========================================================= */

export async function fetchWeatherByCity(city) {
    const place = await fetchCityCoordinates(city);
    const weather = await fetchCurrentWeather(place.latitude, place.longitude);

    return {
        place,
        weather
    };
}

async function fetchCityCoordinates(city) {
    const languages = ['en', 'bg'];
    let lastError = null;

    for (const language of languages) {
        try {
            const place = await searchCity(city, language);
            return place;
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

    return data.results[0];
}

async function fetchCurrentWeather(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
        throw new Error('Проблем при зареждането на времето.');
    }

    const data = await response.json();

    if (!data.current_weather) {
        throw new Error('Няма налични данни за времето.');
    }

    return data.current_weather;
}
