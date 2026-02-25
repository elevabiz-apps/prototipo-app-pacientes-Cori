import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type User = {
  id: string;
  email: string;
  role: 'patient' | 'admin';
};

type AuthContextProps = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthError(error.message || 'Error al obtener sesión');
          setLoading(false);
          return;
        }

        if (session?.user) {
          const { user } = session;
          // Check if this is the admin user
          if (user.email === 'CorinaAraya@demo.com') {
            setUser({ id: user.id, email: user.email, role: 'admin' });
          } else {
            setUser({ id: user.id, email: user.email, role: 'patient' });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setAuthError('Error al verificar sesión');
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        setAuthError(error.message || 'Error al iniciar sesión');
        throw new Error(error.message || 'Error al iniciar sesión');
      }
      
      if (data.session?.user) {
        const { user } = data.session;
        // Check if this is the admin user
        if (user.email === 'CorinaAraya@demo.com') {
          setUser({ id: user.id, email: user.email, role: 'admin' });
        } else {
          setUser({ id: user.id, email: user.email, role: 'patient' });
        }
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error('Sign up error:', error);
        setAuthError(error.message || 'Error al crear cuenta');
        throw new Error(error.message || 'Error al crear cuenta');
      }
      
      if (data.session?.user) {
        const { user } = data.session;
        // Check if this is the admin user
        if (user.email === 'CorinaAraya@demo.com') {
          setUser({ id: user.id, email: user.email, role: 'admin' });
        } else {
          setUser({ id: user.id, email: user.email, role: 'patient' });
        }
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError('Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};