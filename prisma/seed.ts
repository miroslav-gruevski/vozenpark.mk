import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@vozenpark.mk' },
    update: {},
    create: {
      email: 'demo@vozenpark.mk',
      password: demoPassword,
      language: 'mk',
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Create demo vehicles with varied expiry dates
  const today = new Date();
  
  const vehiclesData = [
    {
      plate: 'SK 1234 AB',
      vehicleType: 'car',
      vehicleModel: 'Golf 7 TDI',
      year: 2019,
      color: 'Бела',
      fuelType: 'diesel',
      vin: '9ZZAB12C3DE456789',
      responsiblePerson: 'Марко Петров',
      purchaseDate: new Date('2019-06-15'),
      purchasePrice: 15000,
      mileage: 85000,
      regExpiry: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      insExpiry: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000),
      inspExpiry: new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000),
      notes: '',
    },
    {
      plate: 'KU 5678 CD',
      vehicleType: 'car',
      vehicleModel: 'Audi A4 Avant',
      year: 2021,
      color: 'Сива',
      fuelType: 'diesel',
      vin: '5Y2BR4EE2XP123456',
      responsiblePerson: 'Ана Јовановска',
      purchaseDate: new Date('2021-03-20'),
      purchasePrice: 28000,
      mileage: 45000,
      regExpiry: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000),
      insExpiry: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
      inspExpiry: new Date(today.getTime() + 200 * 24 * 60 * 60 * 1000),
      notes: 'Службено возило за менаџмент',
    },
    {
      plate: 'BT 9012 EF',
      vehicleType: 'suv',
      vehicleModel: 'BMW X3 xDrive',
      year: 2022,
      color: 'Црна',
      fuelType: 'hybrid',
      vin: '1HGBH41JXMN109186',
      responsiblePerson: 'Петар Николов',
      purchaseDate: new Date('2022-01-10'),
      purchasePrice: 45000,
      mileage: 28000,
      regExpiry: new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000),
      insExpiry: new Date(today.getTime() + 250 * 24 * 60 * 60 * 1000),
      inspExpiry: new Date(today.getTime() + 128 * 24 * 60 * 60 * 1000),
      notes: '',
    },
    {
      plate: 'OH 3456 GH',
      vehicleType: 'van',
      vehicleModel: 'Mercedes Sprinter',
      year: 2018,
      color: 'Бела',
      fuelType: 'diesel',
      vin: 'WDB9066331S789012',
      responsiblePerson: 'Иван Стојанов',
      purchaseDate: new Date('2018-09-05'),
      purchasePrice: 35000,
      mileage: 120000,
      regExpiry: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      insExpiry: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      inspExpiry: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
      notes: 'Доставно возило - потребен сервис',
    },
    {
      plate: 'PP 7890 IJ',
      vehicleType: 'car',
      vehicleModel: 'Toyota Corolla',
      year: 2023,
      color: 'Сребрена',
      fuelType: 'hybrid',
      vin: 'JTDKN3DU5A0123456',
      responsiblePerson: 'Елена Димитрова',
      purchaseDate: new Date('2023-02-28'),
      purchasePrice: 25000,
      mileage: 15000,
      regExpiry: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000),
      insExpiry: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
      inspExpiry: new Date(today.getTime() + 300 * 24 * 60 * 60 * 1000),
      notes: '',
    },
  ];

  for (const vehicleData of vehiclesData) {
    await prisma.vehicle.upsert({
      where: {
        userId_plate: {
          userId: demoUser.id,
          plate: vehicleData.plate,
        },
      },
      update: {
        vehicleType: vehicleData.vehicleType,
        vehicleModel: vehicleData.vehicleModel,
        year: vehicleData.year,
        color: vehicleData.color,
        fuelType: vehicleData.fuelType,
        vin: vehicleData.vin,
        responsiblePerson: vehicleData.responsiblePerson,
        purchaseDate: vehicleData.purchaseDate,
        purchasePrice: vehicleData.purchasePrice,
        mileage: vehicleData.mileage,
        regExpiry: vehicleData.regExpiry,
        insExpiry: vehicleData.insExpiry,
        inspExpiry: vehicleData.inspExpiry,
        notes: vehicleData.notes,
      },
      create: {
        userId: demoUser.id,
        plate: vehicleData.plate,
        vehicleType: vehicleData.vehicleType,
        vehicleModel: vehicleData.vehicleModel,
        year: vehicleData.year,
        color: vehicleData.color,
        fuelType: vehicleData.fuelType,
        vin: vehicleData.vin,
        responsiblePerson: vehicleData.responsiblePerson,
        purchaseDate: vehicleData.purchaseDate,
        purchasePrice: vehicleData.purchasePrice,
        mileage: vehicleData.mileage,
        regExpiry: vehicleData.regExpiry,
        insExpiry: vehicleData.insExpiry,
        inspExpiry: vehicleData.inspExpiry,
        notes: vehicleData.notes,
      },
    });
    console.log('✅ Vehicle created:', vehicleData.plate, '-', vehicleData.vehicleModel);
  }

  console.log('');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email: demo@vozenpark.mk');
  console.log('  Password: demo123');
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
