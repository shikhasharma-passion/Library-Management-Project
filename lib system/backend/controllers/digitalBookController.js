const DigitalBook = require("../models/DigitalBook");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getDigitalBooks(req, res) {
  try {
    const { stream, semester, q } = req.query;
    const filter = {};

    if (stream && stream !== "All") {
      filter.stream = stream;
    }

    if (semester && semester !== "All") {
      filter.semester = semester;
    }

    if (q) {
      const safeQuery = escapeRegex(String(q).trim());
      filter.$or = [
        { name: { $regex: safeQuery, $options: "i" } },
        { author: { $regex: safeQuery, $options: "i" } },
        { category: { $regex: safeQuery, $options: "i" } },
        { description: { $regex: safeQuery, $options: "i" } },
        { semester: { $regex: safeQuery, $options: "i" } }
      ];
    }

    const books = await DigitalBook.find(filter).sort({ name: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getDigitalBookById(req, res) {
  try {
    const { id } = req.params;
    const book = await DigitalBook.findById(id);
    if (!book) {
      res.status(404).json({ success: false, message: "E-Book not found" });
      return;
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function incrementReadCount(req, res) {
  try {
    const { id } = req.params;
    const book = await DigitalBook.findById(id);
    if (!book) {
      res.status(404).json({ success: false, message: "E-Book not found" });
      return;
    }
    book.readCount = (book.readCount || 0) + 1;
    await book.save();
    res.json({ success: true, readCount: book.readCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getDigitalBooks,
  getDigitalBookById,
  incrementReadCount
};
