import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const familySchema = z.object({
  reference: z.string().min(1),
  name: z.string().min(2),
  categoryId: z.string(),
  description: z.string().optional(),
});

// GET - Fetch all families
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const families = await prisma.family.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { name: 'asc' },
      include: {
        category: true,
        _count: {
          select: {
            products: true,
            subfamilies: true,
          },
        },
      },
    });

    return NextResponse.json({ families }, { status: 200 });
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des familles' },
      { status: 500 }
    );
  }
}

// POST - Create new family
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = familySchema.parse(body);

    // Check if reference already exists
    const existingFamily = await prisma.family.findUnique({
      where: { reference: validatedData.reference },
    });

    if (existingFamily) {
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

    // Get the highest sortOrder for this category
    const lastFamily = await prisma.family.findFirst({
      where: { categoryId: validatedData.categoryId },
      orderBy: { sortOrder: 'desc' },
    });

    const sortOrder = lastFamily ? lastFamily.sortOrder + 1 : 0;

    const family = await prisma.family.create({
      data: {
        reference: validatedData.reference,
        name: validatedData.name,
        slug,
        description: validatedData.description,
        categoryId: validatedData.categoryId,
        sortOrder,
      },
      include: {
        _count: {
          select: {
            subfamilies: true,
            products: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Famille créée avec succès',
        family,
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

    console.error('Error creating family:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création' },
      { status: 500 }
    );
  }
}