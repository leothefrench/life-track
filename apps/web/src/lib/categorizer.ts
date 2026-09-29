// apps/web/src/lib/categorizer.ts

export type Category =
  | 'LOGEMENT'
  | 'ENERGIE'
  | 'ALIMENTATION'
  | 'TRANSPORT'
  | 'ABONNEMENTS'
  | 'LOISIRS'
  | 'SANTE'
  | 'AUTRE';

export function getLocalFallbackCategory(title: string): Category {
  const t = title.toLowerCase();

  // ALIMENTATION (Fast food, supermarchés, restos, cafés)
  if (
    t.includes('kfc') ||
    t.includes('mcdonald') ||
    t.includes('mcdo') ||
    t.includes('burger') ||
    t.includes('subway') ||
    t.includes('domino') ||
    t.includes('pizza') ||
    t.includes('starbucks') ||
    t.includes('carrefour') ||
    t.includes('auchan') ||
    t.includes('leclerc') ||
    t.includes('lidl') ||
    t.includes('intermarche') ||
    t.includes('monoprix') ||
    t.includes('uber eats') ||
    t.includes('deliveroo') ||
    t.includes('restaurant') ||
    t.includes('boulangerie') ||
    t.includes('food') ||
    t.includes('coffee')
  ) {
    return 'ALIMENTATION';
  }

  // TRANSPORT (Essence, transports en commun, VTC, péages)
  if (
    t.includes('uber') ||
    t.includes('sncf') ||
    t.includes('ratp') ||
    t.includes('total') ||
    t.includes('shell') ||
    t.includes('bp ') ||
    t.includes('esso') ||
    t.includes('essence') ||
    t.includes('carburant') ||
    t.includes('peage') ||
    t.includes('vinci') ||
    t.includes('train') ||
    t.includes('taxi') ||
    t.includes('flight') ||
    t.includes('air france') ||
    t.includes('easyjet') ||
    t.includes('ryanair')
  ) {
    return 'TRANSPORT';
  }

  // ABONNEMENTS (Streaming, opérateurs mobiles & internet)
  if (
    t.includes('netflix') ||
    t.includes('spotify') ||
    t.includes('apple') ||
    t.includes('amazon prime') ||
    t.includes('prime video') ||
    t.includes('disney') ||
    t.includes('deezer') ||
    t.includes('free mobile') ||
    t.includes('orange') ||
    t.includes('sfr') ||
    t.includes('bouygues') ||
    t.includes('canal') ||
    t.includes('subscription')
  ) {
    return 'ABONNEMENTS';
  }

  // ENERGIE (Électricité, gaz, eau)
  if (
    t.includes('edf') ||
    t.includes('engie') ||
    t.includes('totalenergies') ||
    t.includes('electricite') ||
    t.includes('electricité') ||
    t.includes('gaz') ||
    t.includes('veolia') ||
    t.includes('suez') ||
    t.includes('water') ||
    t.includes('energy')
  ) {
    return 'ENERGIE';
  }

  // LOGEMENT (Loyer, syndic, charges, agences)
  if (
    t.includes('loyer') ||
    t.includes('rent') ||
    t.includes('immo') ||
    t.includes('foncia') ||
    t.includes('nexity') ||
    t.includes('housing')
  ) {
    return 'LOGEMENT';
  }

  // SANTE (Pharmacie, médecins, mutuelles)
  if (
    t.includes('pharma') ||
    t.includes('doctolib') ||
    t.includes('medecin') ||
    t.includes('hopital') ||
    t.includes('dentiste') ||
    t.includes('labo') ||
    t.includes('optique') ||
    t.includes('alan') ||
    t.includes('health')
  ) {
    return 'SANTE';
  }

  // LOISIRS (Cinéma, jeux, parcs, spectacles)
  if (
    t.includes('cinema') ||
    t.includes('ugc') ||
    t.includes('pathe') ||
    t.includes('gaumont') ||
    t.includes('theatre') ||
    t.includes('concert') ||
    t.includes('steam') ||
    t.includes('playstation') ||
    t.includes('nintendo') ||
    t.includes('fnac') ||
    t.includes('sparkfun')
  ) {
    return 'LOISIRS';
  }

  return 'AUTRE';
}
