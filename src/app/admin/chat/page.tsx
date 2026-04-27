'use client';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import MessageBubble from '@/components/MessageBubble';
import { ChatRoom } from '../../../../interface';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AdminChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const token = (session?.user as any)?.token as string | undefined;
  const adminId = (session?.user as any)?._id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const { messages, connected, sendMessage, loadHistory, joinRoom, markRead } = useChat(
    token,
    adminId
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  // Redirect non-admins
  useEffect(() => {
    if (status === 'authenticated' && role !== 'admin') {
      router.replace('/');
    }
  }, [status, role, router]);

  // Load all rooms on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${BACKEND_URL}/api/v1/chat`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setRooms(data.data);
      })
      .catch(() => { });
  }, [token]);

  // On room select: join socket room + load history
  const selectRoom = (roomId: string) => {
    setSelectedRoom(roomId);
    joinRoom(roomId);
    loadHistory(roomId);
    markRead(roomId);
    setRooms((prev) =>
      prev.map((r) => (r._id === roomId ? { ...r, unreadCount: 0 } : r))
    );
  };

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !selectedRoom || sending) return;
    setSending(true);
    const ok = await sendMessage(trimmed, selectedRoom);
    if (ok) {
      setInput('');
      setRooms((prev) =>
        prev.map((r) =>
          r._id === selectedRoom
            ? { ...r, lastMessage: trimmed, lastTimestamp: new Date().toISOString() }
            : r
        )
      );
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
    if (!token) return;

    await fetch(`${BACKEND_URL}/api/v1/chat/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    await fetch(`${BACKEND_URL}/api/v1/chat/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const roomMessages = selectedRoom
    ? messages.filter((m) => m.room === selectedRoom)
    : [];

  if (status === 'loading') return null;

  return (
    <div className="fixed inset-0 top-16 flex bg-gray-50 overflow-hidden">
      {/* Sidebar — room list */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">User Conversations</h2>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span className={`text-xs font-medium ${connected ? 'text-green-600' : 'text-gray-400'}`}>
              {connected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-8 px-4">
              No conversations yet
            </p>
          )}
          {rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => selectRoom(room._id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedRoom === room._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {room.userName}
                </span>
                {room.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
                    {room.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(room.lastTimestamp).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        {!selectedRoom ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to view messages
          </div>
        ) : (
          <>
            <div className="px-4 py-3 bg-white border-b border-gray-200">
              <h3 className="font-medium text-gray-800 text-sm">
                Chatting with:{' '}
                <span className="text-blue-600">
                  {rooms.find((r) => r._id === selectedRoom)?.userName ?? selectedRoom}
                </span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 min-w-0">
              {roomMessages.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-8">No messages yet</p>
              )}
              {roomMessages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isOwn={msg.senderRole === 'admin'}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3 bg-white border-t border-gray-200 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Reply to ${rooms.find((r) => r._id === selectedRoom)?.userName ?? selectedRoom}…`}
                rows={2}
                maxLength={1000}
                className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors self-end"
              >
                Send
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
