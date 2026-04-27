import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../interface';

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function StatusLabel({ status }: { status: 'sent' | 'read' }) {
  return (
    <span className={`text-xs ml-1 ${status === 'read' ? 'text-blue-200' : 'text-blue-300/60'}`}>
      {status === 'read' ? 'read' : 'sent'}
    </span>
  );
}

export default function MessageBubble({ message, isOwn, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(message.content);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSave = async () => {
    if (!value.trim()) return;
    setLoading(true);
    await onEdit(message._id, value);
    setEditing(false);
    setLoading(false);
  };

  const handleEditClick = () => {
    setMenuOpen(false);
    setEditing(true);
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (!confirm("Delete this message?")) return;
    setLoading(true);
    await onDelete(message._id);
    setLoading(false);
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 min-w-0`}>
      <div className={`max-w-[75%] break-words ${editing ? 'w-full' : ''}`}>
        {!isOwn && (
          <p className="text-xs text-gray-500 mb-1 px-1">{message.senderName}</p>
        )}

        <div
          className={`px-3 py-2 rounded-2xl text-sm ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}
        >
          {editing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                rows={2}
                className="w-full text-sm text-gray-900 bg-white rounded-lg px-2.5 py-1.5 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setValue(message.content);
                    setEditing(false);
                  }}
                  disabled={loading}
                  className="text-xs px-3 py-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !value.trim()}
                  className="text-xs px-3 py-1 rounded-md bg-white text-blue-600 font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap break-words break-all">{message.content}</p>

              <div className="flex items-center justify-end gap-1 mt-1">
                <span className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                  {time}
                </span>

                {isOwn && <StatusLabel status={message.status} />}

                {isOwn && (
                  <div className="relative ml-1" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen((v) => !v)}
                      className="px-1 leading-none text-base opacity-70 hover:opacity-100"
                      aria-label="Message options"
                    >
                      ⋮
                    </button>
                    {menuOpen && (
                      <div className="absolute bottom-full right-0 mb-1 w-28 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 overflow-hidden">
                        <button
                          onClick={handleEditClick}
                          className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDelete}
                          className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}