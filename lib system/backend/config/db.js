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
    throw new Error("MongoDB Atlas URI missing hai. backend/.env me real MONGODB_URI paste karo.");
  }

  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || "libraryms"
  });
  console.log("MongoDB Atlas connected");
}

module.exports = connectDB;
