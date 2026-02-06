import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  TreePine, LayoutDashboard, Users, FileText, Palette, BookOpen,
  LogOut, Loader2, ExternalLink, Menu, X
} from "lucide-react";
import { useState } from "react";
import AdminLogin from "@/pages/admin/login";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Leads", href: "/admin/leads", icon: Users },
  { title: "CMS", href: "/admin/cms", icon: FileText },
  { title: "Branding", href: "/admin/branding", icon: Palette },
  { title: "Docs", href: "/admin/docs", icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAdminAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-56 border-r bg-card flex flex-col transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
        data-testid="admin-sidebar"
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b shrink-0">
          <TreePine className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm">BrushWhackers</span>
          <button
            className="lg:hidden ml-auto p-1"
            onClick={() => setMobileOpen(false)}
            data-testid="button-close-sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setMobileOpen(false)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors
                    ${isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                  data-testid={`nav-admin-${item.title.toLowerCase()}`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.title}
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3 space-y-2">
          <Link href="/">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
              data-testid="link-view-site"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              View Site
            </button>
          </Link>
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
            data-testid="button-admin-logout"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            Log Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-14 border-b bg-card flex items-center px-4 gap-3">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-muted/50"
            onClick={() => setMobileOpen(true)}
            data-testid="button-open-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm text-muted-foreground lg:hidden font-medium">Admin</span>
          <div className="ml-auto text-sm text-muted-foreground" data-testid="text-admin-user">
            {user?.username}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
