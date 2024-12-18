import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "../layout/Header";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user, profile, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <>
      <Header
        user={{
          name: profile?.full_name || user?.email || "Demo User",
          email: user?.email || "demo@example.com",
          avatarUrl: profile?.avatar_url || "",
        }}
        onLogoutClick={logout}
      />
      {children}
    </>
  );
};

export default ProtectedRoute;
