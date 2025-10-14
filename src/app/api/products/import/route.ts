import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

// POST - Import products from Excel file
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
        const productData: any = row;

        // Validate required fields
        if (!productData.reference || !productData.name || !productData.slug) {
          skipped++;
          errors.push(`Ligne ignorée: champs obligatoires manquants (reference: ${productData.reference}, name: ${productData.name}, slug: ${productData.slug})`);
          continue;
        }

        if (productData.price === undefined || productData.price === null) {
          skipped++;
          errors.push(`Ligne ${productData.reference} ignorée: prix manquant (price: ${productData.price})`);
          continue;
        }

        // Get brand by slug
        let brandId: string | null = null;
        if (productData.brandSlug) {
          const brand = await prisma.brand.findUnique({
            where: { slug: String(productData.brandSlug) },
          });
          if (brand) {
            brandId = brand.id;
          }
        }

        // Get category by slug
        let categoryId: string | null = null;
        if (productData.categorySlug) {
          const category = await prisma.category.findUnique({
            where: { slug: String(productData.categorySlug) },
          });
          if (category) {
            categoryId = category.id;
          }
        }

        // Get family by reference (convert to string if it's a number)
        let familyId: string | null = null;
        if (productData.familyCode !== undefined && productData.familyCode !== null) {
          const familyRef = String(productData.familyCode);
          const family = await prisma.family.findUnique({
            where: { reference: familyRef },
          });
          if (family) {
            familyId = family.id;
          } else {
            errors.push(`${productData.reference}: Famille non trouvée (ref: ${familyRef})`);
          }
        }

        // Get subfamily by reference (convert to string if it's a number)
        let subfamilyId: string | null = null;
        if (productData.subfamilyCode !== undefined && productData.subfamilyCode !== null) {
          const subfamilyRef = String(productData.subfamilyCode);
          const subfamily = await prisma.subfamily.findUnique({
            where: { reference: subfamilyRef },
          });
          if (subfamily) {
            subfamilyId = subfamily.id;
          } else {
            errors.push(`${productData.reference}: Sous-famille non trouvée (ref: ${subfamilyRef})`);
          }
        }

        // Check if product already exists
        const existingProduct = await prisma.product.findUnique({
          where: { reference: String(productData.reference) },
        });

        const productPayload = {
          name: String(productData.name),
          slug: String(productData.slug),
          price: Number(productData.price), // Prix TTC (with tax)
          priceHT: productData.priceHT ? Number(productData.priceHT) : null, // Prix HT (without tax)
          promoPrice: productData.promoPrice ? Number(productData.promoPrice) : null,
          promoPercentage: productData.promoPercentage ? Number(productData.promoPercentage) : null,
          stockQuantity: productData.stockQuantity ? Number(productData.stockQuantity) : 0,
          inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : false,
          isActive: productData.isActive !== undefined ? Boolean(productData.isActive) : true,
          isFeatured: productData.isFeatured !== undefined ? Boolean(productData.isFeatured) : false,
          isOnPromo: productData.isOnPromo !== undefined ? Boolean(productData.isOnPromo) : false,
          brandId,
          categoryId,
          familyId,
          subfamilyId,
        };

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: productPayload,
          });
          updated++;
        } else {
          // Create new product
          await prisma.product.create({
            data: {
              reference: String(productData.reference),
              ...productPayload,
            },
          });
          imported++;
        }
      } catch (error) {
        skipped++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`Erreur pour ${(row as any).reference || 'produit inconnu'}: ${errorMessage}`);
        console.error('Product import error:', error);
      }
    }

    return NextResponse.json(
      {
        message: 'Import terminé',
        imported,
        updated,
        skipped,
        errors: errors.slice(0, 20), // Return first 20 errors for debugging
        totalErrors: errors.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'import des produits' },
      { status: 500 }
    );
  }
}
