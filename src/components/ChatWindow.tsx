'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useChat } from '@/hooks/useChat';
import MessageBubble from './MessageBubble';

interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
  const { data: session } = useSession();
  const token = (session?.user as any)?.token as string | undefined;
  const userId = (session?.user as any)?._id as string | undefined;

  const { messages, setMessages, connected, sendError, sendMessage, loadHistory, markRead } = useChat(token, userId);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const historyLoaded = useRef(false);

  useEffect(() => {
    if (userId && !historyLoaded.current) {
      historyLoaded.current = true;
      loadHistory(userId);
      markRead(userId);
    }
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setSending(true);

    const ok = await sendMessage(trimmed);
    if (ok) {
      setInput('');
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEdit = async (id: string, content: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) return;

  const data = await res.json();

  // 🔥 update UI immediately
  setMessages(prev =>
    prev.map(m => (m._id === id ? data.data : m))
  );
};

  const handleDelete = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return;

  // 🔥 remove from UI immediately
  setMessages(prev => prev.filter(m => m._id !== id));
};
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-t-xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-green-400' : 'bg-gray-300'
            }`}
          />
          <span className="font-semibold text-sm">Support Chat</span>
          {!connected && (
            <span className="text-xs text-blue-200">(offline mode)</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-blue-200 text-xl leading-none font-light"
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">
            Send a message to start the conversation
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.sender === userId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Errors */}
      {sendError && (
        <p className="text-xs text-red-500 px-4 py-1 flex-shrink-0">{sendError}</p>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-200 flex gap-2 flex-shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          maxLength={1000}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
