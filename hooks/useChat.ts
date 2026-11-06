'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, Chat, AppSettings, AppMode } from '../types';
import { SYSTEM_PROMPTS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

const CHATS_PREFIX = 'singlecoder:chats:';
const ACTIVE_PREFIX = 'singlecoder:activeChat:';

function chatsKey(userId: string): string {
  return `${CHATS_PREFIX}${userId}`;
}

function activeKey(userId: string): string {
  return `${ACTIVE_PREFIX}${userId}`;
}

function loadChats(userId: string): Chat[] {
  try {
    const raw = localStorage.getItem(chatsKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Chat[];
    }
  } catch {}
  return [];
}

function loadActiveChatId(userId: string): string | null {
  try {
    return localStorage.getItem(activeKey(userId));
  } catch {
    return null;
  }
}

export function useChat(userId: string) {
  const [chats, setChats] = useState<Chat[]>(() => loadChats(userId));
  const [activeChatId, setActiveChatIdState] = useState<string | null>(() => {
    const id = loadActiveChatId(userId);
    return id;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>('chat');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Persist active chat id
  const setActiveChatId = useCallback((id: string | null) => {
    setActiveChatIdState(id);
    try {
      if (id) localStorage.setItem(activeKey(userId), id);
      else localStorage.removeItem(activeKey(userId));
    } catch {}
  }, [userId]);

  // Persist chats whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(chatsKey(userId), JSON.stringify(chats));
    } catch {}
  }, [chats, userId]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'Новый чат',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode,
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  }, [mode, setActiveChatId]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  }, [activeChatId, setActiveChatId]);

  const updateChatTitle = useCallback((chatId: string, title: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title } : c));
  }, []);

  const sendMessage = useCallback(async (content: string, settings: AppSettings) => {
    let chatId = activeChatId;
    if (!chatId) {
      chatId = createNewChat();
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        const title = c.messages.length === 0 ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : c.title;
        return { ...c, title, messages: [...c.messages, userMessage, assistantMessage], updatedAt: Date.now() };
      }
      return c;
    }));

    setIsLoading(true);

    const systemPrompt = mode === 'dev' ? SYSTEM_PROMPTS.dev : SYSTEM_PROMPTS.chat;

    try {
      abortControllerRef.current = new AbortController();

      const existingMessages = chats.find(c => c.id === chatId)?.messages || [];
      const messages = [
        { role: 'system', content: settings.systemPrompt || systemPrompt },
        ...existingMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseUrl: settings.provider.baseUrl,
          apiKey: settings.provider.apiKey,
          model: settings.selectedModel,
          messages,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ошибка API (${response.status}): ${errorData}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                if (delta) {
                  fullContent += delta;
                  setChats(prev => prev.map(c => {
                    if (c.id === chatId) {
                      const msgs = [...c.messages];
                      msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: fullContent };
                      return { ...c, messages: msgs };
                    }
                    return c;
                  }));
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          const msgs = [...c.messages];
          msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: fullContent, isStreaming: false };
          return { ...c, messages: msgs };
        }
        return c;
      }));

    } catch (error: any) {
      if (error.name === 'AbortError') {
        setChats(prev => prev.map(c => {
          if (c.id === chatId) {
            const msgs = [...c.messages];
            msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], isStreaming: false };
            return { ...c, messages: msgs };
          }
          return c;
        }));
      } else {
        const errorMsg = `⚠️ Ошибка: ${error.message || 'Не удалось получить ответ от API. Проверьте настройки.'}`;
        setChats(prev => prev.map(c => {
          if (c.id === chatId) {
            const msgs = [...c.messages];
            msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: errorMsg, isStreaming: false };
            return { ...c, messages: msgs };
          }
          return c;
        }));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [activeChatId, createNewChat, chats, mode]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    chats,
    activeChat,
    activeChatId,
    isLoading,
    mode,
    setMode,
    setActiveChatId,
    createNewChat,
    deleteChat,
    updateChatTitle,
    sendMessage,
    stopGeneration,
  };
}

