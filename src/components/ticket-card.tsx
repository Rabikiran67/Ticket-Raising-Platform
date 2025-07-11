
"use client";

import { type Ticket, type Status, type Priority } from "@/lib/types";
import { useTickets } from "@/hooks/use-tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TicketCardProps {
  ticket: Ticket;
  onSelect: (ticket: Ticket) => void;
}

const getPriorityClasses = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'high': return 'border-red-500';
    case 'medium': return 'border-yellow-500';
    case 'low': return 'border-green-500';
    default: return 'border-gray-300';
  }
};

const getPriorityBadgeVariant = (priority: Ticket['priority']) => {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
};

const getStatusBadgeVariant = (status: Ticket['status']) => {
    switch (status) {
        case 'open': return 'default';
        case 'in-progress': return 'secondary';
        case 'resolved': return 'default';
        case 'closed': return 'outline';
        default: return 'outline';
      }
};

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


export function TicketCard({ ticket, onSelect }: TicketCardProps) {
  const { updateTicket, deleteTicket } = useTickets();
  const [open, setOpen] = useState(false);

  const handleStatusChange = (status: Status) => {
    updateTicket(ticket.id, { status });
  };
  
  const handlePriorityChange = (priority: Priority) => {
    updateTicket(ticket.id, { priority });
  };

  const handleDelete = async () => {
    await deleteTicket(ticket.id);
    setOpen(false);
  };

  return (
    <Card className={cn("hover:shadow-lg transition-shadow border-l-4", getPriorityClasses(ticket.priority))}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <CardTitle 
                className="text-lg cursor-pointer hover:text-primary order-2 sm:order-1"
                onClick={() => onSelect(ticket)}
            >
                {ticket.title} <span className="text-muted-foreground font-normal">#{ticket.id}</span>
            </CardTitle>
            <Badge variant={getStatusBadgeVariant(ticket.status)} className={`order-1 sm:order-2 self-start sm:self-auto ${ticket.status === 'resolved' ? 'bg-green-600' : ''}`}>
                {ticket.status.replace('-', ' ').toUpperCase()}
            </Badge>
        </div>
        <div className="text-sm text-muted-foreground pt-1">
            <span>{ticket.department}</span> &bull; <span>By: {ticket.requesterName}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{ticket.description}</p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Badge variant={getPriorityBadgeVariant(ticket.priority)} className="w-fit">
                {ticket.priority.toUpperCase()} PRIORITY
            </Badge>
          <div className="flex items-center gap-2">
            <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs">
                    <SelectValue placeholder="Update Priority" />
                </SelectTrigger>
                <SelectContent>
                    {priorityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs">
                    <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                   {statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => onSelect(ticket)}>
              View Details
            </Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this ticket? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
