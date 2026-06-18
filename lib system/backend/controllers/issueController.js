const Book = require("../models/Book");
const Issue = require("../models/Issue");
const BorrowRequest = require("../models/BorrowRequest");
const ExtensionRequest = require("../models/ExtensionRequest");

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

async function requestBorrow(req, res) {
  try {
    const { student, book, date, returnDate } = req.body;

    if (!student || !book || !date || !returnDate) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    // Check if the book is catalogued and has an Available physical copy
    const selectedBook = await Book.findOne({
      name: { $regex: `^${escapeRegex(book.trim())}$`, $options: "i" }
    });

    if (!selectedBook) {
      res.status(404).json({ success: false, message: "Book not found in library stock" });
      return;
    }

    if (selectedBook.status === "Issued") {
      res.status(409).json({ success: false, message: "This book is currently issued to someone else" });
      return;
    }

    // Check if user already has a pending borrow request for this book
    const existingRequest = await BorrowRequest.findOne({
      student: student.trim(),
      book: selectedBook.name,
      status: "Pending"
    });

    if (existingRequest) {
      res.status(409).json({ success: false, message: "You already have a pending borrow request for this book" });
      return;
    }

    const borrowRequest = await BorrowRequest.create({
      student: student.trim(),
      book: selectedBook.name,
      requestDate: date,
      returnDate: returnDate,
      status: "Pending"
    });

    res.status(201).json({ success: true, borrowRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getBorrowRequests(req, res) {
  try {
    const requests = await BorrowRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getStudentBorrowRequests(req, res) {
  try {
    const studentName = String(req.query.name || "").trim();
    if (!studentName) {
      res.status(400).json({ success: false, message: "Student name required" });
      return;
    }

    const requests = await BorrowRequest.find({
      student: { $regex: `^${escapeRegex(studentName)}$`, $options: "i" }
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function approveBorrowRequest(req, res) {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found" });
      return;
    }

    const selectedBook = await Book.findOne({
      name: { $regex: `^${escapeRegex(request.book)}$`, $options: "i" }
    });

    if (!selectedBook) {
      res.status(404).json({ success: false, message: "Book no longer found in library stock" });
      return;
    }

    if (selectedBook.status === "Issued") {
      res.status(409).json({ success: false, message: "Book is already issued to someone else" });
      return;
    }

    // Set book status to Issued
    selectedBook.status = "Issued";
    await selectedBook.save();

    // Create Issue
    await Issue.create({
      student: request.student,
      book: selectedBook.name,
      bookId: selectedBook._id,
      date: request.requestDate,
      returnDate: request.returnDate
    });

    // Update request status to Approved
    request.status = "Approved";
    await request.save();

    res.json({ success: true, message: "Request approved and book issued successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function rejectBorrowRequest(req, res) {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found" });
      return;
    }

    request.status = "Rejected";
    await request.save();

    res.json({ success: true, message: "Request rejected successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function requestExtension(req, res) {
  try {
    const { id } = req.params; // Issue ID
    const { requestedReturnDate } = req.body;

    if (!requestedReturnDate) {
      res.status(400).json({ success: false, message: "Please select an extension date" });
      return;
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      res.status(404).json({ success: false, message: "Active issue record not found" });
      return;
    }

    // Check if there's already a pending request for this issue
    const existing = await ExtensionRequest.findOne({
      issueId: issue._id,
      status: "Pending"
    });

    if (existing) {
      res.status(409).json({ success: false, message: "An extension request is already pending for this book" });
      return;
    }

    const request = await ExtensionRequest.create({
      issueId: issue._id,
      student: issue.student,
      book: issue.book,
      currentReturnDate: issue.returnDate,
      requestedReturnDate: requestedReturnDate,
      status: "Pending"
    });

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getExtensionRequests(req, res) {
  try {
    const requests = await ExtensionRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getStudentExtensionRequests(req, res) {
  try {
    const studentName = String(req.query.name || "").trim();
    if (!studentName) {
      res.status(400).json({ success: false, message: "Student name required" });
      return;
    }

    const requests = await ExtensionRequest.find({
      student: { $regex: `^${escapeRegex(studentName)}$`, $options: "i" }
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function approveExtensionRequest(req, res) {
  try {
    const request = await ExtensionRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ success: false, message: "Extension request not found" });
      return;
    }

    const issue = await Issue.findById(request.issueId);
    if (!issue) {
      // The book might have been returned already
      request.status = "Rejected";
      await request.save();
      res.status(404).json({ success: false, message: "Issued book record not found. It might have been returned already." });
      return;
    }

    // Update Issue return date
    issue.returnDate = request.requestedReturnDate;
    await issue.save();

    // Set request status to Approved
    request.status = "Approved";
    await request.save();

    res.json({ success: true, message: "Return date extension approved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function rejectExtensionRequest(req, res) {
  try {
    const request = await ExtensionRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ success: false, message: "Extension request not found" });
      return;
    }

    request.status = "Rejected";
    await request.save();

    res.json({ success: true, message: "Extension request rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  calculateFine,
  formatIssue,
  getIssues,
  createIssue,
  returnBook,
  requestBorrow,
  getBorrowRequests,
  getStudentBorrowRequests,
  approveBorrowRequest,
  rejectBorrowRequest,
  requestExtension,
  getExtensionRequests,
  getStudentExtensionRequests,
  approveExtensionRequest,
  rejectExtensionRequest
};
