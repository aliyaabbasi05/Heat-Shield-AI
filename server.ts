import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { initDb } from "./src/db/index";
import { sitesRouter } from "./src/server/routes/sites";
import { agentRouter } from "./src/server/routes/agent";
import { fortyguardRouter } from "./src/server/routes/fortyguard";
import { locationRouter } from "./src/server/routes/location";
import { alertsRouter } from "./src/server/routes/alerts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  try {
    await initDb();
    console.log("Database initialized");
    // Warm up site thermal intelligence cache asynchronously on startup
    import("./src/server/services/agent").then(({ analyzeAllSites }) => {
      analyzeAllSites().catch(err => console.log("[Thermal Cache Warmup]", err.message));
    });
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }

  // --- API Routes ---
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      fortyguard: !!process.env.FORTYGUARD_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/sites", sitesRouter);
  app.use("/api/agent", agentRouter);
  app.use("/api/fortyguard", fortyguardRouter);
  app.use("/api/location", locationRouter);
  app.use("/api/alerts", alertsRouter);

  // --- Vite Middleware (Development) or Static Serve (Production) ---
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
