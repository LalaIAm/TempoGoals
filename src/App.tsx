import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import AuthPage from "./components/auth/AuthPage";
import ProfilePage from "./components/profile/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthGuard from "./components/auth/AuthGuard";
import EmailVerification from "./components/auth/EmailVerification";
import PasswordReset from "./components/auth/PasswordReset";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import GoalCoach from "./components/ai-coach/GoalCoach";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <p>Loading...</p>
            </div>
          }
        >
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/verify" element={<EmailVerification />} />
            <Route path="/auth/reset-password" element={<PasswordReset />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <GoalCoach />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
