import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createBrandSchema = z.object({
  name: z.string().min(2),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

// GET - Fetch all brands
export async function GET(request: Request) {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({ brands }, { status: 200 });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des marques' },
      { status: 500 }
    );
  }
}

// POST - Create new brand
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createBrandSchema.parse(body);

    // Check if brand name already exists
    const existingBrand = await prisma.brand.findUnique({
      where: { name: validatedData.name },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: 'Une marque avec ce nom existe déjà' },
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

    // Create brand
    const brand = await prisma.brand.create({
      data: {
        name: validatedData.name,
        slug,
        logo: validatedData.logo,
        website: validatedData.website || null,
        isActive: validatedData.isActive,
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
        message: 'Marque créée avec succès',
        brand,
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

    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la marque' },
      { status: 500 }
    );
  }
}
