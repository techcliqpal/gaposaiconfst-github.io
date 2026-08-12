# Backend Setup (Registration, Tracking, Auto-Response)

## 1) Install dependencies

```powershell
npm install
```

## 2) Configure environment variables

Copy `.env.example` to `.env` and set values:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER` (conference email)
- `SMTP_PASS` (conference email app password)
- `SMTP_FROM`
- `AUTO_RESPONSE_MESSAGE` (paste the saved auto-response text from mail task manager)

## 3) Run the server

```powershell
npm start
```

Open: `http://localhost:3000/registration.html`

## Notes

- Abstract IDs are generated as: `ICONFST26-YYYY-####`.
- Uploads are stored in `uploads/abstracts` and `uploads/full-papers`.
- Submission records are stored in `data/submissions.json`.
- AI review is placeholder workflow (strengths, weaknesses, improvements) and emailed to author when SMTP is configured.
