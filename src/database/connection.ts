import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export default function createPool(configService: ConfigService) {
	const pool = new Pool({
		connectionString: configService.getOrThrow('DATABASE_URL'),
		max: 20, // Maximum number of clients in the pool
		idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
		connectionTimeoutMillis: 2000, // How long to wait for a connection
	});
	return drizzle(pool, { schema });
}
