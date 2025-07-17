
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useTickets } from "@/hooks/use-tickets";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const departments = [
  'IT Support', 'HR', 'Finance', 'Operations', 'Marketing', 
  'Sales', 'Customer Service', 'Facilities', 'Legal', 'Other'
];

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  department: z.string({ required_error: "Please select a department." }),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

export function CreateTicketForm() {
  const router = useRouter();
  const { createTicket } = useTickets();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      priority: "medium",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to create a ticket.",
            variant: "destructive"
        });
        return;
    }
    
    setIsSubmitting(true);
    try {
      await createTicket({
        ...values,
        requesterName: user.name,
        requesterEmail: user.email,
        requesterId: user.id,
      });
      toast({
        title: "Ticket Created!",
        description: "Your ticket has been successfully created.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Create New Ticket</CardTitle>
        <CardDescription>Report an issue or request support by filling out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the issue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Please provide detailed information about the issue, including steps to reproduce, error messages, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">🟢 Low - Minor issue</SelectItem>
                        <SelectItem value="medium">🟡 Medium - Standard request</SelectItem>
                        <SelectItem value="high">🔴 High - Urgent issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
