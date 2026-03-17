export const AFFILIATE_LINKS: Record<string, string> = {
  ENERGY: process.env.AFFILIATE_ENERGY_URL || 'https://selectra.info',
  BANK: process.env.AFFILIATE_BANK_URL || 'https://www.boursorama.com',
  INSURANCE: process.env.AFFILIATE_INSURANCE_URL || 'https://www.lesfurets.com',
};

export function getAffiliateLink(text: string): string | null {
  const t = text.toUpperCase();

  // 1. PRIORITÉ ASSURANCE (souvent confondue avec la banque)
  if (t.match(/ASSURANCE|MUTUELLE|PREVOYANCE|AXA|ALLIANZ/)) {
    return AFFILIATE_LINKS.INSURANCE;
  }

  // 2. ÉNERGIE
  if (t.match(/EDF|TOTAL|ENGIE|ENI|IBERDROLA|ÉLECTRICITÉ|GAZ|ENERGIE|ENERGY/)) {
    return AFFILIATE_LINKS.ENERGY;
  }

  // 3. BANQUE (en dernier pour ne pas "voler" les autres)
  if (t.match(/BANQUE|FRAIS|COMMISSION|AGIO|TENUE DE COMPTE/)) {
    return AFFILIATE_LINKS.BANK;
  }

  return null;
}