import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * - Restricts access to private pages
 * - Redirects to /auth if user is not logged in
 */
export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");

  // 🧱 If no token, redirect user to login page
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ If token exists, render the protected content
  return children;
}
