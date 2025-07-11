import { CreateTicketForm } from "@/components/create-ticket-form";
import { ClientOnly } from "@/components/client-only";

export default function CreateTicketPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <ClientOnly>
        <CreateTicketForm />
      </ClientOnly>
    </div>
  );
}
