"use client";

import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-2xl shadow-lg p-8 bg-background">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
