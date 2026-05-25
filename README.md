# 🏦 Bankify — Demo Banking App

A full-featured demo banking application built with **React 18**, **Redux Toolkit Query**, and **JSON Server**.

> **Demo only** — no real money, no real transactions. All data is stored locally in `server/db.json`.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Opens at **[http://localhost:3000](http://localhost:3000)** · API runs at **[http://localhost:3001](http://localhost:3001)**

### Demo credentials

| | |
|---|---|
| Email | `test@test.com` |
| Password | `testtest` |

Or create a new account at `/create-user`.

---

## 📖 Feature Guide

### 🔐 Authentication

- **Register** — go to `/create-user`, fill in name, surname, email, password, phone, address
- **Login** — go to `/login`, enter email and password
- After login you are redirected to the home dashboard at `/:userId/`

---

### 🏠 Home page

- Overview of all your accounts, linked cards, and recent transactions
- Quick-action buttons: **Transfer**, **Exchange**, **Deposit**, **New card**
- Exchange rate strip with live UAH/USD/EUR rates
- Animated features section, stats strip, testimonials

---

### 🏦 Accounts & Transactions

**Path:** `/:userId/transactions/`

- See all your accounts (UAH, USD, EUR) with current balances
- Click any account row to open its **transaction history page**
- On the account page:
  - View **linked cards** with 3D flip visuals
  - If a card has a **monthly spending limit** — a progress bar shows how much of the limit has been spent this month
  - Filter transactions by **direction** (All / In / Out) and **type** (Transfer, Exchange, Deposit, etc.)
  - Click any transaction row to open the **Transaction Detail Modal** (see below)
  - Paginated — 10 transactions per page
  - **Transfer** and **Add card** quick-action buttons

---

### 💸 All Transactions (History)

**Path:** `/:userId/history/`

- Full transaction history across **all accounts**
- **Summary strip** — total incoming, outgoing, and net per currency
- **Filters:**
  - Search by description, counterparty name, or account number
  - Filter by account, direction (In / Out), transaction type, and time period (7D / 1M / 3M / All)
  - Change page size (10 / 20 / 50)
- Click any row → **Transaction Detail Modal** with full info

#### 🔍 Transaction Detail Modal
Clicking any transaction row opens a bottom-sheet with:
- Amount (large, colour-coded green/red)
- Status badge · Reference ID
- Date and exact time
- Direction (Incoming / Outgoing)
- Counterparty name and account number
- Description and currency
- Close by clicking **Done**, the overlay, or pressing `Escape`

---

### 💸 Transfer & Exchange

**Path:** `/:userId/transactions/remittance/`

#### Send tab
1. Select **From account**
2. Enter **recipient account number** (format: `UA28...`)
3. Enter **amount**
4. Toggle **External bank** if the recipient is outside the system
5. Click **Calculate** — preview shows exchange rate, 1% commission, and final recipient amount
6. Click **Confirm** to execute

#### Exchange tab
1. Select **Sell from** account and **Buy into** account
2. Enter the amount to sell
3. Live preview shows the conversion at current rates (no commission)
4. Click the **Exchange** button — animated success screen, then redirects to history

---

### 💳 Cards

**Path:** `/:userId/cards/`

- View all cards across all accounts as a grid
- Each card shows type (VISA / Mastercard), category (credit / debit), last 4 digits, expiry

**Card detail page** — click any card:

| Action | How |
|---|---|
| **Reveal card number** | Click the 👁 eye icon next to the number |
| **Copy card number** | Click the **Copy** button |
| **Reveal / hide CVV** | Click the 👁 eye icon in the CVV row |
| **Edit CVV** | Click the ✏️ pencil icon, type 3 digits, save |
| **Change PIN** | Click the ✏️ pencil icon in the PIN row → 2-step modal: enter current PIN → enter & confirm new PIN |
| **Freeze / Unfreeze card** | Click **❄️ Freeze card** button — card shows a blue frozen overlay everywhere it appears; click again to unfreeze |
| **Set spending limit** | Click the ✏️ pencil icon in the Monthly limit row → enter amount in your account currency (leave empty to remove) |
| **Re-issue card** | Click **Re-issue card**, then confirm — generates new number, CVV, expiry |
| **Delete card** | Click **Delete card**, then confirm — permanently removes the card |
| **Go to account** | Click **View account** in the linked account block |

> Frozen card shows a `❄️ FROZEN` overlay on the 3D card visual across all pages.  
> Spending limit progress bar appears on the account transaction page under each linked card.

---

### 💰 Deposits

**Path:** `/:userId/deposits/`

- View all open and matured deposits
- **Deposit calculator** — choose currency, amount, term (days), interest rate → see projected payout
- Open a new deposit with **Open Deposit** button
- Cards maturing within **7 days** show an amber `🔔 Matures in N days` banner
- Matured deposits are marked and can be collected

---

### 📊 Exchange Rates

**Path:** `/exchange-rate/`

- Live rates table: UAH ↔ USD ↔ EUR (buy / sell)
- Interactive **rate chart** — switch between currency pairs and time ranges
- No login required

---

### 👤 Profile

**Path:** `/:userId/profile/`

- View and edit: name, surname, email, phone, address
- See account creation date and last login time
- Link to **Settings**

---

### ⚙️ Settings

**Path:** `/:userId/settings/`

Navigate sections using the left sidebar:

#### 🎨 Appearance
| Setting | What it does |
|---|---|
| **Compact layout** | Reduces padding in lists and cards for a denser view — takes effect immediately |
| **Reduce motion** | Disables all CSS animations and transitions app-wide — takes effect immediately |
| Dark mode | Not yet implemented (saved but not applied) |

#### 🔒 Privacy
| Setting | What it does |
|---|---|
| **Hide balances** | Replaces all balance amounts with `••••••` on account, card, and transaction pages |
| **Mask card numbers** | Shows only last 4 digits on cards and in card detail |

#### 🛡️ Security — Change password
1. Enter your **current password**
2. Enter a **new password** (min 6 characters) — strength meter shows Weak / Fair / Good / Strong
3. **Confirm** the new password — green ✓ appears when they match
4. Click **Change password** — toast confirms success

#### 🔔 Notifications
Toggle preferences for transfers, deposits, security alerts, and promotions.
> Preferences are saved but push notifications require a backend service (not implemented).

#### 🌐 Regional
| Setting | What it does |
|---|---|
| **Default currency** | Pre-selects currency in the deposit calculator |
| **Date format** | Switches between DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD |
| Language | Not yet implemented |

#### 💾 Data & Storage
- **Export CSV** — downloads all your transactions as a UTF-8 CSV file (opens correctly in Excel)
- **Clear local cache** — removes all saved UI preferences from the browser (does not affect server data)

#### ℹ️ About
- Links to **Help & Support**, **Privacy Policy**, **Terms of Service**

---

### 🆘 Help, Privacy, Terms

Public pages — accessible without login:

| Page | Path |
|---|---|
| Help & Support | `/help` |
| Privacy Policy | `/privacy` |
| Terms of Service | `/terms` |

The **Help** page has a search bar and category filter (Getting Started, Accounts, Cards, Transfers, Security).

---

### 🔔 Toast Notifications

Toasts appear in the **bottom-right corner** and auto-dismiss after 4 seconds.  
Click the **✕** or the toast itself to dismiss early.

They are shown for:
- Card frozen / unfrozen
- PIN changed
- Spending limit set / removed
- Card re-issued or deleted
- Password changed successfully
- Any action error

---

## 🛠 Tech Stack

| | |
|---|---|
| UI | React 18 + CSS Modules |
| State & data | Redux Toolkit + RTK Query |
| Routing | React Router v6 |
| Backend | JSON Server (mock REST API) |
| Charts | Chart.js + react-chartjs-2 |
| Build | Create React App |
