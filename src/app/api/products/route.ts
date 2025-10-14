import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  promoPercentage: z.number().min(0).max(100).optional(),
  isOnPromo: z.boolean().default(false),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockAlert: z.number().int().min(0).default(10),
  image: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  familyId: z.string().optional(),
  subfamilyId: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

// GET - Fetch all products or single product by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include');
    const slug = searchParams.get('slug');

    // If slug is provided, fetch single product
    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          brand: true,
          category: true,
          family: true,
          subfamily: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        );
      }

      return NextResponse.json({ product }, { status: 200 });
    }

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Filter parameters
    const search = searchParams.get('search') || '';
    const brandId = searchParams.get('brandId');
    const categoryId = searchParams.get('categoryId');
    const familyId = searchParams.get('familyId');
    const subfamilyId = searchParams.get('subfamilyId');
    const isActive = searchParams.get('isActive');
    const isFeatured = searchParams.get('isFeatured');
    const isOnPromo = searchParams.get('isOnPromo');
    const inStock = searchParams.get('inStock');

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (familyId) where.familyId = familyId;
    if (subfamilyId) where.subfamilyId = subfamilyId;
    if (isActive) where.isActive = isActive === 'true';
    if (isFeatured) where.isFeatured = isFeatured === 'true';
    if (isOnPromo) where.isOnPromo = isOnPromo === 'true';
    if (inStock) where.inStock = inStock === 'true';

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: true,
          category: true,
          family: true,
          subfamily: true,
          ...(include === 'images' && {
            images: {
              orderBy: { sortOrder: 'asc' },
            },
          }),
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Generate reference number (e.g., "00001")
    const lastProduct = await prisma.product.findFirst({
      orderBy: { reference: 'desc' },
    });

    let referenceNumber = 1;
    if (lastProduct?.reference) {
      const lastNumber = parseInt(lastProduct.reference);
      if (!isNaN(lastNumber)) {
        referenceNumber = lastNumber + 1;
      }
    }
    const reference = referenceNumber.toString().padStart(5, '0');

    // Generate slug
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

    // Create product
    const product = await prisma.product.create({
      data: {
        reference,
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
      },
    });

    // Create product image if provided
    if (validatedData.image) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: validatedData.image,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }

    return NextResponse.json(
      {
        message: 'Produit créé avec succès',
        product,
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

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du produit' },
      { status: 500 }
    );
  }
}
