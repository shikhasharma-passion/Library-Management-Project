const express = require("express");
const { 
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

// Return Extensions
router.post("/:id/extension", requestExtension);
router.get("/extensions/list", getExtensionRequests);
router.get("/extensions/student", getStudentExtensionRequests);
router.put("/extensions/:id/approve", approveExtensionRequest);
router.put("/extensions/:id/reject", rejectExtensionRequest);

module.exports = router;


