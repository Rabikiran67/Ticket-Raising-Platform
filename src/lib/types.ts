
export type Priority = "low" | "medium" | "high";
export type Status = "open" | "in-progress" | "resolved" | "closed";
export type UserRole = "client" | "agent" | "admin";

export interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  department: string;
  priority: Priority;
  status: Status;
  requesterId: number;
  requesterName: string;
  requesterEmail: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string; // Should be hashed in a real app
    role: UserRole;
}
