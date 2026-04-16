import { Link, useRouterState } from "@tanstack/react-router";
import { Clock, Mic } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm px-4 py-3 flex items-center justify-center">
        <h1 className="font-display text-xl font-semibold text-foreground tracking-tight">
          ভয়েস রাইটার
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border">
        <div className="flex items-stretch h-16 max-w-md mx-auto">
          <NavTab
            to="/"
            label="রেকর্ড"
            icon={<Mic size={22} />}
            active={currentPath === "/"}
            dataOcid="nav.record_tab"
          />
          <NavTab
            to="/history"
            label="ইতিহাস"
            icon={<Clock size={22} />}
            active={currentPath === "/history"}
            dataOcid="nav.history_tab"
          />
        </div>
      </nav>
    </div>
  );
}

interface NavTabProps {
  to: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  dataOcid: string;
}

function NavTab({ to, label, icon, active, dataOcid }: NavTabProps) {
  return (
    <Link
      to={to}
      className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
      data-ocid={dataOcid}
    >
      <span
        className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium font-body">{label}</span>
      {active && (
        <span className="absolute bottom-0 h-0.5 w-10 rounded-full bg-primary" />
      )}
    </Link>
  );
}
