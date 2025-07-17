
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Info, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { JiraLogo } from "@/components/jira-logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClientOnly } from "@/components/client-only";
import { GoogleIcon } from "@/components/google-icon";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const user = await signIn(values.email, values.password);
      if (user) {
        toast({
          title: "Signed In!",
          description: "Welcome back!",
        });
        router.push("/");
      } else {
        toast({
            title: "Invalid Credentials",
            description: "Please check your email and password.",
            variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
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
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-blue-500 text-blue-800">
              <Info className="h-4 w-4 !text-blue-800" />
              <AlertTitle>Demo Accounts</AlertTitle>
              <AlertDescription>
                  <p>Use any of these to log in:</p>
                  <ul className="list-disc pl-5 mt-1 text-xs">
                      <li><b>Admin:</b> admin@example.com</li>
                      <li><b>Employee:</b> agent@example.com</li>
                      <li><b>Client:</b> client@example.com</li>
                  </ul>
                  <p className="mt-2">Password is <b>password</b> for all accounts.</p>
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : "Sign In"}
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
              Don't have an account?{" "}
              <Link href="/sign-up" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </ClientOnly>
    </div>
  );
}
