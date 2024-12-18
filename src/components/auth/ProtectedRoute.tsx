import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "../layout/Header";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { handleAuthRedirect } from "@/lib/guards";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      handleAuthRedirect(
        isAuthenticated,
        location.pathname,
        navigate,
        location.state?.returnTo,
      );
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header
        user={{
          name: profile?.full_name || user?.email || "",
          email: user?.email || "",
          avatarUrl: profile?.avatar_url || "",
        }}
        onLogoutClick={logout}
      />
      {children}
    </>
  );
};

export default ProtectedRoute;
