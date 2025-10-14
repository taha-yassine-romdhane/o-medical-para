import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/events - Get active events (filtered by current date/time)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true'; // For admin panel

    const currentDate = new Date();

    const whereClause = showAll
      ? { isActive: true }
      : {
          isActive: true,
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        };

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { sortOrder: 'asc' },
    });

    // For client side, only return the first event (if any)
    if (!showAll && events.length > 0) {
      return NextResponse.json({ events: [events[0]] });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, url, startDate, endDate, sortOrder, isActive } = body;

    // Validate that dates are provided
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate that end date is after start date
    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Check for overlapping events
    const overlappingEvents = await prisma.event.findMany({
      where: {
        isActive: true,
        OR: [
          // New event starts during existing event
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } },
            ],
          },
          // New event ends during existing event
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } },
            ],
          },
          // New event completely contains existing event
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } },
            ],
          },
        ],
      },
    });

    if (overlappingEvents.length > 0) {
      return NextResponse.json(
        { error: 'Another event is already scheduled during this time period' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        image,
        url: url || null,
        startDate: start,
        endDate: end,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
