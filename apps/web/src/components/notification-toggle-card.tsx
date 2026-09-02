'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bell,
  Check,
  Smartphone,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import {
  requestNotificationPermission,
  sendBrowserNotification,
} from '@/lib/notifications';
import { useI18n } from '@/lib/i18n/i18n-context';

export function NotificationToggleCard() {
  const { currencySymbol } = useI18n();
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [budget, setBudget] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('life_track_monthly_budget');
      if (saved) return saved;
    }
    return '1500';
  });
  const [savedBudgetSuccess, setSavedBudgetSuccess] = useState(false);
  const [alert80, setAlert80] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved80 = localStorage.getItem('life_track_alert_80');
      if (saved80 !== null) return saved80 === 'true';
    }
    return true;
  });
  const [alert90, setAlert90] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved90 = localStorage.getItem('life_track_alert_90');
      if (saved90 !== null) return saved90 === 'true';
    }
    return true;
  });
  const [alert95, setAlert95] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved95 = localStorage.getItem('life_track_alert_95');
      if (saved95 !== null) return saved95 === 'true';
    }
    return true;
  });

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      sendBrowserNotification('🎉 Notifications Life-Track activées', {
        body: 'Vous recevrez des alertes en temps réel lors du franchissement de vos seuils budgétaires.',
      });
    }
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budget);
    if (!isNaN(val) && val > 0) {
      localStorage.setItem('life_track_monthly_budget', val.toString());
      setSavedBudgetSuccess(true);
      setTimeout(() => setSavedBudgetSuccess(false), 2500);
    }
  };

  const toggleThreshold = (threshold: '80' | '90' | '95') => {
    if (threshold === '80') {
      const next = !alert80;
      setAlert80(next);
      localStorage.setItem('life_track_alert_80', next.toString());
    } else if (threshold === '90') {
      const next = !alert90;
      setAlert90(next);
      localStorage.setItem('life_track_alert_90', next.toString());
    } else if (threshold === '95') {
      const next = !alert95;
      setAlert95(next);
      localStorage.setItem('life_track_alert_95', next.toString());
    }
  };

  const handleTestNotification = (pct: number) => {
    sendBrowserNotification(`⚠️ Alerte Budget Life-Track (${pct}%)`, {
      body: `Test de notification : vous avez atteint ${pct}% de votre budget mensuel (${(
        parseFloat(budget || '1500') *
        (pct / 100)
      ).toFixed(0)} ${currencySymbol}).`,
    });
  };

  return (
    <Card
      id="settings-notifications-card"
      className="border-border/50 bg-card/40"
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-base">
            Alertes & Notifications PWA
          </CardTitle>
        </div>
        <CardDescription>
          Configurez votre seuil budgétaire mensuel et vos alertes instantanées
          sur mobile & ordinateur.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Autorisation Push */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-card/60">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">
                Notifications Push du navigateur
              </p>
              <p className="text-xs text-muted-foreground">
                {permission === 'granted'
                  ? 'Actives : votre appareil recevra les alertes instantanées.'
                  : permission === 'denied'
                  ? 'Bloquées dans les paramètres de votre navigateur.'
                  : 'Autorisez les notifications pour recevoir les alertes même quand l’app est fermée.'}
              </p>
            </div>
          </div>
          {permission !== 'granted' ? (
            <Button
              onClick={handleRequestPermission}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 shrink-0 rounded-lg"
            >
              Autoriser les alertes
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              <Check className="w-3.5 h-3.5" />
              Activé
            </div>
          )}
        </div>

        {/* Configuration du plafond budgétaire */}
        <form onSubmit={handleSaveBudget} className="space-y-3">
          <label className="text-sm font-semibold text-foreground">
            Budget mensuel cible ({currencySymbol})
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="ex: 1500"
              className="max-w-xs h-10"
              min="1"
            />
            <Button
              type="submit"
              variant="secondary"
              className="h-10 text-xs px-4"
            >
              {savedBudgetSuccess ? 'Enregistré !' : 'Enregistrer le seuil'}
            </Button>
          </div>
        </form>

        {/* Seuils d'alertes 80%, 90%, 95% */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Niveaux de paliers d'avertissement
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 80% */}
            <div className="p-3 rounded-lg border border-border/50 bg-card/30 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Seuil 80%
                </span>
                <input
                  type="checkbox"
                  checked={alert80}
                  onChange={() => toggleThreshold('80')}
                  className="rounded accent-yellow-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Premier avertissement préventif
              </p>
              {permission === 'granted' && (
                <button
                  type="button"
                  onClick={() => handleTestNotification(80)}
                  className="text-[10px] text-yellow-500/80 hover:text-yellow-500 underline text-left mt-1"
                >
                  Tester l'alerte
                </button>
              )}
            </div>

            {/* 90% */}
            <div className="p-3 rounded-lg border border-border/50 bg-card/30 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Seuil 90%
                </span>
                <input
                  type="checkbox"
                  checked={alert90}
                  onChange={() => toggleThreshold('90')}
                  className="rounded accent-amber-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Alerte de vigilance renforcée
              </p>
              {permission === 'granted' && (
                <button
                  type="button"
                  onClick={() => handleTestNotification(90)}
                  className="text-[10px] text-amber-500/80 hover:text-amber-500 underline text-left mt-1"
                >
                  Tester l'alerte
                </button>
              )}
            </div>

            {/* 95% */}
            <div className="p-3 rounded-lg border border-border/50 bg-card/30 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Seuil 95%
                </span>
                <input
                  type="checkbox"
                  checked={alert95}
                  onChange={() => toggleThreshold('95')}
                  className="rounded accent-rose-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Alerte critique avant dépassement
              </p>
              {permission === 'granted' && (
                <button
                  type="button"
                  onClick={() => handleTestNotification(95)}
                  className="text-[10px] text-rose-500/80 hover:text-rose-500 underline text-left mt-1"
                >
                  Tester l'alerte
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
