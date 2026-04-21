import { User } from '@nummus/types';
import { db } from './index';
import { usersTable } from "./schema";
import { hashPassword } from 'src/utils/hash';
import { eq } from "drizzle-orm";

async function seedDatabase(): Promise<void> {
  const password = await hashPassword("myPassword_123");
  const mockUser: User = {
    name: 'Elzo',
    lastName: 'Poncio',
    createdAt: new Date(),
    email: "seed@email.com",
    passwordHash: password
  }
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, mockUser.email));

  if (user.length > 0) return;
  await db.insert(usersTable).values(mockUser)
}

seedDatabase().catch(err => {
  console.error(err);
  process.exit(1);
});

