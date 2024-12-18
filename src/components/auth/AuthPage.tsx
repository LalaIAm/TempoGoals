import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import EmailVerification from "./EmailVerification";
import { UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AuthPage = () => {
  const { login, signup, resendVerificationEmail, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const handleLogin = async (values: any) => {
    setIsLoggingIn(true);
    try {
      await login(values.email, values.password);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async (values: any) => {
    setIsSigningUp(true);
    try {
      await signup(values.email, values.password);
      setVerificationEmail(values.email);
      setShowVerification(true);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleResendVerification = async () => {
    if (verificationEmail) {
      await resendVerificationEmail(verificationEmail);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-background">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (showVerification) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <EmailVerification
          email={verificationEmail}
          onResendEmail={handleResendVerification}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-[450px] bg-background">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Welcome to Goal Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <LoginForm onSubmit={handleLogin} isLoading={isLoggingIn} />
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <SignupForm onSubmit={handleSignup} isLoading={isSigningUp} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
