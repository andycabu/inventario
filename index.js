import app from "./app.js"; // Importamos la aplicación de Express
import "./database.js"; // Importamos la conexión a la base de datos

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
