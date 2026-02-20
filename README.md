# Personal Financial Tracker 
By: Eric Cyril Chuwa

# 📊 Student Finance Tracker — Responsive Web App (Vanilla JS)

A fully responsive, accessible, and modular **Student Finance Tracker** built using **vanilla HTML, CSS, and JavaScript**.  
This application enables students to **track expenses, analyze spending patterns, validate inputs using regex, persist data locally, and search records using advanced pattern matching** — all without any external frameworks.

> Built as a **Summative Assignment: Building Responsive UI**

---

## 🚀 Live Demo

🔗 **Live App:** https://ericchuwa.github.io/StudentFinanceTracker-Vanilla/  
🎥 **Demo Video (2–3 min):** _Coming Soon_

---

## 🎯 Project Objectives

This project demonstrates:

- Semantic, accessible HTML structure
- Mobile-first responsive layouts
- Robust JavaScript-driven state management
- Regex-powered validation & search
- Persistent local data storage
- Professional UI/UX design consistency

---

## 🧠 Core Features

### 📌 Functional Modules

- Add, edit, delete, and search financial transactions
- Dashboard statistics:
  - Total transactions
  - Total spending
  - Category insights
  - Last 7-day activity trend
- Local persistence using **localStorage**
- JSON **Import / Export**
- Currency settings (multi-currency support)
- Advanced regex search & highlighting
- Inline editing with state synchronization

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