// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  lojistaId: number | null;
  login: (token: string, user: User, lojistaId?: number) => void;
  logout: () => void;
  setLojistaId: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [lojistaId, setLojistaIdState] = useState<number | null>(
    parseInt(localStorage.getItem('lojistaId') || '0') || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    if (lojistaId) {
      localStorage.setItem('lojistaId', lojistaId.toString());
    } else {
      localStorage.removeItem('lojistaId');
    }
  }, [token, user, lojistaId]);

  const login = (newToken: string, newUser: User, newLojistaId?: number) => {
    setToken(newToken);
    setUser(newUser);
    if (newLojistaId) {
      setLojistaIdState(newLojistaId);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setLojistaIdState(null);
    navigate('/login');
  };

  const setLojistaId = (id: number) => {
    setLojistaIdState(id);
  };

  return (
    <AuthContext.Provider value={{ token, user, lojistaId, login, logout, setLojistaId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};