import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Main categories for parapharmacie
  const categories = [
    {
      name: 'Vitamines & Compléments',
      slug: 'vitamines-complements',
      description: 'Vitamines, minéraux et compléments alimentaires pour votre santé',
      sortOrder: 1,
    },
    {
      name: 'Capillaires',
      slug: 'capillaires',
      description: 'Soins et traitements pour cheveux',
      sortOrder: 2,
    },
    {
      name: 'Soins Visage',
      slug: 'soins-visage',
      description: 'Crèmes, sérums et soins du visage',
      sortOrder: 3,
    },
    {
      name: 'Soins Corps',
      slug: 'soins-corps',
      description: 'Hydratation et soins corporels',
      sortOrder: 4,
    },
    {
      name: 'Bébé & Maman',
      slug: 'bebe-maman',
      description: 'Produits pour bébés et futures mamans',
      sortOrder: 5,
    },
    {
      name: 'Bio & Naturel',
      slug: 'bio-naturel',
      description: 'Produits biologiques et naturels',
      sortOrder: 6,
    },
    {
      name: 'Hygiène Intime',
      slug: 'hygiene-intime',
      description: 'Produits d\'hygiène intime',
      sortOrder: 7,
    },
    {
      name: 'Matériel Médical',
      slug: 'materiel-medical',
      description: 'Équipements et matériel médical',
      sortOrder: 8,
    },
  ];

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`Created/Updated category: ${created.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });