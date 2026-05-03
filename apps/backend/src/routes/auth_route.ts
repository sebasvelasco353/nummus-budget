import { Router } from 'express';
import { hashPassword } from 'src/utils/hash';
import { isUser, validateEmail, validatePassword } from 'src/utils/validation';
import { db } from 'src/db';
import { usersTable } from 'src/db/schema';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // TODO: Implement login logic
  console.log('Login Route')
  res.status(201).json({ message: 'Not implemented' });
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  if (!isUser(req.body)) {
    res.status(400).json({ message: "request has no valid user", error: true });
    return;
  }
  const { name, lastName, password, email } = req.body;
  if (!validateEmail(email)) {
    res.status(400).json({ message: "Not a valid email", error: true });
    return;
  }
  if (!validatePassword(password)) {
    res.status(400).json({
      message: "Invalid password, it must have at least one lowercase letter, one uppercase letter, One digit (0-9), One special character from @$!%*?&, and At least 8 characters",
      error: true
    })
    return;
  }
  try {
    const tempUser = {
      name,
      lastName,
      email,
      passwordHash: await hashPassword(password),
    }
    const response = await db.insert(usersTable).values(tempUser).returning();
    res.status(200).json({
      message: 'User created successfully',
      data: { name: response[0].name, id: response[0].id, email: response[0].email, createdAt: response[0].createdAt }
    });
  } catch (error) {
    const message = error.cause?.detail || error.message || "Unknown server error";
    res.status(500).json({ message, error: true });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  // TODO: Implement logout logic
  console.log('Logout Route')
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
