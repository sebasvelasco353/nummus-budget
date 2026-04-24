import { Router } from 'express';
import { hashPassword } from 'src/utils/hash';
import { isUser } from 'src/utils/validation';
import { db } from 'src/db';
import { usersTable } from 'src/db/schema';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // TODO: Implement login logic
  console.log('Login Route')
  res.status(200).json({ message: 'Not implemented' });
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  if (!isUser(req.body)) {
    res.status(400).json({
      message: "request has no valid user",
      error: true
    });
  }

  try {
    const { name, lastName, password, email } = req.body;
    const tempUser = {
      name,
      lastName,
      email,
      passwordHash: await hashPassword(password),
    }
    const response = await db.insert(usersTable).values(tempUser).returning();
    res.status(200).json({
      message: 'User created successfully',
      data: response[0]
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      error: true
    })
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  // TODO: Implement logout logic
  console.log('Logout Route')
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
