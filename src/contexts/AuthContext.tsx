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

  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (session) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          session,
          loading: false,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      handleAuthError(error as AuthError);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
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

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            profile,
            session,
            loading: false,
            isAuthenticated: true,
          });
          if (event === "SIGNED_IN") {
            toast({
              title: "Welcome back!",
              description: "Successfully logged in",
            });
          }
        }
      } else if (event === "SIGNED_OUT") {
        setState({
          user: null,
          profile: null,
          session: null,
          loading: false,
          isAuthenticated: false,
        });
        toast({
          title: "Goodbye!",
          description: "Successfully logged out",
        });
      } else if (event === "USER_UPDATED") {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState((prev) => ({
            ...prev,
            user: session.user,
            profile,
            session,
          }));
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully",
          });
        }
      }
    });

    // Set up session refresh interval
    const refreshInterval = setInterval(() => {
      if (state.session) {
        refreshSession();
      }
    }, 1800000); // Refresh every 30 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  const handleAuthError = (error: AuthError | Error) => {
    const errorDetails = getAuthErrorDetails(error);
    toast({
      title: "Authentication Error",
      description: errorDetails.message,
      variant: "destructive",
    });

    if (errorDetails.action) {
      toast({
        title: "Suggested Action",
        description: errorDetails.action,
      });
    }

    if (errorDetails.code === AuthErrorCode.RATE_LIMIT) {
      console.warn("Rate limit reached");
    }

    throw error;
  };

  const login = async (email: string, password: string, remember = true) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: remember,
        },
      });
      if (error) throw error;
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signup = async (email: string, password: string) => {
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

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });
      if (error) throw error;
      toast({
        title: "Email Sent",
        description: "Verification email has been resent",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast({
        title: "Password Reset",
        description: "Check your email for password reset instructions",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Your password has been updated",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      throw new Error("No authenticated user");
    }

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", state.user.id);

      if (error) throw error;

      const updatedProfile = await fetchProfile(state.user.id);
      setState((prev) => ({ ...prev, profile: updatedProfile }));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

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
