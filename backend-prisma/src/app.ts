import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productosRouter from "./routes/productos";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Register routes
app.use("/productos", productosRouter);

app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("🎉 API Backend working!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
