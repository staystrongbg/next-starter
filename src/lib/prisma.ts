import 'server-only';

import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from '../generated/prisma/client';
import { databaseUrl } from './env';

const adapter = new PrismaNeon({
  connectionString: databaseUrl,
});

export const prisma = new PrismaClient({ adapter });
