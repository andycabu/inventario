import { Router } from "express";
import Productos from "../models/Productos.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/productos", async (req, res) => {
  const productos = await Productos.find().lean();
  res.json(productos);
});

router.post("/productos/agregar", async (req, res) => {
  try {
    const productos = Productos(req.body);
    await productos.save();
    res.redirect("/productos");
  } catch (error) {
    console.log(error);
  }
});

router.get("/productos/buscar", async (req, res) => {
  const { nombre } = req.query;
  const productosEncontrados = await Productos.find({
    nombre: { $regex: nombre, $options: "i" },
  }).lean();

  res.json({ productosEncontrados });
});

router.get("/productos/eliminar/:id", async (req, res) => {
  const { id } = req.params;
  await Productos.findByIdAndDelete(id);
  res.redirect("/productos");
});

router.put("/productos/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { nuevoStock } = req.body;

  const productoActualizado = await Productos.findById(id);

  productoActualizado.stock = nuevoStock;

  await productoActualizado.save();

  res.redirect("/productos");
});

export default router;
