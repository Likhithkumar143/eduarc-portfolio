import { cn } from "@/lib/utils";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("loader", className)}
      {...props}
    />
  );
}

export default Loader;
