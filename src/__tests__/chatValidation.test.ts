import { ChatMessage } from '../../interface';

// Pure validation helpers — same rules enforced by backend
const MAX_CONTENT_LENGTH = 1000;

function validateMessageContent(content: unknown): string | null {
  if (typeof content !== 'string') return 'Content must be a string';
  if (content.trim().length === 0) return 'Message content cannot be empty';
  if (content.trim().length > MAX_CONTENT_LENGTH)
    return `Message cannot exceed ${MAX_CONTENT_LENGTH} characters`;
  return null;
}

function isValidChatMessage(msg: unknown): msg is ChatMessage {
  if (!msg || typeof msg !== 'object') return false;
  const m = msg as Record<string, unknown>;
  return (
    typeof m._id === 'string' &&
    typeof m.room === 'string' &&
    typeof m.sender === 'string' &&
    typeof m.senderName === 'string' &&
    (m.senderRole === 'user' || m.senderRole === 'admin') &&
    typeof m.content === 'string' &&
    (m.status === 'sent' || m.status === 'read') &&
    typeof m.timestamp === 'string'
  );
}

describe('validateMessageContent', () => {
  it('accepts a normal message', () => {
    expect(validateMessageContent('Hello, I need help')).toBeNull();
  });

  it('rejects an empty string', () => {
    expect(validateMessageContent('')).not.toBeNull();
  });

  it('rejects a whitespace-only string', () => {
    expect(validateMessageContent('   ')).not.toBeNull();
  });

  it('rejects a message over 1000 characters', () => {
    expect(validateMessageContent('a'.repeat(1001))).not.toBeNull();
  });

  it('accepts a message of exactly 1000 characters', () => {
    expect(validateMessageContent('a'.repeat(1000))).toBeNull();
  });

  it('rejects non-string input', () => {
    expect(validateMessageContent(null)).not.toBeNull();
    expect(validateMessageContent(42)).not.toBeNull();
    expect(validateMessageContent(undefined)).not.toBeNull();
  });

  it('trims whitespace before length check', () => {
    // 998 spaces + 1 char = still valid after trim
    expect(validateMessageContent(' '.repeat(998) + 'hi')).toBeNull();
  });
});

describe('isValidChatMessage', () => {
  const validMessage: ChatMessage = {
    _id: 'msg-123',
    room: 'user-456',
    sender: 'user-456',
    senderName: 'Alice',
    senderRole: 'user',
    content: 'Hello',
    status: 'sent',
    timestamp: new Date().toISOString(),
  };

  it('returns true for a valid message object', () => {
    expect(isValidChatMessage(validMessage)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidChatMessage(null)).toBe(false);
  });

  it('returns false when senderRole is invalid', () => {
    expect(isValidChatMessage({ ...validMessage, senderRole: 'moderator' })).toBe(false);
  });

  it('returns false when status is invalid', () => {
    expect(isValidChatMessage({ ...validMessage, status: 'pending' })).toBe(false);
  });

  it('returns false when required field is missing', () => {
    const { content, ...withoutContent } = validMessage;
    expect(isValidChatMessage(withoutContent)).toBe(false);
  });

  it('accepts senderRole admin', () => {
    expect(isValidChatMessage({ ...validMessage, senderRole: 'admin' })).toBe(true);
  });

  it('accepts status read', () => {
    expect(isValidChatMessage({ ...validMessage, status: 'read' })).toBe(true);
  });
});
