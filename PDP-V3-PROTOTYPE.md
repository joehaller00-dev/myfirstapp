# Nora Furnish: product page redesign and store polish (NF-PDP3, rounds 1 to 3)

Store: Nora Furnish (norafurnish.com, `ij7iyx-13.myshopify.com`). It's a US home decor and lighting store that dropships, with the DSers/Fulfiz supply chain behind it.
Live theme: `nora-warm-atelier` (Prestige based, heavily customised). All products use the `product.default-product-v2` template.

## Where the prototype lives

This is an unpublished copy of the live theme, **`nora-pdp-v3-prototype`** (`gid://shopify/OnlineStoreTheme/167122862132`), so the live store was not touched.

Preview: https://norafurnish.com/products/black-gold-minimalist-wall-lamp?preview_theme_id=167122862132

## What changed (files in `theme-proto/`)

| File | What |
|---|---|
| `templates/product.default-product-v2.json` | Gallery set to *carousel, thumbnails bottom*. The container is XL. New block order: title, price, options, **Bundle & Save**, Add to Cart, **one reassurance row**, then accordions with icons (Key Features, Dimensions, Materials & Care, What's Included, Shipping & Returns, FAQ). Removed from the buy box: "Complete the look", the trust boxes, "Why this is special" and "Pairs well with". New sections: **story + reviews carousel** right under the product, then Judge.me reviews and questions, then **Complete the room**. "Complete the Room" related products is renamed "You may also like". |
| `snippets/nf-bundle-tiers.liquid` | Bundle & Save cards. **1 Item** is the standard price. **2 Items** is *Popular*, extra 10% off. **3+ Items** is *Best value*, extra 15% off, with a 3–20 stepper. The cards set the add-to-cart quantity. They only show on products in `multi-item-discount-eligible`. |
| `snippets/nf-pdp-assure.liquid` | One clean row: Free & tracked shipping · Secure checkout · Easy returns. |
| `snippets/nf-pdp-keyfeat.liquid` | Key Features accordion: the highlights as a tick list, plus the "why it's special" text. |
| `sections/nf-pdp-story.liquid` | The left side has a headline, the story text, a "Custom, trade & project orders" card with **Enquire** (it opens the existing bulk quote form) and 3 tiles. The right side has "Why customers love us", a carousel of real Judge.me store reviews (4 and 5 stars, shown unedited). |
| `sections/nf-pdp-ctr.liquid` | Its own band for the existing "Complete the room / Buy together" module. |
| `assets/nf-pdp3.css`, `assets/nf-pdp3.js` | Styles and behaviour: gallery arrows and the `n / total` counter, square thumbnails, the wider buy box with a divider, bundle card logic, the carousel, and moving Complete the room. The old chips, Pack Size, trust band and Bulk Quote button from `nf-pdp.js` are hidden only on pages that carry the new marker. `nf-pdp.js` and `nf-bundle.js` are **not modified**. |

`theme-live/` is a read-only snapshot of the relevant live files, taken on 2026-09-25 for reference and rollback.

## Round 2 (owner feedback, same day)

- There's no card box around the buy column any more; it's plain with one hairline divider, like Baskoraa. The container is full width and the split is 52/48, so the buy column is wider and starts further left.
- The page opens on the product's **first image**. Before, it opened on the cheapest option's picture, which is often a spec drawing.
- Bundle & Save now sits under Add to Cart / PayPal, like Baskoraa. It didn't render in round 1 because the storefront can't see the discount collection; eligibility is now "type is not Room Set", which is exactly that collection's rule.
- The 2 and 3+ cards show one option dropdown per item. Mixed options are added in one go.
- The quantity box and the cards stay in sync: 2 selects 2 Items, and 3 or more (e.g. 6) selects 3+ at 15%.
- A green **In stock** line was added, and "Order today, arrives…" is gone.
- **Add to Wishlist** was added. It's stored in the shopper's browser, since the store has no wishlist app.
- Everything is bigger: title, price, buttons, cards, and the "Why customers love us" cards (3 per view with larger photos).
- **Live discount created:** "Buy 3+ items, save 15%" (automatic, same collection). Shopify applies the better of 10% / 15%.

## Round 3 (owner feedback, same day). All files are in `theme-full/`; the prototype theme holds every one of them (checksums verified)

**Product page**
- **Wishlist asks for an email.** A signed-out shopper tapping Add to Wishlist gets a small sign-up box. The email is saved as a customer tagged `newsletter, wishlist`, so it lands in the mailing list, with links to sign in or create an account. Signed-in customers skip the box.
- **The gap under the gallery is gone.** On desktop the "Why you'll love it" story and the reviews carousel now sit directly under the gallery, in the left column, while the buy column carries on at the right.
- **PayPal / Buy it now with mixed options.** When the bundle dropdowns hold different options, the PayPal, Shop Pay and Buy it now buttons are hidden and replaced by one "Buy it now" button. It adds exactly the chosen items and goes straight to checkout, so PayPal can no longer buy only the first option.
- **The hero is always the first product image**, even after the page picks a default option.
- **Reviews and questions are cleaner.** Tabs are underlined, reviews show as a card grid (4, 3, 2 or 1 per row by screen size), questions show as cards, and nothing is hidden.
- **Room sets show reviews.** A set's page shows the real reviews of each piece it includes, clearly labelled by piece, with an average across them and a "Pieces rated X" line in the buy box. Nothing is attributed to the set itself.

**Store-wide**
- **The offer reads "Buy 2, save 10%. Buy 3 or more, save 15%" everywhere:** cart drawer, cart page, progress bar, bundle popups, FAQ, the help widget, every project page, the bulk pages and the lighting catalog.
- **The announcement bar no longer slides.** During the sale it shows the sale name, "Up to 30% off" and a live countdown ("Ends in 4d 03h 12m 09s"), with a Shop the sale link. After the sale it switches to free shipping and the 10% / 15% offer.
- **Recently viewed, then the Nora Furnish guide, always last** on every product page and every collection template (default, lighting, mirrors, rugs).
- **Professional project pages have one clear path.** Each page now has one main button, "Get a free project quote", plus one "Shop [industry] lighting" button in the hero. The duplicate buttons are removed from the inspiration strip. The closing band keeps the quote button and a single "How project pricing works" link. Concept cards open the concept instead of repeating "Order this look in bulk". The same wording is used in the top bar panel.

**Footer V3 and brand** (`assets/nf-brand.css`, `sections/footer.liquid`)
- **The footer lighting now makes sense.** Five pendants of different shapes light the menus from above, and seven floor uplights at the bottom light a giant "Nora Furnish" wordmark from below. They switch on one after another when the footer scrolls into view.
- **The logo is bigger** (280px, glowing), with a new brand line. Mock screenshots: `docs/footer-v3-*.png`.
- **Homepage section titles are bolder:** Fraunces 600, larger and tighter. This covers "Rooms that glow", "Evenings out front", "Watch the kitchen come alive", "New outdoor lighting", and also Pieces, Autumn at Home, Room by room, the journal, the video and the catalog promo.
- **Signature color "Ember"** (applied in the prototype): ember red `#7a2616`, deep ember `#3d140c`, candle cream `#f6eee2`, with the existing brass. It is used on the announcement bar, the footer, the product page Add to cart button, the Popular tag, eyebrows and homepage titles. Every value is a `--nfb-*` token at the top of `nf-brand.css`, so it swaps in one place.

  | Spitball | Colors | Feel |
  |---|---|---|
  | **Ember** (in the prototype) | ember red, deep ember, candle cream, brass | a filament just switched on: warm, ownable, lighting-first |
  | Midnight Brass | ink navy `#16202e`, brass, cream | evening, hotel bar, premium |
  | Olive Atelier | deep olive `#3d4231`, linen `#efe9dd`, brass | calm, design-studio, natural materials |
  | Terracotta Dusk | terracotta `#a4502f`, sand `#efe3d3`, charcoal | sunset, Mediterranean, outdoor-heavy |

**Store data changed directly (live, not theme)**
- **The lighting catalog is corrected.**
  - 16 products in it were archived (dead links). Each was replaced with an active product of the same type. Two of them were lifestyle hotspots, and their pins are estimates, so please eyeball the Classic Multi Arm Chandelier and Solar Mason Jar Lantern spreads, plus the Curved Up and Down spread.
  - 11 more products used old handles. They now use the current handles, so live prices load.
  - The catalog now has 128 active products in 11 chapters, matching its own text. The "more than 800 fixtures" claim is true (975 active lighting products).
  - The welcome page offer now reads 10% on 2 / 15% on 3+.
- **The `lighting-catalog-2026` collection matches exactly:** 16 archived products were removed and 16 were added, for 128 products, all active.
- **Room sets:** all 50 sets and all 12 industry "room sets" collections have images (added earlier today). If a set still looks bare, send the URL.

## Round 4 (owner feedback)

- **Reviews use the Baskoraa layout.** The average, stars and count sit on the left, with Write a review and Ask a question (both outlined) on the right. Tabs run on a full width rule, Newest sits on the right, and fixed width cards start at the left with the photo first, so a product with two reviews still looks tidy. Mock: `docs/reviews-v4-mock.png`.
- **No red anywhere.**
  - Add to cart is the signature tan (#b38b5d), and Buy it now is black.
  - The announcement bar is back on its original dark background, with tan text and a tan outlined countdown that is always visible.
  - Eyebrows, the Popular tag and the headings are back to the house colors.
- **Footer V4.**
  - The giant wordmark and the white divider are gone. The cursive logo (300px) is lit from below by five floor uplights, and the lower half is compact.
  - The old brand line is removed. Under the social icons: "At Nora Furnish, we believe the right light is what turns a house into a home, one warm room at a time." Mock: `docs/footer-v4-desktop-mock.png`.
- **Headings.** Only New Outdoor Lighting stays bold; every other homepage title is back to the house serif, which also makes Autumn at Home readable again. Fifteen font and weight options are in `docs/heading-font-options.html`. The owner picks, then we apply it.
- **Room sets show every piece.** A new "Every piece, photo by photo" block (`sections/nf-set-pieces.liquid`) lists each piece with its name, option, quantity and price, and a strip of all its own photos. Tapping one opens a large viewer with arrows. On desktop the block sits directly under the set's gallery.

## Round 5 (owner feedback)

- **Headings:** option 3 was chosen. Fraunces at weight 450 is used on every homepage section title, and New Outdoor Lighting keeps 600.
- **Reviews are now our own section** (`sections/nf-reviews.liquid`). The round 4 restyle never showed because the live Judge.me widget uses different markup.
  - It is drawn from Judge.me's review data on the product, in the exact Baskoraa layout. Mock: `docs/reviews-v5-mock.png`.
  - "Show more reviews" asks Judge.me for the next page. If that fails, it opens Judge.me's own list.
  - Write a review opens Judge.me's own form, so new reviews still go to Judge.me.
  - The Judge.me block stays on the page, hidden until one of those is needed.
- **Footer V5.** Mock: `docs/footer-v5-desktop-mock.png`.
  - The script logo is much larger, 380 to 760px wide.
  - The belief line is set in large Fraunces, with "Nora Furnish" in tan. It showed black before.
  - The floor uplights are replaced by a brass picture light that lights the logo from above.
- **Room sets:** "Every piece, photo by photo" replaces the set's own gallery at the top left. Each piece shows big photos two to a row: four on desktop and two on phones, then "See all N photos". Mock: `docs/room-set-pieces-mock.png`.

## Before going live

1. The live theme was last edited at 13:36 UTC on 2026-09-25, before the prototype was copied, so **publishing the prototype as it is now loses nothing**. If anyone edits the live theme before you publish, copy those edits across first, or copy the files listed above into the live theme instead.
2. Delete `assets/nf-zz-test.txt` from the prototype in Shopify admin. It is a harmless test file, and the API blocks deletes.
