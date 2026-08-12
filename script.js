(() => {
  const ADMIN_TOKEN_KEY = 'iconfst_admin_token';
  const SUBMISSIONS_KEY = 'iconfst_submissions';
  const LOCAL_ADMIN_USERNAME = 'Admin';
  const LOCAL_ADMIN_PASSWORD = "IConfst'26!";

  const getLocalSubmissions = () => {
    try {
      const raw = localStorage.getItem(SUBMISSIONS_KEY);
      const items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items : [];
    } catch (_) {
      return [];
    }
  };

  const setLocalSubmissions = (items) => {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(items));
  };

  const createLocalAbstractId = (items) => {
    const year = new Date().getFullYear();
    const maxSerial = items.reduce((max, item) => {
      const match = String(item.abstractId || '').match(/-(\d{4})$/);
      const serial = match ? Number(match[1]) : 0;
      return Number.isFinite(serial) ? Math.max(max, serial) : max;
    }, 0);
    const next = String(maxSerial + 1).padStart(4, '0');
    return `ICONFST26-${year}-${next}`;
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const attachSubmissionForm = () => {
    const form = document.getElementById('submission-form');
    const status = document.getElementById('submission-status');
    if (!form || !status) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = 'Submitting...';

      const payload = new FormData(form);
      const abstractFile = payload.get('abstractFile');
      const fullPaperFile = payload.get('fullPaperFile');
      const hasAbstract = abstractFile instanceof File && abstractFile.size > 0;
      const hasFullPaper = fullPaperFile instanceof File && fullPaperFile.size > 0;

      if (!hasAbstract && !hasFullPaper) {
        status.textContent = 'Please upload at least one file: Abstract, Full Paper, or both.';
        return;
      }

      const submitLocally = (payload) => {
        const items = getLocalSubmissions();
        const abstractFile = payload.get('abstractFile');
        const fullPaperFile = payload.get('fullPaperFile');
        const hasAbstract = abstractFile instanceof File && abstractFile.size > 0;
        const hasFullPaper = fullPaperFile instanceof File && fullPaperFile.size > 0;
        const submissionType = hasAbstract && hasFullPaper
          ? 'Abstract and Full Paper'
          : hasAbstract
            ? 'Abstract Only'
            : 'Full Paper Only';
        const record = {
          abstractId: createLocalAbstractId(items),
          authorName: String(payload.get('authorName') || '').trim(),
          authorEmail: String(payload.get('authorEmail') || '').trim(),
          affiliation: String(payload.get('affiliation') || '').trim(),
          paperTitle: String(payload.get('paperTitle') || '').trim(),
          submissionType,
          abstractFileName: abstractFile && abstractFile.name ? abstractFile.name : '',
          fullPaperFileName: fullPaperFile && fullPaperFile.name ? fullPaperFile.name : '',
          status: submissionType,
          paymentVerified: false,
          certificateEmailSent: false,
          review: null,
          submittedAt: new Date().toISOString()
        };

        items.unshift(record);
        setLocalSubmissions(items);
        status.textContent = `Submission successful (local mode). Your ID is ${record.abstractId} (${submissionType}).`;
        form.reset();
      };

      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          body: payload
        });

        const raw = await response.text();
        let result = null;
        try {
          result = JSON.parse(raw);
        } catch (_) {
          result = null;
        }

        if (!result) {
          submitLocally(payload);
          return;
        }

        if (!response.ok || !result.ok) {
          status.textContent = result.message || 'Submission failed.';
          return;
        }

        status.textContent = `Submission successful. Your ID is ${result.abstractId}${result.submission?.submissionType ? ` (${result.submission.submissionType})` : ''}.`;
        form.reset();
      } catch (error) {
        submitLocally(payload);
      }
    });
  };

  const loadDashboard = async () => {
    const table = document.getElementById('dashboard-table');
    const summary = document.getElementById('dashboard-summary');
    if (!table || !summary) return;

    const adminTokenInput = document.getElementById('admin-token-input');
    const adminActionStatus = document.getElementById('admin-action-status');
    const adminUserForm = document.getElementById('admin-user-form');
    const adminUserAbstractId = document.getElementById('admin-user-abstract-id');
    const adminUserName = document.getElementById('admin-user-name');
    const adminUserEmail = document.getElementById('admin-user-email');
    const adminUserAffiliation = document.getElementById('admin-user-affiliation');
    const adminUserPaperTitle = document.getElementById('admin-user-paper-title');
    const adminUserSaveButton = document.getElementById('admin-user-save');
    const adminUserResetButton = document.getElementById('admin-user-reset');
    if (adminTokenInput && !adminTokenInput.value) {
      adminTokenInput.value = localStorage.getItem(ADMIN_TOKEN_KEY) || '';
    }

    const getAdminToken = () => {
      const token = (adminTokenInput?.value || localStorage.getItem(ADMIN_TOKEN_KEY) || '').trim();
      if (token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
      }
      return token;
    };

    const callAdminAction = async (url, method = 'POST') => {
      const token = getAdminToken();
      if (!token) {
        if (adminActionStatus) adminActionStatus.textContent = 'Admin token is required. Use Admin Login first.';
        return null;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'x-admin-token': token
        }
      });
      const raw = await response.text();
      let result = null;
      try {
        result = JSON.parse(raw);
      } catch (_) {
        throw new Error('Admin API endpoint is unavailable in local static mode.');
      }
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Admin action failed.');
      }
      return result;
    };

    const tbody = table.querySelector('tbody');
    let tableData = [];
    const render = (items) => {
      summary.textContent = `Total registered authors: ${items.length}`;
      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="10">No submissions found.</td></tr>';
        return;
      }

      tbody.innerHTML = items.map((item) => {
        const abstractPath = item.files?.abstract?.path || '';
        const abstractName = item.files?.abstract?.originalName || item.abstractFileName || '';
        const fullPaperPath = item.files?.fullPaper?.path || '';
        const fullPaperName = item.files?.fullPaper?.originalName || item.fullPaperFileName || '';
        const fileLinks = [
          abstractPath && abstractName
            ? `<a href="${abstractPath}" download>Abstract: ${abstractName}</a>`
            : '',
          fullPaperPath && fullPaperName
            ? `<a href="${fullPaperPath}" download>Full Paper: ${fullPaperName}</a>`
            : ''
        ].filter(Boolean).join('<br/>') || 'No file uploaded';

        return `
          <tr>
            <td>${item.abstractId || '-'}</td>
            <td>${item.submissionType || '-'}</td>
            <td>${item.authorName || '-'}</td>
            <td>${item.paperTitle || '-'}</td>
            <td>${fileLinks}</td>
            <td>${item.status || '-'}</td>
            <td>${item.paymentVerified ? 'Verified' : 'Pending'}</td>
            <td>${item.certificateEmailSent ? `Emailed (${formatDate(item.certificateIssuedAt)})` : 'Not emailed'}</td>
            <td>${formatDate(item.submittedAt)}</td>
            <td>
              <button class="btn btn-ghost quick-link-secondary" data-action="verify" data-id="${item.abstractId}">Confirm Payment</button>
              <button class="btn btn-primary" data-action="email-cert" data-id="${item.abstractId}">Email Certificate</button>
              <button class="btn btn-ghost quick-link-secondary" data-action="edit-user" data-id="${item.abstractId}">Edit User</button>
              <button class="btn btn-ghost quick-link-secondary" data-action="delete-user" data-id="${item.abstractId}">Remove User</button>
            </td>
          </tr>
        `;
      }).join('');
    };

    const showAuthRequiredState = () => {
      tableData = [];
      summary.textContent = 'Admin token required. Sign in via the secure admin login page.';
      tbody.innerHTML = '<tr><td colspan="10">Admin authentication required to view submission records.</td></tr>';
    };

    const clearAdminUserForm = () => {
      if (adminUserAbstractId) adminUserAbstractId.value = '';
      adminUserForm?.reset();
      if (adminUserSaveButton) adminUserSaveButton.textContent = 'Register User';
    };

    try {
      const token = getAdminToken();
      if (!token) {
        showAuthRequiredState();
        return;
      }

      summary.textContent = 'Loading dashboard...';
      const response = await fetch('/api/admin/submissions', {
        headers: {
          'x-admin-token': token
        }
      });
      const raw = await response.text();
      let result = null;
      try {
        result = JSON.parse(raw);
      } catch (_) {
        const localItems = getLocalSubmissions();
        tableData = localItems;
        render(localItems);
        summary.textContent = `Local mode dashboard: ${localItems.length} submission(s).`;
        return;
      }

      if (!response.ok || !result.ok) {
        if (response.status === 401) {
          showAuthRequiredState();
          return;
        }
        summary.textContent = result.message || 'Unable to load dashboard.';
        return;
      }

      tableData = result.submissions || [];
      render(tableData);
    } catch (error) {
      const localItems = getLocalSubmissions();
      tableData = localItems;
      render(localItems);
      summary.textContent = localItems.length
        ? `Local mode dashboard: ${localItems.length} submission(s).`
        : `Unable to load dashboard: ${error.message}`;
    }

    if (tbody.dataset.bound !== 'true') {
      tbody.dataset.bound = 'true';
      tbody.addEventListener('click', async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      const abstractId = target.dataset.id;
      if (!action || !abstractId) return;

      if (action === 'edit-user') {
        const rowItem = (tableData || []).find((item) => item.abstractId === abstractId);
        if (!rowItem) {
          if (adminActionStatus) adminActionStatus.textContent = 'Unable to load selected user details.';
          return;
        }
        if (adminUserAbstractId) adminUserAbstractId.value = rowItem.abstractId || '';
        if (adminUserName) adminUserName.value = rowItem.authorName || '';
        if (adminUserEmail) adminUserEmail.value = rowItem.authorEmail || '';
        if (adminUserAffiliation) adminUserAffiliation.value = rowItem.affiliation || '';
        if (adminUserPaperTitle) adminUserPaperTitle.value = rowItem.paperTitle || '';
        if (adminUserSaveButton) adminUserSaveButton.textContent = 'Update User';
        if (adminActionStatus) adminActionStatus.textContent = `Editing ${rowItem.abstractId}. Update fields and submit.`;
        return;
      }

      if (action === 'delete-user') {
        if (!window.confirm(`Remove user record ${abstractId}? This cannot be undone.`)) {
          return;
        }
        try {
          const result = await callAdminAction(`/api/admin/submissions/${abstractId}`, 'DELETE');
          if (adminActionStatus) adminActionStatus.textContent = result?.message || 'User removed.';
          clearAdminUserForm();
          await loadDashboard();
        } catch (error) {
          if (adminActionStatus) adminActionStatus.textContent = error.message;
        }
        return;
      }

      try {
        const endpoint = action === 'verify'
          ? `/api/admin/submissions/${abstractId}/confirm-payment`
          : `/api/admin/submissions/${abstractId}/email-certificate`;
        const result = await callAdminAction(endpoint);
        if (adminActionStatus) adminActionStatus.textContent = result?.message || 'Action completed.';
        await loadDashboard();
      } catch (error) {
        if (adminActionStatus) adminActionStatus.textContent = error.message;
      }
      });
    }

    if (adminUserForm && adminUserForm.dataset.bound !== 'true') {
      adminUserForm.dataset.bound = 'true';
      adminUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const abstractId = (adminUserAbstractId?.value || '').trim();
        const payload = {
          authorName: (adminUserName?.value || '').trim(),
          authorEmail: (adminUserEmail?.value || '').trim(),
          affiliation: (adminUserAffiliation?.value || '').trim(),
          paperTitle: (adminUserPaperTitle?.value || '').trim()
        };

        if (!payload.authorName || !payload.authorEmail || !payload.paperTitle) {
          if (adminActionStatus) adminActionStatus.textContent = 'Author name, email, and paper title are required.';
          return;
        }

        try {
          const endpoint = abstractId
            ? `/api/admin/submissions/${abstractId}`
            : '/api/admin/submissions';
          const method = abstractId ? 'PUT' : 'POST';
          const token = getAdminToken();
          if (!token) {
            if (adminActionStatus) adminActionStatus.textContent = 'Admin token is required. Use Admin Login first.';
            return;
          }

          const response = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'x-admin-token': token
            },
            body: JSON.stringify(payload)
          });
          const result = await response.json();
          if (!response.ok || !result.ok) {
            throw new Error(result.message || 'Unable to save user.');
          }

          if (adminActionStatus) adminActionStatus.textContent = result.message || (abstractId ? 'User updated.' : 'User registered.');
          clearAdminUserForm();
          await loadDashboard();
        } catch (error) {
          if (adminActionStatus) adminActionStatus.textContent = error.message;
        }
      });
    }

    if (adminUserResetButton && adminUserResetButton.dataset.bound !== 'true') {
      adminUserResetButton.dataset.bound = 'true';
      adminUserResetButton.addEventListener('click', () => {
        clearAdminUserForm();
        if (adminActionStatus) adminActionStatus.textContent = 'Admin user form cleared.';
      });
    }

    const emailAllButton = document.getElementById('email-all-certificates');
    if (emailAllButton) {
      emailAllButton.onclick = async () => {
        try {
          const result = await callAdminAction('/api/admin/certificates/email-all');
          if (adminActionStatus) adminActionStatus.textContent = result?.message || 'Bulk email completed.';
          await loadDashboard();
        } catch (error) {
          if (adminActionStatus) adminActionStatus.textContent = error.message;
        }
      };
    }
  };

  const attachCertificateStatusForm = () => {
    const form = document.getElementById('certificate-status-form');
    const resultView = document.getElementById('certificate-status-result');
    if (!form || !resultView) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const email = String(data.get('email') || '').trim();
      const abstractId = String(data.get('abstractId') || '').trim();
      if (!email || !abstractId) {
        resultView.textContent = 'Provide both registered email and abstract ID.';
        return;
      }

      try {
        const response = await fetch(`/api/certificate-status?email=${encodeURIComponent(email)}&abstractId=${encodeURIComponent(abstractId)}`);
        const raw = await response.text();
        let result = null;
        try {
          result = JSON.parse(raw);
        } catch (_) {
          result = null;
        }

        if (!result) {
          const local = getLocalSubmissions();
          const match = local.find((item) =>
            String(item.authorEmail || '').toLowerCase() === email.toLowerCase()
            && String(item.abstractId || '').toUpperCase() === abstractId.toUpperCase()
          );

          if (!match) {
            resultView.textContent = 'No matching submission found in local mode.';
            return;
          }

          resultView.textContent = match.certificateEmailSent
            ? 'Certificate has been issued. Check your email inbox/spam folder.'
            : `Submission found in local mode. Current status: ${match.status || 'Submitted'}; payment verification pending.`;
          return;
        }

        if (!response.ok || !result.ok) {
          resultView.textContent = result.message || 'Unable to check status.';
          return;
        }

        resultView.textContent = `${result.message} ${result.certificateEmailSent ? 'Check your email inbox/spam folder.' : ''}`;
      } catch (error) {
        const local = getLocalSubmissions();
        const match = local.find((item) =>
          String(item.authorEmail || '').toLowerCase() === email.toLowerCase()
          && String(item.abstractId || '').toUpperCase() === abstractId.toUpperCase()
        );
        resultView.textContent = match
          ? `Submission found in local mode. Current status: ${match.status || 'Submitted'}; payment verification pending.`
          : `Status check failed: ${error.message}`;
      }
    });
  };

  const attachAdminLoginForm = () => {
    const form = document.getElementById('admin-login-form');
    const status = document.getElementById('admin-login-status');
    if (!form || !status) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      const username = String(payload.username || '').trim();
      const password = String(payload.password || '');
      status.textContent = 'Signing in...';

      const finishLocalLogin = () => {
        if (username !== LOCAL_ADMIN_USERNAME || password !== LOCAL_ADMIN_PASSWORD) {
          status.textContent = 'Login failed: Invalid username or password.';
          return;
        }

        localStorage.setItem(ADMIN_TOKEN_KEY, 'iconfst-local-admin-token');
        status.textContent = 'Login successful (local mode). Redirecting...';
        window.setTimeout(() => {
          window.location.href = 'admin-dashboard.html';
        }, 500);
      };

      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const raw = await response.text();
        let result = null;
        try {
          result = JSON.parse(raw);
        } catch (_) {
          result = null;
        }

        if (!result) {
          finishLocalLogin();
          return;
        }

        if (!response.ok || !result.ok) {
          status.textContent = result.message || 'Login failed.';
          return;
        }

        localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
        status.textContent = 'Login successful. Redirecting...';
        window.setTimeout(() => {
          window.location.href = 'admin-dashboard.html';
        }, 500);
      } catch (error) {
        finishLocalLogin();
      }
    });
  };

  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-main-nav]');

  toggle?.addEventListener('click', () => {
    const next = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(next));
  });

  document.querySelectorAll('.dropdown > .dropbtn').forEach((button) => {
    button.addEventListener('click', () => {
      if (window.innerWidth > 900) return;
      const parent = button.closest('.dropdown');
      parent.classList.toggle('open');
    });
  });

  const countdown = document.querySelector('[data-countdown-target]');
  if (countdown) {
    const target = new Date(countdown.dataset.countdownTarget).getTime();
    const days = countdown.querySelector('[data-days]');
    const hours = countdown.querySelector('[data-hours]');
    const minutes = countdown.querySelector('[data-minutes]');
    const seconds = countdown.querySelector('[data-seconds]');

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      days.textContent = String(d).padStart(2, '0');
      hours.textContent = String(h).padStart(2, '0');
      minutes.textContent = String(m).padStart(2, '0');
      seconds.textContent = String(s).padStart(2, '0');
    };

    tick();
    window.setInterval(tick, 1000);
  }

  attachSubmissionForm();
  attachCertificateStatusForm();
  attachAdminLoginForm();

  const refreshButton = document.getElementById('refresh-submissions');
  if (refreshButton) {
    refreshButton.addEventListener('click', loadDashboard);
  }

  loadDashboard();
})();
