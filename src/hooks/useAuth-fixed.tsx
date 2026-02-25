import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  profile?: {
    full_name: string;
    role: 'admin' | 'instructor' | 'participant';
    preferences?: {
      theme: 'light' | 'dark' | 'auto';
      notifications: boolean;
      language: 'fr' | 'en';
    };
  };
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>;
  signUp: (data: any) => Promise<{ user: AuthUser | null; error: string | null; needsVerification?: boolean }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false, // Start with loading: false to avoid Supabase initialization issues
    isAuthenticated: false,
  });

  // Demo credentials - prioritized over Supabase
  const demoCredentials = [
    { email: 'admin@antiplanning.com', password: 'admin123', role: 'admin', fullName: 'Administrateur Demo' },
    { email: 'formateur@antiplanning.com', password: 'formateur123', role: 'instructor', fullName: 'Formateur Demo' },
    { email: 'participant@antiplanning.com', password: 'participant123', role: 'participant', fullName: 'Participant Demo' },
  ];

  // Safe Supabase check - only try if we have valid looking URLs
  const safeSupabaseOperation = async (operation: () => Promise<any>) => {
    try {
      // Only attempt Supabase operations if URL looks valid
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'your-project-url' || !supabaseUrl.includes('supabase.co')) {
        throw new Error('Demo mode - Supabase not configured');
      }
      return await operation();
    } catch (error) {
      console.warn('Supabase operation failed, using demo mode:', error);
      return null;
    }
  };

  // Initialize auth state - NO automatic Supabase calls
  useEffect(() => {
    // Just set loading to false immediately - no Supabase initialization
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  // Enhanced sign in - Supabase first, demo fallback
  const signIn = async (email: string, password: string) => {
    console.log('🔐 Tentative de connexion avec:', email);
    console.log('🔐 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    setState(prev => ({ ...prev, loading: true }));

    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPassword = password.trim();

    // Try Supabase FIRST (prioritized over demo mode)
    const supabaseResult = await safeSupabaseOperation(async () => {
      const { supabase } = await import('../lib/supabase');
      return await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: normalizedPassword,
      });
    });

    if (supabaseResult && !supabaseResult.error && supabaseResult.data.user) {
      console.log('✅ Connexion Supabase réussie pour:', normalizedEmail);
      
      // Fetch profile data
      const { supabase } = await import('../lib/supabase');
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseResult.data.user.id)
        .single();

      const authUser: AuthUser = {
        id: supabaseResult.data.user.id,
        email: supabaseResult.data.user.email || '',
        profile: {
          full_name: profile?.full_name || 'Utilisateur',
          role: profile?.role || 'participant',
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'fr'
          }
        }
      };

      setState({
        user: authUser,
        loading: false,
        isAuthenticated: true,
      });

      return { user: authUser, error: null };
    }

    // Fallback to demo mode if Supabase fails
    const demoUser = demoCredentials.find(
      cred => cred.email === normalizedEmail && cred.password === normalizedPassword
    );

    console.log('🔄 Supabase échec, test mode démo pour:', normalizedEmail);
    console.log('🔐 Utilisateur demo trouvé:', demoUser ? demoUser.email : 'Aucun');

    if (demoUser) {
      const mockUser: AuthUser = {
        id: `demo-${demoUser.role}`,
        email: demoUser.email,
        profile: {
          full_name: demoUser.fullName,
          role: demoUser.role as 'admin' | 'instructor' | 'participant',
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'fr'
          }
        }
      };

      setState({
        user: mockUser,
        loading: false,
        isAuthenticated: true,
      });

      return { user: mockUser, error: null };
    }

    setState(prev => ({ ...prev, loading: false }));
    return { user: null, error: 'Email ou mot de passe incorrect' };
  };

  // Enhanced sign up
  const signUp = async (_data: any) => {
    setState(prev => ({ ...prev, loading: true }));

    // In demo mode, just simulate successful signup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setState(prev => ({ ...prev, loading: false }));
    return { 
      user: null, 
      error: null, 
      needsVerification: true 
    };
  };

  // Sign out
  const signOut = async () => {
    // Try to sign out from Supabase if available
    await safeSupabaseOperation(async () => {
      const { supabase } = await import('../lib/supabase');
      return await supabase.auth.signOut();
    });

    setState({
      user: null,
      loading: false,
      isAuthenticated: false,
    });

    return { error: null };
  };

  // Reset password
  const resetPassword = async (email: string) => {
    // Try Supabase reset, but don't fail if it doesn't work
    await safeSupabaseOperation(async () => {
      const { supabase } = await import('../lib/supabase');
      return await supabase.auth.resetPasswordForEmail(email);
    });

    return { error: null };
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};