import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateFamilySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean(),
});

// PUT - Update family
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateFamilySchema.parse(body);

    const existingFamily = await prisma.family.findUnique({
      where: { id: params.id },
    });

    if (!existingFamily) {
      return NextResponse.json(
        { error: 'Famille non trouvée' },
        { status: 404 }
      );
    }

    // Generate new slug if name changed
    const slug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const family = await prisma.family.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        isActive: validatedData.isActive,
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
        message: 'Famille mise à jour avec succès',
        family,
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

    console.error('Error updating family:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Delete family
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const existingFamily = await prisma.family.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            subfamilies: true,
            products: true,
          },
        },
      },
    });

    if (!existingFamily) {
      return NextResponse.json(
        { error: 'Famille non trouvée' },
        { status: 404 }
      );
    }

    if (existingFamily._count.products > 0 || existingFamily._count.subfamilies > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une famille contenant des produits ou des sous-familles' },
        { status: 400 }
      );
    }

    await prisma.family.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Famille supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting family:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression' },
      { status: 500 }
    );
  }
}