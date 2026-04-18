import { ChatMessage } from '../../interface';

interface Props {
  message: ChatMessage;
  isOwn: boolean;
}

function StatusLabel({ status }: { status: 'sent' | 'read' }) {
  return (
    <span className={`text-xs ml-1 ${status === 'read' ? 'text-blue-200' : 'text-blue-300/60'}`}>
      {status === 'read' ? 'read' : 'sent'}
    </span>
  );
}

export default function MessageBubble({ message, isOwn }: Props) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className="max-w-[75%]">
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
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
          <div className="flex items-center justify-end gap-0.5 mt-1">
            <span className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
              {time}
            </span>
            {isOwn && <StatusLabel status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
}
