import { drizzle } from 'drizzle-orm/d1';
import type { ApiContext } from '../index';

export function getDb(c: ApiContext) {
  return drizzle(c.env.DB);
}
