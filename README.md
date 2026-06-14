# Weather App

This is a school Weather App project made with HTML, CSS and JavaScript.

The project is developed in phases. Phase 1 contains the basic working version, and Phase 2 extends it with cleaner code structure, extra features and documentation.

## Project structure

```text
weather-app/
├── index.html
├── styles.css
├── script.js
├── README.md
└── weather-app-phase-2/
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

## Phase 1

Phase 1 is the basic version of the application.

It includes:

* search by city name
* Open-Meteo Geocoding API for coordinates
* Open-Meteo Forecast API for current weather
* current temperature
* weather condition
* wind speed
* weather icon
* loading message
* error message

The Phase 1 files are in the main folder:

```text
index.html
styles.css
script.js
```

## Phase 2

Phase 2 builds on top of Phase 1 and improves the project.

It includes:

* JavaScript split into ES modules
* DOM references organized in one object
* improved error handling
* Celsius / Fahrenheit switch
* search history with localStorage
* 5-day forecast
* dynamic weather background
* interactive map with marker
* map and search synchronization
* My location button
* BG / EN language switch
* extra weather details
* comfort score
* updated documentation
* inline comments and JSDoc-style comments

The Phase 2 version is inside:

```text
weather-app-phase-2/
```

## How to run

For Phase 1, open:

```text
index.html
```

For Phase 2, open:

```text
weather-app-phase-2/index.html
```

Phase 2 should be opened with Live Server because it uses JavaScript modules.

## Test examples

Try searching for:

* Sofia
* London
* Plovdiv
* a fake city name

Also test:

* Celsius / Fahrenheit switch
* search history
* 5-day forecast
* interactive map
* My location button
* BG / EN switch

## APIs and tools

* Open-Meteo Geocoding API
* Open-Meteo Forecast API
* OpenStreetMap / Leaflet for the interactive map
* Font Awesome for weather icons

## Notes

This project was built step by step. Phase 1 is the base version, and Phase 2 contains the extended and improved version.
