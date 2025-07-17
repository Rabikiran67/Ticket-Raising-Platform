import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TicketsProvider } from "@/context/tickets-context";
import { AuthProvider } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/protected-route";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <TicketsProvider>
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ProtectedRoute>
      </TicketsProvider>
    </AuthProvider>
  );
}
