import { z } from 'zod';

import { validateString } from './validators/commonRules';

// const smtpEnvSchema = z.object({
// 	SMTP_HOST: validateString('SMTP_HOST'),
// 	SMTP_PORT: validateEnvNumber('SMTP_PORT', { min: 1, max: 65535, int: true }),
// 	SMTP_USER: validateString('SMTP_USER'),
// 	SMTP_PASSWORD: validateString('SMTP_PASSWORD'),
// });

// const amazons3EnvSchema = z.object({
// 	AWS_ACCESS_KEY_ID: validateString('AWS_ACCESS_KEY_ID'),
// 	AWS_SECRET_ACCESS_KEY: validateString('AWS_SECRET_ACCESS_KEY'),
// 	AWS_REGION: validateString('AWS_REGION'),
// 	AWS_S3_BUCKET_NAME: validateString('AWS_S3_BUCKET_NAME'),
// 	CLOUDFRONT_URL: validateString('CLOUDFRONT_URL'),
// });

const secretSchema = z.object({
	AUTH_SECRET: validateString('AUTH_SECRET'),
	CRYPTO_SECRET: validateString('CRYPTO_SECRET'),
	CSRF_SECRET: validateString('CSRF_SECRET'),
});

// const googleEnvSchema = z.object({
// 	GOOGLE_CLIENT_ID: validateString('GOOGLE_CLIENT_ID'),
// 	GOOGLE_CLIENT_SECRET: validateString('GOOGLE_CLIENT_SECRET'),
// 	GOOGLE_CALLBACK_URL: validateString('GOOGLE_CALLBACK_URL'),
// });

export const envSchema = z.object({
	DATABASE_URL: validateString('DATABASE_URL'),
	PORT: validateString('PORT').refine(value => !isNaN(Number(value)), 'PORT must be a number'),
	// NODE_ENV: validateEnum('NODE_ENV', ['development', 'production']).default('development'),
	COOKIE_DOMAIN: validateString('COOKIE_DOMAIN'),
	ORIGIN_URL: validateString('ORIGIN_URL'),
	API_URL: validateString('API_URL'),
	APP_URL: validateString('APP_URL'),
	TOKEN_RESET_EXPIRY: validateString('TOKEN_RESET_EXPIRY').refine(
		value => !isNaN(Number(value)),
		'TOKEN_RESET_EXPIRY must be a number',
	),
	// BEARER_TOKEN: validateString('BEARER_TOKEN'),
	...secretSchema.shape,
	// ...googleEnvSchema.shape,
	// ...amazons3EnvSchema.shape,
	// ...smtpEnvSchema.shape,
});

export type EnvType = z.infer<typeof envSchema>;

// NestJS ConfigModule validation function
export function validateEnv(config: Record<string, unknown>): EnvType {
	const result = envSchema.safeParse(config);

	if (!result.success) {
		const errorMessages = result.error.issues.map(e => e.message).join('\n');
		console.error(`\x1b[31mEnvironment validation failed:\n${errorMessages}\x1b[0m`);
		throw new Error('Environment validation failed');
	}

	return result.data;
}
