import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@life-track/db';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. Chercher l'utilisateur dans la base Neon via notre package DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // 2. Vérifier si l'utilisateur existe et s'il a un mot de passe
        if (!user || !user.password) return null;

        // 3. Comparer le mot de passe tapé avec le hachage dans la base
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.language = (user as { language?: string }).language || 'fr';
      }
      if (trigger === 'update' && session?.user?.language) {
        token.language = session.user.language;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;

        // Lire la langue fraîche directement en base si nécessaire
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { language: true },
          });
          if (dbUser?.language) {
            (session.user as { language?: string }).language = dbUser.language;
          }
        } catch {
          (session.user as { language?: string }).language =
            (token.language as string) || 'fr';
        }
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
});