import express from "express";
import indexRoutes from "../routes/indexRoutes.js";
import serverless from "serverless-http";
import "../database.js"; //Importamos la conexión a la base de datos

const api = express();
api.use(express.static(__dirname + "/dist"));

//Middlewares
api.use(express.json());
api.use(express.urlencoded({ extended: false }));

//Rutas
api.use('/.netlify/functions/api', indexRoutes);

export const handler = serverless(api);

