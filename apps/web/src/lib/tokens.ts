import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@life-track/db';

export const generatePasswordResetToken = async (email: string) => {
  // 1. On génère un code unique (UUID)
  const token = uuidv4();

  // 2. On fixe l'expiration à 1 heure (3600 * 1000 millisecondes)
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // 3. On vérifie s'il existe déjà un vieux jeton pour cet email
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  // 4. Si oui, on le supprime (nettoyage)
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  // 5. On enregistre le nouveau jeton dans Neon
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  return passwordResetToken;
};
