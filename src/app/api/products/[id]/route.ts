import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  promoPercentage: z.number().min(0).max(100).optional(),
  isOnPromo: z.boolean(),
  stockQuantity: z.number().int().min(0),
  lowStockAlert: z.number().int().min(0),
  image: z.string().optional(),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  familyId: z.string().optional().nullable(),
  subfamilyId: z.string().optional().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

// PUT - Update product
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
    const validatedData = updateProductSchema.parse(body);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
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

    // Calculate promo price if promo is active
    let promoPrice = null;
    if (validatedData.isOnPromo && validatedData.promoPercentage) {
      promoPrice = validatedData.price * (1 - validatedData.promoPercentage / 100);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        price: validatedData.price,
        promoPrice,
        promoPercentage: validatedData.promoPercentage,
        isOnPromo: validatedData.isOnPromo,
        stockQuantity: validatedData.stockQuantity,
        lowStockAlert: validatedData.lowStockAlert,
        inStock: validatedData.stockQuantity > 0,
        brandId: validatedData.brandId,
        categoryId: validatedData.categoryId,
        familyId: validatedData.familyId,
        subfamilyId: validatedData.subfamilyId,
        isActive: validatedData.isActive,
        isFeatured: validatedData.isFeatured,
      },
      include: {
        brand: true,
        category: true,
        family: true,
        subfamily: true,
        images: true,
      },
    });

    // Update product image if provided
    if (validatedData.image) {
      // Delete existing primary image if exists
      const primaryImage = existingProduct.images.find(img => img.isPrimary);
      if (primaryImage) {
        await prisma.productImage.update({
          where: { id: primaryImage.id },
          data: { url: validatedData.image },
        });
      } else {
        // Create new primary image
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: validatedData.image,
            isPrimary: true,
            sortOrder: 0,
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Produit mis à jour avec succès',
        product,
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

    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
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
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Delete product (images will be cascade deleted)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Produit supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression' },
      { status: 500 }
    );
  }
}
