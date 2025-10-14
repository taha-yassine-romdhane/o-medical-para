import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const MAX_HISTORY_ITEMS = 10;

// GET - Fetch user's search history
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const whereClause = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! };

    const user = await prisma.user.findUnique({
      where: whereClause,
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Fetch search history, ordered by most recent
    const searchHistory = await prisma.searchHistory.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: MAX_HISTORY_ITEMS,
    });

    // Format the response to match the hook's expected format
    const history = searchHistory.map((item) => ({
      query: item.query,
      timestamp: item.createdAt.getTime(),
    }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération de l\'historique' },
      { status: 500 }
    );
  }
}

// POST - Add a search query to history
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'La requête de recherche est invalide' },
        { status: 400 }
      );
    }

    const whereClause = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! };

    const user = await prisma.user.findUnique({
      where: whereClause,
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const trimmedQuery = query.trim();

    // Check if this query already exists for this user
    const existingSearch = await prisma.searchHistory.findFirst({
      where: {
        userId: user.id,
        query: {
          equals: trimmedQuery,
          mode: 'insensitive',
        },
      },
    });

    if (existingSearch) {
      // Delete the existing one so we can add it again at the top
      await prisma.searchHistory.delete({
        where: {
          id: existingSearch.id,
        },
      });
    }

    // Add the new search
    await prisma.searchHistory.create({
      data: {
        userId: user.id,
        query: trimmedQuery,
      },
    });

    // Keep only the most recent MAX_HISTORY_ITEMS searches
    const allSearches = await prisma.searchHistory.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Delete old searches if we have more than MAX_HISTORY_ITEMS
    if (allSearches.length > MAX_HISTORY_ITEMS) {
      const searchesToDelete = allSearches.slice(MAX_HISTORY_ITEMS);
      await prisma.searchHistory.deleteMany({
        where: {
          id: {
            in: searchesToDelete.map((s) => s.id),
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving search history:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'enregistrement' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a specific search or clear all history
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { query, clearAll } = body;

    const whereClause = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! };

    const user = await prisma.user.findUnique({
      where: whereClause,
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (clearAll) {
      // Clear all search history for this user
      await prisma.searchHistory.deleteMany({
        where: {
          userId: user.id,
        },
      });
    } else if (query) {
      // Delete specific search query
      await prisma.searchHistory.deleteMany({
        where: {
          userId: user.id,
          query: query,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Paramètre manquant: query ou clearAll' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting search history:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression' },
      { status: 500 }
    );
  }
}
