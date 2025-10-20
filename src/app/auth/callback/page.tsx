"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEmailStore } from "@/store/useEmailStore";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useEmailStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      // Handle authentication error
      console.error("Authentication error:", error);
      router.push("/login?error=" + encodeURIComponent(error));
      return;
    }

    if (token && user) {
      try {
        // Store the JWT token
        localStorage.setItem("token", token);
        
        // Parse and store user data
        const userData = JSON.parse(decodeURIComponent(user));
        setUser(userData);
        
        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to parse user data:", err);
        router.push("/login?error=invalid_response");
      }
    } else {
      // Missing required parameters
      router.push("/login?error=missing_parameters");
    }
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Completing authentication...</p>
        <p className="text-sm text-muted-foreground">Please wait while we sign you in.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}