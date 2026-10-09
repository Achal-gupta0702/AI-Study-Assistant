// Shared sidebar HTML - injected into all app pages
function getSidebarHTML(activePage = '') {
  const navItems = [
    { href: 'dashboard.html', icon: 'fa-home', label: 'Dashboard' },
    { href: 'ai-tutor.html', icon: 'fa-robot', label: 'AI Tutor', badge: 'AI' },
    { href: 'notes.html', icon: 'fa-sticky-note', label: 'Notes' },
    { href: 'quiz.html', icon: 'fa-question-circle', label: 'Quiz Generator' },
    { href: 'flashcards.html', icon: 'fa-layer-group', label: 'Flashcards' },
    { href: 'planner.html', icon: 'fa-calendar-alt', label: 'Study Planner' },
    { href: 'progress.html', icon: 'fa-chart-line', label: 'Progress' },
    { href: 'subjects.html', icon: 'fa-book', label: 'Subjects' },
  ];

  const bottomItems = [
    { href: 'profile.html', icon: 'fa-user-circle', label: 'Profile' },
    { href: 'settings.html', icon: 'fa-cog', label: 'Settings' },
  ];

  // Determine active page from current filename
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

  const renderItem = (item) => {
    const itemPage = item.href.replace('.html', '');
    const isActive = currentPage === itemPage || (activePage && item.href.includes(activePage));
    return `
    <a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">
      <span class="nav-icon"><i class="fas ${item.icon}"></i></span>
      ${item.label}
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </a>`;
  };

  return `
  <aside class="sidebar" id="sidebar">
    <a href="dashboard.html" class="sidebar-brand">
      <div class="brand-icon"><i class="fas fa-brain"></i></div>
      <div class="brand-text">
        <div class="brand-name">AI Study Assistant</div>
        <div class="brand-sub">B.Tech CSE</div>
      </div>
    </a>
    <nav class="sidebar-nav">
      <div class="nav-section-title">Main Menu</div>
      ${navItems.map(renderItem).join('')}
      <div class="nav-section-title" style="margin-top:16px">Account</div>
      ${bottomItems.map(renderItem).join('')}
      <a href="#" class="nav-link" onclick="event.preventDefault();logout()">
        <span class="nav-icon"><i class="fas fa-sign-out-alt"></i></span>Logout
      </a>
    </nav>
    <div class="sidebar-user">
      <div class="user-avatar" data-user-initial>S</div>
      <div class="user-info">
        <div class="user-name" data-user-name>Student</div>
        <div class="user-role">B.Tech CSE</div>
      </div>
    </div>
  </aside>`;
}

function getTopNavbarHTML(title = '') {
  return `
  <nav class="top-navbar">
    <button class="sidebar-toggle" style="background:none;border:1.5px solid #e2e8f0;padding:6px 10px;border-radius:8px;cursor:pointer;display:flex;align-items:center" id="sidebarToggleBtn">
      <i class="fas fa-bars"></i>
    </button>
    <span class="page-title">${title}</span>
    <div class="nav-actions">
      <button class="btn-outline" style="padding:6px 12px;font-size:13px" onclick="window.location.href='ai-tutor.html'">
        <i class="fas fa-robot"></i> Ask AI
      </button>
      <div class="user-avatar" data-user-initial style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;cursor:pointer" onclick="window.location.href='profile.html'">S</div>
    </div>
  </nav>`;
}
