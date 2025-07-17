
"use client";

import { useState, useMemo } from "react";
import { useTickets } from "@/hooks/use-tickets";
import { type Ticket, type Status } from "@/lib/types";
import { TicketCard } from "@/components/ticket-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientOnly } from "@/components/client-only";
import { TicketModal } from "@/components/ticket-modal";

const statuses: Status[] = ["open", "in-progress", "resolved", "closed"];

const statusHeadings: Record<Status, string> = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

function BoardColumn({ title, tickets, loading, onSelectTicket }: { title: string; tickets: Ticket[]; loading: boolean, onSelectTicket: (ticket: Ticket) => void }) {
  return (
    <div className="flex flex-col w-full flex-shrink-0 bg-card rounded-lg p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">{title} ({tickets.length})</h2>
      <div className="flex-1 space-y-4 overflow-y-auto">
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
        ) : tickets.length > 0 ? (
          tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} onSelect={onSelectTicket} />
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p>No tickets in this stage.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { tickets, loading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const ticketsByStatus = useMemo(() => {
    const grouped: Record<Status, Ticket[]> = {
      open: [],
      "in-progress": [],
      resolved: [],
      closed: [],
    };
    tickets.forEach(ticket => {
      if (grouped[ticket.status]) {
        grouped[ticket.status].push(ticket);
      }
    });
    return grouped;
  }, [tickets]);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 flex flex-col h-full">
       <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflow Board</h1>
            <p className="text-muted-foreground">Visualize your ticket progression.</p>
        </div>
      <ClientOnly>
        <>
          <div className="flex-1 grid grid-cols-1 gap-6 pb-4">
            {statuses.map(status => (
              <BoardColumn
                key={status}
                title={statusHeadings[status]}
                tickets={ticketsByStatus[status]}
                loading={loading}
                onSelectTicket={setSelectedTicket}
              />
            ))}
          </div>
          <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
        </>
      </ClientOnly>
    </div>
  );
}
