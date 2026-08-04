// prisma/run-seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 מריץ את ה-Seed דרך JS...');
  
  // כאן נזין משתמש דמי
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'משתמש בדיקה',
      role: 'USER',
    },
  });

  console.log('✅ הנתונים הוכנסו בהצלחה!', user);
}

main()
  .catch((e) => {
    console.error('❌ שגיאה:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });