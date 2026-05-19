# QA UI Automation — Payment Gateway

End-to-end UI automation testing for Payment Gateway
merchant dashboard including login, QR generation,
and bulk QR flows.
Built with Playwright and TypeScript using Page Object Model.

## 🛠️ Tech Stack
- Playwright
- TypeScript
- Node.js

## 📁 Structure
pages/         → Page Object Model classes
               (LoginPage, DashboardPage, QRGeneratePage)
tests/         → Test specs
               (login, qr-generate, bulk-qr-generate)
fixtures/      → Test fixtures (auth, base, mobile)
selectors/     → Element selectors per page
data/          → Test data (CSV, JSON)
e2e/           → Additional E2E scenarios

## ⚙️ Setup
1. Clone repo
2. Install dependencies:
   npm install
3. Install Playwright browsers:
   npx playwright install
4. Copy .env.example → .env
5. Fill in credentials

## 🚀 Run
# Run all tests
npx playwright test

# Run specific test
npx playwright test tests/login.spec.ts

# Run mobile tests
npx playwright test tests/qr-generate-mobile.spec.ts

# Run with UI mode
npx playwright test --ui

## 🔐 Environment Variables
See .env.example for required variables

## 👤 Author
QA Automation Engineer — Payment Gateway Project