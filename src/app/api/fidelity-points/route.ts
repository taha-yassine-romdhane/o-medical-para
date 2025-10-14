import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/fidelity-points - Get all users with their fidelity points (ADMIN only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          fidelityPoints: true,
          createdAt: true,
        },
        orderBy: { fidelityPoints: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching fidelity points:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fidelity points' },
      { status: 500 }
    );
  }
}

// POST /api/fidelity-points - Manually add/deduct points (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, points, description, reference } = body;

    if (!userId || points === undefined || !description) {
      return NextResponse.json(
        { error: 'userId, points, and description are required' },
        { status: 400 }
      );
    }

    const pointsNum = parseInt(points);
    if (isNaN(pointsNum)) {
      return NextResponse.json(
        { error: 'Points must be a valid number' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fidelityPoints: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if deduction would result in negative points
    if (pointsNum < 0 && user.fidelityPoints + pointsNum < 0) {
      return NextResponse.json(
        { error: 'Insufficient points. User would have negative balance.' },
        { status: 400 }
      );
    }

    // Update user points and create history record in a transaction
    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          fidelityPoints: {
            increment: pointsNum,
          },
        },
      }),
      prisma.fidelityPointHistory.create({
        data: {
          userId,
          points: pointsNum,
          type: pointsNum > 0 ? 'MANUAL_ADD' : 'MANUAL_DEDUCT',
          description,
          reference,
          createdBy: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Points updated successfully',
      user: result[0],
      history: result[1],
    });
  } catch (error) {
    console.error('Error updating fidelity points:', error);
    return NextResponse.json(
      { error: 'Failed to update fidelity points' },
      { status: 500 }
    );
  }
}
