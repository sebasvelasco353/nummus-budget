import { Router } from 'express';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // TODO: Implement login logic
  console.log('Login Route')
  res.status(200).json({ message: 'Not implemented' });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  // TODO: Implement logout logic
  console.log('Logout Route')
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
