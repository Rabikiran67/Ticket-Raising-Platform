"use client";

import { useContext } from "react";
import { TicketsContext } from "@/context/tickets-context";

export function useTickets() {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }
  return context;
}
