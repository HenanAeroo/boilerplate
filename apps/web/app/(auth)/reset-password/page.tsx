"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-2xl shadow-lg p-8 bg-background">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
