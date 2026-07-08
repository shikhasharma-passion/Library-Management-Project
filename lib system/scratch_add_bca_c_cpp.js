const fs = require('fs');
const path = require('path');

const booksJsonPath = path.join(__dirname, 'books.json');

const newBcaBooks = [
  // C++ Books
  {
    "name": "Let Us C++",
    "author": "Yashavant Kanetkar",
    "publisher": "BPB Publications",
    "edition": "3rd Edition",
    "isbn": "978-93-8984-568-6",
    "subjectCode": "BCA-201",
    "category": "BCA",
    "semester": "Semester 2",
    "accessionNo": "ACC-12001",
    "rackNo": "Rack B-03",
    "shelfNo": "Shelf 2",
    "quantity": 15,
    "availableCopies": 15,
    "issuedCopies": 0,
    "language": "English",
    "status": "Available",
    "image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400"
  },
  {
    "name": "C++: The Complete Reference",
    "author": "Herbert Schildt",
    "publisher": "McGraw Hill",
    "edition": "4th Edition",
    "isbn": "978-00-7049-546-2",
    "subjectCode": "BCA-202",
    "category": "BCA",
    "semester": "Semester 2",
    "accessionNo": "ACC-12002",
    "rackNo": "Rack B-03",
    "shelfNo": "Shelf 2",
    "quantity": 10,
    "availableCopies": 10,
    "issuedCopies": 0,
    "language": "English",
    "status": "Available",
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400"
  },
  {
    "name": "Programming with C++ (Schaum's Outline Series)",
    "author": "John R. Hubbard",
    "publisher": "McGraw Hill",
    "edition": "2nd Edition",
    "isbn": "978-00-7135-346-5",
    "subjectCode": "BCA-203",
    "category": "BCA",
    "semester": "Semester 2",
    "accessionNo": "ACC-12003",
    "rackNo": "Rack B-03",
    "shelfNo": "Shelf 3",
    "quantity": 8,
    "availableCopies": 8,
    "issuedCopies": 0,
    "language": "English",
    "status": "Available",
    "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400"
  },

  // C Books
  {
    "name": "Let Us C",
    "author": "Yashavant Kanetkar",
    "publisher": "BPB Publications",
    "edition": "19th Edition",
    "isbn": "978-93-5551-248-2",
    "subjectCode": "BCA-101",
    "category": "BCA",
    "semester": "Semester 1",
    "accessionNo": "ACC-11001",
    "rackNo": "Rack B-01",
    "shelfNo": "Shelf 1",
    "quantity": 25,
    "availableCopies": 25,
    "issuedCopies": 0,
    "language": "English",
    "status": "Available",
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400"
  },
  {
    "name": "The C Programming Language",
    "author": "Brian W. Kernighan & Dennis M. Ritchie",
    "publisher": "Prentice Hall",
    "edition": "2nd Edition",
    "isbn": "978-01-3110-362-7",
    "subjectCode": "BCA-102",
    "category": "BCA",
    "semester": "Semester 1",
    "accessionNo": "ACC-11002",
    "rackNo": "Rack B-01",
    "shelfNo": "Shelf 1",
    "quantity": 12,
    "availableCopies": 12,
    "issuedCopies": 0,
    "language": "English",
    "status": "Available",
    "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400"
  },
  {
    "name": "C: The Complete Reference",
    "author": "Herbert Schildt",
    "publisher": "McGraw Hill",
    "edition": "4th Edition",
    "isbn": "978-00-7049-524-0",
    "subjectCode": "BCA-103",
    "category": "BCA",
    "semester": "Semester 1",
    "accessionNo": "ACC-11003",
    "rackNo": "Rack B-01",
    "shelfNo": "Shelf 2",
    "quantity": 10,
    "availableCopies": 10,
    "issuedCopies": 0,
    "language": "English",
    "status": "Available",
    "image": "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=400"
  }
];

try {
  let books = [];
  if (fs.existsSync(booksJsonPath)) {
    books = JSON.parse(fs.readFileSync(booksJsonPath, 'utf8'));
  }
  
  const existingNames = new Set(books.map(b => b.name));
  const toAdd = newBcaBooks.filter(b => !existingNames.has(b.name));
  
  if (toAdd.length > 0) {
    const updated = [...toAdd, ...books];
    fs.writeFileSync(booksJsonPath, JSON.stringify(updated, null, 2), 'utf8');
    console.log(`Successfully added ${toAdd.length} new C and C++ textbooks to BCA category in books.json!`);
  } else {
    console.log("All C/C++ textbooks already exist in books.json.");
  }
} catch (error) {
  console.error("Failed to append C/C++ books:", error);
}
