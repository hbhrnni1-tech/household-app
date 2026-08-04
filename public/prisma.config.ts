import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = 'postgres://ilyugsdnrzchofeawft:Yanirmaman465!@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export default {
  schema: 'prisma/schema.prisma',
  adapter: adapter as any, // ה-as any פותר את השגיאה של TypeScript באופן מיידי
};