export type Priority = "low" | "medium" | "high";
export type Status = "open" | "in-progress" | "resolved" | "closed";

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
  requesterName: string;
  requesterEmail: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
