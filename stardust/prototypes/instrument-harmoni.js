/*
 * instrument-harmoni.js — observed behaviour only: the AOS "fade-right" reveal on the Instrument
 * Design figure (data-aos="fade-right" data-aos-offset="300", AOS defaults: 400 ms ease, once:false,
 * scroll handler throttled 99 ms). Re-implemented without the library; CSS in instrument-harmoni.css.
 */
(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-aos]'));
  if (!els.length) return;
  function trigger(el) {
    var offset = parseInt(el.getAttribute('data-aos-offset') || '120', 10);
    var top = el.getBoundingClientRect().top + window.pageYOffset;
    return top - window.innerHeight + offset;
  }
  function refresh() {
    var y = window.pageYOffset;
    els.forEach(function (el) { el.classList.toggle('aos-animate', y >= trigger(el)); });
  }
  els.forEach(function (el) { el.classList.add('aos-init'); });
  var t = null;
  window.addEventListener('scroll', function () {
    if (t) return;
    t = setTimeout(function () { t = null; refresh(); }, 99);
  }, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  refresh();
})();
