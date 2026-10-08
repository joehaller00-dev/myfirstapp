# Store fix list: Nora Furnish (norafurnish.com)

Ordered by risk, then revenue impact. "Who" = can be done by Claude through the Shopify Admin API (API) or needs the owner (Owner). Evidence: data/storefront-audit.md, data/price-history.md, panel results.

## Week 1: legal and platform risk (do first)

| # | Fix | Why | Who |
|---|---|---|---|
| 1 | Stop presenting imported reviews as "Verified Buyer": remove the homepage proof block (`custom_liquid_nfproof`), the About/Guides quote walls, the hard-coded 1,368 review count (`custom.nf_reviews_count`/`nf_reviews_rating`) and the "Verified Buyer" fallback labels. Either delete the 838 imported Judge.me reviews or show them only with Judge.me's "Collected from another provider" badge under "Reviews of this design from other retailers"; strip their `aggregateRating` from structured data. | FTC Consumer Reviews and Testimonials Rule (16 CFR 465); Google Merchant Center misrepresentation suspension would stop Google Ads, the only paid channel | API (theme + metafields); Owner (Judge.me admin) |
| 2 | Clear every compare-at price that was not the real selling price for 30+ days (165 products show a "reduced" price; 492 in Sale). Remove `clearance` tag from made-to-order items. Kill the rolling Fall → Halloween countdown; fix the stale "First Days of Fall Sale" hero. | FTC 16 CFR 233.1; Google Shopping sale-price rules; buyers saw $36.99 items reappear at "$146.99 → $123.99" | API |
| 3 | Rename "Best Sellers" to "Editor's Picks"; drop "customers love and come back for" and "Best Sellers for a Reason". | 50 of 74 items are tagged `dazuma-best-seller` (another store's best sellers) | API |
| 4 | Remove workshop/handmade claims ("assembled by hand in small batches", "leaves the workshop", "Handcrafted", "handmade character", "all come to us"); disclose "Most pieces ship directly from our partner factories overseas". | Unbackable claims; FTC Act s.5 | API |
| 5 | One warranty statement (1 year on lighting, LEDs and driver) replacing the two contradictory FAQ answers. | Contradiction; integrated-LED fixtures with a 30-day warranty | API (pages) + Owner decision |
| 6 | One shipping truth: replace every green "In stock" with a computed delivery window; made-to-order shows production time; fix About's "5 to 7 days"; one damage-claim window (30 days). | FTC Mail Order Rule; 337 made-to-order items say "In stock" | API (theme) |
| 7 | Hide or delist hardwired SKUs with no UL/ETL listing and every 220V/E14 variant; stop selling until certification is confirmed by the supplier. | Electrical safety, NEC, product liability; trade buyers cannot install unlisted fixtures | Owner (supplier certs) + API (unpublish) |

## Week 2: trust and conversion

| # | Fix | Who |
|---|---|---|
| 8 | Human contact: Shopify Inbox chat is already enabled in the theme (keep it, set a greeting and staff it during posted hours); add a Google Voice number, founder name and photo on About, legal entity and mailing address in the footer and Contact page, a real Facebook Page URL. | Owner + API |
| 9 | Free 30-day returns on lighting with a prepaid label to the Edmond address; update the refund policy. | Owner decision + API |
| 10 | Cut navigation from 15 to 6 items (Ceiling, Wall, Lamps, Outdoor, Trade, Sale-only-when-real); remove Halloween inflatables and seasonal novelty from the homepage; at most 8 homepage sections; trust strip directly under the hero. | API (theme, menus) |
| 11 | Unpublish off-niche and sub-$30 non-lighting SKUs (shoe boxes, inflatables, incense, shower curtains); target about 150-300 lighting SKUs live. | API (bulk status) after Owner signs off the keep list |
| 12 | Discount clean-up: delete COMEBACK10, Welcome Back 5%, "Kevin 15", Member 20%, MEMBERWELCOME and the per-product popup; keep Bundle (2+ same collection 10%) and one delayed welcome offer. Pull the $250 membership from navigation. | API |
| 13 | PDP assurance row → delivery date, 1-year warranty, free returns, "Questions? Chat with us"; turn on footer payment icons; enable the cart discount field. | API (theme) |
| 14 | Turn on Judge.me post-purchase review requests with a photo incentive that does not depend on the rating. | Owner (Judge.me) |

## Weeks 3-6: product and proof

| # | Fix | Who |
|---|---|---|
| 15 | Spec table metafield on every lighting product: certification + file number, voltage, watts, lumens, CRI, CCT, dimmable/dimmer type, base, bulb included, IP, weight, warranty. | API (definitions) + Owner (supplier data) |
| 16 | Sample and photograph the 30 hero SKUs; replace supplier photos; rename `_51egv`-style handles with redirects; strip supplier SKUs (DZ…, AliExpress property IDs) from customer view. | Owner (samples, photos) + API |
| 17 | Reprice hero SKUs to sit near identical listings elsewhere (see pricing.md); one price, no anchors. | API after pricing sign-off |
| 18 | Rewrite copy on the 10 products that get paid traffic (Stair Light 180-variant matrix → kit size × CCT). | API |
| 19 | Theme clean-up: move ~150 `_bak_*` files out, delete 9 spare themes, purge unused CSS (~430 KB), fire AddToCart via Customer Events instead of the 12-second-deferred gtag. | API (theme files) |
| 20 | Exclude owner/internal traffic and filter bots in analytics before reading the funnel again. | Owner (Shopify/GA settings) |
