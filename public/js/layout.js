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

function loadBrandConsistencyCSS() {
  if (!document.getElementById('brand-consistency-css')) {
    const link = document.createElement('link');
    link.id = 'brand-consistency-css';
    link.rel = 'stylesheet';
    link.href = '/css/brand-consistency.css?v=1';
    document.head.appendChild(link);
  }
}

function iconSvg(name, classes = 'h-5 w-5') {
  const cls = escapeHtml(classes);
  const icons = {
    home: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.592 0L21.75 12M4.5 9.75v10.125A1.125 1.125 0 0 0 5.625 21h12.75a1.125 1.125 0 0 0 1.125-1.125V9.75"/></svg>`,
    users: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M18 18.72a8.96 8.96 0 0 0-6-2.22 8.96 8.96 0 0 0-6 2.22M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm7.5 11.25a7.5 7.5 0 0 0-5.799-7.297M16.5 3.75a3.75 3.75 0 0 1 0 7.5"/></svg>`,
    specialist: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16.5 7.5A4.5 4.5 0 1 1 12 3a4.5 4.5 0 0 1 4.5 4.5ZM5.25 19.125c0-2.9 3.022-5.25 6.75-5.25s6.75 2.35 6.75 5.25M12 9.75v3m-1.5-1.5h3"/></svg>`,
    products: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m2.25 7.5 9.75 4.5 9.75-4.5M4.5 6.462V17.25A2.25 2.25 0 0 0 6.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.462M3 6l8.487-3.918a1.25 1.25 0 0 1 1.026 0L21 6"/></svg>`,
    consult: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8.625 9.75h6.75m-6.75 3h4.5M7.5 18h9A2.25 2.25 0 0 0 18.75 15.75v-9A2.25 2.25 0 0 0 16.5 4.5h-9A2.25 2.25 0 0 0 5.25 6.75v9A2.25 2.25 0 0 0 7.5 18Zm11.25 2.25-2.44-2.44"/></svg>`,
    billing: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.25 8.25h19.5m-18 0V6.75A2.25 2.25 0 0 1 6 4.5h12a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25V8.25Zm12 7.5h3"/></svg>`,
    guides: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.75v10.5m0-10.5C9.5 5.2 6.4 4.5 3.75 4.5v12c2.65 0 5.75.7 8.25 2.25m0-12C14.5 5.2 17.6 4.5 20.25 4.5v12c-2.65 0-5.75.7-8.25 2.25"/></svg>`,
    tracker: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8.25 2.25v3m7.5-3v3m-10.5 4.5h13.5m-15 9.75h16.5A1.5 1.5 0 0 0 21.75 18V6.75A1.5 1.5 0 0 0 20.25 5.25H3.75A1.5 1.5 0 0 0 2.25 6.75V18a1.5 1.5 0 0 0 1.5 1.5Z"/></svg>`,
    assessment: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16.5 3.75H6.75A2.25 2.25 0 0 0 4.5 6v12A2.25 2.25 0 0 0 6.75 20.25h10.5A2.25 2.25 0 0 0 19.5 18V6.75L16.5 3.75Zm-6 6h6m-6 3h6m-6 3h3"/></svg>`,
    chat: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7.5 8.25h9m-9 3h5.25m8.25.75A7.5 7.5 0 0 1 13.5 19.5H9l-4.5 2.25V12A7.5 7.5 0 1 1 21 12Z"/></svg>`,
    bell: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0A2.25 2.25 0 0 1 7.5 14.854V11.25a4.5 4.5 0 1 1 9 0v3.604a2.25 2.25 0 0 1-1.643 2.228ZM9.75 19.5a2.25 2.25 0 0 0 4.5 0"/></svg>`,
    logout: `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.75 9V5.625A2.625 2.625 0 0 0 13.125 3h-6.75A2.625 2.625 0 0 0 3.75 5.625v12.75A2.625 2.625 0 0 0 6.375 21h6.75a2.625 2.625 0 0 0 2.625-2.625V15m-6-3h10.5m0 0-3-3m3 3-3 3"/></svg>`,
  };
  return icons[name] || icons.home;
}

function brandMark(classes = 'h-6 w-6 text-violet-300') {
  return `<svg class="${escapeHtml(classes)}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M6 15c0-5.25 3.9-9 9-9 1.05 0 2.02.15 3 .45-.6 4.65-3.15 7.5-7.35 8.55M6 15c0 1.95 1.05 3.9 2.85 5.25M6 15c2.1.15 4.35.9 5.85 2.7M11.85 20.25c.45-1.5 1.5-2.85 3-3.75"/></svg>`;
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

  function mobileLink(href, label, iconName) {
    const active = path === href;
    return `<a href="${href}" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm border transition-colors ${
      active
        ? 'bg-violet-500/20 text-violet-100 border-violet-400/30'
        : 'text-slate-200 border-slate-700/70 hover:bg-slate-800/80 hover:text-white'
    }">
      <span class="text-base leading-none" aria-hidden="true">${iconSvg(iconName, 'h-5 w-5')}</span>
      <span class="font-medium">${escapeHtml(label)}</span>
    </a>`;
  }

  /** Sidebar item: icon + label, readable on desktop */
  function railLink(href, title, iconName, shortLabel) {
    const active = path === href;
    const state = active
      ? 'bg-violet-500/20 text-violet-100 border border-violet-500/40 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.15)]'
      : 'text-slate-200 border border-transparent hover:text-white hover:bg-slate-800/85';
    return `<a href="${href}" title="${escapeHtml(title)}" class="rail-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${state}">
      <span class="text-lg leading-none drop-shadow-sm shrink-0 text-slate-300" aria-hidden="true">${iconSvg(iconName, 'h-5 w-5')}</span>
      <span class="text-[13px] font-semibold leading-tight tracking-tight truncate">${escapeHtml(shortLabel)}</span>
    </a>`;
  }

  const showPlanInTopBar = !isAdmin && !isSeller && !isSpecialist;
  const pricingPageActive = path === '/pricing.html';
  const profilePageActive = path === '/profile-edit.html';
  const userLinks = isAdmin
    ? `
      ${railLink('/admin_dashboard.html', 'Dashboard', 'home', 'Admin')}
      ${railLink('/admin/clients.html', 'Clients', 'users', 'Clients')}
      ${railLink('/admin/specialists.html', 'Specialists', 'specialist', 'Specialists')}
      ${railLink('/product_management.html', 'Products', 'products', 'Products')}
      ${railLink('/consultations.html', 'Consultations', 'consult', 'Consult')}
      ${railLink('/admin/billing.html', 'Billing', 'billing', 'Billing')}
    `
    : isSeller
    ? `
      ${railLink('/product_management.html', 'Products', 'products', 'Products')}
      ${railLink('/consultations.html', 'Consultations', 'consult', 'Consult')}
    `
    : isSpecialist
    ? `
      ${railLink('/specialist_dashboard.html', 'Dashboard', 'home', 'Home')}
      ${railLink('/consultations.html', 'Consultations', 'chat', 'Clients')}
      ${railLink('/guides.html', 'Guides', 'guides', 'Guides')}
    `
    : `
      ${railLink('/dashboard.html', 'Dashboard', 'home', 'Home')}
      ${railLink('/assessment.html', 'Assessment', 'assessment', 'Quiz')}
      ${railLink('/recommendations.html', 'Products', 'products', 'Products')}
      ${railLink('/consultations.html', 'Consultations', 'consult', 'Consult')}
      ${railLink('/guides.html', 'Guides', 'guides', 'Guides')}
      ${railLink('/tracker.html', 'Tracker', 'tracker', 'Track')}
    `;

  const mobileUserLinks = isAdmin
    ? `
      ${mobileLink('/admin_dashboard.html', 'Admin Dashboard', 'home')}
      ${mobileLink('/admin/clients.html', 'Clients', 'users')}
      ${mobileLink('/admin/specialists.html', 'Specialists', 'specialist')}
      ${mobileLink('/product_management.html', 'Products', 'products')}
      ${mobileLink('/consultations.html', 'Consultations', 'consult')}
      ${mobileLink('/admin/billing.html', 'Billing', 'billing')}
    `
    : isSeller
    ? `
      ${mobileLink('/product_management.html', 'Products', 'products')}
      ${mobileLink('/consultations.html', 'Consultations', 'consult')}
    `
    : isSpecialist
    ? `
      ${mobileLink('/specialist_dashboard.html', 'Dashboard', 'home')}
      ${mobileLink('/consultations.html', 'Clients', 'chat')}
      ${mobileLink('/guides.html', 'Guides', 'guides')}
    `
    : `
      ${mobileLink('/dashboard.html', 'Home', 'home')}
      ${mobileLink('/profile-edit.html', 'Profile', 'users')}
      ${mobileLink('/assessment.html', 'Assessment', 'assessment')}
      ${mobileLink('/recommendations.html', 'Products', 'products')}
      ${mobileLink('/consultations.html', 'Consultations', 'consult')}
      ${mobileLink('/guides.html', 'Guides', 'guides')}
      ${mobileLink('/tracker.html', 'Tracker', 'tracker')}
    `;

  const accountInitial = (() => {
    const e = ((user && user.email) || '?').trim();
    const ch = e.charAt(0);
    return /[a-zA-Z0-9]/.test(ch) ? ch.toUpperCase() : 'U';
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
      <div class="md:hidden sticky top-0 z-[58] w-full max-w-full min-w-0 bg-slate-900/95 backdrop-blur border-b border-slate-700/40 px-4 py-2 flex items-center justify-between gap-2">
        <a href="/" class="flex min-w-0 flex-1 items-center gap-2 text-white font-semibold">
          <span class="shrink-0 text-xl icon-bounce">${brandMark('h-6 w-6 text-violet-300')}</span>
          <span class="truncate">Hairvelous</span>
        </a>
        ${
          isLoggedIn
            ? `<button type="button" id="mobile-menu-toggle" class="inline-flex shrink-0 items-center rounded-lg border border-slate-700/80 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors" aria-expanded="false" aria-controls="mobile-menu-panel">Menu</button>`
            : `<div class="flex items-center gap-2">
                 ${navLink('/landing.html', 'Home')}
                 ${navLink('/login.html', 'Login')}
                 <a href="/register.html" class="bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-xs btn-primary transition-all">Sign Up</a>
               </div>`
        }
      </div>
      ${
        isLoggedIn
          ? `<div id="mobile-menu-panel" class="md:hidden hidden fixed inset-0 z-[68]">
               <div id="mobile-menu-backdrop" class="absolute inset-0 bg-slate-950/70"></div>
               <div class="absolute right-0 top-0 h-full w-[min(88vw,22rem)] border-l border-slate-700/80 bg-slate-900 shadow-2xl p-4 overflow-y-auto">
                 <div class="flex items-center justify-between mb-4">
                   <p class="text-sm font-semibold text-white">Navigation</p>
                   <button type="button" id="mobile-menu-close" class="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white">Close</button>
                 </div>
                 ${
                   showPlanInTopBar
                     ? `<div class="mb-4 rounded-xl border border-slate-700/80 bg-slate-800/55 p-3">
                          <p class="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Plan</p>
                          <a href="/pricing.html" class="text-sm text-violet-300 hover:text-violet-200">Manage plan and upgrade</a>
                        </div>`
                     : ''
                 }
                <a href="/profile-edit.html" class="mb-3 flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/55 px-3 py-2.5 hover:bg-slate-800/80 transition-colors">
                  <div class="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-500/35 bg-gradient-to-b from-violet-500/25 to-slate-900 text-xs font-semibold text-violet-100">
                    <img id="mobile-account-photo"${profilePhotoSrc ? ` src="${escapeHtml(profilePhotoSrc)}"` : ''} alt="" class="absolute inset-0 h-full w-full object-cover ${profilePhotoSrc ? '' : 'hidden'}" decoding="async" onerror="this.classList.add('hidden');var i=document.getElementById('mobile-account-initial');if(i)i.classList.remove('hidden');" />
                    <span id="mobile-account-initial" class="${profilePhotoSrc ? 'hidden' : ''}">${accountInitial}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[11px] uppercase tracking-wide text-slate-500">Account</p>
                    <p class="truncate text-sm font-medium text-slate-200">${escapeHtml((user && user.name) || (user && user.email) || 'Profile')}</p>
                  </div>
                </a>
                 <nav class="space-y-2">${mobileUserLinks}</nav>
                 <button type="button" onclick="logout()" class="mt-5 w-full rounded-xl border border-slate-700/80 px-3 py-2.5 text-sm text-slate-200 hover:bg-slate-800/80 hover:text-white">Logout</button>
               </div>
             </div>`
          : ''
      }
      ${
        !isLoggedIn
          ? `<div class="hidden md:flex sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-700/40 px-4 py-2 items-center justify-between">
               <a href="/" class="flex items-center gap-2 text-white font-semibold"><span class="text-xl icon-bounce">${brandMark('h-6 w-6 text-violet-300')}</span><span>Hairvelous</span></a>
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
           <div id="app-top-bar" class="hidden md:flex fixed top-0 left-0 right-0 z-[55] h-14 pl-24 lg:pl-[18rem] pr-6 items-center border-b border-slate-700/40 bg-slate-900/95 backdrop-blur pointer-events-none">
             <a href="/" class="pointer-events-auto flex items-center gap-2 text-white font-semibold min-w-0">
               <span class="text-2xl icon-bounce">${brandMark('h-7 w-7 text-violet-300')}</span>
               <span>Hairvelous</span>
             </a>
           </div>
           <div id="notification-root" class="hidden md:flex fixed top-1.5 right-6 z-[65] flex-nowrap items-center justify-end gap-2">
             ${
              showPlanInTopBar
                ? `<div id="top-plan-chip" class="pointer-events-auto hidden lg:inline-flex shrink-0 whitespace-nowrap items-center rounded-lg border border-slate-700/80 bg-slate-900/95 px-2.5 py-1.5 text-[11px] text-slate-300 shadow-[0_8px_24px_rgba(2,6,23,0.45)] ${
                    pricingPageActive ? 'ring-1 ring-violet-500/30' : ''
                  }">
                    <span id="top-plan-label" class="font-medium">Plan</span>
                    <span class="mx-1.5 text-slate-600">|</span>
                    <a id="top-plan-upgrade-link" href="/pricing.html" class="font-semibold text-violet-300 hover:text-violet-200 underline-offset-2 hover:underline">Upgrade</a>
                  </div>`
                 : ''
             }
             <div class="relative shrink-0">
               <button type="button" id="notification-bell" class="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/95 text-lg text-white shadow-[0_8px_24px_rgba(2,6,23,0.45)] hover:bg-slate-800 hover:border-violet-500/40 transition-colors" title="Notifications" aria-label="Notifications">
                 <span aria-hidden="true">${iconSvg('bell', 'h-5 w-5')}</span>
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
           <aside id="app-sidebar" class="app-sidebar hidden md:flex fixed left-0 top-14 bottom-0 w-[15rem] flex-col overflow-hidden rounded-none border-r border-slate-800/90 bg-slate-950 shadow-[4px_0_24px_rgba(2,6,23,0.45)]">
             <a href="/profile-edit.html" class="group flex items-center gap-3 border-b border-slate-800/80 px-3 pt-3 pb-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
               profilePageActive
                 ? 'bg-violet-500/20 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.12)] ring-1 ring-inset ring-violet-500/30'
                 : 'hover:bg-slate-800/55'
             }" title="${escapeHtml('Your profile — ' + (user.email || ''))}" aria-label="Account and profile">
               <div id="sidebar-account-avatar" class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-500/35 bg-gradient-to-b from-violet-500/25 to-slate-900 text-sm font-semibold text-violet-100 group-hover:border-violet-400/50" aria-hidden="true">
                 <img id="sidebar-account-photo"${profilePhotoSrc ? ` src="${escapeHtml(profilePhotoSrc)}"` : ''} alt="" class="absolute inset-0 h-full w-full object-cover ${profilePhotoSrc ? '' : 'hidden'}" decoding="async" onerror="this.classList.add('hidden');var i=document.getElementById('sidebar-account-initial');if(i)i.classList.remove('hidden');" />
                 <span id="sidebar-account-initial" class="relative z-0 ${profilePhotoSrc ? 'hidden' : ''}">${accountInitial}</span>
               </div>
              <div class="min-w-0 flex-1">
                <p class="text-[11px] font-medium uppercase tracking-wider ${profilePageActive ? 'text-violet-200/95' : 'text-slate-500 group-hover:text-slate-400'}">Account</p>
                <p class="text-xs text-slate-300 truncate">${escapeHtml((user && user.name) || (user && user.email) || 'Profile')}</p>
              </div>
             </a>
             <nav class="flex min-h-0 flex-1 flex-col items-stretch gap-1 overflow-y-auto overscroll-contain px-2 py-2" aria-label="Main navigation">
               ${userLinks}
             </nav>
             <div class="flex flex-col items-stretch gap-1.5 border-t border-slate-800/80 px-2 pb-2.5 pt-2">
               <button type="button" onclick="logout()" class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-white" title="Log out">
                 <span class="text-base leading-none shrink-0" aria-hidden="true">${iconSvg('logout', 'h-4 w-4')}</span>
                 <span class="text-[12px] font-semibold leading-tight">Logout</span>
               </button>
               <button type="button" id="sidebar-collapse-btn" class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-white" title="Collapse menu" aria-expanded="true" aria-label="Collapse navigation">
                 <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                 <span class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Hide menu</span>
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
  const baseResponsiveClasses =
    'pointer-events-auto hidden lg:inline-flex shrink-0 whitespace-nowrap items-center rounded-lg px-2.5 py-1.5 text-[11px] shadow-[0_8px_24px_rgba(2,6,23,0.45)]';
  try {
    const data = await api('/billing/status');
    const status = (data && data.status) || {};
    if (status.isPro) {
      label.textContent = 'Pro plan';
      upgradeLink.textContent = 'Manage';
      upgradeLink.href = '/pricing.html';
      chip.className =
        `${baseResponsiveClasses} border border-emerald-700/50 bg-emerald-900/25 text-emerald-200`;
    } else {
      label.textContent = 'Free plan';
      upgradeLink.textContent = 'Upgrade';
      upgradeLink.href = '/pricing.html';
      chip.className =
        `${baseResponsiveClasses} border border-slate-700/80 bg-slate-900/95 text-slate-300`;
    }
  } catch (_err) {
    label.textContent = 'Free plan';
    upgradeLink.textContent = 'Upgrade';
    upgradeLink.href = '/pricing.html';
    chip.className =
      `${baseResponsiveClasses} border border-slate-700/80 bg-slate-900/95 text-slate-300`;
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
  const safe = url && typeof url === 'string' && url.trim().startsWith('/') ? url.trim() : '';
  const targets = [
    { img: document.getElementById('sidebar-account-photo'), initial: document.getElementById('sidebar-account-initial') },
    { img: document.getElementById('mobile-account-photo'), initial: document.getElementById('mobile-account-initial') },
  ];
  targets.forEach(({ img, initial }) => {
    if (!img || !initial) return;
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
  });
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

function initMobileMenu() {
  const panel = document.getElementById('mobile-menu-panel');
  const toggle = document.getElementById('mobile-menu-toggle');
  if (!panel || !toggle) return;
  const closeBtn = document.getElementById('mobile-menu-close');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  function setOpen(open) {
    panel.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('overflow-hidden', open);
  }

  toggle.addEventListener('click', () => {
    setOpen(panel.classList.contains('hidden'));
  });
  closeBtn?.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) setOpen(false);
  });
}

function initLayout() {
  loadAnimationsCSS();
  loadBrandConsistencyCSS();
  const navPlaceholder = document.getElementById('nav-placeholder');

  if (navPlaceholder) {
    navPlaceholder.innerHTML = renderNav();
    loadTopPlanBadge();
    initNotificationBell();
    initMobileMenu();
    initSidebarToggle();
    if (typeof getToken === 'function' && getToken() && typeof getUser === 'function' && getUser() && typeof api === 'function') {
      api('/profile')
        .then((p) => {
          const u = getUser();
          if (u) {
            setUser({
              ...u,
              profilePhotoUrl: (p && p.profilePhotoUrl) || '',
              name: (p && p.name) || u.name,
              email: (p && p.email) || u.email,
            });
          }
          syncAccountAvatarFromProfile((p && p.profilePhotoUrl) || '');
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
    if (btn.hasAttribute('data-no-btn-primary') || btn.classList.contains('no-btn-primary')) return;
    if (!btn.classList.contains('btn-primary')) {
      btn.classList.add('btn-primary');
    }
  });

  // Ensure lazy-loaded images become visible once loaded.
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    const markLoaded = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
      return;
    }
    img.addEventListener('load', markLoaded, { once: true });
    img.addEventListener('error', markLoaded, { once: true });
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

// When returning with browser Back/Forward, some browsers restore the previous
// page from bfcache including inline styles (e.g. opacity: 0 from fade-out).
// Ensure page is visible after history navigation.
window.addEventListener('pageshow', () => {
  document.body.style.opacity = '1';
  if (!document.body.style.transition) {
    document.body.style.transition = 'opacity 0.2s ease-in';
  }
});

// Auto-init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayout);
} else {
  initLayout();
}