/*
 * about-timeline.js — observed behaviour only, lifted from the source's
 * elt_assets_timeline.a0c5b75c6b49.js (jQuery) and re-implemented without the library:
 *  - positionImages: the banner frame (.timeline-img) is sized to cover the viewport at the
 *    banners' 1920:900 ratio (centred on the short axis); while it sits in the flow (static) the
 *    card column (.timeline) is pulled up over it with a negative margin, once fixed the margin is 0.
 *  - scroll monitor: the frame turns `position: fixed` once scrollY passes the frame's container top
 *    (static again above it); the card whose centre is closest to the viewport centre is current —
 *    its banner fades in (500 ms opacity), its card turns blue, its quick-access entry is active;
 *    every quick-access entry fades with its distance from the rail's centre (1 − 0.8 × 2|d|/h).
 *  - in-page links (`a[href^="#"]`) scroll smoothly to their target.
 * Runs on load, resize, scroll, and on mouseover/mouseout/scroll of the quick-access rail.
 */
(function () {
  var BANNER_RATIO = 1920 / 900;
  var frameWrap = document.querySelector('.timeline-container');
  var frame = document.querySelector('.timeline-img');
  var column = document.querySelector('.timeline');
  var section = document.querySelector('.timeline-section');
  var rail = document.querySelector('.timeline-quick-access');
  if (!frameWrap || !frame || !column || !section) return;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.timeline-content'));
  var railItems = Array.prototype.slice.call(
    document.querySelectorAll('.timeline-quick-access-link .timeline-quick-access-element-container'));
  var current = null;

  function docTop(el) { return el.getBoundingClientRect().top + window.scrollY; }
  function isMobile() {
    return /Android|iPhone|iPad/i.test(navigator.userAgent) || 'ontouchstart' in document.documentElement;
  }

  function positionImages() {
    var vSpace = isMobile() ? window.screen.height : document.documentElement.clientHeight;
    var hSpace = document.documentElement.clientWidth;
    var w; var h; var top; var left;
    if (hSpace / vSpace > BANNER_RATIO) {
      left = 0; w = hSpace; h = hSpace / BANNER_RATIO; top = -(h - vSpace) / 2;
    } else {
      top = 0; h = vSpace; w = BANNER_RATIO * vSpace; left = -(w - hSpace) / 2;
    }
    frame.style.top = top + 'px';
    frame.style.left = left + 'px';
    frame.style.width = w + 'px';
    frame.style.height = h + 'px';
    // Source: `.timeline-container` is never positioned, so this branch always runs — the column's
    // top margin is corrected so it starts at the dark section's top.
    var margin = parseFloat(getComputedStyle(column).marginTop) || 0;
    margin -= docTop(column) - docTop(section);
    column.style.marginTop = margin + 'px';
  }

  function monitor() {
    var y = window.scrollY;
    var wrapTop = docTop(frameWrap);
    var pos = getComputedStyle(frame).position;
    if (y > wrapTop && pos !== 'fixed') {
      frame.style.position = 'fixed';
      positionImages();
    } else if (y <= wrapTop && pos !== 'static') {
      frame.style.position = 'static';
      positionImages();
    }

    if (rail) {
      var railTop = docTop(rail);
      var rs = getComputedStyle(rail); // jQuery .height(): content box
      var railH = rail.getBoundingClientRect().height - parseFloat(rs.paddingTop) - parseFloat(rs.paddingBottom)
        - parseFloat(rs.borderTopWidth) - parseFloat(rs.borderBottomWidth);
      var railCentre = railTop + railH / 2;
      railItems.forEach(function (el) {
        var d = docTop(el) - railCentre;
        el.style.opacity = String(1 - 0.8 * (2 * Math.abs(d) / railH));
      });
    }

    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var best = null; var min = 1e9;
    cards.forEach(function (c, i) {
      var r = c.getBoundingClientRect();
      var dx = (r.left + r.right) / 2 - cx;
      var dy = (r.top + r.bottom) / 2 - cy;
      var dist = dx * dx + dy * dy;
      if (dist < min) { min = dist; best = i; }
    });
    if (best === null) return;
    if (current !== null) {
      document.getElementById('timeline-img-' + current).classList.remove('is-shown');
      cards[current].classList.remove('is-current');
    }
    document.querySelectorAll('.timeline-img-frame > img.is-shown').forEach(function (img) {
      if (img.id !== 'timeline-img-' + best) img.classList.remove('is-shown');
    });
    current = best;
    document.getElementById('timeline-img-' + current).classList.add('is-shown');
    cards[current].classList.add('is-current');
    document.querySelectorAll('.timeline-quick-access-link div.active').forEach(function (d) {
      d.classList.remove('active');
    });
    document.querySelectorAll('#timeline-quick-access-link-' + current + ' div').forEach(function (d) {
      d.classList.add('active');
    });
  }

  window.addEventListener('load', function () { monitor(); positionImages(); });
  window.addEventListener('resize', function () { monitor(); positionImages(); });
  window.addEventListener('scroll', monitor, { passive: true });
  if (rail) {
    ['mouseover', 'mouseout', 'scroll'].forEach(function (ev) { rail.addEventListener(ev, monitor); });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    a.addEventListener('click', function (e) {
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}());
