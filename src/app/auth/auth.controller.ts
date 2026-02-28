import { BadRequestException, Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, createApiResponse } from '../../core/api-response.interceptor';
import { CreateUser, UserWithoutPasswordResponse } from './@types/auth.types';
import { type RegisterDto, registerSchema } from './auth.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
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
}
