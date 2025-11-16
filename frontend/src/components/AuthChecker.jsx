import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * AuthChecker
 * - Redirects logged-in users away from /auth (Sign In / Sign Up)
 * - Allows only new or logged-out users to access AuthPage
 */
export default function AuthChecker() {
  const token = sessionStorage.getItem("token");

  // ✅ If token exists, user is already logged in — redirect to home
  if (token) {
    return <Navigate to="/" replace />;
  }

  // 🚪 Otherwise, allow them to access Auth routes
  return <Outlet />;
}
