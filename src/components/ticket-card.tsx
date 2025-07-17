
"use client";

import { type Ticket, type Status, type Priority } from "@/lib/types";
import { useTickets } from "@/hooks/use-tickets";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const { toast } = useToast();

  const handleStatusChange = (status: Status) => {
    updateTicket(ticket.id, { status });
  };
  
  const handlePriorityChange = (priority: Priority) => {
    updateTicket(ticket.id, { priority });
  };

  const handleDelete = async () => {
    try {
      await deleteTicket(ticket.id);
      toast({
        title: "Ticket Deleted",
        description: `Ticket #${ticket.id} has been successfully deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the ticket. Please try again.",
        variant: "destructive",
      });
    }
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
          <div className="flex-grow flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-full md:w-[140px] h-9 text-xs">
                    <SelectValue placeholder="Update Priority" />
                </SelectTrigger>
                <SelectContent>
                    {priorityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full md:w-[140px] h-9 text-xs">
                    <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                   {statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={() => onSelect(ticket)} className="flex-grow sm:flex-grow-0">
              View Details
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-9 w-9 flex-shrink-0">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Ticket</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the ticket
                    and remove its data from our servers.
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
