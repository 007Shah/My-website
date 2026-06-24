import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import { initDb } from "./server/db.js";
import authRoutes from "./server/routes/auth.js";
import userRoutes from "./server/routes/users.js";
import postRoutes from "./server/routes/posts.js";
import pageRoutes from "./server/routes/pages.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize sqlite
  await initDb();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(cookieParser());

  // API routes FIRST
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/pages", pageRoutes);

  // Global error handler for API routes to always return JSON
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled API Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });

  // Falls through to JSON 404 for any unhandled API routes, preventing Vite HTML fallback
  app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
