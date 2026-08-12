require('dotenv').config();
const express = require('express');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');
const UPLOAD_ROOT = path.join(__dirname, 'uploads');
const ABSTRACT_DIR = path.join(UPLOAD_ROOT, 'abstracts');
const FULL_PAPER_DIR = path.join(UPLOAD_ROOT, 'full-papers');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "IConfst'26!";
const adminSessions = new Map();

for (const dir of [DATA_DIR, UPLOAD_ROOT, ABSTRACT_DIR, FULL_PAPER_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]\n');
}

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'abstractFile') {
      cb(null, ABSTRACT_DIR);
      return;
    }

    if (file.fieldname === 'fullPaperFile') {
      cb(null, FULL_PAPER_DIR);
      return;
    }

    cb(new Error('Unsupported file field'));
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(__dirname));

const readSubmissions = async () => {
  const raw = await fsp.readFile(DATA_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSubmissions = async (submissions) => {
  await fsp.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
};

const getAdminToken = (req) => {
  const bearer = req.headers.authorization;
  if (bearer && bearer.startsWith('Bearer ')) {
    return bearer.slice(7).trim();
  }

  const headerToken = req.headers['x-admin-token'];
  if (typeof headerToken === 'string' && headerToken.trim()) {
    return headerToken.trim();
  }

  return '';
};

const requireAdmin = (req, res, next) => {
  const token = getAdminToken(req);
  const session = adminSessions.get(token);
  if (!token || !session) {
    res.status(401).json({ ok: false, message: 'Admin authentication required.' });
    return;
  }

  req.adminSession = session;
  next();
};

const generateSubmissionId = (submissions) => {
  const year = new Date().getFullYear();
  const prefix = `ICONFST26-${year}-`;
  const thisYearCount = submissions.filter((item) => typeof item.abstractId === 'string' && item.abstractId.startsWith(prefix)).length;
  const sequence = String(thisYearCount + 1).padStart(4, '0');
  return `${prefix}${sequence}`;
};

const buildPlaceholderReview = (paperTitle, hasFullPaper) => {
  if (!hasFullPaper) {
    return {
      strengths: ['Clear conference relevance in abstract focus.'],
      weaknesses: ['Full paper not yet submitted for detailed technical review.'],
      improvements: ['Upload full paper to enable detailed method and result-level review.']
    };
  }

  return {
    strengths: [
      `The paper topic "${paperTitle}" aligns well with ICONFST'26 theme.`,
      'Problem context appears practical and industry-relevant.',
      'Submission structure indicates potential for publishable quality.'
    ],
    weaknesses: [
      'Methodology detail may need clearer step-by-step reproducibility notes.',
      'Literature positioning may require stronger contrast with latest studies.',
      'Result discussion may need more quantitative interpretation.'
    ],
    improvements: [
      'Add clearer methodology workflow diagram and parameter descriptions.',
      'Expand comparative analysis with at least 3 recent related works.',
      'Include limitations and future-work section for stronger scholarly framing.'
    ]
  };
};

const buildTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

const sendSubmissionEmails = async ({ authorEmail, authorName, abstractId, paperTitle, review }) => {
  const transporter = buildTransporter();
  if (!transporter) {
    return { autoResponseSent: false, reviewEmailSent: false, reason: 'SMTP_NOT_CONFIGURED' };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const autoSubject = process.env.AUTO_RESPONSE_SUBJECT || "ICONFST'26 Abstract Submission Confirmation";
  const autoMessage = process.env.AUTO_RESPONSE_MESSAGE
    || `Dear ${authorName}, your abstract has been received. Your tracking ID is ${abstractId}.`;
  const reviewSubject = process.env.REVIEW_SUBJECT || "ICONFST'26 Paper Review Feedback";

  const reviewText = [
    `Dear ${authorName},`,
    '',
    `Your submission (${abstractId}) for "${paperTitle}" has completed an initial automated review placeholder workflow.`,
    '',
    'Strengths:',
    ...review.strengths.map((item) => `- ${item}`),
    '',
    'Weaknesses:',
    ...review.weaknesses.map((item) => `- ${item}`),
    '',
    'Suggested Points for Improvement:',
    ...review.improvements.map((item) => `- ${item}`),
    '',
    "Regards,",
    "ICONFST'26 Conference Team"
  ].join('\n');

  let autoResponseSent = false;
  let reviewEmailSent = false;

  await transporter.sendMail({
    from,
    to: authorEmail,
    subject: autoSubject,
    text: `${autoMessage}\n\nTracking ID: ${abstractId}`
  });
  autoResponseSent = true;

  await transporter.sendMail({
    from,
    to: authorEmail,
    subject: reviewSubject,
    text: reviewText
  });
  reviewEmailSent = true;

  return { autoResponseSent, reviewEmailSent, reason: null };
};

const buildCertificateHtml = (submission) => {
  const certificateTitle = `${submission.authorName} - ${submission.paperTitle}`;
  const issued = new Date().toLocaleDateString();
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>ICONFST'26 Certificate - ${submission.abstractId}</title>
    <style>
      body{font-family:Georgia,serif;background:#f4efe7;margin:0;padding:24px;color:#12203f}
      .wrap{max-width:960px;margin:0 auto;background:#fff;border:12px solid #0f2f67;border-radius:16px;padding:32px;box-shadow:0 14px 28px rgba(0,0,0,.16)}
      .head{text-align:center;border-bottom:2px solid #d6b469;padding-bottom:12px;margin-bottom:20px}
      .head h1{margin:8px 0;font-size:42px;letter-spacing:.06em;color:#0f2f67}
      .title{font-size:34px;color:#0f2f67;font-weight:700;text-align:center;margin:12px 0}
      .line{font-size:26px;text-align:center;color:#7a1f1f;font-weight:700;margin:10px 0}
      .text{text-align:center;font-size:19px;line-height:1.6;margin:20px 0}
      .meta{display:flex;justify-content:space-between;margin-top:28px;font-size:15px;color:#293b63}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="head">
        <div>SCHOOL OF SCIENCE AND TECHNOLOGY · Gateway (ICT) Polytechnic, Saapade</div>
        <h1>CERTIFICATE</h1>
        <div>OF PARTICIPATION — ICONFST'26</div>
      </div>
      <p class="text">This certificate is proudly presented to</p>
      <div class="line">${certificateTitle}</div>
      <p class="text">for successful participation in International Conference on Science and Technology (ICONFST'26).</p>
      <div class="meta">
        <div>Abstract ID: ${submission.abstractId}</div>
        <div>Date Issued: ${issued}</div>
      </div>
    </div>
  </body>
  </html>`;
};

const sendCertificateEmail = async (submission) => {
  const transporter = buildTransporter();
  if (!transporter) {
    return { sent: false, reason: 'SMTP_NOT_CONFIGURED' };
  }

  const html = buildCertificateHtml(submission);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: submission.authorEmail,
    subject: `ICONFST'26 Certificate - ${submission.abstractId}`,
    html,
    attachments: [
      {
        filename: `${submission.abstractId}-certificate.html`,
        content: html,
        contentType: 'text/html'
      }
    ]
  });

  return { sent: true, reason: null };
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: "ICONFST'26", timestamp: new Date().toISOString() });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ ok: false, message: 'Invalid admin credentials.' });
    return;
  }

  const token = crypto.randomBytes(24).toString('hex');
  adminSessions.set(token, { username, issuedAt: new Date().toISOString() });
  res.json({ ok: true, token });
});

app.get('/api/admin/submissions', requireAdmin, async (_req, res) => {
  try {
    const submissions = await readSubmissions();
    const sorted = submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ ok: true, submissions: sorted });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to read submissions.', error: error.message });
  }
});

app.post('/api/admin/submissions', requireAdmin, async (req, res) => {
  try {
    const { authorName, authorEmail, affiliation, paperTitle } = req.body || {};
    if (!authorName || !authorEmail || !paperTitle) {
      res.status(400).json({ ok: false, message: 'authorName, authorEmail, and paperTitle are required.' });
      return;
    }

    const submissions = await readSubmissions();
    const abstractId = generateSubmissionId(submissions);
    const record = {
      abstractId,
      authorName: String(authorName).trim(),
      authorEmail: String(authorEmail).trim(),
      affiliation: String(affiliation || '').trim(),
      paperTitle: String(paperTitle).trim(),
      submissionType: 'Admin Registered',
      status: 'Admin Registered',
      reviewStatus: 'Pending Automated Review',
      submittedAt: new Date().toISOString(),
      files: {
        abstract: null,
        fullPaper: null
      },
      review: buildPlaceholderReview(String(paperTitle).trim(), false),
      paymentVerified: false,
      paymentVerifiedAt: null,
      certificateEligible: false,
      certificateEmailSent: false,
      certificateIssuedAt: null,
      certificateEmailReason: null,
      notifications: {
        autoResponseSent: false,
        reviewEmailSent: false,
        reason: 'ADMIN_CREATED'
      }
    };

    submissions.push(record);
    await writeSubmissions(submissions);
    res.status(201).json({ ok: true, message: 'User registered successfully by admin.', submission: record });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to register user.', error: error.message });
  }
});

app.put('/api/admin/submissions/:abstractId', requireAdmin, async (req, res) => {
  try {
    const submissions = await readSubmissions();
    const target = submissions.find((item) => item.abstractId === req.params.abstractId);
    if (!target) {
      res.status(404).json({ ok: false, message: 'Submission not found.' });
      return;
    }

    const payload = req.body || {};
    if (typeof payload.authorName === 'string') target.authorName = payload.authorName.trim();
    if (typeof payload.authorEmail === 'string') target.authorEmail = payload.authorEmail.trim();
    if (typeof payload.affiliation === 'string') target.affiliation = payload.affiliation.trim();
    if (typeof payload.paperTitle === 'string') target.paperTitle = payload.paperTitle.trim();
    if (typeof payload.status === 'string') target.status = payload.status.trim();

    if (typeof payload.paymentVerified === 'boolean') {
      target.paymentVerified = payload.paymentVerified;
      target.paymentVerifiedAt = payload.paymentVerified ? (target.paymentVerifiedAt || new Date().toISOString()) : null;
      target.certificateEligible = payload.paymentVerified;
      if (!payload.paymentVerified) {
        target.certificateEmailSent = false;
        target.certificateIssuedAt = null;
      }
    }

    await writeSubmissions(submissions);
    res.json({ ok: true, message: 'User updated successfully.', submission: target });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to update user.', error: error.message });
  }
});

app.delete('/api/admin/submissions/:abstractId', requireAdmin, async (req, res) => {
  try {
    const submissions = await readSubmissions();
    const index = submissions.findIndex((item) => item.abstractId === req.params.abstractId);
    if (index < 0) {
      res.status(404).json({ ok: false, message: 'Submission not found.' });
      return;
    }

    const [removed] = submissions.splice(index, 1);
    await writeSubmissions(submissions);
    res.json({ ok: true, message: 'User removed successfully.', submission: removed });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to remove user.', error: error.message });
  }
});

app.get('/api/submissions', async (_req, res) => {
  try {
    const submissions = await readSubmissions();
    const sorted = submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ ok: true, count: sorted.length, submissions: sorted });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to read submissions.', error: error.message });
  }
});

app.post('/api/submissions', upload.fields([
  { name: 'abstractFile', maxCount: 1 },
  { name: 'fullPaperFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { authorName, authorEmail, affiliation, paperTitle } = req.body;
    const abstractFile = req.files?.abstractFile?.[0] || null;
    const fullPaperFile = req.files?.fullPaperFile?.[0] || null;

    if (!authorName || !authorEmail || !paperTitle || (!abstractFile && !fullPaperFile)) {
      res.status(400).json({
        ok: false,
        message: 'authorName, authorEmail, paperTitle, and at least one file (abstractFile or fullPaperFile) are required.'
      });
      return;
    }

    const submissions = await readSubmissions();
    const abstractId = generateSubmissionId(submissions);
    const submissionType = abstractFile && fullPaperFile
      ? 'Abstract and Full Paper'
      : abstractFile
        ? 'Abstract Only'
        : 'Full Paper Only';

    const review = buildPlaceholderReview(paperTitle, Boolean(fullPaperFile));

    const record = {
      abstractId,
      authorName,
      authorEmail,
      affiliation: affiliation || '',
      paperTitle,
      submissionType,
      status: submissionType,
      reviewStatus: 'Pending Automated Review',
      submittedAt: new Date().toISOString(),
      files: {
        abstract: abstractFile
          ? {
              originalName: abstractFile.originalname,
              path: `/uploads/abstracts/${abstractFile.filename}`
            }
          : null,
        fullPaper: fullPaperFile
          ? {
              originalName: fullPaperFile.originalname,
              path: `/uploads/full-papers/${fullPaperFile.filename}`
            }
          : null
      },
      review,
      paymentVerified: false,
      paymentVerifiedAt: null,
      certificateEligible: false,
      certificateEmailSent: false,
      certificateIssuedAt: null,
      certificateEmailReason: null,
      notifications: {
        autoResponseSent: false,
        reviewEmailSent: false,
        reason: null
      }
    };

    try {
      const emailResult = await sendSubmissionEmails({
        authorEmail,
        authorName,
        abstractId,
        paperTitle,
        review
      });
      record.notifications = emailResult;
    } catch (mailError) {
      record.notifications = {
        autoResponseSent: false,
        reviewEmailSent: false,
        reason: mailError.message
      };
    }

    submissions.push(record);
    await writeSubmissions(submissions);

    res.status(201).json({
      ok: true,
      message: 'Submission received successfully.',
      abstractId,
      submission: record
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Submission failed.',
      error: error.message
    });
  }
});

app.post('/api/admin/submissions/:abstractId/confirm-payment', requireAdmin, async (req, res) => {
  try {
    const submissions = await readSubmissions();
    const target = submissions.find((item) => item.abstractId === req.params.abstractId);
    if (!target) {
      res.status(404).json({ ok: false, message: 'Submission not found.' });
      return;
    }

    target.paymentVerified = true;
    target.paymentVerifiedAt = target.paymentVerifiedAt || new Date().toISOString();
    target.certificateEligible = true;
    if (!target.certificateEmailSent) {
      target.status = 'Payment Verified';
    }
    await writeSubmissions(submissions);

    res.json({ ok: true, message: 'Payment confirmed successfully. Certificate is now eligible for issuance.', submission: target });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to confirm payment.', error: error.message });
  }
});

app.post('/api/admin/submissions/:abstractId/email-certificate', requireAdmin, async (req, res) => {
  try {
    const submissions = await readSubmissions();
    const target = submissions.find((item) => item.abstractId === req.params.abstractId);
    if (!target) {
      res.status(404).json({ ok: false, message: 'Submission not found.' });
      return;
    }

    if (!target.paymentVerified || !target.certificateEligible) {
      res.status(400).json({ ok: false, message: 'Payment must be confirmed by admin before certificate issuance.' });
      return;
    }

    if (target.certificateEmailSent) {
      res.status(409).json({
        ok: false,
        message: `Certificate has already been emailed${target.certificateIssuedAt ? ` on ${new Date(target.certificateIssuedAt).toLocaleString()}` : ''}.`
      });
      return;
    }

    const sent = await sendCertificateEmail(target);
    target.certificateEmailSent = sent.sent;
    target.certificateIssuedAt = sent.sent ? new Date().toISOString() : null;
    target.status = sent.sent ? 'Certificate Emailed' : 'Payment Verified';
    target.certificateEmailReason = sent.reason;
    await writeSubmissions(submissions);

    res.json({ ok: true, message: sent.sent ? 'Certificate emailed to author.' : `Certificate not sent: ${sent.reason}`, submission: target });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to email certificate.', error: error.message });
  }
});

app.post('/api/admin/certificates/email-all', requireAdmin, async (_req, res) => {
  try {
    const submissions = await readSubmissions();
    const eligible = submissions.filter((item) => item.paymentVerified && item.certificateEligible && !item.certificateEmailSent);
    let sentCount = 0;

    for (const item of eligible) {
      const result = await sendCertificateEmail(item);
      item.certificateEmailSent = result.sent;
      item.certificateIssuedAt = result.sent ? new Date().toISOString() : null;
      item.certificateEmailReason = result.reason;
      if (result.sent) {
        item.status = 'Certificate Emailed';
        sentCount += 1;
      }
    }

    await writeSubmissions(submissions);
    res.json({ ok: true, message: `Certificate email process completed. Sent ${sentCount} certificates.`, sentCount, totalEligible: eligible.length });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to email certificates.', error: error.message });
  }
});

app.get('/api/certificate-status', async (req, res) => {
  try {
    const { email, abstractId } = req.query;
    if (!email || !abstractId) {
      res.status(400).json({ ok: false, message: 'email and abstractId are required.' });
      return;
    }

    const submissions = await readSubmissions();
    const target = submissions.find((item) => item.authorEmail.toLowerCase() === String(email).toLowerCase() && item.abstractId === abstractId);
    if (!target) {
      res.status(404).json({ ok: false, message: 'No certificate record found for this email/ID.' });
      return;
    }

    const pendingDispatchMessage = target.certificateEmailReason
      ? `Payment has been verified. Certificate dispatch is pending (${target.certificateEmailReason}).`
      : 'Payment has been verified. Certificate email is pending admin dispatch.';

    res.json({
      ok: true,
      abstractId: target.abstractId,
      authorName: target.authorName,
      paperTitle: target.paperTitle,
      paymentVerified: Boolean(target.paymentVerified),
      certificateEligible: Boolean(target.certificateEligible),
      certificateEmailSent: Boolean(target.certificateEmailSent),
      certificateIssuedAt: target.certificateIssuedAt,
      message: target.certificateEmailSent
        ? 'Certificate has been emailed to your registered email address.'
        : target.paymentVerified
          ? pendingDispatchMessage
          : 'Payment verification pending. Certificate cannot be issued yet.'
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to check certificate status.', error: error.message });
  }
});

app.post('/api/submissions/:abstractId/full-paper', upload.single('fullPaperFile'), async (req, res) => {
  try {
    const { abstractId } = req.params;
    const { authorEmail, authorName } = req.body;
    const fullPaperFile = req.file;

    if (!fullPaperFile) {
      res.status(400).json({ ok: false, message: 'fullPaperFile is required.' });
      return;
    }

    const submissions = await readSubmissions();
    const target = submissions.find((item) => item.abstractId === abstractId);

    if (!target) {
      res.status(404).json({ ok: false, message: 'Submission not found.' });
      return;
    }

    target.files = target.files || { abstract: null, fullPaper: null };
    target.files.fullPaper = {
      originalName: fullPaperFile.originalname,
      path: `/uploads/full-papers/${fullPaperFile.filename}`
    };
    const hasAbstract = Boolean(target.files?.abstract);
    target.submissionType = hasAbstract ? 'Abstract and Full Paper' : 'Full Paper Only';
    target.status = 'Full Paper Submitted';
    target.reviewStatus = 'Automated Review Completed';
    target.review = buildPlaceholderReview(target.paperTitle, true);

    try {
      const emailResult = await sendSubmissionEmails({
        authorEmail: authorEmail || target.authorEmail,
        authorName: authorName || target.authorName,
        abstractId,
        paperTitle: target.paperTitle,
        review: target.review
      });
      target.notifications = emailResult;
    } catch (mailError) {
      target.notifications = {
        autoResponseSent: false,
        reviewEmailSent: false,
        reason: mailError.message
      };
    }

    await writeSubmissions(submissions);

    res.json({ ok: true, message: 'Full paper uploaded and reviewed.', submission: target });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to upload full paper.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`ICONFST'26 server running on http://localhost:${PORT}`);
});
