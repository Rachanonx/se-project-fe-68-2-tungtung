export interface ProviderItem {
    _id: string,
    name: string,
    address: string,
    tel: string,
    __v: number,
  }
  
export interface ProviderJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: ProviderItem[]
  }

export interface BookingItem {
    user: string;
    provider: string;
    bookDate: string;
  }

export interface ChatMessage {
  _id: string;
  room: string;
  sender: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  content: string;
  status: 'sent' | 'read';
  timestamp: string;
}

export interface ChatRoom {
  _id: string;
  userName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}