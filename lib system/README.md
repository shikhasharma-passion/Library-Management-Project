# LibraryMS Full-Stack Project

LibraryMS is a full-stack Library Management System built with:

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose

## Project Structure

```text
lib system/
  backend/
    config/
      db.js
    controllers/
      authController.js
      bookController.js
      catalogController.js
      contactController.js
      dashboardController.js
      issueController.js
      studentController.js
    models/
      Book.js
      CatalogBook.js
      Contact.js
      Issue.js
      Student.js
      User.js
    routes/
      authRoutes.js
      bookRoutes.js
      catalogRoutes.js
      contactRoutes.js
      dashboardRoutes.js
      issueRoutes.js
      studentRoutes.js
    utils/
      catalogData.js
      seedCatalogBooks.js
    node_modules/
    .env
    .env.example
    package.json
    server.js
  css/
  images/
  js/
  index.html
  login.html
  register.html
  dashboard.html
  books.html
  students.html
  issue-book.html
  all_books.html
  contact.html
  package.json
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a free cluster.
3. Create a database user and password.
4. Allow your IP address in Network Access.
5. Copy your connection string.
6. Open `backend/.env` and replace `MONGODB_URI` with your real URI.

Example:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/libraryms?retryWrites=true&w=majority
```

## Install Dependencies

Dependencies are inside the `backend` folder:

```powershell
cd "C:\Users\Dell\OneDrive\Documents\PROJECT MATERIALS\extracted project\lib system\backend"
npm install
```

## Run Project

Run from the `lib system` folder:

```powershell
cd "C:\Users\Dell\OneDrive\Documents\PROJECT MATERIALS\extracted project\lib system"
npm start
```

Open:

```text
http://localhost:3000
```

If port `3000` is already busy, the backend automatically tries `3001`, `3002`, and so on.

## Test Database Connection

After adding your real MongoDB Atlas URI in `backend/.env`, run:

```powershell
cd "C:\Users\Dell\OneDrive\Documents\PROJECT MATERIALS\extracted project\lib system\backend"
npm run test-db
```

If the URI is correct, you will see:

```text
MongoDB Atlas connected successfully.
```

If Atlas says your IP is not whitelisted, run:

```powershell
npm run my-ip
```

Then open MongoDB Atlas:

```text
Network Access > Add IP Address
```

Add the shown public IP. For college/demo submission, you can temporarily use:

```text
0.0.0.0/0
```

If it still fails, switch to a mobile hotspot because some college/office Wi-Fi networks block MongoDB's `27017` port.

## Add Demo Data

To add realistic project demo data into MongoDB Atlas, run:

```powershell
cd "C:\Users\Dell\OneDrive\Documents\PROJECT MATERIALS\extracted project\lib system\backend"
npm run seed
```

The seed script adds books, students, issued records, catalog books, and contact messages. It is safe to run again because it avoids duplicate records.

## Default Admin Login

```text
username: admin
password: admin123
```

## API Routes

```text
POST   /api/login
POST   /api/register
POST   /api/auth/login
POST   /api/auth/register
GET    /api/catalog
GET    /api/books
POST   /api/books
DELETE /api/books/:id
GET    /api/students
POST   /api/students
DELETE /api/students/:id
GET    /api/issues
POST   /api/issues
DELETE /api/issues/:id
GET    /api/stats
GET    /api/student-dashboard
POST   /api/contact
GET    /api/health
```
