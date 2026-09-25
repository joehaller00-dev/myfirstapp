# Nora Furnish: product page redesign, prototype 1 (NF-PDP3-V1)

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

## Before going live

1. To ship, copy these files into the live theme and replace its product template. Don't publish the prototype theme: the live theme is edited almost daily, and publishing the copy would roll those edits back.
