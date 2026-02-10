import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Suspense fallback={<div>Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}