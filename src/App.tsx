import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import SettingsModal from './components/SettingsModal';
import { useChat } from './hooks/useChat';
import { useSettings } from './hooks/useSettings';

export default function App() {
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
  } = useChat();

  const {
    settings,
    updateSettings,
    updateProvider,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useSettings();

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
