'use client';

import { useState, useRef, useEffect } from 'react';
import { Chat, AppSettings, AppMode } from '../types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { Cpu, ChevronDown, AlertTriangle } from 'lucide-react';

interface ChatInterfaceProps {
  activeChat: Chat | null;
  mode: AppMode;
  isLoading: boolean;
  settings: AppSettings;
  onSendMessage: (content: string, settings: AppSettings) => void;
  onStopGeneration: () => void;
  onOpenSettings: () => void;
}

export default function ChatInterface({
  activeChat,
  mode,
  isLoading,
  settings,
  onSendMessage,
  onStopGeneration,
  onOpenSettings,
}: ChatInterfaceProps) {
  const [showModelInfo, setShowModelInfo] = useState(false);
  const modelInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelInfoRef.current && !modelInfoRef.current.contains(event.target as Node)) {
        setShowModelInfo(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = (content: string) => {
    onSendMessage(content, settings);
  };

  const hasApiKey = !!settings.provider.apiKey;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0f0f1a]">
      {/* Top Bar */}
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-[#0f0f1a]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Model selector button */}
          <div className="relative" ref={modelInfoRef}>
            <button
              onClick={() => setShowModelInfo(!showModelInfo)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 text-sm text-gray-300 hover:text-white transition-all"
            >
              <Cpu size={14} className="text-purple-400" />
              <span className="font-medium">{settings.selectedModel}</span>
              {!hasApiKey && <AlertTriangle size={12} className="text-yellow-400" />}
              <ChevronDown size={12} className={`transition-transform ${showModelInfo ? 'rotate-180' : ''}`} />
            </button>

            {showModelInfo && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#1e1e2e] border border-gray-700 rounded-xl shadow-xl z-50 p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Провайдер</span>
                    <span className="text-xs text-white font-medium">{settings.provider.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Модель</span>
                    <span className="text-xs text-white font-medium">{settings.selectedModel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Температура</span>
                    <span className="text-xs text-white font-medium">{settings.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Макс. токенов</span>
                    <span className="text-xs text-white font-medium">{settings.maxTokens}</span>
                  </div>
                  {!hasApiKey && (
                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertTriangle size={12} className="text-yellow-400 shrink-0" />
                      <span className="text-xs text-yellow-300">API-ключ не настроен</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-700">
                    <button
                      onClick={() => {
                        onOpenSettings();
                        setShowModelInfo(false);
                      }}
                      className="w-full text-center text-xs text-purple-400 hover:text-purple-300 py-1"
                    >
                      Изменить модель и настройки →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            mode === 'dev'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          }`}>
            {mode === 'dev' ? '🛠 Режим разработки' : '💬 Режим чата'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages
        messages={activeChat?.messages || []}
        mode={mode}
        onSuggestionClick={handleSend}
      />

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onStop={onStopGeneration}
        isLoading={isLoading}
        mode={mode}
      />
    </div>
  );
}

