import { useState, useCallback, useRef } from 'react';
import { Message, Chat, AppSettings, AppMode } from '../types';
import { SYSTEM_PROMPTS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>('chat');
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode,
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  }, [mode]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  }, [activeChatId]);

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

    // Add user message
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

      const messages = [
        { role: 'system', content: settings.systemPrompt || systemPrompt },
        ...chats.find(c => c.id === chatId)!.messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content },
      ];

      const response = await fetch(`${settings.provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.provider.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.selectedModel,
          messages,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
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

      // Finalize message
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
        const errorMsg = `⚠️ Error: ${error.message || 'Failed to get response from the API. Please check your settings and try again.'}`;
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
