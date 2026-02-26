import { pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const roleEnum = pgEnum('role', ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']);

export const tokenTypeEnum = pgEnum('token_type', ['EMAIL_VERIFICATION', 'PASSWORD_RESET']);

export const productStatusEnum = pgEnum('product_status', ['DRAFT', 'ACTIVE', 'ARCHIVED']);

export const taxStatusEnum = pgEnum('tax_status', ['TAXABLE', 'SHIPPING', 'NONE']);

export const taxClassEnum = pgEnum('tax_class', ['STANDARD', 'REDUCED_RATE', 'ZERO_RATE']);

export const allowBackordersEnum = pgEnum('allow_backorders', ['NO', 'NOTIFY', 'YES']);

export const currencyEnum = pgEnum('currency', ['USD', 'BDT']);

export const cartStatusEnum = pgEnum('cart_status', ['ACTIVE', 'ORDERED', 'ABANDONED']);

export const orderStatusEnum = pgEnum('order_status', [
	'PENDING',
	'PAID',
	'FULFILLED',
	'CANCELLED',
	'REFUNDED',
]);

export const paymentProviderEnum = pgEnum('payment_provider', ['STRIPE', 'SSLCOMMERZ']);

export const paymentStatusEnum = pgEnum('payment_status', [
	'REQUIRES_PAYMENT_METHOD',
	'REQUIRES_CONFIRMATION',
	'PROCESSING',
	'SUCCEEDED',
	'FAILED',
	'CANCELLED',
	'REFUNDED',
]);

export const addressTypeEnum = pgEnum('address_type', ['BILLING', 'SHIPPING']);

export const discountTypeEnum = pgEnum('discount_type', ['PERCENT', 'FIXED']);

export const orderPaymentStatusEnum = pgEnum('order_payment_status', [
	'UNPAID',
	'PARTIALLY_PAID',
	'PAID',
	'REFUNDED',
]);

// SMTP and Email related enums
export const smtpEncryptionEnum = pgEnum('smtp_encryption', ['NONE', 'SSL', 'TLS', 'STARTTLS']);

export const serviceListEnum = pgEnum('service_list', ['CONTACT', 'SUBSCRIPTION', 'ORDER', 'CART']);

export const emailStatusEnum = pgEnum('email_status', ['PENDING', 'SENT', 'FAILED', 'RETRY']);

export const emailTemplateTypeEnum = pgEnum('email_template_type', [
	'VERIFICATION',
	'PASSWORD_RESET',
	'ORDER_CONFIRMATION',
	'CONTACT_REPLY',
	'NEWSLETTER',
	'ORDER_STATUS',
	'CUSTOM',
]);
