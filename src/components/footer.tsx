import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Crafted with code & music 🎧 by Rabi Kiran 🤍
        </p>
        <div className="flex items-center gap-4">
            <Link href="https://github.com/Rabikiran67/ticket-raising-platform/tree/main" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
        </div>
      </div>
    </footer>
  );
}
