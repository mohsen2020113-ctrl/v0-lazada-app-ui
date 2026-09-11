'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { createShopifyCustomerToken } from './shopify';

interface AuthContextType {
    user: any | null;
    session: Session | null;
    loading: boolean;
    shopifyToken: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [shopifyToken, setShopifyToken] = useState<string | null>(null);

  useEffect(() => {
        if (!supabase) {
                setLoading(false);
                return;
        }

                supabase.auth.getSession().then(async ({ data: { session } }) => {
                        setSession(session);
                        setUser(session?.user || null);
                        if (session?.user) {
                                  const { data } = await supabase!
                                    .from('user_sessions')
                                    .select('shopify_token')
                                    .eq('user_id', session.user.id)
                                    .single();
                                  if (data?.shopify_token) setShopifyToken(data.shopify_token);
                        }
                        setLoading(false);
                });

                const {
                        data: { subscription },
                } = supabase.auth.onAuthStateChange((_event, session) => {
                        setSession(session);
                        setUser(session?.user || null);
                        if (!session) setShopifyToken(null);
                        setLoading(false);
                });

                return () => subscription?.unsubscribe();
  }, []);

                    const signIn = async (email: string, password: string) => {
                          if (!supabase) return;
                          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                          if (error) throw error;

                          try {
                                  const token = await createShopifyCustomerToken(email, password);
                                  if (token && data.user) {
                                            setShopifyToken(token);
                                            await supabase.from('user_sessions').upsert({
                                                        user_id: data.user.id,
                                                        shopify_token: token,
                                                        updated_at: new Date().toISOString(),
                                            });
                                  }
                          } catch (shopifyErr) {
                                  console.warn('[Auth] Shopify token sync failed:', shopifyErr);
                          }
                    };

  const signUp = async (email: string, password: string) => {
        if (!supabase) return;
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
  };

  const signOut = async () => {
        if (!supabase) return;
        const userId = user?.id;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        if (userId) {
                await supabase.from('user_sessions').delete().eq('user_id', userId);
        }
        setUser(null);
        setSession(null);
        setShopifyToken(null);
  };

  const signInWithGoogle = async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
  };

  return (
        <AuthContext.Provider
                value={{ user, session, loading, shopifyToken, signIn, signUp, signOut, signInWithGoogle }}
              >
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
