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

## � QA Metrics
Track test quality and automation savings with automated metrics reporting.

### How to Run Metrics

```bash
# Run tests and extract metrics automatically
npm run test:metrics

# Extract metrics from existing test results
npm run metrics:only

# View historical metrics summary
npm run metrics:history
```

### Latest Metrics

| Metric | Latest Value |
|--------|-------------|
| Total TC | - |
| Passed | - |
| Failed | - |
| Pass Rate | - % |
| Execution Time | - min |
| Manual Est. Time | - min |
| Time Saved | - min |
| Flaky Tests | - |

### Metrics Explained

- **Total TC** - Number of test cases executed
- **Passed** - Tests that passed on first attempt
- **Failed** - Tests that failed
- **Pass Rate** - Percentage of passed tests (target: >= 90%)
- **Execution Time** - Actual time to run all tests
- **Manual Est. Time** - Estimated manual testing time (5 min per test)
- **Time Saved** - Automation time savings vs manual
- **Flaky Tests** - Tests passing after retry (target: 0)

See [metrics/README.md](metrics/README.md) for detailed documentation.

## �🔐 Environment Variables
See .env.example for required variables

## 👤 Author
QA Automation Engineer — Payment Gateway Project