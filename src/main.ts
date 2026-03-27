import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiResponseInterceptor } from './core/api-response.interceptor';
import { EnvType } from './core/env';
import { HttpExceptionFilter } from './core/http-exception.filter';
import { displayStartupInfo } from './core/logger';
import { logAllRoutes } from './core/route-logger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Get ConfigService instance
	const configService = app.get(ConfigService<EnvType, true>);

	// Get configuration values
	const originUrls = configService.get<string>('ORIGIN_URL', { infer: true }).split(',');
	const port = configService.get<number>('PORT', 3000);

	app.enableCors({
		origin: function (
			origin: string | undefined,
			callback: (err: Error | null, allow?: boolean) => void,
		) {
			if (!origin || originUrls.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'ngrok-skip-browser-warning'],
		maxAge: 3600,
	});

	// Apply global exception filter for custom error responses
	app.useGlobalFilters(new HttpExceptionFilter());

	// Apply global response interceptor for consistent response format
	app.useGlobalInterceptors(new ApiResponseInterceptor());

	// Initialize and start the server
	await app.init();
	await app.listen(port);

	// Display startup information
	displayStartupInfo(port);

	// Log all routes (only in development mode)
	logAllRoutes(app, {
		saveToFile: true,
		logToConsole: false,
	});
}
bootstrap();
