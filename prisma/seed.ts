const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed: מתחיל להזין נתונים...');
  
  // כאן נכתוב נתון דמי אחד כדי לוודא שזה עובד
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'משתמש בדיקה',
      role: 'USER',
    },
  });

  console.log('✅ Seed: הנתונים הוזנו בהצלחה!', user);
}

main()
  .catch((e) => {
    console.error('❌ שגיאה ב-Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  