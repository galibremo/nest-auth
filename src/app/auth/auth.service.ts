import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { DATABASE_CONNECTION } from '../../database/connection';
import schema from '../../database/schema';
import DrizzleService from '../../database/service';
import { CreateUser, UserWithoutPassword } from './@types/auth.types';

@Injectable()
export class AuthService extends DrizzleService {
	constructor(
		@Inject(DATABASE_CONNECTION)
		db: NodePgDatabase<typeof schema>,
	) {
		super(db);
	}

	async checkIfUserExists(email: string): Promise<boolean> {
		const user = await this.getDb().query.users.findFirst({
			where: eq(schema.users.email, email),
		});

		return !!user;
	}

	async createUser(data: CreateUser): Promise<UserWithoutPassword> {
		let hashedPassword: string | undefined = undefined;
		if (data.password) hashedPassword = await bcrypt.hash(data.password, 10);

		const newUser = await this.getDb().transaction(async tx => {
			this.setTransaction(tx);

			const user = await tx
				.insert(schema.users)
				.values({
					...data,
					password: hashedPassword,
				})
				.returning()
				.then(rows => rows[0]);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...userWithoutPassword } = user;

			return userWithoutPassword;
		});

		return newUser;
	}
}
