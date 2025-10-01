import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
      createdAt?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
  }
}