import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { prisma } from '@life-track/db';

export const generatePasswordResetToken = async (email: string) => {

  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
  // 1. On génère 6 chiffres aléatoires de façon sécurisée
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  // 2. Le code expire dans 5 minutes (très court pour la sécurité)
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  // 3. On vérifie s'il existe déjà un code pour cet email
  const existingToken = await prisma.twoFactorToken.findFirst({
    where: { email },
  });

  // 4. Si oui, on le supprime (nettoyage)
  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  // 5. On enregistre le nouveau code 2FA
  const twoFactorToken = await prisma.twoFactorToken.create({
    data: { email, token, expires },
  });

  return twoFactorToken;
};