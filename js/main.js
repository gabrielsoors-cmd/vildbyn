// Vildbyn – filmen i toppen rullar hela tiden, utan ljud och utan knappar.
// Undantag: med "minska rörelse" eller "spara data" påslaget står stillbilden kvar.
(function () {
  var film = document.getElementById('film');
  if (!film) return;

  var bakgrund = document.querySelector('.hero-bakgrund');
  var lugn = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sparaData = !!(navigator.connection && navigator.connection.saveData);
  var bred = window.matchMedia('(min-aspect-ratio: 4/5)');

  film.muted = true;

  if (lugn || sparaData) {
    film.removeAttribute('autoplay');
    film.pause();
    return;
  }

  function spela() {
    var p = film.play();
    if (p && p.catch) p.catch(function () {
      // T.ex. strömsparläge på iPhone: försök igen vid första tryck eller skroll.
      var igen = function () {
        film.play().catch(function () {});
        ['touchstart', 'click', 'scroll', 'keydown'].forEach(function (h) { window.removeEventListener(h, igen); });
      };
      ['touchstart', 'click', 'scroll', 'keydown'].forEach(function (h) { window.addEventListener(h, igen, { once: true, passive: true }); });
    });
  }

  // Suddig kopia bakom filmen på breda skärmar. Laddas bara när den syns.
  function startaBakgrund() {
    if (!bakgrund || !bred.matches) return;
    if (!bakgrund.getAttribute('src')) bakgrund.src = bakgrund.dataset.src;
    bakgrund.currentTime = film.currentTime;
    if (!film.paused) bakgrund.play().catch(function () {});
  }
  if (bred.addEventListener) bred.addEventListener('change', startaBakgrund);

  film.addEventListener('play', startaBakgrund);
  film.addEventListener('pause', function () { if (bakgrund) bakgrund.pause(); });
  film.addEventListener('timeupdate', function () {
    if (bakgrund && bakgrund.getAttribute('src') && Math.abs(bakgrund.currentTime - film.currentTime) > 0.35) {
      bakgrund.currentTime = film.currentTime;
    }
  });

  // Filmen vilar när den är utskrollad och drar igång igen när den syns.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (poster) {
      if (poster[0].isIntersecting) { if (film.paused) spela(); }
      else if (!film.paused) film.pause();
    }, { threshold: 0.15 }).observe(film);
  }

  spela();
})();
