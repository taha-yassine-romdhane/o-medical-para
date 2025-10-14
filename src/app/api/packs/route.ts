import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/packs - Get all packs (or active packs for public) or get a single pack by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get('active') === 'true';
    const slug = searchParams.get('slug');

    // Build where clause
    const where: any = {};
    if (onlyActive) {
      where.isActive = true;
    }
    if (slug) {
      where.slug = slug;
    }

    const packs = await prisma.pack.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
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
                inStock: true,
                stockQuantity: true,
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
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json({ packs });
  } catch (error) {
    console.error('Error fetching packs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packs' },
      { status: 500 }
    );
  }
}

// POST /api/packs - Create a new pack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image, packPrice, items } = body;

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

    // Create pack with items
    const pack = await prisma.pack.create({
      data: {
        name,
        slug,
        description,
        image,
        packPrice: parseFloat(packPrice),
        totalPrice,
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

    return NextResponse.json({ pack }, { status: 201 });
  } catch (error) {
    console.error('Error creating pack:', error);
    return NextResponse.json(
      { error: 'Failed to create pack' },
      { status: 500 }
    );
  }
}
