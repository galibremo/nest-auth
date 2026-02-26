import { sql } from 'drizzle-orm';
import {
	boolean,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core';
import { timestamps } from '../../database/helpers';
import { tokenTypeEnum } from './enum.model';

export const users = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		name: text('name'),
		email: text('email').notNull().unique(),
		password: text('password'),
		phone: varchar('phone', { length: 20 }),
		...timestamps,
	},
	table => [
		uniqueIndex('users_email_idx').on(table.email),
		index('users_name_lower_idx').on(sql`LOWER(${table.name})`),
		index('users_email_lower_idx').on(sql`LOWER(${table.email})`),
	],
);

export const sessions = pgTable(
	'sessions',
	{
		id: serial('id').primaryKey(),
		token: text('token').notNull().unique(),
		ipAddress: text('ip_address').default('Unknown'),
		userAgent: text('user_agent').default('Unknown'),
		deviceName: varchar('device_name', { length: 255 }).default('Unknown Device'),
		deviceType: varchar('device_type', { length: 50 }).default('Unknown'),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at').notNull(),
		isRevoked: boolean('is_revoked').default(false).notNull(),
		...timestamps,
	},
	table => [
		uniqueIndex('sessions_token_idx').on(table.token),
		index('sessions_user_id_idx').on(table.userId),
		index('sessions_expires_at_idx').on(table.expiresAt),
		index('sessions_is_revoked_idx').on(table.isRevoked),
		index('sessions_user_id_is_revoked_idx').on(table.userId, table.isRevoked),
		index('sessions_user_id_expires_at_idx').on(table.userId, table.expiresAt),
	],
);

export const accounts = pgTable(
	'accounts',
	{
		id: serial('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		...timestamps,
	},
	table => [
		uniqueIndex('accounts_account_id_provider_id_idx').on(table.accountId, table.providerId),
		index('accounts_user_id_idx').on(table.userId),
		index('accounts_provider_id_idx').on(table.providerId),
		index('accounts_access_token_expires_at_idx').on(table.accessTokenExpiresAt),
	],
);

export const verifications = pgTable(
	'verifications',
	{
		id: serial('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		tokenType: tokenTypeEnum('token_type').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		...timestamps,
	},
	table => [
		uniqueIndex('verifications_identifier_token_type_idx').on(table.identifier, table.tokenType),
		index('verifications_identifier_idx').on(table.identifier),
		index('verifications_value_idx').on(table.value),
		index('verifications_token_type_idx').on(table.tokenType),
		index('verifications_expires_at_idx').on(table.expiresAt),
		index('verifications_identifier_value_idx').on(table.identifier, table.value),
	],
);
