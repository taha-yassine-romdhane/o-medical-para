import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Helper function to calculate fidelity points
// Points = (order total × 2%) × 1000
function calculateFidelityPoints(orderTotal: number): number {
  return Math.floor((orderTotal * 0.02) * 1000);
}

// PATCH /api/admin/orders/[orderId] - Update order status (ADMIN only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    const { orderId } = await params;

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus } = body;

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const previousStatus = currentOrder.status;

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            fidelityPoints: true,
          },
        },
        address: {
          select: {
            address: true,
            city: true,
            governorate: true,
            postalCode: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                reference: true,
                images: {
                  select: {
                    url: true,
                    isPrimary: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { items: true },
        },
      },
    });

    // Award fidelity points if status changed to DELIVERED
    // Only award if previous status was NOT DELIVERED (to prevent duplicate points)
    if (status === 'DELIVERED' && previousStatus !== 'DELIVERED') {
      const pointsToAward = calculateFidelityPoints(currentOrder.total);

      // Update user points and create history record in a transaction
      await prisma.$transaction([
        prisma.user.update({
          where: { id: currentOrder.userId },
          data: {
            fidelityPoints: {
              increment: pointsToAward,
            },
          },
        }),
        prisma.fidelityPointHistory.create({
          data: {
            userId: currentOrder.userId,
            orderId: currentOrder.id,
            points: pointsToAward,
            type: 'EARNED_PURCHASE',
            description: `Points gagnés pour la commande #${currentOrder.orderNumber}`,
            reference: currentOrder.orderNumber,
          },
        }),
      ]);

      return NextResponse.json({
        message: 'Order updated and fidelity points awarded successfully',
        order: updatedOrder,
        pointsAwarded: pointsToAward,
      });
    }

    // Refund fidelity points if order is CANCELLED or REFUNDED
    // Only if it was previously DELIVERED (points were awarded)
    if (
      (status === 'CANCELLED' || status === 'REFUNDED') &&
      previousStatus === 'DELIVERED'
    ) {
      const pointsToRefund = calculateFidelityPoints(currentOrder.total);

      // Check if user has enough points
      if (currentOrder.user.fidelityPoints >= pointsToRefund) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: currentOrder.userId },
            data: {
              fidelityPoints: {
                decrement: pointsToRefund,
              },
            },
          }),
          prisma.fidelityPointHistory.create({
            data: {
              userId: currentOrder.userId,
              orderId: currentOrder.id,
              points: -pointsToRefund,
              type: 'REFUND',
              description: `Points remboursés pour la commande annulée #${currentOrder.orderNumber}`,
              reference: currentOrder.orderNumber,
            },
          }),
        ]);

        return NextResponse.json({
          message: 'Order updated and fidelity points refunded successfully',
          order: updatedOrder,
          pointsRefunded: pointsToRefund,
        });
      }
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// GET /api/admin/orders/[orderId] - Get order details (ADMIN only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    const { orderId } = await params;

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
