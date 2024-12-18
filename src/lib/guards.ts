import { NavigateFunction } from "react-router-dom";

export enum RouteAccess {
  PUBLIC = "public",
  PRIVATE = "private",
  AUTH_ONLY = "auth_only", // For auth-related pages (login, signup, etc.)
}

export interface RouteGuardConfig {
  path: string;
  access: RouteAccess;
}

export const routeConfigs: RouteGuardConfig[] = [
  { path: "/auth", access: RouteAccess.AUTH_ONLY },
  { path: "/auth/verify", access: RouteAccess.PUBLIC },
  { path: "/auth/reset-password", access: RouteAccess.PUBLIC },
  { path: "/", access: RouteAccess.PRIVATE },
  { path: "/profile", access: RouteAccess.PRIVATE },
  { path: "/goals", access: RouteAccess.PRIVATE },
];

export function getRouteAccess(path: string): RouteAccess {
  const route = routeConfigs.find((config) => {
    if (config.path === path) return true;
    if (config.path.endsWith("*")) {
      return path.startsWith(config.path.slice(0, -1));
    }
    return false;
  });

  return route?.access || RouteAccess.PRIVATE;
}

export function handleAuthRedirect(
  isAuthenticated: boolean,
  path: string,
  navigate: NavigateFunction,
  returnTo?: string,
) {
  const access = getRouteAccess(path);

  // Handle authenticated users
  if (isAuthenticated) {
    if (access === RouteAccess.AUTH_ONLY) {
      // Redirect to home if trying to access auth pages while logged in
      navigate("/");
      return false;
    }
    return true;
  }

  // Handle non-authenticated users
  if (access === RouteAccess.PRIVATE) {
    // Save the intended destination
    const returnPath = returnTo || path;
    navigate("/auth", {
      replace: true,
      state: { returnTo: returnPath },
    });
    return false;
  }

  return true;
}
