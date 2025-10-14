import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

// GET - Export all products to Excel
export async function GET() {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // Fetch all products with relations
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        family: true,
        subfamily: true,
      },
      orderBy: {
        reference: 'asc',
      },
    });

    // Fetch all brands
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Fetch all categories
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Fetch all families
    const families = await prisma.family.findMany({
      include: {
        category: true,
      },
      orderBy: {
        reference: 'asc',
      },
    });

    // Fetch all subfamilies
    const subfamilies = await prisma.subfamily.findMany({
      include: {
        family: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        reference: 'asc',
      },
    });

    // Transform products to Excel format (matching import format)
    const productsData = products.map(product => ({
      reference: product.reference,
      name: product.name,
      slug: product.slug,
      price: product.price,
      priceHT: product.priceHT || '',
      promoPrice: product.promoPrice || '',
      promoPercentage: product.promoPercentage || '',
      stockQuantity: product.stockQuantity,
      inStock: product.inStock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isOnPromo: product.isOnPromo,
      brandSlug: product.brand?.slug || '',
      categorySlug: product.category?.slug || '',
      familyCode: product.family?.reference || '',
      subfamilyCode: product.subfamily?.reference || '',
    }));

    // Transform brands to Excel format
    const brandsData = brands.map(brand => ({
      slug: brand.slug,
      name: brand.name,
      website: brand.website || '',
      isActive: brand.isActive,
    }));

    // Transform categories to Excel format
    const categoriesData = categories.map(category => ({
      slug: category.slug,
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
    }));

    // Transform families to Excel format
    const familiesData = families.map(family => ({
      reference: family.reference,
      name: family.name,
      slug: family.slug,
      categorySlug: family.category.slug,
      categoryName: family.category.name,
      isActive: family.isActive,
    }));

    // Transform subfamilies to Excel format
    const subfamiliesData = subfamilies.map(subfamily => ({
      reference: subfamily.reference,
      name: subfamily.name,
      slug: subfamily.slug,
      familyReference: subfamily.family.reference,
      familyName: subfamily.family.name,
      categorySlug: subfamily.family.category.slug,
      categoryName: subfamily.family.category.name,
      isActive: subfamily.isActive,
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Create Products worksheet
    const productsWorksheet = XLSX.utils.json_to_sheet(productsData);
    productsWorksheet['!cols'] = [
      { wch: 12 }, // reference
      { wch: 40 }, // name
      { wch: 40 }, // slug
      { wch: 10 }, // price
      { wch: 10 }, // priceHT
      { wch: 12 }, // promoPrice
      { wch: 15 }, // promoPercentage
      { wch: 15 }, // stockQuantity
      { wch: 10 }, // inStock
      { wch: 10 }, // isActive
      { wch: 10 }, // isFeatured
      { wch: 10 }, // isOnPromo
      { wch: 20 }, // brandSlug
      { wch: 20 }, // categorySlug
      { wch: 15 }, // familyCode
      { wch: 15 }, // subfamilyCode
    ];
    XLSX.utils.book_append_sheet(workbook, productsWorksheet, 'Products');

    // Create Brands worksheet
    const brandsWorksheet = XLSX.utils.json_to_sheet(brandsData);
    brandsWorksheet['!cols'] = [
      { wch: 25 }, // slug
      { wch: 30 }, // name
      { wch: 40 }, // website
      { wch: 10 }, // isActive
    ];
    XLSX.utils.book_append_sheet(workbook, brandsWorksheet, 'Brands');

    // Create Categories worksheet
    const categoriesWorksheet = XLSX.utils.json_to_sheet(categoriesData);
    categoriesWorksheet['!cols'] = [
      { wch: 25 }, // slug
      { wch: 30 }, // name
      { wch: 50 }, // description
      { wch: 10 }, // isActive
    ];
    XLSX.utils.book_append_sheet(workbook, categoriesWorksheet, 'Categories');

    // Create Families worksheet
    const familiesWorksheet = XLSX.utils.json_to_sheet(familiesData);
    familiesWorksheet['!cols'] = [
      { wch: 15 }, // reference
      { wch: 35 }, // name
      { wch: 35 }, // slug
      { wch: 20 }, // categorySlug
      { wch: 25 }, // categoryName
      { wch: 10 }, // isActive
    ];
    XLSX.utils.book_append_sheet(workbook, familiesWorksheet, 'Families');

    // Create Subfamilies worksheet
    const subfamiliesWorksheet = XLSX.utils.json_to_sheet(subfamiliesData);
    subfamiliesWorksheet['!cols'] = [
      { wch: 15 }, // reference
      { wch: 35 }, // name
      { wch: 35 }, // slug
      { wch: 18 }, // familyReference
      { wch: 30 }, // familyName
      { wch: 20 }, // categorySlug
      { wch: 25 }, // categoryName
      { wch: 10 }, // isActive
    ];
    XLSX.utils.book_append_sheet(workbook, subfamiliesWorksheet, 'Subfamilies');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `products_export_${date}.xlsx`;

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'export des produits' },
      { status: 500 }
    );
  }
}
