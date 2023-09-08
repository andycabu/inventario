import { Router } from "express";
import Productos from "../models/Productos.js";

const router = Router();

router.get('/', (req, res) => {
  // Ruta al archivo HTML que deseas enviar
  const filePath = path.join(__dirname, 'dist', 'index.html');

  // Lee el contenido del archivo HTML
  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al leer el archivo HTML');
    }

    // Envía el archivo HTML como respuesta
    res.send(html);
  });
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

router.post("/productos/editar/:id", async (req, res) => {
  const { id } = req.params;
  await Productos.findByIdAndUpdate(id, req.body);
  res.redirect("/productos");
});

export default router;
