const express = require("express");
const { 
  getIssues, 
  createIssue, 
  returnBook,
  requestBorrow,
  getBorrowRequests,
  getStudentBorrowRequests,
  approveBorrowRequest,
  rejectBorrowRequest
} = require("../controllers/issueController");

const router = express.Router();

router.get("/", getIssues);
router.post("/", createIssue);
router.delete("/:id", returnBook);

// Borrow Requests
router.post("/requests", requestBorrow);
router.get("/requests", getBorrowRequests);
router.get("/requests/student", getStudentBorrowRequests);
router.put("/requests/:id/approve", approveBorrowRequest);
router.put("/requests/:id/reject", rejectBorrowRequest);

module.exports = router;

