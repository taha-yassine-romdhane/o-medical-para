import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/hero-sliders - Get all active sliders
export async function GET() {
  try {
    const sliders = await prisma.heroSlider.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ sliders });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sliders' },
      { status: 500 }
    );
  }
}

// POST /api/hero-sliders - Create a new slider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, url, isActive } = body;

    // Get the highest sortOrder and add 1
    const highestSlider = await prisma.heroSlider.findFirst({
      orderBy: { sortOrder: 'desc' },
    });
    const nextSortOrder = (highestSlider?.sortOrder || 0) + 1;

    const slider = await prisma.heroSlider.create({
      data: {
        image,
        url: url || null,
        sortOrder: nextSortOrder,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ slider }, { status: 201 });
  } catch (error) {
    console.error('Error creating slider:', error);
    return NextResponse.json(
      { error: 'Failed to create slider' },
      { status: 500 }
    );
  }
}
