
"use client";

import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { type User } from "@/lib/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => void;
  signUp: (userData: User) => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'helpdesk_user';
const ALL_USERS_STORAGE_KEY = 'helpdesk_all_users';

const initializeUsers = () => {
    if (typeof window === 'undefined') return;

    const storedUsers = localStorage.getItem(ALL_USERS_STORAGE_KEY);
    if (!storedUsers) {
        const dummyUsers: User[] = [
            { id: 1, name: "Admin User", email: "admin@example.com", password: "password", role: "admin" },
            { id: 2, name: "Employee User", email: "agent@example.com", password: "password", role: "agent" },
            { id: 3, name: "Client User", email: "client@example.com", password: "password", role: "client" },
        ];
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(dummyUsers));
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeUsers();
    
    setLoading(true);
    try {
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from sessionStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<User | null> => {
    const storedUsers = localStorage.getItem(ALL_USERS_STORAGE_KEY);
    const allUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = allUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
        const { password, ...userToStore } = foundUser;
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
        setUser(userToStore);
        return userToStore;
    }
    
    return null;
  }, []);

  const signUp = useCallback(async (userData: User): Promise<User | null> => {
    const storedUsers = localStorage.getItem(ALL_USERS_STORAGE_KEY);
    const allUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (allUsers.some(u => u.email === userData.email)) {
        return null; // User already exists
    }
    
    allUsers.push(userData);
    localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(allUsers));

    const { password, ...userToStore } = userData;
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
    setUser(userToStore);
    return userToStore;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    router.push('/sign-in');
  }, [router]);

  const value = { user, loading, signIn, signOut, signUp };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
