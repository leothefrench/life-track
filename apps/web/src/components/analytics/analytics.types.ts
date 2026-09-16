export interface MonthlyTrendPoint {
  day: string;
  currentMonth: number;
  previousMonth: number;
}

export interface BudgetRuleSplit {
  name: string;
  value: number;
  percentage: number;
  color: string;
  targetPercent: number;
}

export interface BurnRateData {
  dailyAverage: number;
  projectedMonthEnd: number;
  budgetCap: number;
  projectedSavings: number;
  daysRemaining: number;
}

export interface AnalyticsProps {
  isPremium: boolean;
  currencySymbol: string;
  trends: MonthlyTrendPoint[];
  ruleSplit: BudgetRuleSplit[];
  burnRate: BurnRateData;
}

// Couleurs à très fort contraste pour le Dark Mode et Light Mode (WCAG AA+)
export const CHART_COLORS = {
  emerald: '#10b981', // Vert vif pour le mois en cours / économies
  slate: '#94a3b8', // Gris bleuté contrasté pour le comparatif précédent
  needs: '#3b82f6', // Bleu vif pour les Besoins (50%)
  wants: '#f59e0b', // Ambre pour les Envies (30%)
  savings: '#10b981', // Émeraude pour l'Épargne (20%)
};
