import { InferSelectModel } from 'drizzle-orm';
import { accounts, sessions, users } from '../models/drizzle/auth.model';

export type UserSchemaType = InferSelectModel<typeof users>;
export type AccountSchemaType = InferSelectModel<typeof accounts>;
export type SessionSchemaType = InferSelectModel<typeof sessions>;
