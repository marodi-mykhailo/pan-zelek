import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/users - Get all users (admin only)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // TODO: Check if user is admin

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
