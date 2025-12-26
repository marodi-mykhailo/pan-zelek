import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { sendOrderStatusUpdate } from '../lib/email.js';

const router = Router();

// Middleware to check admin role
const requireAdmin = async (req: AuthRequest, res: any, next: any) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin role:', error);
    return res.status(500).json({ error: 'Failed to verify admin access' });
  }
};

// GET /api/admin/stats - Get admin statistics
router.get('/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { total: true },
      }),
    ]);

    const totalRevenue = orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/orders - Get all orders
router.get('/orders', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    // Send status update email (mock)
    try {
      await sendOrderStatusUpdate(order.email, order.id, status);
    } catch (error) {
      console.error('Failed to send status update email:', error);
      // Don't fail the update if email fails
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
