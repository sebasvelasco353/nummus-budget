import { drizzle } from 'drizzle-orm/node-postgres'
import { getDatabaseUrl } from 'src/utils/config'

export const db = drizzle(getDatabaseUrl())

