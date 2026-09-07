export const BUDGET_CARD_DICT = {
  fr: {
    used: 'consommé',
    spent: 'Dépensé',
    remaining: 'Reste',
    editTitle: 'Modifier mon budget mensuel',
    enableAlerts: 'Recevoir les alertes dépassement sur mobile',
    activateBtn: 'Activer',
    alert80: 'Seuil 80% atteint : Gardez un œil sur les prochains débits.',
    alert90:
      'Attention 90% : Pensez à limiter les dépenses non indispensables.',
    alert95:
      'Alerte 95% : Vous êtes très proche du plafond de votre budget mensuel.',
    notifEnabledTitle: '🔔 Notifications activées',
    notifEnabledBody:
      'Vous recevrez une alerte en cas de dépassement des seuils de 80%, 90% et 95% de votre budget.',
    notifWarningTitle: (pct: string) => `⚠️ Alerte Budget Life-Track (${pct}%)`,
    notifWarningBody: (pct: number, spent: string, b: string, sym: string) =>
      `Attention, vous avez atteint ${pct}% de votre budget mensuel (${spent} / ${b} ${sym}).`,
  },
  en: {
    used: 'used',
    spent: 'Spent',
    remaining: 'Remaining',
    editTitle: 'Edit monthly budget',
    enableAlerts: 'Get budget alert notifications on mobile',
    activateBtn: 'Enable',
    alert80: '80% threshold reached: Keep an eye on upcoming expenses.',
    alert90: 'Warning 90%: Consider limiting non-essential expenses.',
    alert95: '95% alert: You are very close to your monthly budget limit.',
    notifEnabledTitle: '🔔 Notifications enabled',
    notifEnabledBody:
      'You will receive an alert if you reach 80%, 90%, or 95% of your budget.',
    notifWarningTitle: (pct: string) => `⚠️ Life-Track Budget Alert (${pct}%)`,
    notifWarningBody: (pct: number, spent: string, b: string, sym: string) =>
      `Warning, you have reached ${pct}% of your monthly budget (${spent} / ${b} ${sym}).`,
  },
  de: {
    used: 'verbraucht',
    spent: 'Ausgegeben',
    remaining: 'Verbleibend',
    editTitle: 'Monatsbudget bearbeiten',
    enableAlerts: 'Budgetwarnungen auf dem Handy erhalten',
    activateBtn: 'Aktivieren',
    alert80:
      '80%-Schwelle erreicht: Behalten Sie die nächsten Ausgaben im Auge.',
    alert90: 'Achtung 90%: Vermeiden Sie nicht zwingend notwendige Ausgaben.',
    alert95: '95% Warnung: Sie sind kurz vor Ihrem monatlichen Budgetlimit.',
    notifEnabledTitle: '🔔 Benachrichtigungen aktiviert',
    notifEnabledBody:
      'Sie erhalten eine Warnung bei 80%, 90% und 95% Ihres Budgets.',
    notifWarningTitle: (pct: string) => `⚠️ Life-Track Budgetwarnung (${pct}%)`,
    notifWarningBody: (pct: number, spent: string, b: string, sym: string) =>
      `Achtung, Sie haben ${pct}% Ihres Monatsbudgets erreicht (${spent} / ${b} ${sym}).`,
  },
  es: {
    used: 'consumido',
    spent: 'Gastado',
    remaining: 'Restante',
    editTitle: 'Modificar presupuesto mensual',
    enableAlerts: 'Recibir alertas de presupuesto en el móvil',
    activateBtn: 'Activar',
    alert80: 'Umbral del 80% alcanzado: Vigile los próximos gastos.',
    alert90: 'Atención 90%: Considere limitar gastos no esenciales.',
    alert95: 'Alerta 95%: Está muy cerca de alcanzar su límite mensual.',
    notifEnabledTitle: '🔔 Notificaciones activadas',
    notifEnabledBody:
      'Recibirá una alerta si alcanza el 80%, 90% y 95% de su presupuesto.',
    notifWarningTitle: (pct: string) =>
      `⚠️ Alerta Presupuesto Life-Track (${pct}%)`,
    notifWarningBody: (pct: number, spent: string, b: string, sym: string) =>
      `Atención, ha alcanzado el ${pct}% de su presupuesto mensual (${spent} / ${b} ${sym}).`,
  },
  pt: {
    used: 'consumido',
    spent: 'Gasto',
    remaining: 'Restante',
    editTitle: 'Modificar orçamento mensal',
    enableAlerts: 'Receber alertas de orçamento no telemóvel',
    activateBtn: 'Ativar',
    alert80: 'Limite de 80% atingido: Fique atento às próximas despesas.',
    alert90: 'Atenção 90%: Pense em limitar despesas não essenciais.',
    alert95:
      'Alerta 95%: Está muito próximo do limite do seu orçamento mensal.',
    notifEnabledTitle: '🔔 Notificações ativadas',
    notifEnabledBody:
      'Receberá um alerta ao ultrapassar os limites de 80%, 90% et 95% do seu orçamento.',
    notifWarningTitle: (pct: string) =>
      `⚠️ Alerta Orçamento Life-Track (${pct}%)`,
    notifWarningBody: (pct: number, spent: string, b: string, sym: string) =>
      `Atenção, atingiu ${pct}% do seu orçamento mensal (${spent} / ${b} ${sym}).`,
  },
};
