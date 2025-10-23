import { Home, BookOpen, MessageSquare, BarChart3, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Study", path: "/study" },
    { icon: MessageSquare, label: "AI Tutor", path: "/tutor" },
    { icon: BarChart3, label: "Progress", path: "/progress" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-morphism border-t border-border/50 md:hidden">
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-full" />
              )}
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? "bg-primary/10 scale-110" : "group-hover:bg-muted/50"
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? "glow-primary" : ""}`} />
              </div>
              <span className={`text-xs font-medium mt-1 ${isActive ? "font-semibold" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
