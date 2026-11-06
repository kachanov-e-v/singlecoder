import { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import { Code2, MessageCircle, Lightbulb, Zap } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  mode: 'chat' | 'dev';
  onSuggestionClick?: (text: string) => void;
}

export default function ChatMessages({ messages, mode, onSuggestionClick }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
            <Code2 size={32} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === 'dev' ? 'Development Mode' : 'Qwen Coder'}
          </h1>
          <p className="text-gray-400 mb-8">
            {mode === 'dev' 
              ? 'Your AI-powered development assistant. Describe what you want to build.'
              : 'Your AI programming assistant. Ask me anything about code.'}
          </p>

          {/* Suggestion cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            {mode === 'dev' ? (
              <>
                <SuggestionCard
                  icon={<Zap size={16} className="text-yellow-400" />}
                  title="Build a REST API"
                  description="Create a Node.js Express API with CRUD operations and validation"
                  onClick={() => onSuggestionClick?.('Build me a REST API using Node.js and Express with proper CRUD operations, input validation, and error handling. Include TypeScript types.')}
                />
                <SuggestionCard
                  icon={<Code2 size={16} className="text-blue-400" />}
                  title="Debug an issue"
                  description="Help me fix a memory leak in my React application"
                  onClick={() => onSuggestionClick?.('I have a React application that seems to have a memory leak. The page gets slower over time. Can you help me identify common causes and how to debug this? Show me the typical patterns that cause memory leaks in React.')}
                />
                <SuggestionCard
                  icon={<Lightbulb size={16} className="text-green-400" />}
                  title="Refactor code"
                  description="Convert this class component to hooks with TypeScript"
                  onClick={() => onSuggestionClick?.('Show me how to convert a React class component to a functional component using hooks. Include proper TypeScript typing for props and state. Explain the key differences and best practices.')}
                />
                <SuggestionCard
                  icon={<MessageCircle size={16} className="text-purple-400" />}
                  title="Write tests"
                  description="Generate unit tests for my authentication module"
                  onClick={() => onSuggestionClick?.('Write comprehensive unit tests for an authentication module that includes login, logout, token refresh, and session management. Use Jest and React Testing Library. Include edge cases and error scenarios.')}
                />
              </>
            ) : (
              <>
                <SuggestionCard
                  icon={<Code2 size={16} className="text-blue-400" />}
                  title="Explain a concept"
                  description="What is the difference between let, const, and var?"
                  onClick={() => onSuggestionClick?.('What is the difference between let, const, and var in JavaScript? Explain with examples when to use each one and what are the implications for scope and hoisting.')}
                />
                <SuggestionCard
                  icon={<Zap size={16} className="text-yellow-400" />}
                  title="Write code"
                  description="Create a debounce function in TypeScript"
                  onClick={() => onSuggestionClick?.('Create a generic debounce function in TypeScript with proper typing. Include usage examples and explain how it works internally.')}
                />
                <SuggestionCard
                  icon={<Lightbulb size={16} className="text-green-400" />}
                  title="Best practices"
                  description="How should I structure a large React application?"
                  onClick={() => onSuggestionClick?.('What are the best practices for structuring a large-scale React application? Cover folder structure, state management patterns, code splitting, and performance optimization.')}
                />
                <SuggestionCard
                  icon={<MessageCircle size={16} className="text-purple-400" />}
                  title="Debug help"
                  description="Why am I getting a CORS error in my fetch request?"
                  onClick={() => onSuggestionClick?.('Why am I getting a CORS error when making a fetch request from my frontend to my API? Explain what CORS is, why it exists, and show me multiple ways to fix it.')}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function SuggestionCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="p-3 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600 cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{title}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
