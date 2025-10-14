import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { prisma } from './lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { User } from '@prisma/client';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  // Don't use adapter - we'll handle user creation manually in the signIn callback
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name || profile.name?.split(' ')[0] || '',
          lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || '',
          isVerified: profile.email_verified, // Use isVerified instead of emailVerified
          isActive: true,
          role: 'CLIENT', // Explicitly set role to CLIENT for all Google OAuth users
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.isActive) return null;

          // Check if user has a password (not OAuth-only user)
          if (!user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Update last login
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() },
            });

            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      // For OAuth providers
      if (account?.provider === 'google' && profile) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true },
        });

        if (existingUser) {
          // User already exists - check if this Google account is already linked
          const linkedAccount = existingUser.accounts.find(
            (acc) => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId
          );

          if (!linkedAccount) {
            // Link the Google account to the existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state as string | null,
              },
            });
          }

          // Update last login and verify user
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              lastLoginAt: new Date(),
              isVerified: true,
            },
          });

          // Set the user ID and role to the existing user's values (IMPORTANT: preserves ADMIN/EMPLOYEE roles)
          user.id = existingUser.id;
          user.role = existingUser.role;
        } else {
          // New user - create them manually
          const googleProfile = profile as any;
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              firstName: googleProfile.given_name || googleProfile.name?.split(' ')[0] || 'User',
              lastName: googleProfile.family_name || googleProfile.name?.split(' ').slice(1).join(' ') || '',
              role: 'CLIENT',
              isVerified: true,
              isActive: true,
            },
          });

          // Create the account link
          await prisma.account.create({
            data: {
              userId: newUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state as string | null,
            },
          });

          user.id = newUser.id;
          user.role = newUser.role; // Set role to CLIENT for new users
        }
      }
      return true;
    },
  },
});