# 📊 QRIS Payment — Test Run Report

> **Run ID :** `run_20260616_201305`
> **Tanggal :** 16/06/2026 20:13:05 WIB
> **Status  :** ✅ PASSED

---

## 📈 Ringkasan Eksekusi

| Metrik | Nilai |
|--------|-------|
| Total Test | **3** |
| ✅ Passed | **3** |
| ❌ Failed | **0** |
| ⏭️ Skipped | **0** |
| ⚡ Flaky | **0** |
| Pass Rate | **100.00%** — ✅ PASS |
| Waktu Eksekusi | **1.71 menit** |
| Flaky Status | ✅ CLEAN |

---

## 🧪 Hasil per Test / Browser

| Browser / Project | Test Case | Status | Durasi | Iterasi | Invoice(s) |
|-------------------|-----------|--------|--------|---------|------------|
| ✅ `qris-payment-chrome` | Run 3 QRIS payment iterations | PASSED | 33.37s | 3 iterasi | 53951640645395164064, 54444758085444475808, 54923334725492333472 |
| ✅ `qris-payment-firefox` | Run 3 QRIS payment iterations | PASSED | 36.36s | 3 iterasi | 54056293445405629344, 54596596805459659680, 55052112965505211296 |
| ✅ `qris-payment-edge` | Run 3 QRIS payment iterations | PASSED | 32.64s | 3 iterasi | 53949756485394975648, 54429480005442948000, 54868653125486865312 |

---

## 📁 File Arsip Run Ini

```
run_20260616_201305/
├── report.md          ← file ini
├── test-results.json  ← raw JSON dari Playwright
└── html/              ← HTML report (buka index.html di browser)
    └── index.html
```

- 🖼️ Screenshots tersimpan di : `results/screenshots/`
- 🎥 Videos tersimpan di      : `results/videos/`
- 📊 Metrics history          : `metrics/metrics-history.json`

---

## 📜 Terminal Logs (stdout)

```
[qris-payment-chrome] 
[QRIS] 🌐 Opening https://uat-manjo.mitrapembayaran.com/
[qris-payment-chrome] [QRIS] ✅ Page loaded — form visible
[qris-payment-chrome] 
[QRIS] ══════════════ ITERATION 1 / 3 ══════════════
[qris-payment-chrome] [QRIS] [1] 👤 Buyer : Budi Sandiago
[qris-payment-chrome] [QRIS] [1] 📦 Item  : Paket Premium 1 Bulan
[qris-payment-chrome] [QRIS] [1] 💰 Amount: Rp 19000
[qris-payment-chrome] [QRIS] [1] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-chrome] [QRIS] [1] 🪟 Popup opened (url: about:blank)
[qris-payment-chrome] [QRIS] [1] ✅ Popup #main-content visible
[qris-payment-chrome] [QRIS] [1] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-chrome] [QRIS] [1] 🔲 QR code rendered
[qris-payment-chrome] [QRIS] [1] 🔑 Transaction ID: vglck1qmr75b94cjbqblcp1g
[qris-payment-chrome] [QRIS] [1] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-chrome] [QRIS] [1] 💳 Calling payment API — txn: vglck1qmr75b94cjbqblcp1g | amount: Rp 19000.
[qris-payment-chrome] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-chrome] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:30.441Z
[qris-payment-chrome] [QRIS-API] RRN        : ALTO-API-NMS-aa91ea10133a
[qris-payment-chrome] [QRIS-API] FORWARD_RRN: 8f670b87a2d0
[qris-payment-chrome] [QRIS-API] TXN_ID     : vglck1qmr75b94cjbqblcp1g
[qris-payment-chrome] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:30.441Z","customer_reference_number":"ALTO-API-NMS-aa91ea10133a","authorization_id":"FCC7B6","currency_code":"IDR","amount":19000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524vglck1qmr75b94cjbqblcp1g07034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"8f670b87a2d0","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-chrome] [QRIS-API] SIGNATURE  : 1b0e28b388427bc306bcdc035fbaf14d49aa103da55d60a57b8c89e1aaca9a65
[qris-payment-chrome] [QRIS-API] HTTP Status : 200
[qris-payment-chrome] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-aa91ea10133a","invoice_no":"53951640645395164064","currency_code":"IDR","amount":19000,"fee":0}}
[qris-payment-chrome] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-chrome] [QRIS-API] response_code : 001
[qris-payment-chrome] [QRIS-API] response_text : Success
[qris-payment-chrome] [QRIS-API] invoice_no    : 53951640645395164064
[qris-payment-chrome] [QRIS-API] crn           : ALTO-API-NMS-aa91ea10133a
[qris-payment-chrome] [QRIS] [1] ✅ Payment API success — code: 001 | text: Success | invoice: 53951640645395164064
[qris-payment-chrome] [QRIS] [1] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-chrome] [QRIS] [1] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 1.91s
[qris-payment-chrome] [QRIS] [1] 🔘 Clicking "Tutup"…
[qris-payment-chrome] [QRIS] [1] 🪟 Popup closed after 0.07s
[qris-payment-chrome] [QRIS] [1] 🏠 Main page back in focus
[qris-payment-chrome] [QRIS] [1] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-chrome] [QRIS] [1] ⏸️  Waiting 3000ms before next iteration…
[qris-payment-chrome] [QRIS] [1] ✅ Main page reloaded — ready for next iteration
[qris-payment-chrome] [QRIS] [1] ✅ Iteration 1 COMPLETE
[qris-payment-chrome] 
[QRIS] ══════════════ ITERATION 2 / 3 ══════════════
[qris-payment-chrome] [QRIS] [2] 👤 Buyer : Dewi Lesi
[qris-payment-chrome] [QRIS] [2] 📦 Item  : Paket Standar 1 Bulan
[qris-payment-chrome] [QRIS] [2] 💰 Amount: Rp 12000
[qris-payment-chrome] [QRIS] [2] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-chrome] [QRIS] [2] 🪟 Popup opened (url: about:blank)
[qris-payment-chrome] [QRIS] [2] ✅ Popup #main-content visible
[qris-payment-chrome] [QRIS] [2] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-chrome] [QRIS] [2] 🔲 QR code rendered
[qris-payment-chrome] [QRIS] [2] 🔑 Transaction ID: kyse4hdcmyyoalunpixyywl7
[qris-payment-chrome] [QRIS] [2] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-chrome] [QRIS] [2] 💳 Calling payment API — txn: kyse4hdcmyyoalunpixyywl7 | amount: Rp 12000.
[qris-payment-chrome] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-chrome] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:42.322Z
[qris-payment-chrome] [QRIS-API] RRN        : ALTO-API-NMS-4a1c85b986c0
[qris-payment-chrome] [QRIS-API] FORWARD_RRN: 2f65ac53025d
[qris-payment-chrome] [QRIS-API] TXN_ID     : kyse4hdcmyyoalunpixyywl7
[qris-payment-chrome] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:42.322Z","customer_reference_number":"ALTO-API-NMS-4a1c85b986c0","authorization_id":"FCC7B6","currency_code":"IDR","amount":12000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524kyse4hdcmyyoalunpixyywl707034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"2f65ac53025d","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-chrome] [QRIS-API] SIGNATURE  : 1e6d498565661725fe519d189d59761de96fa8f6d97a4592c8de9d5f856ebdcb
[qris-payment-chrome] [QRIS-API] HTTP Status : 200
[qris-payment-chrome] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-4a1c85b986c0","invoice_no":"54444758085444475808","currency_code":"IDR","amount":12000,"fee":0}}
[qris-payment-chrome] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-chrome] [QRIS-API] response_code : 001
[qris-payment-chrome] [QRIS-API] response_text : Success
[qris-payment-chrome] [QRIS-API] invoice_no    : 54444758085444475808
[qris-payment-chrome] [QRIS-API] crn           : ALTO-API-NMS-4a1c85b986c0
[qris-payment-chrome] [QRIS] [2] ✅ Payment API success — code: 001 | text: Success | invoice: 54444758085444475808
[qris-payment-chrome] [QRIS] [2] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-chrome] [QRIS] [2] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 1.92s
[qris-payment-chrome] [QRIS] [2] 🔘 Clicking "Tutup"…
[qris-payment-chrome] [QRIS] [2] 🪟 Popup closed after 0.12s
[qris-payment-chrome] [QRIS] [2] 🏠 Main page back in focus
[qris-payment-chrome] [QRIS] [2] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-chrome] [QRIS] [2] ⏸️  Waiting 3000ms before next iteration…
[qris-payment-chrome] [QRIS] [2] ✅ Main page reloaded — ready for next iteration
[qris-payment-chrome] [QRIS] [2] ✅ Iteration 2 COMPLETE
[qris-payment-chrome] 
[QRIS] ══════════════ ITERATION 3 / 3 ══════════════
[qris-payment-chrome] [QRIS] [3] 👤 Buyer : Andi Wiwik
[qris-payment-chrome] [QRIS] [3] 📦 Item  : Paket Basic 1 Bulan
[qris-payment-chrome] [QRIS] [3] 💰 Amount: Rp 13000
[qris-payment-chrome] [QRIS] [3] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-chrome] [QRIS] [3] 🪟 Popup opened (url: about:blank)
[qris-payment-chrome] [QRIS] [3] ✅ Popup #main-content visible
[qris-payment-chrome] [QRIS] [3] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-chrome] [QRIS] [3] 🔲 QR code rendered
[qris-payment-chrome] [QRIS] [3] 🔑 Transaction ID: orswxgbultzwi39ezc38cnd3
[qris-payment-chrome] [QRIS] [3] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-chrome] [QRIS] [3] 💳 Calling payment API — txn: orswxgbultzwi39ezc38cnd3 | amount: Rp 13000.
[qris-payment-chrome] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-chrome] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:54.110Z
[qris-payment-chrome] [QRIS-API] RRN        : ALTO-API-NMS-fdc26a535e05
[qris-payment-chrome] [QRIS-API] FORWARD_RRN: 2dbe531f1ac8
[qris-payment-chrome] [QRIS-API] TXN_ID     : orswxgbultzwi39ezc38cnd3
[qris-payment-chrome] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:54.110Z","customer_reference_number":"ALTO-API-NMS-fdc26a535e05","authorization_id":"FCC7B6","currency_code":"IDR","amount":13000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524orswxgbultzwi39ezc38cnd307034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"2dbe531f1ac8","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-chrome] [QRIS-API] SIGNATURE  : 34e78dfe430ad52338bf57239695a36cf083e2069534540fa58fae7d6a208a3d
[qris-payment-chrome] [QRIS-API] HTTP Status : 200
[qris-payment-chrome] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-fdc26a535e05","invoice_no":"54923334725492333472","currency_code":"IDR","amount":13000,"fee":0}}
[qris-payment-chrome] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-chrome] [QRIS-API] response_code : 001
[qris-payment-chrome] [QRIS-API] response_text : Success
[qris-payment-chrome] [QRIS-API] invoice_no    : 54923334725492333472
[qris-payment-chrome] [QRIS-API] crn           : ALTO-API-NMS-fdc26a535e05
[qris-payment-chrome] [QRIS] [3] ✅ Payment API success — code: 001 | text: Success | invoice: 54923334725492333472
[qris-payment-chrome] [QRIS] [3] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-chrome] [QRIS] [3] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 0.88s
[qris-payment-chrome] [QRIS] [3] 🔘 Clicking "Tutup"…
[qris-payment-chrome] [QRIS] [3] 🪟 Popup closed after 0.06s
[qris-payment-chrome] [QRIS] [3] 🏠 Main page back in focus
[qris-payment-chrome] [QRIS] [3] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-chrome] [QRIS] [3] ✅ Iteration 3 COMPLETE
[qris-payment-chrome] 
[QRIS] 🏁 All 3 iterations completed successfully!
[qris-payment-firefox] 
[QRIS] 🌐 Opening https://uat-manjo.mitrapembayaran.com/
[qris-payment-firefox] [QRIS] ✅ Page loaded — form visible
[qris-payment-firefox] 
[QRIS] ══════════════ ITERATION 1 / 3 ══════════════
[qris-payment-firefox] [QRIS] [1] 👤 Buyer : Budi Sandiago
[qris-payment-firefox] [QRIS] [1] 📦 Item  : Paket Premium 1 Bulan
[qris-payment-firefox] [QRIS] [1] 💰 Amount: Rp 19000
[qris-payment-firefox] [QRIS] [1] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-firefox] [QRIS] [1] 🪟 Popup opened (url: about:blank)
[qris-payment-firefox] [QRIS] [1] ✅ Popup #main-content visible
[qris-payment-firefox] [QRIS] [1] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-firefox] [QRIS] [1] 🔲 QR code rendered
[qris-payment-firefox] [QRIS] [1] 🔑 Transaction ID: fqc7fi7l0zn2qp1v1jp9q9fc
[qris-payment-firefox] [QRIS] [1] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-firefox] [QRIS] [1] 💳 Calling payment API — txn: fqc7fi7l0zn2qp1v1jp9q9fc | amount: Rp 19000.
[qris-payment-firefox] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-firefox] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:33.182Z
[qris-payment-firefox] [QRIS-API] RRN        : ALTO-API-NMS-1fb8cf9590d5
[qris-payment-firefox] [QRIS-API] FORWARD_RRN: 94ad9713a220
[qris-payment-firefox] [QRIS-API] TXN_ID     : fqc7fi7l0zn2qp1v1jp9q9fc
[qris-payment-firefox] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:33.182Z","customer_reference_number":"ALTO-API-NMS-1fb8cf9590d5","authorization_id":"FCC7B6","currency_code":"IDR","amount":19000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524fqc7fi7l0zn2qp1v1jp9q9fc07034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"94ad9713a220","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-firefox] [QRIS-API] SIGNATURE  : 927489390d631decab26594b99916ade57562df7fb4ffc28abbda0d4e44de4b0
[qris-payment-firefox] [QRIS-API] HTTP Status : 200
[qris-payment-firefox] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-1fb8cf9590d5","invoice_no":"54056293445405629344","currency_code":"IDR","amount":19000,"fee":0}}
[qris-payment-firefox] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-firefox] [QRIS-API] response_code : 001
[qris-payment-firefox] [QRIS-API] response_text : Success
[qris-payment-firefox] [QRIS-API] invoice_no    : 54056293445405629344
[qris-payment-firefox] [QRIS-API] crn           : ALTO-API-NMS-1fb8cf9590d5
[qris-payment-firefox] [QRIS] [1] ✅ Payment API success — code: 001 | text: Success | invoice: 54056293445405629344
[qris-payment-firefox] [QRIS] [1] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-firefox] [QRIS] [1] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 1.93s
[qris-payment-firefox] [QRIS] [1] 🔘 Clicking "Tutup"…
[qris-payment-firefox] [QRIS] [1] 🪟 Popup closed after 0.23s
[qris-payment-firefox] [QRIS] [1] 🏠 Main page back in focus
[qris-payment-firefox] [QRIS] [1] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-firefox] [QRIS] [1] ⏸️  Waiting 3000ms before next iteration…
[qris-payment-firefox] [QRIS] [1] ✅ Main page reloaded — ready for next iteration
[qris-payment-firefox] [QRIS] [1] ✅ Iteration 1 COMPLETE
[qris-payment-firefox] 
[QRIS] ══════════════ ITERATION 2 / 3 ══════════════
[qris-payment-firefox] [QRIS] [2] 👤 Buyer : Dewi Lesi
[qris-payment-firefox] [QRIS] [2] 📦 Item  : Paket Standar 1 Bulan
[qris-payment-firefox] [QRIS] [2] 💰 Amount: Rp 12000
[qris-payment-firefox] [QRIS] [2] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-firefox] [QRIS] [2] 🪟 Popup opened (url: about:blank)
[qris-payment-firefox] [QRIS] [2] ✅ Popup #main-content visible
[qris-payment-firefox] [QRIS] [2] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-firefox] [QRIS] [2] 🔲 QR code rendered
[qris-payment-firefox] [QRIS] [2] 🔑 Transaction ID: gyf6mnlf31if7npuppyk9abm
[qris-payment-firefox] [QRIS] [2] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-firefox] [QRIS] [2] 💳 Calling payment API — txn: gyf6mnlf31if7npuppyk9abm | amount: Rp 12000.
[qris-payment-firefox] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-firefox] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:46.070Z
[qris-payment-firefox] [QRIS-API] RRN        : ALTO-API-NMS-a2618eb73123
[qris-payment-firefox] [QRIS-API] FORWARD_RRN: d13aea227735
[qris-payment-firefox] [QRIS-API] TXN_ID     : gyf6mnlf31if7npuppyk9abm
[qris-payment-firefox] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:46.070Z","customer_reference_number":"ALTO-API-NMS-a2618eb73123","authorization_id":"FCC7B6","currency_code":"IDR","amount":12000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524gyf6mnlf31if7npuppyk9abm07034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"d13aea227735","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-firefox] [QRIS-API] SIGNATURE  : 546f3b940d5de7f969c7c8f48b0fc7a08d320162313e5ca397ced1c6eefbe5a1
[qris-payment-firefox] [QRIS-API] HTTP Status : 200
[qris-payment-firefox] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-a2618eb73123","invoice_no":"54596596805459659680","currency_code":"IDR","amount":12000,"fee":0}}
[qris-payment-firefox] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-firefox] [QRIS-API] response_code : 001
[qris-payment-firefox] [QRIS-API] response_text : Success
[qris-payment-firefox] [QRIS-API] invoice_no    : 54596596805459659680
[qris-payment-firefox] [QRIS-API] crn           : ALTO-API-NMS-a2618eb73123
[qris-payment-firefox] [QRIS] [2] ✅ Payment API success — code: 001 | text: Success | invoice: 54596596805459659680
[qris-payment-firefox] [QRIS] [2] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-firefox] [QRIS] [2] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 0.91s
[qris-payment-firefox] [QRIS] [2] 🔘 Clicking "Tutup"…
[qris-payment-firefox] [QRIS] [2] 🪟 Popup closed after 0.16s
[qris-payment-firefox] [QRIS] [2] 🏠 Main page back in focus
[qris-payment-firefox] [QRIS] [2] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-firefox] [QRIS] [2] ⏸️  Waiting 3000ms before next iteration…
[qris-payment-firefox] [QRIS] [2] ✅ Main page reloaded — ready for next iteration
[qris-payment-firefox] [QRIS] [2] ✅ Iteration 2 COMPLETE
[qris-payment-firefox] 
[QRIS] ══════════════ ITERATION 3 / 3 ══════════════
[qris-payment-firefox] [QRIS] [3] 👤 Buyer : Andi Wiwik
[qris-payment-firefox] [QRIS] [3] 📦 Item  : Paket Basic 1 Bulan
[qris-payment-firefox] [QRIS] [3] 💰 Amount: Rp 13000
[qris-payment-firefox] [QRIS] [3] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-firefox] [QRIS] [3] 🪟 Popup opened (url: about:blank)
[qris-payment-firefox] [QRIS] [3] ✅ Popup #main-content visible
[qris-payment-firefox] [QRIS] [3] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-firefox] [QRIS] [3] 🔲 QR code rendered
[qris-payment-firefox] [QRIS] [3] 🔑 Transaction ID: z4cvmkqfida1epergpyh6hry
[qris-payment-firefox] [QRIS] [3] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-firefox] [QRIS] [3] 💳 Calling payment API — txn: z4cvmkqfida1epergpyh6hry | amount: Rp 13000.
[qris-payment-firefox] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-firefox] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:57.179Z
[qris-payment-firefox] [QRIS-API] RRN        : ALTO-API-NMS-45fa7c0bf23e
[qris-payment-firefox] [QRIS-API] FORWARD_RRN: 772845417728
[qris-payment-firefox] [QRIS-API] TXN_ID     : z4cvmkqfida1epergpyh6hry
[qris-payment-firefox] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:57.179Z","customer_reference_number":"ALTO-API-NMS-45fa7c0bf23e","authorization_id":"FCC7B6","currency_code":"IDR","amount":13000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524z4cvmkqfida1epergpyh6hry07034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"772845417728","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-firefox] [QRIS-API] SIGNATURE  : c1e97a563a9e498e108ae8977ed6162c272910c7babe39c1a69fa392e94f6172
[qris-payment-firefox] [QRIS-API] HTTP Status : 200
[qris-payment-firefox] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-45fa7c0bf23e","invoice_no":"55052112965505211296","currency_code":"IDR","amount":13000,"fee":0}}
[qris-payment-firefox] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-firefox] [QRIS-API] response_code : 001
[qris-payment-firefox] [QRIS-API] response_text : Success
[qris-payment-firefox] [QRIS-API] invoice_no    : 55052112965505211296
[qris-payment-firefox] [QRIS-API] crn           : ALTO-API-NMS-45fa7c0bf23e
[qris-payment-firefox] [QRIS] [3] ✅ Payment API success — code: 001 | text: Success | invoice: 55052112965505211296
[qris-payment-firefox] [QRIS] [3] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-firefox] [QRIS] [3] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 0.41s
[qris-payment-firefox] [QRIS] [3] 🔘 Clicking "Tutup"…
[qris-payment-firefox] [QRIS] [3] 🪟 Popup closed after 0.25s
[qris-payment-firefox] [QRIS] [3] 🏠 Main page back in focus
[qris-payment-firefox] [QRIS] [3] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-firefox] [QRIS] [3] ✅ Iteration 3 COMPLETE
[qris-payment-firefox] 
[QRIS] 🏁 All 3 iterations completed successfully!
[qris-payment-edge] 
[QRIS] 🌐 Opening https://uat-manjo.mitrapembayaran.com/
[qris-payment-edge] [QRIS] ✅ Page loaded — form visible
[qris-payment-edge] 
[QRIS] ══════════════ ITERATION 1 / 3 ══════════════
[qris-payment-edge] [QRIS] [1] 👤 Buyer : Budi Sandiago
[qris-payment-edge] [QRIS] [1] 📦 Item  : Paket Premium 1 Bulan
[qris-payment-edge] [QRIS] [1] 💰 Amount: Rp 19000
[qris-payment-edge] [QRIS] [1] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-edge] [QRIS] [1] 🪟 Popup opened (url: about:blank)
[qris-payment-edge] [QRIS] [1] ✅ Popup #main-content visible
[qris-payment-edge] [QRIS] [1] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-edge] [QRIS] [1] 🔲 QR code rendered
[qris-payment-edge] [QRIS] [1] 🔑 Transaction ID: dfvyis4fvn112zar4uqkl8cl
[qris-payment-edge] [QRIS] [1] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-edge] [QRIS] [1] 💳 Calling payment API — txn: dfvyis4fvn112zar4uqkl8cl | amount: Rp 19000.
[qris-payment-edge] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-edge] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:29.887Z
[qris-payment-edge] [QRIS-API] RRN        : ALTO-API-NMS-249e8834865b
[qris-payment-edge] [QRIS-API] FORWARD_RRN: 9c9487e39760
[qris-payment-edge] [QRIS-API] TXN_ID     : dfvyis4fvn112zar4uqkl8cl
[qris-payment-edge] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:29.887Z","customer_reference_number":"ALTO-API-NMS-249e8834865b","authorization_id":"FCC7B6","currency_code":"IDR","amount":19000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524dfvyis4fvn112zar4uqkl8cl07034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"9c9487e39760","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-edge] [QRIS-API] SIGNATURE  : 443d632d3e941bae584a2a4baf1de94ad8796f64e6637049bc17f4b25cc3ad9a
[qris-payment-edge] [QRIS-API] HTTP Status : 200
[qris-payment-edge] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-249e8834865b","invoice_no":"53949756485394975648","currency_code":"IDR","amount":19000,"fee":0}}
[qris-payment-edge] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-edge] [QRIS-API] response_code : 001
[qris-payment-edge] [QRIS-API] response_text : Success
[qris-payment-edge] [QRIS-API] invoice_no    : 53949756485394975648
[qris-payment-edge] [QRIS-API] crn           : ALTO-API-NMS-249e8834865b
[qris-payment-edge] [QRIS] [1] ✅ Payment API success — code: 001 | text: Success | invoice: 53949756485394975648
[qris-payment-edge] [QRIS] [1] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-edge] [QRIS] [1] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 1.90s
[qris-payment-edge] [QRIS] [1] 🔘 Clicking "Tutup"…
[qris-payment-edge] [QRIS] [1] 🪟 Popup closed after 0.07s
[qris-payment-edge] [QRIS] [1] 🏠 Main page back in focus
[qris-payment-edge] [QRIS] [1] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-edge] [QRIS] [1] ⏸️  Waiting 3000ms before next iteration…
[qris-payment-edge] [QRIS] [1] ✅ Main page reloaded — ready for next iteration
[qris-payment-edge] [QRIS] [1] ✅ Iteration 1 COMPLETE
[qris-payment-edge] 
[QRIS] ══════════════ ITERATION 2 / 3 ══════════════
[qris-payment-edge] [QRIS] [2] 👤 Buyer : Dewi Lesi
[qris-payment-edge] [QRIS] [2] 📦 Item  : Paket Standar 1 Bulan
[qris-payment-edge] [QRIS] [2] 💰 Amount: Rp 12000
[qris-payment-edge] [QRIS] [2] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-edge] [QRIS] [2] 🪟 Popup opened (url: about:blank)
[qris-payment-edge] [QRIS] [2] ✅ Popup #main-content visible
[qris-payment-edge] [QRIS] [2] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-edge] [QRIS] [2] 🔲 QR code rendered
[qris-payment-edge] [QRIS] [2] 🔑 Transaction ID: uz6qomdfk15q9u4dkz847n3z
[qris-payment-edge] [QRIS] [2] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-edge] [QRIS] [2] 💳 Calling payment API — txn: uz6qomdfk15q9u4dkz847n3z | amount: Rp 12000.
[qris-payment-edge] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-edge] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:41.977Z
[qris-payment-edge] [QRIS-API] RRN        : ALTO-API-NMS-b30ef1dafffd
[qris-payment-edge] [QRIS-API] FORWARD_RRN: 9a97ba682a8c
[qris-payment-edge] [QRIS-API] TXN_ID     : uz6qomdfk15q9u4dkz847n3z
[qris-payment-edge] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:41.977Z","customer_reference_number":"ALTO-API-NMS-b30ef1dafffd","authorization_id":"FCC7B6","currency_code":"IDR","amount":12000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524uz6qomdfk15q9u4dkz847n3z07034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"9a97ba682a8c","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-edge] [QRIS-API] SIGNATURE  : 97d20a6469fbaa2561c7df40a86bfa58428e8c6fecf860de700ab66ac612ec0d
[qris-payment-edge] [QRIS-API] HTTP Status : 200
[qris-payment-edge] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-b30ef1dafffd","invoice_no":"54429480005442948000","currency_code":"IDR","amount":12000,"fee":0}}
[qris-payment-edge] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-edge] [QRIS-API] response_code : 001
[qris-payment-edge] [QRIS-API] response_text : Success
[qris-payment-edge] [QRIS-API] invoice_no    : 54429480005442948000
[qris-payment-edge] [QRIS-API] crn           : ALTO-API-NMS-b30ef1dafffd
[qris-payment-edge] [QRIS] [2] ✅ Payment API success — code: 001 | text: Success | invoice: 54429480005442948000
[qris-payment-edge] [QRIS] [2] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-edge] [QRIS] [2] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 0.90s
[qris-payment-edge] [QRIS] [2] 🔘 Clicking "Tutup"…
[qris-payment-edge] [QRIS] [2] 🪟 Popup closed after 0.07s
[qris-payment-edge] [QRIS] [2] 🏠 Main page back in focus
[qris-payment-edge] [QRIS] [2] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-edge] [QRIS] [2] ⏸️  Waiting 3000ms before next iteration…
[qris-payment-edge] [QRIS] [2] ✅ Main page reloaded — ready for next iteration
[qris-payment-edge] [QRIS] [2] ✅ Iteration 2 COMPLETE
[qris-payment-edge] 
[QRIS] ══════════════ ITERATION 3 / 3 ══════════════
[qris-payment-edge] [QRIS] [3] 👤 Buyer : Andi Wiwik
[qris-payment-edge] [QRIS] [3] 📦 Item  : Paket Basic 1 Bulan
[qris-payment-edge] [QRIS] [3] 💰 Amount: Rp 13000
[qris-payment-edge] [QRIS] [3] 📝 Filling form and clicking "Buat Order & Bayar →"…
[qris-payment-edge] [QRIS] [3] 🪟 Popup opened (url: about:blank)
[qris-payment-edge] [QRIS] [3] ✅ Popup #main-content visible
[qris-payment-edge] [QRIS] [3] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.
[qris-payment-edge] [QRIS] [3] 🔲 QR code rendered
[qris-payment-edge] [QRIS] [3] 🔑 Transaction ID: cuouujs2tzuzs51pyog6iqdr
[qris-payment-edge] [QRIS] [3] ⏸️  Waiting 3 seconds before making the payment API call.
[qris-payment-edge] [QRIS] [3] 💳 Calling payment API — txn: cuouujs2tzuzs51pyog6iqdr | amount: Rp 13000.
[qris-payment-edge] [QRIS-API] === REQUEST DEBUG ===
[qris-payment-edge] [QRIS-API] TIMESTAMP  : 2026-06-02 06:54:52.779Z
[qris-payment-edge] [QRIS-API] RRN        : ALTO-API-NMS-b5224cd89e5c
[qris-payment-edge] [QRIS-API] FORWARD_RRN: 31dc85321ac6
[qris-payment-edge] [QRIS-API] TXN_ID     : cuouujs2tzuzs51pyog6iqdr
[qris-payment-edge] [QRIS-API] COMPACT    : {"command":"qr-payment-credit","data":{"date_time":"2026-06-02 06:54:52.779Z","customer_reference_number":"ALTO-API-NMS-b5224cd89e5c","authorization_id":"FCC7B6","currency_code":"IDR","amount":13000,"fee":0,"issuer_nns":"93600821","acquirer_nns":"93600858","national_mid":"MT60169117","additional_data":"0524cuouujs2tzuzs51pyog6iqdr07034270817Auto Loan Account","terminal_label":"427","forwarding_customer_reference_number":"31dc85321ac6","merchant":{"pan":"9360085801764127112","id":"MT60169117","criteria":"UKE","name":"Ayoborong","city":"JAKARTA PUSAT","mcc":"5251","postal_code":"10110","country_code":"ID"},"customer":{"pan":"9360085801764127112","name":"Tes","account_type":"UNSPECIFIED"}}}
[qris-payment-edge] [QRIS-API] SIGNATURE  : e6c6894c52f8fb59f2962aaeb3c8fddeb2d4837e8b902728794812265195f895
[qris-payment-edge] [QRIS-API] HTTP Status : 200
[qris-payment-edge] [QRIS-API] Response    : {"command":"qr-payment-credit","response_code":"001","response_text":"Success","data":{"customer_reference_number":"ALTO-API-NMS-b5224cd89e5c","invoice_no":"54868653125486865312","currency_code":"IDR","amount":13000,"fee":0}}
[qris-payment-edge] [QRIS-API] ✅ Payment SUCCESS
[qris-payment-edge] [QRIS-API] response_code : 001
[qris-payment-edge] [QRIS-API] response_text : Success
[qris-payment-edge] [QRIS-API] invoice_no    : 54868653125486865312
[qris-payment-edge] [QRIS-API] crn           : ALTO-API-NMS-b5224cd89e5c
[qris-payment-edge] [QRIS] [3] ✅ Payment API success — code: 001 | text: Success | invoice: 54868653125486865312
[qris-payment-edge] [QRIS] [3] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…
[qris-payment-edge] [QRIS] [3] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in 0.87s
[qris-payment-edge] [QRIS] [3] 🔘 Clicking "Tutup"…
[qris-payment-edge] [QRIS] [3] 🪟 Popup closed after 0.15s
[qris-payment-edge] [QRIS] [3] 🏠 Main page back in focus
[qris-payment-edge] [QRIS] [3] ✅ Back on main page — <h1>QRIS Payment</h1> visible
[qris-payment-edge] [QRIS] [3] ✅ Iteration 3 COMPLETE
[qris-payment-edge] 
[QRIS] 🏁 All 3 iterations completed successfully!
```

---

*Report ini di-generate otomatis oleh `scripts/save-results.js` pada 16/06/2026 20:13:05 WIB.*
