import { createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

const defaultUser: User = {
  id: '1',
  displayName: 'Lab Administrator',
  role: 'admin'
};

interface AuthContextType {
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const contextValue: AuthContextType = {
    user: defaultUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}