import { Chat, AppMode } from '../types';
import { MessageSquare, Plus, Trash2, Settings, Code2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  mode: AppMode;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onModeChange: (mode: AppMode) => void;
  onOpenSettings: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  mode,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onModeChange,
  onOpenSettings,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#1a1a2e] border-r border-gray-800 flex flex-col items-center py-3 gap-2">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={onNewChat}
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          title="New chat"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors mt-auto"
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-[#1a1a2e] border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Qwen Coder</span>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-gray-800/50 p-0.5 mb-3">
          <button
            onClick={() => onModeChange('chat')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              mode === 'chat'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageCircle size={12} />
            Chat
          </button>
          <button
            onClick={() => onModeChange('dev')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              mode === 'dev'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code2 size={12} />
            Dev
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {chats.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No conversations yet
          </div>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
              onClick={() => onSelectChat(chat.id)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                activeChatId === chat.id
                  ? 'bg-gray-700/70 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <MessageSquare size={14} className="shrink-0" />
              <span className="flex-1 text-sm truncate">{chat.title}</span>
              {(hoveredChat === chat.id || activeChatId === chat.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm transition-colors"
        >
          <Settings size={14} />
          Settings
        </button>
      </div>
    </div>
  );
}
