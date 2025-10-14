import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    console.log('🔍 Session debug:', {
      sessionExists: !!session,
      sessionUserExists: !!session?.user,
      sessionUserId: session?.user?.id,
      sessionUserEmail: session?.user?.email,
      sessionUserRole: session?.user?.role,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Fallback to email if id is not available (for old JWT tokens)
    const whereClause = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! };

    console.log('🔎 Querying user with:', whereClause);

    const user = await prisma.user.findUnique({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        region: true,
        dateOfBirth: true,
        gender: true,
        fidelityPoints: true,
        createdAt: true,
        addresses: {
          orderBy: { id: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, region, dateOfBirth, gender } = body;

    const whereClause = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! };

    const user = await prisma.user.update({
      where: whereClause,
      data: {
        firstName,
        lastName,
        phone,
        region,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}
