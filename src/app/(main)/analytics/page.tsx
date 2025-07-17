
"use client";

import { useMemo } from "react";
import { useTickets } from "@/hooks/use-tickets";
import { type Ticket } from "@/lib/types";
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientOnly } from "@/components/client-only";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560", "#775DD0"];

export default function AnalyticsPage() {
  const { tickets, loading } = useTickets();

  const analyticsData = useMemo(() => {
    if (loading || tickets.length === 0) {
      return { byDepartment: [], byStatus: [], byPriority: [], byRequester: [] };
    }

    const byDepartment = tickets.reduce((acc, ticket) => {
      const dept = acc.find(d => d.name === ticket.department);
      if (dept) {
        dept.value++;
      } else {
        acc.push({ name: ticket.department, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

    const byStatus = tickets.reduce((acc, ticket) => {
        const status = acc.find(d => d.name === ticket.status);
        if (status) {
          status.value++;
        } else {
          acc.push({ name: ticket.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()), value: 1 });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    const byPriority = tickets.reduce((acc, ticket) => {
        const priority = acc.find(d => d.name === ticket.priority);
        if (priority) {
          priority.value++;
        } else {
          acc.push({ name: ticket.priority.replace(/\b\w/g, l => l.toUpperCase()), value: 1 });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    const byRequester = tickets.reduce((acc, ticket) => {
      const requester = acc.find(r => r.name === ticket.requesterName);
      if (requester) {
        requester.value++;
      } else {
        acc.push({ name: ticket.requesterName, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

    return { byDepartment, byStatus, byPriority, byRequester };
  }, [tickets, loading]);

  const renderLoader = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
        <Card className="lg:col-span-3"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Visualizing ticket trends and metrics.</p>
      </div>

      <ClientOnly>
        {loading ? renderLoader() : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tickets by Department</CardTitle>
                <CardDescription>Distribution of tickets across different departments.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.byDepartment} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{ 
                            background: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--foreground))"
                        }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tickets by Status</CardTitle>
                 <CardDescription>Current status of all tickets.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={analyticsData.byStatus}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {analyticsData.byStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ 
                                background: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))"
                            }}
                        />
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Ticket Priority Distribution</CardTitle>
                    <CardDescription>Breakdown of tickets by their priority level.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.byPriority} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ 
                                    background: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                    color: "hsl(var(--foreground))"
                                }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                                {analyticsData.byPriority.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Tickets by Requester</CardTitle>
                    <CardDescription>Number of tickets submitted by each requester.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.byRequester} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ 
                                    background: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                    color: "hsl(var(--foreground))"
                                }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

          </div>
        )}
      </ClientOnly>
    </div>
  );
}
