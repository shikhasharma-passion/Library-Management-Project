const CatalogBook = require("../models/CatalogBook");
const Book = require("../models/Book");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const User = require("../models/User");
const Issue = require("../models/Issue");
const Fine = require("../models/Fine");
const Reservation = require("../models/Reservation");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const Contact = require("../models/Contact");
const DigitalBook = require("../models/DigitalBook");
const BorrowRequest = require("../models/BorrowRequest");
const ExtensionRequest = require("../models/ExtensionRequest");
const Suggestion = require("../models/Suggestion");
const { ensureAdminUser } = require("../controllers/authController");
const catalogData = require("./catalogData");
const digitalBooksData = require("./digitalBooksData");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const booksDataPath = path.join(__dirname, "..", "..", "books.json");
let booksData = [];
try {
  if (fs.existsSync(booksDataPath)) {
    booksData = JSON.parse(fs.readFileSync(booksDataPath, "utf8"));
  }
} catch (err) {
  console.warn("Failed to load books.json, falling back to empty:", err.message);
}

function getDepartmentForCategory(category) {
  const cat = String(category || "").toLowerCase();
  if (cat.includes("bca") || cat.includes("mca") || cat.includes("computer") || cat.includes("operating") || cat.includes("networking") || cat.includes("dbms") || cat.includes("algorithm") || cat.includes("programming") || cat.includes("ai") || cat.includes("intelligence") || cat.includes("data science") || cat.includes("web") || cat.includes("database")) {
    return "Computer Science";
  }
  if (cat.includes("bba") || cat.includes("mba") || cat.includes("management") || cat.includes("business") || cat.includes("finance") || cat.includes("accounting") || cat.includes("marketing") || cat.includes("human resource") || cat.includes("strategic") || cat.includes("entrepreneurship")) {
    return "Management Studies";
  }
  if (cat.includes("competitive") || cat.includes("exams")) {
    return "Competitive Exams";
  }
  if (cat.includes("biography") || cat.includes("fiction") || cat.includes("self") || cat.includes("habit") || cat.includes("psychology") || cat.includes("english")) {
    return "Science & Humanities";
  }
  return "General Education";
}

async function seedCatalogBooks() {
  await ensureAdminUser();

  const count = await CatalogBook.countDocuments({});
  if (count > 0) {
    console.log("Database already has records. Skipping clean seeder to preserve user data.");
    return;
  }

  console.log("Cleaning database collections...");
  await Promise.all([
    CatalogBook.deleteMany({}),
    Book.deleteMany({}),
    DigitalBook.deleteMany({}),
    Student.deleteMany({}),
    Faculty.deleteMany({}),
    Issue.deleteMany({}),
    Fine.deleteMany({}),
    Reservation.deleteMany({}),
    Transaction.deleteMany({}),
    Notification.deleteMany({}),
    Contact.deleteMany({}),
    BorrowRequest.deleteMany({}),
    ExtensionRequest.deleteMany({}),
    Suggestion.deleteMany({})
  ]);

  const sourceBooks = (booksData && booksData.length > 0) ? booksData : catalogData;
  console.log(`Processing ${sourceBooks.length} titles for catalog and inventory...`);

  // 1. Process & Seed Catalog Books
  const catalogBooksToInsert = sourceBooks.map((b, index) => {
    const dept = getDepartmentForCategory(b.category);
    const year = String(2015 + (index % 10));
    return {
      name: b.name,
      author: b.author,
      publisher: b.publisher || "Tata McGraw Hill",
      edition: b.edition || "1st Edition",
      isbn: b.isbn || `978-81-${100000 + index}-${index % 10}`,
      subjectCode: b.subjectCode || `SUB-${100 + index}`,
      category: b.category,
      semester: b.semester || "All Semesters",
      language: b.language || "English",
      image: b.image || "images/book1 cover.jpg",
      pubYear: year,
      department: dept,
      description: `Standard reference textbook for ${b.name} by ${b.author}. Mapped to college curriculum.`,
      rating: 4.0 + ((index % 11) / 10) * 1.0,
      quantity: b.quantity || 5,
      availableCopies: b.quantity || 5,
      issuedCopies: 0
    };
  });

  await CatalogBook.insertMany(catalogBooksToInsert);
  console.log("Catalog books seeded successfully.");

  // 2. Process & Seed Physical Book Inventory (Copy-by-Copy)
  const physicalBooksToInsert = [];
  catalogBooksToInsert.forEach(b => {
    const copiesCount = b.quantity;
    const baseAccession = b.isbn.replace(/-/g, "").substring(3, 8) || "36001";
    for (let c = 1; c <= copiesCount; c++) {
      physicalBooksToInsert.push({
        name: b.name,
        author: b.author,
        publisher: b.publisher,
        edition: b.edition,
        isbn: b.isbn,
        subjectCode: b.subjectCode,
        category: b.category,
        semester: b.semester,
        accessionNo: `ACC-${baseAccession}-${String(c).padStart(2, "0")}`,
        rackNo: b.rackNo || `Rack ${b.category.substring(0, 2).toUpperCase()}-0${(c % 3) + 1}`,
        shelfNo: b.shelfNo || `Shelf ${(c % 4) + 1}`,
        quantity: 1,
        availableCopies: 1,
        issuedCopies: 0,
        language: b.language,
        status: "Available",
        pubYear: b.pubYear,
        department: b.department,
        description: b.description,
        rating: b.rating
      });
    }
  });

  const seededPhysicalBooks = await Book.insertMany(physicalBooksToInsert);
  console.log(`Seeded ${seededPhysicalBooks.length} physical copies in stock.`);

  // 3. Seed Digital Library
  const digitalBooksToInsert = digitalBooksData.map((d, index) => ({
    ...d,
    pubYear: String(2018 + (index % 7)),
    description: `Professional reference guide for ${d.title}. Available as digital e-book.`
  }));
  await DigitalBook.insertMany(digitalBooksToInsert);
  console.log("Digital library seeded successfully.");

  // 4. Generate 500 Students
  console.log("Generating 500 students...");
  const courses = ["BCA", "BBA", "MCA", "MBA"];
  const firstNames = ["Aarav", "Ananya", "Rohan", "Priya", "Neha", "Rahul", "Simran", "Aditya", "Kritika", "Nikhil", "Shreya", "Mansi", "Vivek", "Pooja", "Manish", "Amit", "Raj", "Siddharth", "Ishita", "Sneha", "Karan", "Riya", "Varun", "Anjali", "Sanjay", "Deepak", "Tanvi", "Ramesh", "Sunita", "Harish"];
  const lastNames = ["Sharma", "Singh", "Kumar", "Verma", "Gupta", "Raj", "Kaur", "Mishra", "Sinha", "Anand", "Jha", "Agarwal", "Pathak", "Roy", "Choudhary", "Patel", "Das", "Sen", "Bose", "Mehta", "Malhotra", "Kapoor", "Joshi", "Trivedi", "Reddy", "Nair"];

  const seededStudents = [];
  for (let i = 1; i <= 500; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const roll = String(1000 + i);
    const stuId = `STU-2026-${roll}`;
    const course = courses[i % courses.length];
    const sem = `Semester ${(i % 6) + 1}`;
    seededStudents.push({
      name: `${fn} ${ln}`,
      course: course,
      roll: roll,
      studentId: stuId,
      semester: sem,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@zhi.edu.in`,
      phone: `98765${String(10000 + i).substring(1)}`,
      session: course.endsWith("CA") ? "2024-27" : "2025-27"
    });
  }
  await Student.insertMany(seededStudents);
  console.log("500 Students populated.");

  // 5. Generate 50 Faculty Members
  console.log("Generating 50 faculty members...");
  const facultyNames = ["Dr. S. K. Singh", "Prof. R. P. Verma", "Dr. Shalini Mehta", "Prof. Anil Jha", "Dr. Vandana Rao", "Dr. Manoj Pathak", "Prof. Swati Sen", "Dr. Rajesh Das", "Prof. Preeti Roy", "Dr. Vikram Seth", "Prof. Alka Gupta", "Dr. Nishant Mishra", "Prof. Sanjay Datta", "Dr. Ritu Bhalla", "Prof. Devendra Pal"];
  const departments = ["Computer Science", "Management Studies", "Science & Humanities", "Business Administration"];
  const designations = ["Professor", "Associate Professor", "Assistant Professor", "Senior Lecturer"];

  const seededFaculty = [];
  for (let i = 1; i <= 50; i++) {
    const name = facultyNames[i % facultyNames.length];
    const dept = departments[i % departments.length];
    const des = designations[i % designations.length];
    const facId = `FAC-2026-${300 + i}`;
    seededFaculty.push({
      name: `${name} (${i})`,
      department: dept,
      facultyId: facId,
      email: `faculty.${i}@zhi.edu.in`,
      phone: `98766${String(10000 + i).substring(1)}`,
      designation: des
    });
  }
  await Faculty.insertMany(seededFaculty);
  console.log("50 Faculty members populated.");

  // 6. Generate and Seed Corresponding User Credentials (for Role-Based Login)
  console.log("Seeding user credentials collection...");
  await User.deleteMany({});
  const defaultHashedPassword = await bcrypt.hash("password123", 10);
  const usersToInsert = [];

  // Seed default Admin credentials
  const adminHashed = await bcrypt.hash("admin123", 10);
  usersToInsert.push({
    name: "Admin User",
    email: "admin@library.com",
    course: "Admin",
    username: "admin",
    password: adminHashed,
    role: "admin",
    phone: "9876543200",
    memberId: "ADM-001"
  });

  // Seed default Librarian credentials
  usersToInsert.push({
    name: "Librarian User",
    email: "librarian@library.com",
    course: "Library Science",
    username: "librarian",
    password: defaultHashedPassword,
    role: "librarian",
    phone: "9876543299",
    memberId: "LIB-001"
  });

  // Seed student credentials
  seededStudents.forEach(stu => {
    usersToInsert.push({
      name: stu.name,
      email: stu.email,
      course: stu.course,
      username: stu.email.split("@")[0],
      password: defaultHashedPassword,
      role: "student",
      phone: stu.phone,
      memberId: stu.studentId
    });
  });

  // Seed faculty credentials
  seededFaculty.forEach(fac => {
    usersToInsert.push({
      name: fac.name,
      email: fac.email,
      course: fac.department,
      username: fac.email.split("@")[0],
      password: defaultHashedPassword,
      role: "faculty",
      phone: fac.phone,
      memberId: fac.facultyId
    });
  });

  await User.insertMany(usersToInsert);
  console.log(`User collection populated with ${usersToInsert.length} accounts.`);

  // 7. Seed Active, Completed, and Overdue Issues with Fines & Notifications
  console.log("Generating transaction history, active borrows, and overdue fines...");
  
  // Select a subset of users to create records
  const sampleStudents = seededStudents.slice(0, 40);
  const sampleFaculty = seededFaculty.slice(0, 10);
  const activeIssues = [];

  // Generate 80 completed historical issues
  for (let i = 0; i < 80; i++) {
    const student = sampleStudents[i % sampleStudents.length];
    const bookIndex = (i * 7) % seededPhysicalBooks.length;
    const book = seededPhysicalBooks[bookIndex];

    const issueDateStr = `2026-05-${String((i % 28) + 1).padStart(2, "0")}`;
    const returnDateStr = `2026-06-${String((i % 28) + 1).padStart(2, "0")}`;

    await Issue.create({
      student: student.name,
      studentId: student.studentId,
      book: book.name,
      bookId: book._id,
      accessionNo: book.accessionNo,
      date: issueDateStr,
      returnDate: returnDateStr,
      status: "Returned",
      issueType: i % 2 === 0 ? "Admin Manual" : "Student Online"
    });

    await Transaction.create({
      userId: student.studentId,
      userName: student.name,
      actionType: "Issue",
      description: `Issued book ${book.name} (Accession: ${book.accessionNo})`,
      accessionNo: book.accessionNo,
      timestamp: new Date(`${issueDateStr}T10:00:00Z`)
    });

    await Transaction.create({
      userId: student.studentId,
      userName: student.name,
      actionType: "Return",
      description: `Returned book ${book.name} (Accession: ${book.accessionNo})`,
      accessionNo: book.accessionNo,
      timestamp: new Date(`${returnDateStr}T14:00:00Z`)
    });
  }

  // Generate 25 Active Pending Issues (these books become "Issued")
  for (let i = 0; i < 25; i++) {
    const student = sampleStudents[(i + 5) % sampleStudents.length];
    // Pick different books
    const bookIndex = (i * 13 + 10) % seededPhysicalBooks.length;
    const book = seededPhysicalBooks[bookIndex];

    if (book.status !== "Available") continue;

    const issueDateStr = "2026-07-01";
    const returnDateStr = "2026-07-15";

    const issue = await Issue.create({
      student: student.name,
      studentId: student.studentId,
      book: book.name,
      bookId: book._id,
      accessionNo: book.accessionNo,
      date: issueDateStr,
      returnDate: returnDateStr,
      status: "Active",
      issueType: "Student Online"
    });

    book.status = "Issued";
    await book.save();

    await Transaction.create({
      userId: student.studentId,
      userName: student.name,
      actionType: "Issue",
      description: `Issued active copy of ${book.name} (Accession: ${book.accessionNo})`,
      accessionNo: book.accessionNo,
      timestamp: new Date()
    });
  }

  // Generate 10 Overdue Issues with Active Fines
  for (let i = 0; i < 10; i++) {
    const student = sampleStudents[(i * 2 + 3) % sampleStudents.length];
    const bookIndex = (i * 27 + 100) % seededPhysicalBooks.length;
    const book = seededPhysicalBooks[bookIndex];

    if (book.status !== "Available") continue;

    const issueDateStr = "2026-06-10";
    const returnDateStr = "2026-06-24"; // Overdue as of today (July 8)

    const issue = await Issue.create({
      student: student.name,
      studentId: student.studentId,
      book: book.name,
      bookId: book._id,
      accessionNo: book.accessionNo,
      date: issueDateStr,
      returnDate: returnDateStr,
      status: "Overdue",
      issueType: "Admin Manual"
    });

    book.status = "Issued";
    await book.save();

    // Fine: 14 days overdue (June 24 to July 8 = 14 days) * ₹10 = ₹140
    await Fine.create({
      studentId: student.studentId,
      studentName: student.name,
      bookTitle: book.name,
      issueId: issue._id.toString(),
      amount: 140,
      status: "Unpaid"
    });

    await Notification.create({
      userId: student.studentId,
      message: `ALERT: Book "${book.name}" is overdue. Please return immediately. Fine accumulated: ₹140.`,
      type: "Due"
    });
  }

  // 8. Generate 5 Active Book Reservations
  for (let i = 0; i < 5; i++) {
    const student = sampleStudents[(i + 12) % sampleStudents.length];
    const book = seededPhysicalBooks[(i * 3) % seededPhysicalBooks.length];
    await Reservation.create({
      studentId: student.studentId,
      studentName: student.name,
      bookTitle: book.name,
      accessionNo: book.accessionNo,
      reserveDate: new Date().toISOString().split("T")[0],
      status: "Pending"
    });

    await Notification.create({
      userId: student.studentId,
      message: `Reservation request for "${book.name}" is placed in the queue.`,
      type: "Reservation"
    });
  }

  // Seed contact messages
  await Contact.insertMany([
    { name: "Aarav Sharma", email: "aarav.sharma@example.com", message: "Please purchase the new 8th edition of Core Java book." },
    { name: "Prof. R. P. Verma", email: "faculty.2@zhi.edu.in", message: "Need additional copies of MBA Strategic Management case studies." },
    { name: "Neha Gupta", email: "neha.gupta@example.com", message: "Can we access IEEE journals from home via the library portal?" }
  ]);

  // Seed mock login logs
  const LoginLog = require("../models/LoginLog");
  await LoginLog.deleteMany({});
  const seededLogins = [];
  const loginTimes = [
    new Date(Date.now() - 5 * 60 * 1000),      // 5 mins ago
    new Date(Date.now() - 18 * 60 * 1000),     // 18 mins ago
    new Date(Date.now() - 45 * 60 * 1000),     // 45 mins ago
    new Date(Date.now() - 2 * 3600 * 1000),    // 2 hours ago
    new Date(Date.now() - 5 * 3600 * 1000),    // 5 hours ago
    new Date(Date.now() - 1 * 24 * 3600 * 1000),// 1 day ago
    new Date(Date.now() - 2 * 24 * 3600 * 1000)// 2 days ago
  ];
  for (let i = 0; i < 7; i++) {
    const student = seededStudents[i % seededStudents.length];
    seededLogins.push({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      loginMethod: i % 2 === 0 ? "Google OAuth" : "ZHI Credentials",
      loginAt: loginTimes[i]
    });
  }
  await LoginLog.insertMany(seededLogins);
  console.log("Login logs seeded.");

  // Seed pending borrow requests
  console.log("Seeding pending student borrow requests...");
  await BorrowRequest.create([
    {
      student: "Aarav Sharma",
      book: "Let Us C++",
      requestDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Pending"
    },
    {
      student: "Neha Gupta",
      book: "Indian Polity for Civil Services and State Examinations",
      requestDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Pending"
    },
    {
      student: "Rohan Verma",
      book: "Database System Concepts",
      requestDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Pending"
    }
  ]);

  // Seed return extension requests
  console.log("Seeding pending return extension requests...");
  const activeIssuesList = await Issue.find({ status: "Active" }).limit(3);
  if (activeIssuesList.length >= 3) {
    await ExtensionRequest.create([
      {
        issueId: activeIssuesList[0]._id,
        student: activeIssuesList[0].student,
        book: activeIssuesList[0].book,
        currentReturnDate: activeIssuesList[0].returnDate,
        requestedReturnDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "Pending"
      },
      {
        issueId: activeIssuesList[1]._id,
        student: activeIssuesList[1].student,
        book: activeIssuesList[1].book,
        currentReturnDate: activeIssuesList[1].returnDate,
        requestedReturnDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "Pending"
      },
      {
        issueId: activeIssuesList[2]._id,
        student: activeIssuesList[2].student,
        book: activeIssuesList[2].book,
        currentReturnDate: activeIssuesList[2].returnDate,
        requestedReturnDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "Pending"
      }
    ]);
  }

  // Seed user suggestions (including Procurement / On the Way)
  console.log("Seeding book suggestions and procurement tracker records...");
  await Suggestion.create([
    {
      student: "Aarav Sharma",
      bookTitle: "Introduction to Artificial Intelligence",
      bookAuthor: "Stuart Russell",
      category: "BCA",
      status: "Pending"
    },
    {
      student: "Ananya Mishra",
      bookTitle: "Operating System Concepts (10th Edition)",
      bookAuthor: "Silberschatz",
      category: "MCA",
      status: "Pending"
    },
    {
      student: "Rohan Verma",
      bookTitle: "Discrete Mathematics and its Applications",
      bookAuthor: "Kenneth H. Rosen",
      category: "BCA",
      status: "Accepted - On the Way",
      adminNotes: "Ordered via Tata McGraw Hill, ETA 3 days."
    },
    {
      student: "Shreya Roy",
      bookTitle: "Design Patterns: Elements of Reusable Object-Oriented Software",
      bookAuthor: "Erich Gamma",
      category: "MCA",
      status: "Accepted - On the Way",
      adminNotes: "Acquirement approved. Direct procurement in transit."
    }
  ]);

  // Synchronize available copies and counts on CatalogBook models
  console.log("Synchronizing CatalogBook copies counts...");
  const catalogList = await CatalogBook.find({});
  for (const catBook of catalogList) {
    const physicalCopies = await Book.find({ name: catBook.name });
    const available = physicalCopies.filter(c => c.status === "Available").length;
    const issued = physicalCopies.filter(c => c.status === "Issued").length;
    catBook.quantity = physicalCopies.length;
    catBook.availableCopies = available;
    catBook.issuedCopies = issued;
    await catBook.save();
  }

  console.log("Database seeded successfully with professional data metrics!");
}

module.exports = seedCatalogBooks;
