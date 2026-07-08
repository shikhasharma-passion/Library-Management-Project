const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("<username>") || uri.includes("your_username")) {
    throw new Error("MongoDB Atlas URI is missing or invalid in backend/.env file.");
  }

  // Extract host for DNS pre-check
  const hostMatch = uri.match(/@([^/]+)/);
  if (hostMatch) {
    const host = hostMatch[1].split(":")[0];
    await new Promise((resolve, reject) => {
      dns.lookup(host, (err) => {
        if (err) {
          reject(new Error(`DNS resolution failed for ${host}. Internet connection check failed.`));
        } else {
          resolve();
        }
      });
    });
  }

  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || "libraryms",
    serverSelectionTimeoutMS: 5000
  });
  console.log("MongoDB Atlas connected");
}

module.exports = connectDB;
