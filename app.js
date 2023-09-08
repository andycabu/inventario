import express from "express";
import indexRoutes from "./routes/indexRoutes.js";

const app = express();
app.use(express.static(__dirname));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use(indexRoutes);

export default app;
