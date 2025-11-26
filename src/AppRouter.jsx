// src/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import OnboardingPage from "./OnboardingPage";
import AuthPage from "./AuthPage";
import App from "./App";

export default function AppRouter() {
  return (
    <Routes>
      {/* Always show onboarding first  */}
      <Route path="/" element={<OnboardingPage />} />
      {/* Auth page */}
      <Route path="/auth" element={<AuthPage />} />
      {/* Main chat app */}
      <Route path="/app" element={<App />} />
      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}