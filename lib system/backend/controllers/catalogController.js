const CatalogBook = require("../models/CatalogBook");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getCatalogBooks(req, res) {
  try {
    const { category, semester, q } = req.query;
    const filter = {};

    if (category && category !== "All") {
      if (category === "Computer") {
        filter.category = { $in: ["BCA", "MCA"] };
      } else if (category === "Management") {
        filter.category = { $in: ["BBA", "MBA"] };
      } else {
        filter.category = category;
      }
    }

    if (semester && semester !== "All") {
      filter.semester = semester;
    }

    if (q) {
      const words = String(q).trim().split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        filter.$and = words.map(word => {
          const safeWord = escapeRegex(word);
          return {
            $or: [
              { name: { $regex: safeWord, $options: "i" } },
              { author: { $regex: safeWord, $options: "i" } },
              { publisher: { $regex: safeWord, $options: "i" } },
              { subjectCode: { $regex: safeWord, $options: "i" } },
              { rackNo: { $regex: safeWord, $options: "i" } },
              { category: { $regex: safeWord, $options: "i" } },
              { semester: { $regex: safeWord, $options: "i" } },
              { accessionNo: { $regex: safeWord, $options: "i" } },
              { isbn: { $regex: safeWord, $options: "i" } }
            ]
          };
        });
      }
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

