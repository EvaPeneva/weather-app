# Weather App - Phase 2

This is the second phase of the school Weather App project. It builds on top of Phase 1 instead of starting again from zero.

## Main Phase 2 requirements covered

- The old `showError` problem is avoided. Error handling is separated and does not use deleted DOM elements.
- DOM references are collected in one object inside `js/ui.js`.
- JavaScript is split into ES modules with `import` / `export`.
- `index.html` loads the app with `<script type="module" src="js/app.js"></script>`.
- The app has a °C / °F switch. It changes the current temperature, forecast temperatures and map popup temperature without making a new API request.
- The last 5 searched places are saved with `localStorage`.
- README documentation, inline comments and JSDoc-style comments are included.

## Extra features

- 5-day forecast with min/max temperature, weather icon, wind speed, rain chance and UV index.
- Dynamic background and icon colors based on the current weather.
- Interactive map with OpenStreetMap / Leaflet.
- Clicking on the map loads weather by coordinates and moves the marker.
- Searching for a city also moves the map marker.
- “My location” button using browser geolocation.
- BG / EN interface switch.
- Extra current weather details: feels-like temperature, humidity, pressure and precipitation.
- Comfort score calculated from temperature, wind, rain and humidity.

## File structure

```text
weather-app-phase-2/
├── index.html
├── styles.css
├── README.md
├── script.js
└── js/
    ├── app.js
    ├── api.js
    ├── map.js
    ├── ui.js
    └── weather-codes.js
```

`script.js` is kept only as a note showing the old Phase 1 structure. Phase 2 starts from `js/app.js`.

## Modules

- `app.js` - connects events, API calls, map clicks, language switching and history.
- `api.js` - contains all `fetch()` requests to Open-Meteo and Nominatim.
- `ui.js` - changes the DOM, translates the interface, renders current weather and forecast.
- `map.js` - creates the map and updates the weather marker.
- `weather-codes.js` - converts weather codes to text, icons and visual themes.

## How to run

Use **Live Server** in VS Code. ES modules work best when the project is served locally instead of opened directly as a file.

## Test checklist

Try:

- Sofia
- London
- София
- Лондон
- empty input
- a fake city name
- °C / °F switch
- BG / EN switch
- My location button
- click on the map
- click on a city from search history
- check Console for red errors

## Notes for presentation

The project uses HTML, CSS and vanilla JavaScript for the main logic. Leaflet is used only for the optional interactive map. Weather data comes from Open-Meteo, and reverse geocoding for map clicks uses Nominatim.
