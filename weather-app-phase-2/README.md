# Weather App - Phase 2

Това е втора фаза на училищния проект Weather App.

Фаза 2 надгражда върху вече готовата Фаза 1. Приложението вече има по-чиста JavaScript структура, превключване между °C и °F, история на последните търсения и 5-дневна прогноза.

## Файлова структура

```text
weather-app-phase-2/
├── index.html
├── styles.css
├── README.md
└── js/
    ├── app.js
    ├── api.js
    ├── ui.js
    └── weather-codes.js
```

## Какво е променено спрямо Фаза 1

- JavaScript кодът е разделен на модули.
- `index.html` зарежда `js/app.js` като ES module.
- API заявките са отделени в `api.js`.
- DOM промените са отделени в `ui.js`.
- Weather code логиката е отделена в `weather-codes.js`.
- Добавен е бутон за превключване между °C и °F.
- Добавена е история на последните 5 търсени града чрез `localStorage`.
- Добавена е 5-дневна прогноза с минимална и максимална температура.
- Прогнозата показва описание, икона, максимален вятър и шанс за валеж.
- Weather описанията по подразбиране са на български.
- Търсенето работи и с английски, и с български имена на градове.
- Добавя се цветна тема според текущото време.
- Иконите имат различни цветове и малки декоративни елементи според времето.
- Добавена е интерактивна карта с Leaflet и OpenStreetMap.
- При клик върху картата приложението зарежда времето за избраната точка.
- При търсене на град картата се премества към него.

## Важно за стартиране

Понеже проектът използва JavaScript модули, най-добре е да се стартира с Live Server във VS Code.

## Тестове

Пробвай:

- Sofia
- London
- София
- Лондон
- празно поле
- несъществуващ град
- превключване °C / °F
- клик върху град от историята

## Следващи стъпки

- допълнителни данни за времето
- BG / EN превключвател
- бутон за моята локация


## Map updates

- The map starts centered on Bulgaria without showing Sofia as selected by default.
- Clicking the map loads weather by coordinates and moves a colored weather marker.
- The marker popup shows the selected place, current temperature and condition.
- Reverse geocoding uses a city-level lookup so district names like “Южен” are avoided when a city name is available.
