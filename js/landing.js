/* ============================================================
   Northbridge — Landing interactivity (vanilla)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Icon set (inline SVG paths) ---------- */
  var svg = function (inner, w) {
    w = w || 22;
    return '<svg viewBox="0 0 24 24" style="width:' + w + 'px;height:' + w + 'px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round">' + inner + '</svg>';
  };
  var ICONS = {
    compass: '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"></polygon>',
    trend:   '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
    bars:    '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>',
    shield:  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
    users:   '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
  };
  var CHEV = '<svg class="chev" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>';

  /* ---------- Data ---------- */
  var SERVICES = [
    { icon: 'compass', title: 'Strategy & Advisory',      desc: 'Market entry, growth planning, and board-level decision support.', mdesc: 'Market entry, growth, board support' },
    { icon: 'trend',   title: 'Financial Consulting',     desc: 'Capital planning, valuation, and performance management.',        mdesc: 'Capital planning, valuation, FP&A' },
    { icon: 'monitor', title: 'Digital Transformation',   desc: 'Legacy modernization, data platforms, and enterprise roadmaps.',  mdesc: 'Modernization, data, roadmaps' },
    { icon: 'bars',    title: 'Operations Excellence',    desc: 'Process design, supply chain, and cost optimization programs.',   mdesc: 'Process, supply chain, cost' },
    { icon: 'shield',  title: 'Risk & Compliance',        desc: 'Governance frameworks, audit readiness, regulatory alignment.',   mdesc: 'Governance, audit, regulatory' },
    { icon: 'users',   title: 'People & Organization',    desc: 'Workforce design, leadership development, change management.',     mdesc: 'Workforce, leadership, change' }
  ];

  var PROJECTS = [
    { tag: 'OPERATIONS', year: '2025', title: 'Meridian Energy — operating model redesign', desc: 'Group-wide redesign across 6 business units; 18% cost-to-serve reduction in year one.' },
    { tag: 'ADVISORY',   year: '2025', title: 'Atlas Financial — post-merger integration',  desc: 'Integration office for a $2.1B merger; synergy targets hit two quarters early.' },
    { tag: 'DIGITAL',    year: '2024', title: 'Helix Logistics — digital control tower',    desc: 'Real-time network visibility across 40 hubs; on-time delivery up 11 points.' },
    { tag: 'STRATEGY',   year: '2024', title: 'Corvane Health — market entry strategy',     desc: 'LATAM entry roadmap and partner search; first market live in 9 months.' }
  ];

  var TEAM = [
    { init: 'EV', name: 'Eleanor Voss',  role: 'Chief Executive Officer', style: 'tint' },
    { init: 'MC', name: 'Marcus Chen',   role: 'Chief Operations Officer', style: 'navy' },
    { init: 'AO', name: 'Amara Okafor',  role: 'Director, Advisory',       style: 'brand' },
    { init: 'DR', name: 'Daniel Reyes',  role: 'Head of Digital',          style: 'tint' }
  ];

  var TESTIMONIALS = [
    { quote: 'Northbridge brought discipline to a transformation we had struggled with for years. The results exceeded every target.', init: 'SL', name: 'Sofia Lindqvist', role: 'CFO, Meridian Energy', style: 'tint' },
    { quote: 'A rare combination of board-level thinking and hands-on delivery. They stayed until the numbers moved.',              init: 'JP', name: 'James Park',      role: 'CEO, Helix Logistics', style: 'navy' },
    { quote: 'They operate as an extension of our leadership team, not an external vendor. We renew every year without hesitation.',  init: 'PN', name: 'Priya Nair',     role: 'VP Strategy, Atlas Financial', style: 'brand' }
  ];

  var avClass = { tint: 'av-tint', navy: 'av-navy', brand: 'av-brand' };
  function avatarStyle(style) {
    if (style === 'navy') return 'background:var(--navy);color:#fff';
    if (style === 'brand') return 'background:var(--brand);color:#fff';
    return 'background:var(--tint);color:var(--brand);border:1px solid var(--tint-brd)';
  }

  /* ---------- Render: desktop grids ---------- */
  function render(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }

  render('services-grid', SERVICES.map(function (s) {
    return '<div class="svc-card"><div class="svc-ic">' + svg(ICONS[s.icon]) + '</div>' +
      '<h3>' + s.title + '</h3><p>' + s.desc + '</p></div>';
  }).join(''));

  render('projects-grid', PROJECTS.map(function (p) {
    return '<div class="proj-card"><div class="img-slot proj-img">Project image</div>' +
      '<div class="proj-body"><div class="proj-top"><span class="tag">' + p.tag + '</span><span class="year">' + p.year + '</span></div>' +
      '<h3>' + p.title + '</h3><p>' + p.desc + '</p></div></div>';
  }).join(''));

  render('team-grid', TEAM.map(function (t) {
    return '<div class="team-card"><div class="team-av" style="' + avatarStyle(t.style) + '">' + t.init + '</div>' +
      '<div class="nm">' + t.name + '</div><div class="rl">' + t.role + '</div></div>';
  }).join(''));

  render('testi-grid', TESTIMONIALS.map(function (q) {
    return '<div class="quote-card"><div class="mark">“</div><p>' + q.quote + '</p>' +
      '<div class="quote-who"><div class="qa" style="' + avatarStyle(q.style) + '">' + q.init + '</div>' +
      '<div><div class="qn">' + q.name + '</div><div class="qr">' + q.role + '</div></div></div></div>';
  }).join(''));

  render('m-services', SERVICES.map(function (s) {
    return '<div class="m-row"><div class="ic">' + svg(ICONS[s.icon], 19) + '</div>' +
      '<div class="tx"><div class="nm">' + s.title + '</div><div class="ds">' + s.mdesc + '</div></div>' + CHEV + '</div>';
  }).join(''));

  /* ---------- Desktop: smooth-scroll nav + active state ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-scroll]'));
  navLinks.forEach(function (el) {
    el.addEventListener('click', function () {
      var target = document.getElementById(el.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  var sections = ['lp-hero', 'lp-about', 'lp-services', 'lp-projects', 'lp-team', 'lp-contact'];
  var linkFor = {};
  document.querySelectorAll('.nav-links a[data-scroll]').forEach(function (a) { linkFor[a.getAttribute('data-scroll')] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && linkFor[e.target.id]) {
          Object.keys(linkFor).forEach(function (k) { linkFor[k].classList.remove('active'); });
          linkFor[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Mobile: tab switching ---------- */
  var mTabs = document.querySelectorAll('.m-tab');
  var mBtns = document.querySelectorAll('.m-navbtn');
  function setMTab(view) {
    mTabs.forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-view') === view); });
    mBtns.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-mtab') === view); });
    var scroller = document.querySelector('.lp-mobile .m-view');
    if (scroller) window.scrollTo({ top: 0 });
  }
  document.querySelectorAll('[data-mtab]').forEach(function (b) {
    b.addEventListener('click', function () { setMTab(b.getAttribute('data-mtab')); });
  });
})();
