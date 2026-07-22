/* ===========================================================
   db.js — Mock Database using localStorage
   All "API calls" in this static demo read/write here.
   =========================================================== */

const DB_KEY = "sms_db_v1";

function seedData() {
  return {
    classes: [
      { id: "c1", name: "Class 1", sections: ["A", "B"] },
      { id: "c2", name: "Class 2", sections: ["A", "B"] },
      { id: "c3", name: "Class 3", sections: ["A"] },
      { id: "c4", name: "Class 4", sections: ["A", "B"] },
      { id: "c5", name: "Class 5", sections: ["A"] },
    ],
    subjects: ["English", "Mathematics", "Science", "Social Studies", "Computer"],

    teachers: [
      { id: "t1", active: true, name: "Mrs. Anita Sharma", email: "anita.sharma@school.com", phone: "9876500011", subject: "Mathematics", classes: ["c1A", "c2A"], joinDate: "2021-06-01", password: "teacher123" },
      { id: "t2", active: true, name: "Mr. Rajesh Verma", email: "rajesh.verma@school.com", phone: "9876500012", subject: "Science", classes: ["c3A", "c4A"], joinDate: "2020-03-15", password: "teacher123" },
      { id: "t3", active: true, name: "Ms. Priya Nair", email: "priya.nair@school.com", phone: "9876500013", subject: "English", classes: ["c1A", "c1B"], joinDate: "2022-01-10", password: "teacher123" },
      { id: "t4", active: true, name: "Mr. Sanjay Gupta", email: "sanjay.gupta@school.com", phone: "9876500014", subject: "Social Studies", classes: ["c5A"], joinDate: "2019-08-20", password: "teacher123" },
    ],

    students: [
      { id: "s1", active: true, name: "Aarav Singh", roll: "101", classId: "c1", section: "A", dob: "2017-03-12", gender: "Male", parentName: "Vikram Singh", parentPhone: "9876512345", parentEmail: "aarav.parent@mail.com", address: "12 MG Road, Pune", admissionDate: "2023-04-01", password: "student123" },
      { id: "s2", active: true, name: "Diya Patel", roll: "102", classId: "c1", section: "A", dob: "2017-06-22", gender: "Female", parentName: "Ramesh Patel", parentPhone: "9876512346", parentEmail: "diya.parent@mail.com", address: "45 Park Street, Pune", admissionDate: "2023-04-01", password: "student123" },
      { id: "s3", active: true, name: "Kabir Khan", roll: "103", classId: "c1", section: "B", dob: "2017-01-05", gender: "Male", parentName: "Imran Khan", parentPhone: "9876512347", parentEmail: "kabir.parent@mail.com", address: "8 Lake View, Pune", admissionDate: "2023-04-02", password: "student123" },
      { id: "s4", active: true, name: "Ananya Reddy", roll: "201", classId: "c2", section: "A", dob: "2016-09-15", gender: "Female", parentName: "Suresh Reddy", parentPhone: "9876512348", parentEmail: "ananya.parent@mail.com", address: "21 Hill Road, Pune", admissionDate: "2022-04-01", password: "student123" },
      { id: "s5", active: true, name: "Vihaan Joshi", roll: "202", classId: "c2", section: "A", dob: "2016-11-30", gender: "Male", parentName: "Deepak Joshi", parentPhone: "9876512349", parentEmail: "vihaan.parent@mail.com", address: "3 Civil Lines, Pune", admissionDate: "2022-04-01", password: "student123" },
      { id: "s6", active: true, name: "Ishaan Malhotra", roll: "301", classId: "c3", section: "A", dob: "2015-05-18", gender: "Male", parentName: "Arjun Malhotra", parentPhone: "9876512350", parentEmail: "ishaan.parent@mail.com", address: "67 Green Park, Pune", admissionDate: "2021-04-01", password: "student123" },
      { id: "s7", active: true, name: "Saanvi Iyer", roll: "302", classId: "c3", section: "A", dob: "2015-08-09", gender: "Female", parentName: "Karthik Iyer", parentPhone: "9876512351", parentEmail: "saanvi.parent@mail.com", address: "19 Lotus Lane, Pune", admissionDate: "2021-04-01", password: "student123" },
      { id: "s8", active: true, name: "Arjun Mehta", roll: "401", classId: "c4", section: "A", dob: "2014-02-25", gender: "Male", parentName: "Manoj Mehta", parentPhone: "9876512352", parentEmail: "arjun.parent@mail.com", address: "55 Sunrise Ave, Pune", admissionDate: "2020-04-01", password: "student123" },
      { id: "s9", active: true, name: "Myra Kapoor", roll: "402", classId: "c4", section: "B", dob: "2014-07-14", gender: "Female", parentName: "Rohit Kapoor", parentPhone: "9876512353", parentEmail: "myra.parent@mail.com", address: "9 Maple Street, Pune", admissionDate: "2020-04-01", password: "student123" },
      { id: "s10", active: true, name: "Aditya Kumar", roll: "501", classId: "c5", section: "A", dob: "2013-12-01", gender: "Male", parentName: "Anil Kumar", parentPhone: "9876512354", parentEmail: "aditya.parent@mail.com", address: "31 Station Road, Pune", admissionDate: "2019-04-01", password: "student123" },
    ],

    attendance: {
      // key: classId+section+date -> { studentId: 'present'/'absent'/'late' }
      "c1A_2026-06-15": { s1: "present", s2: "present", s3: "absent" },
      "c1A_2026-06-16": { s1: "present", s2: "late", s3: "present" },
      "c2A_2026-06-15": { s4: "present", s5: "absent" },
      "c2A_2026-06-16": { s4: "present", s5: "present" },
      "c4A_2026-06-15": { s8: "present" },
      "c5A_2026-06-15": { s10: "present" },
    },

    exams: [
      { id: "e1", name: "Mid-Term Exam", term: "Term 1", date: "2026-06-20" },
      { id: "e2", name: "Final Exam", term: "Term 1", date: "2026-09-15" },
    ],

    marks: [
      { id: "m1", examId: "e1", studentId: "s1", subject: "English", maxMarks: 100, marksObtained: 85 },
      { id: "m2", examId: "e1", studentId: "s1", subject: "Mathematics", maxMarks: 100, marksObtained: 78 },
      { id: "m3", examId: "e1", studentId: "s1", subject: "Science", maxMarks: 100, marksObtained: 92 },
      { id: "m4", examId: "e1", studentId: "s2", subject: "English", maxMarks: 100, marksObtained: 88 },
      { id: "m5", examId: "e1", studentId: "s2", subject: "Mathematics", maxMarks: 100, marksObtained: 95 },
      { id: "m6", examId: "e1", studentId: "s2", subject: "Science", maxMarks: 100, marksObtained: 81 },
      { id: "m7", examId: "e1", studentId: "s4", subject: "English", maxMarks: 100, marksObtained: 73 },
      { id: "m8", examId: "e1", studentId: "s4", subject: "Mathematics", maxMarks: 100, marksObtained: 68 },
      { id: "m9", examId: "e1", studentId: "s8", subject: "English", maxMarks: 100, marksObtained: 90 },
      { id: "m10", examId: "e1", studentId: "s8", subject: "Science", maxMarks: 100, marksObtained: 87 },
      { id: "m11", examId: "e1", studentId: "s10", subject: "Social Studies", maxMarks: 100, marksObtained: 79 },
    ],

    fees: [
      { id: "f1", studentId: "s1", term: "Term 1", amount: 15000, paid: 15000, status: "Paid", dueDate: "2026-04-30", paidDate: "2026-04-15" },
      { id: "f2", studentId: "s2", term: "Term 1", amount: 15000, paid: 7000, status: "Partial", dueDate: "2026-04-30", paidDate: "2026-04-20" },
      { id: "f3", studentId: "s3", term: "Term 1", amount: 15000, paid: 0, status: "Unpaid", dueDate: "2026-04-30", paidDate: null },
      { id: "f4", studentId: "s4", term: "Term 1", amount: 16000, paid: 16000, status: "Paid", dueDate: "2026-04-30", paidDate: "2026-04-10" },
      { id: "f5", studentId: "s5", term: "Term 1", amount: 16000, paid: 0, status: "Unpaid", dueDate: "2026-04-30", paidDate: null },
      { id: "f6", studentId: "s8", term: "Term 1", amount: 17000, paid: 17000, status: "Paid", dueDate: "2026-04-30", paidDate: "2026-04-05" },
      { id: "f7", studentId: "s10", term: "Term 1", amount: 18000, paid: 9000, status: "Partial", dueDate: "2026-04-30", paidDate: "2026-04-25" },
    ],

    /* Payment ledger — every individual payment transaction against a fee
       record is logged here so a full history + receipt can be produced.
       (Populated automatically for the seed fee records the first time
       the app runs — see migrateDB() below.) */
    payments: [],

    /* Running counter used to generate sequential, human-friendly
       receipt numbers like RCPT-00001 */
    _receiptSeq: 0,
    _paymentsMigrated: false,

    notices: [
      { id: "n1", title: "Summer Vacation Notice", body: "School will remain closed from July 1st to July 15th for summer vacation. Classes resume on July 16th.", audience: "All", date: "2026-06-10", postedBy: "Admin" },
      { id: "n2", title: "Mid-Term Exam Schedule Released", body: "Mid-term examination schedule has been published. Please check the exams section for subject-wise dates.", audience: "Students", date: "2026-06-08", postedBy: "Admin" },
      { id: "n3", title: "Parent-Teacher Meeting", body: "A parent-teacher meeting is scheduled for June 25th, 2026 from 10 AM to 1 PM in respective classrooms.", audience: "Parents", date: "2026-06-05", postedBy: "Admin" },
      { id: "n4", title: "Staff Meeting Reminder", body: "All teaching staff are requested to attend the monthly staff meeting on June 19th at 3 PM in the conference hall.", audience: "Teachers", date: "2026-06-12", postedBy: "Admin" },
    ],

    doubts: [
      { id: "d1", studentId: "s1", subject: "Mathematics", title: "How to solve quadratic equations?", description: "I'm having trouble understanding the quadratic formula. Can you explain with examples?", status: "answered", askedDate: "2026-06-12", teacherId: "t1", reply: "The quadratic formula is used to solve ax² + bx + c = 0. It is x = (-b ± √(b²-4ac)) / 2a. Let me know if you need further help.", repliedDate: "2026-06-13" },
      { id: "d2", studentId: "s2", subject: "Science", title: "What is photosynthesis?", description: "Can you explain the process of photosynthesis in plants?", status: "answered", askedDate: "2026-06-11", teacherId: "t2", reply: "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into oxygen and glucose. Light reactions occur in thylakoids and dark reactions in stroma.", repliedDate: "2026-06-12" },
      { id: "d3", studentId: "s1", subject: "English", title: "Doubt in grammar", description: "What is the difference between Present Continuous and Present Perfect tense?", status: "pending", askedDate: "2026-06-14", teacherId: null, reply: null, repliedDate: null },
      { id: "d4", studentId: "s4", subject: "Mathematics", title: "Trigonometry basics", description: "How do I calculate sine, cosine, and tangent values?", status: "answered", askedDate: "2026-06-10", teacherId: "t1", reply: "In a right triangle: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent. Practice with different angles!", repliedDate: "2026-06-11" },
    ],

    notes: [
      { id: "nt1", classId: "c1", subject: "Mathematics", title: "Algebra Fundamentals", content: "# Algebra Basics\n\n## Variables and Constants\n- Variables are symbols (like x, y) that represent unknown values\n- Constants are fixed numbers\n\n## Linear Equations\n- Standard form: ax + b = c\n- Solution methods: Isolation, Substitution", uploadedDate: "2026-06-01", uploadedBy: "t1", filePath: "/notes/algebra-basics.pdf" },
      { id: "nt2", classId: "c1", subject: "Science", title: "The Water Cycle", content: "# Water Cycle\n\n## Stages:\n1. **Evaporation** - Water from oceans, rivers, lakes turns to vapor\n2. **Condensation** - Water vapor forms clouds\n3. **Precipitation** - Rain, snow, hail falls\n4. **Collection** - Water collects in water bodies\n\nThis continuous cycle is essential for life on Earth.", uploadedDate: "2026-06-05", uploadedBy: "t2", filePath: "/notes/water-cycle.pdf" },
      { id: "nt3", classId: "c1", subject: "English", title: "Parts of Speech", content: "# Parts of Speech\n\n## Noun\n- Person, place, thing, or idea\n- Examples: John, London, book, happiness\n\n## Verb\n- Action or state of being\n- Examples: run, jump, is, are\n\n## Adjective\n- Describes a noun\n- Examples: beautiful, tall, blue", uploadedDate: "2026-06-03", uploadedBy: "t3", filePath: "/notes/parts-of-speech.pdf" },
      { id: "nt4", classId: "c2", subject: "Mathematics", title: "Geometry - Shapes and Angles", content: "# Geometry Concepts\n\n## Triangles\n- Sum of angles = 180°\n- Types: Acute, Right, Obtuse\n\n## Quadrilaterals\n- Sum of angles = 360°\n- Types: Square, Rectangle, Parallelogram, Trapezoid", uploadedDate: "2026-06-08", uploadedBy: "t1", filePath: "/notes/geometry-shapes.pdf" },
    ],

    admin: { name: "Admin User", email: "admin@school.com", password: "admin123" },
  };
}

function initDB() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify(seedData()));
  }
}

/* ---------- One-time / self-healing migrations ----------
   Keeps older localStorage data (saved before the Fee Management
   upgrade) working: makes sure a `payments` ledger exists and backfills
   a payment entry for any fee record that already shows money paid,
   so payment history / receipts are available for old records too. */
function migrateDB(db) {
  let changed = false;

  if (!Array.isArray(db.payments)) {
    db.payments = [];
    changed = true;
  }
  if (typeof db._receiptSeq !== "number") {
    db._receiptSeq = 0;
    changed = true;
  }

  if (!db._paymentsMigrated) {
    (db.fees || []).forEach((f) => {
      if (f.paid > 0) {
        db._receiptSeq += 1;
        db.payments.push({
          id: uid("p"),
          feeId: f.id,
          studentId: f.studentId,
          amount: f.paid,
          date: f.paidDate || f.dueDate || new Date().toISOString().slice(0, 10),
          method: "Cash",
          note: "Opening balance (migrated)",
          receiptNo: "RCPT-" + String(db._receiptSeq).padStart(5, "0"),
        });
      }
    });
    db._paymentsMigrated = true;
    changed = true;
  }

  return changed;
}

function getDB() {
  initDB();
  const db = JSON.parse(localStorage.getItem(DB_KEY));
  if (migrateDB(db)) saveDB(db);
  return db;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function resetDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(seedData()));
}

/* ---------- Helpers ---------- */
function uid(prefix) {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

function getClassName(db, classId) {
  const c = db.classes.find((x) => x.id === classId);
  return c ? c.name : classId;
}

function getStudentById(db, id) {
  return db.students.find((s) => s.id === id);
}

function getTeacherById(db, id) {
  return db.teachers.find((t) => t.id === id);
}

function calcAge(dob) {
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function gradeFor(percent) {
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "F";
}

/* ---------- Fees & Payments ---------- */

/* Given a fee record's total amount and total paid-so-far, returns the
   standard status label used across the app. */
function computeFeeStatus(amount, paid) {
  if (amount > 0 && paid >= amount) return "Paid";
  if (paid > 0) return "Partial";
  return "Unpaid";
}

/* Amount still owed for a fee record. Never returns less than 0. */
function feeBalance(fee) {
  return Math.max(0, (fee.amount || 0) - (fee.paid || 0));
}

/* All logged payments for one fee record, oldest first. */
function getPaymentsForFee(db, feeId) {
  return db.payments.filter((p) => p.feeId === feeId).sort((a, b) => new Date(a.date) - new Date(b.date));
}

/* All logged payments for one student across every fee record. */
function getPaymentsForStudent(db, studentId) {
  return db.payments.filter((p) => p.studentId === studentId).sort((a, b) => new Date(a.date) - new Date(b.date));
}

/* Generates the next sequential receipt number, e.g. RCPT-00001 */
function nextReceiptNumber(db) {
  db._receiptSeq = (db._receiptSeq || 0) + 1;
  return "RCPT-" + String(db._receiptSeq).padStart(5, "0");
}

/* Records a new payment against a fee record: appends it to the payment
   ledger, tops up fee.paid, and recalculates fee.status / fee.paidDate.
   Returns the payment object that was created (with its receipt number)
   so the caller can immediately generate a receipt for it.
   NOTE: caller is responsible for calling saveDB(db) afterwards. */
function recordPayment(db, feeId, amount, date, method, note) {
  const fee = db.fees.find((f) => f.id === feeId);
  if (!fee) return null;

  amount = Math.max(0, Number(amount) || 0);
  date = date || new Date().toISOString().slice(0, 10);

  const payment = {
    id: uid("p"),
    feeId,
    studentId: fee.studentId,
    amount,
    date,
    method: method || "Cash",
    note: note || "",
    receiptNo: nextReceiptNumber(db),
  };

  db.payments.push(payment);
  fee.paid = (fee.paid || 0) + amount;
  fee.status = computeFeeStatus(fee.amount, fee.paid);
  fee.paidDate = date;

  return payment;
}

/* ---------- Session ---------- */
function setSession(role, userId) {
  sessionStorage.setItem("sms_role", role);
  sessionStorage.setItem("sms_userId", userId);
}
function getSession() {
  return { role: sessionStorage.getItem("sms_role"), userId: sessionStorage.getItem("sms_userId") };
}
function clearSession() {
  sessionStorage.removeItem("sms_role");
  sessionStorage.removeItem("sms_userId");
}
function requireRole(expectedRole) {
  const { role } = getSession();
  if (role !== expectedRole) {
    window.location.href = "../index.html";
  }
}
function logout() {
  clearSession();
  const depth = window.location.pathname.includes("/pages/") ? "../" : "./";
  window.location.href = depth + "index.html";
}
