import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

/**
 * GET /productos
 * Devuelve todos los productos disponibles.
 */
router.get("/", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

export default router;
