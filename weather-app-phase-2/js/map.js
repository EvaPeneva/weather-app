/* =========================================================
   Map module
   Handles Leaflet map setup, map clicks, marker styling and popup text.
   This file does not fetch weather data. It only shows information on the map.
   ========================================================= */

import { getWeatherCondition, getWeatherIcon, getWeatherTheme } from './weather-codes.js';

let map = null;
let marker = null;

// Creates the Leaflet map and connects click events to app.js.
export function initWeatherMap(onMapClick) {
    if (!window.L) {
        return;
    }

    // The map starts centered over Bulgaria, but no city is selected yet.
    map = L.map('weather-map', {
        zoomControl: true
    }).setView([42.7, 25.2], 6);

    // OpenStreetMap tiles are free and work well for a school project.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Leaflet gives us coordinates every time the user clicks on the map.
    map.on('click', (event) => {
        const { lat, lng } = event.latlng;
        onMapClick(lat, lng);
    });
}

/**
 * Moves the map marker and updates the popup after search, map click or unit change.
 */
export function updateMapMarker(latitude, longitude, label, weather = null, language = 'bg', unit = 'C') {
    if (!map) {
        return;
    }

    const position = [latitude, longitude];
    const icon = createWeatherMarkerIcon(weather);

    if (!marker) {
        marker = L.marker(position, { icon }).addTo(map);
    } else {
        marker.setLatLng(position);
        marker.setIcon(icon);
    }

    // The popup also receives the unit, so it changes when °C/°F is toggled.
    marker.bindPopup(createPopupContent(label, weather, language, unit)).openPopup();
    map.setView(position, 9);
}

/**
 * Creates a custom marker icon that matches the current weather.
 */
function createWeatherMarkerIcon(weather) {
    const theme = weather ? getWeatherTheme(weather.weathercode, weather.is_day) : 'weather-cloudy';
    const iconClass = weather ? getWeatherIcon(weather.weathercode) : 'fa-location-dot';

    return L.divIcon({
        className: `weather-map-marker ${theme}`,
        html: `<i class="fa-solid ${iconClass}"></i>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -20]
    });
}

/**
 * Creates the marker popup text and keeps its temperature unit synced with the page.
 */
function createPopupContent(label, weather, language, unit) {
    const fallbackLabel = language === 'bg' ? 'Избрано място' : 'Selected place';
    const safeLabel = escapeHtml(label || fallbackLabel);

    if (!weather) {
        return `<strong>${safeLabel}</strong>`;
    }

    const temperature = formatMapTemperature(weather.temperature, unit);
    const condition = getWeatherCondition(weather.weathercode, language);

    return `
        <div class="map-popup">
            <strong>${safeLabel}</strong>
            <span>${temperature} · ${condition}</span>
        </div>
    `;
}

// Keeps the popup temperature in sync with the main unit button.
function formatMapTemperature(celsius, unit) {
    if (unit === 'F') {
        return `${Math.round(celsius * 9 / 5 + 32)}°F`;
    }

    return `${Math.round(celsius)}°C`;
}

// Escapes user/API text before putting it in the popup HTML.
function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
