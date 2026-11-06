'use client';

import { useState, useEffect } from 'react';
import { AppSettings, Provider } from '../types';
import { DEFAULT_PROVIDERS } from '../constants';

const STORAGE_PREFIX = 'singlecoder:settings:';

const defaultSettings: AppSettings = {
  provider: DEFAULT_PROVIDERS[0],
  selectedModel: DEFAULT_PROVIDERS[0].models[0],
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '',
};

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

function loadSettings(userId: string): AppSettings {
  try {
    const stored = localStorage.getItem(storageKey(userId));
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AppSettings>;
      return { ...defaultSettings, ...parsed };
    }
  } catch {}
  return { ...defaultSettings };
}

export function useSettings(userId: string) {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings(userId));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey(userId), JSON.stringify(settings));
  }, [settings, userId]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const updateProvider = (provider: Provider) => {
    setSettings(prev => ({
      ...prev,
      provider,
      selectedModel: provider.models[0] || prev.selectedModel,
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

