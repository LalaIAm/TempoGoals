import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface EmailVerificationProps {
  email?: string;
  isVerified?: boolean;
  isLoading?: boolean;
  progress?: number;
  onResendEmail?: () => Promise<void>;
}

const EmailVerification = ({
  email = "user@example.com",
  isVerified = false,
  isLoading = false,
  progress = 0,
  onResendEmail = async () => {},
}: EmailVerificationProps) => {
  const [resending, setResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationState, setVerificationState] = useState({
    isVerifying: false,
    isComplete: false,
    error: null as string | null,
  });

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (type === "email_verification" && token) {
        setVerificationState((prev) => ({ ...prev, isVerifying: true }));
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
          });

          if (error) throw error;

          setVerificationState((prev) => ({
            ...prev,
            isComplete: true,
            isVerifying: false,
          }));

          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified.",
          });

          // Redirect to login after a short delay
          setTimeout(() => {
            navigate("/auth");
          }, 2000);
        } catch (error) {
          setVerificationState((prev) => ({
            ...prev,
            isVerifying: false,
            error:
              error instanceof Error ? error.message : "Verification failed",
          }));

          toast({
            title: "Verification Failed",
            description:
              error instanceof Error ? error.message : "Failed to verify email",
            variant: "destructive",
          });
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate, toast]);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await onResendEmail();
      toast({
        title: "Email Sent",
        description: "Verification email has been resent.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  if (verificationState.isVerifying) {
    return (
      <Card className="w-[400px] bg-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verifying Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-center text-muted-foreground">
            Please wait while we verify your email...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (verificationState.isComplete) {
    return (
      <Card className="w-[400px] bg-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Email Verified
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <p className="text-center text-muted-foreground">
            Your email has been successfully verified. Redirecting to login...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (verificationState.error) {
    return (
      <Card className="w-[400px] bg-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verification Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <p className="text-center text-muted-foreground">
            {verificationState.error}
          </p>
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Return to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[400px] bg-background">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Email Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          {isVerified ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : (
            <Mail className="h-16 w-16 text-primary" />
          )}
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">
            {isVerified ? "Email Verified" : "Check Your Email"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isVerified
              ? "Your email has been successfully verified."
              : `We sent a verification link to ${email}. Please check your email and click the link to verify your account.`}
          </p>
        </div>

        {!isVerified && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Verification Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking verification status...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-2 rounded-lg border p-3 bg-muted/50">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Haven't received the email?</p>
                    <p className="text-muted-foreground">
                      Check your spam folder or click the button below to resend
                      the verification email.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResendEmail}
                  disabled={resending}
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
