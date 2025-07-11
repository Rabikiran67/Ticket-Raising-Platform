"use client";

import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { type Ticket, type Comment } from "@/lib/types";

interface TicketsContextType {
  tickets: Ticket[];
  loading: boolean;
  createTicket: (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<Ticket>;
  updateTicket: (id: number, updates: Partial<Ticket>) => Promise<Ticket | null>;
  addComment: (ticketId: number, commentText: string, author: string) => Promise<Comment | null>;
  getTicketById: (id: number) => Ticket | undefined;
  deleteTicket: (id: number) => Promise<void>; // Add this
}

export const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

const TICKET_STORAGE_KEY = 'tickets';

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This now runs only on the client, after the initial render.
    setLoading(true);
    try {
      const storedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      } else {
        // Initialize with some default tickets if none are stored
        const initialTickets: Ticket[] = [
          {
            id: 1,
            title: "Cannot access billing portal",
            description: "When I try to log into the billing portal, I get a 403 Forbidden error. I've tried clearing my cache and using a different browser, but the issue persists. My user ID is 'testuser'.",
            department: "Finance",
            priority: "high",
            status: "open",
            requesterName: "Jane Doe",
            requesterEmail: "jane.doe@example.com",
            createdAt: "2024-07-22T10:00:00Z",
            updatedAt: "2024-07-22T10:00:00Z",
            comments: []
          },
          {
            id: 2,
            title: "Printer not working in the main office",
            description: "The main office printer (Model XYZ) is not responding. It shows an 'Out of Toner' message, but we just replaced the cartridge. It might be a sensor issue.",
            department: "IT Support",
            priority: "medium",
            status: "in-progress",
            requesterName: "John Smith",
            requesterEmail: "john.smith@example.com",
            createdAt: "2024-07-21T14:30:00Z",
            updatedAt: "2024-07-22T09:15:00Z",
            comments: [
              {
                id: 1,
                text: "I've checked the toner levels remotely, and they seem fine. I will come by to inspect the printer sensor this afternoon.",
                author: "IT Support",
                timestamp: "2024-07-22T09:15:00Z"
              }
            ]
          },
          {
            id: 3,
            title: "Request for new software license",
            description: "I need a license for Adobe Photoshop for a new marketing project. The project deadline is next month. Please approve this request.",
            department: "Facilities",
            priority: "low",
            status: "open",
            requesterName: "Alice Johnson",
            requesterEmail: "alice.j@example.com",
            createdAt: "2024-07-20T11:00:00Z",
            updatedAt: "2024-07-20T11:00:00Z",
            comments: []
          }
        ];
        setTickets(initialTickets);
        saveToStorage(initialTickets);
      }
    } catch (error) {
      console.error("Failed to load tickets from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = useCallback((updatedTickets: Ticket[]) => {
    try {
      localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updatedTickets));
    } catch (error) {
      console.error("Failed to save tickets to localStorage", error);
    }
  }, []);

  const createTicket = useCallback(async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Ticket> => {
    return new Promise((resolve) => {
        setTickets(prevTickets => {
            const nextId = prevTickets.length > 0 ? Math.max(...prevTickets.map(t => t.id)) + 1 : 1;
            const newTicket: Ticket = {
                id: nextId,
                ...ticketData,
                status: 'open',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                comments: []
            };
            const updatedTickets = [...prevTickets, newTicket];
            saveToStorage(updatedTickets);
            resolve(newTicket);
            return updatedTickets;
        });
    });
  }, [saveToStorage]);

  const updateTicket = useCallback(async (id: number, updates: Partial<Ticket>): Promise<Ticket | null> => {
    let updatedTicket: Ticket | null = null;
    setTickets(prevTickets => {
        const updatedTickets = prevTickets.map(ticket => {
            if (ticket.id === id) {
                updatedTicket = {
                    ...ticket,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };
                return updatedTicket;
            }
            return ticket;
        });
        if (updatedTicket) {
            saveToStorage(updatedTickets);
        }
        return updatedTickets;
    });
    return updatedTicket;
  }, [saveToStorage]);

  const addComment = useCallback(async (ticketId: number, commentText: string, author: string): Promise<Comment | null> => {
    let newComment: Comment | null = null;
    setTickets(prevTickets => {
        const updatedTickets = prevTickets.map(ticket => {
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
            saveToStorage(updatedTickets);
        }
        return updatedTickets;
    });
    return newComment;
  }, [saveToStorage]);
  
  const getTicketById = useCallback((id: number) => {
    return tickets.find(ticket => ticket.id === id);
  }, [tickets]);

  const deleteTicket = useCallback(async (id: number): Promise<void> => {
    setTickets(prevTickets => {
      const updatedTickets = prevTickets.filter(ticket => ticket.id !== id);
      saveToStorage(updatedTickets);
      return updatedTickets;
    });
  }, [saveToStorage]);

  const value = { tickets, loading, createTicket, updateTicket, addComment, getTicketById, deleteTicket };

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
}
