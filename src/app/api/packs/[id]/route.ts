import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/packs/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pack = await prisma.pack.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                promoPrice: true,
                reference: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                images: {
                  where: { isPrimary: true },
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    return NextResponse.json({ pack });
  } catch (error) {
    console.error('Error fetching pack:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pack' },
      { status: 500 }
    );
  }
}

// PUT /api/packs/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, image, packPrice, items, isActive, isFeatured, sortOrder } = body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate total price from products
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, promoPrice: true },
    });

    const totalPrice = items.reduce((sum: number, item: any) => {
      const product = products.find((p) => p.id === item.productId);
      const productPrice = product?.promoPrice || product?.price || 0;
      return sum + productPrice * item.quantity;
    }, 0);

    // Delete existing items and create new ones
    await prisma.packItem.deleteMany({
      where: { packId: params.id },
    });

    const pack = await prisma.pack.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        image,
        packPrice: parseFloat(packPrice),
        totalPrice,
        isActive,
        isFeatured,
        sortOrder,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                promoPrice: true,
                reference: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                images: {
                  where: { isPrimary: true },
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ pack });
  } catch (error) {
    console.error('Error updating pack:', error);
    return NextResponse.json(
      { error: 'Failed to update pack' },
      { status: 500 }
    );
  }
}

// DELETE /api/packs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.pack.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Pack deleted successfully' });
  } catch (error) {
    console.error('Error deleting pack:', error);
    return NextResponse.json(
      { error: 'Failed to delete pack' },
      { status: 500 }
    );
  }
}
