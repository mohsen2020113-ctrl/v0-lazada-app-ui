import React, { createContext, useContext, useEffect, useState } from 'react';
import { customerLogin, customerRegister, getCustomer } from '../lib/shopify';

interface Customer { id: string; email: string; firstName: string; lastName: string; phone?: string; orders?: unknown[]; defaultAddress?: unknown; }
interface AuthState { customer: Customer | null; accessToken: string | null; loading: boolean; error: string | null; }
interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void; clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = 'lee_customer_token';
const TOKEN_EXPIRY_KEY = 'lee_token_expiry';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ customer: null, accessToken: null, loading: true, error: null });

  useEffect(() => {
    const loadToken = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (token && expiry && new Date(expiry) > new Date()) {
        try {
          const customer = await getCustomer(token);
          if (customer) { setState({ customer: customer as Customer, accessToken: token, loading: false, error: null }); return; }
        } catch { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(TOKEN_EXPIRY_KEY); }
      }
      setState(s => ({ ...s, loading: false }));
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const result = await customerLogin(email, password);
      if (result.customerUserErrors.length > 0) { setState(s => ({ ...s, loading: false, error: result.customerUserErrors[0].message })); return false; }
      if (result.customerAccessToken) {
        const { accessToken, expiresAt } = result.customerAccessToken;
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
        const customer = await getCustomer(accessToken);
        setState({ customer: customer as Customer, accessToken, loading: false, error: null });
        return true;
      }
      return false;
    } catch { setState(s => ({ ...s, loading: false, error: 'Login failed. Please try again.' })); return false; }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const result = await customerRegister(email, password, firstName, lastName);
      if (result.customerUserErrors.length > 0) { setState(s => ({ ...s, loading: false, error: result.customerUserErrors[0].message })); return false; }
      return await login(email, password);
    } catch { setState(s => ({ ...s, loading: false, error: 'Registration failed. Please try again.' })); return false; }
  };

  const logout = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(TOKEN_EXPIRY_KEY); setState({ customer: null, accessToken: null, loading: false, error: null }); };
  const clearError = () => setState(s => ({ ...s, error: null }));

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
