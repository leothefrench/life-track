'use client';

import { Wallet, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddExpenseDialog } from './add-expense-dialog';
import { PlaidLink } from './plaid-link';

export function WelcomeState({
  isPremium,
  isBankConnected,
}: {
  isPremium: boolean;
  isBankConnected: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/2 text-center space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-500/20">
        <Wallet className="h-8 w-8 text-blue-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Bienvenue sur Life-Track
        </h2>
        <p className="text-sm text-white/50 max-w-sm mx-auto">
          Votre tableau de bord est prêt. Commencez par ajouter vos premières
          dépenses pour que l&apos;IA puisse analyser votre budget.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        {/* 2. On n'affiche le bouton de liaison QUE si la banque n'est pas connectée */}
        {!isBankConnected &&
          (isPremium ? (
            <PlaidLink />
          ) : (
            <Button
              variant="outline"
              className="h-9 rounded-lg border-white/10 bg-white/5 text-white/50 cursor-not-allowed px-6 text-[10px] font-bold uppercase tracking-wider gap-2"
            >
              <Landmark className="h-4 w-4" />
              Synchro bancaire (Pro)
            </Button>
          ))}

        <AddExpenseDialog />
      </div>
    </div>
  );
}
