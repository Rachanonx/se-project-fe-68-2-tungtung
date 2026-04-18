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

export interface ReviewUser {
  _id: string;
  name: string;
  email?: string;
}

export interface ReviewProvider {
  _id: string;
  name: string;
}

export interface ReviewItem {
  _id: string;
  rating: number;
  comment: string;
  user: ReviewUser | string;
  provider: ReviewProvider | string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  count: number;
  data: ReviewItem[];
}

export interface ReviewResponse {
  success: boolean;
  data: ReviewItem;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}