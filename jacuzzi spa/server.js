const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Init DB
const db = new Database(path.join(__dirname, 'jacuzzi.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    customer_name TEXT,
    service TEXT,
    amount REAL NOT NULL,
    payment_method TEXT DEFAULT 'cash',
    branch TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    amount REAL NOT NULL,
    branch TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    branch TEXT NOT NULL,
    base_salary REAL DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_name TEXT NOT NULL,
    card_number TEXT,
    phone TEXT,
    branch TEXT NOT NULL,
    total_visits INTEGER NOT NULL DEFAULT 1,
    visits_used INTEGER NOT NULL DEFAULT 0,
    amount_paid REAL DEFAULT 0,
    purchase_date TEXT,
    expiry_date TEXT,
    notes TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS membership_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    membership_id INTEGER NOT NULL,
    visit_date TEXT NOT NULL,
    service TEXT,
    branch TEXT NOT NULL,
    staff_name TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(membership_id) REFERENCES memberships(id)
  );

  CREATE TABLE IF NOT EXISTS salary_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    base_amount REAL DEFAULT 0,
    commission REAL DEFAULT 0,
    total REAL DEFAULT 0,
    paid_date TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(staff_id) REFERENCES staff(id)
  );
`);

// ── PAYMENTS ──────────────────────────────────────────────────────────────────

app.get('/api/payments', (req, res) => {
  const { branch, month, year } = req.query;
  let query = 'SELECT * FROM payments WHERE 1=1';
  const params = [];
  if (branch && branch !== 'all') { query += ' AND branch = ?'; params.push(branch); }
  if (month && year) {
    query += " AND strftime('%m', date) = ? AND strftime('%Y', date) = ?";
    params.push(String(month).padStart(2, '0'), String(year));
  } else if (year) {
    query += " AND strftime('%Y', date) = ?";
    params.push(String(year));
  }
  query += ' ORDER BY date DESC, created_at DESC';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/payments', (req, res) => {
  const { date, customer_name, service, amount, payment_method, branch, notes } = req.body;
  const result = db.prepare(
    'INSERT INTO payments (date, customer_name, service, amount, payment_method, branch, notes) VALUES (?,?,?,?,?,?,?)'
  ).run(date, customer_name, service, amount, payment_method || 'cash', branch, notes);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/payments/:id', (req, res) => {
  const { date, customer_name, service, amount, payment_method, branch, notes } = req.body;
  db.prepare(
    'UPDATE payments SET date=?, customer_name=?, service=?, amount=?, payment_method=?, branch=?, notes=? WHERE id=?'
  ).run(date, customer_name, service, amount, payment_method, branch, notes, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/payments/:id', (req, res) => {
  db.prepare('DELETE FROM payments WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── EXPENSES ──────────────────────────────────────────────────────────────────

app.get('/api/expenses', (req, res) => {
  const { branch, month, year, category } = req.query;
  let query = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];
  if (branch && branch !== 'all') { query += ' AND branch = ?'; params.push(branch); }
  if (category && category !== 'all') { query += ' AND category = ?'; params.push(category); }
  if (month && year) {
    query += " AND strftime('%m', date) = ? AND strftime('%Y', date) = ?";
    params.push(String(month).padStart(2, '0'), String(year));
  } else if (year) {
    query += " AND strftime('%Y', date) = ?";
    params.push(String(year));
  }
  query += ' ORDER BY date DESC, created_at DESC';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/expenses', (req, res) => {
  const { date, category, subcategory, description, amount, branch, notes } = req.body;
  const result = db.prepare(
    'INSERT INTO expenses (date, category, subcategory, description, amount, branch, notes) VALUES (?,?,?,?,?,?,?)'
  ).run(date, category, subcategory, description, amount, branch, notes);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/expenses/:id', (req, res) => {
  const { date, category, subcategory, description, amount, branch, notes } = req.body;
  db.prepare(
    'UPDATE expenses SET date=?, category=?, subcategory=?, description=?, amount=?, branch=?, notes=? WHERE id=?'
  ).run(date, category, subcategory, description, amount, branch, notes, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/expenses/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── MEMBERSHIPS ───────────────────────────────────────────────────────────────

app.get('/api/memberships', (req, res) => {
  const { branch, active } = req.query;
  let query = 'SELECT * FROM memberships WHERE 1=1';
  const params = [];
  if (branch && branch !== 'all') { query += ' AND branch = ?'; params.push(branch); }
  if (active !== undefined) { query += ' AND active = ?'; params.push(Number(active)); }
  query += ' ORDER BY created_at DESC';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/memberships', (req, res) => {
  const { member_name, card_number, phone, branch, total_visits, amount_paid, purchase_date, expiry_date, notes } = req.body;
  const result = db.prepare(
    'INSERT INTO memberships (member_name, card_number, phone, branch, total_visits, amount_paid, purchase_date, expiry_date, notes) VALUES (?,?,?,?,?,?,?,?,?)'
  ).run(member_name, card_number, phone, branch, total_visits || 1, amount_paid || 0, purchase_date, expiry_date, notes);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/memberships/:id', (req, res) => {
  const { member_name, card_number, phone, branch, total_visits, amount_paid, purchase_date, expiry_date, notes, active } = req.body;
  db.prepare(
    'UPDATE memberships SET member_name=?, card_number=?, phone=?, branch=?, total_visits=?, amount_paid=?, purchase_date=?, expiry_date=?, notes=?, active=? WHERE id=?'
  ).run(member_name, card_number, phone, branch, total_visits, amount_paid, purchase_date, expiry_date, notes, active ?? 1, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/memberships/:id', (req, res) => {
  db.prepare('UPDATE memberships SET active=0 WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// Membership visits
app.get('/api/membership-visits', (req, res) => {
  const { membership_id, branch, month, year } = req.query;
  let query = `SELECT mv.*, m.member_name, m.card_number FROM membership_visits mv JOIN memberships m ON mv.membership_id = m.id WHERE 1=1`;
  const params = [];
  if (membership_id) { query += ' AND mv.membership_id = ?'; params.push(Number(membership_id)); }
  if (branch && branch !== 'all') { query += ' AND mv.branch = ?'; params.push(branch); }
  if (month && year) {
    query += " AND strftime('%m', mv.visit_date) = ? AND strftime('%Y', mv.visit_date) = ?";
    params.push(String(month).padStart(2, '0'), String(year));
  }
  query += ' ORDER BY mv.visit_date DESC, mv.created_at DESC';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/membership-visits', (req, res) => {
  const { membership_id, visit_date, service, branch, staff_name, notes } = req.body;
  const mem = db.prepare('SELECT * FROM memberships WHERE id=?').get(membership_id);
  if (!mem) return res.status(404).json({ error: 'Membership not found' });
  if (mem.visits_used >= mem.total_visits) return res.status(400).json({ error: 'No visits remaining' });
  const result = db.prepare(
    'INSERT INTO membership_visits (membership_id, visit_date, service, branch, staff_name, notes) VALUES (?,?,?,?,?,?)'
  ).run(membership_id, visit_date, service, branch, staff_name, notes);
  db.prepare('UPDATE memberships SET visits_used = visits_used + 1 WHERE id=?').run(membership_id);
  res.json({ id: result.lastInsertRowid });
});

app.delete('/api/membership-visits/:id', (req, res) => {
  const visit = db.prepare('SELECT * FROM membership_visits WHERE id=?').get(req.params.id);
  if (!visit) return res.status(404).json({ error: 'Visit not found' });
  db.prepare('DELETE FROM membership_visits WHERE id=?').run(req.params.id);
  db.prepare('UPDATE memberships SET visits_used = MAX(0, visits_used - 1) WHERE id=?').run(visit.membership_id);
  res.json({ ok: true });
});

// ── STAFF ─────────────────────────────────────────────────────────────────────

app.get('/api/staff', (req, res) => {
  const { branch } = req.query;
  let query = 'SELECT * FROM staff WHERE active=1';
  const params = [];
  if (branch && branch !== 'all') { query += ' AND branch = ?'; params.push(branch); }
  query += ' ORDER BY name';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/staff', (req, res) => {
  const { name, role, branch, base_salary } = req.body;
  const result = db.prepare(
    'INSERT INTO staff (name, role, branch, base_salary) VALUES (?,?,?,?)'
  ).run(name, role, branch, base_salary || 0);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/staff/:id', (req, res) => {
  const { name, role, branch, base_salary, active } = req.body;
  db.prepare(
    'UPDATE staff SET name=?, role=?, branch=?, base_salary=?, active=? WHERE id=?'
  ).run(name, role, branch, base_salary, active ?? 1, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/staff/:id', (req, res) => {
  db.prepare('UPDATE staff SET active=0 WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── SALARY RECORDS ────────────────────────────────────────────────────────────

app.get('/api/salary', (req, res) => {
  const { month, year, branch } = req.query;
  let query = `
    SELECT sr.*, s.name as staff_name, s.role, s.branch
    FROM salary_records sr
    JOIN staff s ON sr.staff_id = s.id
    WHERE 1=1
  `;
  const params = [];
  if (branch && branch !== 'all') { query += ' AND s.branch = ?'; params.push(branch); }
  if (month) { query += ' AND sr.month = ?'; params.push(Number(month)); }
  if (year) { query += ' AND sr.year = ?'; params.push(Number(year)); }
  query += ' ORDER BY sr.year DESC, sr.month DESC, s.name';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/salary', (req, res) => {
  const { staff_id, month, year, base_amount, commission, paid_date, notes } = req.body;
  const total = (Number(base_amount) || 0) + (Number(commission) || 0);
  const existing = db.prepare(
    'SELECT id FROM salary_records WHERE staff_id=? AND month=? AND year=?'
  ).get(staff_id, month, year);
  if (existing) {
    db.prepare(
      'UPDATE salary_records SET base_amount=?, commission=?, total=?, paid_date=?, notes=? WHERE id=?'
    ).run(base_amount, commission, total, paid_date, notes, existing.id);
    res.json({ id: existing.id, updated: true });
  } else {
    const result = db.prepare(
      'INSERT INTO salary_records (staff_id, month, year, base_amount, commission, total, paid_date, notes) VALUES (?,?,?,?,?,?,?,?)'
    ).run(staff_id, month, year, base_amount, commission, total, paid_date, notes);
    res.json({ id: result.lastInsertRowid });
  }
});

app.delete('/api/salary/:id', (req, res) => {
  db.prepare('DELETE FROM salary_records WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── DASHBOARD SUMMARY ─────────────────────────────────────────────────────────

app.get('/api/summary', (req, res) => {
  const { month, year } = req.query;
  const m = String(month || new Date().getMonth() + 1).padStart(2, '0');
  const y = String(year || new Date().getFullYear());

  const dateFilter = `strftime('%m', date) = '${m}' AND strftime('%Y', date) = '${y}'`;

  const totalRevenue = db.prepare(`SELECT COALESCE(SUM(amount),0) as val FROM payments WHERE ${dateFilter}`).get().val;
  const totalExpenses = db.prepare(`SELECT COALESCE(SUM(amount),0) as val FROM expenses WHERE ${dateFilter}`).get().val;

  const revenueByBranch = db.prepare(
    `SELECT branch, COALESCE(SUM(amount),0) as total FROM payments WHERE ${dateFilter} GROUP BY branch`
  ).all();

  const expensesByCategory = db.prepare(
    `SELECT category, COALESCE(SUM(amount),0) as total FROM expenses WHERE ${dateFilter} GROUP BY category ORDER BY total DESC`
  ).all();

  const expensesByBranch = db.prepare(
    `SELECT branch, COALESCE(SUM(amount),0) as total FROM expenses WHERE ${dateFilter} GROUP BY branch`
  ).all();

  // Last 6 months trend
  const trend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Number(y), Number(m) - 1 - i, 1);
    const tm = String(d.getMonth() + 1).padStart(2, '0');
    const ty = String(d.getFullYear());
    const rev = db.prepare(`SELECT COALESCE(SUM(amount),0) as val FROM payments WHERE strftime('%m',date)='${tm}' AND strftime('%Y',date)='${ty}'`).get().val;
    const exp = db.prepare(`SELECT COALESCE(SUM(amount),0) as val FROM expenses WHERE strftime('%m',date)='${tm}' AND strftime('%Y',date)='${ty}'`).get().val;
    trend.push({ month: tm, year: ty, revenue: rev, expenses: exp });
  }

  res.json({
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    revenueByBranch,
    expensesByCategory,
    expensesByBranch,
    trend
  });
});

// ── EXPORT CSV ────────────────────────────────────────────────────────────────

app.get('/api/export/payments', (req, res) => {
  const { month, year, branch } = req.query;
  let query = 'SELECT * FROM payments WHERE 1=1';
  const params = [];
  if (branch && branch !== 'all') { query += ' AND branch = ?'; params.push(branch); }
  if (month && year) {
    query += " AND strftime('%m', date) = ? AND strftime('%Y', date) = ?";
    params.push(String(month).padStart(2, '0'), String(year));
  }
  query += ' ORDER BY date DESC';
  const rows = db.prepare(query).all(...params);

  const headers = ['ID', 'Date', 'Customer', 'Service', 'Amount', 'Payment Method', 'Branch', 'Notes'];
  const csv = [headers.join(','),
    ...rows.map(r => [r.id, r.date, `"${r.customer_name||''}"`, `"${r.service||''}"`, r.amount, r.payment_method, r.branch, `"${r.notes||''}"`].join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="payments.csv"');
  res.send(csv);
});

app.get('/api/export/expenses', (req, res) => {
  const { month, year, branch } = req.query;
  let query = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];
  if (branch && branch !== 'all') { query += ' AND branch = ?'; params.push(branch); }
  if (month && year) {
    query += " AND strftime('%m', date) = ? AND strftime('%Y', date) = ?";
    params.push(String(month).padStart(2, '0'), String(year));
  }
  query += ' ORDER BY date DESC';
  const rows = db.prepare(query).all(...params);

  const headers = ['ID', 'Date', 'Category', 'Sub-Category', 'Description', 'Amount', 'Branch', 'Notes'];
  const csv = [headers.join(','),
    ...rows.map(r => [r.id, r.date, r.category, r.subcategory||'', `"${r.description||''}"`, r.amount, r.branch, `"${r.notes||''}"`].join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
  res.send(csv);
});

app.get('/api/export/salary', (req, res) => {
  const { month, year } = req.query;
  let query = `SELECT sr.*, s.name as staff_name, s.role, s.branch FROM salary_records sr JOIN staff s ON sr.staff_id=s.id WHERE 1=1`;
  const params = [];
  if (month) { query += ' AND sr.month = ?'; params.push(Number(month)); }
  if (year) { query += ' AND sr.year = ?'; params.push(Number(year)); }
  query += ' ORDER BY sr.year DESC, sr.month DESC, s.name';
  const rows = db.prepare(query).all(...params);

  const headers = ['Staff Name', 'Role', 'Branch', 'Month', 'Year', 'Base Salary', 'Commission', 'Total', 'Paid Date', 'Notes'];
  const csv = [headers.join(','),
    ...rows.map(r => [`"${r.staff_name}"`, `"${r.role||''}"`, r.branch, r.month, r.year, r.base_amount, r.commission, r.total, r.paid_date||'', `"${r.notes||''}"`].join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="salary.csv"');
  res.send(csv);
});

app.get('/api/export/memberships', (req, res) => {
  const { branch } = req.query;
  let query = 'SELECT * FROM memberships WHERE active=1';
  const params = [];
  if (branch && branch !== 'all') { query += ' AND branch = ?'; params.push(branch); }
  query += ' ORDER BY created_at DESC';
  const rows = db.prepare(query).all(...params);

  const headers = ['ID', 'Member Name', 'Card Number', 'Phone', 'Branch', 'Total Visits', 'Visits Used', 'Remaining', 'Amount Paid', 'Purchase Date', 'Expiry Date', 'Notes'];
  const csv = [headers.join(','),
    ...rows.map(r => [r.id, `"${r.member_name}"`, r.card_number||'', r.phone||'', r.branch, r.total_visits, r.visits_used, r.total_visits - r.visits_used, r.amount_paid, r.purchase_date||'', r.expiry_date||'', `"${r.notes||''}"`].join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="memberships.csv"');
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`\n🌸 Jacuzzi Spa Dashboard running at http://localhost:${PORT}\n`);
});
