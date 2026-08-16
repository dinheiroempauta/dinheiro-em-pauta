/* ============================================================
   Independência Calculada — comportamento compartilhado
   Barra de progresso de leitura, botão voltar ao topo, TOC
   scroll-spy, reveal-on-scroll (artigos) e setas da vitrine
   horizontal (home). Cada bloco é um no-op se os elementos que
   ele precisa não existirem na página atual.
   ============================================================ */
(function(){
  "use strict";

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
})();
