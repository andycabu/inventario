import { connect } from "mongoose";

const SERVER = "mongodb://127.0.0.1:27017/inventario";

(async () => {
  try {
    const db = await connect(SERVER);
    console.log("DB is connected to:", db.connection.name);
  } catch (error) {
    console.log(error);
  }
})();
