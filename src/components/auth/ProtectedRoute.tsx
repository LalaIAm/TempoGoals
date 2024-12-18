import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "../layout/Header";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user, profile, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
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
