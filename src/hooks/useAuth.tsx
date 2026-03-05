// src/hooks/useAuth.tsx
// src/hooks/useAuth.tsx (SOLUSI)
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode} from 'react'; // <-- PENTING: Import tipe secara terpisah
import authService from '../api/authService';

// 1. Definisikan Tipe User dan Context
interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  access_token: string;
  refresh_token?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Definisikan Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek Local Storage dan validate token saat komponen pertama kali dimuat
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          
          // Validate token dengan memanggil /me endpoint
          try {
            const profile = await authService.getMe(parsedUser.access_token);
            
            // Update user dengan data terbaru dari backend
            const updatedUser: User = {
              ...parsedUser,
              ...profile,
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          } catch (error) {
            // Token invalid atau expired, hapus dari localStorage
            console.error('Token validation failed:', error);
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Definisikan Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};