import { Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopNavProps {
  title?: string;
  onMenuClick?: () => void;
}

export const TopNav = ({ title = "Dashboard", onMenuClick }: TopNavProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 glass-morphism">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick} 
              className="md:hidden"
              data-testid="button-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-gradient" data-testid="text-title">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
            >
              3
            </Badge>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-primary/10"
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
