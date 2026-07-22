'use client';

import { useState } from 'react';
import { Zap, Unplug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { syncTransactions, disconnectBank } from '@/app/actions/plaid';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

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

  const handleDisconnect = async () => {
    if (
      !confirm(
        'Voulez-vous vraiment déconnecter votre banque ? Pour la reconnecter plus tard, vous devrez refaire la procédure avec Plaid.',
      )
    ) {
      return;
    }
    setDisconnecting(true);
    try {
      const result = await disconnectBank();
      if (result.success) {
        toast.success('Banque déconnectée avec succès.');
      } else {
        toast.error(result.error || 'Erreur lors de la déconnexion');
      }
    } catch (error) {
      toast.error('Une erreur technique est survenue');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleSync}
            disabled={loading || disconnecting}
            variant="outline"
            className="gap-2 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 h-9 text-[10px] font-bold uppercase tracking-wider"
          >
            <Zap className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Synchronisation...' : 'Synchroniser'}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-black border-white/10 text-white text-[10px] uppercase font-bold"
          sideOffset={10}
        >
          Connexion sécurisée Plaid (Lecture seule)
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleDisconnect}
            disabled={loading || disconnecting}
            variant="ghost"
            className="gap-1.5 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 h-9 text-[10px] font-bold uppercase tracking-wider px-3"
          >
            <Unplug className="h-3.5 w-3.5" />
            {disconnecting ? 'Déconnexion...' : 'Déconnecter'}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-black border-white/10 text-white text-[10px] uppercase font-bold"
          sideOffset={10}
        >
          Supprime le lien bancaire
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
