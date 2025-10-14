import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const subfamilySchema = z.object({
  reference: z.string().min(1),
  name: z.string().min(2),
  familyId: z.string(),
  description: z.string().optional(),
});

// GET - Fetch all subfamilies
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');

    const subfamilies = await prisma.subfamily.findMany({
      where: familyId ? { familyId } : undefined,
      orderBy: { name: 'asc' },
      include: {
        family: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({ subfamilies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subfamilies:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des sous-familles' },
      { status: 500 }
    );
  }
}

// POST - Create new subfamily
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = subfamilySchema.parse(body);

    // Check if reference already exists
    const existingSubfamily = await prisma.subfamily.findUnique({
      where: { reference: validatedData.reference },
    });

    if (existingSubfamily) {
      return NextResponse.json(
        { error: 'Cette référence existe déjà' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Get the highest sortOrder for this family
    const lastSubfamily = await prisma.subfamily.findFirst({
      where: { familyId: validatedData.familyId },
      orderBy: { sortOrder: 'desc' },
    });

    const sortOrder = lastSubfamily ? lastSubfamily.sortOrder + 1 : 0;

    const subfamily = await prisma.subfamily.create({
      data: {
        reference: validatedData.reference,
        name: validatedData.name,
        slug,
        description: validatedData.description,
        familyId: validatedData.familyId,
        sortOrder,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Sous-famille créée avec succès',
        subfamily,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating subfamily:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création' },
      { status: 500 }
    );
  }
}