import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

/**
 * GET /productos
 * Returns all products from the database.
 */
router.get("/", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    console.error("Error loading products:", error);
    res.status(500).json({ error: "Error retrieving products" });
  }
});

export default router;
