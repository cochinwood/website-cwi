# CWI Platform — Sales Role Mandatory Data Collection & Public Website Sync

This project implements the end-to-end architecture and interactive interface for role-based sales management and real-time public customer contact directory synchronization.

---

## Key Features Implemented

### 1. Internal App (Admin Portal)
- **Role Selection**: Roles include `Sales`, `Operations`, `Admin`, and `Customer Support`.
- **Mandatory Sales Rules Enforced**:
  - **`Dealing`**: Mandatory selection between **`Domestic`**, **`Export`**, or **`Both`**. Form submission is blocked if not selected.
  - **`Languages Spoken`**: Mandatory searchable **multi-select dropdown** with native script labels (English, Malayalam, Kannada, Hindi, Tamil, Telugu, Arabic, Spanish, French, German, etc.) and removable tag chips.
  - **Direct Contact**: Mandatory Phone & WhatsApp contact numbers.
- **Dynamic Role Adaptation**: Selecting non-sales roles automatically hides sales-specific fields and excludes them from the customer-facing website directory.
- **Life-cycle Controls**: Real-time ability to Add, Edit, Deactivate, or Delete sales managers.

### 2. Public Customer Website
- **Real-Time Directory**: Displays all active, verified sales representatives with photo, title, market scope, and spoken languages.
- **Interactive Customer Filtering**:
  - Filter by Market: `All Markets`, `Domestic`, `Export`, `Both`.
  - Filter by Language: Live multi-option selector automatically populated with languages spoken by active representatives.
  - Search by Name, Region / Territory, or Language.
- **Direct One-Click Customer CTAs**:
  - 💬 **WhatsApp**: Direct link via `wa.me` with pre-filled customer inquiry message tailored to their market.
  - 📞 **Direct Call**: `tel:` link for immediate telephone connection.
  - ✉️ **Email Inquiry**: `mailto:` link with pre-filled subject line.

### 3. Live Side-by-Side Playground (Split View)
- Allows testing in real-time: add or delete a sales manager on the left pane (Internal App) and immediately watch the customer directory on the right pane (Public Website) update with zero latency.

### 4. Interactive Flowchart & Specification
- Embedded visual flowchart detailing the entire data flow from creation to customer contact.

---

## How to Run Locally

1. Open a terminal in this project folder:
   ```bash
   npm install
   npm run dev
   ```
2. Open the displayed local URL (typically `http://localhost:5173`) in your browser.
