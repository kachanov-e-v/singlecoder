'use client';

import { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import { Code2, MessageCircle, Lightbulb, Zap } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  mode: 'chat' | 'dev';
  onSuggestionClick?: (text: string) => void;
}

export default function ChatMessages({ messages, mode, onSuggestionClick }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
            <Code2 size={32} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === 'dev' ? 'Режим разработки' : 'SingleCoder'}
          </h1>
          <p className="text-gray-400 mb-8">
            {mode === 'dev'
              ? 'Ваш AI-помощник разработчика. Опишите, что хотите создать.'
              : 'Ваш AI-помощник программиста. Спросите меня о чём угодно по коду.'}
          </p>

          {/* Suggestion cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            {mode === 'dev' ? (
              <>
                <SuggestionCard
                  icon={<Zap size={16} className="text-yellow-400" />}
                  title="Создать REST API"
                  description="Создать Node.js Express API с CRUD-операциями и валидацией"
                  onClick={() => onSuggestionClick?.('Создай мне REST API на Node.js и Express с CRUD-операциями, валидацией входных данных и обработкой ошибок. Добавь типы TypeScript.')}
                />
                <SuggestionCard
                  icon={<Code2 size={16} className="text-blue-400" />}
                  title="Отладить проблему"
                  description="Помочь найти утечку памяти в React-приложении"
                  onClick={() => onSuggestionClick?.('В моём React-приложении возможна утечка памяти: страница со временем работает медленнее. Помоги найти частые причины и способы отладки. Покажи типичные паттерны, вызывающие утечки памяти в React.')}
                />
                <SuggestionCard
                  icon={<Lightbulb size={16} className="text-green-400" />}
                  title="Рефакторинг кода"
                  description="Конвертировать классовый компонент в хуки с TypeScript"
                  onClick={() => onSuggestionClick?.('Покажи, как конвертировать React классовый компонент в функциональный с использованием хуков. Добавь правильную типизацию props и state на TypeScript. Объясни ключевые различия и лучшие практики.')}
                />
                <SuggestionCard
                  icon={<MessageCircle size={16} className="text-purple-400" />}
                  title="Написать тесты"
                  description="Сгенерировать юнит-тесты для модуля аутентификации"
                  onClick={() => onSuggestionClick?.('Напиши исчерпывающие юнит-тесты для модуля аутентификации, включающего вход, выход, обновление токена и управление сессией. Используй Jest и React Testing Library. Включи граничные случаи и сценарии ошибок.')}
                />
              </>
            ) : (
              <>
                <SuggestionCard
                  icon={<Code2 size={16} className="text-blue-400" />}
                  title="Объяснить концепцию"
                  description="В чём разница между let, const и var?"
                  onClick={() => onSuggestionClick?.('В чём разница между let, const и var в JavaScript? Объясни с примерами, когда что использовать, и какие последствия для области видимости и поднятия.')}
                />
                <SuggestionCard
                  icon={<Zap size={16} className="text-yellow-400" />}
                  title="Написать код"
                  description="Создать функцию debounce на TypeScript"
                  onClick={() => onSuggestionClick?.('Создай обобщённую функцию debounce на TypeScript с правильной типизацией. Добавь примеры использования и объясни, как она работает внутри.')}
                />
                <SuggestionCard
                  icon={<Lightbulb size={16} className="text-green-400" />}
                  title="Лучшие практики"
                  description="Как структурировать большое React-приложение?"
                  onClick={() => onSuggestionClick?.('Каковы лучшие практики структурирования крупного React-приложения? Охвати структуру папок, паттерны управления состоянием, разделение кода и оптимизацию производительности.')}
                />
                <SuggestionCard
                  icon={<MessageCircle size={16} className="text-purple-400" />}
                  title="Помощь с отладкой"
                  description="Почему возникает CORS-ошибка в fetch-запросе?"
                  onClick={() => onSuggestionClick?.('Почему возникает CORS-ошибка при fetch-запросе с фронтенда к API? Объясни, что такое CORS, зачем он нужен, и покажи несколько способов исправления.')}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function SuggestionCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="p-3 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600 cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{title}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

