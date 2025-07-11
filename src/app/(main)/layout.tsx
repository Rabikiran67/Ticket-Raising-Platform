import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TicketsProvider } from "@/context/tickets-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TicketsProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </TicketsProvider>
  );
}
