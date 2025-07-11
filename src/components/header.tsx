
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { useState } from "react";
import { ClientOnly } from "./client-only";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/tickets", label: "All Tickets" },
  { href: "/board", label: "Board" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                  <Ticket className="text-primary-foreground w-4 h-4"/>
              </div>
              <span className="font-bold text-lg">HelpDesk</span>
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
             <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs p-0">
                   <div className="flex items-center gap-2 p-4 border-b">
                      <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                          <Ticket className="text-primary-foreground w-4 h-4"/>
                      </div>
                      <span className="font-bold text-lg">HelpDesk</span>
                   </div>
                   <nav className="flex flex-col space-y-1 p-2">
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
