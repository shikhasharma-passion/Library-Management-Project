const Book = require("../models/Book");
const Issue = require("../models/Issue");

function calculateFine(returnDate) {
  const today = new Date();
  const dueDate = new Date(returnDate);
  const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
  return daysLate > 0 ? daysLate * 10 : 0;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatIssue(issue) {
  const fine = calculateFine(issue.returnDate);
  const plainIssue = issue.toObject ? issue.toObject() : issue;
  const id = plainIssue._id;

  delete plainIssue._id;
  delete plainIssue.__v;

  return {
    ...plainIssue,
    id,
    fine,
    status: fine > 0 ? "Overdue" : "Issued"
  };
}

async function getIssues(req, res) {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues.map(formatIssue));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createIssue(req, res) {
  try {
    const { student, book, date, returnDate } = req.body;

    if (!student || !book || !date || !returnDate) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const selectedBook = await Book.findOne({
      name: { $regex: `^${escapeRegex(book.trim())}$`, $options: "i" }
    });

    if (!selectedBook) {
      res.status(404).json({ success: false, message: "Book not found. Please add book first." });
      return;
    }

    if (selectedBook.status === "Issued") {
      res.status(409).json({ success: false, message: "Book is already issued" });
      return;
    }

    selectedBook.status = "Issued";
    await selectedBook.save();

    const issue = await Issue.create({
      student: student.trim(),
      book: selectedBook.name,
      bookId: selectedBook._id,
      date,
      returnDate
    });

    res.status(201).json(formatIssue(issue));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function returnBook(req, res) {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404).json({ success: false, message: "Issue record not found" });
      return;
    }

    if (issue.bookId) {
      await Book.findByIdAndUpdate(issue.bookId, { status: "Available" });
    }

    await issue.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  calculateFine,
  formatIssue,
  getIssues,
  createIssue,
  returnBook
};
