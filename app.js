import express from "express";
import indexRoutes from "./routes/indexRoutes.js";
import serverless from "serverless-http";
import "./database.js"; //Importamos la conexión a la base de datos

const app = express();
app.use(express.static(__dirname + "/dist"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use(indexRoutes);

const handler = serverless(app);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
