/* ===== SHARED APP UTILITIES ===== */
// Auto-detect API base: use same origin when served by backend, fallback to localhost
const API_BASE = (window.location.port === '5000' || window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? '/api'
  : 'http://localhost:5000/api';

// Helper: get the root path depending on where we are
const ROOT = (() => {
  const path = window.location.pathname;
  // If we're in /pages/xxx.html, root is ../
  return path.includes('/pages/') ? '../' : './';
})();

// Token management
const Auth = {
  getToken: () => localStorage.getItem('asa_token'),
  getUser: () => JSON.parse(localStorage.getItem('asa_user') || 'null'),
  setAuth: (token, user) => {
    localStorage.setItem('asa_token', token);
    localStorage.setItem('asa_user', JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem('asa_token');
    localStorage.removeItem('asa_user');
  },
  isLoggedIn: () => !!localStorage.getItem('asa_token'),
  requireAuth: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = ROOT + 'pages/login.html';
      return false;
    }
    return true;
  }
};

// API helper
const api = {
  request: async (method, endpoint, body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, opts);
      const data = await res.json();
      if (res.status === 401) {
        Auth.clearAuth();
        window.location.href = ROOT + 'pages/login.html';
        return null;
      }
      return data;
    } catch (err) {
      console.error('API Error:', err);
      Toast.show('Connection error. Make sure the server is running on port 5000.', 'error');
      return null;
    }
  },
  get: (endpoint) => api.request('GET', endpoint),
  post: (endpoint, body) => api.request('POST', endpoint, body),
  put: (endpoint, body) => api.request('PUT', endpoint, body),
  patch: (endpoint, body) => api.request('PATCH', endpoint, body),
  delete: (endpoint) => api.request('DELETE', endpoint)
};

// Toast notifications
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 3500) {
    this.init();
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all .3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Loader
const Loader = {
  show(msg = 'Loading...') {
    let el = document.getElementById('loader-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'loader-overlay';
      el.className = 'loader-overlay';
      el.innerHTML = `<div style="text-align:center"><div class="spinner"></div><p style="color:white;margin-top:12px;font-size:14px">${msg}</p></div>`;
      document.body.appendChild(el);
    }
  },
  hide() {
    const el = document.getElementById('loader-overlay');
    if (el) el.remove();
  }
};

// Sidebar toggle for mobile
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return; // Not a page with sidebar

  // Create overlay if not already present
  let overlay = document.getElementById('sidebarOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebarOverlay';
    overlay.className = 'sidebar-overlay';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
  }

  // Wire the toggle button (rendered by getTopNavbarHTML)
  const toggle = document.getElementById('sidebarToggleBtn');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      overlay.style.display = isOpen ? 'block' : 'none';
    });
  }

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
  });
}

// Active nav link
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      const pageName = href.replace('.html', '').split('/').pop();
      if (pageName && path.includes(pageName)) {
        link.classList.add('active');
      }
    }
  });
}

// Fill user info in sidebar
function fillUserInfo() {
  const user = Auth.getUser();
  if (!user) return;
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name || 'Student');
  document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = user.email || '');
  document.querySelectorAll('[data-user-initial]').forEach(el => el.textContent = (user.name || 'S').charAt(0).toUpperCase());
}

// Logout
function logout() {
  Auth.clearAuth();
  window.location.href = ROOT + 'index.html';
}

// Format date
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Truncate text
function truncate(text, n = 100) {
  return text && text.length > n ? text.substring(0, n) + '...' : text;
}

// Render markdown-like content
function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:16px;font-weight:700;margin:12px 0 6px">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:10px 0 4px">$1</h3>')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:3px">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>)/g, '<ul style="padding-left:20px;margin:6px 0">$1</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Init page
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  setActiveNav();
  fillUserInfo();
});
