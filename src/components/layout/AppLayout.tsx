import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-muted/50" />
              <h2 className="text-lg font-semibold text-foreground">
                Plataforma de Estudos
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}