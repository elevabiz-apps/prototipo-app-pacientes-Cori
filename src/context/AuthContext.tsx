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

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
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
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
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
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
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
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};