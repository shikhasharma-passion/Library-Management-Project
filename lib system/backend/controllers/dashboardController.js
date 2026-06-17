const Book = require("../models/Book");
const Student = require("../models/Student");
const Issue = require("../models/Issue");
const { formatIssue } = require("./issueController");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getStats(req, res) {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const [totalBooks, totalStudents, totalIssued, overdueCount, issues, categoryStats] = await Promise.all([
      Book.countDocuments(),
      Student.countDocuments(),
      Issue.countDocuments(),
      Issue.countDocuments({ returnDate: { $lt: todayStr } }),
      Issue.find().sort({ createdAt: -1 }).limit(5),
      Book.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ])
    ]);

    const recentIssuedBooks = issues.map(formatIssue);
    const categories = categoryStats.map(c => ({
      category: c._id || "Uncategorized",
      count: c.count
    }));

    res.json({
      totalBooks,
      totalStudents,
      issuedBooks: totalIssued,
      pendingBooks: overdueCount,
      recentIssuedBooks,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getStudentDashboard(req, res) {
  try {
    const studentName = String(req.query.name || "").trim();
    const filter = studentName ? { student: { $regex: `^${escapeRegex(studentName)}$`, $options: "i" } } : {};
    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    const issuedBooks = issues.map(formatIssue);
    const todayStr = new Date().toISOString().split("T")[0];
    const pendingReturns = issuedBooks.filter(issue => issue.returnDate < todayStr).length;

    res.json({
      issuedBooks,
      totalIssued: issuedBooks.length,
      pendingReturns,
      fineAmount: issuedBooks.reduce((sum, issue) => sum + issue.fine, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getStats,
  getStudentDashboard
};

