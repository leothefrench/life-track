'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  requestNotificationPermission,
  sendBrowserNotification,
} from '@/lib/notifications';

interface BudgetNotificationsProps {
  rawPercentage: number;
  totalSpent: number;
  budget: number;
  currencySymbol: string;
  tCard: any;
}

const emptySubscribe = () => () => {};

function useNotificationPermission() {
  return useSyncExternalStore(
    emptySubscribe,
    () =>
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted',
    () => false,
  );
}

export function BudgetNotifications({
  rawPercentage,
  totalSpent,
  budget,
  currencySymbol,
  tCard,
}: BudgetNotificationsProps) {
  const notificationsEnabled = useNotificationPermission();

  const isThreshold95 = rawPercentage >= 95;
  const isThreshold90 = rawPercentage >= 90 && rawPercentage < 95;
  const isThreshold80 = rawPercentage >= 80 && rawPercentage < 90;

  useEffect(() => {
    if (notificationsEnabled) {
      const last = localStorage.getItem('life_track_last_notified_threshold');
      let current = '';
      if (rawPercentage >= 95) current = '95';
      else if (rawPercentage >= 90) current = '90';
      else if (rawPercentage >= 80) current = '80';

      if (current && current !== last) {
        sendBrowserNotification(tCard.notifWarningTitle(current), {
          body: tCard.notifWarningBody(
            Math.round(rawPercentage),
            totalSpent.toFixed(2),
            budget.toFixed(2),
            currencySymbol,
          ),
        });
        localStorage.setItem('life_track_last_notified_threshold', current);
      }
    }
  }, [
    rawPercentage,
    totalSpent,
    budget,
    currencySymbol,
    notificationsEnabled,
    tCard,
  ]);

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      sendBrowserNotification(tCard.notifEnabledTitle, {
        body: tCard.notifEnabledBody,
      });
      // Force le re-render en rechargeant l'état
      window.location.reload();
    }
  };

  if (!notificationsEnabled) {
    return (
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-blue-500" />
          {tCard.enableAlerts}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleEnableNotifications}
          className="h-7 text-xs px-2.5 rounded-full"
        >
          {tCard.activateBtn}
        </Button>
      </div>
    );
  }

  if (isThreshold80 || isThreshold90 || isThreshold95) {
    return (
      <div className="mt-3 p-2.5 rounded-lg bg-card/60 border border-border/60 text-xs flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <p className="text-muted-foreground">
          {isThreshold95
            ? tCard.alert95
            : isThreshold90
            ? tCard.alert90
            : tCard.alert80}
        </p>
      </div>
    );
  }

  return null;
}
