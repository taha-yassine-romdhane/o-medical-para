import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface CreateOrderRequest {
  items: OrderItem[];
  addressId?: string;
  addressData?: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    governorate: string;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Require authentication
    if (!session?.user?.email) {
      return NextResponse.json({
        error: 'Vous devez être connecté pour passer une commande'
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body: CreateOrderRequest = await request.json();
    const { items, addressId, addressData, subtotal, shippingCost, total, paymentMethod, notes } = body;

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must have at least one item' }, { status: 400 });
    }

    // Validate address data
    if (!addressId && !addressData) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    let finalAddressId = addressId;

    // If no addressId provided, create new address for user
    if (!finalAddressId && addressData) {
      const newAddress = await prisma.address.create({
        data: {
          userId: user.id,
          label: 'Commande',
          firstName: addressData.firstName,
          lastName: addressData.lastName,
          phone: addressData.phone || user.phone,
          address: addressData.address,
          city: addressData.city,
          postalCode: addressData.postalCode,
          governorate: addressData.governorate,
          isDefault: false,
        },
      });
      finalAddressId = newAddress.id;
    }

    if (!finalAddressId) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Verify all products exist and have enough stock
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json({
          error: `Product not found: ${item.productId}`
        }, { status: 400 });
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json({
          error: `Insufficient stock for ${product.name}`
        }, { status: 400 });
      }
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        addressId: finalAddressId,
        subtotal,
        shippingCost,
        total,
        paymentMethod,
        notes: notes || null,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: {
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
        address: true,
      },
    });

    // Update product stock quantities
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
