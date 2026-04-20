/**
 * Shared Layout Functions
 * Location: public/js/layout.js
 * Purpose: Common layout elements (nav, smooth animations)
 */

// Load animations CSS
function loadAnimationsCSS() {
  if (!document.getElementById('animations-css')) {
    const link = document.createElement('link');
    link.id = 'animations-css';
    link.rel = 'stylesheet';
    link.href = '/css/animations.css?v=sidebar-shell-2';
    document.head.appendChild(link);
  }
}

function renderNav() {
  const user = getUser();
  const isLoggedIn = !!user;
  const role = user && (user.roleName || user.role);
  const isAdmin = role === 'admin';
  const isSeller = role === 'seller';
  const isSpecialist = role === 'specialist';
  const path = window.location.pathname || '/';

  function linkClass(href) {
    const active = path === href;
    return `group flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all border ${active ? 'bg-violet-500/20 text-violet-200 border-violet-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border-transparent'}`;
  }

  function navLink(href, label) {
    return `<a href="${href}" class="${linkClass(href)}">${label}</a>`;
  }

  /** Compact rail: icon + short label (Canvas-style), centered stack */
  function railLink(href, title, icon, shortLabel) {
    const active = path === href;
    const state = active
      ? 'bg-violet-500/20 text-violet-100 border border-violet-500/40 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.15)]'
      : 'text-slate-200 border border-transparent hover:text-white hover:bg-slate-800/85';
    return `<a href="${href}" title="${escapeHtml(title)}" class="rail-nav-item flex flex-col items-center justify-center gap-1 rounded-xl py-3 px-0.5 text-center transition-colors ${state}">
      <span class="text-[1.45rem] leading-none drop-shadow-sm" aria-hidden="true">${icon}</span>
      <span class="text-[11px] font-semibold leading-[1.15] tracking-tight">${escapeHtml(shortLabel)}</span>
    </a>`;
  }

  const showPlanInTopBar = !isAdmin && !isSeller && !isSpecialist;
  const pricingPageActive = path === '/pricing.html';
  const profilePageActive = path === '/profile-edit.html';
  const userLinks = isAdmin
    ? `
      ${railLink('/admin_dashboard.html', 'Dashboard', '📊', 'Admin')}
      ${railLink('/admin/clients.html', 'Clients', '👥', 'Clients')}
      ${railLink('/product_management.html', 'Products', '🛒', 'Products')}
      ${railLink('/consultations.html', 'Consultations', '📋', 'Consult')}
      ${railLink('/admin/billing.html', 'Billing', '💳', 'Billing')}
    `
    : isSeller
    ? `
      ${railLink('/product_management.html', 'Products', '🛒', 'Products')}
      ${railLink('/consultations.html', 'Consultations', '📋', 'Consult')}
    `
    : isSpecialist
    ? `
      ${railLink('/specialist_dashboard.html', 'Dashboard', '📊', 'Home')}
      ${railLink('/consultations.html', 'Consultations', '💬', 'Clients')}
      ${railLink('/guides.html', 'Guides', '📖', 'Guides')}
    `
    : `
      ${railLink('/dashboard.html', 'Dashboard', '📊', 'Home')}
      ${railLink('/assessment.html', 'Assessment', '📝', 'Quiz')}
      ${railLink('/recommendations.html', 'Products', '🛒', 'Products')}
      ${railLink('/consultations.html', 'Consultations', '📋', 'Consult')}
      ${railLink('/guides.html', 'Guides', '📖', 'Guides')}
      ${railLink('/tracker.html', 'Tracker', '📅', 'Track')}
    `;

  const accountInitial = (() => {
    const e = ((user && user.email) || '?').trim();
    const ch = e.charAt(0);
    return /[a-zA-Z0-9]/.test(ch) ? ch.toUpperCase() : '✨';
  })();

  const rawPhoto = user && user.profilePhotoUrl;
  const profilePhotoSrc =
    rawPhoto && typeof rawPhoto === 'string' && rawPhoto.trim().startsWith('/') ? rawPhoto.trim() : '';

  const sidebarExpandFab = `
    <button type="button" id="sidebar-expand-fab" class="hidden fixed left-6 top-1.5 z-[60] h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/95 text-white shadow-[0_8px_24px_rgba(2,6,23,0.45)] hover:bg-slate-800 hover:border-violet-500/40 transition-colors" title="Open menu" aria-label="Open navigation menu">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>`;

  return `
    <nav class="z-40">
      <div class="md:hidden sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-700/40 px-6 py-2 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-white font-semibold">
          <span class="text-xl icon-bounce">✨</span>
          <span>Hairvelous</span>
        </a>
        ${isLoggedIn ? `<span class="text-xs text-slate-400">Menu</span>` : ''}
      </div>
      ${
        !isLoggedIn
          ? `<div class="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-700/40 px-4 py-2 flex items-center justify-between">
               <a href="/" class="flex items-center gap-2 text-white font-semibold"><span class="text-xl icon-bounce">✨</span><span>Hairvelous</span></a>
               <div class="flex items-center gap-2">
                 ${navLink('/landing.html', 'Home')}
                 ${navLink('/login.html', 'Login')}
                 <a href="/register.html" class="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm btn-primary transition-all">Sign Up</a>
               </div>
             </div>`
          : ''
      }
    </nav>
          ${
            isLoggedIn
        ? `${sidebarExpandFab}
           <div id="app-top-bar" class="hidden md:flex fixed top-0 left-0 right-0 z-[55] h-14 pl-20 pr-6 items-center border-b border-slate-700/40 bg-slate-900/95 backdrop-blur pointer-events-none">
             <a href="/" class="pointer-events-auto flex items-center gap-2 text-white font-semibold min-w-0">
               <span class="text-2xl icon-bounce">✨</span>
               <span>Hairvelous</span>
             </a>
           </div>
           <div id="notification-root" class="fixed top-16 right-6 z-[65] flex items-center gap-2 md:top-1.5 md:right-6">
             ${
              showPlanInTopBar
                ? `<div id="top-plan-chip" class="pointer-events-auto inline-flex items-center rounded-lg border border-slate-700/80 bg-slate-900/95 px-2.5 py-1.5 text-[11px] text-slate-300 shadow-[0_8px_24px_rgba(2,6,23,0.45)] ${
                    pricingPageActive ? 'ring-1 ring-violet-500/30' : ''
                  }">
                    <span id="top-plan-label" class="font-medium">Plan</span>
                    <span class="mx-1.5 text-slate-600">|</span>
                    <a id="top-plan-upgrade-link" href="/pricing.html" class="font-semibold text-violet-300 hover:text-violet-200 underline-offset-2 hover:underline">Upgrade</a>
                  </div>`
                 : ''
             }
             <div class="relative shrink-0">
               <button type="button" id="notification-bell" class="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/95 text-lg text-white shadow-[0_8px_24px_rgba(2,6,23,0.45)] hover:bg-slate-800 hover:border-violet-500/40 transition-colors" title="Notifications" aria-label="Notifications">
                 <span aria-hidden="true">🔔</span>
                 <span id="notification-count" class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] leading-[18px] text-center">0</span>
               </button>
               <div id="notification-dropdown" class="hidden absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] max-h-96 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-2 z-[70]">
                 <div class="flex items-center justify-between px-2 py-1 border-b border-slate-700">
                   <p class="text-xs tracking-wide uppercase text-slate-400">Notifications</p>
                   <button type="button" id="notification-mark-all" class="text-[11px] text-violet-300 hover:text-violet-200">Mark all read</button>
                 </div>
                 <div id="notification-list" class="py-1">
                   <p class="text-slate-400 text-sm px-2 py-2">No notifications yet.</p>
                 </div>
               </div>
             </div>
           </div>
           <div id="sidebar-backdrop" class="fixed inset-0 z-[45] max-w-full cursor-default bg-slate-950/55 opacity-0 pointer-events-none transition-opacity duration-300 ease-out" aria-hidden="true"></div>
           <aside id="app-sidebar" class="app-sidebar hidden md:flex fixed left-6 top-14 bottom-6 w-[6rem] flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950 shadow-[4px_0_24px_rgba(2,6,23,0.45)]">
             <a href="/profile-edit.html" class="group flex flex-col items-center border-b border-slate-800/80 px-1.5 pt-3 pb-2 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
               profilePageActive
                 ? 'bg-violet-500/20 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.12)] ring-1 ring-inset ring-violet-500/30'
                 : 'hover:bg-slate-800/55'
             }" title="${escapeHtml('Your profile — ' + (user.email || ''))}" aria-label="Account and profile">
               <div id="sidebar-account-avatar" class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-500/35 bg-gradient-to-b from-violet-500/25 to-slate-900 text-sm font-semibold text-violet-100 group-hover:border-violet-400/50" aria-hidden="true">
                 <img id="sidebar-account-photo"${profilePhotoSrc ? ` src="${escapeHtml(profilePhotoSrc)}"` : ''} alt="" class="absolute inset-0 h-full w-full object-cover ${profilePhotoSrc ? '' : 'hidden'}" decoding="async" />
                 <span id="sidebar-account-initial" class="relative z-0 ${profilePhotoSrc ? 'hidden' : ''}">${accountInitial}</span>
               </div>
               <span class="mt-1.5 max-w-full truncate text-center text-[8px] font-medium uppercase tracking-wider ${profilePageActive ? 'text-violet-200/95' : 'text-slate-500 group-hover:text-slate-400'}">Account</span>
             </a>
             <nav class="flex min-h-0 flex-1 flex-col items-stretch gap-1 overflow-y-auto overscroll-contain px-1 py-2" aria-label="Main navigation">
               ${userLinks}
             </nav>
             <div class="flex flex-col items-center gap-1.5 border-t border-slate-800/80 px-1.5 pb-2.5 pt-2">
               <button type="button" onclick="logout()" class="flex w-full flex-col items-center gap-0.5 rounded-xl py-2 text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-white" title="Log out">
                 <span class="text-base leading-none" aria-hidden="true">🚪</span>
                 <span class="text-[10px] font-semibold leading-tight">Logout</span>
               </button>
               <button type="button" id="sidebar-collapse-btn" class="flex w-full flex-col items-center gap-0.5 rounded-xl py-2 text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-white" title="Collapse menu" aria-expanded="true" aria-label="Collapse navigation">
                 <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                 <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Hide</span>
               </button>
             </div>
           </aside>`
        : ''
    }
  `;
}

async function loadTopPlanBadge() {
  const chip = document.getElementById('top-plan-chip');
  const label = document.getElementById('top-plan-label');
  const upgradeLink = document.getElementById('top-plan-upgrade-link');
  if (!chip || !label || !upgradeLink || typeof api !== 'function') return;
  try {
    const data = await api('/billing/status');
    const status = (data && data.status) || {};
    if (status.isPro) {
      label.textContent = 'Pro plan';
      upgradeLink.textContent = 'Manage';
      upgradeLink.href = '/pricing.html';
      chip.className =
        'pointer-events-auto inline-flex items-center rounded-lg border border-emerald-700/50 bg-emerald-900/25 px-2.5 py-1.5 text-[11px] text-emerald-200 shadow-[0_8px_24px_rgba(2,6,23,0.45)]';
    } else {
      label.textContent = 'Free plan';
      upgradeLink.textContent = 'Upgrade';
      upgradeLink.href = '/pricing.html';
      chip.className =
        'pointer-events-auto inline-flex items-center rounded-lg border border-slate-700/80 bg-slate-900/95 px-2.5 py-1.5 text-[11px] text-slate-300 shadow-[0_8px_24px_rgba(2,6,23,0.45)]';
    }
  } catch (_err) {
    label.textContent = 'Free plan';
    upgradeLink.textContent = 'Upgrade';
    upgradeLink.href = '/pricing.html';
  }
}

function formatNotifTime(v) {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}h ago`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}d ago`;
  return d.toISOString().slice(0, 10);
}

function escapeHtml(v) {
  const d = document.createElement('div');
  d.textContent = v || '';
  return d.innerHTML;
}

/** Profile picture in the sidebar; falls back to initial letter. Keeps localStorage user.profilePhotoUrl in sync when called from profile-edit. */
function syncAccountAvatarFromProfile(url) {
  const img = document.getElementById('sidebar-account-photo');
  const initial = document.getElementById('sidebar-account-initial');
  if (!img || !initial) return;
  const safe = url && typeof url === 'string' && url.trim().startsWith('/') ? url.trim() : '';
  if (!safe) {
    img.removeAttribute('src');
    img.classList.add('hidden');
    initial.classList.remove('hidden');
    return;
  }
  img.alt = 'Profile';
  const showPhoto = () => {
    img.classList.remove('hidden');
    initial.classList.add('hidden');
  };
  const showInitial = () => {
    img.classList.add('hidden');
    initial.classList.remove('hidden');
  };
  img.onload = () => showPhoto();
  img.onerror = () => showInitial();
  if (img.getAttribute('src') === safe) {
    if (img.complete && img.naturalWidth > 0) showPhoto();
    return;
  }
  img.src = safe;
}

window.HairvelousUpdateAccountAvatar = syncAccountAvatarFromProfile;

const SIDEBAR_COLLAPSED_KEY = 'hairvelous_sidebar_collapsed';

/** Injected once per page — never rewrite on drawer toggle (that was forcing full style recalc / layout shift). */
const APP_SHELL_CRITICAL_CSS = [
  'html.app-sidebar-layout{--app-header-h:3.5rem;--app-main-gap-below-header:1.75rem;overflow-y:scroll!important;overflow-x:hidden!important;scrollbar-gutter:stable!important;}',
  'html.app-sidebar-layout body{width:100%!important;max-width:100%!important;margin:0;}',
  'body.app-sidebar-layout main{transition:none!important;overflow-anchor:none!important;}',
  '@media (min-width:768px){body.app-sidebar-layout main{padding-top:calc(var(--app-header-h, 3.5rem) + var(--app-main-gap-below-header, 1.75rem))!important;padding-left:1.5rem!important;padding-right:1.5rem!important;margin-left:auto!important;margin-right:auto!important;}}',
].join('');

function ensureAppSidebarLayoutShell() {
  const hasSidebar = !!document.getElementById('app-sidebar');
  document.documentElement.classList.toggle('app-sidebar-layout', hasSidebar);
  document.body.classList.toggle('app-sidebar-layout', hasSidebar);
  if (!hasSidebar) return;
  if (document.getElementById('sidebar-layout-critical')) return;
  const tag = document.createElement('style');
  tag.id = 'sidebar-layout-critical';
  tag.textContent = APP_SHELL_CRITICAL_CSS;
  document.head.appendChild(tag);
}

function setSidebarBackdropVisible(visible) {
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!backdrop) return;
  if (visible) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100');
    backdrop.setAttribute('aria-hidden', 'false');
  } else {
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    backdrop.classList.remove('opacity-100');
    backdrop.setAttribute('aria-hidden', 'true');
  }
}

/** One-time cleanup of legacy inline styles on <main> (do not call on every drawer toggle — reflow can fight !important shell rules). */
function applyMainMargin() {
  const main = document.querySelector('main');
  document.body.classList.remove('layout-nav-desktop', 'layout-sidebar-expanded', 'layout-sidebar-collapsed');
  if (main) {
    main.style.marginLeft = '';
    main.style.maxWidth = '';
    main.style.paddingLeft = '';
    main.style.paddingRight = '';
    main.style.paddingTop = '';
  }
}

function syncSidebarCollapsedUi() {
  const aside = document.getElementById('app-sidebar');
  const fab = document.getElementById('sidebar-expand-fab');
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  if (!aside && !fab) return;

  if (window.innerWidth < 768) {
    if (aside) aside.classList.remove('is-collapsed');
    if (fab) fab.className = 'hidden';
    if (collapseBtn) collapseBtn.setAttribute('aria-expanded', 'true');
    setSidebarBackdropVisible(false);
    return;
  }

  // Default: collapsed (closed). '0' = user opened the menu; '1' = user hid it.
  const collapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) !== '0';
  if (aside) {
    aside.classList.toggle('is-collapsed', collapsed);
  }
  if (collapseBtn) {
    collapseBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }
  if (fab) {
    fab.className = collapsed
      ? 'fixed left-6 top-1.5 z-[60] h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/95 text-white shadow-[0_8px_24px_rgba(2,6,23,0.45)] hover:bg-slate-800 hover:border-violet-500/40 transition-colors hidden md:flex'
      : 'hidden';
  }
  setSidebarBackdropVisible(!collapsed);
}

function initSidebarToggle() {
  const aside = document.getElementById('app-sidebar');
  if (!aside) {
    applyMainMargin();
    return;
  }

  function setCollapsed(on) {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, on ? '1' : '0');
    syncSidebarCollapsedUi();
  }

  document.getElementById('sidebar-collapse-btn')?.addEventListener('click', () => setCollapsed(true));
  document.getElementById('sidebar-expand-fab')?.addEventListener('click', () => setCollapsed(false));
  document.getElementById('sidebar-backdrop')?.addEventListener('click', () => setCollapsed(true));

  syncSidebarCollapsedUi();
}

function renderNotifications(items) {
  const list = document.getElementById('notification-list');
  if (!list) return;
  if (!items.length) {
    list.innerHTML = '<p class="text-slate-400 text-sm px-2 py-2">No notifications yet.</p>';
    return;
  }
  list.innerHTML = items.map((n) => `
    <button class="notification-item w-full text-left px-2 py-2 rounded-lg hover:bg-slate-800/70 ${n.isRead ? 'opacity-80' : 'bg-slate-800/40'}" data-id="${n.notificationId}" data-type="${escapeHtml(n.type || '')}" data-link="${(n.linkUrl || '').replace(/"/g, '&quot;')}">
      <div class="flex items-start gap-2">
        <span class="mt-1 text-[9px] ${n.isRead ? 'text-slate-600' : 'text-violet-400'}">●</span>
        <div class="min-w-0">
          <p class="text-sm text-white truncate">${escapeHtml(n.title || 'Notification')}</p>
          <p class="text-xs text-slate-300 mt-0.5 break-words">${escapeHtml(n.message || '')}</p>
          <p class="text-[11px] text-slate-500 mt-1">${formatNotifTime(n.createdAt)}</p>
        </div>
      </div>
    </button>
  `).join('');
}

async function loadNotifications() {
  const bell = document.getElementById('notification-bell');
  if (!bell || typeof api !== 'function') return;
  try {
    const data = await api('/notifications');
    const unread = Number(data.unreadCount || 0);
    const count = document.getElementById('notification-count');
    if (count) {
      count.textContent = String(unread);
      count.classList.toggle('hidden', unread <= 0);
    }
    renderNotifications(data.notifications || []);
  } catch (_err) {}
}

async function markNotificationRead(id) {
  if (!id) return;
  try {
    await api(`/notifications/${id}/read`, { method: 'PATCH' });
  } catch (_err) {}
}

function initNotificationBell() {
  const root = document.getElementById('notification-root');
  const bell = document.getElementById('notification-bell');
  const dropdown = document.getElementById('notification-dropdown');
  if (!root || !bell || !dropdown || typeof api !== 'function') return;

  bell.addEventListener('click', async (e) => {
    e.stopPropagation();
    const wasHidden = dropdown.classList.contains('hidden');
    dropdown.classList.toggle('hidden');
    if (wasHidden) await loadNotifications();
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  const markAll = document.getElementById('notification-mark-all');
  if (markAll) {
    markAll.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await api('/notifications/read-all', { method: 'PATCH' });
        await loadNotifications();
      } catch (_err) {}
    });
  }

  dropdown.addEventListener('click', async (e) => {
    const btn = e.target.closest('.notification-item');
    if (!btn) return;
    const id = btn.dataset.id;
    const type = btn.dataset.type || '';
    const link = btn.dataset.link || '';
    await markNotificationRead(id);
    await loadNotifications();
    if (link) {
      if (type === 'chat_message' && !/[?&]chat=\d+/.test(link)) {
        window.location.href = '/consultations.html?chat_latest=1';
        return;
      }
      window.location.href = link;
      return;
    }
    if (type === 'chat_message') {
      window.location.href = '/consultations.html?chat_latest=1';
    }
  });

  loadNotifications();
  setInterval(loadNotifications, 5000);
}

function initLayout() {
  loadAnimationsCSS();
  const navPlaceholder = document.getElementById('nav-placeholder');

  if (navPlaceholder) {
    navPlaceholder.innerHTML = renderNav();
    loadTopPlanBadge();
    initNotificationBell();
    initSidebarToggle();
    if (typeof getToken === 'function' && getToken() && typeof getUser === 'function' && getUser() && typeof api === 'function') {
      api('/profile')
        .then((p) => {
          if (p && p.profilePhotoUrl) {
            const u = getUser();
            if (u) setUser({ ...u, profilePhotoUrl: p.profilePhotoUrl });
            syncAccountAvatarFromProfile(p.profilePhotoUrl);
          }
        })
        .catch(() => {});
    }
  }
  ensureAppSidebarLayoutShell();

  // Add fade-in to main content
  const main = document.querySelector('main');
  if (main && !main.classList.contains('fade-in')) {
    main.classList.add('fade-in');
  }
  applyMainMargin();

  // Add card-hover class to cards
  document.querySelectorAll('a[href], .bg-slate-800\\/50').forEach(card => {
    if (card.tagName === 'A' || card.classList.contains('rounded-xl')) {
      card.classList.add('card-hover');
    }
  });

  // Add smooth transitions to buttons
  document.querySelectorAll('button, .btn-primary').forEach(btn => {
    if (!btn.classList.contains('btn-primary')) {
      btn.classList.add('btn-primary');
    }
  });

  // Apply slide-in animation with blur
  setTimeout(() => {
    document.body.classList.add('active');
    document.querySelectorAll('.animation').forEach((el, index) => {
      if (!el.style.getPropertyValue('--i')) {
        el.style.setProperty('--i', index);
      }
    });
  }, 200);
}

window.addEventListener('resize', () => {
  syncSidebarCollapsedUi();
});

// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
  // Add fade-out on link clicks
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.href && !this.href.includes('#') && !this.target) {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease-out';
        setTimeout(() => {
          window.location.href = this.href;
        }, 200);
      }
    });
  });

  // Fade in on page load
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s ease-in';
    document.body.style.opacity = '1';
  }, 10);
});

// Auto-init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayout);
} else {
  initLayout();
}