'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, Sparkles } from 'lucide-react';
import { AppMode } from '../types';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
  mode: AppMode;
}

export default function ChatInput({ onSend, onStop, isLoading, mode }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-800 bg-[#0f0f1a] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end bg-gray-800/50 border border-gray-700 rounded-xl focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
          {/* File attachment button */}
          <button className="p-3 text-gray-400 hover:text-white transition-colors shrink-0" title="Прикрепить файл">
            <Paperclip size={18} />
          </button>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'dev' ? 'Опишите, что хотите создать или исправить...' : 'Спросите что-нибудь о коде...'}
            className="flex-1 bg-transparent text-white placeholder-gray-500 py-3 px-1 resize-none focus:outline-none text-sm leading-relaxed max-h-[200px]"
            rows={1}
          />

          {/* Mode indicator */}
          <div className="flex items-center gap-1 px-2 py-2 shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              mode === 'dev'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-purple-500/20 text-purple-400'
            }`}>
              {mode === 'dev' ? 'Разр.' : 'Чат'}
            </span>
          </div>

          {/* Send / Stop button */}
          {isLoading ? (
            <button
              onClick={onStop}
              className="p-3 text-red-400 hover:text-red-300 transition-colors shrink-0"
              title="Остановить генерацию"
            >
              <Square size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="p-3 text-purple-400 hover:text-purple-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors shrink-0"
              title="Отправить"
            >
              <Send size={18} />
            </button>
          )}
        </div>

        {/* Helper text */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-gray-500">
            Нажмите <kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400 text-[10px]">Enter</kbd> для отправки, <kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400 text-[10px]">Shift+Enter</kbd> для новой строки
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Sparkles size={10} />
            <span>Режим: {mode === 'dev' ? 'разработка' : 'чат'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

