import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

interface ImportRow {
  'Catégorie': string;
  'Référence Famille': string;
  'Nom Famille': string;
  'Référence Sous-famille': string;
  'Nom Sous-famille': string;
}

interface ImportResult {
  totalRows: number;
  successfulFamilies: number;
  successfulSubfamilies: number;
  failedRows: Array<{
    row: number;
    data: ImportRow;
    error: string;
  }>;
  createdFamilies: string[];
  createdSubfamilies: string[];
}

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

    // Read the Excel file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: ImportRow[] = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Le fichier est vide' }, { status: 400 });
    }

    const result: ImportResult = {
      totalRows: data.length,
      successfulFamilies: 0,
      successfulSubfamilies: 0,
      failedRows: [],
      createdFamilies: [],
      createdSubfamilies: [],
    };

    // Track processed families to avoid duplicates
    const processedFamilies = new Set<string>();
    const processedSubfamilies = new Set<string>();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // Excel row number (1-based + header)

      try {
        // Validate required fields
        if (!row['Catégorie'] || !row['Référence Famille'] || !row['Nom Famille']) {
          result.failedRows.push({
            row: rowNumber,
            data: row,
            error: 'Champs obligatoires manquants (Catégorie, Référence Famille, Nom Famille)',
          });
          continue;
        }

        // Find the category
        const category = await prisma.category.findFirst({
          where: { name: row['Catégorie'].trim() },
        });

        if (!category) {
          result.failedRows.push({
            row: rowNumber,
            data: row,
            error: `Catégorie "${row['Catégorie']}" non trouvée`,
          });
          continue;
        }

        const familyRef = row['Référence Famille'].toString().trim();
        const familyName = row['Nom Famille'].trim();

        // Create or find family
        if (!processedFamilies.has(familyRef)) {
          const existingFamily = await prisma.family.findUnique({
            where: { reference: familyRef },
          });

          if (!existingFamily) {
            // Create family
            const slug = familyName
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');

            const lastFamily = await prisma.family.findFirst({
              where: { categoryId: category.id },
              orderBy: { sortOrder: 'desc' },
            });

            const sortOrder = lastFamily ? lastFamily.sortOrder + 1 : 0;

            await prisma.family.create({
              data: {
                reference: familyRef,
                name: familyName,
                slug,
                categoryId: category.id,
                sortOrder,
              },
            });

            result.successfulFamilies++;
            result.createdFamilies.push(`${familyRef} - ${familyName}`);
          }

          processedFamilies.add(familyRef);
        }

        // Create subfamily if provided
        if (row['Référence Sous-famille'] && row['Nom Sous-famille']) {
          const subfamilyRef = row['Référence Sous-famille'].toString().trim();
          const subfamilyName = row['Nom Sous-famille'].trim();

          if (!processedSubfamilies.has(subfamilyRef)) {
            const existingSubfamily = await prisma.subfamily.findUnique({
              where: { reference: subfamilyRef },
            });

            if (!existingSubfamily) {
              // Get the family
              const family = await prisma.family.findUnique({
                where: { reference: familyRef },
              });

              if (family) {
                const slug = subfamilyName
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '');

                const lastSubfamily = await prisma.subfamily.findFirst({
                  where: { familyId: family.id },
                  orderBy: { sortOrder: 'desc' },
                });

                const sortOrder = lastSubfamily ? lastSubfamily.sortOrder + 1 : 0;

                await prisma.subfamily.create({
                  data: {
                    reference: subfamilyRef,
                    name: subfamilyName,
                    slug,
                    familyId: family.id,
                    sortOrder,
                  },
                });

                result.successfulSubfamilies++;
                result.createdSubfamilies.push(`${subfamilyRef} - ${subfamilyName}`);
              }
            }

            processedSubfamilies.add(subfamilyRef);
          }
        }
      } catch (error: any) {
        result.failedRows.push({
          row: rowNumber,
          data: row,
          error: error.message || 'Erreur inconnue',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Import terminé',
      result,
    });
  } catch (error: any) {
    console.error('Error importing Excel:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'import', details: error.message },
      { status: 500 }
    );
  }
}
