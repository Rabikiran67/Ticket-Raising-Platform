
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTickets } from "@/hooks/use-tickets";
import { type Ticket } from "@/lib/types";
import { PlusCircle, BarChart2, ListChecks, Ticket as TicketIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { ClientOnly } from "@/components/client-only";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { tickets, loading } = useTickets();

  // Memoize stats calculation to avoid re-calculating on every render
  // The calculation only needs to happen if `tickets` changes
  const stats = useMemo(() => {
    // Calculate counts for each status and the total number of tickets
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const total = tickets.length;
    return { open, inProgress, resolved, total };
  }, [tickets]);

  const recentTickets = useMemo(() => {
    // Create a copy of the tickets array to avoid mutating the original
    // Sort tickets by creation date in descending order (most recent first)
    // Take the first 5 tickets from the sorted list
    return [...tickets]
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 5);
  }, [tickets]);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">You’re back! Let’s catch up</p>
        </div>
        <ClientOnly>
          <Button asChild>
            <Link href="/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Ticket
            </Link>
          </Button>
        </ClientOnly>
      </div>

      <ClientOnly>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
                <>
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </>
            ) : (
                <>
                    <StatCard title="Total Tickets" value={stats.total} icon={TicketIcon} colorClass="border-primary" />
                    <StatCard title="Open Tickets" value={stats.open} icon={BarChart2} colorClass="border-yellow-500" />
                    <StatCard title="In Progress" value={stats.inProgress} icon={ListChecks} colorClass="border-blue-500" />
                    <StatCard title="Resolved Tickets" value={stats.resolved} icon={ListChecks} colorClass="border-green-500" />
                </>
            )}
        </div>
      </ClientOnly>

      <div className="grid gap-8 lg:grid-cols-3">
          <ClientOnly>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : recentTickets.length > 0 ? (
                    <ul className="space-y-4">
                    {recentTickets.map((ticket: Ticket) => (
                        <li key={ticket.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-secondary rounded-lg">
                        <div className="flex-grow">
                            <p className="font-semibold hover:text-primary">
                                <Link href={`/tickets`}>{ticket.title}</Link>
                            </p>
                            <p className="text-sm text-muted-foreground">
                            #{ticket.id} &bull; {ticket.department} &bull; {ticket.status}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto flex-shrink-0">
                            <Link href={`/tickets`}>View</Link>
                        </Button>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center py-8">No recent tickets.</p>
                )}
                </CardContent>
            </Card>
          </ClientOnly>
          <ClientOnly>
            <Card>
                <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <Button variant="outline" asChild>
                        <Link href="/tickets">View All Tickets</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/board">Go to Workflow Board</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/analytics">View Analytics</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/create">Create New Ticket</Link>
                    </Button>
                </CardContent>
            </Card>
          </ClientOnly>
      </div>
    </div>
  );
}
