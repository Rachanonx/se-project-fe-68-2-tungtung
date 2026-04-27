import { useState } from 'react';
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

  const handleDelete = async () => {
    if (!confirm("Delete this message?")) return;
    setLoading(true);
    await onDelete(message._id);
    setLoading(false);
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 min-w-0`}>
      <div className="max-w-[75%] break-words">
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
          {/* ✏️ EDIT MODE */}
          {editing ? (
            <>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full text-sm text-black rounded p-1"
              />
              <div className="flex gap-2 mt-1 justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="text-xs bg-green-500 px-2 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs bg-gray-400 px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="whitespace-pre-wrap break-words break-all">{message.content}</p>

              <div className="flex items-center justify-end gap-1 mt-1">
                <span className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                  {time}
                </span>

                {isOwn && <StatusLabel status={message.status} />}

                {/* ✏️ Edit button */}
                {isOwn && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs ml-2 opacity-70 hover:opacity-100"
                  >
                    ✏️
                  </button>
                )}

                {/* 🗑 Delete button */}
                {isOwn && (
                  <button
                    onClick={handleDelete}
                    className="text-xs ml-1 opacity-70 hover:opacity-100"
                  >
                    🗑
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}