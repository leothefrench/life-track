import { LoginForm } from '@/components/login-form';
import { Suspense } from 'react'; // 1. On importe Suspense

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      {/* 2. On enveloppe le formulaire pour autoriser Next.js à le pré-calculer */}
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Chargement...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
