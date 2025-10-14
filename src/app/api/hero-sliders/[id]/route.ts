import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/hero-sliders/[id] - Get a specific slider
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slider = await prisma.heroSlider.findUnique({
      where: { id: params.id },
    });

    if (!slider) {
      return NextResponse.json(
        { error: 'Slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ slider });
  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slider' },
      { status: 500 }
    );
  }
}

// PUT /api/hero-sliders/[id] - Update a slider
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { image, url, isActive } = body;

    const slider = await prisma.heroSlider.update({
      where: { id: params.id },
      data: {
        image,
        url: url || null,
        isActive,
      },
    });

    return NextResponse.json({ slider });
  } catch (error) {
    console.error('Error updating slider:', error);
    return NextResponse.json(
      { error: 'Failed to update slider' },
      { status: 500 }
    );
  }
}

// DELETE /api/hero-sliders/[id] - Delete a slider
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.heroSlider.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    return NextResponse.json(
      { error: 'Failed to delete slider' },
      { status: 500 }
    );
  }
}
