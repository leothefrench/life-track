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
import { useI18n } from '@/lib/i18n/i18n-context';

export function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const { t } = useI18n();

  const handleSync = async () => {
    setLoading(true);
    try {
      const result = await syncTransactions();
      if (result.success) {
        toast.success(`${result.count} transactions !`);
      } else {
        toast.error(result.error || t('error'));
      }
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (
      !confirm(
        t('confirm_disconnect_bank'),
      )
    ) {
      return;
    }
    setDisconnecting(true);
    try {
      const result = await disconnectBank();
      if (result.success) {
        toast.success(t('success'));
      } else {
        toast.error(result.error || t('error'));
      }
    } catch (error) {
      toast.error(t('error'));
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
            {loading ? t('syncing_btn') : t('sync_btn')}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-black border-white/10 text-white text-[10px] uppercase font-bold"
          sideOffset={10}
        >
          Plaid (Read-only)
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
            {disconnecting ? t('disconnecting_btn') : t('disconnect_btn')}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-black border-white/10 text-white text-[10px] uppercase font-bold"
          sideOffset={10}
        >
          Remove bank link
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

