import "dotenv/config";
import express from "express";
import wishlistRoutes from "./routes/wishlist.routes";
import { authMiddleware } from "./middlewares/auth";

const app = express();

app.use(express.json());
app.use(authMiddleware);
app.use("/api/wishlist", wishlistRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
