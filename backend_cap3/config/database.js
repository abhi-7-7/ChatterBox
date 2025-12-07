const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({log: ['error', 'warn'],});
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database Connected Successfully via Prisma');
    return true;
  } catch (error) {
    console.error('Database Connection Failed:', error.message);
    console.log('Check DATABASE_URL in .env file');
    return false;
  }
};
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
module.exports = {prisma,testConnection};