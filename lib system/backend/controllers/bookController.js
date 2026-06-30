const Book = require("../models/Book");
const Issue = require("../models/Issue");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getBooks(req, res) {
  try {
    const query = String(req.query.q || "").trim();
    const status = String(req.query.status || "").trim();
    const safeQuery = escapeRegex(query);
    const filter = query
      ? {
          $or: [
            { name: { $regex: safeQuery, $options: "i" } },
            { author: { $regex: safeQuery, $options: "i" } },
            { category: { $regex: safeQuery, $options: "i" } },
            { status: { $regex: safeQuery, $options: "i" } }
          ]
        }
      : {};

    if (status) {
      filter.status = status;
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createBook(req, res) {
  try {
    const { name, author, category } = req.body;

    if (!name || !author || !category) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const book = await Book.create({
      name: name.trim(),
      author: author.trim(),
      category: category.trim(),
      status: "Available"
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteBook(req, res) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    await Issue.deleteMany({ bookId: book._id });
    await book.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getBooks,
  createBook,
  deleteBook
};
