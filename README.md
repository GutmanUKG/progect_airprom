# Project Air

Frontend проект с Gulp сборкой.

## Установка

```bash
npm install
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера с live-reload и автотестами |
| `npm run build` | Сборка проекта в папку `dist` |
| `npm test` | Запуск всех тестов |
| `npm run test:js` | Jest тесты |
| `npm run test:html` | HTML валидация |
| `npm run test:css` | Stylelint проверка SCSS/CSS |

## Структура проекта

```
src/
├── sass/           # SCSS файлы
│   └── main.scss   # Главный файл стилей
├── js/             # JavaScript файлы
├── img/            # Изображения (jpg, png, gif, webp)
└── svg/            # SVG иконки для спрайта

dist/               # Результат сборки
├── css/
├── js/
├── img/
│   └── sprite.svg
└── index.html

tests/              # Jest тесты
```

## Возможности сборки

- **SCSS** — компиляция в CSS с поддержкой импортов и sourcemaps
- **JS** — копирование в dist
- **Изображения** — оптимизация (mozjpeg, optipng, gifsicle)
- **SVG** — сборка в единый спрайт
- **Live-reload** — автообновление браузера при изменениях
- **Автотесты** — запуск при каждом изменении файлов

## Использование SVG спрайта

1. Добавь SVG файл в `src/svg/`, например `icon-arrow.svg`
2. Используй в HTML:

```html
<svg width="24" height="24">
  <use href="img/sprite.svg#icon-arrow"></use>
</svg>
```

ID иконки = имя файла без расширения.

## Импорт SCSS

```scss
// src/sass/main.scss
@import 'variables';
@import 'components/header';
@import 'components/footer';
```

## Написание тестов

Тесты размещаются в папке `tests/` с расширением `.test.js`:

```javascript
// tests/utils.test.js
describe('Utils', () => {
  test('should work', () => {
    expect(true).toBe(true);
  });
});
```
