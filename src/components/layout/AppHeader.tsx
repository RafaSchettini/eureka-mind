import {
    Home,
    BookOpen,
    Brain,
    BarChart3,
    GraduationCap,
    LogOut,
    Menu,
    X,
    User
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Conteúdos", url: "/content", icon: BookOpen },
    { title: "Tutor IA", url: "/tutor", icon: Brain },
    { title: "Progresso", url: "/progress", icon: BarChart3 },
];

export function AppHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const getNavCls = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "bg-primary text-primary-foreground font-medium shadow-sm rounded-md px-3 py-2 text-sm transition-colors"
            : "hover:bg-muted text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <span className="font-bold text-lg text-foreground">Eureka AI</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {items.map((item) => (
                        <NavLink
                            key={item.title}
                            to={item.url}
                            end
                            className={({ isActive }) => getNavCls({ isActive })}
                        >
                            <div className="flex items-center gap-2">
                                <item.icon className="w-4 h-4" />
                                <span>{item.title}</span>
                            </div>
                        </NavLink>
                    ))}
                </nav>

                {/* User Menu */}
                <div className="flex items-center gap-2">
                    {/* Desktop User Menu */}
                    <div className="hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        <p className="font-medium">{user?.user_metadata?.full_name || 'Usuário'}</p>
                                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sair</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        className="md:hidden"
                        size="sm"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <nav className="container px-4 py-4 space-y-2">
                        {items.map((item) => (
                            <NavLink
                                key={item.title}
                                to={item.url}
                                end
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive
                                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span>{item.title}</span>
                            </NavLink>
                        ))}

                        {/* Mobile User Info */}
                        <div className="pt-4 border-t border-border">
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                <p className="font-medium text-foreground">
                                    {user?.user_metadata?.full_name || 'Usuário'}
                                </p>
                                <p className="truncate">{user?.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-left px-3 py-2"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}