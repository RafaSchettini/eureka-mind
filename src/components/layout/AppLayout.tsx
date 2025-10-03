import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}