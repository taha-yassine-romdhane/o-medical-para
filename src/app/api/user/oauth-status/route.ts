import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const whereClause = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! };

    const user = await prisma.user.findUnique({
      where: whereClause,
      include: {
        accounts: {
          where: {
            provider: 'google',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hasGoogleOAuth: user.accounts.length > 0,
      hasPassword: !!user.password,
    });
  } catch (error) {
    console.error('Error checking OAuth status:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
