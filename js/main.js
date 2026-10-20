// Vildbyn – filmen i toppen.
// Startar ljudlöst (webbläsarna kräver det), går att pausa och sätta på ljud.
// Respekterar "minska rörelse" och "spara data": då står filmen still tills man trycker på Spela.
(function () {
  var film = document.getElementById('film');
  if (!film) return;

  var bakgrund = document.querySelector('.hero-bakgrund');
  var pausKnapp = document.getElementById('paus');
  var ljudKnapp = document.getElementById('ljud');
  var lugn = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sparaData = !!(navigator.connection && navigator.connection.saveData);
  var bred = window.matchMedia('(min-aspect-ratio: 4/5)');
  var pausadAvBesokare = false;

  function text(knapp, t) { knapp.querySelector('.filmknapp-text').textContent = t; }

  function visaLage() {
    var pausad = film.paused;
    pausKnapp.hidden = false;
    pausKnapp.setAttribute('aria-pressed', pausad ? 'true' : 'false');
    text(pausKnapp, pausad ? 'Spela' : 'Pausa');
    ljudKnapp.setAttribute('aria-pressed', film.muted ? 'false' : 'true');
    text(ljudKnapp, film.muted ? 'Ljud på' : 'Ljud av');
  }

  function spela() {
    var p = film.play();
    if (p && p.catch) p.catch(visaLage);
  }

  // Suddig kopia bakom filmen på breda skärmar. Laddas bara när den syns.
  function startaBakgrund() {
    if (!bakgrund || !bred.matches) return;
    if (!bakgrund.getAttribute('src')) bakgrund.src = bakgrund.dataset.src;
    bakgrund.currentTime = film.currentTime;
    if (!film.paused) bakgrund.play().catch(function () {});
  }
  if (bred.addEventListener) bred.addEventListener('change', startaBakgrund);

  film.addEventListener('play', function () { visaLage(); startaBakgrund(); });
  film.addEventListener('pause', function () { visaLage(); if (bakgrund) bakgrund.pause(); });
  film.addEventListener('volumechange', visaLage);
  film.addEventListener('timeupdate', function () {
    if (bakgrund && bakgrund.getAttribute('src') && Math.abs(bakgrund.currentTime - film.currentTime) > 0.35) {
      bakgrund.currentTime = film.currentTime;
    }
  });

  pausKnapp.addEventListener('click', function () {
    if (film.paused) { pausadAvBesokare = false; spela(); }
    else { pausadAvBesokare = true; film.pause(); }
  });

  ljudKnapp.addEventListener('click', function () {
    film.muted = !film.muted;
    if (!film.muted) { film.volume = 1; pausadAvBesokare = false; spela(); }
  });

  // Ljudlös film som inte syns behöver inte rulla. Med ljud på får den fortsätta.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (poster) {
      var syns = poster[0].isIntersecting;
      if (!syns && film.muted && !film.paused) film.pause();
      else if (syns && film.paused && !pausadAvBesokare && !lugn && !sparaData) spela();
    }, { threshold: 0.15 }).observe(film);
  }

  visaLage();
  if (!lugn && !sparaData) spela();
})();
