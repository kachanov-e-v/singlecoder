'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 px-4 py-4 ${isUser ? '' : 'bg-gray-800/30'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
        isUser 
          ? 'bg-blue-600' 
          : 'bg-gradient-to-br from-purple-500 to-blue-500'
      }`}>
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-400 mb-1">
          {isUser ? 'Вы' : 'SingleCoder'}
        </div>
        <div className="prose prose-inverse prose-sm max-w-none text-gray-200 leading-relaxed">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  
                  // Check if it's an inline code or block code
                  if (match) {
                    return <CodeBlock code={codeString} language={match[1]} />;
                  }
                  
                  // Check if code has newlines (block code without language)
                  if (codeString.includes('\n')) {
                    return <CodeBlock code={codeString} language="" />;
                  }
                  
                  // Inline code
                  return (
                    <code className="px-1.5 py-0.5 bg-gray-700 rounded text-purple-300 text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>;
                },
                h1({ children }) {
                  return <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-base font-bold mb-2 text-white">{children}</h3>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-3 border-purple-500 pl-4 my-3 text-gray-300 italic">
                      {children}
                    </blockquote>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full border border-gray-700 rounded-lg">{children}</table>
                    </div>
                  );
                },
                th({ children }) {
                  return <th className="border border-gray-700 px-3 py-1.5 bg-gray-800 text-left text-sm font-medium">{children}</th>;
                },
                td({ children }) {
                  return <td className="border border-gray-700 px-3 py-1.5 text-sm">{children}</td>;
                },
                a({ children, href }) {
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                      {children}
                    </a>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}

