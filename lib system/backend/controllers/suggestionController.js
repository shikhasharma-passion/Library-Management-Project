const Suggestion = require("../models/Suggestion");

async function createSuggestion(req, res) {
  try {
    const { student, bookTitle, bookAuthor, category, status, adminNotes } = req.body;

    if (!student || !bookTitle || !bookAuthor || !category) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const suggestion = await Suggestion.create({
      student: student.trim(),
      bookTitle: bookTitle.trim(),
      bookAuthor: bookAuthor.trim(),
      category: category.trim(),
      status: status ? status.trim() : "Pending",
      adminNotes: adminNotes ? adminNotes.trim() : ""
    });

    res.status(201).json({ success: true, suggestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getSuggestions(req, res) {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getStudentSuggestions(req, res) {
  try {
    const studentName = String(req.query.student || "").trim();
    if (!studentName) {
      res.status(400).json({ success: false, message: "Student name/roll required" });
      return;
    }

    const suggestions = await Suggestion.find({
      student: { $regex: `^${studentName}$`, $options: "i" }
    }).sort({ createdAt: -1 });

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateSuggestionStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) {
      res.status(400).json({ success: false, message: "Status is required" });
      return;
    }

    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
      res.status(404).json({ success: false, message: "Suggestion not found" });
      return;
    }

    suggestion.status = status;
    if (adminNotes !== undefined) {
      suggestion.adminNotes = adminNotes.trim();
    }
    await suggestion.save();

    res.json({ success: true, message: "Suggestion updated successfully", suggestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createSuggestion,
  getSuggestions,
  getStudentSuggestions,
  updateSuggestionStatus
};
