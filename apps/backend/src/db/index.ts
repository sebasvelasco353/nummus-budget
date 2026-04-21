import { drizzle } from 'drizzle-orm/node-postgres'
import { getDatabaseUrl } from 'src/utils/config'

console.log("The DB URL is: ", getDatabaseUrl());
export const db = drizzle(getDatabaseUrl())

