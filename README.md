# Interactive Expense Tracker Web Application

A client-side web application designed to help users track, categorize, and analyze their expenses with persistent state in the browser.

---

## 1. Project Overview

The Interactive Expense Tracker allows users to record personal financial transactions, edit or remove them, and slice data using category and date range filters. The UI updates dynamically without page reloads, and all data persists in the browser's `localStorage`.

---

## 2. Approach & Architecture

### **State-Driven Rendering**
* **Single Source of Truth:** A global in-memory array (`expenses`) holds objects representing individual transactions. Each record contains `id`, `title`, `amount`, `category`, and `date`.
* **Dynamic Pipeline:** Any mutation (add, edit, delete, or filter change) triggers the central `renderApp()` function, which derives filtered data, updates calculation summaries, and refreshes the DOM.

### **Persistent Storage**
* Uses browser `localStorage` serialization (`JSON.stringify` and `JSON.parse`) to retain data across sessions.
* Falls back gracefully to an empty array when initialized for the first time.

### **Form & Event Management**
* The same form serves dual purposes: **creating** new transactions and **updating** existing ones by setting or clearing `editingExpenseId`.
* Proper HTML5 attributes (`required`, `min="0.01"`, `step="0.01"`) combined with JavaScript checks guarantee data integrity before updating storage.
* Text escaping prevents HTML injection (XSS) during dynamic row generation.

### **Responsive UI / UX Design**
* Built with CSS Grid and Flexbox for responsiveness across mobile, tablet, and desktop viewports.
* Clear visual indicators for categories, hover states for action buttons, and contextual empty states when filters produce zero matches.

---

## 3. Features & Deliverables

- [x] **Expense Entry Form:** Input description, amount, category, and date.
- [x] **Listing View:** Tabular display showing transaction details and timestamps.
- [x] **Edit & Delete Actions:** Modify existing records or remove them with confirmation dialogs.
- [x] **Multi-Criteria Filtering:** Filter records by category and start/end dates.
- [x] **Summary Analytics:** Real-time updates for total spending, transaction count, and top category.
- [x] **Local Persistence:** Retains state across browser refreshes using `localStorage`.
- [x] **Fully Responsive:** Adapts seamlessly between mobile single-column and desktop dual-column layouts.

---

## 4. Outcome

* **Pure Vanilla Implementation:** Zero external frameworks or libraries, maximizing execution speed and minimizing load time.
* **Declarative DOM Manipulation:** Clean event handling demonstrating foundational JavaScript core competencies (array manipulation with `.reduce()`, `.filter()`, `.map()`, and DOM traversal).
* **Usability:** Fast, intuitive workflow for tracking everyday spending with immediate feedback.

---

## 5. How to Run

1. Clone or download this repository:
   ```bash
   git clone <repo-url>
   cd expense-tracker