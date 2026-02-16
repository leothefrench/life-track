import { NewPasswordForm } from '@/components/new-password-form';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function NewPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Suspense fallback={<div>Chargement...</div>}>
        <NewPasswordForm />
      </Suspense>
    </main>
  );
}
