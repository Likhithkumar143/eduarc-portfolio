import { queryOptions } from "@tanstack/react-query";
import { getReceptionStatus, listEnquiries } from "./enquiry.functions";

export const receptionStatusQuery = queryOptions({
  queryKey: ["reception-status"],
  queryFn: async () => {
    try {
      return await getReceptionStatus();
    } catch {
      return { authenticated: false as const };
    }
  },
  staleTime: 0,
});

export const enquiriesQuery = queryOptions({
  queryKey: ["enquiries"],
  queryFn: async () => {
    try {
      return await listEnquiries();
    } catch (err: unknown) {
      console.warn("[enquiriesQuery] could not load enquiries:", err);
      return [];
    }
  },
  staleTime: 15_000,
  refetchInterval: 30_000,
});
