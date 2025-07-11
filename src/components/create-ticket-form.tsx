"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Wand2, Loader2 } from "lucide-react";

import { useTickets } from "@/hooks/use-tickets";
import { suggestDepartment } from "@/ai/flows/suggest-department";

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
  requesterName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  requesterEmail: z.string().email({ message: "Please enter a valid email address." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  department: z.string({ required_error: "Please select a department." }),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

export function CreateTicketForm() {
  const router = useRouter();
  const { createTicket } = useTickets();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requesterName: "",
      requesterEmail: "",
      title: "",
      priority: "medium",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await createTicket(values);
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

  const handleSuggestDepartment = async () => {
    const description = form.getValues("description");
    if (!description || description.length < 10) {
      form.setError("description", { type: "manual", message: "Please enter a description of at least 10 characters to get a suggestion." });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await suggestDepartment({ description });
      if (result.department && departments.includes(result.department)) {
        form.setValue("department", result.department, { shouldValidate: true });
        toast({
          title: "Department Suggested!",
          description: `We've selected the ${result.department} department for you. ${result.justification}`,
        });
      } else {
         toast({
          title: "Suggestion Complete",
          description: `AI suggested: ${result.department}. Please select a department from the list.`,
        });
      }
    } catch (error) {
      toast({
        title: "Suggestion Failed",
        description: "Could not get an AI suggestion. Please select a department manually.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Create New Ticket</CardTitle>
        <CardDescription>Report an issue or request support by filling out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="requesterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requesterEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <div className="flex items-center gap-2">
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
                      <Button type="button" variant="outline" size="icon" onClick={handleSuggestDepartment} disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        <span className="sr-only">Suggest Department</span>
                      </Button>
                    </div>
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
