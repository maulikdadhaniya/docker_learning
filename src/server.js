const express = require("express");
const { getAllItems, getItemById } = require("./data/items");

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "docker-learning-api",
    version: "1.0.0",
    storage: "static",
    docs: {
      health: "GET /health",
      items: "GET /api/items",
      item: "GET /api/items/:id",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/items", (_req, res) => {
  res.json({ items: getAllItems() });
});

app.get("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = getItemById(id);

  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  res.json({ item });
});

// 0.0.0.0 is required in Docker. If you use 127.0.0.1, the API is only
// reachable from inside the container, not from your browser or Contabo.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
