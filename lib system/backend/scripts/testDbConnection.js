const path = require("path");
const dns = require("dns");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "..", ".env") });
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("<username>") || uri.includes("your_username")) {
    console.error("MONGODB_URI placeholder hai. backend/.env me real MongoDB Atlas URI paste karo.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || "libraryms"
    });
    console.log("MongoDB Atlas connected successfully.");
    console.log(`Database name: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
