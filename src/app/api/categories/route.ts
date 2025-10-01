import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include');

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            families: true,
            products: true,
          },
        },
        ...(include === 'families' && {
          families: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: {
              _count: {
                select: {
                  subfamilies: true,
                  products: true,
                },
              },
              subfamilies: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
                include: {
                  _count: {
                    select: {
                      products: true,
                    },
                  },
                },
              },
            },
          },
        }),
      },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}