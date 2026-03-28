import { BadRequestException, Body, Controller, HttpStatus, Post, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request as ExpressRequest } from 'express';
import { ApiResponse, createApiResponse } from '../../core/api-response.interceptor';
import AppHelpers from '../../core/app.helper';
import { sessionTimeout } from '../../core/constants';
import { EnvType } from '../../core/env';
import { CreateUser, UserWithoutPasswordResponse } from './@types/auth.types';
import { type LoginDto, loginSchema, type RegisterDto, registerSchema } from './auth.schema';
import { AuthService } from './auth.service';
import { AuthSession } from './auth.session';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private authSession: AuthSession,
		private configService: ConfigService<EnvType, true>,
	) {}
	@Post('register')
	async register(
		@Body() registerDto: RegisterDto,
	): Promise<ApiResponse<UserWithoutPasswordResponse>> {
		const validate = registerSchema.safeParse(registerDto);
		if (!validate.success) {
			throw new BadRequestException(
				`Validation failed: ${validate.error.issues.map(issue => issue.message).join(', ')}`,
			);
		}

		const userData: CreateUser = {
			name: validate.data.name || null,
			email: validate.data.email,
			password: validate.data.password,
			phone: validate.data.phone || null,
		};

		const existingUser = await this.authService.checkIfUserExists(userData.email);

		if (existingUser) throw new BadRequestException('User with this email already exists');

		const user = await this.authService.createUser(userData);

		const responseUser: UserWithoutPasswordResponse = {
			...user,
		};

		return createApiResponse(HttpStatus.CREATED, 'User registered successfully', responseUser);
	}

	@Post('login')
	async login(
		@Body() loginDto: LoginDto,
		@Request() request: ExpressRequest,
	): Promise<ApiResponse<UserWithoutPasswordResponse>> {
		const validate = loginSchema.safeParse(loginDto);
		if (!validate.success) {
			throw new BadRequestException(
				`Validation failed: ${validate.error.issues.map(issue => issue.message).join(', ')}`,
			);
		}

		const user = await this.authService.validateUser(validate.data);

		const userDeviceInfo = this.authSession.getSessionInfo(request);

		const accessToken = await this.authService.generateAccessToken({
			userId: user.id,
			email: user.email,
			userAgent: userDeviceInfo.userAgent,
			ipAddress: userDeviceInfo.ipAddress,
			deviceName: userDeviceInfo.deviceName,
			deviceType: userDeviceInfo.deviceType,
		});

		const cookieConfig = AppHelpers.sameSiteCookieConfig(this.configService);

		// Set cookie
		request.res?.cookie('access-token', accessToken, {
			httpOnly: true,
			secure: cookieConfig.secure,
			sameSite: cookieConfig.sameSite,
			domain: cookieConfig.domain,
			maxAge: sessionTimeout,
		});

		return createApiResponse(HttpStatus.OK, 'Login successful', user);
	}
}
