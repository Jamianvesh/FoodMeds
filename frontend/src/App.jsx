import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import AuthNavbar from "./components/AuthNavbar";
import Home from "./pages/GetStarted";
import About from "./pages/About";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import ResetPassword from "./pages/ResetPassword";
import AuthChecker from "./components/AuthChecker";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DietPlanPage from "./components/DietPlanPage";

function AnimatedRoutes() {
  const aboutRef = useRef(null);
  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Routes location={location} key={location.pathname}>
          {/* 🏠 Home Page */}
          <Route
            path="/"
            element={
              <>
                <Navbar onAboutClick={scrollToAbout} />
                <Home onAboutClick={scrollToAbout} />
                <div ref={aboutRef}>
                  <About />
                </div>
                <Footer />
              </>
            }
          />

          {/* 🔐 Auth Page — Only for first-time or logged-out users */}
          <Route element={<AuthChecker />}>
            <Route
              path="/auth"
              element={
                <>
                  <AuthNavbar />
                  <AuthPage />
                  <Footer />
                </>
              }
            />
          </Route>

          {/* 🔑 Reset Password Page */}
          <Route
            path="/reset-password/:token"
            element={
              <>
                <AuthNavbar />
                <ResetPassword />
                <Footer />
              </>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/diet-plan"
            element={
              <ProtectedRoute>
                <DietPlanPage />
              </ProtectedRoute> }
          />

        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
