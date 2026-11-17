/*
 * canon.js — chrome behaviour lifted from the source (elt_assets.c4ebe47d5f34.js `scrollMonitor`,
 * Bootstrap collapse, footer year script). Observed behaviour only.
 *  - #main-navbar: `mysticky` while the hero's bottom edge is above (scrollY + innerHeight − 70),
 *    else `myfixed` (pinned to the viewport bottom).
 *  - menus open upward (`dropup`, submenus `bottom-aligned`) until the hero's bottom edge is above
 *    (scrollY + innerHeight − 300), then downward (`dropdown`, `top-aligned`).
 *  - .big-header-image parallax: translate(0, −0.5 × scrollY).
 */
(function () {
  const hero = document.getElementById('big-header');
  const mainNav = document.getElementById('main-navbar');
  const heroImg = document.querySelector('.big-header-image');

  function scrollMonitor() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (hero && mainNav) {
      const heroBottom = hero.getBoundingClientRect().top + y + hero.offsetHeight;
      const sticky = heroBottom < y + (vh - 70);
      mainNav.classList.toggle('mysticky', sticky);
      mainNav.classList.toggle('myfixed', !sticky);
      const down = heroBottom < y + (vh - 300);
      mainNav.querySelectorAll('.dropdown-menu-top').forEach((li) => {
        li.classList.toggle('dropup', !down);
        li.classList.toggle('dropdown', down);
      });
      mainNav.querySelectorAll('.dropdown-submenu > .dropdown-menu').forEach((m) => {
        m.classList.toggle('bottom-aligned', !down);
        m.classList.toggle('top-aligned', down);
      });
    }
    if (heroImg) heroImg.style.transform = `translate(0, ${-0.5 * y}px)`;
  }
  window.addEventListener('load', scrollMonitor);
  window.addEventListener('resize', scrollMonitor);
  window.addEventListener('scroll', scrollMonitor, { passive: true });

  // Mobile menu toggle (Bootstrap collapse: 0.35 s height transition)
  const toggler = document.querySelector('#top-navbar .navbar-toggler');
  const collapse = document.getElementById('navbarNav');
  if (toggler && collapse) {
    toggler.addEventListener('click', () => {
      const open = collapse.classList.contains('show');
      toggler.setAttribute('aria-expanded', String(!open));
      if (open) {
        collapse.style.height = `${collapse.scrollHeight}px`;
        collapse.classList.remove('show');
        collapse.classList.add('collapsing');
        requestAnimationFrame(() => { collapse.style.height = '0px'; });
      } else {
        collapse.classList.add('collapsing');
        collapse.style.height = '0px';
        requestAnimationFrame(() => { collapse.style.height = `${collapse.scrollHeight}px`; });
      }
      collapse.addEventListener('transitionend', function done() {
        collapse.removeEventListener('transitionend', done);
        collapse.classList.remove('collapsing');
        collapse.style.height = '';
        if (!open) collapse.classList.add('show');
      });
    });
  }

  // Footer year (source: inline script in the footer)
  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
}());
