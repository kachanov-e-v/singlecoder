'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';
import SettingsModal from './SettingsModal';
import { useChat } from '../hooks/useChat';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../auth/AuthContext';

export default function Workspace() {
  const { user, logout } = useAuth();
  const userId = user!.id;

  const {
    chats,
    activeChat,
    activeChatId,
    isLoading,
    mode,
    setMode,
    setActiveChatId,
    createNewChat,
    deleteChat,
    sendMessage,
    stopGeneration,
  } = useChat(userId);

  const {
    settings,
    updateSettings,
    updateProvider,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useSettings(userId);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSendMessage = (content: string) => {
    sendMessage(content, settings);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0f0f1a] text-white">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        mode={mode}
        user={user}
        onLogout={logout}
        onSelectChat={setActiveChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onModeChange={setMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Chat Area */}
      <ChatInterface
        activeChat={activeChat}
        mode={mode}
        isLoading={isLoading}
        settings={settings}
        onSendMessage={handleSendMessage}
        onStopGeneration={stopGeneration}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onUpdateProvider={updateProvider}
      />
    </div>
  );
}

