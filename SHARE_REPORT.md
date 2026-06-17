# 📤 Cara Share Report ke Orang Lain

Report Playwright **tidak bisa dibuka langsung via double-click** (`file://`) karena butuh HTTP server.
Berikut semua cara untuk berbagi dengan orang lain.

---

## 🥇 Opsi 1 — Netlify Drop (Paling Mudah, Link Publik)

> Gratis, tidak perlu daftar, langsung dapat URL yang bisa dibuka siapa saja.

### Langkah-langkah

1. **Buka** → https://app.netlify.com/drop di browser
2. **Cari folder** report yang ingin dibagikan di File Explorer:
   ```
   results\reports\run_YYYYMMDD_HHmmss\html\
   ```
3. **Drag & drop** folder `html/` ke halaman Netlify Drop
4. Tunggu beberapa detik → kamu akan dapat **URL publik** seperti:
   ```
   https://tender-mendel-123456.netlify.app
   ```
5. **Bagikan URL** tersebut ke siapa saja — bisa dibuka tanpa login

> ⚠️ URL aktif selama **24 jam** (gratis tanpa akun).
> Kalau mau permanen, daftar akun Netlify gratis → klik "Claim your site".

---

## 🥈 Opsi 2 — LAN/WiFi (Tanpa Internet, Real-time)

> Cocok untuk demo langsung ke tim yang ada di jaringan yang sama (WiFi/kantor).

```powershell
# Di terminal project:
npm run serve-report
```

Output akan tampil seperti ini:
```
══════════════════════════════════════════════════════════
  🌐  PLAYWRIGHT REPORT SERVER — AKTIF
══════════════════════════════════════════════════════════
  🖥️  Lokal      : http://localhost:9323
  📡 LAN/WiFi   : http://192.168.1.10:9323
══════════════════════════════════════════════════════════
```

- **Kamu sendiri** → buka `http://localhost:9323`
- **Orang lain (WiFi sama)** → buka `http://192.168.1.10:9323`

> ℹ️ Server aktif selama terminal tidak ditutup / Ctrl+C ditekan.

---

## 🥉 Opsi 3 — Kirim File .md (Langsung via Chat/Email)

> File `.md` sudah berisi semua informasi: metrik, hasil per browser, dan terminal logs.

**Lokasi file:**
```
results\reports\run_YYYYMMDD_HHmmss\report.md
```

File ini bisa dibuka di:
- **GitHub** → render otomatis sebagai halaman cantik
- **VS Code** → Ctrl+Shift+V untuk preview
- **Notion / Confluence** → paste isinya langsung
- **Email / WhatsApp** → lampirkan file `.md`

---

## 🔄 Workflow Rekomendasi

```
Setelah run test:
  1. npm run test:save          → arsipkan result + buat report.md
  2. Pilih cara share:
     a. Netlify Drop             → untuk link publik (external stakeholder)
     b. npm run serve-report     → untuk demo live ke tim
     c. Kirim report.md          → untuk rangkuman cepat via chat/email
```

---

## 📁 Lokasi Folder yang Perlu Diketahui

| File/Folder | Isi | Cara Buka |
|-------------|-----|-----------|
| `results/reports/run_.../html/` | HTML report interaktif | Netlify Drop / `serve-report` |
| `results/reports/run_.../report.md` | Ringkasan + terminal logs | VS Code / GitHub / email |
| `results/reports/run_.../test-results.json` | Raw data JSON | Dev tools / script |
| `results/screenshots/run_.../` | Screenshot per browser | File Explorer / lampiran |
| `metrics/metrics-history.json` | Akumulasi semua run | `npm run metrics:history` |
