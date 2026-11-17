/**
 * Share Bar — the source's share icons (inner.css "Share icons + share dropdown", L15806–L15890):
 * the first network as an inline icon, then a share-menu icon whose hover dropdown lists every
 * network with its label. Share targets are built from the current page URL.
 *
 * Content model (one row per network, one cell holding the label paragraph):
 *   | share-bar         |
 *   | Share on Facebook |
 *   | E-Mail            |
 *   | Copy Link         |
 *   | Share on LinkedIn |
 * The network is recognised from the label (facebook, linkedin, twitter / x, mail, copy / link);
 * an unrecognised label is kept as a copy-link entry. An empty block renders these four.
 * Placement: a share-bar authored in the same section as a text-section is docked in that
 * text-section's title row (done by text-section); standalone it renders as a right-aligned row.
 *
 * @ew-exempt the inline first-network icon is a presentational clone of the first dropdown entry
 *   (its title/alt derive from that entry's authored label); default labels of an EMPTY block are
 *   generated config.
 * @param {Element} block The share-bar block element
 */
const ICONS = {
  facebook: 'icon_share_1.png',
  menu: 'icon_share_3.png',
  linkedin: 'icon_share_4.png',
  email: 'icon_share_5.png',
  copy: 'icon_share_6.png',
  twitter: 'icon_share_6.png',
};

const DEFAULTS = ['Share on Facebook', 'E-Mail', 'Copy Link', 'Share on LinkedIn'];

function networkOf(label) {
  const text = label.toLowerCase();
  if (text.includes('facebook')) return 'facebook';
  if (text.includes('linkedin')) return 'linkedin';
  if (text.includes('twitter') || /\bx\b/.test(text)) return 'twitter';
  if (text.includes('mail')) return 'email';
  return 'copy';
}

function shareHref(network, url) {
  const u = encodeURIComponent(url);
  if (network === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  if (network === 'linkedin') return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  if (network === 'twitter') return `https://twitter.com/intent/tweet?url=${u}`;
  return '#';
}

function icon(name, alt, width = 35) {
  const img = document.createElement('img');
  img.src = `${window.hlx?.codeBasePath || ''}/blocks/share-bar/${ICONS[name]}`;
  img.alt = alt;
  img.width = width;
  img.height = 35;
  img.loading = 'lazy';
  return img;
}

function link(network, label, url) {
  const a = document.createElement('a');
  a.className = 'share-social-media-link';
  a.href = shareHref(network, url);
  a.title = label;
  if (network === 'email') a.classList.add('share-email');
  if (network === 'copy') a.classList.add('clipboard');
  if (a.getAttribute('href') !== '#') {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  return a;
}

function onAction(event, network, url) {
  if (network === 'email') {
    event.preventDefault();
    const subject = encodeURIComponent(document.title);
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(url)}`;
  } else if (network === 'copy') {
    event.preventDefault();
    navigator.clipboard?.writeText(url);
  }
}

export default function decorate(block) {
  if (block.querySelector('.share-menu')) return; // re-entrant (EW9)
  const url = `${window.location.origin}${window.location.pathname}`;

  // authored label paragraphs, one per row; bare-text cells are wrapped as <p>
  const labels = [...block.children].map((row) => {
    const cell = row.firstElementChild || row;
    let p = cell.querySelector('p');
    if (!p && cell.textContent.trim()) {
      p = document.createElement('p');
      p.append(...cell.childNodes);
    }
    return p;
  }).filter(Boolean);
  if (!labels.length) {
    DEFAULTS.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      labels.push(p);
    });
  }

  const icons = document.createElement('div');
  icons.className = 'share-social-media-dropdown-icons';
  const entries = labels.map((p) => {
    const label = p.textContent.trim();
    const network = networkOf(label);
    const a = link(network, label, url);
    const text = document.createElement('span');
    text.className = 'share-social-media-dropdown-text';
    text.append(p);
    a.append(icon(network, label, network === 'copy' ? 36 : 35), ' ', text);
    a.addEventListener('click', (e) => onAction(e, network, url));
    icons.append(a);
    return { network, label };
  });

  // inline icon: presentational clone of the first entry (@ew-exempt)
  const first = entries[0];
  const inline = link(first.network, first.label, url);
  inline.classList.add('share-social-media-icons');
  inline.append(icon(first.network, first.label));
  inline.addEventListener('click', (e) => onAction(e, first.network, url));

  const menu = document.createElement('span');
  menu.className = 'share-menu';
  menu.title = 'Share on Social Media';
  const trigger = document.createElement('span');
  trigger.className = 'share-social-media share-social-media-icons';
  const triggerImg = icon('menu', '', 36);
  triggerImg.classList.add('share-social-media');
  trigger.append(triggerImg);
  const dropdown = document.createElement('div');
  dropdown.className = 'share-social-media-dropdown';
  dropdown.append(icons);
  menu.append(trigger, dropdown);

  block.replaceChildren(inline, menu);
}
