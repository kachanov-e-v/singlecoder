'use client';

import { useState } from 'react';
import { X, Key, Globe, Cpu, Thermometer, Hash, FileText } from 'lucide-react';
import { AppSettings, Provider } from '../types';
import { DEFAULT_PROVIDERS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onUpdateProvider: (provider: Provider) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onUpdateProvider,
}: SettingsModalProps) {
  const [customModel, setCustomModel] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState(settings.provider.baseUrl);
  const [selectedProviderId, setSelectedProviderId] = useState(settings.provider.id);

  if (!isOpen) return null;

  const handleProviderChange = (providerId: string) => {
    setSelectedProviderId(providerId);
    const provider = DEFAULT_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      onUpdateProvider({ ...provider, apiKey: settings.provider.apiKey });
    }
  };

  const handleAddCustomModel = () => {
    if (customModel.trim()) {
      const updatedProvider = {
        ...settings.provider,
        models: [...settings.provider.models, customModel.trim()],
      };
      onUpdateProvider(updatedProvider);
      onUpdateSettings({ selectedModel: customModel.trim() });
      setCustomModel('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e1e2e] border border-gray-700 rounded-xl w-full max-w-lg mx-4 shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Настройки</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Globe size={14} />
              Провайдер
            </label>
            <select
              value={selectedProviderId}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {DEFAULT_PROVIDERS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Key size={14} />
              API-ключ
            </label>
            <input
              type="password"
              value={settings.provider.apiKey}
              onChange={(e) => {
                const updatedProvider = { ...settings.provider, apiKey: e.target.value };
                onUpdateProvider(updatedProvider);
              }}
              placeholder="Введите API-ключ..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Base URL (for custom) */}
          {(selectedProviderId === 'custom' || selectedProviderId === 'qwen') && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Globe size={14} />
                Базовый URL
              </label>
              <input
                type="text"
                value={customBaseUrl}
                onChange={(e) => {
                  setCustomBaseUrl(e.target.value);
                  const updatedProvider = { ...settings.provider, baseUrl: e.target.value };
                  onUpdateProvider(updatedProvider);
                }}
                placeholder="https://api.example.com/v1"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Model Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Cpu size={14} />
              Модель
            </label>
            <select
              value={settings.selectedModel}
              onChange={(e) => onUpdateSettings({ selectedModel: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {settings.provider.models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Add custom model */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="Добавить свою модель..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleAddCustomModel}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
              >
                Добавить
              </button>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Thermometer size={14} />
              Температура: {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Точно (0)</span>
              <span>Творчески (2)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Hash size={14} />
              Макс. токенов
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => onUpdateSettings({ maxTokens: parseInt(e.target.value) || 4096 })}
              min={256}
              max={128000}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* System Prompt */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FileText size={14} />
              Пользовательский системный промпт (необязательно)
            </label>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => onUpdateSettings({ systemPrompt: e.target.value })}
              placeholder="Оставьте пустым для использования промпта по умолчанию..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Сохранить и закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

