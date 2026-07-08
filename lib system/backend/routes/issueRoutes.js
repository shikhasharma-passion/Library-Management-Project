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
  rejectExtensionRequest,
  reserveBook,
  getReservations,
  cancelReservation,
  getFines,
  payFine,
  getNotifications,
  readNotification
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

// Reservations
router.post("/reserve", reserveBook);
router.get("/reservations", getReservations);
router.delete("/reservations/:id", cancelReservation);

// Fines
router.get("/fines", getFines);
router.put("/fines/:id/pay", payFine);

// Notifications
router.get("/notifications", getNotifications);
router.put("/notifications/:id/read", readNotification);

module.exports = router;


