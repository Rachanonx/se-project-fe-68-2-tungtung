'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../../interface';

// REST calls (Vercel หรือ local)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// Socket.IO (Render หรือ local) — fallback เป็น BACKEND_URL ถ้าไม่ได้ตั้ง
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? BACKEND_URL;
const POLL_INTERVAL_MS = 5000;

export function useChat(token: string | undefined, userId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  // track the room being polled (for fallback mode)
  const pollRoomRef = useRef<string | null>(null);

  const mergeMessages = (incoming: ChatMessage[]) => {
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m._id));
      const fresh = incoming.filter((m) => !ids.has(m._id));
      return fresh.length ? [...prev, ...fresh] : prev;
    });
  };

  // Socket.IO connection
  useEffect(() => {
    if (!token || !userId) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    // connect_error is silent — REST polling handles the fallback
    socket.on('connect_error', () => setConnected(false));

    socket.on('receive_message', (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('messages_read', ({ room }: { room: string }) => {
      setMessages((prev) =>
        prev.map((m) => (m.room === room ? { ...m, status: 'read' as const } : m))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [token, userId]);

  // REST polling fallback — runs when WebSocket is not connected
  useEffect(() => {
    if (connected || !token || !pollRoomRef.current) return;

    const poll = async () => {
      const roomId = pollRoomRef.current;
      if (!roomId) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/chat/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          mergeMessages(data.data ?? []);
        }
      } catch {
        // silently ignore poll errors
      }
    };

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [connected, token]);

  const loadHistory = useCallback(
    async (roomUserId: string) => {
      if (!token) return;
      pollRoomRef.current = roomUserId;
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/chat/${roomUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.data ?? []);
        }
      } catch {
        // silently ignore — messages will be empty, user can retry by reopening
      }
    },
    [token]
  );

  const markRead = useCallback(
    async (roomId: string) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('mark_read', roomId);
        return;
      }
      // REST fallback
      try {
        await fetch(`${BACKEND_URL}/api/v1/chat/${roomId}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages((prev) =>
          prev.map((m) => (m.room === roomId ? { ...m, status: 'read' as const } : m))
        );
      } catch {
        // silently ignore
      }
    },
    [token]
  );

  const sendMessage = useCallback(
    async (content: string, room?: string): Promise<boolean> => {
      setSendError(null);

      if (socketRef.current?.connected) {
        socketRef.current.emit('send_message', { content, room });
        return true;
      }

      // REST fallback
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, room }),
        });
        if (!res.ok) {
          setSendError('Failed to send message. Please try again.');
          return false;
        }
        const data = await res.json();
        if (data.success) {
          setMessages((prev) => {
            if (prev.find((m) => m._id === data.data._id)) return prev;
            return [...prev, data.data];
          });
        }
        return true;
      } catch {
        setSendError('Failed to send message. Please try again.');
        return false;
      }
    },
    [token]
  );

  const joinRoom = useCallback((roomId: string) => {
    pollRoomRef.current = roomId;
    socketRef.current?.emit('join_room', roomId);
  }, []);

  return { messages, setMessages, connected, sendError, sendMessage, loadHistory, joinRoom, markRead };
}
