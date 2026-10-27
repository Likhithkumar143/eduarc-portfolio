import {
  Award,
  Bell,
  Building2,
  ChartColumn,
  Compass,
  GraduationCap,
  Headset,
  LayoutDashboard,
  Map,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  route: Route,
  users: Users,
  compass: Compass,
  shield: ShieldCheck,
  map: Map,
  video: Video,
  user: User,
  award: Award,
  bell: Bell,
  layout: LayoutDashboard,
  graduation: GraduationCap,
  chart: ChartColumn,
  headset: Headset,
  sparkles: Sparkles,
  trending: TrendingUp,
  network: Network,
  building: Building2,
};

export function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles;
  return (
    <span
      className={
        "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-brand " +
        (className ?? "")
      }
    >
      <Icon className="h-6 w-6" strokeWidth={1.75} />
    </span>
  );
}
