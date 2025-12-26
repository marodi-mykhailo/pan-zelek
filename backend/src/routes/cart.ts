import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/cart - Get cart by sessionId or userId
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const userId = req.userId;

    const where: any = {};
    if (userId) {
      where.userId = userId;
    } else if (sessionId) {
      where.sessionId = sessionId;
    } else {
      return res.json({ items: [], total: 0 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where,
      include: {
        product: true,
      },
    });

    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      product: {
        id: item.product.id,
        namePl: item.product.namePl,
        image: item.product.image,
        pricePer100g: item.product.pricePer100g,
      },
      weight: item.weight,
      quantity: item.quantity,
    }));

    const total = items.reduce((sum, item) => {
      return sum + (item.product.pricePer100g / 100) * item.weight * item.quantity;
    }, 0);

    res.json({ items, total });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity, weight } = req.body;
    const sessionId = req.headers['x-session-id'] as string;
    const userId = req.userId;

    if (!sessionId && !userId) {
      return res.status(400).json({ error: 'Session ID or User ID required' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        productId,
        weight,
        ...(userId ? { userId } : { sessionId }),
      },
    });

    if (existingItem) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
        include: { product: true },
      });
      return res.json({ success: true, item: updated });
    }

    // Create new cart item
    const cartData: any = {
      productId,
      weight,
      quantity: quantity || 1,
    };

    if (userId) {
      cartData.userId = userId;
    } else {
      cartData.sessionId = sessionId;
    }

    const newItem = await prisma.cartItem.create({
      data: cartData,
      include: { product: true },
    });

    res.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:itemId - Update cart item
router.put('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, weight } = req.body;

    const updateData: any = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (weight !== undefined) updateData.weight = weight;

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: updateData,
      include: { product: true },
    });

    res.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

export default router;
