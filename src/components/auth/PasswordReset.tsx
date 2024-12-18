import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import UpdatePasswordForm from "./UpdatePasswordForm";

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePassword } = useAuth();
  const [state, setState] = useState({
    isProcessing: true,
    isValid: false,
    error: null as string | null,
  });

  useEffect(() => {
    const validateResetToken = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (!token || type !== "recovery") {
        setState({
          isProcessing: false,
          isValid: false,
          error: "Invalid or expired reset link",
        });
        return;
      }

      setState({
        isProcessing: false,
        isValid: true,
        error: null,
      });
    };

    validateResetToken();
  }, [searchParams]);

  const handlePasswordUpdate = async ({ password }: { password: string }) => {
    try {
      await updatePassword(password);
      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      });
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    }
  };

  if (state.isProcessing) {
    return (
      <Card className="w-[400px] bg-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verifying Reset Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-center text-muted-foreground">
            Please wait while we verify your reset link...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!state.isValid) {
    return (
      <Card className="w-[400px] bg-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Invalid Reset Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <p className="text-center text-muted-foreground">{state.error}</p>
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Return to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <UpdatePasswordForm onSubmit={handlePasswordUpdate} />;
};

export default PasswordReset;
