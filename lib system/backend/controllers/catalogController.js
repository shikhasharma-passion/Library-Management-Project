const CatalogBook = require("../models/CatalogBook");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getCatalogBooks(req, res) {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (q) {
      const safeQuery = escapeRegex(String(q).trim());
      filter.$or = [
        { name: { $regex: safeQuery, $options: "i" } },
        { author: { $regex: safeQuery, $options: "i" } },
        { category: { $regex: safeQuery, $options: "i" } }
      ];
    }

    const books = await CatalogBook.find(filter).sort({ category: 1, name: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getCatalogBooks
};
