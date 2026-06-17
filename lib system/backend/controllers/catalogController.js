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

async function addBookReview(req, res) {
  try {
    const { id } = req.params;
    const { studentName, rating, comment } = req.body;

    if (!studentName || !rating || !comment) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const book = await CatalogBook.findById(id);
    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    book.reviews.push({
      studentName: studentName.trim(),
      rating: Number(rating),
      comment: comment.trim()
    });

    await book.save();
    res.json({ success: true, reviews: book.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getCatalogBooks,
  addBookReview
};

