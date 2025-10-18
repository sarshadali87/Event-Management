
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, Event, Ticket, ToastMessage } from '../types';
import { mockApi } from '../services/mockApi';
import { generateDescription } from '../services/geminiService';

interface AppContextType {
  user: User | null;
  login: (role: 'user' | 'organizer') => void;
  logout: () => void;
  events: Event[];
  tickets: Ticket[];
  bookTicket: (eventId: string) => Promise<Ticket | null>;
  createEvent: (event: Omit<Event, 'id' | 'bookedTickets'>) => Promise<Event | null>;
  updateEvent: (event: Event) => Promise<Event | null>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  validateTicket: (qrCodeValue: string) => Promise<{ status: 'success' | 'error', message: string, ticket?: Ticket }>;
  toast: ToastMessage | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  loading: boolean;
  generateEventDescription: (prompt: string) => Promise<string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const fetchedUser = mockApi.getCurrentUser();
    setUser(fetchedUser);

    const fetchedEvents = await mockApi.getEvents();
    setEvents(fetchedEvents);

    if (fetchedUser) {
        const fetchedTickets = await mockApi.getUserTickets(fetchedUser.id);
        setTickets(fetchedTickets);
    } else {
        setTickets([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
    
    const unsubscribe = mockApi.onDataChange(fetchAllData);
    return () => unsubscribe();
  }, [fetchAllData]);

  const login = (role: 'user' | 'organizer') => {
    const loggedInUser = mockApi.login(role);
    setUser(loggedInUser);
    fetchAllData();
  };

  const logout = () => {
    mockApi.logout();
    setUser(null);
    setTickets([]);
  };
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const bookTicket = async (eventId: string) => {
    if (!user) {
      showToast('You must be logged in to book a ticket.', 'error');
      return null;
    }
    setLoading(true);
    const newTicket = await mockApi.bookTicket(eventId, user.id);
    setLoading(false);
    if (newTicket) {
      setTickets(prev => [...prev, newTicket]);
      showToast('Ticket booked successfully!', 'success');
    } else {
      showToast('Failed to book ticket. It might be sold out.', 'error');
    }
    return newTicket;
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'bookedTickets'>) => {
    setLoading(true);
    const newEvent = await mockApi.createEvent(eventData);
    setLoading(false);
    if(newEvent){
        showToast('Event created successfully!', 'success');
    } else {
        showToast('Failed to create event.', 'error');
    }
    return newEvent;
  };
    
  const updateEvent = async (eventData: Event) => {
    setLoading(true);
    const updatedEvent = await mockApi.updateEvent(eventData);
    setLoading(false);
     if(updatedEvent){
        showToast('Event updated successfully!', 'success');
    } else {
        showToast('Failed to update event.', 'error');
    }
    return updatedEvent;
  };

  const deleteEvent = async (eventId: string) => {
    setLoading(true);
    const success = await mockApi.deleteEvent(eventId);
    setLoading(false);
     if(success){
        showToast('Event deleted successfully!', 'success');
    } else {
        showToast('Failed to delete event.', 'error');
    }
    return success;
  };

  const validateTicket = async (qrCodeValue: string) => {
    setLoading(true);
    const result = await mockApi.validateTicket(qrCodeValue);
    setLoading(false);
    showToast(result.message, result.status);
    return result;
  };
  
  const generateEventDescription = async (prompt: string) => {
    setLoading(true);
    try {
        const description = await generateDescription(prompt);
        showToast('Description generated successfully!', 'success');
        return description;
    } catch (error) {
        console.error("Error generating description:", error);
        showToast('Failed to generate description.', 'error');
        return '';
    } finally {
        setLoading(false);
    }
  };


  return (
    <AppContext.Provider value={{ user, login, logout, events, tickets, bookTicket, createEvent, updateEvent, deleteEvent, validateTicket, toast, showToast, loading, generateEventDescription }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
