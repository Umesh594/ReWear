import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import AdminPanel from "./pages/AdminPanel";
import BrowseItems from "./pages/BrowseItems";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

export const UserContext = createContext(null); // keep context if needed

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(150);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_token");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, login, logout, userPoints, setUserPoints }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse" element={<BrowseItems />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
