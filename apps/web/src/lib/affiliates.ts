export const AFFILIATE_LINKS: Record<string, string> = {
  ENERGY: process.env.AFFILIATE_ENERGY_URL || 'https://selectra.info',
  BANK: process.env.AFFILIATE_BANK_URL || 'https://www.boursorama.com',
  INSURANCE: process.env.AFFILIATE_INSURANCE_URL || 'https://www.lesfurets.com',
  TELECOM: process.env.AFFILIATE_TELECOM_URL || 'https://www.ariase.com', // Ajout Télécom
};

export function getAffiliateLink(categoryOrText: string): string | null {
  const t = categoryOrText.toUpperCase();

  // 1. VÉRIFICATION PAR CATÉGORIE DIRECTE (Si l'IA renvoie ENERGY, TELECOM, etc.)
  if (AFFILIATE_LINKS[t]) {
    return AFFILIATE_LINKS[t];
  }

  // 2. VÉRIFICATION PAR MOTS-CLÉS (Si l'IA renvoie du texte brut ou pour les libellés directs)

  // PRIORITÉ ASSURANCE
  if (t.match(/ASSURANCE|MUTUELLE|PREVOYANCE|AXA|ALLIANZ/)) {
    return AFFILIATE_LINKS.INSURANCE;
  }

  // ÉNERGIE
  if (t.match(/EDF|TOTAL|ENGIE|ENI|IBERDROLA|ÉLECTRICITÉ|GAZ|ENERGIE|ENERGY/)) {
    return AFFILIATE_LINKS.ENERGY;
  }

  // TÉLÉCOM
  if (t.match(/SFR|ORANGE|BOUYGUES|FREE|INTERNET|FORFAIT|TELECOM|MOBILE/)) {
    return AFFILIATE_LINKS.TELECOM;
  }

  // BANQUE
  if (t.match(/BANQUE|FRAIS|COMMISSION|AGIO|TENUE DE COMPTE/)) {
    return AFFILIATE_LINKS.BANK;
  }

  return null;
}
