const fs = require('fs');
const path = require('path');

const booksJsonPath = path.join(__dirname, 'books.json');
if (fs.existsSync(booksJsonPath)) {
    const books = JSON.parse(fs.readFileSync(booksJsonPath, 'utf8'));
    const cBooks = books.filter(b => b.category === 'BCA' && (b.name.toLowerCase().includes('c programming') || b.name.toLowerCase().includes('programming in c') || b.name.toLowerCase().includes(' c ')));
    const cppBooks = books.filter(b => b.category === 'BCA' && (b.name.toLowerCase().includes('c++') || b.name.toLowerCase().includes('cpp')));
    
    console.log("--- C Books in BCA ---");
    cBooks.forEach(b => console.log(`- ${b.name} (${b.author})`));
    
    console.log("\n--- C++ Books in BCA ---");
    cppBooks.forEach(b => console.log(`- ${b.name} (${b.author})`));
} else {
    console.log("books.json not found");
}
