
"use client";

import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { type Ticket, type Comment } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

interface TicketsContextType {
  tickets: Ticket[];
  loading: boolean;
  createTicket: (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<Ticket>;
  updateTicket: (id: number, updates: Partial<Ticket>) => Promise<Ticket | null>;
  deleteTicket: (id: number) => Promise<void>;
  addComment: (ticketId: number, commentText: string, author: string) => Promise<Comment | null>;
  getTicketById: (id: number) => Ticket | undefined;
}

export const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

const TICKET_STORAGE_KEY = 'tickets';

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    try {
      const storedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
      let allTickets: Ticket[] = [];
      if (storedTickets) {
        allTickets = JSON.parse(storedTickets);
      }

      if (user) {
        if (user.role === 'client') {
          setTickets(allTickets.filter(t => t.requesterId === user.id));
        } else {
          // Admins and agents can see all tickets
          setTickets(allTickets);
        }
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Failed to load tickets from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveToStorage = useCallback((updatedTickets: Ticket[]) => {
    try {
      const storedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
      let allTickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];
      
      const updatedIds = new Set(updatedTickets.map(t => t.id));
      const otherTickets = allTickets.filter(t => !updatedIds.has(t.id));

      const finalTickets = [...otherTickets, ...updatedTickets].sort((a,b) => a.id - b.id);
      
      localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(finalTickets));
    } catch (error) {
      console.error("Failed to save tickets to localStorage", error);
    }
  }, []);

  const createTicket = useCallback(async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Ticket> => {
    return new Promise((resolve) => {
      const storedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
      const allTickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];
      const nextId = allTickets.length > 0 ? Math.max(...allTickets.map(t => t.id)) + 1 : 1;
      
      const newTicket: Ticket = {
        id: nextId,
        ...ticketData,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      };

      const updatedAllTickets = [...allTickets, newTicket];
      localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updatedAllTickets));
      
      setTickets(prev => [...prev, newTicket]);
      resolve(newTicket);
    });
  }, []);

  const updateTicket = useCallback(async (id: number, updates: Partial<Ticket>): Promise<Ticket | null> => {
    let updatedTicket: Ticket | null = null;
    
    const storedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
    let allTickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];

    const updatedAllTickets = allTickets.map(ticket => {
        if (ticket.id === id) {
            updatedTicket = { ...ticket, ...updates, updatedAt: new Date().toISOString() };
            return updatedTicket;
        }
        return ticket;
    });

    if (updatedTicket) {
        localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updatedAllTickets));
        setTickets(prev => prev.map(t => t.id === id ? updatedTicket! : t));
    }

    return updatedTicket;
  }, []);

  const deleteTicket = useCallback(async (id: number): Promise<void> => {
    return new Promise((resolve) => {
        const storedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
        let allTickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];
        const updatedAllTickets = allTickets.filter(ticket => ticket.id !== id);
        localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updatedAllTickets));

        setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== id));
        resolve();
    });
  }, []);

  const addComment = useCallback(async (ticketId: number, commentText: string, author: string): Promise<Comment | null> => {
    let newComment: Comment | null = null;

    const storedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
    let allTickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];
    
    const updatedAllTickets = allTickets.map(ticket => {
        if (ticket.id === ticketId) {
            newComment = {
                id: Date.now(),
                text: commentText,
                author: author,
                timestamp: new Date().toISOString(),
            };
            const updatedTicket = {
                ...ticket,
                comments: [...ticket.comments, newComment],
                updatedAt: new Date().toISOString(),
            };
            return updatedTicket;
        }
        return ticket;
    });

    if (newComment) {
        localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updatedAllTickets));
        setTickets(prev => prev.map(t => t.id === ticketId ? updatedAllTickets.find(ut => ut.id === ticketId)! : t));
    }
    
    return newComment;
  }, []);
  
  const getTicketById = useCallback((id: number) => {
    return tickets.find(ticket => ticket.id === id);
  }, [tickets]);

  const value = { tickets, loading, createTicket, updateTicket, deleteTicket, addComment, getTicketById };

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
}
