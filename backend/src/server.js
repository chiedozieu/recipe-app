import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
app.use(express.json());

const PORT = ENV.PORT || 5001;

app.get("/api/test", (req, res) => {
  res.status(200).json({ success: true, message: "Hello from the backend" });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipeId || !title) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const newFavorite = await db
      .insert(favoritesTable)
      .values({ userId, recipeId, title, image, cookTime, servings }).returning();
    return res
      .status(201)
      .json(newFavorite[0]);
  } catch (error) {
    console.log("Error creating favorite:", error);
    return res
      .status(500)
      .json({ error: "Internal server error" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
   await db.delete(favoritesTable).where(
     and(
       eq(favoritesTable.userId, userId),
       eq(favoritesTable.recipeId, parseInt(recipeId))
     )
   )
    return res
      .status(200)
      .json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.log("Error deleting favorite:", error);
    return res
      .status(500)
      .json({ error: "Internal server error" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    return res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching favorites:", error);
    return res
      .status(500)
      .json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port: " + PORT);
});
ENV;
