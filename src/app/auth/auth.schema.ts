import z from 'zod';
import {
	validateEmail,
	validatePassword,
	validatePhoneNumber,
	validateString,
} from '../../core/validators/commonRules';

export const loginSchema = z.object({
	email: validateEmail,
	password: validateString('Password'),
});

export const registerSchema = z.object({
	name: validateString('Name').optional(),
	email: validateEmail,
	password: validatePassword,
	phone: validatePhoneNumber('Phone').optional(),
});

export const verifyTokenSchema = z.object({
	email: validateEmail,
	token: validateString('Token'),
});

export const resetPasswordSchema = z.object({
	email: validateEmail,
	token: validateString('Token'),
	newPassword: validatePassword,
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type VerifyTokenDto = z.infer<typeof verifyTokenSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
