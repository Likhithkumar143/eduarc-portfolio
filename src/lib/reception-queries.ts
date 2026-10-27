import { queryOptions } from "@tanstack/react-query";
import { getReceptionStatus, listEnquiries } from "./enquiry.functions";

export const receptionStatusQuery = queryOptions({
  queryKey: ["reception-status"],
  queryFn: () => getReceptionStatus(),
  staleTime: 0,
});

export const enquiriesQuery = queryOptions({
  queryKey: ["enquiries"],
  queryFn: () => listEnquiries(),
  staleTime: 15_000,
  refetchInterval: 30_000,
});
