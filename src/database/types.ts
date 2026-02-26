import { InferSelectModel } from 'drizzle-orm';
import { users } from '../models/drizzle/auth.model';

export type UserSchemaType = InferSelectModel<typeof users>;
