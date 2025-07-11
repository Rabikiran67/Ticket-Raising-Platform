"use client";

import { useState, useMemo } from "react";
import { useTickets } from "@/hooks/use-tickets";
import { type Ticket, type Status } from "@/lib/types";
import { TicketCard } from "@/components/ticket-card";
import { TicketModal } from "@/components/ticket-modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientOnly } from "@/components/client-only";

export default function TicketsPage() {
  const { tickets, loading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesFilter = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            String(ticket.id).includes(searchTerm);
      return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, statusFilter, searchTerm]);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">All Tickets</h1>
            <p className="text-muted-foreground">Search, filter, and manage all support requests.</p>
        </div>
        <ClientOnly>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search tickets by title, department, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as "all" | Status)}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ClientOnly>
      </div>
      <ClientOnly>
        <>
          <div className="grid gap-4 md:gap-6">
            {loading ? (
              [...Array(5)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onSelect={setSelectedTicket}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-card rounded-lg col-span-full">
                <h3 className="text-xl font-semibold">No Tickets Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>

          <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
        </>
      </ClientOnly>
    </div>
  );
}
