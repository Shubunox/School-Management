/* ===========================================================
   ui.js — shared UI helpers
   =========================================================== */

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $all(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

function openModal(id) { $("#" + id).classList.add("open"); }
function closeModal(id) { $("#" + id).classList.remove("open"); }

function toast(msg, type) {
  let box = $("#toast-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-box";
    box.style.position = "fixed";
    box.style.bottom = "20px";
    box.style.right = "20px";
    box.style.zIndex = "2000";
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.gap = "8px";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.padding = "12px 18px";
  el.style.borderRadius = "8px";
  el.style.color = "#fff";
  el.style.fontSize = "13.5px";
  el.style.fontWeight = "600";
  el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  el.style.background = type === "error" ? "#dc2626" : type === "warn" ? "#d97706" : "#16a34a";
  box.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* Animates numeric text inside elements matching selector from 0 up to their current value.
   Skips values that aren't purely numeric (with optional currency/percent decoration),
   by extracting digits and re-applying the original prefix/suffix. */
function animateCounters(selector, container) {
  const els = $all(selector, container);
  els.forEach((el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)([^\d]*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (isNaN(target)) return;
    const duration = 700;
    const start = performance.now();
    const isInt = !numStr.includes(".");
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const display = isInt ? Math.round(current).toLocaleString("en-IN") : current.toFixed(numStr.split(".")[1].length);
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + (isInt ? target.toLocaleString("en-IN") : target.toFixed(numStr.split(".")[1].length)) + suffix;
    }
    requestAnimationFrame(tick);
  });
}

function confirmAction(msg) {
  return window.confirm(msg);
}

/* Animates all .progress-bar .fill elements from 0 to their target (data-target or inline) width.
   Call this after injecting HTML containing progress bars. */
function animateProgressBars(container) {
  const fills = $all(".progress-bar .fill", container);
  fills.forEach((el) => {
    const target = el.getAttribute("data-target") || el.style.width || "0%";
    el.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.width = target;
      });
    });
  });
}

function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

/* ===========================================================
   Fee Receipts — build a printable / downloadable receipt for one
   payment transaction and open it in a new tab.
   =========================================================== */

/* Builds the full standalone HTML document for a receipt. */
function buildReceiptDoc(school, student, classLabel, fee, payment, balanceAfter) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Receipt ${payment.receiptNo}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#f1f5f9; margin:0; padding:32px; color:#1e293b; }
  .receipt { max-width: 620px; margin: 0 auto; background:#fff; border-radius:10px; box-shadow:0 4px 18px rgba(15,23,42,0.12); overflow:hidden; }
  .r-head { background:#2563eb; color:#fff; padding:24px 28px; display:flex; justify-content:space-between; align-items:center; }
  .r-head h1 { margin:0; font-size:19px; }
  .r-head .sub { font-size:12.5px; opacity:0.85; margin-top:2px; }
  .r-head .no { text-align:right; font-size:12.5px; }
  .r-head .no b { font-size:15px; display:block; }
  .r-body { padding:26px 28px; }
  .r-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px 24px; margin-bottom:20px; }
  .r-item .label { font-size:11px; text-transform:uppercase; letter-spacing:0.4px; color:#64748b; font-weight:600; }
  .r-item .val { font-size:14.5px; font-weight:600; margin-top:2px; }
  table.r-table { width:100%; border-collapse:collapse; margin-bottom:20px; }
  table.r-table th, table.r-table td { text-align:left; padding:10px 12px; font-size:13.5px; border-bottom:1px solid #e2e8f0; }
  table.r-table th { background:#f8fafc; color:#475569; font-size:11.5px; text-transform:uppercase; letter-spacing:0.4px; }
  table.r-table td.num, table.r-table th.num { text-align:right; }
  .r-total-row td { font-weight:700; font-size:15px; border-bottom:none; padding-top:14px; }
  .r-total-row.paid td { color:#027a48; }
  .r-total-row.due td { color:#b42318; }
  .r-note { font-size:12.5px; color:#64748b; margin-top:6px; }
  .r-foot { text-align:center; font-size:12px; color:#94a3b8; padding:16px 28px 24px; border-top:1px dashed #e2e8f0; margin-top:6px; }
  .r-actions { max-width:620px; margin:18px auto 0; display:flex; gap:10px; justify-content:center; }
  .r-actions button { padding:10px 20px; border-radius:8px; font-size:13.5px; font-weight:600; border:1px solid #cbd5e1; background:#fff; cursor:pointer; }
  .r-actions button.primary { background:#2563eb; color:#fff; border-color:#2563eb; }
  @media print {
    body { background:#fff; padding:0; }
    .receipt { box-shadow:none; border-radius:0; }
    .r-actions { display:none; }
  }
</style>
</head>
<body>
  <div class="receipt">
    <div class="r-head">
      <div>
        <h1>${school}</h1>
        <div class="sub">Official Fee Payment Receipt</div>
      </div>
      <div class="no">Receipt No<b>${payment.receiptNo}</b></div>
    </div>
    <div class="r-body">
      <div class="r-grid">
        <div class="r-item"><div class="label">Student Name</div><div class="val">${student.name}</div></div>
        <div class="r-item"><div class="label">Roll No</div><div class="val">${student.roll || "-"}</div></div>
        <div class="r-item"><div class="label">Class</div><div class="val">${classLabel}</div></div>
        <div class="r-item"><div class="label">Term</div><div class="val">${fee.term}</div></div>
        <div class="r-item"><div class="label">Payment Date</div><div class="val">${formatDate(payment.date)}</div></div>
        <div class="r-item"><div class="label">Payment Method</div><div class="val">${payment.method}</div></div>
      </div>

      <table class="r-table">
        <thead><tr><th>Description</th><th class="num">Amount (₹)</th></tr></thead>
        <tbody>
          <tr><td>Total Fee (${fee.term})</td><td class="num">${fee.amount.toLocaleString("en-IN")}</td></tr>
          <tr><td>Total Paid to Date</td><td class="num">${fee.paid.toLocaleString("en-IN")}</td></tr>
          <tr class="r-total-row paid"><td>Amount Paid (This Receipt)</td><td class="num">₹${payment.amount.toLocaleString("en-IN")}</td></tr>
          <tr class="r-total-row due"><td>Balance Remaining</td><td class="num">₹${balanceAfter.toLocaleString("en-IN")}</td></tr>
        </tbody>
      </table>
      ${payment.note ? `<div class="r-note">Note: ${payment.note}</div>` : ""}
    </div>
    <div class="r-foot">This is a computer-generated receipt. Generated on ${formatDate(new Date().toISOString().slice(0,10))}.</div>
  </div>
  <div class="r-actions">
    <button class="primary" onclick="window.print()">🖨 Print / Save as PDF</button>
    <button id="btn-download-txt">⬇ Download as Text</button>
  </div>
  <script>
    document.getElementById('btn-download-txt').addEventListener('click', function () {
      const lines = [
        "${school}",
        "Official Fee Payment Receipt",
        "Receipt No: ${payment.receiptNo}",
        "----------------------------------------",
        "Student: ${student.name}",
        "Roll No: ${student.roll || "-"}",
        "Class: ${classLabel}",
        "Term: ${fee.term}",
        "Payment Date: ${formatDate(payment.date)}",
        "Payment Method: ${payment.method}",
        "----------------------------------------",
        "Total Fee: Rs. ${fee.amount.toLocaleString("en-IN")}",
        "Total Paid to Date: Rs. ${fee.paid.toLocaleString("en-IN")}",
        "Amount Paid (This Receipt): Rs. ${payment.amount.toLocaleString("en-IN")}",
        "Balance Remaining: Rs. ${balanceAfter.toLocaleString("en-IN")}",
        ${payment.note ? `"Note: ${payment.note}",` : ""}
      ].join("\\n");
      const blob = new Blob([lines], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "${payment.receiptNo}.txt";
      a.click();
    });
  </script>
</body>
</html>`;
}

/* Opens a printable/downloadable receipt in a new browser tab for the
   given payment. `school` is a display name; `classLabel` e.g. "Class 3-A". */
function openReceipt(school, student, classLabel, fee, payment) {
  const balanceAfter = feeBalance(fee);
  const html = buildReceiptDoc(school, student, classLabel, fee, payment, balanceAfter);
  const w = window.open("", "_blank");
  if (!w) {
    toast("Please allow pop-ups to view the receipt", "error");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/* Render sidebar based on role + active page */
const NAV = {
  admin: [
    { href: "admin-dashboard.html", label: "Dashboard", icon: "📊" },
    { href: "students.html", label: "Manage Students", icon: "🎓" },
    { href: "teachers.html", label: "Manage Teachers", icon: "👩‍🏫" },
    { href: "classes.html", label: "Classes & Sections", icon: "🏫" },
    { href: "attendance-admin.html", label: "Attendance", icon: "🗓️" },
    { href: "exams-marks.html", label: "Exams & Marks", icon: "📝" },
    { href: "fees.html", label: "Fee Management", icon: "💰" },
    { href: "notices.html", label: "Notices", icon: "📢" },
    { href: "reports.html", label: "Reports", icon: "📈" },
  ],
  teacher: [
    { href: "teacher-dashboard.html", label: "Dashboard", icon: "📊" },
    { href: "my-classes.html", label: "My Classes & Subjects", icon: "🏫" },
    { href: "mark-attendance.html", label: "Mark Attendance", icon: "🗓️" },
    { href: "enter-marks.html", label: "Enter Marks", icon: "📝" },
  ],
  student: [
    { href: "student-dashboard.html", label: "Dashboard", icon: "📊" },
    { href: "profile.html", label: "My Profile", icon: "🙍" },
    { href: "attendance.html", label: "Attendance Summary", icon: "🗓️" },
    { href: "results.html", label: "Results / Report Card", icon: "📝" },
    { href: "fee-status.html", label: "Fee Status", icon: "💰" },
    { href: "student-notices.html", label: "Notices", icon: "📢" },
    { href: "student-doubts.html", label: "Ask Doubts", icon: "❓" },
    { href: "student-notes.html", label: "Study Notes", icon: "📚" },
  ],
};

const BRAND_LABEL = { admin: "Admin Panel", teacher: "Teacher Panel", student: "Student / Parent" };

function renderShell(role, activeHref, pageTitle, userDisplayName) {
  const navItems = NAV[role];
  const navHtml = navItems
    .map(
      (item) =>
        `<a href="${item.href}" class="${item.href === activeHref ? "active" : ""}">
           <span class="icon">${item.icon}</span> ${item.label}
         </a>`
    )
    .join("");

  $("#sidebar-nav").innerHTML = navHtml;
  $("#sidebar-brand").innerHTML = `EduManage <span>SMS</span>`;
  $("#sidebar-rolelabel") && ($("#sidebar-rolelabel").textContent = BRAND_LABEL[role]);
  $("#topbar-title").textContent = pageTitle;
  $("#user-name").textContent = userDisplayName;
  $("#user-avatar").textContent = initials(userDisplayName);
}

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-logout]")) {
    e.preventDefault();
    if (confirmAction("Are you sure you want to logout?")) logout();
  }
  if (e.target.matches("[data-close-modal]")) {
    closeModal(e.target.getAttribute("data-close-modal"));
  }
  if (e.target.classList && e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("open");
  }
});
