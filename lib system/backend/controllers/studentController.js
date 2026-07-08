const Student = require("../models/Student");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getStudents(req, res) {
  try {
    const query = String(req.query.q || "").trim();
    const safeQuery = escapeRegex(query);
    const filter = query
      ? {
          $or: [
            { name: { $regex: safeQuery, $options: "i" } },
            { course: { $regex: safeQuery, $options: "i" } },
            { roll: { $regex: safeQuery, $options: "i" } },
            { studentId: { $regex: safeQuery, $options: "i" } },
            { semester: { $regex: safeQuery, $options: "i" } }
          ]
        }
      : {};
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createStudent(req, res) {
  try {
    const { name, course, roll, studentId, semester, email, phone, session } = req.body;

    if (!name || !course || !roll || !studentId || !semester) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const student = await Student.create({
      name: name.trim(),
      course: course.trim(),
      roll: roll.trim(),
      studentId: studentId.trim(),
      semester: semester.trim(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      session: (session || "").trim()
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteStudent(req, res) {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    await student.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getStudents,
  createStudent,
  deleteStudent
};
