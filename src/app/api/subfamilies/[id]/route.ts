import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSubfamilySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean(),
});

// PUT - Update subfamily
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
    const validatedData = updateSubfamilySchema.parse(body);

    const existingSubfamily = await prisma.subfamily.findUnique({
      where: { id: params.id },
    });

    if (!existingSubfamily) {
      return NextResponse.json(
        { error: 'Sous-famille non trouvée' },
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

    const subfamily = await prisma.subfamily.update({
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
            products: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Sous-famille mise à jour avec succès',
        subfamily,
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

    console.error('Error updating subfamily:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Delete subfamily
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const existingSubfamily = await prisma.subfamily.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingSubfamily) {
      return NextResponse.json(
        { error: 'Sous-famille non trouvée' },
        { status: 404 }
      );
    }

    if (existingSubfamily._count.products > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une sous-famille contenant des produits' },
        { status: 400 }
      );
    }

    await prisma.subfamily.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Sous-famille supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting subfamily:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression' },
      { status: 500 }
    );
  }
}