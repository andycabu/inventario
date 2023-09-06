import express from "express";
import indexRoutes from "./routes/indexRoutes.js";
import morgan from "morgan";
import path from "path"; // Importamos el módulo path para poder usar la función join

const app = express();
app.use(express.static("src"));
app.set("views", path.join(__dirname, "views"));

//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use(indexRoutes);

export default app;