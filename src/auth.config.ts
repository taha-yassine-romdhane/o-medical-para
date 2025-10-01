import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎫 JWT callback:', { tokenExists: !!token, userExists: !!user, userId: user?.id, userRole: user?.role });

      if (user) {
        token.id = user.id;
        token.role = user.role;
        console.log('✅ Token updated:', { tokenId: token.id, tokenRole: token.role });
      } else {
        console.log('❌ User missing in JWT callback');
      }
      return token;
    },
    async session({ session, token }) {
      console.log('🔑 Session callback:', { sessionExists: !!session, tokenExists: !!token, tokenId: token?.id, tokenRole: token?.role });

      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
        console.log('✅ Session updated:', { userId: session.user.id, userRole: session.user.role });
      } else {
        console.log('❌ Session or token missing:', { session: !!session, token: !!token });
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdminDashboard = nextUrl.pathname.startsWith('/dashboard/admin');
      const isOnAuthPage = nextUrl.pathname.startsWith('/auth');

      // Debug logging
      console.log('🔐 Auth check:', {
        path: nextUrl.pathname,
        isLoggedIn,
        userRole: auth?.user?.role,
        isOnAdminDashboard,
      });

      // Allow auth pages for everyone
      if (isOnAuthPage) {
        return true;
      }

      // Protect admin dashboard (allow ADMIN and EMPLOYEE)
      if (isOnAdminDashboard) {
        if (isLoggedIn && (auth.user.role === 'ADMIN' || auth.user.role === 'EMPLOYEE')) {
          console.log('✅ Admin/Employee access granted');
          return true;
        }
        console.log('❌ Admin access denied');
        return false; // Redirect unauthenticated users to login page
      }

      // Protect other dashboard routes
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;