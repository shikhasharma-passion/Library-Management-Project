const CatalogBook = require("../models/CatalogBook");
const Book = require("../models/Book");
const Student = require("../models/Student");
const Issue = require("../models/Issue");
const Contact = require("../models/Contact");
const { ensureAdminUser } = require("../controllers/authController");
const catalogData = require("./catalogData");

const books = [
  { name: "Atomic Habits", author: "James Clear", category: "Self Improvement" },
  { name: "The Psychology of Money", author: "Morgan Housel", category: "Finance" },
  { name: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Finance" },
  { name: "Ikigai", author: "Hector Garcia", category: "Self Improvement" },
  { name: "Think and Grow Rich", author: "Napoleon Hill", category: "Self Improvement" },
  { name: "Clean Code", author: "Robert C. Martin", category: "Programming" },
  { name: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming" },
  { name: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "Programming" },
  { name: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Programming" },
  { name: "You Don't Know JS", author: "Kyle Simpson", category: "Programming" },
  { name: "Python Crash Course", author: "Eric Matthes", category: "Programming" },
  { name: "Automate the Boring Stuff with Python", author: "Al Sweigart", category: "Programming" },
  { name: "Head First Java", author: "Kathy Sierra", category: "Programming" },
  { name: "Let Us C", author: "Yashavant Kanetkar", category: "Programming" },
  { name: "Data Structures Through C", author: "Yashavant Kanetkar", category: "BCA" },
  { name: "Computer Fundamentals", author: "P.K. Sinha", category: "BCA" },
  { name: "Fundamentals of Computers", author: "V. Rajaraman", category: "BCA" },
  { name: "Operating System Concepts", author: "Silberschatz, Galvin, Gagne", category: "Operating System" },
  { name: "Modern Operating Systems", author: "Andrew S. Tanenbaum", category: "Operating System" },
  { name: "Database System Concepts", author: "Abraham Silberschatz", category: "DBMS" },
  { name: "Database Management Systems", author: "Raghu Ramakrishnan", category: "DBMS" },
  { name: "Computer Networks", author: "Andrew S. Tanenbaum", category: "Networking" },
  { name: "Data Communications and Networking", author: "Behrouz A. Forouzan", category: "Networking" },
  { name: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", category: "Artificial Intelligence" },
  { name: "Machine Learning", author: "Tom M. Mitchell", category: "Artificial Intelligence" },
  { name: "Hands-On Machine Learning", author: "Aurelien Geron", category: "Data Science" },
  { name: "Data Science from Scratch", author: "Joel Grus", category: "Data Science" },
  { name: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Algorithms" },
  { name: "Design and Analysis of Algorithms", author: "Anany Levitin", category: "Algorithms" },
  { name: "Software Engineering", author: "Ian Sommerville", category: "Software Engineering" },
  { name: "Software Engineering: A Practitioner's Approach", author: "Roger S. Pressman", category: "Software Engineering" },
  { name: "HTML and CSS", author: "Jon Duckett", category: "Web Development" },
  { name: "JavaScript and JQuery", author: "Jon Duckett", category: "Web Development" },
  { name: "Learning React", author: "Alex Banks", category: "Web Development" },
  { name: "Node.js Design Patterns", author: "Mario Casciaro", category: "Web Development" },
  { name: "Express in Action", author: "Evan Hahn", category: "Web Development" },
  { name: "MongoDB: The Definitive Guide", author: "Shannon Bradshaw", category: "Database" },
  { name: "SQL Fundamentals", author: "John J. Patrick", category: "Database" },
  { name: "Principles of Management", author: "Harold Koontz", category: "BBA" },
  { name: "Business Communication", author: "Meenakshi Raman", category: "BBA" },
  { name: "Financial Accounting", author: "T.S. Grewal", category: "BBA" },
  { name: "Marketing Management", author: "Philip Kotler", category: "BBA" },
  { name: "Human Resource Management", author: "Gary Dessler", category: "BBA" },
  { name: "Strategic Management", author: "Michael Porter", category: "MBA" },
  { name: "Business Analytics", author: "James R. Evans", category: "MBA" },
  { name: "Corporate Finance", author: "Ross, Westerfield, Jaffe", category: "MBA" },
  { name: "The Lean Startup", author: "Eric Ries", category: "Entrepreneurship" },
  { name: "Zero to One", author: "Peter Thiel", category: "Entrepreneurship" },
  { name: "Wings of Fire", author: "A.P.J. Abdul Kalam", category: "Biography" },
  { name: "The Diary of a Young Girl", author: "Anne Frank", category: "Biography" },
  { name: "The Alchemist", author: "Paulo Coelho", category: "Fiction" },
  { name: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction" },
  { name: "1984", author: "George Orwell", category: "Fiction" },
  { name: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction" },
  { name: "Pride and Prejudice", author: "Jane Austen", category: "Fiction" },
  { name: "A Brief History of Time", author: "Stephen Hawking", category: "Science" },
  { name: "The Selfish Gene", author: "Richard Dawkins", category: "Science" },
  { name: "Concepts of Physics Vol. 1", author: "H.C. Verma", category: "Science" },
  { name: "Quantitative Aptitude", author: "R.S. Aggarwal", category: "Competitive Exams" },
  { name: "A Modern Approach to Verbal Reasoning", author: "R.S. Aggarwal", category: "Competitive Exams" }
];

const students = [
  { name: "Aarav Sharma", course: "BCA", roll: "BCA-101" },
  { name: "Ananya Singh", course: "BCA", roll: "BCA-102" },
  { name: "Rohan Kumar", course: "BCA", roll: "BCA-103" },
  { name: "Priya Verma", course: "BCA", roll: "BCA-104" },
  { name: "Neha Gupta", course: "BCA", roll: "BCA-105" },
  { name: "Rahul Raj", course: "BCA", roll: "BCA-106" },
  { name: "Simran Kaur", course: "BCA", roll: "BCA-107" },
  { name: "Aditya Mishra", course: "BCA", roll: "BCA-108" },
  { name: "Kritika Sinha", course: "BBA", roll: "BBA-201" },
  { name: "Nikhil Anand", course: "BBA", roll: "BBA-202" },
  { name: "Sakshi Kumari", course: "BBA", roll: "BBA-203" },
  { name: "Vivek Tiwari", course: "BBA", roll: "BBA-204" },
  { name: "Isha Pandey", course: "BBA", roll: "BBA-205" },
  { name: "Aman Raj", course: "BBA", roll: "BBA-206" },
  { name: "Shreya Jha", course: "MCA", roll: "MCA-301" },
  { name: "Kunal Sinha", course: "MCA", roll: "MCA-302" },
  { name: "Ritika Kumari", course: "MCA", roll: "MCA-303" },
  { name: "Harsh Vardhan", course: "MCA", roll: "MCA-304" },
  { name: "Pooja Yadav", course: "MCA", roll: "MCA-305" },
  { name: "Saurabh Kumar", course: "MCA", roll: "MCA-306" },
  { name: "Mansi Agarwal", course: "MBA", roll: "MBA-401" },
  { name: "Rishabh Jain", course: "MBA", roll: "MBA-402" },
  { name: "Tanya Roy", course: "MBA", roll: "MBA-403" },
  { name: "Abhishek Prasad", course: "MBA", roll: "MBA-404" },
  { name: "Sneha Singh", course: "MBA", roll: "MBA-405" },
  { name: "Yash Gupta", course: "MBA", roll: "MBA-406" }
];

const issuePlans = [
  { student: "Aarav Sharma", book: "Atomic Habits", date: "2026-05-01", returnDate: "2026-05-15" },
  { student: "Ananya Singh", book: "Clean Code", date: "2026-05-05", returnDate: "2026-05-25" },
  { student: "Rohan Kumar", book: "Operating System Concepts", date: "2026-04-20", returnDate: "2026-05-10" },
  { student: "Priya Verma", book: "Database System Concepts", date: "2026-05-12", returnDate: "2026-05-28" },
  { student: "Neha Gupta", book: "Python Crash Course", date: "2026-05-03", returnDate: "2026-05-18" },
  { student: "Rahul Raj", book: "Computer Networks", date: "2026-05-15", returnDate: "2026-06-01" },
  { student: "Simran Kaur", book: "The Psychology of Money", date: "2026-05-02", returnDate: "2026-05-16" }
];

const contacts = [
  { name: "Aarav Sharma", email: "aarav.sharma@example.com", message: "Please reserve Clean Code if it becomes available." },
  { name: "Priya Verma", email: "priya.verma@example.com", message: "I need DBMS reference books for semester exam preparation." }
];

function imageForBook(book) {
  const lowerName = book.name.toLowerCase();
  const lowerCategory = book.category.toLowerCase();

  if (lowerName.includes("atomic")) return "images/atomic habit.jpg";
  if (lowerName.includes("psychology")) return "images/psychology of money.jpg";
  if (lowerName.includes("rich dad")) return "images/rich dad poor dad.jpg";
  if (lowerName.includes("python")) return "images/python book cover.jpg";
  if (lowerName.includes("operating")) return "images/os.jpg";
  if (lowerName.includes("database") || lowerCategory.includes("dbms")) return "images/rdbms.png";
  if (lowerCategory.includes("self") || lowerCategory.includes("finance")) return "images/book2.jpg";

  return "images/book1 cover.jpg";
}

async function seedCatalogBooks() {
  await ensureAdminUser();

  const countCatalog = await CatalogBook.countDocuments();
  if (countCatalog === 0) {
    await CatalogBook.insertMany(catalogData);
    console.log("Catalog books seeded");
  }

  const countBooks = await Book.countDocuments();
  if (countBooks === 0) {
    console.log("Seeding books, students, issues, and contacts...");
    const bookMap = new Map();

    for (const item of books) {
      const book = await Book.findOneAndUpdate(
        { name: item.name },
        { $setOnInsert: { status: "Available" }, $set: { author: item.author, category: item.category } },
        { upsert: true, new: true }
      );
      bookMap.set(book.name, book);
    }

    for (const item of students) {
      await Student.findOneAndUpdate(
        { roll: item.roll },
        { $set: item },
        { upsert: true, new: true }
      );
    }

    for (const item of books) {
      await CatalogBook.findOneAndUpdate(
        { name: item.name },
        { $set: { ...item, image: imageForBook(item) } },
        { upsert: true, new: true }
      );
    }

    for (const item of issuePlans) {
      const book = bookMap.get(item.book) || await Book.findOne({ name: item.book });
      if (!book) continue;

      const exists = await Issue.findOne({
        student: item.student,
        book: item.book,
        date: item.date
      });

      if (!exists) {
        await Issue.create({
          student: item.student,
          book: item.book,
          bookId: book._id,
          date: item.date,
          returnDate: item.returnDate
        });
      }

      await Book.findByIdAndUpdate(book._id, { status: "Issued" });
    }

    for (const item of contacts) {
      await Contact.findOneAndUpdate(
        { email: item.email, message: item.message },
        { $setOnInsert: item },
        { upsert: true, new: true }
      );
    }

    console.log("All startup sample data seeded successfully.");
  }
}

module.exports = seedCatalogBooks;
