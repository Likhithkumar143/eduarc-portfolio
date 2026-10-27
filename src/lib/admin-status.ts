import { queryOptions } from "@tanstack/react-query";
import { getAdminStatus } from "./admin.functions";

export const adminStatusQuery = queryOptions({
  queryKey: ["admin-status"],
  queryFn: () => getAdminStatus(),
  staleTime: 0,
});
