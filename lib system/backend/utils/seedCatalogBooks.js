const CatalogBook = require("../models/CatalogBook");
const { ensureAdminUser } = require("../controllers/authController");
const catalogData = require("./catalogData");

async function seedCatalogBooks() {
  await ensureAdminUser();

  const count = await CatalogBook.countDocuments();

  if (count > 0) {
    return;
  }

  await CatalogBook.insertMany(catalogData);
  console.log("Catalog books seeded");
}

module.exports = seedCatalogBooks;
