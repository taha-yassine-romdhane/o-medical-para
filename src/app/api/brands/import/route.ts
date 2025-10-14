import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

// POST - Import brands from Excel file
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Le fichier Excel est vide' }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const row of data) {
      try {
        const brandData: any = row;

        // Validate required fields
        if (!brandData.name || typeof brandData.name !== 'string') {
          skipped++;
          errors.push(`Ligne ignorée: nom manquant`);
          continue;
        }

        // Generate slug if not provided
        let slug = brandData.slug;
        if (!slug) {
          slug = brandData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }

        // Check if brand already exists
        const existingBrand = await prisma.brand.findUnique({
          where: { slug },
        });

        if (existingBrand) {
          // Update existing brand
          await prisma.brand.update({
            where: { id: existingBrand.id },
            data: {
              name: brandData.name,
              isActive: brandData.isActive !== undefined ? Boolean(brandData.isActive) : true,
            },
          });
          updated++;
        } else {
          // Create new brand
          await prisma.brand.create({
            data: {
              name: brandData.name,
              slug,
              isActive: brandData.isActive !== undefined ? Boolean(brandData.isActive) : true,
            },
          });
          imported++;
        }
      } catch (error) {
        skipped++;
        errors.push(`Erreur pour ${(row as any).name || 'marque inconnue'}: ${error}`);
      }
    }

    return NextResponse.json(
      {
        message: 'Import terminé',
        imported,
        updated,
        skipped,
        errors: errors.slice(0, 10), // Return first 10 errors only
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error importing brands:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'import des marques' },
      { status: 500 }
    );
  }
}
