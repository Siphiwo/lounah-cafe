/* =========================================================
   Lounah Café — homepage behaviour
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     DATA
     Google figures verified 18 Nov 2026 by scraping the live
     listings. TODO: re-check both before launch.
     --------------------------------------------------------- */
  var REVIEW_RATING = 4.5;
  var REVIEW_COUNT  = 332;          // Paarl
  var REVIEW_4PLUS  = 298;          // 239 five-star + 59 four-star
  var GOOGLE_URL = 'https://www.google.com/maps/search/?api=1&query=Lounah%20Caf%C3%A9&query_place_id=ChIJ9YTBngMHzR0RmFiuinroiPk';
  var GOOGLE_URL_AB = 'https://www.google.com/maps/search/?api=1&query=Lounah%20All%C3%A9e%20Bleue&query_place_id=ChIJ8eo0fCOvzR0RDbObxD9CQ9g';

  /* Real Google reviews, verbatim. Source of truth: data/google-reviews.json
     (inlined so the page also works when opened straight off disk).
     Never edit or invent review text. */
  var REVIEWS = [
    { branch:'Paarl', stars:5, date:'2022-11-26', author:'Emily R.', excerpt:true,
      text:"I love the atmosphere of tranquility and the trees combined with the swings are so inviting.  This is the perfect spot to have a coffee and read a book by yourself or to enjoy having a catch up with friends." },
    { branch:'Paarl', stars:5, date:'2025-09-11', author:'Petra V.',
      text:"Beautiful lunch spot, excellent food, tranquil atmosphere, great service!" },
    { branch:'Paarl', stars:5, date:'2025-06-11', author:'Abigail N.',
      text:"Lounah Café has the friendliest staff, warmest atmosphere and most beautiful decor. I keep returning because nothing beats it." },
    { branch:'Paarl', stars:5, date:'2026-01-02', author:'Rivonia N.',
      text:"We've just absolutely fallen in love with Lounah Cafe in Paarl. It's just a part of my heart in a restaurant 🌻🫶🏽 delicious food and great service." },
    { branch:'Paarl', stars:5, date:'2026-08-10', author:'Eleanora B.',
      text:"What a yummy place. Everything on the menu looked inviting. And the carrot cake is a 10/10! Coffee superb. Friendly fast service !" },
    { branch:'Paarl', stars:5, date:'2024-04-14', author:'Hendri B.', excerpt:true,
      text:"Love sitting at the back between the trees! They honey cake is the Best!!" },
    { branch:'Paarl', stars:5, date:'2022-12-15', author:'Melanie P.', excerpt:true,
      text:"The back courtyard, with beautiful private areas are absolutely what the soul needs. ❤️" },
    { branch:'Paarl', stars:5, date:'2026-03-16', author:'Margot N.', excerpt:true,
      text:"We hosted my sister's kitchen tea at Lounah Café this weekend and had the most wonderful experience. Mia was incredibly helpful over email leading up to the event." },
    { branch:'Paarl', stars:5, date:'2026-07-29', author:'Gerda',
      text:"Lovely cozy café. Best fresh cakes (especially if you're a carrot cake fan and you're very particular about carrot cake icing)" },
    { branch:'Paarl', stars:5, date:'2026-03-09', author:'Joe A.', excerpt:true,
      text:"I came from the UK, this place is beautiful! Posh coffee and cake!" },
    { branch:'Allée Bleue', stars:5, date:'2026-10-08', author:'Jan H.',
      text:"Lovely spot for coffee & brunch. Delicious food & first class service." },
    { branch:'Allée Bleue', stars:5, date:'2026-09-02', author:'Deene Social', excerpt:true,
      text:"Such a beautiful new spot in Franschhoek! The food was absolutely delicious, the coffee was epic and the setting at Allée Bleue is hard to beat." }
  ];

  var THEMES = ['Calm atmosphere','Back garden & swings','Great coffee','Friendly staff','Eggs Benedict','Carrot cake'];

  /* Hours are indexed 0 = Sunday … 6 = Saturday, in Africa/Johannesburg.
     kitchen = last kitchen order, when it differs from closing. */
  var BRANCHES = [
    {
      id:'paarl', name:'Paarl',
      img:'assets/ig/DfTjGnrjCRV.jpg', w:1365, h:1706,
      alt:'Two spritzes raised in the garden at Lounah Café Paarl',
      addr:'501 Main Rd, Groenvlei, Paarl, 7646',
      tel:'+27 60 959 1436', telHref:'+27609591436',
      email:'info@lounah.co.za',
      rating:4.5, count:332, google:GOOGLE_URL,
      maps:'https://www.google.com/maps/dir/?api=1&destination=Lounah+Caf%C3%A9+501+Main+Rd+Groenvlei+Paarl',
      feats:['Garden, swings & hammocks','Laptop-friendly Wi-Fi','Kid-friendly'],
      hours:[null,
        {o:'08:00',c:'16:00',k:'15:00'},{o:'08:00',c:'16:00',k:'15:00'},
        {o:'08:00',c:'16:00',k:'15:00'},{o:'08:00',c:'16:00',k:'15:00'},
        {o:'08:00',c:'16:00',k:'15:00'},{o:'08:00',c:'15:00',k:'14:00'}]
    },
    {
      id:'alleebleue', name:'Allée Bleue',
      img:'assets/ig/Df3mOYgDzDZ.jpg', w:1092, h:1364,
      alt:'Inside the Lounah Café coffee bar at Allée Bleue',
      addr:'Allée Bleue Wine Estate, R45 & R310, Groot Drakenstein, Franschhoek, 7680',
      tel:'+27 64 059 6715', telHref:'+27640596715',
      email:'alleebleue@lounah.co.za',
      rating:4.7, count:7, google:GOOGLE_URL_AB,
      maps:'https://www.google.com/maps/dir/?api=1&destination=Lounah+All%C3%A9e+Bleue+Franschhoek',
      feats:['Open Sundays','Bring your own wine, no corkage','Plenty of free parking','Between Paarl, Franschhoek & Stellenbosch'],
      /* TODO confirm: Google lists Wed–Fri to 16:00 and Sat–Sun to 15:00;
         Instagram (28 Oct 2026) said Wed–Sun 08:00–15:00. */
      hours:[{o:'08:00',c:'15:00'},null,null,
        {o:'08:00',c:'16:00'},{o:'08:00',c:'16:00'},{o:'08:00',c:'16:00'},
        {o:'08:00',c:'15:00'}]
    }
  ];

  var FESTIVE = { from:'2026-12-24', to:'2027-01-04', back:'5 Jan 2027' };

  var IG_POSTS = [
    { c:'DfquQn4j6wR', w:1365, h:1706, cap:'Consider this a little nudge towards the Fior di Latte — an open sandwich from our summer menu.' },
    { c:'DfgbFOvD2BM', w:1365, h:1706, cap:'For everyone who reads the whole menu and still comes back to French toast.' },
    { c:'De8bdKgz-wn', w:935,  h:1661, reel:true, plays:13664, cap:'Our garden dinners are making a comeback, with Allée Bleue Wines.' },
    { c:'Dfycq7RD89i', w:1365, h:1706, cap:'A crispy chicken croissant, an iced coffee and a seat outside in our garden.' },
    { c:'DflkrCYmvAj', w:1364, h:1706, cap:'A change of scenery for your working day, or a cosy corner for a proper catch-up.' },
    { c:'Dd5y1KWskIM', w:941,  h:1672, reel:true, plays:9139, cap:'Unbox our NEW Paarl Summer Menu with us.' },
    { c:'Dev0vYmlTVW', w:1365, h:1706, cap:'Our new Spring Garden Omelette: feta, baby spinach, peas and fresh herbs.' },
    { c:'DeyEwOpDS7r', w:1638, h:2048, cap:'That first warm sip in the morning. An afternoon cup of tea with a slice of cake.' },
    { c:'DfzyfUThL-2', w:1320, h:2347, reel:true, plays:1582, credit:true, cap:'A MUST visit on your next trip to Franschhoek. Shared by a guest.' },
    { c:'De8X_VVCZxD', w:1365, h:1706, cap:'Meet the Green Goddess. Fresh, colourful and giving your usual lunch order a little competition.' },
    { c:'DeZd-31sY6s', w:1220, h:2160, reel:true, plays:2815, cap:'Eight candles, a long table and a garden full of little celebrations.' },
    { c:'Df3mOYgDzDZ', w:1092, h:1364, cap:'Follow the sound of the coffee machine, inside Lounah Café Allée Bleue.' }
  ];

  var TICKER = [
    'Now open Sundays at Allée Bleue',
    'Closed 24 Dec – 4 Jan · back ' + FESTIVE.back,
    'Walk-ins only, no bookings needed'
  ];

  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var DAYS_S = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  /* --------------------------------------------------------- helpers */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }
  function star(fill) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="' + (fill || '#C98B4F') +
      '" d="M12 1.8l3.1 6.3 7 1-5 4.9 1.2 6.9-6.3-3.3-6.3 3.3 1.2-6.9-5-4.9 7-1z"/></svg>';
  }
  function stars(n, cls) {
    var out = '', i;
    for (i = 0; i < 5; i++) out += star(i < Math.round(n) ? '#C98B4F' : 'rgba(26,26,26,.18)');
    return '<span class="' + (cls || '') + '">' + out + '</span>';
  }

  /* Current wall-clock time in Africa/Johannesburg. */
  function sast() {
    var f = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Johannesburg', hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', weekday: 'short'
    });
    var p = {}, parts = f.formatToParts(new Date()), i;
    for (i = 0; i < parts.length; i++) p[parts[i].type] = parts[i].value;
    return {
      iso: p.year + '-' + p.month + '-' + p.day,
      day: DAYS_S.indexOf(p.weekday.slice(0, 3)),
      mins: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10)
    };
  }
  function toMins(hhmm) {
    var a = hhmm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  }
  function inFestive(iso) { return iso >= FESTIVE.from && iso <= FESTIVE.to; }

  /* Returns { state:'open'|'soon'|'closed', label:'…' } */
  function statusOf(branch) {
    var now = sast();
    if (inFestive(now.iso)) {
      return { state: 'closed', label: 'Closed for the festive break · back ' + FESTIVE.back };
    }
    var today = branch.hours[now.day];
    if (today) {
      var o = toMins(today.o), c = toMins(today.c);
      if (now.mins >= o && now.mins < c) {
        if (today.k && now.mins >= toMins(today.k) - 45 && now.mins < toMins(today.k)) {
          return { state: 'soon', label: 'Kitchen closes at ' + today.k };
        }
        return { state: 'open', label: 'Open now · until ' + today.c };
      }
      if (now.mins < o) return { state: 'closed', label: 'Opens today ' + today.o };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7, h = branch.hours[d];
      if (h) {
        var when = i === 1 ? 'tomorrow' : DAYS_S[d];
        return { state: 'closed', label: 'Closed · opens ' + when + ' ' + h.o };
      }
    }
    return { state: 'closed', label: 'Closed' };
  }

  /* --------------------------------------------------------- announcement */
  (function announce() {
    var bar = $('#announce'), out = $('#announceTicker'), close = $('#announceClose');
    if (!bar) return;
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('lounah-announce') === 'off'; } catch (e) {}
    if (dismissed) return;

    bar.hidden = false;
    var i = 0;
    out.textContent = TICKER[0];
    if (!reduced && TICKER.length > 1) {
      setInterval(function () {
        out.classList.add('is-out');
        setTimeout(function () {
          i = (i + 1) % TICKER.length;
          out.textContent = TICKER[i];
          out.classList.remove('is-out');
        }, 500);
      }, 5200);
    }
    close.addEventListener('click', function () {
      bar.hidden = true;
      try { sessionStorage.setItem('lounah-announce', 'off'); } catch (e) {}
    });
  }());

  /* --------------------------------------------------------- header */
  (function header() {
    var h = $('#header');
    var onScroll = function () { h.classList.toggle('is-stuck', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var burger = $('#burger'), sheet = $('#sheet');
    function setSheet(open) {
      burger.setAttribute('aria-expanded', String(open));
      sheet.hidden = !open;
      document.documentElement.classList.toggle('nav-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    burger.addEventListener('click', function () {
      setSheet(burger.getAttribute('aria-expanded') !== 'true');
    });
    sheet.addEventListener('click', function (e) { if (e.target.tagName === 'A') setSheet(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) { setSheet(false); burger.focus(); }
    });

    function paint() {
      var s = statusOf(BRANCHES[0]);
      var p = $('#headerStatus');
      p.className = 'status ' + (s.state === 'open' ? 'is-open' : s.state === 'soon' ? 'is-soon' : '');
      $('.status__text', p).textContent = s.label.replace('Open now · until', 'Open now · Paarl until');
    }
    paint();
    setInterval(paint, 60000);
  }());

  /* --------------------------------------------------------- branch picker */
  (function picker() {
    function build(pop) {
      pop.innerHTML = '';
      BRANCHES.forEach(function (b) {
        var s = statusOf(b);
        var a = el('a', 'pop__item');
        a.href = b.maps;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = '<h4>' + esc(b.name) + '</h4><p>' + esc(s.label) + '</p>' +
          '<p><span class="go">Get directions</span></p>';
        pop.appendChild(a);
      });
    }
    function wire(btnSel, popSel) {
      var btn = $(btnSel), pop = $(popSel);
      if (!btn || !pop) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = pop.hidden;
        document.querySelectorAll('.pop').forEach(function (p) { p.hidden = true; });
        document.querySelectorAll('[aria-controls^="planPop"]').forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
        });
        if (open) { build(pop); pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
      });
      pop.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    wire('#planBtn', '#planPop');
    wire('#planBtn2', '#planPop2');
    document.addEventListener('click', function () {
      document.querySelectorAll('.pop').forEach(function (p) { p.hidden = true; });
      document.querySelectorAll('[aria-controls^="planPop"]').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.pop').forEach(function (p) { p.hidden = true; });
      }
    });
  }());

  /* --------------------------------------------------------- hero badge */
  (function badge() {
    var wrap = $('#badgeStars');
    for (var i = 0; i < 5; i++) {
      var s = el('span', '', star());
      s.firstChild.style.animationDelay = (1.25 + i * 0.09) + 's';
      wrap.appendChild(s.firstChild);
    }
    $('#badgeCount').textContent = REVIEW_COUNT.toLocaleString('en-ZA') + ' Google reviews';
    $('#badge').href = GOOGLE_URL;
    $('#badge').target = '_blank';
    $('#badge').rel = 'noopener';
    countTo($('#badgeScore'), REVIEW_RATING, 1, reduced ? 0 : 1100, reduced ? 0 : 1250);
  }());

  function countTo(node, target, dp, dur, delay) {
    if (!dur) { node.textContent = target.toFixed(dp); return; }
    setTimeout(function () {
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        node.textContent = (target * e).toFixed(dp);
        if (p < 1) requestAnimationFrame(step);
        else node.textContent = target.toFixed(dp);
      }
      requestAnimationFrame(step);
    }, delay || 0);
  }

  /* --------------------------------------------------------- branches */
  (function branches() {
    var wrap = $('#branches');
    BRANCHES.forEach(function (b, idx) {
      var s = statusOf(b);
      var now = sast();
      var art = el('article', 'branch reveal');
      art.style.setProperty('--i', idx);

      var hoursHtml = '';
      for (var d = 1; d <= 7; d++) {
        var i = d % 7, h = b.hours[i];
        hoursHtml += '<li class="' + (i === now.day ? 'is-today' : '') + '"><span>' + DAYS[i] + '</span><span>' +
          (h ? h.o + '–' + h.c + (h.k ? ' <small>(kitchen ' + h.k + ')</small>' : '') : 'Closed') +
          '</span></li>';
      }

      art.innerHTML =
        '<div class="branch__img"><img src="' + b.img + '" width="' + b.w + '" height="' + b.h +
          '" loading="lazy" alt="' + esc(b.alt) + '"></div>' +
        '<div class="branch__body">' +
          '<div class="branch__top"><div><h3>' + esc(b.name) + '</h3>' +
            '<p class="branch__addr">' + esc(b.addr) + '</p></div>' +
            '<span class="pill ' + (s.state === 'open' ? 'is-open' : s.state === 'soon' ? 'is-soon' : '') +
              '"><span class="dot"></span>' + esc(s.label) + '</span></div>' +
          '<p class="branch__rating">' + stars(b.rating, 'stars-sm') + ' <span>' + b.rating +
            ' · ' + b.count + ' Google review' + (b.count === 1 ? '' : 's') + '</span></p>' +
          '<ul class="hours">' + hoursHtml + '</ul>' +
          '<ul class="feats">' + b.feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
          '<div class="branch__cta">' +
            '<a class="btn btn--plum" href="' + b.maps + '" target="_blank" rel="noopener">Get directions</a>' +
            '<a class="btn btn--ghost" href="tel:' + b.telHref + '">Call ' + esc(b.tel) + '</a>' +
          '</div>' +
        '</div>';
      wrap.appendChild(art);
    });
  }());

  /* --------------------------------------------------------- reviews */
  (function reviews() {
    $('#bigCount').textContent = 'from ' + REVIEW_COUNT.toLocaleString('en-ZA') + ' Google reviews';
    $('#bigStars').innerHTML = stars(REVIEW_RATING);
    $('#allReviews').href = GOOGLE_URL;
    var pct = Math.round(REVIEW_4PLUS / REVIEW_COUNT * 100);
    $('#ratingSplit').textContent = pct + '% rate us 4 or 5 stars (' + REVIEW_4PLUS + ' of ' + REVIEW_COUNT + ')';

    var chips = $('#themeChips');
    THEMES.forEach(function (t, i) {
      var li = el('li', '', esc(t));
      li.style.setProperty('--i', i);
      chips.appendChild(li);
    });

    function card(r) {
      var d = new Date(r.date + 'T00:00:00Z');
      var when = d.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric', timeZone: 'UTC' });
      var txt = esc(r.text);
      if (r.excerpt) txt = '…' + txt + '…';
      return '<figure class="quote">' + stars(r.stars, 'quote__stars') +
        '<p>' + txt + '</p>' +
        '<figcaption><b>' + esc(r.author) + '</b> · ' + esc(r.branch) + ' · ' + when +
        ' · Google review</figcaption></figure>';
    }
    function fill(sel, list) {
      var t = $(sel + ' .row__track');
      var html = list.map(card).join('');
      t.innerHTML = html + html;          /* duplicated for a seamless loop */
      t.querySelectorAll('.quote').forEach(function (q, i) {
        if (i >= list.length) q.setAttribute('aria-hidden', 'true');
      });
    }
    fill('#row1', REVIEWS.slice(0, 6));
    fill('#row2', REVIEWS.slice(6));

    /* kitchen-tea review doubles as proof on the Celebrations tile */
    var m = REVIEWS.filter(function (r) { return r.author === 'Margot N.'; })[0];
    if (m) {
      $('#celebQuote').innerHTML = '“…' + esc(m.text) + '…”<cite>' +
        esc(m.author) + ', Google review</cite>';
    }
  }());

  /* --------------------------------------------------------- masonry */
  (function masonry() {
    var wrap = $('#masonry');
    IG_POSTS.forEach(function (p, i) {
      var a = el('a');
      a.href = 'https://www.instagram.com/p/' + p.c + '/';
      a.target = '_blank';
      a.rel = 'noopener';
      a.style.setProperty('--i', i % 4);
      a.innerHTML =
        '<img src="assets/ig/' + p.c + '.jpg" width="' + p.w + '" height="' + p.h +
          '" loading="lazy" alt="' + esc(p.cap) + '">' +
        (p.reel ? '<span class="tag"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 3l16 9-16 9z"/></svg>' +
          p.plays.toLocaleString('en-GB') + '</span>' : '') +
        '<span class="ov"><p>' + esc(p.cap) + '</p><span>' +
          (p.credit ? 'Shared by a guest · view on Instagram' : 'View on Instagram') + '</span></span>';
      var img = a.querySelector('img');
      img.addEventListener('error', function () {
        a.innerHTML = '<span class="miss">' + esc(p.cap) + '</span>';
      });
      wrap.appendChild(a);
    });
  }());

  /* --------------------------------------------------------- newsletter */
  (function signup() {
    var f = $('#signup'), msg = $('#signupMsg');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#email').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        msg.className = 'signup__msg err';
        msg.textContent = 'That email doesn’t look right — mind checking it?';
        return;
      }
      /* TODO: POST to Mailchimp or Squarespace Email. No endpoint wired yet. */
      msg.className = 'signup__msg ok';
      msg.textContent = 'Lovely — we’ll let you know when the next dinner opens. (Demo: not yet connected.)';
      f.reset();
    });
  }());

  /* --------------------------------------------------------- reveals */
  (function reveals() {
    var items = document.querySelectorAll('.reveal, .chips, .masonry, .footer__mark');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('is-in'); });
      $('#ratingFill').style.width = Math.round(REVIEW_4PLUS / REVIEW_COUNT * 100) + '%';
      countTo($('#bigScore'), REVIEW_RATING, 1, 0, 0);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    /* anything taller than the viewport, or cropped at the page's edge, can
       never reach 15% on screen — watch those for any overlap at all */
    var ioEdge = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        ioEdge.unobserve(en.target);
      });
    }, { threshold: 0 });
    items.forEach(function (n) {
      var edge = n.offsetHeight > window.innerHeight * 0.85 ||
                 n.classList.contains('footer__mark');   /* cropped at the page's foot */
      (edge ? ioEdge : io).observe(n);
    });

    var rated = false;
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || rated) return;
        rated = true;
        countTo($('#bigScore'), REVIEW_RATING, 1, 1400, 150);
        $('#ratingFill').style.width = Math.round(REVIEW_4PLUS / REVIEW_COUNT * 100) + '%';
        io2.disconnect();
      });
    }, { threshold: 0.4 });
    io2.observe($('.rating'));
  }());

  /* --------------------------------------------------------- parallax */
  (function parallax() {
    if (reduced) return;
    var img = $('#storyImg');
    if (!img) return;
    var ticking = false;
    function run() {
      var r = img.parentNode.getBoundingClientRect();
      var mid = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      img.style.transform = 'translate3d(0,' + (-mid * 30).toFixed(2) + 'px,0) scale(1.06)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(run); }
    }, { passive: true });
    run();
  }());

  /* --------------------------------------------------------- drag the rail */
  (function rail() {
    var r = $('#rail');
    if (!r) return;
    var down = false, x0 = 0, s0 = 0, moved = false;
    r.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; moved = false; x0 = e.clientX; s0 = r.scrollLeft;
      r.classList.add('is-drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - x0;
      if (Math.abs(dx) > 3) moved = true;
      r.scrollLeft = s0 - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false; r.classList.remove('is-drag');
    });
    r.addEventListener('click', function (e) { if (moved) e.preventDefault(); }, true);
  }());

  /* --------------------------------------------------------- JSON-LD */
  (function schema() {
    function node(b) {
      var spec = [];
      for (var d = 0; d < 7; d++) {
        var h = b.hours[d];
        if (h) spec.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'https://schema.org/' + DAYS[d],
          opens: h.o, closes: h.c
        });
      }
      return {
        '@context': 'https://schema.org',
        '@type': 'CafeOrCoffeeShop',
        name: 'Lounah Café' + (b.id === 'paarl' ? '' : ' Allée Bleue'),
        image: new URL(b.img, location.href).href,
        address: { '@type': 'PostalAddress', streetAddress: b.addr, addressCountry: 'ZA' },
        telephone: b.tel, email: b.email, url: 'https://www.lounah.co.za/',
        servesCuisine: 'Café', priceRange: 'R100–R400',
        openingHoursSpecification: spec,
        aggregateRating: {
          '@type': 'AggregateRating', ratingValue: b.rating,
          reviewCount: b.count, bestRating: 5
        }
      };
    }
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(BRANCHES.map(node));
    document.head.appendChild(s);
  }());

}());


/* ------------------------------------------------------------- coffee drop
   Fixed behind the page content. Its position is driven by scroll progress:
   it zig-zags left/right while travelling down, ends at the footer, and
   retraces the same path (up, behind the header) when scrolling back. */
(function coffeeDrop() {
  var drop = document.getElementById('drop');
  var footer = document.querySelector('.footer');
  if (!drop || !footer) return;
  var LEGS = 4, EDGE = 0.03;
  var vw, vh, size, footVP, endScroll, cx = 0, cy = 0, ang = 0, ready = false;

  function measure() {
    vw = window.innerWidth; vh = window.innerHeight;
    size = drop.offsetWidth;
    var docH = document.documentElement.scrollHeight;
    var maxScroll = Math.max(1, docH - vh);
    var footTop = footer.getBoundingClientRect().top + window.scrollY;
    footVP = vh * 0.55;                        /* where the footer edge sits when the drop lands */
    endScroll = Math.max(1, Math.min(maxScroll, footTop - footVP));
  }
  function lane(p) {                           /* 0..1 zig-zag, soft corners */
    var t = p * LEGS, f = t - Math.floor(t), tri = Math.floor(t) % 2 ? 1 - f : f;
    var s = 0.5 - 0.5 * Math.cos(Math.PI * tri);
    return 0.55 * tri + 0.45 * s;
  }
  function posAt(p) {
    var span = vw - size - 2 * EDGE * vw;
    return {
      x: EDGE * vw + lane(p) * span,
      y: -size * 1.1 + p * (footVP + size * 1.1 - size * 0.35)
    };
  }
  function frame() {
    var raw = Math.max(0, window.scrollY / endScroll), p = Math.min(1, raw);
    var a = posAt(p), b = posAt(Math.min(1, p + 0.004)), c = posAt(Math.max(0, p - 0.004));
    var target = Math.atan2(b.x - c.x, Math.max(1, b.y - c.y)) * 180 / Math.PI;
    target = Math.max(-34, Math.min(34, target * 0.45));
    if (raw > 1) a.y -= (raw - 1) * endScroll;   /* landed: ride the page up with the footer */
    if (!ready) { cx = a.x; cy = a.y; ang = target; ready = true; }
    var k = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.22;
    cx += (a.x - cx) * k; cy += (a.y - cy) * k; ang += (target - ang) * k;
    drop.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0) rotate(' + (-ang).toFixed(1) + 'deg)';
    drop.classList.add('is-on');
    requestAnimationFrame(frame);
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  setTimeout(measure, 1200);
  requestAnimationFrame(frame);
}());


/* ------------------------------------------------------------- write-on headings
   Section headings (below the fold) are written in letter by letter when they
   scroll into view. The pace eases out: quick at the start, slowing towards the
   end of the sentence. */
(function writeOn() {
  var heads = document.querySelectorAll('main h2');
  if (!heads.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var DURATION = 2.0;                          /* seconds for the whole line */
  heads.forEach(function (h) {
    var nodes = [], tw = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) nodes.push(tw.currentNode);
    var total = 0;
    nodes.forEach(function (n) { total += n.textContent.replace(/\s/g, '').length; });
    var i = 0;
    nodes.forEach(function (n) {
      var frag = document.createDocumentFragment();
      Array.from(n.textContent).forEach(function (c) {
        if (/\s/.test(c)) { frag.appendChild(document.createTextNode(c)); return; }
        var s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        var f = i / Math.max(1, total - 1);    /* 0..1 along the sentence; f squared = quick start, slowing to the end */
        s.style.transitionDelay = (DURATION * Math.pow(f, 2)).toFixed(3) + 's';
        frag.appendChild(s);
        i++;
      });
      n.parentNode.replaceChild(frag, n);
    });
    h.classList.add('wo');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-written');
      io.unobserve(en.target);
    });
  }, { threshold: 0.6 });
  heads.forEach(function (h) { io.observe(h); });
}());
