/* ============================================================
   Independência Calculada — comportamento compartilhado
   Barra de progresso de leitura, botão voltar ao topo, TOC
   scroll-spy, reveal-on-scroll (artigos) e setas da vitrine
   horizontal (home). Cada bloco é um no-op se os elementos que
   ele precisa não existirem na página atual.
   ============================================================ */
(function(){
  "use strict";

  /* ---------- toggle de tema (claro/escuro) ---------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    var root = document.documentElement;
    var systemPrefersDark = function(){
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };
    var isDarkNow = function(){
      var explicit = root.getAttribute('data-theme');
      if (explicit === 'dark') return true;
      if (explicit === 'light') return false;
      return systemPrefersDark();
    };
    themeToggle.setAttribute('aria-pressed', String(isDarkNow()));
    themeToggle.addEventListener('click', function(){
      var next = isDarkNow() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ic-theme', next); } catch(e){}
      themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }

  /* ---------- menu compacto (Sobre / Artigos / Simuladores) ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var siteMenu = document.getElementById('siteMenu');
  if (menuToggle && siteMenu) {
    var closeMenu = function(){
      siteMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    var openMenu = function(){
      siteMenu.hidden = false;
      menuToggle.setAttribute('aria-expanded', 'true');
    };
    menuToggle.addEventListener('click', function(e){
      e.stopPropagation();
      if (siteMenu.hidden) openMenu(); else closeMenu();
    });
    document.addEventListener('click', function(e){
      if (!siteMenu.hidden && !siteMenu.contains(e.target) && e.target !== menuToggle) closeMenu();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && !siteMenu.hidden) { closeMenu(); menuToggle.focus(); }
    });
  }

  /* ---------- barra de progresso de leitura ---------- */
  var progressFill = document.getElementById('progressFill');
  if (progressFill) {
    var updateProgress = function(){
      var h = document.documentElement;
      var scrollTop = h.scrollTop || document.body.scrollTop;
      var scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressFill.style.width = pct.toFixed(2) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- botão voltar ao topo ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    var updateBackToTop = function(){
      if (window.scrollY > 600) { backToTop.classList.add('show'); }
      else { backToTop.classList.remove('show'); }
    };
    backToTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
  }

  /* ---------- navegação lateral (TOC) ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('#tocRail a'));
  if (tocLinks.length) {
    var sections = tocLinks.map(function(a){
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      var tocObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          var link = document.querySelector('#tocRail a[href="#' + entry.target.id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(function(l){ l.classList.remove('active'); });
            link.classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(function(s){ tocObserver.observe(s); });
    }
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function(entries, obs){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(function(el){ revealObserver.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('visible'); });
    }
  }

  /* ---------- vitrines horizontais (home) ---------- */
  document.querySelectorAll('.vitrine-track').forEach(function(track){
    var wrap = track.closest('.vitrine-wrap');
    var left = wrap.querySelector('.vitrine-arrow-left');
    var right = wrap.querySelector('.vitrine-arrow-right');
    var EPS = 2;

    function update(){
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= EPS) {
        left.hidden = true;
        right.hidden = true;
        track.classList.remove('has-more-left', 'has-more-right');
        return;
      }
      left.hidden = track.scrollLeft <= EPS;
      right.hidden = track.scrollLeft >= maxScroll - EPS;
      track.classList.toggle('has-more-left', track.scrollLeft > EPS);
      track.classList.toggle('has-more-right', track.scrollLeft < maxScroll - EPS);
    }

    [left, right].forEach(function(btn){
      btn.addEventListener('click', function(){
        var card = track.querySelector('.vitrine-card, .vitrine-empty');
        var step = card ? card.getBoundingClientRect().width + 16 : 300;
        var dir = btn === left ? -1 : 1;
        track.scrollBy({ left: dir * step, behavior: 'smooth' });
      });
    });

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- curtir (artigo) ---------- */
  var likeBtn = document.getElementById('likeBtn');
  if (likeBtn && likeBtn.dataset.slug) {
    var LIKES_API = 'https://independencia-likes.independenciacalculada.workers.dev';
    var slug = likeBtn.dataset.slug;
    var likeCountEl = document.getElementById('likeCount');
    var likeStorageKey = 'liked_' + slug;

    var setLikeCount = function(n){ if (likeCountEl) likeCountEl.textContent = n; };

    fetch(LIKES_API + '/likes?slug=' + slug)
      .then(function(r){ return r.json(); })
      .then(function(data){ setLikeCount(data.count); })
      .catch(function(){ setLikeCount('–'); });

    if (localStorage.getItem(likeStorageKey)) {
      likeBtn.classList.add('liked');
      likeBtn.setAttribute('aria-pressed', 'true');
    }

    likeBtn.addEventListener('click', function(){
      var isLiked = !!localStorage.getItem(likeStorageKey);
      if (isLiked) {
        likeBtn.classList.remove('liked');
        likeBtn.setAttribute('aria-pressed', 'false');
        localStorage.removeItem(likeStorageKey);
        fetch(LIKES_API + '/likes?slug=' + slug, { method: 'DELETE' })
          .then(function(r){ return r.json(); })
          .then(function(data){ setLikeCount(data.count); });
      } else {
        likeBtn.classList.add('liked');
        likeBtn.setAttribute('aria-pressed', 'true');
        localStorage.setItem(likeStorageKey, '1');
        fetch(LIKES_API + '/likes?slug=' + slug, { method: 'POST' })
          .then(function(r){ return r.json(); })
          .then(function(data){ setLikeCount(data.count); });
      }
    });
  }

  /* ---------- copiar link ---------- */
  var copyLinkBtn = document.getElementById('copyLinkBtn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function(){
      navigator.clipboard.writeText(window.location.href).then(function(){
        copyLinkBtn.classList.add('copied');
        setTimeout(function(){ copyLinkBtn.classList.remove('copied'); }, 1600);
      });
    });
  }

  /* ---------- newsletter (Buttondown) ---------- */
  var newsletterToggle = document.getElementById('newsletterToggle');
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterToggle && newsletterForm) {
    newsletterToggle.addEventListener('click', function(){
      var willShow = newsletterForm.hidden;
      newsletterForm.hidden = !willShow;
      newsletterToggle.setAttribute('aria-expanded', String(willShow));
      if (willShow) {
        var emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput) emailInput.focus();
      }
    });

    newsletterForm.addEventListener('submit', function(){
      var note = document.getElementById('newsletterNote');
      var fields = document.getElementById('newsletterFields');
      setTimeout(function(){
        if (note) {
          note.textContent = 'Inscrição enviada — confira seu e-mail para confirmar.';
          note.classList.add('success');
        }
        if (fields) fields.style.display = 'none';
      }, 400);
    });
  }

  /* ---------- sugerir um tema (Web3Forms) ---------- */
  var suggestToggle = document.getElementById('suggestToggle');
  var suggestForm = document.getElementById('suggestForm');
  if (suggestToggle && suggestForm) {
    var suggestTextarea = document.getElementById('suggest-message');
    var suggestCounter = document.getElementById('suggestCounter');
    var SUGGEST_MAXLEN = 500;

    var updateSuggestCounter = function(){
      var remaining = SUGGEST_MAXLEN - suggestTextarea.value.length;
      suggestCounter.textContent = remaining + ' caracteres restantes';
    };
    if (suggestTextarea && suggestCounter) {
      suggestTextarea.addEventListener('input', updateSuggestCounter);
      updateSuggestCounter();
    }

    suggestToggle.addEventListener('click', function(){
      var willShow = suggestForm.hidden;
      suggestForm.hidden = !willShow;
      suggestToggle.setAttribute('aria-expanded', String(willShow));
      if (willShow && suggestTextarea) suggestTextarea.focus();
    });

    suggestForm.addEventListener('submit', function(e){
      e.preventDefault();
      var note = document.getElementById('suggestNote');
      var fields = document.getElementById('suggestFields');
      var submitBtn = suggestForm.querySelector('.newsletter-submit');
      if (submitBtn) submitBtn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(suggestForm)))
      })
        .then(function(r){ return r.json(); })
        .then(function(data){
          if (data.success) {
            if (note) {
              note.textContent = 'Sugestão enviada — obrigado!';
              note.classList.remove('error');
              note.classList.add('success');
            }
            if (fields) fields.style.display = 'none';
          } else {
            if (note) {
              note.textContent = 'Não deu pra enviar agora. Tenta de novo em instantes.';
              note.classList.add('error');
            }
            if (submitBtn) submitBtn.disabled = false;
          }
        })
        .catch(function(){
          if (note) {
            note.textContent = 'Não deu pra enviar agora. Tenta de novo em instantes.';
            note.classList.add('error');
          }
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* ---------- comentários (Cusdis): estiliza o iframe pra seguir o design system ---------- */
  function setupCusdisComments(){
  var cusdisContainer = document.getElementById('cusdis_thread');
  if (cusdisContainer) {
    var cusdisApplied = false;
    var rs = getComputedStyle(document.documentElement);
    var tok = function(name){ return rs.getPropertyValue(name).trim(); };
    var ink = tok('--ink'), muted = tok('--muted'), paperRaised = tok('--paper-raised');
    var lineStrong = tok('--line-strong'), line = tok('--line'), placeholder = tok('--placeholder');
    var green = tok('--green'), greenDeep = tok('--green-deep'), brick = tok('--brick');
    var gold = tok('--gold');
    // O Cusdis define cor própria (pensada pro fundo branco padrão dele) em
    // nome/data/corpo do comentário. "*{color:inherit!important}" sozinho não
    // é garantia: se a regra deles TAMBÉM usa !important (comum em widget de
    // terceiro que quer resistir a CSS externo), quem ganha é especificidade
    // — e uma classe deles bate um seletor universal nosso. B eleva a
    // especificidade de qualquer seletor a três IDs (ninguém tem esse id, só
    // usamos pra "roubar" pontos de especificidade), o suficiente pra vencer
    // qualquer seletor de classe realista. Toda regra que define `color`
    // usa B, senão perderia justamente para a regra "pega-tudo" de herança.
    var B = ':not(#ic-x):not(#ic-x):not(#ic-x)';
    var cusdisCss = ""
      + "html" + B + ",body" + B + "{font-family:'IBM Plex Sans',sans-serif !important;font-size:15px !important;line-height:1.6 !important;color:" + ink + " !important;background:transparent !important;overflow:visible !important;height:auto !important;}"
      + "*{box-sizing:border-box;}"
      + "*" + B + ":not(html):not(body){color:inherit !important;}"
      + "::-webkit-scrollbar{display:none !important;}"
      // Sem padding/font-size forçados no input/textarea: o Cusdis
      // posiciona o rótulo com base no padding original do campo. Forçar
      // esse valor via !important desalinhava rótulo e caixa (bug
      // reportado com print do inspecionar). O <label> em si não afeta
      // esse box model — dá pra estilizar a tipografia dele sem risco.
      + "label" + B + "{font-family:'IBM Plex Mono',monospace !important;font-size:11px !important;letter-spacing:.05em !important;text-transform:uppercase !important;color:" + muted + " !important;}"
      + "input" + B + ",textarea" + B + "{font-family:'IBM Plex Sans',sans-serif !important;border:1px solid " + lineStrong + " !important;border-radius:3px !important;background:" + paperRaised + " !important;color:" + ink + " !important;}"
      + "input:focus" + B + ",textarea:focus" + B + "{outline:2px solid " + gold + " !important;outline-offset:2px !important;border-color:" + green + " !important;}"
      + "input::placeholder,textarea::placeholder{color:" + placeholder + " !important;}"
      + "button:not([type='button'])" + B + "{font-family:'IBM Plex Mono',monospace !important;font-size:12px !important;font-weight:600 !important;letter-spacing:.04em !important;text-transform:uppercase !important;background:" + green + " !important;color:#fff !important;border:1px solid " + green + " !important;border-radius:3px !important;padding:9px 18px !important;cursor:pointer !important;transition:background .15s ease, border-color .15s ease !important;min-height:38px !important;}"
      + "button:not([type='button']):hover" + B + "{background:" + greenDeep + " !important;border-color:" + greenDeep + " !important;}"
      + "button:not([type='button']):focus-visible" + B + "{outline:2px solid " + gold + " !important;outline-offset:2px !important;}"
      + "button[type='button']" + B + "{font-family:'IBM Plex Mono',monospace !important;font-size:11px !important;font-weight:600 !important;letter-spacing:.04em !important;text-transform:uppercase !important;background:transparent !important;color:" + green + " !important;border:0 !important;padding:4px 2px !important;cursor:pointer !important;}"
      + "button[type='button']::before{content:'↳ ';}"
      + "button[type='button']:hover" + B + "{color:" + greenDeep + " !important;text-decoration:underline !important;}"
      + "a" + B + "{color:" + green + " !important;text-decoration:none !important;}"
      + "a:hover" + B + "{color:" + brick + " !important;}"
      + "a:focus-visible" + B + ",button:focus-visible" + B + "{outline:2px solid " + gold + " !important;outline-offset:2px !important;}"
      + "hr{border-color:" + line + " !important;opacity:1 !important;}"
      // Nome/data de cada comentário: sem saber os nomes de classe exatos do
      // widget (não é possível inspecionar o DOM real dele a partir daqui),
      // mira em tags/atributos comuns pra esse tipo de informação — mono
      // pequeno e discreto, igual ao padrão de metadado usado no resto do
      // site (ver .meta em qualquer artigo). Sem risco se não bater com nada.
      + "time" + B + ",[class*='date' i]" + B + ",[class*='time' i]" + B + "{font-family:'IBM Plex Mono',monospace !important;font-size:12px !important;color:" + muted + " !important;}"
      + "[class*='name' i]" + B + ",[class*='author' i]" + B + ",[class*='nickname' i]" + B + "{font-weight:600 !important;color:" + ink + " !important;}"
      // Rodapé de atribuição do widget ("Comentários via Cusdis"): mantido
      // (obrigatório no plano gratuito), só discretizado — não é conteúdo
      // do blog, não precisa competir visualmente com os comentários.
      + "[class*='text-center' i][class*='text-xs' i]" + B + "{font-size:10px !important;opacity:.55 !important;}";

    // O Cusdis não expõe classe própria pro nome do autor nem pra data de
    // cada comentário (confirmado no DevTools: só classes utilitárias
    // genéricas tipo "text-gray-500 text-sm", sem "name"/"date"/"time" no
    // nome) — não dá pra mirar isso com seletor CSS. A única forma é achar
    // o texto exato e marcar o elemento. Os dois valores abaixo vêm do
    // mesmo CUSDIS_LOCALE customizado em cada página (mod_badge / o rótulo
    // "Autor"); o padrão de data é o formato fixo que o Cusdis usa
    // (YYYY-MM-DD HH:MM).
    var AUTHOR_BADGE_TEXT = 'Autor';
    var DATE_RE = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
    var dateFormatter = null;
    try { dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch(e){}

    var enhanceCusdisText = function(doc){
      try{
        if (!doc || !doc.body) return;
        var walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
        var node;
        while ((node = walker.nextNode())){
          var text = node.nodeValue.trim();
          if (!text) continue;
          var parent = node.parentElement;
          if (!parent) continue;

          if (text === AUTHOR_BADGE_TEXT && parent.textContent.trim() === AUTHOR_BADGE_TEXT && !parent.hasAttribute('data-ic-badge')){
            parent.setAttribute('data-ic-badge', '1');
            parent.style.cssText += ';display:inline-block;font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:' + paperRaised + ';background:' + green + ';border-radius:3px;padding:1px 6px;margin-left:4px;';
            continue;
          }

          var m = DATE_RE.exec(text);
          if (m && !parent.hasAttribute('data-ic-date') && dateFormatter){
            parent.setAttribute('data-ic-date', '1');
            var d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
            if (!isNaN(d.getTime())) node.nodeValue = dateFormatter.format(d).replace('.', '');
          }
        }
      }catch(e){}
    };

    var styleCusdisFrame = function(node){
      if (cusdisApplied) return;
      cusdisApplied = true;
      node.style.border = '0';
      node.style.background = 'transparent';
      node.style.width = '100%';
      node.style.colorScheme = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme').trim() || 'light';
      node.style.minHeight = '120px';
      node.setAttribute('title', 'Comentários do artigo');
      var resizePending = false;
      var resize = function(doc){
        if (resizePending) return;
        resizePending = true;
        requestAnimationFrame(function(){
          resizePending = false;
          try{
            var h = Math.max(doc.documentElement.scrollHeight, doc.body ? doc.body.scrollHeight : 0);
            if (h > 0) node.style.height = (h + 24) + 'px';
          }catch(e){}
        });
      };
      var setup = function(){
        try{
          var doc = node.contentDocument;
          if (!doc || !doc.head) return;
          var style = doc.createElement('style');
          style.textContent = cusdisCss;
          doc.head.appendChild(style);
          resize(doc);
          enhanceCusdisText(doc);
          if (window.ResizeObserver && doc.body){
            var ro = new ResizeObserver(function(){ resize(doc); });
            ro.observe(doc.body);
          } else {
            var iv = setInterval(function(){ resize(doc); }, 500);
            setTimeout(function(){ clearInterval(iv); }, 20000);
          }
          // Comentários/respostas chegam de forma assíncrona bem depois do
          // load do iframe — sem observar o body pra reprocessar, nome de
          // autor e data de comentários que aparecem depois nunca ganham o
          // badge/reformatação (só os que já existiam no primeiro passe).
          if (doc.body){
            var enhancePending = false;
            var enhanceObserver = new MutationObserver(function(){
              if (enhancePending) return;
              enhancePending = true;
              requestAnimationFrame(function(){ enhancePending = false; enhanceCusdisText(doc); });
            });
            enhanceObserver.observe(doc.body, { childList: true, subtree: true, characterData: true });
          }
        }catch(e){}
      };
      node.addEventListener('load', setup);
      setup();
    };

    var cusdisObserver = new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if (node.tagName === 'IFRAME') styleCusdisFrame(node);
        });
      });
    });
    cusdisObserver.observe(cusdisContainer, { childList: true, subtree: true });

    // cusdis.es.js carrega com async e pode inserir o iframe antes deste
    // script (no fim do <body>) registrar o observer acima — sem isso, o
    // comentário fica sem o CSS do tema (visual padrão do Cusdis).
    var existingFrame = cusdisContainer.querySelector('iframe');
    if (existingFrame) styleCusdisFrame(existingFrame);
  }
  }
  setupCusdisComments();
})();
