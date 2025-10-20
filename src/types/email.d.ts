export interface Email {
  id: string;
  subject: string;
  sender: {
    name: string;
    email: string;
  };
  recipients: {
    name?: string;
    email: string;
  }[];
  body: string;
  date: string;
  category: EmailCategory;
  priority: EmailPriority;
  isRead: boolean;
  isStarred: boolean;
  aiSummary?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export type EmailCategory = 
  | 'inbox' 
  | 'sent' 
  | 'drafts' 
  | 'spam' 
  | 'work' 
  | 'personal' 
  | 'promotions' 
  | 'starred';

export type EmailPriority = 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  syncFrequency: number;
  aiModel: string;
  notifications: {
    email: boolean;
    push: boolean;
    summary: boolean;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}