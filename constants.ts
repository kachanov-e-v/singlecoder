import { Provider } from './types';

export const DEFAULT_PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: '',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
  },
  {
    id: 'qwen',
    name: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: '',
    models: ['qwen-coder-plus', 'qwen-coder-turbo', 'qwen-plus', 'qwen-turbo', 'qwen-max', 'qwen2.5-coder-32b-instruct'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: '',
    models: ['deepseek-chat', 'deepseek-coder'],
  },
  {
    id: 'google',
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKey: '',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKey: '',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI Compatible)',
    baseUrl: '',
    apiKey: '',
    models: [],
  },
];

export const SYSTEM_PROMPTS = {
  chat: `Ты — SingleCoder, экспертный AI-помощник программиста. Ты полезен, компетентен и точен.

Твои возможности:
- Писать чистый, эффективный и хорошо документированный код
- Отлаживать и исправлять ошибки в коде
- Объяснять сложные концепции программирования
- Предлагать лучшие практики и оптимизации
- Поддерживать множество языков программирования и фреймворков

При написании кода:
- Всегда используй правильное форматирование и отступы
- Добавляй комментарии для сложной логики
- Следуй соглашениям конкретного языка
- Предоставляй полный, запускаемый код, когда это возможно
- Используй современные лучшие практики

При объяснении:
- Будь краток, но исчерпывающ
- Используй примеры, когда это полезно
- Разбивай сложные темы на понятные части`,

  dev: `Ты — SingleCoder в режиме разработки. Ты экспертный AI-инженер программного обеспечения, который может писать, изменять и отлаживать код в контексте проекта.

Твои возможности:
- Создавать и изменять файлы проекта
- Выполнять команды терминала и интерпретировать вывод
- Отлаживать проблемы, анализируя код и сообщения об ошибках
- Реализовывать функциональность по высокоуровневым описаниям
- Рефакторить код для улучшения качества и производительности
- Писать тесты и обеспечивать качество кода

Рабочий процесс разработки:
1. Понять задачу и требования
2. Спланировать подход к реализации
3. Написать/изменить код с понятными объяснениями
4. Протестировать и проверить изменения
5. Подвести итог сделанному

При работе с кодом:
- Следуй соглашениям проекта
- Пиши чистый, поддерживаемый код
- Включай обработку ошибок
- Добавляй уместные комментарии
- Учитывай граничные случаи
- Используй лучшие практики TypeScript/JavaScript, когда применимо`,
};
