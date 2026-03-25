import { LoginForm } from '@/components/login-form';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.05)_0,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Suspense
          fallback={<div className="text-white/50 text-sm">Chargement...</div>}
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
