import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/box-templates - Get user's box templates
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const templates = await prisma.boxTemplate.findMany({
      where: { userId: req.userId! },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ templates });
  } catch (error) {
    console.error('Error fetching box templates:', error);
    res.status(500).json({ error: 'Failed to fetch box templates' });
  }
});

// POST /api/box-templates - Save box template
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, items } = req.body;

    if (!name || !items || items.length === 0) {
      return res.status(400).json({ error: 'Name and items are required' });
    }

    const totalWeight = items.reduce((sum: number, item: any) => sum + item.weight, 0);

    const template = await prisma.boxTemplate.create({
      data: {
        userId: req.userId!,
        name,
        totalWeight,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            weight: item.weight,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({ success: true, template });
  } catch (error) {
    console.error('Error saving box template:', error);
    res.status(500).json({ error: 'Failed to save box template' });
  }
});

// DELETE /api/box-templates/:id - Delete box template
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const template = await prisma.boxTemplate.findUnique({
      where: { id },
    });

    if (!template || template.userId !== req.userId) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await prisma.boxTemplate.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting box template:', error);
    res.status(500).json({ error: 'Failed to delete box template' });
  }
});

export default router;
