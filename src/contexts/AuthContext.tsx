import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'employee' | 'supervisor';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('municipal_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - replace with actual API call
    const mockUsers = {
      'admin@municipality.gov': { id: '1', name: 'أحمد المدير', role: 'supervisor' as const },
      'employee@municipality.gov': { id: '2', name: 'فاطمة الموظفة', role: 'employee' as const, department: 'الشكاوى' },
    };

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    if (mockUsers[email as keyof typeof mockUsers] && password === 'password123') {
      const userData = mockUsers[email as keyof typeof mockUsers];
      setUser(userData);
      localStorage.setItem('municipal_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('municipal_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};