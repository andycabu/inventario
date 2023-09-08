import { Router } from "express";
import Productos from "../models/Productos.js";
import {config} from 'dotenv'
config()

const PRODUCTOS = process.env.RUTA_FETCH;

const router = Router();

router.get("/productos", async (req, res) => {
  const productos = await Productos.find().lean();
  res.json(productos);
});

router.post("/productos/agregar", async (req, res) => {
  try {
    const productos = Productos(req.body);
    await productos.save();
    res.redirect(PRODUCTOS);
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
  res.redirect(PRODUCTOS);
});

router.post("/productos/editar/:id", async (req, res) => {
  const { id } = req.params;
  await Productos.findByIdAndUpdate(id, req.body);
  res.redirect(PRODUCTOS);
});

export default router;
