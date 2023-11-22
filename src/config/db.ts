import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * database connection
 */
prisma
	.$connect()
	.then(() => {
		console.log('DATABASE CONNECTED SUCCESSFULLY');
	})
	.catch((error: any) => {
		console.log('DATABASE CONNECTION ERROR:', error);
	});
