import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header — the source's two navigation bars (elt.eso.org), template-slotted from the authored
 * `/nav` document (path overridable per page with `nav` metadata, e.g. `/chile/nav`).
 *
 * `/nav` sections, in order (default content only):
 *  1 brand     — <p><a href="https://www.eso.org/"><img logo></a></p>
 *  2 language  — <p>Choose your language</p>, <ul> of language links, <p> "en | es" links
 *  3 social    — <ul> of <a><img alt="ESO on …"></a>
 *  4 menu      — nested <ul>: top items, their sub-menus, one more level (Mirrors)
 *  5 search    — <p><a href="<search action>">Search</a></p> (button label), <p>Search...</p>
 *  6 hero logo — <p><img></p><p>European<br>Southern<br>Observatory</p> (moved into the
 *                big-header block's logo slot)
 *
 * Renders `#top-navbar` (fixed 50px bar: logo, flags + language menu, social icons, mobile
 * toggler + collapse, search) inside <header>, and `#main-navbar` (desktop menu strip) inserted
 * into <main> right after the big-header section: sticky under the top bar once the hero has
 * scrolled up, fixed to the viewport bottom before; menus open upward until then (source
 * `scrollMonitor`, elt_assets.c4ebe47d5f34.js).
 *
 * @ew-exempt search: the button label and the input placeholder are UI strings read from the
 *   authored search section (a <button> and a placeholder attribute cannot host prose nodes).
 * @ew-exempt menu clone: the top bar's mobile menu and the second social icon row are
 *   presentational clones of the authored nodes (stripped of editor instrumentation).
 * @param {Element} block The header block element
 */

const DESKTOP = window.matchMedia('(min-width: 992px)');
const INSTRUMENTATION = ['data-prose-index', 'data-image-index', 'data-block-index'];
const FLAGS = ['at', 'be', 'cl', 'cz', 'da', 'fi', 'fr', 'de', 'ie', 'it', 'nl', 'pl', 'pt',
  'es', 'sv', 'ch', 'gb'];

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  node.append(...children);
  return node;
}

function stripInstrumentation(root) {
  [root, ...root.querySelectorAll('*')].forEach((n) => {
    INSTRUMENTATION.forEach((a) => n.removeAttribute(a));
  });
  return root;
}

function pathOf(href) {
  try {
    return new URL(href, window.location).pathname.toLowerCase().replace(/(.)\/$/, '$1');
  } catch {
    return '';
  }
}

/** the trigger link of a list item: `li > a` (authored) or `li > p > a` (delivered, #98) */
function triggerOf(li) {
  return li.querySelector(':scope > a, :scope > p > a, :scope > strong > a, :scope > p > strong > a');
}

/** builds a `.dropdown-menu` from an authored sub-list, moving its anchors */
function buildDropdown(ul, submenu = false) {
  const menu = el('div', { class: submenu ? 'dropdown-menu bottom-aligned' : 'dropdown-menu' });
  [...ul.children].forEach((li) => {
    const a = triggerOf(li);
    if (!a) return;
    a.className = 'dropdown-item';
    const nested = li.querySelector(':scope > ul');
    if (nested) {
      const wrap = el('div', { class: 'dropdown-submenu' });
      wrap.append(a, buildDropdown(nested, true));
      menu.append(wrap);
    } else {
      menu.append(a);
    }
  });
  return menu;
}

/** turns the authored menu list into the source's `.navbar-nav` */
function buildMenu(list) {
  const nav = el('ul', { class: 'navbar-nav' });
  if (!list) return nav;
  const here = pathOf(window.location.href);
  let anyActive = false;
  [...list.children].forEach((li) => {
    const a = triggerOf(li);
    if (!a) return;
    a.className = 'nav-link';
    const item = el('li', { class: 'nav-item menu-item' });
    item.append(a);
    const sub = li.querySelector(':scope > ul');
    if (sub) {
      item.classList.add('dropdown-menu-top', 'dropup');
      item.append(buildDropdown(sub));
    }
    const links = [a, ...item.querySelectorAll('.dropdown-item')];
    links.filter((x) => pathOf(x.href) === here && x.classList.contains('dropdown-item'))
      .forEach((x) => {
        x.classList.add('active');
        x.setAttribute('aria-current', 'page');
      });
    const top = pathOf(a.href);
    const inSection = links.some((x) => {
      const p = pathOf(x.href);
      return p !== '/' && (here === p || here.startsWith(`${p}/`));
    });
    if (top !== '/' && inSection) {
      item.classList.add('active');
      anyActive = true;
    }
    nav.append(item);
  });
  // the source boxes ELT HOME on the home pages only (/ and the /chile locale home)
  if (!anyActive && ['/', '/index', '/chile'].includes(here)) {
    const home = [...nav.children].find((li) => pathOf(triggerOf(li)?.href) === '/');
    if (home) home.classList.add('active');
  }
  return nav;
}

function buildLanguage(section) {
  const flags = el('ul', { class: 'navbar-flags', id: 'navbar-flags' });
  FLAGS.forEach((f) => flags.append(el('li', {}, el('span', { class: `flag flag-${f}` }))));
  const menu = el('li', { class: 'language-menu' });
  const message = el('div', { class: 'choose-language-message' });
  const options = el('div', { class: 'language-options' });
  const langLinks = el('span', { class: 'lang-links' });
  if (section) {
    const list = section.querySelector('ul');
    const paras = [...section.querySelectorAll(':scope p')].filter((p) => !p.closest('ul'));
    const label = paras.find((p) => !p.querySelector('a'));
    const short = paras.find((p) => p.querySelector('a'));
    const arrow = el('i', { class: 'fa-arrow-down', 'aria-hidden': 'true' });
    if (label) {
      label.append(arrow); // decorative glyph inside the message box, as on the source
      message.append(label);
    } else {
      message.append(arrow);
    }
    if (list) {
      list.querySelectorAll('a').forEach((a) => {
        const flag = pathOf(a.href).startsWith('/chile/') ? 'cl' : 'gb';
        a.prepend(el('span', { class: `flag flag-${flag}` }, ' '));
        options.append(a);
      });
    }
    if (short) {
      short.querySelectorAll('a').forEach((a) => a.classList.add('lang-link'));
      langLinks.append(short);
    }
  }
  menu.append(message, options);
  flags.append(menu);
  return { flags: el('div', { class: 'brand-flags' }, flags), langLinks };
}

function buildSocial(section) {
  const icons = el('div', { class: 'desktop-top-sm-icons' });
  if (section) {
    section.querySelectorAll('a').forEach((a) => {
      const img = a.querySelector('img');
      if (img && !a.title) a.title = img.alt;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      icons.append(a);
    });
  }
  return icons;
}

function buildSearch(section) {
  const li = el('li', { class: 'nav-item menu-item dropdown dropdown-menu-top-top', id: 'nav-search' });
  // as on the source: the icon ligature ("search") is the trigger's text and accessible name
  const trigger = el('a', { class: 'nav-link', href: '#' });
  trigger.append(el('i', { class: 'material-icons' }, 'search'));
  const action = section?.querySelector('a');
  const hint = [...(section?.querySelectorAll('p') || [])].find((p) => !p.querySelector('a'));
  const form = el('form', {
    class: 'search-form',
    action: action ? action.getAttribute('href') : '/search',
    method: 'get',
  });
  const label = action ? action.textContent.trim() : 'Search';
  const input = el('input', {
    type: 'search', name: 'q', placeholder: hint ? hint.textContent.trim() : '', 'aria-label': label,
  });
  // the source's inline whitespace between the input and the button (part of the gap)
  form.append(input, ' ', el('button', { type: 'submit' }, label));
  li.append(trigger, el('div', { class: 'dropdown-menu' }, el('div', { class: 'dropdown-item' }, form)));
  return li;
}

function placeHeroLogo(section) {
  if (!section) return;
  const nodes = [...section.children].map((n) => {
    const pic = n.querySelector('picture, img');
    if (!pic) {
      n.classList.add('esologo-text');
      return n;
    }
    (pic.tagName === 'IMG' ? pic : pic.querySelector('img')).classList.add('big-header-eso-logo');
    return pic;
  });
  const slot = document.querySelector('main .big-header .big-header-logos');
  if (slot) {
    slot.append(...nodes);
  } else {
    // the big-header block picks these up when it decorates after the header
    const stash = el('div', { class: 'header-hero-logo', hidden: '' });
    stash.append(...nodes);
    document.body.append(stash);
  }
}

function toggleCollapse(toggler, collapse) {
  const open = collapse.classList.contains('show');
  toggler.setAttribute('aria-expanded', String(!open));
  collapse.classList.add('collapsing');
  if (open) {
    collapse.style.height = `${collapse.scrollHeight}px`;
    collapse.classList.remove('show');
    requestAnimationFrame(() => {
      collapse.style.height = '0px';
    });
  } else {
    collapse.style.height = '0px';
    requestAnimationFrame(() => {
      collapse.style.height = `${collapse.scrollHeight}px`;
    });
  }
  const done = () => {
    collapse.classList.remove('collapsing');
    collapse.style.height = '';
    if (!open) collapse.classList.add('show');
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) done();
  else collapse.addEventListener('transitionend', done, { once: true });
}

/** source scrollMonitor: sticky/fixed morph of the main bar and the dropup/dropdown flip */
function watchScroll(mainNav) {
  const update = () => {
    const hero = document.querySelector('main .big-header');
    const y = window.scrollY;
    const vh = window.innerHeight;
    const heroBottom = hero ? hero.getBoundingClientRect().top + y + hero.offsetHeight : 0;
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
  };
  update();
  window.addEventListener('load', update);
  window.addEventListener('resize', update);
  window.addEventListener('scroll', update, { passive: true });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;

  // content sections only: the metadata block leaves an empty section behind
  const sections = [...fragment.querySelectorAll(':scope > .section > .default-content-wrapper')];
  const [brandSec, langSec, socialSec, menuSec, searchSec, heroSec] = sections;

  // top bar: brand (logo + flags + language menu)
  const brand = el('span', { class: 'navbar-brand navbar-brand-main' });
  const logo = el('div', { class: 'brand-logo' });
  const logoLink = brandSec?.querySelector('a');
  if (logoLink) {
    logoLink.target = '_blank';
    logoLink.rel = 'noopener noreferrer';
    logoLink.querySelector('img')?.classList.add('navbar-eso-logo');
    logo.append(logoLink);
  }
  const { flags, langLinks } = buildLanguage(langSec);
  brand.append(logo, flags);

  // social icons: authored row in the desktop menu, clone in the mobile brand row
  const social = buildSocial(socialSec);
  const socialMobile = stripInstrumentation(social.cloneNode(true));
  const brandSocial = el('div', { class: 'navbar-brand brand-social' }, socialMobile);

  // menus: authored list in the main bar, clone (mobile-only) in the top bar collapse
  const menu = buildMenu(menuSec?.querySelector('ul'));
  const mobileMenu = stripInstrumentation(menu.cloneNode(true));
  [...mobileMenu.children].forEach((li) => li.classList.add('mobile-only'));
  const socialItem = el('li', { class: 'social-desktop desktop-top-sm-icons' });
  socialItem.append(...social.children);
  mobileMenu.append(socialItem, buildSearch(searchSec));

  const toggler = el('button', {
    class: 'navbar-toggler',
    type: 'button',
    'aria-controls': 'navbar-collapse-top',
    'aria-expanded': 'false',
    'aria-label': 'Toggle navigation',
  }, el('span', { class: 'navbar-toggler-icon' }));
  const collapse = el('div', { class: 'navbar-collapse', id: 'navbar-collapse-top' }, mobileMenu);
  toggler.addEventListener('click', () => toggleCollapse(toggler, collapse));

  const topNav = el('nav', {
    id: 'top-navbar', class: 'navbar header-nav top-navbar', 'aria-label': 'ESO and site navigation',
  });
  topNav.append(brand, brandSocial, langLinks, toggler, collapse);
  block.append(topNav);

  // main bar: after the big-header section (or first in <main> when a page has none)
  const mainNav = el('nav', {
    id: 'main-navbar', class: 'navbar header-nav main-navbar mysticky', 'aria-label': 'Main',
  });
  mainNav.append(el('div', { class: 'navbar-collapse' }, menu));
  const main = document.querySelector('main');
  const heroSection = main?.querySelector('.big-header')?.closest('.section');
  if (heroSection) heroSection.after(mainNav);
  else if (main) main.prepend(mainNav);
  document.body.classList.add('has-main-navbar');
  watchScroll(mainNav);

  placeHeroLogo(heroSec);

  DESKTOP.addEventListener('change', () => {
    if (DESKTOP.matches) {
      collapse.classList.remove('show', 'collapsing');
      collapse.style.height = '';
      toggler.setAttribute('aria-expanded', 'false');
    }
  });
}
