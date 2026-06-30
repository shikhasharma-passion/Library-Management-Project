const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const frontendPath = path.join(__dirname, "..");
const requestedPort = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function setupMockMongoose() {
  const mockMongoose = require("./utils/mockMongoose");
  const mongoosePath = require.resolve("mongoose");
  require.cache[mongoosePath] = {
    id: mongoosePath,
    filename: mongoosePath,
    loaded: true,
    exports: mockMongoose
  };
}

function registerAppRoutes() {
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/books", require("./routes/bookRoutes"));
  app.use("/api/students", require("./routes/studentRoutes"));
  app.use("/api/issues", require("./routes/issueRoutes"));
  app.use("/api/catalog", require("./routes/catalogRoutes"));
  app.use("/api/digital-books", require("./routes/digitalBookRoutes"));
  app.use("/api/contact", require("./routes/contactRoutes"));
  app.use("/api/suggestions", require("./routes/suggestionRoutes"));
  app.use("/api", require("./routes/dashboardRoutes"));

  app.post("/api/login", require("./controllers/authController").login);
  app.post("/api/register", require("./controllers/authController").register);

  app.get("/api/health", (req, res) => {
    res.json({ success: true, app: "LibraryMS", status: "running" });
  });

  app.use(express.static(frontendPath));

  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  app.use((req, res) => {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ success: false, message: "API route not found" });
      return;
    }

    res.status(404).sendFile(path.join(frontendPath, "index.html"));
  });
}

function startServer(port, attempts = 0) {
  const server = app.listen(port, () => {
    console.log(`LibraryMS running at http://localhost:${port}`);
    console.log("Default admin login: admin / admin123");
  });

  server.on("error", error => {
    if (error.code === "EADDRINUSE" && attempts < 10) {
      const nextPort = port + 1;
      console.log(`Port ${port} busy hai, backend http://localhost:${nextPort} par start ho raha hai...`);
      startServer(nextPort, attempts + 1);
      return;
    }

    throw error;
  });
}

async function bootstrap() {
  try {
    await connectDB();
  } catch (error) {
    console.warn("MongoDB Atlas connection failed:", error.message);
    console.log("Initializing Local JSON Fallback Database...");
    setupMockMongoose();
  }

  // Seed catalog books (handles mock or real connection)
  const seedCatalogBooks = require("./utils/seedCatalogBooks");
  await seedCatalogBooks();

  // Load and register routes
  registerAppRoutes();

  // Start Express server
  startServer(requestedPort);
}

bootstrap().catch(error => {
  console.error("Bootstrap failed:", error.message);
  process.exit(1);
});
