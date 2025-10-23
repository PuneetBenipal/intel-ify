import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "secondary" | "success" | "warning";
}

export const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }: StatCardProps) => {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary",
    success: "bg-gradient-accent",
    warning: "from-yellow-500 to-orange-500 bg-gradient-to-br",
  };

  const iconBgClasses = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    success: "bg-success/10",
    warning: "bg-warning/10",
  };

  const iconColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
  };

  const isPositiveTrend = trend && trend.startsWith("+");

  return (
    <Card 
      className="relative overflow-hidden p-4 animate-scale-in hover:scale-105 transition-all duration-300 card-shadow border-border/50"
      data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${gradientClasses[color]} opacity-5 rounded-full -mr-12 -mt-12 blur-2xl`} />
      
      <div className="relative z-10 space-y-3">
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-xl ${iconBgClasses[color]}`}>
            <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              isPositiveTrend ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
            }`}>
              {isPositiveTrend ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl md:text-3xl font-bold tracking-tight" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
};
