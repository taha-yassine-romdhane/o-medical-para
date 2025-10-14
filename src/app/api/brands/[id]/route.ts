import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateBrandSchema = z.object({
  name: z.string().min(2),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')).nullable(),
  isActive: z.boolean(),
});

// PUT - Update brand
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateBrandSchema.parse(body);

    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: 'Marque non trouvée' },
        { status: 404 }
      );
    }

    // Check if another brand with the same name exists
    const duplicateBrand = await prisma.brand.findFirst({
      where: {
        name: validatedData.name,
        id: { not: id },
      },
    });

    if (duplicateBrand) {
      return NextResponse.json(
        { error: 'Une autre marque avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Generate new slug if name changed
    const slug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug,
        logo: validatedData.logo,
        website: validatedData.website,
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
        message: 'Marque mise à jour avec succès',
        brand,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Delete brand
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: 'Marque non trouvée' },
        { status: 404 }
      );
    }

    if (existingBrand._count.products > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une marque contenant des produits' },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Marque supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression' },
      { status: 500 }
    );
  }
}
