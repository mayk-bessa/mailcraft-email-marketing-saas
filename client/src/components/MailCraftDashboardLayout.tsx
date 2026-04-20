import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BarChart3, Mail, Users, Layers, Library, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface MailCraftDashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: "dashboard" | "campaigns" | "subscribers" | "segments" | "templates";
}

export default function MailCraftDashboardLayout({
  children,
  currentPage = "dashboard",
}: MailCraftDashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/" },
    { id: "campaigns", label: "Campanhas", icon: Mail, href: "/campaigns" },
    { id: "builder", label: "Construtor", icon: Mail, href: "/builder" },
    { id: "subscribers", label: "Assinantes", icon: Users, href: "/subscribers" },
    { id: "segments", label: "Segmentos", icon: Layers, href: "/segments" },
    { id: "templates", label: "Templates", icon: Library, href: "/templates" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-border transition-all duration-300 flex flex-col shadow-sm`}
      >
        {/* Logo/Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-accent">MailCraft</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-muted rounded transition"
          >
            {sidebarOpen ? (
              <X size={20} className="text-foreground" />
            ) : (
              <Menu size={20} className="text-foreground" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Link key={item.id} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-4 space-y-3">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
            </div>
          )}
          <Button
            onClick={() => logout()}
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2"
          >
            <LogOut size={16} />
            {sidebarOpen && "Sair"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border flex items-center px-8 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">
            {navItems.find((item) => item.id === currentPage)?.label}
          </h2>
        </header>

        {/* Content */}
        <div className="p-8 bg-background min-h-[calc(100vh-4rem)]">{children}</div>
      </main>
    </div>
  );
}
