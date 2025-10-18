
export type UserRole = 'user' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  price: number;
  description: string;
  imageUrl: string;
  totalTickets: number;
  bookedTickets: number;
  category: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  qrCodeValue: string;
  status: 'valid' | 'used';
  eventName: string;
  eventDate: string;
}

export interface ToastMessage {
    message: string;
    type: 'success' | 'error' | 'info';
}
