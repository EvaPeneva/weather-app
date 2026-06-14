/* =========================================================
   Map module
   Handles Leaflet map setup, clicks and marker updates.
   ========================================================= */

import { getWeatherCondition, getWeatherIcon, getWeatherTheme } from './weather-codes.js';

let map = null;
let marker = null;

export function initWeatherMap(onMapClick) {
    if (!window.L) {
        return;
    }

    map = L.map('weather-map', {
        zoomControl: true
    }).setView([42.7, 25.2], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    map.on('click', (event) => {
        const { lat, lng } = event.latlng;
        onMapClick(lat, lng);
    });
}

export function updateMapMarker(latitude, longitude, label, weather = null) {
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

    marker.bindPopup(createPopupContent(label, weather)).openPopup();
    map.setView(position, 9);
}

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

function createPopupContent(label, weather) {
    const safeLabel = escapeHtml(label || 'Избрано място');

    if (!weather) {
        return `<strong>${safeLabel}</strong>`;
    }

    const temperature = Math.round(weather.temperature);
    const condition = getWeatherCondition(weather.weathercode);

    return `
        <div class="map-popup">
            <strong>${safeLabel}</strong>
            <span>${temperature}°C · ${condition}</span>
        </div>
    `;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
