# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `elt.eso.org` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** no third-party CMP. The source's consent UI is the first-party ESO privacy notice (cookie `user_privacy` = `{language, matomo, shop}`, 182 days).
- **Model `per-tag`:** Matomo loads ungated and gates its own cookies (`requireCookieConsent`, then `setCookieConsentGiven` when `user_privacy.matomo` is true). Keep the route `category` null.
- **Categories:** language, matomo, shop (the notice's toggles).

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| matomo | Matomo | `https://www.eso.org/mtmo/matomo.js` | — | false |

## Rewrite before go-live

Nothing found (or no tag-manager library read).

## Matomo (read from the source's own JavaScript)

The source loads Matomo from `https://www.eso.org/mtmo/matomo.js` (tracker `https://www.eso.org/mtmo/matomo.php`,
site id `2`) on window load, with `requireCookieConsent`; cookie consent is granted only when the first-party
`user_privacy` cookie has `matomo: true` (set by the ESO privacy notice: Accept All / Accept Only Essential
Cookies / Cookie Settings). Source: `elt_assets.c4ebe47d5f34.js`.

On the migrated site the route `matomo` is in the contract, **disabled**. To turn it on: initialise `window._paq`
exactly as above (the contract's `tagNotes.Matomo.notes`), set `enabled: true` on the route, and re-run
`martech-scaffold.mjs`.
