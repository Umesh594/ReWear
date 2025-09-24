import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Recycle, Menu, X, User, LogOut, Plus, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Recycle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-foreground hover:text-primary transition-colors">
              Browse Items
            </Link>
            {user && (
              <Link to="/add-item" className="text-foreground hover:text-primary transition-colors">
                List Item
              </Link>
            )}
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/add-item" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      List Item
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="gradient-primary">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/browse" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Browse Items
              </Link>
              {user && (
                <Link to="/add-item" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                  List Item
                </Link>
              )}
              <Link to="/about" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              
              {user ? (
                <div className="pt-4 border-t space-y-3">
                  <Link to="/dashboard" className="flex items-center text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center text-foreground hover:text-primary transition-colors w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t space-y-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full gradient-primary">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
