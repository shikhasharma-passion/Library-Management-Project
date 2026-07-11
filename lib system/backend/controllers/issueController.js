const Book = require("../models/Book");
const Issue = require("../models/Issue");
const BorrowRequest = require("../models/BorrowRequest");
const ExtensionRequest = require("../models/ExtensionRequest");
const Reservation = require("../models/Reservation");
const Fine = require("../models/Fine");
const Notification = require("../models/Notification");
const Transaction = require("../models/Transaction");

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
  const plainIssue = issue.toObject ? issue.toObject() : issue;
  const id = plainIssue._id;

  delete plainIssue._id;
  delete plainIssue.__v;

  let currentStatus = plainIssue.status || "Active";
  let fine = 0;

  if (currentStatus !== "Returned") {
    fine = calculateFine(plainIssue.returnDate);
    currentStatus = fine > 0 ? "Overdue" : "Active";
  }

  return {
    ...plainIssue,
    id,
    fine,
    status: currentStatus
  };
}

async function getIssues(req, res) {
  try {
    const { status, studentId } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: "Returned" };
    }
    
    if (studentId) {
      filter.studentId = { $regex: `^${escapeRegex(studentId)}$`, $options: "i" };
    }
    
    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues.map(formatIssue));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createIssue(req, res) {
  try {
    const { student, book, date, returnDate, studentId, accessionNo, remarks } = req.body;

    if (!student || !book || !date || !returnDate) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const activeIssuesCount = await Issue.countDocuments({
      student: { $regex: `^${escapeRegex(student.trim())}$`, $options: "i" }
    });

    if (activeIssuesCount >= 3) {
      res.status(400).json({ success: false, message: "You already have issued 3 books. You can issue further after returning old issues." });
      return;
    }

    // Lookup by accession number if supplied, or find an available copy by name
    let selectedBook;
    if (accessionNo) {
      selectedBook = await Book.findOne({
        accessionNo: { $regex: `^${escapeRegex(accessionNo.trim())}$`, $options: "i" }
      });
    }
    
    if (!selectedBook) {
      selectedBook = await Book.findOne({
        name: { $regex: `^${escapeRegex(book.trim())}$`, $options: "i" },
        status: "Available"
      });
    }

    if (!selectedBook) {
      const existingBook = await Book.findOne({
        name: { $regex: `^${escapeRegex(book.trim())}$`, $options: "i" }
      });
      const newAccessionNo = accessionNo ? accessionNo.trim() : `ACC-${Math.floor(10000 + Math.random() * 90000)}`;
      selectedBook = await Book.create({
        name: book.trim(),
        author: existingBook ? existingBook.author : "Unknown Author",
        category: existingBook ? existingBook.category : "BCA",
        subjectCode: existingBook ? existingBook.subjectCode : `SUB-${Math.floor(100 + Math.random() * 900)}`,
        isbn: existingBook ? existingBook.isbn : `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        publisher: existingBook ? existingBook.publisher : "College Publisher",
        edition: existingBook ? existingBook.edition : "1st Edition",
        rackNo: existingBook ? existingBook.rackNo : "Rack GN-03",
        shelfNo: existingBook ? existingBook.shelfNo : "Shelf 1",
        quantity: 1,
        availableCopies: 0,
        issuedCopies: 1,
        status: "Issued",
        accessionNo: newAccessionNo
      });
    }

    if (selectedBook.status === "Issued") {
      // If it is already issued, let's create a new separate physical copy for it!
      const newAccessionNo = `ACC-${Math.floor(10000 + Math.random() * 90000)}`;
      selectedBook = await Book.create({
        name: selectedBook.name,
        author: selectedBook.author,
        category: selectedBook.category,
        subjectCode: selectedBook.subjectCode,
        isbn: selectedBook.isbn,
        publisher: selectedBook.publisher,
        edition: selectedBook.edition,
        rackNo: selectedBook.rackNo,
        shelfNo: selectedBook.shelfNo,
        quantity: 1,
        availableCopies: 0,
        issuedCopies: 1,
        status: "Issued",
        accessionNo: newAccessionNo
      });
    }

    selectedBook.status = "Issued";
    await selectedBook.save();

    const issue = await Issue.create({
      student: student.trim(),
      book: selectedBook.name,
      bookId: selectedBook._id,
      date,
      returnDate,
      studentId: (studentId || "").trim(),
      accessionNo: selectedBook.accessionNo,
      remarks: (remarks || "").trim(),
      issueType: "Admin Manual"
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

    issue.status = "Returned";
    await issue.save();

    // Check if overdue, calculate fine
    const fineAmount = calculateFine(issue.returnDate);
    if (fineAmount > 0) {
      const Fine = require("../models/Fine");
      await Fine.create({
        studentId: issue.studentId || "N/A",
        studentName: issue.student,
        bookTitle: issue.book,
        issueId: issue._id.toString(),
        amount: fineAmount,
        status: "Unpaid"
      });

      const Notification = require("../models/Notification");
      await Notification.create({
        userId: issue.studentId || "N/A",
        message: `Overdue Return: Fine of ₹${fineAmount} has been generated for returning "${issue.book}".`,
        type: "Fine"
      });
    }

    // Save transaction log
    const Transaction = require("../models/Transaction");
    await Transaction.create({
      userId: issue.studentId || "Admin",
      userName: issue.student,
      actionType: "Return",
      description: `Returned book "${issue.book}" (Accession: ${issue.accessionNo})`,
      accessionNo: issue.accessionNo
    });

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

    // Check if the book is catalogued and has at least one Available physical copy
    const selectedBook = await Book.findOne({
      name: { $regex: `^${escapeRegex(book.trim())}$`, $options: "i" },
      status: "Available"
    });

    if (!selectedBook) {
      res.status(404).json({ success: false, message: "This book is currently out of stock (no copies available)" });
      return;
    }

    // Check if the student has reached their limit of 3 books (issues + pending requests)
    const activeIssuesCount = await Issue.countDocuments({
      student: { $regex: `^${escapeRegex(student.trim())}$`, $options: "i" },
      status: { $ne: "Returned" }
    });
    const pendingRequestsCount = await BorrowRequest.countDocuments({
      student: { $regex: `^${escapeRegex(student.trim())}$`, $options: "i" },
      status: "Pending"
    });

    if (activeIssuesCount + pendingRequestsCount >= 3) {
      res.status(400).json({ success: false, message: "You already have issued 3 books. You can issue further after returning old issues." });
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
      name: { $regex: `^${escapeRegex(request.book)}$`, $options: "i" },
      status: "Available"
    });

    if (!selectedBook) {
      res.status(404).json({ success: false, message: "No copies of this book are currently available for checkout" });
      return;
    }

    const activeIssuesCount = await Issue.countDocuments({
      student: { $regex: `^${escapeRegex(request.student)}$`, $options: "i" }
    });

    if (activeIssuesCount >= 3) {
      res.status(400).json({ success: false, message: "This student already has 3 active issues. Cannot approve another borrow request." });
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
      returnDate: request.returnDate,
      accessionNo: selectedBook.accessionNo,
      issueType: "Student Online"
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

async function reserveBook(req, res) {
  try {
    const { studentId, studentName, bookTitle, accessionNo } = req.body;
    if (!studentId || !studentName || !bookTitle) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const reservation = await Reservation.create({
      studentId: studentId.trim(),
      studentName: studentName.trim(),
      bookTitle: bookTitle.trim(),
      accessionNo: (accessionNo || "").trim(),
      reserveDate: new Date().toISOString().split("T")[0],
      status: "Pending"
    });

    await Transaction.create({
      userId: studentId,
      userName: studentName,
      actionType: "Reserve",
      description: `Reserved book "${bookTitle}"`,
      accessionNo: accessionNo || ""
    });

    await Notification.create({
      userId: studentId,
      message: `Reservation placed successfully for book "${bookTitle}".`,
      type: "Reservation"
    });

    res.status(201).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getReservations(req, res) {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { studentId: { $regex: `^${escapeRegex(studentId)}$`, $options: "i" } } : {};
    const list = await Reservation.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function cancelReservation(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      res.status(404).json({ success: false, message: "Reservation not found" });
      return;
    }

    reservation.status = "Cancelled";
    await reservation.save();

    await Transaction.create({
      userId: reservation.studentId,
      userName: reservation.studentName,
      actionType: "Cancel Reservation",
      description: `Cancelled reservation for "${reservation.bookTitle}"`
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getFines(req, res) {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { studentId: { $regex: `^${escapeRegex(studentId)}$`, $options: "i" } } : {};
    const list = await Fine.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function payFine(req, res) {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      res.status(404).json({ success: false, message: "Fine record not found" });
      return;
    }

    fine.status = "Paid";
    fine.paidDate = new Date().toISOString().split("T")[0];
    await fine.save();

    await Transaction.create({
      userId: fine.studentId,
      userName: fine.studentName,
      actionType: "Fine Payment",
      description: `Paid fine of ₹${fine.amount} for "${fine.bookTitle}"`
    });

    await Notification.create({
      userId: fine.studentId,
      message: `Payment Confirmed: Fine of ₹${fine.amount} for "${fine.bookTitle}" has been cleared.`,
      type: "Fine"
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getNotifications(req, res) {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId: { $regex: `^${escapeRegex(userId)}$`, $options: "i" } } : {};
    const list = await Notification.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function readNotification(req, res) {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
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
  rejectExtensionRequest,
  reserveBook,
  getReservations,
  cancelReservation,
  getFines,
  payFine,
  getNotifications,
  readNotification
};
