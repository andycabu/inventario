require("dotenv").config();
import { connect } from "mongoose";

const SERVER = process.env.MONGODB_URI;

(async () => {
  try {
    const db = await connect(SERVER);
    console.log("DB is connected to:", db.connection.name);
  } catch (error) {
    console.log(error);
  }
})();
