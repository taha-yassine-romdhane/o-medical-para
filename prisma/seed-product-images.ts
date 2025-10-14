import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Function to normalize strings for comparison
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .trim();
}

async function main() {
  console.log('Starting product images seeding...\n');

  const imagesDir = path.join(process.cwd(), 'public', 'product_images_v7');

  // Check if directory exists
  if (!fs.existsSync(imagesDir)) {
    throw new Error(`Images directory not found: ${imagesDir}`);
  }

  // Read all image files
  const imageFiles = fs.readdirSync(imagesDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} image files\n`);

  // Fetch all products
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      reference: true,
    },
  });

  console.log(`Found ${products.length} products in database\n`);

  let matchedCount = 0;
  let unmatchedImages: string[] = [];
  let skippedCount = 0;

  // Process each image
  for (const imageFile of imageFiles) {
    const fileNameWithoutExt = path.basename(imageFile, path.extname(imageFile));
    const normalizedFileName = normalizeString(fileNameWithoutExt);

    // Try to find matching product
    let matchedProduct = null;

    // First try: exact match on normalized names
    matchedProduct = products.find(p =>
      normalizeString(p.name) === normalizedFileName
    );

    // Second try: check if product name is contained in filename or vice versa
    if (!matchedProduct) {
      matchedProduct = products.find(p => {
        const normalizedProductName = normalizeString(p.name);
        return normalizedFileName.includes(normalizedProductName) ||
               normalizedProductName.includes(normalizedFileName);
      });
    }

    if (matchedProduct) {
      // Check if image already exists
      const existingImage = await prisma.productImage.findFirst({
        where: {
          productId: matchedProduct.id,
        },
      });

      if (existingImage) {
        console.log(`⏭️  Skipped (already has image): ${matchedProduct.name}`);
        skippedCount++;
        continue;
      }

      // Create product image
      const imagePath = `/product_images_v7/${imageFile}`;

      await prisma.productImage.create({
        data: {
          productId: matchedProduct.id,
          url: imagePath,
          alt: matchedProduct.name,
          isPrimary: true, // Set as primary since it's the first/only image
          sortOrder: 0,
        },
      });

      console.log(`✅ Matched: "${imageFile}" → "${matchedProduct.name}"`);
      matchedCount++;
    } else {
      unmatchedImages.push(imageFile);
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════');
  console.log('SEEDING SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Successfully matched: ${matchedCount}`);
  console.log(`⏭️  Skipped (already had images): ${skippedCount}`);
  console.log(`❌ Unmatched images: ${unmatchedImages.length}`);
  console.log(`📊 Total images processed: ${imageFiles.length}`);
  console.log('═══════════════════════════════════════\n');

  if (unmatchedImages.length > 0) {
    console.log('Unmatched images (first 50):');
    unmatchedImages.slice(0, 50).forEach(img => {
      console.log(`  - ${img}`);
    });

    if (unmatchedImages.length > 50) {
      console.log(`  ... and ${unmatchedImages.length - 50} more`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
