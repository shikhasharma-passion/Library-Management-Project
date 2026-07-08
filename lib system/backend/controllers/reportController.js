const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const Book = require("../models/Book");
const Issue = require("../models/Issue");
const Fine = require("../models/Fine");

async function exportExcel(req, res) {
  try {
    const { type } = req.query;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Library Report");

    if (type === "inventory") {
      const books = await Book.find().sort({ name: 1 });
      worksheet.columns = [
        { header: "Book Title", key: "name", width: 35 },
        { header: "Author", key: "author", width: 25 },
        { header: "Publisher", key: "publisher", width: 20 },
        { header: "ISBN", key: "isbn", width: 20 },
        { header: "Accession No.", key: "accessionNo", width: 20 },
        { header: "Rack / Shelf", key: "location", width: 15 },
        { header: "Status", key: "status", width: 15 }
      ];

      books.forEach(b => {
        worksheet.addRow({
          name: b.name,
          author: b.author,
          publisher: b.publisher,
          isbn: b.isbn,
          accessionNo: b.accessionNo,
          location: `${b.rackNo} / ${b.shelfNo}`,
          status: b.status
        });
      });
    } else if (type === "issues") {
      const issues = await Issue.find({ status: { $ne: "Returned" } }).sort({ createdAt: -1 });
      worksheet.columns = [
        { header: "Student Name", key: "student", width: 25 },
        { header: "Student ID", key: "studentId", width: 18 },
        { header: "Book Title", key: "book", width: 35 },
        { header: "Accession No.", key: "accessionNo", width: 18 },
        { header: "Issue Date", key: "date", width: 15 },
        { header: "Due Date", key: "returnDate", width: 15 },
        { header: "Status", key: "status", width: 15 }
      ];

      issues.forEach(i => {
        worksheet.addRow({
          student: i.student,
          studentId: i.studentId,
          book: i.book,
          accessionNo: i.accessionNo,
          date: i.date,
          returnDate: i.returnDate,
          status: i.status || "Active"
        });
      });
    } else if (type === "fines") {
      const fines = await Fine.find().sort({ createdAt: -1 });
      worksheet.columns = [
        { header: "Student Name", key: "studentName", width: 25 },
        { header: "Student ID", key: "studentId", width: 18 },
        { header: "Book Title", key: "bookTitle", width: 35 },
        { header: "Fine Amount", key: "amount", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Payment Date", key: "paidDate", width: 18 }
      ];

      fines.forEach(f => {
        worksheet.addRow({
          studentName: f.studentName,
          studentId: f.studentId,
          bookTitle: f.bookTitle,
          amount: f.amount,
          status: f.status,
          paidDate: f.paidDate || "N/A"
        });
      });
    } else {
      // Default empty worksheet
      worksheet.columns = [{ header: "Blank", key: "blank", width: 15 }];
      worksheet.addRow({ blank: "No report type specified" });
    }

    // Apply header styling
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "003366" }
    };

    const filename = `library_report_${type || "summary"}_${new Date().toISOString().split("T")[0]}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function exportPdf(req, res) {
  try {
    const { type } = req.query;
    const doc = new PDFDocument({ margin: 40 });
    const filename = `library_report_${type || "summary"}_${new Date().toISOString().split("T")[0]}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    doc.pipe(res);

    // Title / Header
    doc.fillColor("#003366").fontSize(20).text("ZHI COLLEGE LIBRARY SYSTEM", { align: "center" });
    doc.fontSize(14).fillColor("#5c6f84").text(`Official Reports Manager - ${type ? type.toUpperCase() : "SUMMARY"}`, { align: "center" });
    doc.moveDown(1.5);
    doc.strokeColor("#d1dbe5").lineWidth(1).moveTo(40, doc.y).lineTo(570, doc.y).stroke();
    doc.moveDown(1.5);

    if (type === "inventory") {
      const books = await Book.find().limit(50).sort({ name: 1 }); // limit to 50 for formatting
      doc.fillColor("#002244").fontSize(12).text(`Current Book Stock Inventory (Top 50 copies)`, { underline: true });
      doc.moveDown();

      books.forEach((b, idx) => {
        doc.fontSize(10).fillColor("#002244").text(`${idx + 1}. ${b.name} (${b.author})`);
        doc.fillColor("#5c6f84").text(`   Accession: ${b.accessionNo} | Location: ${b.rackNo} - ${b.shelfNo} | Status: ${b.status}`);
        doc.moveDown(0.5);
      });
    } else if (type === "issues") {
      const issues = await Issue.find({ status: { $ne: "Returned" } }).sort({ createdAt: -1 });
      doc.fillColor("#002244").fontSize(12).text(`Active Borrow Issues Transaction Log`, { underline: true });
      doc.moveDown();

      issues.forEach((i, idx) => {
        doc.fontSize(10).fillColor("#002244").text(`${idx + 1}. ${i.book}`);
        doc.fillColor("#5c6f84").text(`   Student: ${i.student} (${i.studentId}) | Date: ${i.date} | Due: ${i.returnDate} | Status: ${i.status || "Active"}`);
        doc.moveDown(0.5);
      });
    } else if (type === "fines") {
      const fines = await Fine.find().sort({ createdAt: -1 });
      doc.fillColor("#002244").fontSize(12).text(`Outstanding and Cleared Dues Log`, { underline: true });
      doc.moveDown();

      fines.forEach((f, idx) => {
        doc.fontSize(10).fillColor("#002244").text(`${idx + 1}. Student: ${f.studentName} (${f.studentId})`);
        doc.fillColor("#5c6f84").text(`   Fine Amount: ₹${f.amount} | Status: ${f.status} | Book: ${f.bookTitle}`);
        doc.moveDown(0.5);
      });
    } else {
      doc.text("No valid report type selected. Please select inventory, issues, or fines.");
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  exportExcel,
  exportPdf
};
