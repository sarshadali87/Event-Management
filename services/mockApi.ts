
import type { User, Event, Ticket, UserRole } from '../types';

const USERS: { [key in UserRole]: User } = {
  user: { id: 'user-123', name: 'John Doe', email: 'john.doe@example.com', role: 'user' },
  organizer: { id: 'org-456', name: 'Event Organizer', email: 'admin@eventease.com', role: 'organizer' },
};

const initialEvents: Event[] = [
  { id: 'evt-1', name: 'Global Tech Summit 2024', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), location: 'Virtual', price: 100, description: 'The biggest virtual tech conference of the year. Join leaders from around the world.', imageUrl: 'https://picsum.photos/seed/tech/800/600', totalTickets: 500, bookedTickets: 250, category: 'Concerts' },
  { id: 'evt-2', name: 'Indie Music Festival', date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), location: 'Central Park, NYC', price: 75, description: 'A 3-day festival featuring the best indie bands. Food, music, and fun.', imageUrl: 'https://picsum.photos/seed/music/800/600', totalTickets: 2000, bookedTickets: 1850, category: 'Concerts' },
  { id: 'evt-3', name: 'Advanced React Workshop', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), location: 'Online', price: 250, description: 'Deep dive into advanced React patterns, hooks, and performance optimization.', imageUrl: 'https://picsum.photos/seed/react/800/600', totalTickets: 50, bookedTickets: 45, category: 'Workshops' },
  { id: 'evt-4', name: 'City Marathon 2024', date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), location: 'Downtown Metropolis', price: 50, description: 'Run through the heart of the city in our annual marathon. All levels welcome.', imageUrl: 'https://picsum.photos/seed/sports/800/600', totalTickets: 10000, bookedTickets: 8000, category: 'Sports' },
];

class MockApi {
  private listeners: (() => void)[] = [];

  constructor() {
    this.initLocalStorage();
  }

  private initLocalStorage() {
    if (!localStorage.getItem('events')) {
      localStorage.setItem('events', JSON.stringify(initialEvents));
    }
    if (!localStorage.getItem('tickets')) {
      localStorage.setItem('tickets', JSON.stringify([]));
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  onDataChange(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private getStoredEvents(): Event[] {
    return JSON.parse(localStorage.getItem('events') || '[]');
  }

  private saveEvents(events: Event[]) {
    localStorage.setItem('events', JSON.stringify(events));
    this.notifyListeners();
  }

  private getStoredTickets(): Ticket[] {
    return JSON.parse(localStorage.getItem('tickets') || '[]');
  }

  private saveTickets(tickets: Ticket[]) {
    localStorage.setItem('tickets', JSON.stringify(tickets));
    this.notifyListeners();
  }

  // Auth
  login(role: UserRole): User {
    const user = USERS[role];
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.notifyListeners();
    return user;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.notifyListeners();
  }

  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // Events
  async getEvents(): Promise<Event[]> {
    await new Promise(res => setTimeout(res, 300)); // Simulate network delay
    return this.getStoredEvents();
  }

  async createEvent(eventData: Omit<Event, 'id' | 'bookedTickets'>): Promise<Event | null> {
    await new Promise(res => setTimeout(res, 500));
    const events = this.getStoredEvents();
    const newEvent: Event = {
        ...eventData,
        id: `evt-${Date.now()}`,
        bookedTickets: 0,
    };
    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  async updateEvent(eventData: Event): Promise<Event | null> {
    await new Promise(res => setTimeout(res, 500));
    let events = this.getStoredEvents();
    const eventIndex = events.findIndex(e => e.id === eventData.id);
    if(eventIndex === -1) return null;
    events[eventIndex] = eventData;
    this.saveEvents(events);
    return eventData;
  }
  
  async deleteEvent(eventId: string): Promise<boolean> {
     await new Promise(res => setTimeout(res, 500));
    let events = this.getStoredEvents();
    const initialLength = events.length;
    events = events.filter(e => e.id !== eventId);
    if(events.length < initialLength){
        this.saveEvents(events);
        // also delete associated tickets
        let tickets = this.getStoredTickets();
        tickets = tickets.filter(t => t.eventId !== eventId);
        this.saveTickets(tickets);
        return true;
    }
    return false;
  }


  // Tickets
  async bookTicket(eventId: string, userId: string): Promise<Ticket | null> {
    await new Promise(res => setTimeout(res, 500));
    const events = this.getStoredEvents();
    const event = events.find(e => e.id === eventId);

    if (!event || event.bookedTickets >= event.totalTickets) {
      return null;
    }
    
    const tickets = this.getStoredTickets();
    // check if user already booked this event
    if(tickets.some(t => t.eventId === eventId && t.userId === userId)){
        // In a real app this would be an error. For simplicity, we just return null.
        return null; 
    }

    event.bookedTickets++;
    this.saveEvents(events);

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      eventId,
      userId,
      qrCodeValue: `eventease-ticket:${Date.now()}-${eventId}-${userId}`,
      status: 'valid',
      eventName: event.name,
      eventDate: event.date,
    };

    tickets.push(newTicket);
    this.saveTickets(tickets);
    return newTicket;
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    await new Promise(res => setTimeout(res, 300));
    const tickets = this.getStoredTickets();
    return tickets.filter(ticket => ticket.userId === userId);
  }
  
  async validateTicket(qrCodeValue: string): Promise<{ status: 'success' | 'error', message: string, ticket?: Ticket }> {
    await new Promise(res => setTimeout(res, 500));
    const tickets = this.getStoredTickets();
    const ticketIndex = tickets.findIndex(t => t.qrCodeValue === qrCodeValue);

    if (ticketIndex === -1) {
      return { status: 'error', message: 'Invalid Ticket: Not found.' };
    }

    const ticket = tickets[ticketIndex];
    if (ticket.status === 'used') {
      return { status: 'error', message: `Ticket Already Used for ${ticket.eventName}.` };
    }

    ticket.status = 'used';
    tickets[ticketIndex] = ticket;
    this.saveTickets(tickets);
    return { status: 'success', message: `Valid Entry for ${ticket.eventName}!`, ticket };
  }
}

export const mockApi = new MockApi();
