import { type AnyColumn, type SQL, type SQLWrapper, asc, desc } from 'drizzle-orm';
import type { AnyPgTable } from 'drizzle-orm/pg-core';
import { text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Common timestamp columns for createdAt and updatedAt
 */
export const timestamps = {
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
};

export const seoFields = {
	seoTitle: text('seo_title'),
	seoDescription: text('seo_description'),
	seoKeywords: text('seo_keywords').array(),
};

/**
 * Resolve a column from a Drizzle schema object + column name string with sorting
 * @param model The Drizzle table object (e.g. posts)
 * @param columnName The column name as string (e.g. "title")
 * @param order The sort order - 'asc' or 'desc' (default: 'asc')
 * @returns The schema reference wrapped with asc/desc (e.g. desc(posts.title)) or undefined if column doesn't exist
 */
export function orderByColumn<T extends AnyPgTable>(
	model: T,
	columnName?: string,
	order?: 'asc' | 'desc',
): SQL<unknown> | undefined {
	if (!columnName || !order) return undefined;

	if (!(columnName in model)) {
		return undefined;
	}

	const column = model[columnName as keyof T] as AnyColumn | SQLWrapper;
	return order === 'desc' ? desc(column) : asc(column);
}
