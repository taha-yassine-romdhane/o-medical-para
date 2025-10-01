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