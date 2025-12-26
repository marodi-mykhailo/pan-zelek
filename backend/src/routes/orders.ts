import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { optionalAuth, authenticateToken, AuthRequest } from '../middleware/auth.js';
import { sendOrderConfirmation } from '../lib/email.js';
import { processPayment } from '../lib/payment.js';

const router = Router();

// POST /api/orders - Create new order
router.post('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      items,
      email,
      phone,
      name,
      street,
      city,
      postalCode,
      paymentMethod,
      sessionId,
    } = req.body;

    const userId = req.userId;

    // Calculate totals
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      const itemPrice = (product.pricePer100g / 100) * item.weight * item.quantity;
      total += itemPrice;

      orderItems.push({
        productId: item.productId,
        weight: item.weight,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    const shippingCost = total > 100 ? 0 : 15;
    const finalTotal = total + shippingCost;

    // Create or get address
    let address;
    if (userId) {
      address = await prisma.address.findFirst({
        where: {
          userId,
          street,
          city,
          postalCode,
        },
      });
    }

    if (!address) {
      const addressData: any = {
        street,
        city,
        postalCode,
        country: 'Poland',
        isDefault: !userId || false,
      };

      if (userId) {
        addressData.userId = userId;
      }

      address = await prisma.address.create({
        data: addressData,
      });
    }

    // Create order
    const orderData: any = {
      email,
      phone,
      status: 'PENDING',
      total: finalTotal,
      shippingCost,
      paymentMethod,
      paymentStatus: 'PENDING',
      shippingAddressId: address.id,
      items: {
        create: orderItems,
      },
    };

    if (userId) {
      orderData.userId = userId;
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    // Clear cart
    if (sessionId || userId) {
      await prisma.cartItem.deleteMany({
        where: {
          ...(userId ? { userId } : { sessionId }),
        },
      });
    }

    // Send confirmation email (mock)
    try {
      await sendOrderConfirmation(email, order.id, finalTotal);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the order if email fails
    }

    // Process payment (mock)
    let paymentResult;
    try {
      paymentResult = await processPayment({
        amount: finalTotal,
        currency: 'PLN',
        orderId: order.id,
        customerEmail: email,
        customerName: name,
        description: `Zamówienie #${order.id}`,
      });

      // Update payment status based on result
      if (paymentResult.success) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'PAID' },
        });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      // Order is still created, payment can be processed later
    }

    res.json({
      orderId: order.id,
      success: true,
      order,
      payment: paymentResult,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders - Get user's orders
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId! },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get order details
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
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
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (req.userId && order.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
