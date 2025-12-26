import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const { category, inStock, search } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { namePl: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { descriptionPl: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return more detailed error in development, generic in production
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Failed to fetch products'
      : error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Failed to fetch products',
      message: errorMessage,
      details: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create new product (admin only)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      namePl,
      description,
      descriptionPl,
      category,
      pricePer100g,
      inStock,
      stockWeight,
      image,
    } = req.body;

    // TODO: Check if user is admin

    const product = await prisma.product.create({
      data: {
        name,
        namePl,
        description,
        descriptionPl,
        category,
        pricePer100g: parseFloat(pricePer100g),
        inStock: inStock ?? true,
        stockWeight: stockWeight ? parseFloat(stockWeight) : null,
        image,
      },
    });

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      namePl,
      description,
      descriptionPl,
      category,
      pricePer100g,
      inStock,
      stockWeight,
      image,
    } = req.body;

    // TODO: Check if user is admin

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(namePl && { namePl }),
        ...(description !== undefined && { description }),
        ...(descriptionPl !== undefined && { descriptionPl }),
        ...(category && { category }),
        ...(pricePer100g !== undefined && { pricePer100g: parseFloat(pricePer100g) }),
        ...(inStock !== undefined && { inStock }),
        ...(stockWeight !== undefined && { stockWeight: stockWeight ? parseFloat(stockWeight) : null }),
        ...(image !== undefined && { image }),
      },
    });

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // TODO: Check if user is admin

    await prisma.product.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
