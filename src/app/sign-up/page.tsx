
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { JiraLogo } from "@/components/jira-logo";
import type { UserRole } from "@/lib/types";
import { ClientOnly } from "@/components/client-only";
import { GoogleIcon } from "@/components/google-icon";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["client", "agent", "admin"]),
});

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const user = await signUp({
        ...values,
        id: Date.now(), // Simple ID generation
        role: values.role as UserRole,
      });
      if (user) {
        toast({
          title: "Account Created!",
          description: "You have been successfully signed up.",
        });
        router.push("/");
      } else {
        toast({
            title: "Email already exists",
            description: "An account with this email is already registered.",
            variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <ClientOnly>
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                      <JiraLogo className="text-primary-foreground w-5 h-5"/>
                  </div>
                  <span className="font-bold text-2xl">HelpDesk</span>
              </div>
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>Fill in the details below to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="agent">Employee</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Sign Up"}
                </Button>
              </form>
            </Form>
            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-muted-foreground/20"></div>
                <span className="mx-4 text-xs uppercase text-muted-foreground">Or continue with</span>
                <div className="flex-grow border-t border-muted-foreground/20"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline">
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </ClientOnly>
    </div>
  );
}
