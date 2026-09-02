'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Edit2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  requestNotificationPermission,
  sendBrowserNotification,
} from '@/lib/notifications';

interface BudgetProgressCardProps {
  totalSpent: number;
}

export function BudgetProgressCard({ totalSpent }: BudgetProgressCardProps) {
  const { t, currencySymbol } = useI18n();
  const [budget, setBudget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('life_track_monthly_budget');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    }
    return 1500;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(() => budget.toString());
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        return Notification.permission === 'granted';
      }
      return false;
    },
  );

  const percentage = Math.min(Math.round((totalSpent / budget) * 100), 100);
  const rawPercentage = (totalSpent / budget) * 100;
  const remaining = Math.max(budget - totalSpent, 0);

  // Détection des seuils
  const isThreshold95 = rawPercentage >= 95;
  const isThreshold90 = rawPercentage >= 90 && rawPercentage < 95;
  const isThreshold80 = rawPercentage >= 80 && rawPercentage < 90;

  // Notification automatique si seuil franchi
  useEffect(() => {
    if (notificationsEnabled) {
      const lastNotifiedThreshold = localStorage.getItem(
        'life_track_last_notified_threshold',
      );
      let currentThreshold = '';

      if (rawPercentage >= 95) currentThreshold = '95';
      else if (rawPercentage >= 90) currentThreshold = '90';
      else if (rawPercentage >= 80) currentThreshold = '80';

      if (currentThreshold && currentThreshold !== lastNotifiedThreshold) {
        sendBrowserNotification(
          `⚠️ Alerte Budget Life-Track (${currentThreshold}%)`,
          {
            body: `Attention, vous avez atteint ${Math.round(
              rawPercentage,
            )}% de votre budget mensuel (${totalSpent.toFixed(
              2,
            )} / ${budget.toFixed(2)} ${currencySymbol}).`,
          },
        );
        localStorage.setItem(
          'life_track_last_notified_threshold',
          currentThreshold,
        );
      }
    }
  }, [rawPercentage, totalSpent, budget, currencySymbol, notificationsEnabled]);

  const handleSaveBudget = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
      localStorage.setItem('life_track_monthly_budget', val.toString());
      setIsEditing(false);
    }
  };

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      setNotificationsEnabled(true);
      sendBrowserNotification('🔔 Notifications activées', {
        body: 'Vous recevrez une alerte en cas de dépassement des seuils de 80%, 90% et 95% de votre budget.',
      });
    }
  };

  return (
    <Card
      id="budget-progress-card"
      className="bg-card/40 border-border/50 shadow-none overflow-hidden"
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                isThreshold95
                  ? 'bg-rose-500/10 text-rose-500'
                  : isThreshold90
                  ? 'bg-amber-500/10 text-amber-500'
                  : isThreshold80
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : 'bg-emerald-500/10 text-emerald-500'
              }`}
            >
              {isThreshold95 ? (
                <ShieldAlert className="w-5 h-5" />
              ) : isThreshold90 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : isThreshold80 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('monthly_budget')}
              </p>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={tempBudget}
                      onChange={(e) => setTempBudget(e.target.value)}
                      className="h-8 w-28 text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveBudget}
                      className="h-8 px-3 text-xs"
                    >
                      OK
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      className="h-8 px-2 text-xs"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">
                      {budget.toFixed(2)} {currencySymbol}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Modifier mon budget mensuel"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isThreshold95
                  ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                  : isThreshold90
                  ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                  : isThreshold80
                  ? 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
                  : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
              }`}
            >
              {rawPercentage.toFixed(0)}% consommé
            </span>
          </div>
        </div>

        {/* Barre de progression avec marqueurs 80%, 90%, 95% */}
        <div className="space-y-2">
          <div className="relative w-full h-3 bg-muted/40 rounded-full overflow-hidden">
            {/* Lignes de repères */}
            <div
              className="absolute top-0 bottom-0 left-[80%] w-[2px] bg-yellow-500/60 z-10"
              title="Seuil 80%"
            />
            <div
              className="absolute top-0 bottom-0 left-[90%] w-[2px] bg-amber-500/60 z-10"
              title="Seuil 90%"
            />
            <div
              className="absolute top-0 bottom-0 left-[95%] w-[2px] bg-rose-500/60 z-10"
              title="Seuil 95%"
            />

            {/* Remplissage de la jauge */}
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isThreshold95
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                  : isThreshold90
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                  : isThreshold80
                  ? 'bg-gradient-to-r from-emerald-500 to-yellow-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Légende sous la barre */}
          <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
            <span>
              Dépensé :{' '}
              <strong className="text-foreground">
                {totalSpent.toFixed(2)} {currencySymbol}
              </strong>
            </span>
            <div className="flex gap-3 text-[10px]">
              <span className="text-yellow-500">80%</span>
              <span className="text-amber-500">90%</span>
              <span className="text-rose-500">95%</span>
            </div>
            <span>
              Reste :{' '}
              <strong
                className={
                  remaining === 0 ? 'text-rose-500' : 'text-emerald-500'
                }
              >
                {remaining.toFixed(2)} {currencySymbol}
              </strong>
            </span>
          </div>
        </div>

        {/* Bannière d'avertissement ou bouton d'activation des notifications */}
        {!notificationsEnabled ? (
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-500" />
              Recevoir les alertes dépassement sur mobile
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleEnableNotifications}
              className="h-7 text-xs px-2.5 rounded-full"
            >
              Activer
            </Button>
          </div>
        ) : (
          (isThreshold80 || isThreshold90 || isThreshold95) && (
            <div className="mt-3 p-2.5 rounded-lg bg-card/60 border border-border/60 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-muted-foreground">
                {isThreshold95
                  ? 'Alerte 95% : Vous êtes très proche du plafond de votre budget mensuel.'
                  : isThreshold90
                  ? 'Attention 90% : Pensez à limiter les dépenses non indispensables.'
                  : 'Seuil 80% atteint : Gardez un œil sur les prochains débits.'}
              </p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
