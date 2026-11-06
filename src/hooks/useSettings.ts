import { useState, useEffect } from 'react';
import { AppSettings, Provider } from '../types';
import { DEFAULT_PROVIDERS } from '../constants';

const STORAGE_KEY = 'qwen-coder-settings';

const defaultSettings: AppSettings = {
  provider: DEFAULT_PROVIDERS[0],
  selectedModel: DEFAULT_PROVIDERS[0].models[0],
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return defaultSettings;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const updateProvider = (provider: Provider) => {
    setSettings(prev => ({
      ...prev,
      provider,
      selectedModel: provider.models[0] || '',
    }));
  };

  return {
    settings,
    updateSettings,
    updateProvider,
    isSettingsOpen,
    setIsSettingsOpen,
  };
}
