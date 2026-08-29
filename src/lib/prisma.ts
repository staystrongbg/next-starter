import 'server-only';

import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from '@prisma/client';
import { databaseUrl } from './env';

const adapter = new PrismaNeon({
  connectionString: databaseUrl,
});

export const prisma = new PrismaClient({ adapter });
