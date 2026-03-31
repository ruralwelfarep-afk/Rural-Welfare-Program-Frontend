# 🌿 Rural Welfare Program — Frontend

React + Vite application. Form submission, payment, PDF download sab yahan se hota hai.

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── ApplyFormPage.jsx        ← Main form (3 steps)
│   └── SuccessPage.jsx          ← Submission success + PDF download
├── components/
│   └── ...
public/
├── qr-code.jpeg                 ← UPI QR code (apna daalo)
.env                             ← Environment variables (neeche dekho)
```

---

## ⚙️ Environment Variables — `.env`

```dotenv
VITE_BACKEND_URL=https://rural-welfare-program-backend.vercel.app
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

| Variable | Kya hai | Kahan se milega |
|---|---|---|
| `VITE_BACKEND_URL` | Backend Vercel URL | Backend deploy karne ke baad |
| `VITE_APPS_SCRIPT_URL` | Google Apps Script URL | `Code.gs` deploy karne ke baad |

> ⚠️ Har variable ke aage `VITE_` prefix **zaroori** hai — bina iske React read nahi karega

---

## 🔄 ApplyFormPage.jsx — Kaise kaam karta hai

### 3 Steps:

```
Step 0 — Personal Details
  └─ Name, DOB, Aadhar, Education, Contact info

Step 1 — Documents Upload
  └─ Photo, Signature, Aadhar doc, Marksheets
  └─ Declaration checkbox

Step 2 — Payment
  └─ UPI ya Bank Transfer select karo
  └─ Payment karo → UTR/Transaction ID daalo
  └─ Screenshot upload karo
  └─ Submit karo
```

### Submit button press hone par kya hota hai:

```
1. validateStep2()          ← Fields check karo
        ↓
2. checkDuplicateUTR()      ← Apps Script se UTR duplicate check
   GET: VITE_APPS_SCRIPT_URL?action=checkUTR&utr=XXX
        ↓
3. Files → base64 convert   ← FileReader se har file base64 mein
        ↓
4. submitToSheet()          ← Apps Script ko basic data bhejo (non-blocking)
   POST: VITE_APPS_SCRIPT_URL
        ↓
5. fetch(VITE_BACKEND_URL/api/verify-payment)
   ← Poora data + base64 files backend ko bhejo
        ↓
6. navigate('/success')     ← pdfBase64 + registrationNo saath mein
```

### PAYMENT_CONFIG (file ke top mein):
```js
// ApplyFormPage.jsx line ~10
const PAYMENT_CONFIG = {
  upiId:         'pranshushrivastav907-1@okaxis',
  qrCodeUrl:     '/qr-code.jpeg',       // ← public/ folder mein rakho
  bankName:      'Punjab National Bank',
  accountName:   'Pranshu Shrivastav',
  accountNumber: '1887010007899',
  ifscCode:      'PUNB0188720',
  branch:        'Ranganj Bazar, Pratapgarh',
}
```
> Apna payment info yahan update karo

---

## 📦 Install & Run

```bash
npm install
npm run dev          # localhost:5173
npm run build        # production build
```

---

## 🚀 Vercel Deploy

1. GitHub pe push karo
2. Vercel → New Project → Repo select karo
3. **Environment Variables** mein dono `VITE_` variables daalo
4. Deploy ✅

---

## 🔗 Frontend → Backend Flow

```
ApplyFormPage.jsx
      │
      │  POST /api/verify-payment
      │  Body: {
      │    registrationNo,
      │    paymentId,
      │    formData: { name, dob, aadhar, ... },
      │    paymentInfo: { paymentMethod, utrNumber, ... },
      │    uploadedFiles: { photo: {base64, mimetype}, ... }
      │  }
      │
      ▼
Backend (verify-payment.js)
      │
      ├─ PDF generate karo
      ├─ Apps Script ko bhejo (sheet + Drive)
      ├─ Email bhejo (Resend)
      │
      ▼
Response: { pdfBase64, driveLink, registrationNo }
      │
      ▼
SuccessPage.jsx — PDF download button
```

---

## ❗ Common Issues

| Problem | Solution |
|---|---|
| `VITE_BACKEND_URL` undefined | `.env` mein `VITE_` prefix lagao |
| QR code nahi dikh raha | `public/qr-code.jpeg` rakho |
| UTR duplicate check fail | `VITE_APPS_SCRIPT_URL` check karo |
| CORS error | Backend `.env` mein `ALLOWED_ORIGIN` sahi daalo |