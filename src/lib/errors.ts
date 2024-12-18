import { AuthError } from "@supabase/supabase-js";

export enum AuthErrorCode {
  INVALID_CREDENTIALS = "invalid_credentials",
  EMAIL_NOT_CONFIRMED = "email_not_confirmed",
  USER_EXISTS = "user_exists",
  WEAK_PASSWORD = "weak_password",
  RATE_LIMIT = "rate_limit",
  NETWORK_ERROR = "network_error",
  SERVER_ERROR = "server_error",
  INVALID_EMAIL = "invalid_email",
}

export interface AuthErrorDetails {
  code: AuthErrorCode;
  message: string;
  action?: string;
}

export function getAuthErrorDetails(
  error: AuthError | Error,
): AuthErrorDetails {
  // Handle Supabase Auth specific errors
  if ("status" in error && error instanceof AuthError) {
    switch (error.status) {
      case 400:
        if (error.message.includes("Email not confirmed")) {
          return {
            code: AuthErrorCode.EMAIL_NOT_CONFIRMED,
            message: "Please verify your email address",
            action: "Check your email for the verification link",
          };
        }
        if (error.message.includes("Invalid login credentials")) {
          return {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: "Invalid email or password",
            action: "Please check your credentials and try again",
          };
        }
        if (error.message.includes("Password should be")) {
          return {
            code: AuthErrorCode.WEAK_PASSWORD,
            message: "Password is too weak",
            action:
              "Password must be at least 8 characters long with numbers and symbols",
          };
        }
        break;
      case 422:
        return {
          code: AuthErrorCode.INVALID_EMAIL,
          message: "Invalid email format",
          action: "Please enter a valid email address",
        };
      case 429:
        return {
          code: AuthErrorCode.RATE_LIMIT,
          message: "Too many attempts",
          action: "Please wait a few minutes before trying again",
        };
      case 500:
        return {
          code: AuthErrorCode.SERVER_ERROR,
          message: "Server error",
          action: "Please try again later",
        };
    }
  }

  // Handle network errors
  if (error.message.includes("fetch")) {
    return {
      code: AuthErrorCode.NETWORK_ERROR,
      message: "Network connection error",
      action: "Please check your internet connection",
    };
  }

  // Default error
  return {
    code: AuthErrorCode.SERVER_ERROR,
    message: "An unexpected error occurred",
    action: "Please try again later",
  };
}
