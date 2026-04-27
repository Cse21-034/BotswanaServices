// scripts/seed-categories.ts
import { PrismaClient } from '@prisma/client';
import { categories } from '../src/data/categories';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding categories...');

  for (const categoryData of categories) {
    const categorySlug = categoryData.name.toLowerCase().replace(/\s+/g, '-');
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        name: categoryData.name,
        slug: categorySlug,
      },
    });

    console.log(`Upserted category: ${category.name}`);

    for (const subcategoryName of categoryData.subcategories) {
      const subcategorySlug = subcategoryName.toLowerCase().replace(/\s+/g, '-');
      await prisma.category.upsert({
        where: { slug: subcategorySlug },
        update: {},
        create: {
          name: subcategoryName,
          slug: subcategorySlug,
          parentId: category.id,
        },
      });
      console.log(`  - Upserted subcategory: ${subcategoryName}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });