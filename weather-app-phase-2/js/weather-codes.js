/* =========================================================
   Weather codes module
   Converts Open-Meteo weather codes to text, icons, themes and small decorations.
   ========================================================= */

// Text descriptions for every Open-Meteo weather code used in the app.
const weatherConditions = {
    bg: {
        0: 'Ясно небе',
        1: 'Предимно ясно',
        2: 'Разкъсана облачност',
        3: 'Облачно',
        45: 'Мъгла',
        48: 'Мъгла със скреж',
        51: 'Слаб ръмеж',
        53: 'Умерен ръмеж',
        55: 'Силен ръмеж',
        56: 'Слаб леден ръмеж',
        57: 'Силен леден ръмеж',
        61: 'Слаб дъжд',
        63: 'Умерен дъжд',
        65: 'Силен дъжд',
        66: 'Слаб леден дъжд',
        67: 'Силен леден дъжд',
        71: 'Слаб снеговалеж',
        73: 'Умерен снеговалеж',
        75: 'Силен снеговалеж',
        77: 'Снежни зърна',
        80: 'Слаби превалявания',
        81: 'Умерени превалявания',
        82: 'Силни превалявания',
        85: 'Слаб сняг',
        86: 'Силен сняг',
        95: 'Гръмотевична буря',
        96: 'Буря със слаба градушка',
        99: 'Буря със силна градушка'
    },
    en: {
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
    }
};

// Font Awesome icon classes matched to the same weather codes.
const weatherIcons = {
    0: 'fa-sun',
    1: 'fa-sun',
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

/**
 * Returns the weather description in the selected language.
 */
export function getWeatherCondition(code, language = 'bg') {
    const dictionary = weatherConditions[language] || weatherConditions.bg;
    return dictionary[code] || dictionary[3];
}

/**
 * Returns a Font Awesome icon class for an Open-Meteo weather code.
 */
export function getWeatherIcon(code) {
    return weatherIcons[code] || 'fa-cloud';
}

/**
 * Chooses a visual theme used by the background, icons and forecast cards.
 */
export function getWeatherTheme(code, isDay) {
    if (isDay === 0) {
        return 'weather-night';
    }

    if (code === 0 || code === 1) return 'weather-clear';
    if (code === 2 || code === 3) return 'weather-cloudy';
    if (code === 45 || code === 48) return 'weather-foggy';
    if ((code >= 51 && code <= 67) || code === 80 || code === 81 || code === 82) return 'weather-rainy';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'weather-snowy';
    if (code === 95 || code === 96 || code === 99) return 'weather-stormy';

    return 'weather-cloudy';
}

/**
 * Returns a small decoration class for the icon badge.
 */
export function getWeatherAccessory(code) {
    if (code === 0 || code === 1) return 'accessory-sun';
    if (code === 2 || code === 3) return 'accessory-cloud';
    if (code === 45 || code === 48) return 'accessory-fog';
    if ((code >= 51 && code <= 67) || code === 80 || code === 81 || code === 82) return 'accessory-rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'accessory-snow';
    if (code === 95 || code === 96 || code === 99) return 'accessory-storm';

    return 'accessory-cloud';
}
