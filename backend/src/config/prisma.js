const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn'], // Log errors and warnings
});

// Test database connection
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // Exit if database connection fails
  }
}

// Graceful disconnect
async function disconnectDB() {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
}

module.exports = { prisma, connectDB, disconnectDB };