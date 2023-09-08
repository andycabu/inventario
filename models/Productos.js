import { Schema, model } from "mongoose";

const productoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    referencia: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fechaCaducidad: {
      type: Date,
      required: true,
      unique: false,
      trim: true,
    },
    categoria: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      unique: false,
      trim: true,
    },
    options: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Producto", productoSchema);
