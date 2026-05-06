export type GameType = '王者荣耀' | '和平精英' | '三角洲行动' | '英雄联盟' | '无畏契约' | 'steam';
export type ValuationMethod = '授权估值' | '链接估值' | '综合估值' | '截图估值';
export type Page = 'home' | 'valuation' | 'form' | 'loading' | 'result' | 'tutorial-id' | 'tutorial-link' | 'mine' | 'records' | 'contact' | 'privacy' | 'login' | 'settings' | 'campHelp' | 'security' | 'chat' | 'versionDetail' | 'screenshot-form' | 'find-account-games' | 'market' | 'item-detail' | 'checkout' | 'im-trade' | 'favorites';

export interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  options?: string[];
  field?: string;
  timestamp?: string;
}

export interface UserInfo {
  nickname: string;
  phone: string;
  avatar: string;
}

export interface AccountItem {
  id: string;
  game: GameType;
  title: string;
  price: number;
  coverImage: string;
  tags: string[];
  attributes: Record<string, string>;
  isFavorite?: boolean;
}

export interface OrderItem {
  id: string;
  accountId: string;
  status: 'pending' | 'paid' | 'trading' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
}

export interface ValuationHistory {
  id: string;
  game: GameType;
  price: number;
  beatPercent: number;
  time: string;
}

export interface ValuationRecord {
  id: string;
  game: GameType;
  price: number;
  time: string;
  user: string;
}

export interface MarketData {
  date: string;
  price: number;
}
