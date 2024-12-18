import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import EmailVerification from "./EmailVerification";
import { UserPlus, LogIn } from "lucide-react";

interface AuthPageProps {
  onLogin?: (values: any) => Promise<void>;
  onSignup?: (values: any) => Promise<void>;
  onResendVerification?: () => Promise<void>;
  isLoading?: boolean;
  verificationEmail?: string;
  verificationProgress?: number;
  isVerified?: boolean;
}

const AuthPage = ({
  onLogin = async () => {},
  onSignup = async () => {},
  onResendVerification = async () => {},
  isLoading = false,
  verificationEmail = "",
  verificationProgress = 0,
  isVerified = false,
}: AuthPageProps) => {
  const [showVerification, setShowVerification] = useState(false);

  const handleSignup = async (values: any) => {
    await onSignup(values);
    setShowVerification(true);
  };

  if (showVerification) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <EmailVerification
          email={verificationEmail}
          isVerified={isVerified}
          isLoading={isLoading}
          progress={verificationProgress}
          onResendEmail={onResendVerification}
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
              <LoginForm onSubmit={onLogin} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
