import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { getAuthErrorDetails, AuthErrorCode } from "@/lib/errors";

type Profile = Database["public"]["Tables"]["user_profiles"]["Row"];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      // For development/canvas mode, bypass auth
      if (import.meta.env.DEV) {
        setState({
          user: null,
          profile: null,
          session: null,
          loading: false,
          isAuthenticated: true, // Auto-authenticate in dev mode
        });
        return;
      }

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            profile,
            session,
            loading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    if (import.meta.env.DEV) {
      setState((prev) => ({ ...prev, isAuthenticated: true }));
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signup = async (email: string, password: string) => {
    if (import.meta.env.DEV) {
      setState((prev) => ({ ...prev, isAuthenticated: true }));
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });
      if (error) throw error;
      toast({
        title: "Welcome!",
        description: "Please check your email to verify your account",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const logout = async () => {
    if (import.meta.env.DEV) {
      setState((prev) => ({ ...prev, isAuthenticated: false }));
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const handleAuthError = (error: AuthError | Error) => {
    const errorDetails = getAuthErrorDetails(error);
    toast({
      title: "Authentication Error",
      description: errorDetails.message,
      variant: "destructive",
    });
  };

  // Stub methods for development
  const resetPassword = async () => {};
  const updatePassword = async () => {};
  const updateProfile = async () => {};
  const resendVerificationEmail = async () => {};
  const refreshSession = async () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        updateProfile,
        resendVerificationEmail,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
