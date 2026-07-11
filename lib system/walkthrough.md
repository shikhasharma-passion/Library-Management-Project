# Walkthrough: ZHI Library Rebranding and Dynamic Admin Dashboard Fixes

We have implemented a global ZHI Library rebranding and fully connected the Admin Dashboard to real-time database endpoints, making it mobile friendly.

---

## 1. Global API Port Resolver & Dynamic Interceptor
- **[js/api-resolver.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/api-resolver.js)**: Created a dynamic utility that pings ports `3000`, `3001`, and `3002` asynchronously to find the active backend server and intercepts all global `fetch` requests. This prevents "Server offline/offline simulation" errors when port `3000` is busy.
- Added a `window.API_RESOLVED_PROMISE` that guarantees all initialization scripts wait for the port auto-detector to successfully ping and verify the port before initiating any API fetches. This completely eliminates port race conditions.
- Prepended this resolver to the loading scripts block in:
  - `dashboard.html`
  - `student_dashboard.html`
  - `index.html`
  - `login.html`
  - `register.html`
  - `books.html`
  - `students.html`
  - `issue-book.html`
  - `all_books.html`
  - `digital_library.html`
  - `learning_hub.html`
  - `contact.html`

---

## 2. Dynamic getApiBaseUrl Helper in auth.js
- **[auth.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/auth.js)**: Converted static `API_BASE_URL` capturing into a dynamic `getApiBaseUrl()` helper function. This prevents credentials form submissions from defaulting to Chromium's local `file://` protocol before port detection completes, which previously forced the application into simulated offline localStorage mode and caused user registration accounts to vanish on page reload.

---

## 3. Dynamic Live Campus Library Monitor Control
- **[SystemConfig.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/models/SystemConfig.js)**: Created a persistent database schema configuration model to store live campus stats like footfall, active lab PCs, occupancy percentages, and schedules.
- **[systemController.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/controllers/systemController.js)**: Created endpoints `/api/system/status` (`GET` and `PUT`) to read and update live library statistics.
- **[dashboard.html](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/dashboard.html)**: Integrated a collapsible "Live Campus Library Monitor Control" panel.
- **[dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/dashboard.js)**: Populates and saves live monitor input values dynamically when edited by the admin.
- **[student_dashboard.html](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/student_dashboard.html)**: Configured the Live Footfall and system status cards with binding IDs.
- **[student_dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/student_dashboard.js)**: Dynamically fetches status from `/api/system/status` on load, displaying real-time admin-configured stats instantly to students.

---

## 4. Custom Alert Popup & Rejection Flow Enhancements
- **[dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/dashboard.js)** & **[student_dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/student_dashboard.js)**: 
  - Replaced the bottom "Close Window" button on alert popups with a clean, top-right close cross symbol (`✕`).
  - Removed `"reject"` from the alert success/warning classifier. Now, successful request rejections (a normal admin flow) are styled as successful transactions (green `✔️` styling) instead of red `⚠️` System Warnings.
  - Simplified request rejection confirmation dialog messages to `"Are you sure you want to reject?"` to improve prompt scannability.

---

## 5. Clean Single Login Method & Password Toggle Fix
- **[login.html](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/login.html)**: Removed the Google Social login button and partition divider. There is now only one clean, unified login method using Username/Email credentials.
- **[auth.css](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/css/auth.css)**: Hidden the browser's default password reveal eye icon (`::-ms-reveal` and `::-ms-clear`) which was overlapping with our custom eye toggle button and creating duplicate/double eyes.

---

## 6. Dynamic Search Resets & Results Clearing
- **[all_books.html](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/all_books.html)**: Added a dynamic cross button (`✕`) inside the search box that appears only when search text has been typed.
- **[js/public_books.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/public_books.js)**: Clears input search and resets textbook listings when `✕` is clicked.
- **[digital_library.html](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/digital_library.html)**: Integrated a matching dynamic cross button (`✕`) inside the digital e-resources search box.
- **[js/digital_library.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/digital_library.js)**: Clears digital library input search and resets e-resource cards.
- **[learning_hub.html](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/learning_hub.html)**: Integrated a dynamic cross button (`✕`) inside the Global Learning Hub search box.
- **[js/learning_hub.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/learning_hub.js)**: Clears Global Learning Hub search input and resets active learning resources dynamically.

---

## 7. Student Dashboard Books Deduplication
- **[student_dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/student_dashboard.js)**: Deduplicates physical shelf book results by title name during render (`renderAvailableBooks`). This ensures that students see exactly one card entry for each unique book title (avoiding duplicates from multiple physical copies), while keeping the entire physical catalog records intact in the database.

---

## 8. Real-Time Student Logins & Activity Tracking
- **[User.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/models/User.js)**: Added `lastLoginAt` and `loginMethod` fields to keep track of active sessions.
- **[LoginLog.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/models/LoginLog.js)**: Created a new LoginLog model to track student logins historically.
- **[authController.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/controllers/authController.js)**:
  - Updates `lastLoginAt` and `loginMethod` fields on credentials login, credentials registration, and Google OAuth login, and logs persistent entries into the `LoginLog` collection.
- **[studentController.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/controllers/studentController.js)**: Configured `/api/students/recent-logins` to return history from `LoginLog` sorted by newest first.
- **[dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/dashboard.js)**:
  - Replaced hardcoded student feeds with live calls to `/api/students` and `/api/students/recent-logins` with relative-time calculations.

---

## 9. Dynamic Book Issuing & Catalog Sync
- **[issueController.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/controllers/issueController.js)**: Optimized the book issuing handler (`createIssue`). If the requested book name does not exist in the catalog, or if there is no available copy left, the backend will automatically create a new duplicate copy/record in the `Book` collection with status `"Issued"` and link it to the issue transaction. This ensures that the admin can issue *any* book, immediately cataloging it without throwing any "Book not found" errors.

---

## 10. Professional Library Analytics Charts
- **[mockMongoose.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/utils/mockMongoose.js)**: Added support for `$ne`, `$gt`, `$gte`, and `$lte` operators inside the query parser. This fixes the fallback count bug where `stats.issuedBooks` (Books Currently Borrowed) was showing `0` instead of the actual non-zero value.
- **[dashboardController.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/backend/controllers/dashboardController.js)**: Calculates month-over-month library issue and return trends (`monthlyTrends`) for the last 6 months.
- **[dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/dashboard.js)**: Transformed `libraryChart` from a basic bar chart to a premium **Circulation Trends Line Chart** comparing "Books Issued" vs "Books Returned" side-by-side.

---

## 11. Real-Time Overdue Fines Management
- **[dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/dashboard.js)**:
  - Updated `loadFines()` to fetch real outstanding balances from `/api/issues/fines`.
  - Configured `clearFine()` to perform a `"PUT"` request to `/api/issues/fines/:id/pay`, which dynamically updates fine records to `"Paid"`, records audit transactions, and registers student notifications.

---

## 12. Premium Mobile-Responsive Layout
- **[dashboard.html](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/dashboard.html)**:
  - Added a hamburger menu button (`☰`) in the topbar on mobile layouts.
- **[dashboard.js](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/js/dashboard.js)**:
  - Added click handlers to toggle active states on the navigation sidebar and collapse on clicking outside.
- **[dashboard.css](file:///c:/Users/Dell/OneDrive/Documents/PROJECT%20MATERIALS/Smart%20libraryProject/lib%20system/css/dashboard.css)**:
  - Transformed sidebar into a sliding drawer (`left: -270px` by default) under `991px` wide.
  - Integrated high-performance flex grid, adjusted card padding, table column scroll-overflows, and responsive charts container bounds.
- Removed excessive emojis from navigation menus and section headings to maintain a corporate and professional feel.
