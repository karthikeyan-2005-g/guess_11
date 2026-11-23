import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { GAME_OBJECTS } from '../src/data/objects.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for GUESS THE ELEVEN...');

  // Seed Drawing Objects
  console.log(`📦 Seeding ${GAME_OBJECTS.length} drawing objects...`);
  for (const obj of GAME_OBJECTS) {
    await prisma.drawingObject.upsert({
      where: { name: obj.name },
      update: {
        category: obj.category,
        difficulty: obj.difficulty,
        synonyms: obj.synonyms.join(','),
        enabled: obj.enabled,
      },
      create: {
        id: obj.id,
        name: obj.name,
        category: obj.category,
        difficulty: obj.difficulty,
        synonyms: obj.synonyms.join(','),
        enabled: obj.enabled,
      },
    });
  }
  console.log('✅ Drawing objects seeded successfully.');

  // Seed Default Admin User
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@1234', salt);

  const admin = await prisma.user.upsert({
    where: { userId: 'admin' },
    update: {},
    create: {
      userId: 'admin',
      username: 'Game Master 11',
      email: 'admin@guesstheeleven.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      profile: {
        create: {
          avatar: 'avatar-crown',
          fullName: 'System Administrator',
          bio: 'Official Game Master of Guess The Eleven',
          favoriteCategory: 'Fantasy',
        },
      },
      statistics: {
        create: {
          gamesPlayed: 11,
          gamesWon: 11,
          totalScore: 121,
          bestScore: 121,
          correctGuesses: 45,
          drawingRounds: 11,
          winPercentage: 100.0,
        },
      },
    },
  });

  // Seed 10 Demo Players for instant testing / bots if needed
  const demoUsers = [
    { userId: 'player1', name: 'SpeedySketch', email: 'p1@gte.com', avatar: 'avatar-1' },
    { userId: 'player2', name: 'ColorQueen', email: 'p2@gte.com', avatar: 'avatar-2' },
    { userId: 'player3', name: 'PixelNinja', email: 'p3@gte.com', avatar: 'avatar-3' },
    { userId: 'player4', name: 'DoodleKing', email: 'p4@gte.com', avatar: 'avatar-4' },
    { userId: 'player5', name: 'Brainy11', email: 'p5@gte.com', avatar: 'avatar-5' },
    { userId: 'player6', name: 'QuickDraw', email: 'p6@gte.com', avatar: 'avatar-6' },
    { userId: 'player7', name: 'ArtVibe', email: 'p7@gte.com', avatar: 'avatar-7' },
    { userId: 'player8', name: 'PencilPro', email: 'p8@gte.com', avatar: 'avatar-8' },
    { userId: 'player9', name: 'MasterMind', email: 'p9@gte.com', avatar: 'avatar-9' },
    { userId: 'player10', name: 'ElevenStars', email: 'p10@gte.com', avatar: 'avatar-10' },
  ];

  const defaultPassword = await bcrypt.hash('Player@123', salt);
  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { userId: u.userId },
      update: {},
      create: {
        userId: u.userId,
        username: u.name,
        email: u.email,
        passwordHash: defaultPassword,
        role: 'USER',
        profile: {
          create: {
            avatar: u.avatar,
            fullName: u.name,
            bio: `Ready to score 11 points!`,
            favoriteCategory: 'Animals',
          },
        },
        statistics: {
          create: {
            gamesPlayed: Math.floor(Math.random() * 20) + 5,
            gamesWon: Math.floor(Math.random() * 8) + 1,
            totalScore: Math.floor(Math.random() * 500) + 100,
            bestScore: 110,
            correctGuesses: Math.floor(Math.random() * 50) + 10,
            drawingRounds: Math.floor(Math.random() * 15) + 3,
            winPercentage: 45.5,
          },
        },
      },
    });
  }

  console.log('✅ Default users seeded successfully.');
  console.log('🚀 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
