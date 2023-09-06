import { Router } from "express";
import Productos from "../models/Productos.js";

const router = Router();

router.get("/", async (req, res) => {
  const productos = await Productos.find().lean();

  res.render("index", productos);
});

router.post("/productos/agregar", async (req, res) => {
  try {
    const productos = Productos(req.body);
    await productos.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// router.get("/update/:id", async (req, res) => {
//   try {
//     const producto = await Productos.findById(req.params.id).lean();
//     res.render("editar", { producto: producto });
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// router.get("/update/:id", async (req, res) => {
//   const { id } = req.params;
//   await Productos.findByIdAndUpdate(id, req.body);

//   res.redirect("/");
// });

export default router;
