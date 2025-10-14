import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get statistics
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      totalFamilies,
      totalSubfamilies,
      totalBrands,
      totalPacks,
      outOfStockProducts,
      pendingOrders,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.category.count(),
      prisma.family.count(),
      prisma.subfamily.count(),
      prisma.brand.count(),
      prisma.pack.count(),
      prisma.product.count({ where: { stockQuantity: 0 } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.product.findMany({
        where: {
          stockQuantity: {
            gt: 0,
            lte: 10, // Low stock threshold
          },
        },
        take: 5,
        orderBy: { stockQuantity: 'asc' },
        select: {
          id: true,
          reference: true,
          name: true,
          stockQuantity: true,
        },
      }),
    ]);

    const dashboardData = {
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      totalFamilies,
      totalSubfamilies,
      totalBrands,
      totalPacks,
      outOfStockProducts,
      pendingOrders,
      recentOrders,
      lowStockProducts,
      userName: session.user.name,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
