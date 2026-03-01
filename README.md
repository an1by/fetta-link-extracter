# Fetta → OZON

> **Автор:** [An1by](https://github.com/an1by)  
> **Лицензия:** [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — см. [LICENSE](LICENSE)

Расширение для браузера (Chrome, Edge, Firefox, Opera), которое на страницах вишлистов [fetta.app](https://fetta.app) добавляет к каждой карточке товара ссылку **OZON**. По клику открывается страница товара на **ozon.ru** в новой вкладке.

- Работает на `https://fetta.app/u/<username>`
- К карточкам продуктов добавляется кнопка «OZON» (белый текст, синий фон)
- Ссылка ведёт на `https://www.ozon.ru/product/<externalId>`
- Учитывается постраничная подгрузка и выбор категории

## Установка (для разработки)

Весь код проекта — в **`src/`**: расширение в `src/extension/`, скрипты сборки в `src/scripts/`, иконки и прочие ассеты в **`src/assets/`** (при сборке копируются в `extension/assets/`). Перед загрузкой в браузер соберите расширение:

```bash
bun install
bun run build:extension
```

После этого в **`extension/`** появятся `content.js` и `inject.js`. Для Edge в режиме разработки также собирается копия в **`extension-edge/`**.

1. Клонируйте репозиторий и выполните команды выше.
2. Откройте в браузере:
   - **Chrome:** `chrome://extensions/`
   - **Edge:** `edge://extensions/`
   - **Firefox:** `about:debugging` → «Этот Firefox» → «Загрузить временное дополнение»
   - **Opera:** `opera://extensions` → «Загрузить распакованное расширение»
3. Включите «Режим разработчика» (Chrome/Edge).
4. Укажите папку **`extension`** (или **`extension-edge`** для Edge) как распакованное расширение / временное дополнение.
