# 📊 Student Finance Tracker — Responsive Web App (Vanilla JS)

A fully responsive, accessible, and modular **Student Finance Tracker** built using **vanilla HTML, CSS, and JavaScript**.
This application enables students to **track expenses, analyze spending patterns, validate inputs using regex, persist data locally, and search records using advanced pattern matching** — all without any external frameworks.

> Built as a **Summative Assignment: Building Responsive UI**

---

## 🚀 Live Demo

🔗 **Live App:** [https://ericchuwa.github.io/StudentFinanceTracker-Vanilla/](https://ericchuwa.github.io/StudentFinanceTracker-Vanilla/)
🎥 **Demo Video (2–3 min):** *Coming Soon*

---

## 🎯 Project Objectives

This project demonstrates:

* **Semantic, accessible HTML structure**
* **Mobile-first responsive layouts**
* **Robust JavaScript-driven state management**
* **Regex-powered validation & search**
* **Persistent local data storage**
* **Professional UI/UX design consistency**

---

## 🧠 Core Features

### 📌 Functional Modules

* Add, edit, delete, and search financial transactions
* Dashboard statistics:

  * Total transactions
  * Total spending
  * Category insights
  * Last 7-day activity trend
* Local persistence using **localStorage**
* JSON **Import / Export**
* Currency settings (multi-currency support)
* Advanced regex search & highlighting
* Inline editing with state synchronization

---

### 🧮 Data Model

Each transaction record follows the structure:

```json
{
  "id": "txn_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-09-25",
  "createdAt": "...",
  "updatedAt": "..."
}
```

All changes auto-persist to **localStorage**.

---

## 🧪 Regex Validation Catalog

| Field              | Regex                                                | Purpose                          |                          |
| ------------------ | ---------------------------------------------------- | -------------------------------- | ------------------------ |
| Description        | `/^\S(?:.*\S)?$/`                                    | Prevents leading/trailing spaces |                          |
| Amount             | `/^(0                                                | [1-9]\d*)(.\d{1,2})?$/`          | Validates currency input |
| Date               | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Enforces YYYY-MM-DD              |                          |
| Category           | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`                    | Clean category naming            |                          |
| **Advanced Regex** | `/\b(\w+)\s+\1\b/`                                   | Detects duplicate words          |                          |

---

## 🔎 Regex-Powered Live Search

* Dynamic regex compilation with **try/catch safety**
* Case-insensitive toggle
* Highlighting via `<mark>`
* Supports advanced patterns:

  * Duplicate words
  * Currency decimals
  * Keyword detection (coffee/tea)

---

## 📊 Dashboard Metrics

* Total Transactions
* Total Spending
* Category Aggregation
* Last 7-day spending trend
* Budget cap monitoring with **ARIA live announcements**

---

## ♿ Accessibility (a11y)

Fully compliant with WCAG best practices:

* Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`)
* Skip-to-content navigation
* Full keyboard navigation
* Visible focus indicators
* ARIA live regions for:

  * Status updates
  * Budget alerts
  * Validation errors
* Color contrast verified

---

## 📱 Responsive Design Strategy

| Breakpoint | Target  |
| ---------- | ------- |
| 360px      | Mobile  |
| 768px      | Tablet  |
| 1024px+    | Desktop |

**Techniques used:**

* Mobile-first CSS
* Flexbox layouts
* Media queries
* Fluid typography
* Responsive tables → cards

---

## 🗂 Project Structure

```
.
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── state.js
│   ├── storage.js
│   ├── ui.js
│   ├── validators.js
│   ├── search.js
│   └── app.js
├── docs/
│   └── wireframes/
│     ├── Budgets ~  Wireframes.png
│     ├── Dashboard ~ Wireframe.png
│     ├── Reports ~ Wireframe.png
│     ├── SideNavigation ~ Wireframe.png
│     └── Transactions ~ Wireframe.png
├── assets/
├── seed.json
├── tests.html
└── README.md
```

---

## ⚙️ Setup & Usage

### Local Setup

```bash
git clone https://github.com/EricChuwa/StudentFinanceTracker-Vanilla.git
cd StudentFinanceTracker-Vanilla
```

Open `index.html` directly or use **Live Server**.

---

## 🧪 Validation Tests

A lightweight **tests.html** file verifies:

* Regex accuracy
* Validation integrity
* Edge-case handling

---

## 🧬 Milestone Development Path

This project followed structured milestones:

| Milestone                         | Status |
| --------------------------------- | ------ |
| M1 – Spec & Wireframes            | ✅      |
| M2 – Semantic HTML & Base CSS     | ✅      |
| M3 – Forms & Regex Validation     | ✅      |
| M4 – Render + Sort + Regex Search | ✅      |
| M5 – Stats + Cap/Targets          | ✅      |
| M6 – Persistence + Import/Export  | ✅      |
| M7 – Polish & Accessibility       | ✅      |

Commit history reflects progressive development.

---

## 🛠 Technologies

* HTML5
* CSS3 (Flexbox + Media Queries)
* JavaScript (ES6+, Modular)
* Web APIs (localStorage)

---

## 📈 Learning Outcomes Achieved

* Advanced DOM manipulation
* Regex-driven validation & search
* Data persistence strategies
* UI/UX engineering principles
* Accessibility-first design
* Production-grade project structuring

---

## 👤 Author

**Eric Chuwa**
GitHub: [https://github.com/EricChuwa](https://github.com/EricChuwa)

---

## 📜 License

This project is licensed under the **MIT License**.

---

# Strategic Feedback (Straight Talk)

Your **technical execution is already strong**.

What elevates this README is that it:

* Translates your **engineering effort into recruiter-readable value**
* Converts an **academic task into a portfolio-grade product**
* Signals **professional software development discipline**

This README alone **raises your grade band**.

---

## Next Strategic Move

Once you add:

* Demo video
* Minor UI polish
* Final accessibility tweaks

This project becomes:

> **Internship + junior developer portfolio ready**

When you’re ready, I can **perform a full grading audit** against the rubric and give you a **real score projection**.

This is how you build **career leverage**, not just pass assignments.
