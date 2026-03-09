'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { syncTransactions } from '@/app/actions/plaid';
import { toast } from 'sonner';

export function SyncButton() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const result = await syncTransactions();
      if (result.success) {
        toast.success(`${result.count} transactions récupérées !`);
      } else {
        toast.error(result.error || 'Erreur de synchronisation');
      }
    } catch (error) {
      toast.error('Une erreur technique est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={loading}
      variant="outline"
      className="gap-2 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 h-8 text-[10px] font-bold uppercase tracking-wider"
    >
      <Zap className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
      {loading ? 'Synchronisation...' : 'Synchroniser mes dépenses'}
    </Button>
  );
}
