import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        <p className="text-sm text-foreground">
          Crafted with code & music 🎧 by Rabi Kiran 🤍
        </p>
        <Link href="https://github.com/rabik-kiran" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
          <Github className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
        </Link>
      </div>
    </footer>
  );
}
