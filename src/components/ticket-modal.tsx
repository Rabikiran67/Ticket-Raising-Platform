
"use client";

import { useState } from "react";
import { type Ticket, type Priority, type Status } from "@/lib/types";
import { useTickets } from "@/hooks/use-tickets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface TicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const statusOptions: { value: Status; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const getPriorityBadgeVariant = (priority: Priority) => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'default';
    default: return 'default';
  }
};

const getStatusBadgeVariant = (status: Status) => {
    switch (status) {
      case 'open': return 'default';
      case 'in-progress': return 'secondary';
      case 'resolved': return 'default';
      case 'closed': return 'outline';
      default: return 'outline';
    }
  };

export function TicketModal({ ticket, onClose }: TicketModalProps) {
  const { updateTicket, addComment } = useTickets();
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);

  if (!ticket) return null;

  const handleStatusChange = (status: Status) => {
    updateTicket(ticket.id, { status });
  };
  
  const handlePriorityChange = (priority: Priority) => {
    updateTicket(ticket.id, { priority });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsAddingComment(true);
      try {
        await addComment(ticket.id, newComment.trim(), "User");
        setNewComment("");
      } finally {
        setIsAddingComment(false);
      }
    }
  };

  return (
    <Dialog open={!!ticket} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b">
          <DialogTitle className="text-xl sm:text-2xl">Ticket Details - #{ticket.id}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] sm:max-h-[80vh]">
          <div className="p-4 sm:p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-xl">{ticket.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground font-medium">Status</span>
                  <div className="mt-1"><Badge variant={getStatusBadgeVariant(ticket.status)} className={ticket.status === 'resolved' ? 'bg-green-600' : ''}>{ticket.status.replace('-', ' ').toUpperCase()}</Badge></div>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Priority</span>
                  <div className="mt-1"><Badge variant={getPriorityBadgeVariant(ticket.priority)}>{ticket.priority.toUpperCase()}</Badge></div>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Department</span>
                  <p className="mt-1 font-semibold">{ticket.department}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Created</span>
                  <p className="mt-1 font-semibold">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{ticket.description}</p>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Requester</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-semibold">{ticket.requesterName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-semibold">{ticket.requesterEmail}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Update</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <Select value={ticket.status} onValueChange={handleStatusChange}>
                        <SelectTrigger><SelectValue placeholder="Update status" /></SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                        <SelectTrigger><SelectValue placeholder="Update priority" /></SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comments & Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddComment} className="mb-6">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment or update..."
                    rows={3}
                    className="mb-3"
                  />
                  <Button type="submit" disabled={!newComment.trim() || isAddingComment}>
                    {isAddingComment ? 'Adding...' : 'Add Comment'}
                  </Button>
                </form>
                <div className="space-y-4">
                  {ticket.comments && ticket.comments.length > 0 ? (
                    [...ticket.comments].reverse().map(comment => (
                      <div key={comment.id} className="flex items-start space-x-3">
                         <Avatar>
                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-secondary p-3 rounded-lg">
                            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-1 gap-1">
                                <span className="font-semibold text-sm">{comment.author}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(comment.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-sm text-foreground">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No comments yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <DialogFooter className="p-4 sm:p-6 pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
