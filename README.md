# SingleCoder

AI-помощник программиста на **Next.js** — клон интерфейса Qwen Coder с поддержкой нескольких LLM-провайдеров.

## Возможности

- 💬 Чат с AI-моделями через OpenAI-совместимый API
- 🛠 Режимы «Чат» и «Разработка» (разные системные промпты)
- 🔌 Поддержка провайдеров: OpenAI, Anthropic, Qwen, DeepSeek, Google, Groq, Custom (OpenAI-совместимые)
- 🎨 Подсветка кода (Prism) и Markdown (GFM)
- 👤 Регистрация и авторизация пользователей (данные хранятся в браузере)
- 💾 История чатов, настройки и выбранная модель привязаны к аккаунту
- 🌐 Серверный прокси `/api/chat` — обход CORS при обращении к провайдерам
- 🇷🇺 Полностью русский интерфейс

## Стек

- Next.js 14 (App Router)
- React 18, TypeScript
- Tailwind CSS v4
- react-markdown, react-syntax-highlighter
- lucide-react

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно на http://localhost:3000

## Сборка и запуск продакшен-версии

```bash
npm run build
npm run start
```

## Проверка типов

```bash
npm run typecheck
```

## Архитектура

- `app/` — маршруты Next.js, включая серверный прокси `app/api/chat/route.ts`
- `components/` — UI-компоненты
- `hooks/` — `useChat`, `useSettings`
- `auth/` — клиентская авторизация (localStorage)
- `constants.ts`, `types.ts` — провайдеры, промпты, типы

Авторизация и данные пользователей реализованы на стороне клиента (localStorage), поэтому история и настройки привязаны к браузеру. Для полноценной серверной авторизации и хранения данных требуется отдельный бэкенд.