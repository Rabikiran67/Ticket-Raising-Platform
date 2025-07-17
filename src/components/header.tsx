
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { useState } from "react";
import { ClientOnly } from "./client-only";
import { JiraLogo } from "./jira-logo";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/tickets", label: "All Tickets" },
  { href: "/board", label: "Board" },
  { href: "/analytics", label: "Analytics" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.push("/sign-in");
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                  <JiraLogo className="text-primary-foreground w-4 h-4"/>
              </div>
              <span className="hidden lg:inline font-bold text-lg">HelpDesk</span>
            </Link>
          </div>

          <ClientOnly>
            <div className="flex items-center gap-4">
               <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors text-foreground/70 hover:text-foreground",
                      pathname === item.href && "text-foreground bg-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 bg-transparent">
                         <AvatarFallback className="bg-transparent text-primary-foreground">
                            {user ? getInitials(user.name) : <UserCircle className="h-5 w-5" />}
                         </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

             <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="sr-only">Main Menu</SheetTitle>
                    <SheetDescription className="sr-only">Navigation menu for mobile devices</SheetDescription>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                            <JiraLogo className="text-primary-foreground w-4 h-4"/>
                        </div>
                        <span className="font-bold text-lg">HelpDesk</span>
                    </div>
                  </SheetHeader>
                   <div className="p-4 flex items-center gap-3">
                     <Avatar>
                       <AvatarFallback>
                          {user ? getInitials(user.name) : <UserCircle className="h-5 w-5" />}
                       </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                   </div>
                   <Separator />
                   <nav className="flex-1 flex flex-col space-y-1 p-2">
                      {navigation.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-secondary",
                              pathname === item.href && "text-foreground bg-secondary"
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                   </nav>
                   <Separator />
                    <div className="p-2">
                        <SheetClose asChild>
                            <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sign out</span>
                            </Button>
                        </SheetClose>
                    </div>
                </SheetContent>
              </Sheet>
            </div>
            </div>
          </ClientOnly>
        </div>
      </div>
    </header>
  );
}
