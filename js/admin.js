/* ============================================================
   Northbridge — Admin console logic (vanilla)
   One data + state model drives BOTH the desktop and mobile layouts.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Data ---------- */
  var MSGS = [
    { name: 'Sofia Lindqvist', email: 'sofia.lindqvist@meridian.com', subj: 'RFP: Operating model review', time: '9:24 AM', service: 'Operations', unread: true,
      prev: 'Hello, we are preparing an RFP for a group-wide operating…',
      body: 'Hello, we are preparing an RFP for a group-wide operating model review beginning Q4. Could you share your availability for a scoping call next week, along with relevant case studies from the energy sector? We would also appreciate an indicative team structure and timeline.' },
    { name: 'James Park', email: 'j.park@helixlog.com', subj: 'Follow-up: control tower phase 2', time: 'Yesterday', service: 'Digital', unread: true,
      prev: 'Thanks for the phase 1 readout. Board has approved…',
      body: 'Thanks for the phase 1 readout. The board has approved budget for phase 2 of the control tower rollout. Can we lock a kickoff date in the first week of August and confirm the same engagement team?' },
    { name: 'Amelia Torres', email: 'a.torres@corvane.io', subj: 'Market entry — LATAM expansion', time: 'Yesterday', service: 'Strategy', unread: false,
      prev: 'Following our call, sending over the market data…',
      body: 'Following our call, I am sending over the market data room access. We would like your view on Mexico vs. Colombia as the first entry market, and a rough sizing of the regulatory effort in each.' },
    { name: 'Robert Klein', email: 'rklein@primera.co', subj: 'Speaking request: FutureOps 2026', time: 'Jul 2', service: 'General', unread: false,
      prev: 'We would be honored to have a Northbridge partner…',
      body: 'We would be honored to have a Northbridge partner keynote the operations track at FutureOps 2026 in Amsterdam, October 14–15. Happy to share the agenda and audience profile if there is interest.' },
    { name: 'Hana Yoshida', email: 'hana.y@atlasfin.com', subj: 'Invoice #2041 clarification', time: 'Jun 30', service: 'Finance', unread: false,
      prev: 'Quick question on the June invoice — the travel line…',
      body: 'Quick question on the June invoice — the travel line item seems to cover two trips but we only have one in our records. Could your finance team send the breakdown? No urgency.' }
  ];

  var SECS = [
    { id: 'hero', name: 'Hero', meta: 'Headline, subcopy, hero image, 2 CTAs' },
    { id: 'about', name: 'About', meta: 'Story, 3 proof points, image' },
    { id: 'services', name: 'Services', meta: '6 service cards' },
    { id: 'stats', name: 'Stats band', meta: '4 key metrics' },
    { id: 'projects', name: 'Projects', meta: '4 case studies' },
    { id: 'team', name: 'Team', meta: '4 leadership profiles' },
    { id: 'testimonials', name: 'Testimonials', meta: '3 client quotes' },
    { id: 'clients', name: 'Client logos', meta: '6 partner wordmarks' },
    { id: 'contact', name: 'Contact', meta: 'Form + office details' }
  ];

  var PROJS = [
    { name: 'Operating model redesign', client: 'Meridian Energy', status: 'On track', pct: 72, val: '$1.2M', due: 'Aug 30' },
    { name: 'PMI workstream 3', client: 'Atlas Financial', status: 'At risk', pct: 41, val: '$860K', due: 'Jul 18' },
    { name: 'Control tower — phase 2', client: 'Helix Logistics', status: 'On track', pct: 58, val: '$940K', due: 'Sep 12' },
    { name: 'LATAM entry study', client: 'Corvane Health', status: 'Completed', pct: 100, val: '$310K', due: 'Jun 20' },
    { name: 'Cost excellence program', client: 'Primera Group', status: 'On track', pct: 25, val: '$520K', due: 'Oct 3' },
    { name: 'Diligence support', client: 'Nordfelt AB', status: 'Planned', pct: 8, val: '$180K', due: 'Nov 1' }
  ];

  var TEAM = [
    { init: 'EV', name: 'Eleanor Voss', role: 'Chief Executive Officer', dept: 'Executive', status: 'Active' },
    { init: 'MC', name: 'Marcus Chen', role: 'Chief Operations Officer', dept: 'Executive', status: 'Active' },
    { init: 'AO', name: 'Amara Okafor', role: 'Director, Advisory', dept: 'Advisory', status: 'Active' },
    { init: 'DR', name: 'Daniel Reyes', role: 'Head of Digital', dept: 'Digital', status: 'On leave' },
    { init: 'IH', name: 'Ingrid Halvorsen', role: 'Finance Lead', dept: 'Finance', status: 'Active' },
    { init: 'TS', name: 'Tomas Silva', role: 'Senior Consultant', dept: 'Advisory', status: 'Active' }
  ];

  var INQ_BARS = [
    { nm: 'Strategy', v: 38, w: 88 }, { nm: 'Digital', v: 30, w: 70 }, { nm: 'Operations', v: 24, w: 56 },
    { nm: 'Financial', v: 18, w: 42 }, { nm: 'Risk', v: 12, w: 28 }, { nm: 'People', v: 10, w: 23 }
  ];

  var CHIP = {
    'On track': 'chip-green', 'Completed': 'chip-green', 'Active': 'chip-green',
    'At risk': 'chip-amber', 'On leave': 'chip-amber', 'Planned': 'chip-grey'
  };
  var TITLES = { overview: 'Overview', content: 'Content management', messages: 'Messages', team: 'Team', projects: 'Projects', settings: 'Settings' };
  var TITLES_M = { overview: 'Overview', content: 'Content', messages: 'Inbox', projects: 'Projects', settings: 'Settings' };

  /* ---------- State ---------- */
  var state = {
    panel: 'overview',
    msgSel: 0,
    mOpen: -1,
    sections: { hero: true, about: true, services: true, stats: true, team: true, projects: true, testimonials: true, clients: false, contact: true },
    prefs: { notif: true, report: true, maint: false }
  };

  var initials = function (n) { return n.split(' ').map(function (w) { return w[0]; }).join(''); };
  var $ = function (id) { return document.getElementById(id); };
  var set = function (id, html) { var el = $(id); if (el) el.innerHTML = html; };

  /* ---------- Static renders (once) ---------- */
  set('inq-bars', INQ_BARS.map(function (b, i) {
    var op = [1, .85, .7, .55, .4, .3][i];
    return '<div class="bar-row"><span class="nm">' + b.nm + '</span>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + b.w + '%;opacity:' + op + '"></div></div>' +
      '<span class="vv">' + b.v + '</span></div>';
  }).join(''));

  set('team-cards', TEAM.map(function (t) {
    return '<div class="tm-card"><div class="tm-top"><div class="tm-av">' + t.init + '</div>' +
      '<div style="min-width:0"><div class="tm-name">' + t.name + '</div><div class="tm-role">' + t.role + '</div></div></div>' +
      '<div class="tm-foot"><div style="display:flex;align-items:center;gap:8px"><span class="chip ' + CHIP[t.status] + '">' + t.status + '</span>' +
      '<span class="dept">' + t.dept + '</span></div>' +
      '<div class="tm-icons"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"></rect><polyline points="22 6 12 13 2 6"></polyline></svg>' +
      '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"></path></svg></div></div></div>';
  }).join(''));

  set('proj-rows', PROJS.map(function (p) {
    var barC = p.status === 'Completed' ? '#12A150' : 'var(--brand)';
    return '<div class="tbl-row"><div class="pn trunc">' + p.name + '</div><div class="cl">' + p.client + '</div>' +
      '<span class="chip ' + CHIP[p.status] + '" style="justify-self:start">' + p.status + '</span>' +
      '<div class="tbl-prog"><div class="track"><div class="fill" style="width:' + p.pct + '%;background:' + barC + '"></div></div><span class="pct">' + p.pct + '%</span></div>' +
      '<div class="vl">' + p.val + '</div><div class="du">' + p.due + '</div></div>';
  }).join(''));

  set('am-proj-list', PROJS.map(function (p) {
    var barC = p.status === 'Completed' ? '#12A150' : 'var(--brand)';
    return '<div class="am-proj"><div class="top"><div style="min-width:0"><div class="nm trunc">' + p.name + '</div><div class="cl">' + p.client + '</div></div>' +
      '<span class="chip ' + CHIP[p.status] + '">' + p.status + '</span></div>' +
      '<div class="prog"><div class="track"><div class="fill" style="width:' + p.pct + '%;background:' + barC + '"></div></div><span class="pct">' + p.pct + '%</span></div>' +
      '<div class="foot"><span class="vl">' + p.val + '</span><span>Due ' + p.due + '</span></div></div>';
  }).join(''));

  // Recent inquiries (first 4) — desktop table + mobile compact
  set('recent-inq', MSGS.slice(0, 4).map(function (m) {
    var repl = m.unread ? { c: 'chip-brand', t: 'New' } : { c: 'chip-green', t: 'Replied' };
    return '<div class="inq-row"><div class="inq-who"><div class="inq-av">' + initials(m.name) + '</div>' +
      '<div style="min-width:0"><div class="inq-name trunc">' + m.name + '</div><div class="inq-email trunc">' + m.email + '</div></div></div>' +
      '<div class="inq-subj trunc">' + m.subj + '</div><div class="inq-time">' + m.time + '</div>' +
      '<span class="chip ' + repl.c + '" style="justify-self:start">' + repl.t + '</span></div>';
  }).join(''));

  set('am-recent', MSGS.slice(0, 3).map(function (m) {
    return '<div class="am-inq"><div class="av">' + initials(m.name) + '</div>' +
      '<div style="flex:1;min-width:0"><div class="nm trunc">' + m.name + '</div><div class="sj trunc">' + m.subj + '</div></div>' +
      '<span class="tm">' + m.time + '</span></div>';
  }).join(''));

  /* ---------- State-driven renders ---------- */
  function renderSections() {
    var hidden = SECS.filter(function (s) { return !state.sections[s.id]; }).length;
    if ($('hidden-count')) $('hidden-count').textContent = hidden;
    if ($('am-hidden-count')) $('am-hidden-count').textContent = hidden;

    set('sec-list', SECS.map(function (s) {
      var on = state.sections[s.id];
      return '<div class="sec-row" style="opacity:' + (on ? 1 : .55) + '">' +
        '<svg class="grip" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.7"></circle><circle cx="15" cy="6" r="1.7"></circle><circle cx="9" cy="12" r="1.7"></circle><circle cx="15" cy="12" r="1.7"></circle><circle cx="9" cy="18" r="1.7"></circle><circle cx="15" cy="18" r="1.7"></circle></svg>' +
        '<div style="min-width:0"><div class="nm">' + s.name + '</div><div class="meta">' + s.meta + '</div></div>' +
        '<span class="chip ' + (on ? 'chip-green' : 'chip-grey') + '" style="justify-self:start">' + (on ? 'Published' : 'Hidden') + '</span>' +
        '<button class="toggle ' + (on ? 'on' : '') + '" data-sec="' + s.id + '"><span class="knob"></span></button>' +
        '<button class="edit-btn"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"></path></svg>Edit</button></div>';
    }).join(''));

    set('am-sec-list', SECS.map(function (s) {
      var on = state.sections[s.id];
      return '<div class="am-secrow" style="opacity:' + (on ? 1 : .55) + '">' +
        '<div style="flex:1;min-width:0"><div class="nm">' + s.name + '</div><div class="meta trunc">' + s.meta + '</div></div>' +
        '<span class="chip ' + (on ? 'chip-green' : 'chip-grey') + '">' + (on ? 'Published' : 'Hidden') + '</span>' +
        '<button class="toggle ' + (on ? 'on' : '') + '" data-sec="' + s.id + '"><span class="knob"></span></button></div>';
    }).join(''));
  }

  function renderMessages() {
    set('msg-list', MSGS.map(function (m, i) {
      return '<div class="msg-item ' + (i === state.msgSel ? 'sel' : '') + '" data-msg="' + i + '">' +
        '<div class="r1"><div class="msg-av">' + initials(m.name) + '</div>' +
        '<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
        '<span class="name trunc">' + m.name + '</span><span class="time">' + m.time + '</span></div>' +
        '<div class="r2"><span class="msg-dot" style="opacity:' + (m.unread ? 1 : 0) + '"></span><span class="subj trunc">' + m.subj + '</span></div>' +
        '<div class="prev trunc">' + m.prev + '</div></div></div></div>';
    }).join(''));

    var m = MSGS[state.msgSel];
    if ($('rd-subj')) {
      $('rd-subj').textContent = m.subj;
      $('rd-init').textContent = initials(m.name);
      $('rd-name').textContent = m.name;
      $('rd-email').textContent = ' · ' + m.email;
      $('rd-service').textContent = m.service;
      $('rd-time').textContent = m.time;
      $('rd-body').textContent = m.body;
    }
  }

  function renderMobileInbox() {
    set('am-msg-list', MSGS.map(function (m, i) {
      var open = state.mOpen === i;
      return '<div class="am-msg ' + (open ? 'open' : '') + '">' +
        '<div class="am-msg-head" data-mmsg="' + i + '"><div class="av">' + initials(m.name) + '</div>' +
        '<div style="flex:1;min-width:0"><div class="r1"><span class="msg-dot" style="opacity:' + (m.unread ? 1 : 0) + '"></span>' +
        '<span class="name trunc">' + m.name + '</span><span class="time">' + m.time + '</span></div>' +
        '<div class="subj trunc">' + m.subj + '</div></div>' +
        '<svg class="chev" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>' +
        '<div class="am-msg-body"><div class="bd">' + m.body + '</div>' +
        '<div class="am-msg-acts"><button class="rep">Reply</button><button class="arc">Archive</button></div></div></div>';
    }).join(''));
  }

  function renderPrefs() {
    document.querySelectorAll('.toggle[data-pref]').forEach(function (t) {
      t.classList.toggle('on', !!state.prefs[t.getAttribute('data-pref')]);
    });
  }

  /* ---------- Panel switching (drives desktop + mobile together) ---------- */
  function setPanel(panel) {
    state.panel = panel;
    // desktop
    document.querySelectorAll('.sb-item').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-panel') === panel); });
    document.querySelectorAll('.panel').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === panel); });
    if ($('panel-title')) $('panel-title').textContent = TITLES[panel] || 'Overview';
    // mobile (messages panel id shared; mobile calls it Inbox)
    document.querySelectorAll('.am-navbtn').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-panel') === panel); });
    document.querySelectorAll('.am-panel').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === panel); });
    if ($('am-title')) $('am-title').textContent = TITLES_M[panel] || 'Overview';
    var ds = document.querySelector('.admin-scroll'); if (ds) ds.scrollTop = 0;
    var ms = document.querySelector('.am-scroll'); if (ms) ms.scrollTop = 0;
  }

  /* ---------- One delegated click handler ---------- */
  document.addEventListener('click', function (e) {
    // Most-specific first, so a toggle inside a row wins over the row itself.
    var sec = e.target.closest('[data-sec]');
    if (sec) { var id = sec.getAttribute('data-sec'); state.sections[id] = !state.sections[id]; renderSections(); return; }

    var pref = e.target.closest('[data-pref]');
    if (pref) { var k = pref.getAttribute('data-pref'); state.prefs[k] = !state.prefs[k]; renderPrefs(); return; }

    var msg = e.target.closest('[data-msg]');
    if (msg) { state.msgSel = parseInt(msg.getAttribute('data-msg'), 10); renderMessages(); return; }

    var mmsg = e.target.closest('[data-mmsg]');
    if (mmsg) { var i = parseInt(mmsg.getAttribute('data-mmsg'), 10); state.mOpen = state.mOpen === i ? -1 : i; renderMobileInbox(); return; }

    var nav = e.target.closest('[data-panel]');
    if (nav) { setPanel(nav.getAttribute('data-panel')); return; }
  });

  /* ---------- Init ---------- */
  renderSections();
  renderMessages();
  renderMobileInbox();
  renderPrefs();
  setPanel('overview');
})();
