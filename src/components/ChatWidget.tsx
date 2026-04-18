'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ChatWindow from './ChatWindow';
import { useChat } from '@/hooks/useChat';

export default function ChatWidget() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const token = (session?.user as any)?.token as string | undefined;
  const userId = (session?.user as any)?._id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  const { messages } = useChat(open ? undefined : token, open ? undefined : userId);

  // Track new incoming admin messages while chat is closed
  useEffect(() => {
    if (!open && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderRole === 'admin' && lastMsg.status === 'sent') {
        setHasUnread(true);
      }
    }
  }, [messages, open]);

  const handleOpen = () => {
    setOpen(true);
    setHasUnread(false);
  };

  if (!session || role === 'admin') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-4 w-80 h-[480px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <ChatWindow onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="relative w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label={open ? 'Close chat' : 'Open support chat'}
      >
        {hasUnread && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            !
          </span>
        )}
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
