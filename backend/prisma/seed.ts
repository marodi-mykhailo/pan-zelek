import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = 'admin@panzelek.pl';
  const adminPassword = await bcrypt.hash('admin123', 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
        phone: '+48 123 456 789',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created: admin@panzelek.pl / admin123');
  } else {
    // Update existing user to admin if not already
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' },
    });
    console.log('✅ Admin user updated');
  }

  // Create products
  const products = [
    {
      name: 'Sour Worms',
      namePl: 'Kwaśne Robaczki',
      description: 'Delicious sour gummy worms',
      descriptionPl: 'Pyszne kwaśne żelki w kształcie robaków',
      category: 'sour',
      pricePer100g: 9.0,
      inStock: true,
      stockWeight: 5000,
      image: '🐛',
    },
    {
      name: 'Golden Bears',
      namePl: 'Misie Mix',
      description: 'Classic gummy bears',
      descriptionPl: 'Klasyczne żelki misie',
      category: 'sweet',
      pricePer100g: 8.0,
      inStock: true,
      stockWeight: 5000,
      image: '🐻',
    },
    {
      name: 'Cola Bottles',
      namePl: 'Cola Bottles',
      description: 'Cola flavored gummy bottles',
      descriptionPl: 'Żelki w kształcie butelek o smaku coli',
      category: 'classic',
      pricePer100g: 9.0,
      inStock: true,
      stockWeight: 5000,
      image: '🥤',
    },
    {
      name: 'Forest Berries',
      namePl: 'Jagodowy Wybuch',
      description: 'Mixed berry gummies',
      descriptionPl: 'Mieszanka żelków o smaku jagód',
      category: 'fruit',
      pricePer100g: 10.0,
      inStock: true,
      stockWeight: 5000,
      image: '🫐',
    },
    {
      name: 'Ocean Sharks',
      namePl: 'Rekiny Blue',
      description: 'Blue shark shaped gummies',
      descriptionPl: 'Niebieskie żelki w kształcie rekinów',
      category: 'sweet',
      pricePer100g: 9.0,
      inStock: true,
      stockWeight: 5000,
      image: '🦈',
    },
    {
      name: 'Rainbow Strips',
      namePl: 'Kwaśna Tęcza',
      description: 'Sour rainbow strips',
      descriptionPl: 'Kwaśne paski w kolorach tęczy',
      category: 'sour',
      pricePer100g: 8.0,
      inStock: true,
      stockWeight: 5000,
      image: '🌈',
    },
  ];

  // Clear existing products
  await prisma.product.deleteMany({});

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
