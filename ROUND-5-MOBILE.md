# Round 5: phone product page and collections (2026-10-22)

Theme: **PREVIEW v7 - swipe + PDP + collections (review)**, `gid://shopify/OnlineStoreTheme/187544633396` (unpublished).
Live theme: `PREVIEW v5 - heroes + gallery fix (WIP)` (187531657268). v7 was copied from live at 03:39 UTC today, and live
has not been edited since, so publishing v7 loses nothing.

Preview: https://norafurnish.com/products/retro-woven-bamboo-ceiling-light?preview_theme_id=187544633396
Collections: https://norafurnish.com/collections/all?preview_theme_id=187544633396

## What changed (all files mirrored in `theme-full/`)

The earlier v7 work is `assets/nf-m4.css` sections S–W and `nf-m4.js` part 9. This round audited it against the real markup
and added `assets/nf-m6.css` + `assets/nf-m6.js`, loaded last from `snippets/nf-mod-global.liquid`.

| Ask | State before this round | Fix |
|---|---|---|
| Swipe flashes white, won't swipe | Root cause: `custom-nav.js` NF-MOBILE-V4 moved the strip by hand (`scrollLeft` per finger move, snap off once), while `theme.js` ScrollCarousel turned snap back on at every `scrollend`, so mid-drag the strip snapped back and showed the white slide boxes. `custom-nav.css` also blocked native sideways panning (`touch-action: pan-y`). | nf-m6.css A: `touch-action: manipulation`, native scroll-snap, one photo per flick. nf-m6.js: the old drag is stopped on `<body>` (tap-to-zoom on the gallery still works). |
| Hero centred, equal edges | Fixed under 700px only | nf-m6.css B: all phone/tablet widths |
| Bigger thumbnails | 72px buttons in 56px grid columns overlapped | nf-m6.css B: columns 72px |
| More room above the path | +2px only | nf-m6.css B: 24px above, 14px below |
| Line under the menu | Works (product + collection pages, phones) | — |
| Sticky add-to-cart like MOD | 64px tall bar but hidden at -56px, so 8px peeked and tab jumps landed under it | nf-m6.css C: MOD's 56px |
| Filters / Sort like MOD | v7 rules lost to `nf-shop-v3.css` and `nf-mod-style.css` | nf-m6.css G: 50px bar with hairlines, Filters at the left gutter, Sort by at the right, 14px Poppins 400, no middle divider |
| Goes well with | Works (16px gutter, cards = Recently viewed 58%) | nf-m6.css E: 18px titles to match |
| Reviews: 5 open, then Show more | Broken: `nf-mod-style.css` forced every row visible, so Show more did nothing | nf-m6.css D |
| Showing 50 of … | Collections set to 50 (live is 48) | Search results also 50 (`sections/main-search.liquid`) |
| Our promise | Partly overridden | nf-m6.css F: centred heading, gold rule and card shadow on phones, no doubled padding on desktop |
| Main photo first / speed | First photo already eager + high priority + preloaded | Refresh/back no longer waits for the whole page (reviews, Q&A) before painting; it paints once the gallery and buy box are in (`templates/product.default-product-v2.json`, `#nf-main-end` marker) |

## Not verified on a device
The cloud session can't load the storefront, so this was checked against the theme code only. Test on an iPhone before publishing.

## Speed, next steps (not done; bigger changes)
- About 1MB of render-blocking CSS on every product page (theme.css, custom-nav.css, nf-mod-style.css 330KB...).
- `nf-cart-v2.css` and `nf-gamify.css` block rendering outside the homepage; they could load non-blocking.
- `snippets/nf-gate.liquid` creates a WebGL context in the head on the first product view.
