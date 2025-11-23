// src/hooks/useAuth.tsx
// src/hooks/useAuth.tsx (SOLUSI)
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react'; // <-- PENTING: Import tipe secara terpisah

// 1. Definisikan Tipe User dan Context
interface User {
  _id: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Definisikan Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek Local Storage saat komponen pertama kali dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
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