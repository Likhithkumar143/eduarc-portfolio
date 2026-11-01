import { type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div key={pathname} className="page-enter-active w-full">
      {children}
    </div>
  );
}
