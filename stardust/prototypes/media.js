/*
 * media.js — News & Multimedia rails. The source drives both rails with Swiper 5.4.5
 * (elt_assets_visuals.1fe5828545ed.js: slidesPerView 1, 2 at ≥1000 px, 3 at ≥1400 px, spaceBetween 0,
 * prev/next buttons, no loop, no autoplay). This replicates that navigation natively: one slide per
 * click, the prev button disabled at the start and the next button at the end (Swiper's
 * .swiper-button-disabled + aria-disabled), the wrapper translated by CSS (--slide × slide width), and
 * the same swiper-slide-active / -next / -prev class states the live rail toggles (observed:
 * stardust/replica/motion/media.json).
 *
 * Featured stories: the source page's inline script (observed firing: category tab click) — the first
 * five stories are server-rendered; "More..." appends the next six, a category tab clears the grid and
 * shows the first five of that category; the "More..." tile hides when the list runs out. Data: the
 * page's own `stories` array, carried verbatim in #media-stories-data.
 */
(function () {
  function perView() {
    if (window.matchMedia('(min-width: 1400px)').matches) return 3;
    if (window.matchMedia('(min-width: 1000px)').matches) return 2;
    return 1;
  }

  function setDisabled(btn, disabled) {
    btn.classList.toggle('swiper-button-disabled', disabled);
    btn.setAttribute('aria-disabled', String(disabled));
    btn.tabIndex = disabled ? -1 : 0;
  }

  function rail(container, sfx) {
    var wrapper = container.querySelector('.swiper-wrapper');
    var next = container.querySelector('.swiper-button-next-' + sfx);
    var prev = container.querySelector('.swiper-button-prev-' + sfx);
    if (!wrapper || !next || !prev) return;
    var index = 0;
    wrapper.style.transitionDuration = '300ms'; // Swiper default speed

    function update() {
      var slides = wrapper.children;
      var max = Math.max(0, slides.length - perView());
      if (index > max) index = max;
      wrapper.style.setProperty('--slide', index);
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('swiper-slide-active', i === index);
        slides[i].classList.toggle('swiper-slide-next', i === index + 1);
        slides[i].classList.toggle('swiper-slide-prev', i === index - 1);
      }
      setDisabled(prev, index === 0);
      setDisabled(next, index >= max);
    }
    function go(step) { index += step; if (index < 0) index = 0; update(); }

    next.addEventListener('click', function () { go(1); });
    prev.addEventListener('click', function () { go(-1); });
    [next, prev].forEach(function (btn) {
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
    });
    window.addEventListener('resize', update);
    update();
  }

  var STAMPS = { release: 'Press Release', announcement: 'Announcement', potw: 'Picture of the Week', post: 'Blog Post', video: 'Video' };

  function stories() {
    var dataEl = document.getElementById('media-stories-data');
    var grid = document.querySelector('.stories-container');
    var more = document.querySelector('.story-more-container');
    if (!dataEl || !grid || !more) return;
    var data = JSON.parse(dataEl.textContent);
    var counter = 5;
    var increment = 6;
    var category = 'all';

    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    }

    function loadMore(step) {
      if (step == null) step = increment;
      var next = counter + step;
      var list = category === 'all' ? data : data.filter(function (s) { return s.category === category; });
      var slice = list.slice(counter, next);
      var moreTile = grid.lastElementChild;
      moreTile.style.display = (next - counter === slice.length) ? 'block' : 'none';
      slice.forEach(function (story) {
        var card = el('div', 'story-container');
        var link = el('a');
        link.setAttribute('href', story.absolute_url);
        var imgBox = el('div', 'story-img-container');
        var img = el('img', 'story-img');
        img.setAttribute('src', story.main_visual_url);
        img.setAttribute('alt', story.main_visual_title);
        imgBox.append(img, el('div', 'section-title section-title-nolink story-category-stamp', STAMPS[story.category] || ''));
        var desc = el('div', 'story-description');
        desc.append(el('div', 'date', story.release_date + ' - ' + story.id), el('div', 'title', story.title));
        link.append(imgBox, desc);
        card.append(link);
        moreTile.before(card);
      });
      counter = next;
    }

    function reset() {
      counter = 0;
      document.querySelectorAll('.story-category').forEach(function (c) { c.classList.remove('story-selected-category'); });
      var sel = document.querySelector('.story-category[data-category="' + category + '"]');
      if (sel) sel.classList.add('story-selected-category');
      var cards = Array.prototype.slice.call(grid.children, 0, grid.children.length - 1);
      cards.forEach(function (c) { c.remove(); });
    }

    more.addEventListener('click', function () { loadMore(); });
    document.querySelectorAll('.story-category[data-category]').forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        var cat = e.currentTarget.dataset.category;
        if (category !== cat) { category = cat; reset(); loadMore(5); }
      });
    });
  }

  function init() {
    stories();
    var v = document.querySelector('.swiper-container-video');
    var m = document.querySelector('.swiper-container-media');
    if (v) rail(v, 'video');
    if (m) rail(m, 'media');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
