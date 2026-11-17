/* 思达启航 · 菲律宾游学前60天 英语学习网页版 */
(function () {
  'use strict';
  var DATA = JSON.parse(document.getElementById('course-data').textContent);
  var app = document.getElementById('app');

  /* ---------- storage (per device, safe) ---------- */
  var mem = {};
  var KEY = 'sida60:';
  function load(k, d) {
    try { var v = localStorage.getItem(KEY + k); if (v != null) return JSON.parse(v); } catch (e) {}
    return k in mem ? mem[k] : d;
  }
  function save(k, v) {
    mem[k] = v;
    try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {}
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function daysBetween(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var DAYS = DATA.days;
  function dayById(n) { return DAYS[n - 1]; }
  function isEnglish(t) { var a = (t.match(/[A-Za-z]/g) || []).length; return a >= 4 && a / t.replace(/\s/g, '').length > 0.6; }

  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>',
    speak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3.5" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15.5v-2l-8-5V3.8a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" fill="currentColor"/></svg>',
    loop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10a5 5 0 0 1 5-5h7m0 0l-3-3m3 3l-3 3M19 14a5 5 0 0 1-5 5H7m0 0l3 3m-3-3l3-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------- progress state ---------- */
  function progress() { return load('progress', { done: {}, reviews: {} }); }
  function setDone(n) { var p = progress(); if (!p.done[n]) p.done[n] = today(); save('progress', p); save('last', n); }
  function doneCount() { return Object.keys(progress().done).length; }
  function nextDay() {
    var p = progress();
    for (var i = 1; i <= 60; i++) if (!p.done[i]) return i;
    return 60;
  }
  /* 隔天复习：学完后的第2、4、7天 = 学完日 +1、+3、+6 */
  var REVIEW_GAPS = [1, 3, 6];
  function dueReviews() {
    var p = progress(), t = today(), due = [];
    Object.keys(p.done).forEach(function (k) {
      var gap = daysBetween(p.done[k], t);
      if (REVIEW_GAPS.indexOf(gap) > -1 && !(p.reviews[k] && p.reviews[k].indexOf(t) > -1)) due.push(+k);
    });
    return due.sort(function (a, b) { return a - b; });
  }
  function markReviewed(n) { var p = progress(); p.reviews[n] = p.reviews[n] || []; if (p.reviews[n].indexOf(today()) < 0) p.reviews[n].push(today()); save('progress', p); }

  /* ---------- one clip per item (American voice recordings) ---------- */
  var clip = new Audio(); clip.preload = 'auto';
  /* preview build packs clips into per-day bundles; the website build uses one mp3 per item */
  var BUNDLED = !!window.__CLIPMAP__, clipData = {}, bundleLoading = {};
  function loadBundle(key) {
    if (!bundleLoading[key]) bundleLoading[key] = fetch('bundles/' + key + '.json').then(function (r) { return r.json(); }).then(function (j) { Object.keys(j).forEach(function (k) { clipData[k] = 'data:audio/mpeg;base64,' + j[k]; }); }).catch(function () { delete bundleLoading[key]; });
    return bundleLoading[key];
  }
  function prefetchClips(root) {
    if (!BUNDLED) return;
    var keys = {};
    $$('[data-clip]', root).forEach(function (b) { var k = window.__CLIPMAP__[b.getAttribute('data-clip')]; if (k) keys[k] = 1; });
    Object.keys(keys).forEach(loadBundle);
  }
  function clipSrc(file) { return BUNDLED ? clipData[file] : 'audio/' + file; }
  var clipBtnEl = null, queue = [], queueBtn = null;
  function slow() { return !!load('slow', false); }
  function clearPlaying() { if (clipBtnEl) clipBtnEl.classList.remove('playing'); $$('.now').forEach(function (e) { e.classList.remove('now'); }); }
  function playClip(file, btn, hl) {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    clip.pause(); clearPlaying();
    clipBtnEl = btn || null; if (btn) btn.classList.add('playing'); if (hl) hl.classList.add('now');
    var src = clipSrc(file);
    if (!src) { var k = window.__CLIPMAP__[file]; if (k) loadBundle(k).then(function () { if (clipData[file]) playClip(file, btn, hl); else clearPlaying(); }); return; }
    clip.src = src; clip.playbackRate = slow() ? 0.8 : 1;
    var p = clip.play(); if (p && p.catch) p.catch(function () { clearPlaying(); });
  }
  clip.addEventListener('ended', function () {
    clearPlaying();
    if (queue.length) { var n = queue.shift(); setTimeout(function () { playClip(n.a, n.btn, n.el); }, 450); }
    else if (queueBtn) { queueBtn.classList.remove('on'); queueBtn = null; }
  });
  function stopClips() { queue = []; if (queueBtn) { queueBtn.classList.remove('on'); queueBtn = null; } clip.pause(); clearPlaying(); }
  function speakBtn(file, label) {
    if (!file) return '';
    return '<button type="button" class="speak" data-clip="' + esc(file) + '" aria-label="' + esc(label || '播放') + '">' + ICON.speak + '</button>';
  }
  function playAllBtn(scope, label) { return '<button type="button" class="btn btn-ghost playall" data-playall="' + scope + '">' + ICON.play + '<span>' + esc(label) + '</span></button>'; }
  function startQueue(scopeEl, btn) {
    stopClips();
    var items = $$('[data-clip]', scopeEl).map(function (b) { return { a: b.getAttribute('data-clip'), btn: b, el: b.closest('[data-item]') }; });
    if (!items.length) return;
    queueBtn = btn; btn.classList.add('on');
    var f = items.shift(); queue = items; playClip(f.a, f.btn, f.el);
  }

  /* ---------- audio player ---------- */
  var currentAudio = null;
  function player(src, title, note) {
    return '<div class="player" data-src="audio/' + esc(src) + '">' +
      '<button type="button" class="pl-btn" aria-label="播放">' + ICON.play + '</button>' +
      '<div class="pl-main"><div class="pl-title">' + esc(title) + '</div>' +
      '<input class="pl-bar" type="range" min="0" max="1000" value="0" aria-label="播放进度">' +
      '<div class="pl-meta"><span class="pl-time">0:00</span>' + (note ? '<span>' + esc(note) + '</span>' : '') + '</div></div>' +
      '<div class="pl-opts"><button type="button" class="pl-rate" aria-label="播放速度">1×</button>' +
      '<button type="button" class="pl-loop" aria-pressed="false" aria-label="循环播放">' + ICON.loop + '</button></div></div>';
  }
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + pad(t % 60); }
  function wirePlayers(root) {
    $$('.player', root).forEach(function (el) {
      var a = new Audio(); a.preload = 'none'; a.src = el.getAttribute('data-src');
      var btn = $('.pl-btn', el), bar = $('.pl-bar', el), time = $('.pl-time', el), rate = $('.pl-rate', el), loop = $('.pl-loop', el);
      var rates = [1, 0.75, 0.9], ri = 0;
      btn.addEventListener('click', function () {
        if (a.paused) {
          if (currentAudio && currentAudio !== a) currentAudio.pause(); stopClips();
          currentAudio = a;
          var p = a.play(); if (p && p.catch) p.catch(function () { time.textContent = '音频加载失败，请检查网络'; });
        } else a.pause();
      });
      a.addEventListener('play', function () { btn.innerHTML = ICON.pause; btn.setAttribute('aria-label', '暂停'); el.classList.add('on'); });
      a.addEventListener('pause', function () { btn.innerHTML = ICON.play; btn.setAttribute('aria-label', '播放'); el.classList.remove('on'); });
      a.addEventListener('timeupdate', function () { if (a.duration) bar.value = Math.round(a.currentTime / a.duration * 1000); time.textContent = fmt(a.currentTime) + ' / ' + fmt(a.duration); });
      a.addEventListener('loadedmetadata', function () { time.textContent = '0:00 / ' + fmt(a.duration); });
      bar.addEventListener('input', function () { if (a.duration) a.currentTime = bar.value / 1000 * a.duration; });
      rate.addEventListener('click', function () { ri = (ri + 1) % rates.length; a.playbackRate = rates[ri]; rate.textContent = rates[ri] + '×'; });
      loop.addEventListener('click', function () { a.loop = !a.loop; loop.setAttribute('aria-pressed', a.loop ? 'true' : 'false'); });
    });
  }
  function stopAudio() { if (currentAudio) { currentAudio.pause(); currentAudio = null; } stopClips(); }

  /* ---------- recorder (works on your own https site; falls back gracefully) ---------- */
  function recorder(id) {
    return '<div class="rec" data-rec="' + esc(id) + '"><button type="button" class="btn btn-ghost rec-btn">' + ICON.mic + '<span>开始录音</span></button>' +
      '<div class="rec-out" hidden></div><p class="rec-msg" hidden></p></div>';
  }
  function wireRecorders(root) {
    $$('.rec', root).forEach(function (el) {
      var btn = $('.rec-btn', el), out = $('.rec-out', el), msg = $('.rec-msg', el), mr = null, chunks = [], stream = null, t0 = 0, timer = null;
      function fail() { msg.hidden = false; msg.textContent = '这里暂时不能录音。请用手机自带的录音机录下来，再和音频对比。'; }
      btn.addEventListener('click', function () {
        if (mr && mr.state === 'recording') { mr.stop(); return; }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') { fail(); return; }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
          stream = s; chunks = []; mr = new MediaRecorder(s);
          mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
          mr.onstop = function () {
            clearInterval(timer); stream.getTracks().forEach(function (t) { t.stop(); });
            var url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' }));
            out.hidden = false;
            out.innerHTML = '<p class="small muted">我的录音（只保存在这次打开的页面里，关掉就没了）</p><audio controls src="' + url + '"></audio>';
            btn.querySelector('span').textContent = '重新录一遍'; el.classList.remove('live');
          };
          mr.start(); t0 = Date.now(); el.classList.add('live');
          timer = setInterval(function () { btn.querySelector('span').textContent = '录音中 ' + fmt((Date.now() - t0) / 1000) + '，点这里停止'; }, 300);
        }).catch(fail);
      });
    });
  }

  /* ---------- small UI builders ---------- */
  var TAGS = { '名词': 'noun', '动词': 'verb', '形容词': 'adj', '副词': 'adv', '介词': 'link', '连词': 'link', '疑问词': 'link', '数字': 'other', '礼貌用语': 'other', '固定表达': 'other', '代词': 'noun', '冠词': 'other' };
  function tag(c) { return '<span class="tag t-' + (TAGS[c] || 'other') + '">' + esc(c) + '</span>'; }
  function topbar(title, sub, backHref) {
    return '<header class="topbar"><a class="back" href="' + (backHref || '#home') + '" aria-label="返回">' + ICON.back + '</a>' +
      '<div class="tb-text"><div class="tb-sub">' + esc(sub || '') + '</div><div class="tb-title">' + esc(title) + '</div></div></header>';
  }
  function checkItem(key, label, extraCls) {
    var on = !!load('chk:' + key, false);
    return '<label class="chk ' + (extraCls || '') + '"><input type="checkbox" id="c-' + esc(key) + '" data-chk="' + esc(key) + '"' + (on ? ' checked' : '') + '><span class="box">' + ICON.check + '</span><span class="chk-l">' + esc(label) + '</span></label>';
  }
  function wireChecks(root, onChange) {
    $$('[data-chk]', root).forEach(function (i) { i.addEventListener('change', function () { save('chk:' + i.getAttribute('data-chk'), i.checked); if (onChange) onChange(); }); });
    $$('[data-note]', root).forEach(function (i) { i.addEventListener('input', function () { save('note:' + i.getAttribute('data-note'), i.value); }); });
  }
  function noteField(key, label, rows) {
    var v = load('note:' + key, '');
    var tagName = rows ? 'textarea' : 'input';
    return '<label class="field"><span>' + esc(label) + '</span><' + tagName + ' id="n-' + esc(key) + '" data-note="' + esc(key) + '"' + (rows ? ' rows="' + rows + '"' : ' type="text"') + '>' + (rows ? esc(v) + '</textarea>' : '') + '</label>';
  }
  function fixNoteValues(root) { $$('input[data-note]', root).forEach(function (i) { i.value = load('note:' + i.getAttribute('data-note'), ''); }); }

  /* ---------- timeline (days + challenges + test pages) ---------- */
  var STAGE_RANGE = [[1, 15], [16, 30], [31, 45], [46, 60]];
  function timelineFor(si) {
    var r = STAGE_RANGE[si], items = [];
    if (si === 3) {
      items.push({ kind: 'note', text: '先读入学测试攻略，再开始 Day 46' });
      Object.keys(DATA.pages).forEach(function (k) { if (DATA.pages[k].after === 45) items.push({ kind: 'page', n: +k }); });
    }
    for (var d = r[0]; d <= r[1]; d++) {
      items.push({ kind: 'day', n: d });
      Object.keys(DATA.pages).forEach(function (k) { var p = DATA.pages[k]; if (p.after === d && d >= 46 && d < 60) items.push({ kind: 'page', n: +k }); });
      DATA.weekly.forEach(function (w, i) { if (w.after === d) items.push({ kind: 'weekly', n: i + 1 }); });
      DATA.levelups.forEach(function (l, i) { if (l.after === d) items.push({ kind: 'levelup', n: i + 1 }); });
    }
    if (si === 3) { items.push({ kind: 'selfcheck' }); items.push({ kind: 'final' }); }
    return items;
  }
  function tileHTML(it) {
    var p = progress();
    if (it.kind === 'day') {
      var d = dayById(it.n), done = !!p.done[it.n];
      return '<a class="day-row' + (done ? ' done' : '') + (it.n === nextDay() && !done ? ' next' : '') + '" href="#day-' + it.n + '">' +
        '<img src="img/' + esc(d.img) + '" alt="" loading="lazy" width="64" height="57">' +
        '<span class="dr-text"><span class="dr-day">DAY ' + pad(it.n) + '</span><span class="dr-title">' + esc(d.title) + '</span></span>' +
        '<span class="dr-state">' + (done ? ICON.check : '') + '</span></a>';
    }
    if (it.kind === 'weekly') { var w = DATA.weekly[it.n - 1]; return '<a class="mini-row ch" href="#weekly-' + it.n + '"><span class="mr-k">每周挑战 ' + pad(it.n) + '</span><span>' + esc(w.title) + '</span></a>'; }
    if (it.kind === 'levelup') { var l = DATA.levelups[it.n - 1]; return '<a class="mini-row lv" href="#levelup-' + it.n + '"><span class="mr-k">阶段测试 ' + pad(it.n) + '</span><span>' + esc(l.title) + '</span></a>'; }
    if (it.kind === 'page') { return '<a class="mini-row pg" href="#page-' + it.n + '"><span class="mr-k">考试攻略</span><span>' + esc(DATA.pages[it.n].title) + '</span></a>'; }
    if (it.kind === 'selfcheck') return '<a class="mini-row pg" href="#selfcheck"><span class="mr-k">自测</span><span>题目要求看懂了吗？</span></a>';
    if (it.kind === 'final') return '<a class="mini-row lv" href="#final"><span class="mr-k">最终测试</span><span>菲律宾语言学校入学测试模拟</span></a>';
    if (it.kind === 'note') return '<p class="tl-note">' + esc(it.text) + '</p>';
    return '';
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    var n = doneCount(), nd = nextDay(), d = dayById(nd), pct = Math.round(n / 60 * 100);
    var due = dueReviews();
    var curStage = STAGE_RANGE.findIndex(function (r) { return nd >= r[0] && nd <= r[1]; });
    var h = '';
    h += '<header class="brand"><img src="img/logo.png" alt="" width="40" height="40"><div><b>思达启航</b><span>SIDA QIHANG EDUCATION</span></div><a class="brand-link" href="#contact">联系 Jenny</a></header>';
    h += '<section class="hero"><p class="eyebrow">菲律宾游学前 60 天</p><h1>英语学习计划</h1><p class="hero-sub">从不敢开口，到听懂菲律宾老师的第一堂课</p>' +
      '<div class="route" role="img" aria-label="已完成 ' + n + ' 天，共 60 天"><span class="rt-end">中国</span><div class="rt-track"><div class="rt-fill" style="width:' + pct + '%"></div><span class="rt-plane" style="left:' + pct + '%">' + ICON.plane + '</span></div><span class="rt-end">宿务</span></div>' +
      '<p class="route-cap"><b>' + n + '</b> / 60 天已完成' + (n ? '' : '，从 Day 1 开始') + '</p>' +
      '<a class="btn btn-primary btn-big" href="#day-' + nd + '"><span class="bb-k">' + (n ? '继续学习' : '开始学习') + ' · DAY ' + pad(nd) + '</span><span class="bb-t">' + esc(d.title) + '</span></a></section>';
    if (due.length) {
      h += '<section class="card review"><h2>今天要复习</h2><p class="muted small">学完后的第 2、4、7 天各复习一次，每次 5 分钟：遮住英文，把 4 句说一遍。</p><div class="chips">' +
        due.map(function (k) { return '<a class="chip" href="#day-' + k + '">DAY ' + pad(k) + ' · ' + esc(dayById(k).title) + '</a>'; }).join('') + '</div><a class="btn btn-ghost" href="#cards">用单词复习卡复习这些天的词</a></section>';
    }
    h += '<section class="sec"><h2 class="sec-h">开始之前</h2><div class="hscroll">' +
      [['#page-2', '这 60 天要解决什么'], ['#method', '怎么学最有效：每天 30 分钟'], ['#tags', '单词颜色标签怎么看'], ['#page-10', '留下你的 Day 1 录音'], ['#page-11', '准备好学习工具'], ['#info', '填写个人信息卡']].map(function (x, i) {
        return '<a class="pcard" href="' + x[0] + '"><span class="pc-n">' + pad(i + 1) + '</span><span>' + x[1] + '</span></a>';
      }).join('') + '</div></section>';
    DATA.stages.forEach(function (s, si) {
      var r = STAGE_RANGE[si], cnt = 0; for (var k = r[0]; k <= r[1]; k++) if (progress().done[k]) cnt++;
      h += '<details class="stage"' + (si === (curStage < 0 ? 0 : curStage) ? ' open' : '') + '><summary>' +
        '<div class="st-img" style="background-image:url(img/' + esc(s.img) + ')"></div>' +
        '<div class="st-text"><span class="st-code">' + esc(s.code) + ' · ' + esc(s.days) + '</span><span class="st-title">' + esc(s.title) + '</span><span class="st-desc">' + esc(s.desc) + '</span>' +
        '<span class="st-count">' + cnt + ' / 15 天</span></div></summary><div class="st-list">' + timelineFor(si).map(tileHTML).join('') + '</div></details>';
    });
    h += '<section class="sec"><h2 class="sec-h">语法入门 10 课</h2><p class="muted small" style="margin-bottom:10px">只讲入学测试最常考的语法，每课 5 分钟。学到对应那一天时也会提醒你。</p><div class="glist">' +
      '<a class="gitem zero' + (quizScore('g0', posQ()).n === posQ().length ? ' done' : '') + '" href="#grammar-0"><span class="gi-n">00</span><span class="gi-t">词性是什么<small>名词、动词、形容词……0 基础先看，会的可以跳过</small></span><span class="gi-d">先看</span></a>' +
      DATA.grammar.map(function (g) { return '<a class="gitem' + (load('quiz:g' + g.id, null) && quizScore('g' + g.id, gq(g)).n === 3 ? ' done' : '') + '" href="#grammar-' + g.id + '"><span class="gi-n">' + pad(g.id) + '</span><span class="gi-t">' + esc(g.title) + '<small>' + esc(g.sub) + '</small></span><span class="gi-d">Day ' + g.day + '</span></a>'; }).join('') + '</div></section>';
    h += '<section class="sec"><h2 class="sec-h">随身工具</h2><div class="tools">' +
      [['#cards', '单词复习卡'], ['#local', '菲律宾当地常听到的英语'], ['#pron', '中国学生常见发音问题'], ['#numbers', '数字速查：0–100 和大数字'], ['#page-239', '随身 10 句：生活求助'], ['#page-240', '随身 10 句：课堂和考试'], ['#page-180', '口试面谈常问的 10 个问题'], ['#info', '个人信息卡'], ['#page-241', '出发前英语准备清单'], ['#page-237', '到校后怎样告诉老师我的需要'], ['#page-238', 'Day 1 和 Day 60 录音对比'], ['#page-236', '我的入学前英语档案']]
        .map(function (x) { return '<a class="tool" href="' + x[0] + '">' + x[1] + '</a>'; }).join('') + '</div></section>';
    h += contactHTML();
    h += '<p class="foot">进度只保存在这台手机的浏览器里。换手机或清除浏览器数据后需要重新打勾。</p>';
    app.innerHTML = h;
  }
  function contactHTML() {
    var svc = DATA.pages['242'];
    var items = svc.blocks.filter(function (b) { return b.kind === 'row' && /^\d{2}$/.test(b.cells[0].t); }).map(function (b) { return '<li>' + esc(b.cells[1].t) + '</li>'; }).join('');
    return '<section class="contact" id="contact"><h2>需要确认学校、课程、费用或行前安排？</h2>' +
      '<div class="ct-row"><img src="img/qr.png" alt="Jenny 微信二维码" width="132" height="133"><div class="ct-text"><p class="ct-k">Jenny 微信 / 电话</p>' +
      '<p class="ct-phone"><span class="sel">13249827686</span></p><div class="ct-btns"><button type="button" class="btn btn-light" data-copy="13249827686">复制号码</button><a class="btn btn-light" href="tel:13249827686">拨打</a></div>' +
      '<p class="ct-web">官网 <a href="https://sidaqihang.com" target="_blank" rel="noopener">sidaqihang.com</a></p></div></div>' +
      '<p class="ct-k">思达启航可以协助：0 中介费菲律宾游学</p><ul class="ct-list">' + items + '</ul></section>';
  }

  function slowToggle() { return '<button type="button" class="slowtg" data-slow aria-pressed="' + slow() + '">慢速</button>'; }
  function wireSlow(root) { $$('[data-slow]', root).forEach(function (b) { b.addEventListener('click', function () { save('slow', !slow()); $$('[data-slow]').forEach(function (x) { x.setAttribute('aria-pressed', slow()); }); clip.playbackRate = slow() ? 0.8 : 1; }); }); }

  /* ---------- DAY ---------- */
  function renderDay(n) {
    var d = dayById(n); if (!d) return renderHome();
    var p = progress(), done = !!p.done[n], due = dueReviews().indexOf(n) > -1;
    save('last', n);
    var stageCode = d.stage.replace(/\s+/, ' ');
    var h = topbar(d.title, 'DAY ' + pad(n) + ' · ' + stageCode, '#home');
    h += '<main class="lesson">';
    if (due) h += '<div class="banner"><b>今天是 Day ' + n + ' 的复习日</b><span>把第 4 步切到“遮住英文”，4 句都能说出来就算完成。</span><button type="button" class="btn btn-primary" id="rev-done">复习完成</button></div>';
    // 1 scene
    h += '<section class="step" id="s1"><div class="step-h"><span class="num">1</span><h2>今天的场景</h2></div>' +
      '<div class="scene"><img src="img/' + esc(d.img) + '" alt="" width="201" height="179"><div><p class="scene-goal">' + esc(d.goal) + '</p><p class="muted small">今天学完，你应该能：看懂核心句，跟读 3 遍，完成“' + esc(d.task) + '”。</p></div></div>' +
      '<div class="try"><span class="label">先试试看</span><div class="try-row"><p class="en">' + esc(d.tryen) + '</p>' + speakBtn(d.tryA, '播放') + '</div><p class="zh">' + esc(d.tryzh) + '</p></div></section>';
    // 2 words
    h += '<section class="step" id="s2"><div class="step-h"><span class="num">2</span><h2>今天的高频词</h2></div>' +
      '<div class="audiobar">' + playAllBtn('words', '6 个词连续播放') + slowToggle() + '</div>' +
      '<div class="seg" role="group" aria-label="单词显示方式"><button type="button" class="on" data-wmode="show">看中文</button><button type="button" data-wmode="hide">遮住中文自测</button></div>' +
      '<div class="words" data-mode="show">' + d.words.map(function (w) {
        return '<div class="word" data-item><span class="w-en">' + esc(w.w) + '</span><button type="button" class="w-zh reveal">' + esc(w.m) + '</button><div class="w-foot">' + tag(w.c) + speakBtn(w.a, '播放 ' + w.w) + '</div></div>';
      }).join('') + '</div><p class="muted small">颜色代表词性：名词、动词、形容词……<a href="#tags">看说明</a></p>' +
      (n === 2 ? '<a class="mini-row pg" href="#numbers"><span class="mr-k">加练</span><span>数字速查：0–100、一万、一亿怎么说</span></a>' : '') + '</section>';
    // 3 skeleton
    h += '<section class="step" id="s3"><div class="step-h"><span class="num">3</span><h2>句子骨架</h2></div>' +
      '<p class="formula">' + esc(d.formula) + '</p><div class="breakdown">' + esc(d.breakdown) + '</div>' +
      (d.sktip ? '<p class="muted small">' + esc(d.sktip) + '</p>' : '') +
      '<div class="examples"><span class="label">换成自己的</span>' + d.exParts.map(function (e, i) { return '<div class="ex-row" data-item><p class="en">' + esc(e) + '</p>' + speakBtn(d.exA[i], '播放例句') + '</div>'; }).join('') + '</div>' +
      DATA.grammar.filter(function (g) { return g.day === n; }).map(function (g) { return '<a class="mini-row gr" href="#grammar-' + g.id + '"><span class="mr-k">今天的语法</span><span>' + esc(g.title) + '：' + esc(g.sub) + '</span></a>'; }).join('') + '</section>';
    // 4 sentences
    h += '<section class="step" id="s4"><div class="step-h"><span class="num">4</span><h2>今天的 4 句英语</h2></div>' +
      '<div class="audiobar">' + playAllBtn('sents', '4 句连续播放') + slowToggle() + '</div>' +
      '<div class="seg" role="group" aria-label="句子显示方式"><button type="button" class="on" data-smode="all">都显示</button><button type="button" data-smode="hide-en">遮住英文</button><button type="button" data-smode="hide-zh">遮住中文</button></div>' +
      '<ol class="sents" data-mode="all">' + d.sentences.map(function (s) {
        return '<li data-item><div class="s-en reveal">' + esc(s.en) + '</div>' + speakBtn(s.a, '播放这一句') + '<div class="s-zh reveal">' + esc(s.zh) + '</div></li>';
      }).join('') + '</ol><p class="muted small">遮住英文：看中文先自己说，再点一下对答案。说不出来就看一眼，遮住再说一遍。</p></section>';
    // 5 dialog
    h += '<section class="step" id="s5"><div class="step-h"><span class="num">5</span><h2>听懂一段真实对话</h2></div>' +
      '<div class="audiobar">' + playAllBtn('dialog', '整段对话连续播放') + slowToggle() + '</div><p class="muted small">第 1 遍只听谁在说话，第 2 遍对照文字。老师和工作人员是男声，学生是女声。</p>' +
      '<div class="seg" role="group" aria-label="对话显示方式"><button type="button" class="on" data-dmode="all">看全文</button><button type="button" data-dmode="hide-zh">只看英文</button><button type="button" data-dmode="role">我来演学生</button></div>' +
      '<div class="dialog" data-mode="all">' + d.dialog.map(function (l) {
        var me = l.who === 'STUDENT';
        return '<div class="bubble ' + (me ? 'me' : 'them') + '" data-item><span class="who">' + esc(l.who) + '</span><div class="b-en reveal">' + esc(l.en) + '</div><div class="b-zh">' + esc(l.zh) + '</div>' + speakBtn(l.a, '播放这一句') + '</div>';
      }).join('') + '</div><p class="gist"><span class="label">对话大意</span>' + esc(d.gist) + '</p></section>';
    // 6 your turn
    h += '<section class="step" id="s6"><div class="step-h"><span class="num">6</span><h2>轮到你：' + esc(d.yourturn.title) + '</h2></div>' +
      '<div class="task">' + esc(d.yourturn.text) + '</div>' + (d.ytAns ? '<details class="ans"><summary>做完再看参考答案</summary><p>' + esc(d.ytAns) + '</p></details>' : '') + recorder('day' + n) +
      '<div class="tip"><span class="label">' + esc(d.tiplabel) + '</span><p>' + esc(d.tip) + '</p></div>' +
      (d.jenny ? '<div class="tip jenny"><span class="label">JENNY 的提醒</span><p>' + esc(d.jenny) + '</p></div>' : '') + '</section>';
    // extra pages after this day
    var extra = [];
    Object.keys(DATA.pages).forEach(function (k) { var pg = DATA.pages[k]; if ((pg.after === n && n >= 46 && n < 60) || (n === 45 && pg.after === 45)) extra.push('<a class="mini-row pg" href="#page-' + k + '"><span class="mr-k">考试攻略</span><span>' + esc(pg.title) + '</span></a>'); });
    DATA.weekly.forEach(function (w, i) { if (w.after === n) extra.push(tileHTML({ kind: 'weekly', n: i + 1 })); });
    DATA.levelups.forEach(function (l, i) { if (l.after === n) extra.push(tileHTML({ kind: 'levelup', n: i + 1 })); });
    if (n === 60) { extra.push(tileHTML({ kind: 'selfcheck' })); extra.push(tileHTML({ kind: 'final' })); }
    // 7 check-in
    h += '<section class="step" id="s7"><div class="step-h"><span class="num">7</span><h2>打卡</h2></div><div class="checks">' +
      checkItem('d' + n + '-1', '看懂今天的核心句') + checkItem('d' + n + '-2', '跟读 3 遍') + checkItem('d' + n + '-3', '完成“' + d.yourturn.title + '”') + '</div>' +
      '<div class="mood" role="group" aria-label="今天感觉">今天感觉：' + ['有点难', '还可以', '很顺利'].map(function (m, i) {
        return '<button type="button" data-mood="' + i + '" class="' + (load('mood:' + n, -1) === i ? 'on' : '') + '">' + m + '</button>';
      }).join('') + '</div>' +
      '<button type="button" class="btn btn-primary btn-wide" id="finish">' + (done ? '已完成 · ' + esc(p.done[n]) : '完成 Day ' + n) + '</button>' +
      (extra.length ? '<div class="extra"><p class="label">学完再做</p>' + extra.join('') + '</div>' : '') + '</section>';
    h += '<nav class="pager">' + (n > 1 ? '<a class="btn btn-light" href="#day-' + (n - 1) + '">上一天</a>' : '<span></span>') + (n < 60 ? '<a class="btn btn-light" href="#day-' + (n + 1) + '">下一天</a>' : '<a class="btn btn-light" href="#final">最终测试</a>') + '</nav>';
    h += '</main>';
    app.innerHTML = h;

    // wiring
    wirePlayers(app); wireRecorders(app); wireChecks(app);
    function segWire(attr, target) {
      $$('[data-' + attr + ']', app).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('[data-' + attr + ']', b.parentNode).forEach(function (x) { x.classList.toggle('on', x === b); });
          var t = $(target, app); t.setAttribute('data-mode', b.getAttribute('data-' + attr)); $$('.revealed', t).forEach(function (r) { r.classList.remove('revealed'); });
        });
      });
    }
    segWire('wmode', '.words'); segWire('smode', '.sents'); segWire('dmode', '.dialog');
    $$('[data-playall]', app).forEach(function (b) { b.addEventListener('click', function () {
      if (b.classList.contains('on')) { stopClips(); return; }
      startQueue($('.' + b.getAttribute('data-playall'), app), b); }); });
    wireSlow(app);
    $$('.reveal', app).forEach(function (r) { r.addEventListener('click', function () { r.classList.toggle('revealed'); }); });
    $$('[data-mood]', app).forEach(function (b) { b.addEventListener('click', function () { save('mood:' + n, +b.getAttribute('data-mood')); $$('[data-mood]', app).forEach(function (x) { x.classList.toggle('on', x === b); }); }); });
    $('#finish').addEventListener('click', function () {
      setDone(n); this.textContent = '已完成 · ' + progress().done[n];
      this.insertAdjacentHTML('afterend', n < 60 ? '<a class="btn btn-light btn-wide" href="#day-' + (n + 1) + '">去 Day ' + (n + 1) + '</a>' : '');
    });
    var rv = $('#rev-done'); if (rv) rv.addEventListener('click', function () { markReviewed(n); rv.parentNode.innerHTML = '<b>复习已完成</b><span>下一次复习会自动出现在首页。</span>'; });
  }

  /* ---------- GENERIC PAGE (from the deck) ---------- */
  function renderPage(k) {
    var pg = DATA.pages[k]; if (!pg) return renderHome();
    if (+k === 224) return renderSelfCheck();
    var back = pg.after >= 45 && pg.after < 60 ? '#home' : '#home';
    var h = topbar(pg.title, pg.after >= 45 && +k < 236 ? '入学测试攻略' : '学习资料', back) + '<main class="doc">';
    var blocks = pg.blocks.slice(), out = [];
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (b.kind === 'call') {
        if (b.lines.every(function (l) { return /^□/.test(l.t.trim()); })) { b.lines.forEach(function (l, j) { out.push(checkItem('p' + k + '-' + i + '-' + j, l.t.trim().replace(/^□\s*/, ''))); }); continue; }
        out.push('<div class="call tone-' + b.tone + '">' + b.lines.map(function (l, j) {
          var lbl = j === 0 && b.lines.length > 1 && (l.c === 'F26B2D' || l.c === 'FBE7D8');
          if (/^□/.test(l.t.trim())) return checkItem('p' + k + '-' + i + '-' + j, l.t.trim().replace(/^□\s*/, ''));
          if (lbl) return '<p class="label">' + esc(l.t) + '</p>';
          return (l.subs || [{ t: l.t }]).map(function (s) { return '<p class="line" data-item>' + esc(s.t) + speakBtn(s.a) + '</p>'; }).join('');
        }).join('') + '</div>');
        continue;
      }
      var c = b.cells.filter(function (x) { return !/PPTX/.test(x.t); });
      if (!c.length) continue;
      var first = c[0].t.trim();
      if (/^\d{1,2}$/.test(first) && c.length >= 2) {
        var desc = c[2] ? c[2].t : '';
        var nb = blocks[i + 1];
        if (!desc && nb && nb.kind === 'row' && nb.cells.length === 1 && nb.cells[0].c === '68756F') { desc = nb.cells[0].t; i++; }
        out.push('<div class="num-row"><span class="nr-n">' + esc(first) + '</span><div><p class="nr-t">' + esc(c[1].t) + '</p>' + (desc ? '<p class="nr-d">' + esc(desc) + '</p>' : '') + '</div></div>');
      } else if (c.length === 1) {
        var t = c[0].t;
        if (/^□/.test(t.trim())) out.push(checkItem('p' + k + '-' + i, t.replace(/^□\s*/, '')));
        else if (c[0].c === 'F26B2D' && (c[0].sz || 0) <= 15) out.push('<p class="label">' + esc(t) + '</p>');
        else if ((c[0].sz || 0) >= 16) out.push('<p class="lead" data-item>' + esc(t).replace(/\n/g, '<br>') + speakBtn(c[0].a) + '</p>');
        else out.push('<p class="' + (c[0].c === '68756F' ? 'muted' : '') + '" data-item>' + esc(t).replace(/\n/g, '<br>') + speakBtn(c[0].a) + '</p>');
      } else if (c.every(function (x) { return /^□/.test(x.t.trim()); })) {
        c.forEach(function (x, j) { out.push(checkItem('p' + k + '-' + i + '-' + j, x.t.trim().replace(/^□\s*/, ''))); });
      } else if (c.length === 2 && /^□/.test(c[1].t.trim())) {
        out.push('<div class="pair-chk"><span class="label">' + esc(c[0].t) + '</span>' + checkItem('p' + k + '-' + i, c[1].t.replace(/^□\s*/, '')) + '</div>');
      } else {
        out.push('<div class="term c' + Math.min(c.length, 3) + '" data-item>' + c.map(function (x, j) {
          return '<span class="tc tc' + j + '">' + esc(x.t).replace(/\n/g, '<br>') + (j === 0 ? speakBtn(x.a) : '') + '</span>';
        }).join('') + '</div>');
      }
    }
    h += out.join('') + '</main>';
    if (+k === 242) h = topbar('思达启航可以协助的部分', '联系我们') + '<main class="doc">' + contactHTML() + '</main>';
    app.innerHTML = h; wireChecks(app);
  }

  /* ---------- grammar ---------- */
  function gq(g) { return g.quiz.map(function (q) { return { q: q[0], o: q[1], a: q[2] }; }); }
  function posQ() { return DATA.pos.quiz.map(function (q) { return { q: q[0], o: q[1], a: q[2] }; }); }
  function hlSentence(s, w, cls) {
    var re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
    var m = s.match(re); if (!m) return esc(s);
    return esc(s.slice(0, m.index)) + '<mark class="hl ' + cls + '">' + esc(m[0]) + '</mark>' + esc(s.slice(m.index + m[0].length));
  }
  function renderPOS() {
    var P = DATA.pos, qs = posQ();
    var h = topbar('第 0 课：词性是什么', '语法入门 · 0 基础先看') + '<main class="doc">' +
      '<div class="skip"><span>已经知道名词、动词、形容词是什么？</span><a class="btn btn-light" href="#grammar-1">跳过，去第 1 课</a></div>' +
      '<p class="lead">' + esc(P.intro) + '</p>' +
      P.items.map(function (it) {
        var cls = 't-' + (TAGS[it.zh] || 'other');
        return '<section class="pos" data-item><div class="pos-h">' + tag(it.zh) + '<span class="pos-en">' + esc(it.en) + '</span></div>' +
          '<p class="nr-t">' + esc(it.what) + '</p><p class="nr-d">怎么认：' + esc(it.how) + '</p><p class="en small">例词：' + esc(it.words) + '</p>' +
          '<div class="ex-row"><div><p class="en">' + hlSentence(it.ex, it.hl, cls) + '</p><p class="muted small">' + esc(it.exzh) + '</p></div>' + speakBtn(it.a, '播放例句') + '</div></section>';
      }).join('') +
      '<h2 class="sec-h">一个句子怎么组成</h2><div class="call tone-E8F1EC"><p>' + esc(P.build.rule) + '</p></div>' +
      P.build.ex.map(function (ex, i) { return '<div class="build" data-item><div class="segs">' + ex.map(function (sg, j) { return '<span class="seg' + j + '"><b>' + esc(sg[0]) + '</b><small>' + esc(sg[1]) + '</small></span>'; }).join('') + '</div>' + speakBtn(P.buildA[i], '播放') + '</div>'; }).join('') +
      '<h2 class="sec-h">小测：认一认</h2><div data-quiz="g0">' + quizHTML('g0', qs) + '</div>' +
      '<div class="pager"><a class="btn btn-light" href="#tags">单词颜色标签</a><a class="btn btn-primary" href="#grammar-1">去第 1 课</a></div></main>';
    app.innerHTML = h; wireQuiz('g0', qs);
  }
  function renderGrammar(id) {
    if (id === 0) return renderPOS();
    var g = DATA.grammar.filter(function (x) { return x.id === id; })[0]; if (!g) return renderHome();
    var qs = gq(g), nx = DATA.grammar.filter(function (x) { return x.id === id + 1; })[0];
    var h = topbar(g.title, '语法入门 ' + pad(g.id) + ' / 10 · 配合 Day ' + g.day) + '<main class="doc">' +
      '<p class="lead">' + esc(g.sub) + '</p><div class="call tone-E8F1EC"><p class="label">规则</p><p>' + esc(g.rule) + '</p></div>' +
      '<div class="gtable">' + g.table.map(function (r) { return '<div class="gt-row"><span class="gt-k">' + esc(r[0]) + '</span><span class="gt-v">' + esc(r[1]) + '</span></div>'; }).join('') + '</div>' +
      '<h2 class="sec-h">学过的例句</h2>' + g.ex.map(function (e, i) { return '<div class="ex-row" data-item><div><p class="en">' + esc(e[0]) + '</p><p class="muted small">' + esc(e[1]) + '</p></div>' + speakBtn(g.exA[i], '播放例句') + '</div>'; }).join('') +
      '<div class="call tone-FBE7D8"><p class="label">记住这一点</p><p>' + esc(g.tip) + '</p></div>' +
      '<h2 class="sec-h">小测：选一个</h2><div data-quiz="g' + g.id + '">' + quizHTML('g' + g.id, qs) + '</div>' +
      '<div class="pager"><a class="btn btn-light" href="#day-' + g.day + '">回到 Day ' + g.day + '</a>' + (nx ? '<a class="btn btn-light" href="#grammar-' + nx.id + '">下一课</a>' : '<a class="btn btn-light" href="#home">回首页</a>') + '</div></main>';
    app.innerHTML = h; wireQuiz('g' + g.id, qs);
  }

  /* ---------- Philippine English ---------- */
  function renderLocal() {
    var h = topbar('菲律宾当地常听到的英语', '学习资料 · 到了宿务马上用得上') + '<main class="doc"><p class="lead">这些说法课本里很少教，但在宿务的学校、商店和街上天天听到。</p>' +
      DATA.local.map(function (l) { return '<div class="local" data-item><div class="lc-top"><span class="lc-t">' + esc(l.t) + '</span><span class="lc-zh">' + esc(l.zh) + '</span></div><div class="ex-row"><div><p class="en">' + esc(l.ex) + '</p><p class="muted small">' + esc(l.exzh) + '</p></div>' + speakBtn(l.a, '播放例句') + '</div></div>'; }).join('') + '</main>';
    app.innerHTML = h;
  }

  /* ---------- pronunciation pairs ---------- */
  function renderPron() {
    var h = topbar('中国学生常见发音问题', '学习资料 · 点开对比着听') + '<main class="doc"><p class="lead">每组两个词只差一个音。先听两遍，再跟读，最后请同伴念一个，你来猜是哪一个。</p>' +
      DATA.pron.map(function (p) {
        return '<section class="numgroup"><h2 class="sec-h">' + esc(p.title) + '</h2><p class="muted small">' + esc(p.tip) + '</p>' +
          p.pairs.map(function (pr, i) { return '<div class="pair">' + [0, 1].map(function (k) { return '<div class="pw" data-item><span>' + esc(pr[k]) + '</span>' + speakBtn(p.a[i][k], '播放 ' + pr[k]) + '</div>'; }).join('<span class="vs">vs</span>') + '</div>'; }).join('') + '</section>';
      }).join('') + '</main>';
    app.innerHTML = h;
  }

  /* ---------- study method (merged page) ---------- */
  function renderMethod() {
    var M = DATA.method;
    var h = topbar('怎么学最有效', '开始之前 · 每天 30 分钟') + '<main class="doc"><h2 class="sec-h">每天 30 分钟，按这 5 步</h2>' +
      M.steps.map(function (s, i) { return '<div class="num-row"><span class="nr-n">' + (i + 1) + '</span><div><p class="nr-t">' + esc(s[0]) + ' <span class="nr-time">' + esc(s[1]) + '</span></p><p class="nr-d">' + esc(s[2]) + '</p></div></div>'; }).join('') +
      '<div class="call tone-E8F1EC"><p class="label">今天很忙时，做最小版本</p><p>' + esc(M.busy) + '</p><p class="muted small">连续学比一次学很久更重要。</p></div>' +
      '<h2 class="sec-h">6 种练习方式，每天选 3 种</h2>' +
      M.ways.map(function (w, i) { return '<div class="num-row"><span class="nr-n">' + pad(i + 1) + '</span><div><p class="nr-t">' + esc(w[0]) + '</p><p class="nr-d">' + esc(w[1]) + '</p></div></div>'; }).join('') +
      '<div class="call tone-FBE7D8"><p class="label">推荐搭配</p><p>学新内容用 01 + 03 + 05；复习旧内容用 02 + 06；对话部分用 04。</p></div>' +
      '<a class="btn btn-ghost btn-wide" href="#cards">打开单词复习卡</a></main>';
    app.innerHTML = h;
  }

  /* ---------- part-of-speech legend ---------- */
  var TAGROWS = [['名词', '人、东西、地点、时间', 'teacher, passport, room, Monday'], ['动词', '动作', 'go, study, repeat'], ['形容词', '描述人或东西', 'spicy, busy, ready'],
    ['副词', '描述动作怎么做、多常做', 'slowly, usually, again'], ['介词', '时间、地点、来源', 'from, at, in, on'], ['连词', '把两部分连起来', 'and, but, because'],
    ['疑问词', '用来提问', 'who, what, where, why, how'], ['固定表达', '整块记，不拆开', 'nice to meet you, on time']];
  function renderTags() {
    var h = topbar('单词颜色标签怎么看', '开始之前') + '<main class="doc"><p class="lead">每个单词下面都有一个颜色标签，告诉你它在句子里是什么词。入学测试的语法题也用这些叫法（noun、verb、adjective）。</p>' +
      TAGROWS.map(function (r) { return '<div class="tagrow">' + tag(r[0]) + '<div><p class="nr-t">' + esc(r[1]) + '</p><p class="en small">' + esc(r[2]) + '</p></div></div>'; }).join('') +
      '<p class="muted small">数字、礼貌用语用灰色标出，整块记住就可以。不用背语法名称，先知道每个词在句子里干什么。</p><a class="btn btn-ghost btn-wide" href="#grammar-0">想看更详细的解释和例句：语法第 0 课</a></main>';
    app.innerHTML = h;
  }

  /* ---------- word review cards (spaced: day 2 / 4 / 7 after learning) ---------- */
  var cardQ = null;
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function renderCards(mode) {
    var p = progress(), learned = Object.keys(p.done).map(Number).sort(function (a, b) { return a - b; }), due = dueReviews();
    mode = mode || (due.length ? 'due' : 'all');
    var days = mode === 'due' ? due : learned, demo = false;
    if (!days.length) { days = [1]; demo = true; }
    var pool = []; days.forEach(function (dn) { dayById(dn).words.forEach(function (w) { pool.push({ w: w, d: dn }); }); });
    cardQ = shuffle(pool); var total = pool.length, known = 0;
    var h = topbar('单词复习卡', '学过的词，隔天再练') + '<main class="doc"><div class="seg" role="group" aria-label="复习范围"><button type="button" data-cm="due" class="' + (mode === 'due' ? 'on' : '') + '">今天该复习的（' + due.length + ' 天）</button><button type="button" data-cm="all" class="' + (mode === 'all' ? 'on' : '') + '">全部学过的（' + learned.length + ' 天）</button></div>' +
      (demo ? '<p class="muted small">还没有完成的天数，先用 Day 1 的词示范。完成每天的打卡后，学过的词会自动出现在这里。</p>' : '') +
      '<div class="wcard" id="wcard"></div><p class="muted small" id="wleft"></p></main>';
    app.innerHTML = h;
    $$('[data-cm]', app).forEach(function (b) { b.addEventListener('click', function () { renderCards(b.getAttribute('data-cm')); }); });
    function show() {
      var el = $('#wcard');
      if (!cardQ.length) { el.innerHTML = '<p class="wc-done">这一轮完成了</p><p class="muted">' + total + ' 个词都过了一遍。</p><button type="button" class="btn btn-primary" id="again">再来一轮</button>'; $('#again').addEventListener('click', function () { renderCards(mode); }); $('#wleft').textContent = ''; return; }
      var c = cardQ[0];
      el.innerHTML = '<span class="wc-day">DAY ' + pad(c.d) + '</span><div class="wc-en" data-item>' + esc(c.w.w) + speakBtn(c.w.a, '播放 ' + c.w.w) + '</div>' +
        '<div class="wc-back" hidden><p class="wc-zh">' + esc(c.w.m) + '</p>' + tag(c.w.c) + '</div>' +
        '<button type="button" class="btn btn-light btn-wide" id="flip">先自己想中文意思，再点这里看</button>' +
        '<div class="wc-btns" hidden><button type="button" class="btn btn-light" id="again1">还不熟</button><button type="button" class="btn btn-primary" id="got">记住了</button></div>';
      $('#wleft').textContent = '已记住 ' + known + ' / ' + total + '，还剩 ' + cardQ.length + ' 张';
      $('#flip').addEventListener('click', function () { $('.wc-back', el).hidden = false; $('.wc-btns', el).hidden = false; this.hidden = true; });
      $('#again1').addEventListener('click', function () { cardQ.push(cardQ.shift()); show(); });
      $('#got').addEventListener('click', function () { cardQ.shift(); known++; show(); });
      prefetchClips(el);
    }
    show();
  }

  /* ---------- numbers reference ---------- */
  function renderNumbers() {
    var h = topbar('数字速查', '学习资料 · 每个数字都能点播') + '<main class="doc"><p class="lead">0–20 单独记，21–99 按规律组合，大数字记住“万”和“亿”的换算。</p>';
    DATA.numbers.forEach(function (g, gi) {
      h += '<section class="numgroup"><h2 class="sec-h">' + esc(g.title) + '</h2><p class="muted small">' + esc(g.tip) + '</p><div class="numgrid g' + gi + (gi >= 3 ? ' wide' : '') + '">' +
        g.items.map(function (it) {
          return '<div class="num-card" data-item><span class="nc-n">' + esc(it.n) + '</span><span class="nc-en">' + esc(it.en) + '</span><span class="nc-zh">' + esc(it.zh) + '</span>' + speakBtn(it.a, '播放 ' + it.en) + '</div>';
        }).join('') + '</div></section>';
    });
    h += '</main>';
    app.innerHTML = h;
  }

  /* ---------- weekly / level up ---------- */
  function renderWeekly(i) {
    var w = DATA.weekly[i - 1]; if (!w) return renderHome();
    var h = topbar(w.title, '每周挑战 ' + pad(i) + ' · 学完 Day ' + w.after) + '<main class="doc"><p class="lead">' + esc(w.sub) + '</p><div class="checks">' +
      w.tasks.map(function (t, j) { return checkItem('w' + i + '-' + j, t); }).join('') + '</div>' +
      '<div class="call tone-FBE7D8"><p class="label">过关标准</p><p>' + esc(w.pass_) + '</p></div>' +
      noteField('w' + i, '复盘：我卡住的地方是', 3) + '<a class="btn btn-light btn-wide" href="#day-' + Math.min(60, w.after + 1) + '">继续 Day ' + Math.min(60, w.after + 1) + '</a></main>';
    app.innerHTML = h; wireChecks(app);
  }
  function renderLevelUp(i) {
    var l = DATA.levelups[i - 1]; if (!l) return renderHome();
    function count() { return l.items.filter(function (t, j) { return load('chk:l' + i + '-' + j, false); }).length; }
    var h = topbar(l.title, '阶段测试 ' + pad(i) + ' · Day ' + l.after) + '<main class="doc"><p class="lead">' + esc(l.sub) + '</p><div class="checks">' +
      l.items.map(function (t, j) { return checkItem('l' + i + '-' + j, t); }).join('') + '</div>' +
      '<div class="score"><span class="sc-n" id="lvc">' + count() + '</span><span>/ ' + l.items.length + ' 完成</span></div>' +
      noteField('l' + i, '我最想再练', 0) +
      (i === 4 ? '<a class="btn btn-primary btn-wide" href="#final">开始最终入学测试模拟</a>' : '<a class="btn btn-light btn-wide" href="#day-' + Math.min(60, l.after + 1) + '">继续 Day ' + Math.min(60, l.after + 1) + '</a>') + '</main>';
    app.innerHTML = h; fixNoteValues(app); wireChecks(app, function () { $('#lvc').textContent = count(); });
  }

  /* ---------- info card ---------- */
  function renderInfo() {
    var F = [['name', 'Name', '护照上的英文名'], ['school', 'School', '学校英文名'], ['address', 'Address', '学校英文地址'], ['room', 'Room', '房号'], ['phone', 'Phone', '当地手机号'], ['emergency', 'Emergency contact', '紧急联系人和电话'], ['allergy', 'Allergies / Medicine', '过敏 / 常用药']];
    var h = topbar('个人信息卡', '填好后截图保存') + '<main class="doc"><p class="muted">只保存在这台手机上。到了菲律宾，可以直接给司机、前台或医生看。</p><div class="form">' +
      F.map(function (f) { return '<label class="field"><span>' + f[1] + ' <em>' + f[2] + '</em></span><input type="text" id="info-' + f[0] + '" data-info="' + f[0] + '" autocomplete="off"></label>'; }).join('') +
      '</div><div class="idcard" id="idcard"></div></main>';
    app.innerHTML = h;
    var info = load('info', {});
    function paint() {
      var v = function (k, ph) { return info[k] ? esc(info[k]) : '<span class="blank">' + ph + '</span>'; };
      $('#idcard').innerHTML = '<p class="label">MY INFO CARD</p><dl>' + F.map(function (f) { return '<dt>' + f[1] + '</dt><dd>' + v(f[0], '______') + '</dd>'; }).join('') +
        '<dt>Nationality</dt><dd>Chinese</dd></dl><p class="label">把这 3 句说熟</p><p class="en">Hi, I\'m ' + v('name', '______') + '. I\'m from China.</p><p class="en">I\'m a student at ' + v('school', '______') + '.</p><p class="en">My room number is ' + v('room', '______') + '.</p>';
    }
    $$('[data-info]', app).forEach(function (i) { i.value = info[i.getAttribute('data-info')] || ''; i.addEventListener('input', function () { info[i.getAttribute('data-info')] = i.value; save('info', info); paint(); }); });
    paint();
  }

  /* ---------- quizzes ---------- */
  function quizHTML(id, qs) {
    var ans = load('quiz:' + id, {});
    return '<ol class="quiz">' + qs.map(function (q, qi) {
      var picked = ans[qi];
      return '<li class="q" data-item><p class="q-t">' + esc(q.q) + speakBtn(q.audio) + '</p><div class="opts">' +
        q.o.map(function (o, oi) {
          var cls = picked == null ? '' : (oi === q.a ? ' right' : (oi === picked ? ' wrong' : ''));
          return '<button type="button" class="opt' + cls + '" data-q="' + qi + '" data-o="' + oi + '"' + (picked != null ? ' disabled' : '') + '><b>' + 'ABC'[oi] + '</b>' + esc(o) + '</button>';
        }).join('') + '</div></li>';
    }).join('') + '</ol>';
  }
  function wireQuiz(id, qs, onDone) {
    var ans = load('quiz:' + id, {});
    $$('.quiz [data-q]', app).forEach(function (b) {
      if (b.closest('[data-quiz]') && b.closest('[data-quiz]').getAttribute('data-quiz') !== id) return;
      b.addEventListener('click', function () {
        var qi = +b.getAttribute('data-q'), oi = +b.getAttribute('data-o'), q = qs[qi];
        ans[qi] = oi; save('quiz:' + id, ans);
        $$('[data-q="' + qi + '"]', b.parentNode).forEach(function (x) {
          var o = +x.getAttribute('data-o'); x.disabled = true;
          if (o === q.a) x.classList.add('right'); else if (o === oi) x.classList.add('wrong');
        });
        if (onDone) onDone();
      });
    });
  }
  function quizScore(id, qs) { var a = load('quiz:' + id, {}), s = 0, n = 0; qs.forEach(function (q, i) { if (a[i] != null) { n++; if (a[i] === q.a) s++; } }); return { s: s, n: n, t: qs.length }; }

  var SELF = [
    { q: '1. Fill in the blank with the correct word.', o: ['把正确的词写进空格', '把正确的词圈起来'], a: 0 },
    { q: '2. Which of the following is NOT true?', o: ['选一个正确的说法', '选一个错误的说法'], a: 1 },
    { q: '3. Answer in complete sentences.', o: ['只写一个单词', '用完整的句子回答'], a: 1 },
    { q: '4. Underline the verb in each sentence.', o: ['在动词下面画线', '把动词划掉'], a: 0 },
    { q: '5. Write T if the sentence is true and F if it is false.', o: ['对写 T，错写 F', '对的打勾，错的打叉'], a: 0 },
    { q: '6. Write no more than three words.', o: ['至少写三个词', '最多写三个词'], a: 1 }
  ];
  function renderSelfCheck() {
    var h = topbar('题目要求看懂了吗？', '入学测试自测') + '<main class="doc"><p class="lead">读英文题目要求，选出它要你做什么。选完马上看对错。</p><div data-quiz="self">' + quizHTML('self', SELF) + '</div>' +
      '<div class="score"><span class="sc-n" id="sc">0</span><span id="sct">/ 6</span></div><p class="muted small">错的题回看 <a href="#page-162">题目动作词</a> 和 <a href="#page-194">最容易看错的小词</a>。</p>' +
      '<button type="button" class="btn btn-light btn-wide" id="redo">清空重做</button></main>';
    app.innerHTML = h;
    function upd() { var s = quizScore('self', SELF); $('#sc').textContent = s.s; $('#sct').textContent = '/ 6 · 已做 ' + s.n + ' 题'; }
    wireQuiz('self', SELF, upd); upd();
    $('#redo').addEventListener('click', function () { save('quiz:self', {}); renderSelfCheck(); });
  }

  /* ---------- FINAL TEST ---------- */
  var LISTEN = [
    { q: '1. What time does orientation start?', o: ['8:00', '10:00', '9:00'], a: 2 },
    { q: '2. Which room is orientation in?', o: ['201', '102', '305'], a: 0 },
    { q: '3. What should the student bring?', o: ['book and phone', 'passport and pen'], a: 1 },
    { q: '4. Where is the room?', o: ['next to the library', 'near the gate'], a: 0 },
    { q: '5. Which gate is the driver at?', o: ['Gate 1', 'Gate 2', 'Gate 3'], a: 1 },
    { q: '6. What is the plate number?', o: ['ABC 523', 'ACB 532', 'ABC 532'], a: 2 },
    { q: '7. How long will the driver take?', o: ['10 min', '5 min', '20 min'], a: 0 }
  ];
  var GRAMMAR = [
    { q: '1. I ___ from China.', o: ['am', 'is', 'are'], a: 0 },
    { q: '2. She ___ English every day.', o: ['study', 'studies', 'studied'], a: 1 },
    { q: '3. Yesterday, I ___ to the mall.', o: ['go', 'went', 'going'], a: 1 },
    { q: '4. My class starts ___ 8:00.', o: ['at', 'in', 'on'], a: 0 },
    { q: '5. There ___ three people in my family.', o: ['is', 'are', 'am'], a: 1 },
    { q: '6. I want to ___ my speaking.', o: ['improve', 'improved', 'improving'], a: 0 },
    { q: '7. He is ___ a blue shirt.', o: ['wear', 'wears', 'wearing'], a: 2 },
    { q: '8. Could you speak more ___?', o: ['slow', 'slowly', 'slower'], a: 1 },
    { q: '9. I like cooking ___ it helps me relax.', o: ['because', 'but', 'where'], a: 0 },
    { q: '10. Where ___ you usually have lunch?', o: ['do', 'does', 'are'], a: 0 }
  ];
  var VOCAB = [
    { q: '1. baggage', o: ['行李', '课表', '收据'], a: 0 },
    { q: '2. receipt', o: ['房卡', '收据', '护照'], a: 1 },
    { q: '3. pronounce', o: ['发音', '选择', '付款'], a: 0 },
    { q: '4. schedule', o: ['症状', '课表', '折扣'], a: 1 },
    { q: '5. correction', o: ['纠正', '方向', '住宿'], a: 0 },
    { q: '6. Match the words and pictures.', o: ['把单词和图片配对', '把图片画出来', '把单词读出来'], a: 0 },
    { q: '7. Circle the best answer.', o: ['写出答案', '圈出最佳答案', '划掉错的答案'], a: 1 },
    { q: '8. Complete the sentence.', o: ['补全句子', '改写句子', '朗读句子'], a: 0 },
    { q: '9. Describe the picture.', o: ['给图片涂色', '描述图片', '找出图片'], a: 1 },
    { q: '10. Read the passage aloud.', o: ['默读短文', '翻译短文', '大声朗读短文'], a: 2 }
  ];
  var CLASS_AUDIO = ['cq1', 'cq2', 'cq3'];
  var CLASS = [
    { q: '1. Please read paragraph two.', o: ['Okay.', "I'm from China."], a: 0 },
    { q: '2. Do you understand this word?', o: ['At nine.', 'Not yet. Could you explain it?'], a: 1 },
    { q: '3. Your answer is not correct.', o: ['Let me try again.', 'Two bottles.'], a: 0 },
    { q: '4. What does your teacher want you to do?', o: ['It is 500 pesos.', 'Choose one answer.'], a: 1 },
    { q: '5. The teacher is speaking too fast.', o: ['I am a designer.', 'Could you speak more slowly?'], a: 1 },
    { q: '6. You cannot hear the last word.', o: ['Could you repeat the last word?', 'I like music.'], a: 0 }
  ];
  var PASSAGE = "Li Ming arrived in Cebu on Sunday evening. A school driver met him at the airport and took him to the dormitory. On Monday morning, he joined orientation at nine o'clock. The staff explained the school rules and gave him a timetable. After lunch, Li Ming took a placement test. The listening part was difficult, but he used the questions to find names, times and places. During the speaking test, he asked the examiner to repeat one question. His first class started on Tuesday. He was nervous, but he told his teacher that he wanted more speaking practice.";
  var READQ = [['1. When did Li Ming arrive?', 'Sunday evening'], ['2. Who met him at the airport?', 'A school driver'], ['3. What did he receive during orientation?', 'A timetable'], ['4. Which test section was difficult?', 'The listening part'], ['5. What did he ask the examiner to do?', 'Repeat one question'], ['6. What did he want to practice more?', 'Speaking']];
  var PARTS = [
    ['speaking', 'Speaking 口语面谈'], ['listening', 'Listening 听力'], ['reading', 'Reading 阅读'], ['writing', 'Writing 写作'],
    ['grammar', 'Grammar 语法'], ['vocab', 'Vocabulary 词汇和指令'], ['picture', 'Picture 看图说话'], ['classroom', 'Classroom 课堂英语'], ['result', '成绩']
  ];
  function renderFinal() {
    var part = load('finalpart', 'speaking');
    var h = topbar('入学测试模拟', 'FINAL LEVEL TEST · 建议用时 60 分钟') + '<main class="doc final">' +
      '<div class="tabs" role="tablist">' + PARTS.map(function (p) { return '<button type="button" role="tab" data-part="' + p[0] + '" aria-selected="' + (p[0] === part) + '">' + p[1] + '</button>'; }).join('') + '</div><div id="part"></div></main>';
    app.innerHTML = h;
    $$('[data-part]', app).forEach(function (b) { b.addEventListener('click', function () { save('finalpart', b.getAttribute('data-part')); stopAudio(); renderFinal(); window.scrollTo(0, 0); }); });
    var el = $('#part'), x = '';
    function dir(en, zh) { return '<div class="dir"><p class="en"><b>Directions:</b> ' + esc(en) + '</p><p>' + esc(zh) + '</p></div>'; }
    if (part === 'speaking') {
      x = dir('Answer each question in complete sentences.', '每题先直接回答，再补一个细节或原因。听不懂可以说 Could you repeat the question?') +
        '<ol class="plain">' + ['Please introduce yourself.', 'What do you usually do on weekdays?', 'Why do you want to study in the Philippines?', 'What is difficult for you in English?', 'What do you want your teacher to help you with?']
          .map(function (q, i) { return '<li data-item><p class="q-t">' + (i + 1) + '. ' + esc(q) + speakBtn(DATA.final['sq' + (i + 1)], '考官读题') + '</p>' + noteField('fs' + i, '关键词', 0) + '</li>'; }).join('') + '</ol>' +
        recorder('final-speaking') + '<p class="muted small">请家人或同学当考官，按顺序读出问题，你连续回答并录音。</p>';
    } else if (part === 'listening') {
      x = dir('Listen and choose the correct answer.', '先读题、圈关键词，再播放音频。可以听 2 遍。') + player('final-listening.mp3', '听力音频', '可听 2 遍') + '<div data-quiz="listen">' + quizHTML('listen', LISTEN) + '</div><details class="ans"><summary>做完再看听力原文</summary><div class="script">' + DATA.listenScript.map(function (l) { return '<p>' + (l.who ? '<b>' + esc(l.who) + '</b> ' : '<i>') + esc(l.t) + (l.who ? '' : '</i>') + '</p>'; }).join('') + '</div></details>';
    } else if (part === 'reading') {
      x = dir('Read the passage and answer the questions.', '先看标题和问题，再读短文。生词不要逐个查。') +
        '<article class="passage"><h3>LI MING\'S FIRST DAY IN CEBU</h3><p>' + esc(PASSAGE) + '</p></article><ol class="plain">' +
        READQ.map(function (q, i) { return '<li><p class="q-t">' + esc(q[0]) + '</p>' + noteField('fr' + i, 'Answer', 0) + '<details class="ans"><summary>看参考答案</summary><p>' + esc(q[1]) + '</p></details></li>'; }).join('') + '</ol>';
    } else if (part === 'writing') {
      var wv = load('note:fwriting', '');
      x = dir('Write at least 5 sentences about yourself.', '写一段话介绍自己，至少 5 句。可以按下面 5 个提示写。') +
        '<ul class="hints"><li>Your name and hometown <span>My name is ... I\'m from ...</span></li><li>Your job or school <span>I work as ... / I study at ...</span></li><li>Your free time <span>In my free time, I like ... because ...</span></li><li>Why you want to study English <span>I want to study English because ...</span></li><li>Your goal in the Philippines <span>In the Philippines, I want to ...</span></li></ul>' +
        '<label class="field"><span>我的作文</span><textarea id="n-fwriting" data-note="fwriting" rows="9">' + esc(wv) + '</textarea></label><div class="wstats" id="wstats"></div>' +
        '<div class="checks">' + checkItem('fw-1', '至少 5 句') + checkItem('fw-2', '每句开头大写，句末有句号') + checkItem('fw-3', '用上 and、but 或 because') + '</div>';
    } else if (part === 'grammar') {
      x = dir('Choose the correct word to complete each sentence.', '先圈时间词，再看空格前后需要哪一种词。') + '<div data-quiz="grammar">' + quizHTML('grammar', GRAMMAR) + '</div>';
    } else if (part === 'vocab') {
      x = dir('A. Choose the meaning.  B. What should you do?', '1–5 选中文意思；6–10 选出题目要你做什么。') + '<div data-quiz="vocab">' + quizHTML('vocab', VOCAB) + '</div>';
    } else if (part === 'picture') {
      x = dir('Describe the picture.', '准备 30 秒，说 45 到 60 秒。') + '<img class="pic" src="img/picture-test.jpg" alt="一位学生在教室里和老师上课">' +
        '<div class="frames">' + [['整体', 'In the picture, I can see ...'], ['位置', 'On the left / right, there is ...'], ['动作', 'The person is ...ing.'], ['推测', 'Maybe they are ...']]
          .map(function (f) { return '<div class="frame"><span class="label">' + f[0] + '</span><p class="en">' + esc(f[1]) + '</p></div>'; }).join('') + '</div>' + recorder('final-picture');
    } else if (part === 'classroom') {
      CLASS.forEach(function (q, i) { if (i < 3) q.audio = DATA.final[CLASS_AUDIO[i]]; });
      x = dir('Choose the best response.', '1–3 题先听老师说，再选回应；4–6 题看情境选回应。') + '<div data-quiz="classroom">' + quizHTML('classroom', CLASS) + '</div><p class="muted small">最后脱稿说出 5 种课堂求助句。</p>';
    } else {
      var L = quizScore('listen', LISTEN), G = quizScore('grammar', GRAMMAR), V = quizScore('vocab', VOCAB), C2 = quizScore('classroom', CLASS);
      var tot = L.s + G.s + V.s + C2.s;
      x = '<div class="result"><p class="label">选择题自动得分</p><p class="big">' + tot + '<span> / 33</span></p>' +
        '<table class="rt"><tbody>' + [['听力', L], ['语法', G], ['词汇和指令', V], ['课堂英语', C2]].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1].s + ' / ' + r[1].t + '</td><td class="muted">已做 ' + r[1].n + '</td></tr>'; }).join('') + '</tbody></table>' +
        '<p class="muted small">口语、阅读、写作和看图说话请对照下面的自评打勾。结果用于学习反馈，不是学校的正式等级。</p></div>' +
        '<div class="checks">' + ['我给出了直接答案', '我至少补充一个细节或原因', '我停顿后能够继续', '我需要时会请求重复或慢速', '写作至少 5 句，开头大写、句末有句号'].map(function (t, i) { return checkItem('fself-' + i, t); }).join('') + '</div>' +
        noteField('fweak', '把错题和卡住的地方写下来，作为到校后第一周的学习目标', 3) +
        '<button type="button" class="btn btn-light btn-wide" id="freset">清空答案，重新测试</button>';
    }
    el.innerHTML = x;
    wirePlayers(el); wireRecorders(el); wireChecks(el); fixNoteValues(el); prefetchClips(el);
    [['listen', LISTEN], ['grammar', GRAMMAR], ['vocab', VOCAB], ['classroom', CLASS]].forEach(function (z) { if ($('[data-quiz="' + z[0] + '"]', el)) wireQuiz(z[0], z[1]); });
    var ta = $('#n-fwriting');
    if (ta) {
      var ws = function () { var t = ta.value.trim(); var words = t ? t.split(/\s+/).length : 0; var sents = (t.match(/[.!?](\s|$)/g) || []).length; $('#wstats').textContent = words + ' 个单词 · ' + sents + ' 句'; };
      ta.addEventListener('input', ws); ws();
    }
    var fr = $('#freset'); if (fr) fr.addEventListener('click', function () { ['listen', 'grammar', 'vocab', 'classroom'].forEach(function (k) { save('quiz:' + k, {}); }); save('finalpart', 'speaking'); renderFinal(); });
  }

  /* ---------- router ---------- */
  function route() {
    stopAudio();
    var hsh = (location.hash || '').replace('#', '');
    var m;
    if ((m = hsh.match(/^day-(\d+)$/))) renderDay(+m[1]);
    else if ((m = hsh.match(/^page-(\d+)$/))) renderPage(m[1]);
    else if ((m = hsh.match(/^weekly-(\d+)$/))) renderWeekly(+m[1]);
    else if ((m = hsh.match(/^levelup-(\d+)$/))) renderLevelUp(+m[1]);
    else if (hsh === 'final') renderFinal();
    else if (hsh === 'selfcheck') renderSelfCheck();
    else if (hsh === 'info') renderInfo();
    else if (hsh === 'numbers') renderNumbers();
    else if ((m = hsh.match(/^grammar-(\d+)$/))) renderGrammar(+m[1]);
    else if (hsh === 'local') renderLocal();
    else if (hsh === 'pron') renderPron();
    else if (hsh === 'method') renderMethod();
    else if (hsh === 'tags') renderTags();
    else if (hsh === 'cards') renderCards();
    else { renderHome(); if (hsh === 'contact') { var c = $('#contact'); if (c) { c.scrollIntoView(); return; } } }
    prefetchClips(app);
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-clip]'); if (s) { e.preventDefault(); e.stopPropagation(); if (s.classList.contains('playing')) { stopClips(); return; } queue = []; playClip(s.getAttribute('data-clip'), s, s.closest('[data-item]')); return; }
    var c = e.target.closest('[data-copy]');
    if (c) {
      var v = c.getAttribute('data-copy');
      var ok = function () { c.textContent = '已复制'; setTimeout(function () { c.textContent = '复制号码'; }, 1600); };
      var fallback = function () { var sel = $('.sel'); if (sel) { var r = document.createRange(); r.selectNodeContents(sel); var w = window.getSelection(); w.removeAllRanges(); w.addRange(r); c.textContent = '已选中，长按复制'; } };
      try { navigator.clipboard.writeText(v).then(ok, fallback); } catch (err) { fallback(); }
    }
  });
  window.addEventListener('hashchange', route);
  route();
})();
