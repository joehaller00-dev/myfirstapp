# Nora Furnish: Storefront Conversion and Trust Audit

**Date:** 2026-10-08. **Method:** read-only Admin API (live theme files, pages, policies, products, metafields, Judge.me data, ShopifyQL). Nothing was changed. The public site could not be reached from this network, so everything here comes from the theme source and the store data. I could not see the rendered page, and the mobile layout was not checked visually.

**Live theme:** `nora-v5-mobile-menu` (custom Prestige fork, `gid://shopify/OnlineStoreTheme/167135674420`, last edited 2026-10-07). There are also 9 unpublished or demo themes.

---

## 0. The numbers behind this audit

| Metric | Value | Source |
|---|---|---|
| Active products | 1,819 (2,070 in total) | productsCount |
| Net sales, last 365 days | **$2,600.83** across about 12 product orders | ShopifyQL `sales` |
| Sessions, last 90 days | 9,597 | ShopifyQL `sessions` |
| Sessions with add to cart | 479 (5.0%) | |
| Sessions that reached checkout | 414 | |
| Sessions that completed checkout | **14 (0.15%)** | |
| Mobile: sessions / add to cart / completed | 3,691 / 62 (1.7%) / 8 | |
| Desktop: sessions / reached checkout / completed | 5,807 / 392 / 5 | |

The desktop row (392 checkouts reached, 5 completed) is almost certainly the owner testing during the September theme work: September alone shows 366 checkouts reached and 4 completed. **Exclude internal traffic before you trust any funnel number.** The cleanest real signal is mobile: 1.7% of sessions add to cart. That is a trust and offer problem, not a button problem.

Actual top sellers over 12 months: Cloud Pendant Light ($994.50, 1 order), Motion Sensor LED Stair Light ($818.90, 2 orders), Adjustable Vanity Picture Light ($284.99, 1 order), Full Moon Wall Lamp ($166.50, 1 order), Outdoor LED Rope Tube String Lights ($142.97, 3 orders). Nothing else sold above $100.

---

## 1. What a shopper sees

### Header (sections/header-group.json + snippets/nf-topbar.liquid)
- A utility top bar (help links, Membership, Best Sellers, Ideas & Guides and Professionals dropdowns). The code says: *"Phone links are never shown (the store is email only)."*
- **15 top-level mega-menu items**, in this order: Autumn at Home, Sale, Grand Collection, Ceiling Lights, Wall Lights, Table & Floor Lamps, Ambient Lighting, Outdoor Lighting, Decor, Soft Furnishings, Home Fragrance, Shelves & Storage, Poufs & Floor Seating, Ideas & Guides, Professionals.
- A mobile row of collection pills (`nf-cpills`).

### Homepage (templates/index.json, enabled sections in order)
1. **Countdown bar** (`nf-fallbar`): sale name from a shop metafield, *"Up to 30% off Autumn at Home"*, a days/hours/minutes/seconds clock, and the button *"Shop Autumn at Home"*. Shop metafields: the Fall sale ran 09-22 to **10-07 23:59**, and *"The Halloween Sale"* runs **10-08 to 10-31**. The clock rolls straight from one sale into the next.
2. Mobile collection pills.
3. **Hero:** eyebrow *"The First Days of Fall Sale"* (hard-coded and stale as of today), H1 *"Shorter Days, Warmer Rooms"*, button *"Shop the Sale"*. The button links to **/collections/best-sellers**, not to a sale collection.
4. *"Shop by category / Pieces Made for Every Home / Carry the season's warmth into every room, before it slips away."* There are 7 tabs: Best Sellers, Ceiling Lights, Outdoor Lighting, Decor, Soft Furnishings, Home Fragrance, Poufs & Floor Cushions.
5. **"Seasonal edit / Autumn at Home"**, with tabs for Fall Decor, Halloween Decor, **Halloween Inflatables**, Throws and Pillows, Candles and Fragrance, and sale badges with struck-through compare-at prices.
6. Two large cards: *"Ceiling lights that finish the room"* and *"Wall Lights That Set the Mood"*.
7. *"Rooms That Glow / The Indoor Collection"* mosaic, then *"Evenings Out Front / The Outdoor Collection"* mosaic.
8. Day-to-night slider: *"Watch the kitchen come alive. Drag across the room to switch every light on, then tap a glowing light to shop it."* This is good.
9. *"New Arrivals / New Outdoor Lighting"* (in October), with "NEW" badges.
10. **Social proof section:** *"Customer photos / Loved in real homes / Real rooms, real light. Every photo below was taken by someone who bought the piece."* It has 12 hard-coded five-star cards, each labelled **"Verified Buyer"**. Examples: *"I simply adore these pillowcases!"* (on a cushion cover); *"I was very anxious but it exceeded my expectations."*
11. *"Shop by room / Room by room"*, then a video zone, *"New Catalog 2026"*, and *"From Our Blogs"*.
12. **Trust icons, at the very bottom:** *"Free shipping across the USA / No minimum, tracked to your door"*, *"30 day returns"*, *"Real replies by email / Answered within 1 to 2 business days"*, *"Secure checkout"*.

There is no separate announcement bar. The countdown bar does that job.

### Overlays (sections/overlay-group.json)
These can stack on a first visit:
- a newsletter popup (10% off);
- `nf-offer-popup`: *"Drop your email and we'll send you a one time 10% code for this piece."*;
- a cookie banner;
- the countdown bar.

The cart drawer has `allow_discount_application: false`.

### Footer (sections/footer-group.json)
- Newsletter: *"Sign up to our newsletter and receive 10% off your first order."*
- Contact block: *"Store Name: Nora Furnish / Store Email: info@norafurnish.com / Customer Service Hours: Monday to Friday, 9:00 AM to 5:00 PM (CST)."*
- No address and no phone. **Payment icons are off** (`show_payment_icons: false`).

### Product page (templates/product.default-product-v2.json, used by all 5 sampled products)
- Order of blocks: title, price, variants, then a green **"In stock"** line (`nf-pdp-stock`).
- Assurance row: *"Free & tracked shipping / On every US order"*, *"Secure checkout / Encrypted on Shopify"*, *"Easy returns / 30 days from delivery"*.
- Add to cart with the dynamic checkout button, then Bundle & Save tiers (2 items 10%, 3 items 15%) and a wishlist button.
- Accordions: Key Features, Dimensions, Materials & Care, What's Included, Shipping & Returns, FAQ, Share.
- Below that: *"Why you'll love it"*, a custom reviews section (`nf-reviews`), a hidden Judge.me widget, "You may also like", spaces, standard, shop-by, catalog and article sections.
- The Shipping & Returns accordion reads: *"Email us within **7 days** of delivery with a photo..."*.
- The base `templates/product.json` has no reviews section and `show_payment_button: false`, but no sampled product uses it.

### Theme settings (config/settings_data.json, key items)
- `show_product_rating: true`; `cart_free_shipping_threshold: 0`.
- App embeds: **Microsoft Clarity** and **Judge.me core**.
- Membership: selling plan `6223593524`, join code `MEMBERWELCOME`.
- Social links: Facebook `profile.php?id=61578464993386`, Instagram `@norafurnishllc`, TikTok `@norafurnish`.

### Third-party scripts in layout/theme.liquid (87 KB, 35 `<script>` tags)
- `pixel.wetracked.io/{shop}/events.js`, loaded async.
- Google Ads gtag with **two** conversion IDs, `AW-18133462360` and `AW-18130838733`. The library is deferred until the first interaction, idle time, or 12 seconds.
- The Meta Pixel was removed (*"no Meta or Facebook ads, Google Ads only"*); `fbq` is kept as a no-op.
- A Pinterest domain-verify meta tag.
- Google Fonts: Fraunces, Lora and Inter.
- First-party bundles: `custom-nav.js` (168 KB), `custom-nav.css` (210 KB), `theme.js` (221 KB), `theme.css` (216 KB), plus about 20 `nf-*` scripts.
- Clarity and Judge.me are injected through app embeds.
- The theme `assets/` folder holds **about 150 `_bak_*` backup files** (index.json copies, old theme.liquid and so on).

---

## 2. Pages, policies and claims

| Page | Copy that matters | Problem? |
|---|---|---|
| **About Us** (template `page.about-us`) | *"Nora Furnish is an online lighting and home decor store."* / *"Orders take 1 to 2 business days to prepare and **5 to 7 in transit**, so most arrive within 10 to 12 business days."* / Review strip *"What people say about the pieces we carry ... quoted exactly as they were written"*, with a summary of **"out of 5 from 1,368 reviews"** | The transit time contradicts the policy (9 to 10 days), and 2 + 7 is not 12. The review count comes from a hand-set metafield (`custom.nf_reviews_count = 1368`) that overrides Judge.me's real total of **838**. |
| **Our Story** (body and hub template) | *"Nora Furnish started with a simple belief. A home should feel like the people who live in it."* / *"Design concepts are spaces imagined and lit by our team... They are not client projects."* | Honest. No founder, no years in business, no workshop claim. It is also anonymous, which is a missed trust lever. |
| **FAQ** (body) | *"Nora Furnish is a U.S.-based online retailer"* / *"**We do not offer a separate manufacturer warranty.**"* | Contradicts the FAQ v2 template. |
| **FAQ** (template `faq-v2`) | *"Do your products come with a warranty? **Yes. Every item ... comes with a 30 day warranty.**"* / *"Many of our lights come in two voltage options ... choose the 100V to 120V option whenever a listing asks."* / *"We accept the payment methods shown below."* | Contradicts the FAQ body on warranty. The voltage answer admits 220V stock sold to US shoppers. Footer payment icons are off. |
| **Professionals** | *"Designers, contractors, hotels, restaurants, offices, shops and homeowners with big plans **all come to us**..."* / *"These are design concepts created by our team, not client projects."* / *"Nothing is made until you approve"* | Mostly honest, with good disclosures. "All come to us" implies a client base that the sales data (about 12 orders) does not support. No UL/ETL information anywhere, which contractors need. |
| **Contact** | Email and hours only. Form via `nf-hc-form`. | No phone, no address, no chat. |
| **Contact policy** (/policies/contact-information) | *"Store Address: 8300 NW 206th St., Edmond, Oklahoma, USA"* | The only place the address appears. It is not on the Contact page, footer or About page. |
| **Shipping policy** | In stock: *"roughly 10 to 12 business days."* Made to order: *"Production: 3 to 4 weeks ... Transit: 9 to 10 business days after it leaves **the workshop**. Total: up to 30 business days (about 6 weeks)."* / *"these pieces are **assembled by hand in small batches**, finished, wired, tested and crated"* / *"items that ship from different locations"* / freight is *"curbside"* | This is a workshop and handmade claim made as if it were Nora's own. Nora has no workshop; the supplier does. It never says where orders ship from (overseas), although a 9 to 10 business day transit and dual-voltage stock make that obvious to a careful buyer. |
| **Refund policy** | 30 days from delivery; change-of-mind return shipping is the customer's; *"Drop off your parcel at the nearest shipping carrier location"* | No return address and no return-cost estimate. For a $1,300 crated chandelier going back to an overseas workshop, this is a hidden cost the buyer will ask about. |
| **Membership** (`/pages/membership`, product "Nora Members, 6 Month Membership" **$250**) | *"Skip the $2,000+ designer fee"*, *"3D renders of your room"*, *"A design studio in your inbox"*, *"Exclusive pieces and bundles"* | A $250 paid design membership on a store with about 12 orders and no customer reviews. It reads as overreach and reinforces "too good to be true". |

**Mixed shipping promises a shopper can find:**
- 10 to 12 business days (FAQ, policy, `nf-pdp-trust`);
- 5 to 7 days in transit (About);
- *"Most orders arrive in about two weeks"* (Blue and White Ceramic Pendant description);
- a code comment in `nf-pdp-assure` says *"6 to 9 business days"*;
- up to 6 weeks for made to order;
- damage claims within 7 days (PDP accordion) versus 30 days (FAQ and policy).

---

## 3. Five product pages

| | Motion Sensor LED Stair Light | Cloud Pendant Light | Cascading Ring Staircase Chandelier | Bauhaus Glass Flower Wall Lamp | Blue and White Glazed Ceramic Pendant |
|---|---|---|---|---|---|
| Price | $175.99 to $1,231.99 (180 variants) | $146.99+ (35 variants) | **$1,337.99** to $4,447.99 (7) | $563.99 (3) | $311.99 (2) |
| Compare-at | none | ~19% above every variant | **$1,672.99** to $5,560.99 (a flat 25% above) | none | none (was $333.99 until 9/27) |
| Price history (metafields) | n/a | n/a | **$514.99 (pre 9/20) → $607.99 (9/21) → $1,215.99 → $1,337.99 (9/27)**, compare-at added, tagged `clearance` while also `made-to-order` | $511.99 → $563.99 (*"MTO +15% then lighting +10%"*) | $201.99 → ×1.4 "fragile" $282.99 (compare-at $333.99) → $311.99 |
| Source tags | `needs-info`, `pmax-launch` | `best-seller` + **`dazuma-best-seller`**, `clearance` + `made-to-order`, Dazuma SKUs `DZ51EGV0B` | `clearance`, `made-to-order` | **`baskoraa-2026-09`** | **`aliexpress-2026-09`**, SKU embeds AliExpress item ID |
| Images / alt | 15 images. Alt texts are `oa_hero_8866942156852` and then blanks. | 19 images, good descriptive alts | 21 images, good alts | 8 images, every alt is the title repeated | 8 images, every alt is the title repeated |
| Copy quality | Generic and self-undermining: *"the finish looks more expensive than it is"*, *"sips power"*. Q&A: *"We do not have the exact time out length in our specs."* | Filler that makes no sense for an indoor pendant: *"It is wired in rather than solar, so the output holds up through winter and on overcast days."* Typo *"2700K 3999K"*. The SEO description repeats its first sentence twice. | Strong: drop lengths, install guidance, care, FAQ, a 1,000-word article | Decent: dimensions, *"1 E14 LED bulb"*, *"AC 90V to 260V"*, *"Handcrafted glass"* | Thin: a 226-character description, *"handmade character"* in the SEO text |
| Lumens / watts / CRI / CCT | partial (CCT only) | CCT (typo); no lumens, watts or CRI | **none** on a $1,337 fixture | none (bulb not stated as included; E14 base is uncommon in the US) | none |
| UL / ETL listing | none | none | none | none (a universal 90 to 260V driver suggests a non-US listing) | none |
| Warranty shown | 30-day returns only | same | same | same | same |
| Reviews | 1 imported, 5.0, reviewer "D***a", `verified_buyer: false`, dated **2026-02-04** | 0 | 1 imported, 5.0, reviewer name **"Verified Buyer"**, dated 2026-06-30, **two months before the product was created (2026-09-04)** | 0 | 0 |
| In Best Sellers collection? | **No** (it is the #2 real seller) | Yes | No | No | No |

**Verdict on the sample:**
- Only the Cascading Ring page reads like a $1,000+ product. Even it has no output, CRI or certification data.
- The compare-at prices are anchors that were built after the fact, not prices the items ever sold at. Three of the five products had their base price raised 26% to 160% within the last three weeks.

---

## 4. Review app and trust evidence

- **Judge.me** is installed (app embed plus a PDP app block). The theme draws its own reviews UI (`sections/nf-reviews.liquid`) from `judgeme.review_widget_data`.
- Judge.me shop totals: **838 reviews, 4.69 average, `verified_reviews_count: 0`**, `trust_badge.is_certified: false`.
- Every review checked carries `"transparency_badges":["review_collected_from_another_provider"]` and `"verified_buyer": false`. Many have **`reviewer_name: "Verified Buyer"`**.
- Theme comments confirm the source: *"Photos are re-hosted on our own CDN as Files named nf-review-zone-NN (**AliExpress URLs render blank** on the storefront)"* and *"source import (REVIEWS_REBUILD_v3.csv)"*.
- The custom `nf-reviews` section **does not render the transparency badge**. Judge.me's own widget (which shows it) is "hidden until it is needed".
- `nf-about-reviews.liquid` and `nf-guides-page-reviews.liquid` print a **"Verified Buyer" badge whenever the name field is blank**.
- The homepage proof block hard-codes "Verified Buyer" on 12 cards. One of them is the Rattan Hot Air Balloon Wall Hanging, **which has no reviews at all in Judge.me**.
- Store replies imply a purchase from Nora: *"Thank you for trusting us with your ceiling light purchase."*
- Products with ratings: of the first 500 active products, roughly 380 (about 75%) carry `reviews.rating_count`, mostly 1 to 6 reviews each. One product has 19 reviews but 1 order and $0 net sales.
- The store has had about 12 product orders ever. **None of the 838 reviews can be from Nora customers.**
- Judge.me also writes `review_widget_json_ld` with `aggregateRating` into product structured data. That pushes imported ratings into Google results.

---

## 5. Payments and markets

- `paymentSettings.supportedDigitalWallets`: **APPLE_PAY, GOOGLE_PAY**. Shop Pay status is not exposed by this field.
- Currency USD. Ships to the US only. Plan: Basic.
- The dynamic checkout button is enabled on the PDP template in use.
- Footer payment icons are off, while the FAQ says *"payment methods shown below"*.

---

## 6. Blog: 31 articles (blog `blog`, every author "Nora Furnish Editorial Team")

| # | Published | Title |
|---|---|---|
| 1 | 2026-09-27 | Nora Members Guide: How the Membership Works and When It Pays for Itself |
| 2 | 2026-09-19 | How to Clean a Crystal Chandelier Safely |
| 3 | 2026-09-16 | How to Light a Front Porch So It Feels Welcoming and Safe |
| 4 | 2026-09-13 | Staircase Lighting Ideas for Safety and Style |
| 5 | 2026-09-09 | Bedroom Lighting Ideas for Calm, Comfortable Evenings |
| 6 | 2026-09-06 | Why Do LED Lights Flicker? Common Causes and Fixes |
| 7 | 2026-09-03 | Warm White vs Cool White: Color Temperature Explained |
| 8 | 2026-08-31 | Bathroom Vanity Lighting: Placement, Brightness and Color |
| 9 | 2026-08-28 | Motion Sensor Outdoor Lights: Placement, Settings and Fixes |
| 10 | 2026-08-23 | How to Choose the Right Chandelier Size for Any Room |
| 11 | 2026-08-22 | Lumens, Watts and Brightness Explained |
| 12 | 2026-08-16 | Plug In Wall Sconces: An Easy Way to Add Light Without Wiring |
| 13 | 2026-08-15 | Table Lamp Size Guide for Nightstands and Side Tables |
| 14 | 2026-08-10 | Are LED Lights Dimmable? Dimmers, Compatibility and Buzzing |
| 15 | 2026-08-07 | Flush Mount vs Semi Flush Mount Ceiling Lights: Which Fits Your Room |
| 16 | 2026-08-04 | How to Choose a Floor Lamp for Reading |
| 17 | 2026-08-02 | Wall Sconce Height and Spacing Guide for Every Room |
| 18 | 2026-07-29 | Kitchen Island Pendant Lights: Size, Spacing and Height |
| 19 | 2026-07-25 | How to Layer Lighting in a Living Room |
| 20 | 2026-07-21 | How to Replace a Ceiling Light Fixture |
| 21 | 2026-07-20 | How to Light Artwork at Home With Picture Lights |
| 22 | 2026-07-14 | LED Strip Lights: Where to Use Them and How to Install Them |
| 23 | 2026-07-11 | Home Office Lighting That Is Easy on Your Eyes |
| 24 | 2026-07-09 | How High to Hang a Chandelier Over a Dining Table |
| 25 | 2026-07-05 | How to Choose a Ceiling Fan With a Light |
| 26 | 2026-07-02 | Night Lights for Hallways, Bathrooms and Kids' Rooms |
| 27 | 2026-06-29 | How to Clean and Care for Outdoor Light Fixtures |
| 28 | 2026-06-26 | How to Hang Patio String Lights Without Damaging Your Walls |
| 29 | 2026-06-22 | Solar Outdoor Lights: What to Expect and How to Choose |
| 30 | 2026-06-19 | How Far Apart Should Path Lights Be? A Spacing Guide |
| 31 | 2026-06-17 | What Does IP65 Mean? Outdoor Light Ratings Explained |

The topics are solid and buyer-intent focused. The weakness is the faceless byline. A named author with lighting credentials would lift both trust and SEO (E-E-A-T, Google's experience, expertise, authoritativeness and trust signals).

---

## 7. Top 15 issues, ranked by revenue impact

### 1. Imported AliExpress reviews are presented as Nora customers' "Verified Buyer" reviews
**Evidence:**
- Homepage: *"Every photo below was taken by someone who bought the piece"*, with 12 hard-coded "Verified Buyer" cards.
- Judge.me: 838 reviews, **0 verified**, every review flagged `review_collected_from_another_provider`. Reviewer names are literally "Verified Buyer".
- The custom widget drops Judge.me's transparency badge.
- The About page claims **1,368** reviews from a hand-set metafield (Judge.me's real total is 838).
- Reviews are dated before their products existed (Cascading Ring review 2026-06-30, product created 2026-09-04).
- One featured product has no reviews at all.
- Total lifetime product orders: about 12.

**Why it costs money:**
- The FTC Consumer Reviews and Testimonials Rule (16 CFR Part 465, in force since Oct 2024) allows civil penalties per violation for reviews that misrepresent the reviewer's experience with the business.
- Google Merchant Center "misrepresentation" suspensions hit stores like this, and Google Ads (the store's only paid channel) stops when Merchant Center is suspended.
- Savvy buyers recognise AliExpress phrasing (*"I simply adore these pillowcases!"* on a cushion cover) and leave.

**Fix (this week):**
- Delete the homepage `custom_liquid_nfproof` block, the About and Guides quote walls, and the `custom.nf_reviews_count` / `nf_reviews_rating` overrides.
- Remove every "Verified Buyer" fallback label.
- Either delete the imported reviews or render them only with Judge.me's own *"Collected from another provider"* badge, under a heading like *"Reviews of this design from other retailers"*.
- Remove `aggregateRating` for imported reviews from the JSON-LD.
- Turn on Judge.me post-purchase review requests, with a photo-review incentive, so real reviews start accumulating.

### 2. Fake reference prices and a sale that never ends
**Evidence:**
- Cascading Ring: base price **$514.99 → $1,337.99 in about 3 weeks**. A *"was $1,672.99"* compare-at was attached, and the made-to-order product is tagged `clearance`.
- Blue and White Pendant: $201.99 → $311.99 in a week.
- 165 active products show a reduced price; 67 are tagged clearance (18 of those are made to order, so they cannot be clearance stock).
- The "Sale" collection resolves to 492 products.
- The Fall sale countdown ended 10-07 and rolls straight into *"The Halloween Sale"* 10-08 to 10-31.
- The hero still says *"The First Days of Fall Sale"*, and its *"Shop the Sale"* button goes to Best Sellers.

**Why it costs money:** This breaks the FTC Guides Against Deceptive Pricing (16 CFR 233.1, a former price must be one actually offered in good faith for a reasonable period). Google Shopping's sale-price rules break the same way. Repeat visitors see the "sale" never ends, and the discount stops meaning anything.

**Fix:**
- Clear every compare-at price that was not the real selling price for 30 or more days.
- Remove `clearance` from made-to-order items.
- Kill the rolling countdown; run at most one honestly-dated promotion a quarter.
- Update the hero today.
- Set prices once at a defensible margin rather than marking up and then "discounting".

### 3. An anonymous email-only store selling $300 to $4,000 fixtures
**Evidence:**
- *"Phone links are never shown (the store is email only)."* Replies take 1 to 2 business days.
- The address (8300 NW 206th St., Edmond, OK) appears only in /policies/contact-information. It is not on the Contact page, footer or About page.
- No founder name, no face, no legal entity name on the site (Instagram handle `@norafurnishllc`).
- The Facebook link is a bare `profile.php?id=` URL.

**Why it costs money:** Above roughly $300, shoppers want to know who they are paying and how to reach a human before checkout. This is likely the biggest driver of the 1.7% mobile add-to-cart rate.

**Fix:**
- Add Shopify Inbox (free live chat) or a Google Voice number for calls and texts, staffed during the posted hours.
- Put the legal entity and mailing address in the footer and on the Contact page.
- Add a founder note with a name and photo to About ("Who's behind Nora Furnish").
- Use a proper Facebook Page URL.

### 4. No electrical safety listing and missing light specs on hardwired fixtures
**Evidence:**
- None of the 5 sampled products states UL, ETL or cULus.
- Bauhaus lamp: *"Power: hardwired, AC 90V to 260V"* and *"1 E14 LED bulb"*. E14 is a European base; the US standard is E12 or E26.
- FAQ: *"Many of our lights come in two voltage options... choose the 100V to 120V option"*.
- The $1,337 Cascading Ring lists **no lumens, watts, CRI or colour temperature**.
- Cloud Pendant shows *"2700K 3999K"*.

**Why it costs money:** The Professionals page pitches *"Designers, contractors, hotels, restaurants..."*. Those buyers cannot install unlisted fixtures under the NEC (US electrical code) or commercial inspection. Homeowners with an electrician will be told the same thing. A 220V variant shipped by mistake becomes a return or a fire risk.

**Fix:**
- Get certification status from each supplier.
- Add a standard spec table metafield: certification, input voltage, wattage, lumens, CRI, CCT, dimmable (and dimmer type), bulb base, bulb included yes/no, IP rating, weight, warranty.
- Hide or delist hardwired SKUs that have no US listing, and remove 220V variants.
- Lead the trade pages with "ETL-listed options available" only where that is true.

### 5. Warranty: contradictory, and too short for integrated-LED lighting
**Evidence:**
- FAQ body: *"We do not offer a separate manufacturer warranty."*
- FAQ v2: *"Yes. Every item ... comes with a 30 day warranty."*
- The Cascading Ring's *"LEDs are built in, so there are no bulbs to fit or replace"*. If the LEDs fail on day 31, the $1,337 fixture is scrap.

**Fix:** Publish one clear statement: a 1-year (ideally 2-year) replacement warranty on lighting, with driver and LED coverage spelled out. Price it in as roughly 2 to 3% of revenue. Show it in the PDP assurance row, where it should replace the vaguer *"Secure checkout / Encrypted on Shopify"* item.

### 6. Delivery promises contradict each other, and made-to-order items say "In stock"
**Evidence:**
- About gives 5 to 7 days in transit; the FAQ and policy give 9 to 10.
- The Blue and White Pendant says *"about two weeks"*.
- Damage claims: 7 days (PDP) versus 30 days (FAQ and policy).
- Every product shows a green **"In stock"** line, including 337 `made-to-order` items with 3 to 4 weeks of production.

**Why it costs money:** The FTC Mail Order Rule requires a reasonable basis for shipping claims. Six weeks of silence after an "In stock" purchase produces chargebacks and the 1-star reviews that will (finally) be real.

**Fix:**
- Build one shipping snippet that every page reads from.
- Replace "In stock" with a computed delivery window ("Arrives Oct 22 to 28"; "Made to order: ships in 3 to 4 weeks, arrives about Nov 25").
- Fix the About copy.
- Settle on one damage-claim window.

### 7. "Best Sellers" are a competitor's best sellers
**Evidence:**
- 50 of the 74 products in the Best Sellers collection are tagged `dazuma-best-seller`.
- The collection copy says *"Discover our best selling favorites that customers love and come back for."*
- The product page ends with *"Best Sellers for a Reason"*.
- The store has about 12 product orders in total, and the actual #2 seller (Motion Sensor LED Stair Light) is not in the collection.

**Fix:** Rename the collection to "Most-Loved Designs" or "Editor's Picks", drop "customers love and come back for", and switch the collection to real order data once you have it. This is a false claim today, and a cheap one to fix.

### 8. The catalogue is lifted from competitors, down to URLs and SKUs
**Evidence:**
- Tags `dazuma-best-seller` (74), `dazuma-chand-2026-09` (70), `dazuma-outdoor-2026-09` (60), `baskoraa-2026-09` (73), `aliexpress-2026-09` (72).
- Handles like `lighting-ceiling-lights-pendant-lighting_51egv` and SKUs like `DZ51EGV0B` and `HA143547-01B`.

**Why it costs money:**
- Anyone who reverse-image-searches a $563.99 lamp finds the same photo on Dazuma, Baskoraa or AliExpress, often cheaper. That ends the sale.
- Copied photography invites DMCA takedowns and Merchant Center duplicate or misrepresentation flags.

**Fix:**
- Shoot or render your own images for the 20 to 30 SKUs you advertise.
- Rename the handles (with redirects).
- Strip supplier SKUs from anything customer-facing.
- Check the price of every advertised SKU against its source, and do not sit far above the identical listing.

### 9. A lighting brand diluted by Halloween inflatables and plastic shoe boxes
**Evidence:**
- 15 top-level mega-menu items, a top bar and pills.
- 17 enabled homepage sections, with the trust strip last.
- Homepage tabs include *"Halloween Inflatables"*.
- The catalogue includes items like *"12 Pack Stackable Plastic Shoe Storage Boxes"*, incense burners and poufs, sold next to $1,000+ chandeliers.
- 1,819 active SKUs.
- The About page says *"Lighting first"*.

**Fix:**
- Cut the main navigation to 6 items: Ceiling, Wall, Lamps, Outdoor, Sale, Trade. Fold decor into one "Home" menu.
- Remove seasonal novelty from the lighting homepage.
- Unpublish sub-$30 non-lighting SKUs.
- Move the trust strip directly under the hero.
- Aim for no more than 8 homepage sections.

### 10. Best-seller product pages have thin, generic or broken copy
**Evidence:**
- Stair Light: *"the finish looks more expensive than it is"*, *"sips power"*, Q&A *"We do not have the exact time out length in our specs"*, internal tag `needs-info`, 180 variants with AliExpress property-ID SKUs (`136:200002572;...`), and alt text `oa_hero_8866942156852`.
- Cloud Pendant: *"wired in rather than solar, so the output holds up through winter"*, an SEO description that repeats its first sentence, and the SEO title *"White Cloud a, White Cloud B, Cloud and more"*.
- Two of the five sampled products use the title as the alt text on every image.

**Fix:**
- Rewrite the copy on the 10 products that get paid traffic first: specs, use case, install, what is in the box, and a real answer to every Q&A.
- Get the sensor time-out from the supplier.
- Collapse the 180-variant matrix into kit size × colour temperature with clean SKUs.
- Write descriptive alt text.
- Drop the "Nora Furnish" prefix from SEO titles.

### 11. Too many discounts and popups
**Evidence:** The newsletter popup (10%), the per-product offer popup (*"one time 10% code for this piece"*), Bundle & Save (10% for 2, 15% for 3), member pricing, a 15 to 30% sale, the countdown bar and the cookie banner can all hit one first visit.

**Why it costs money:** On a premium price point, constant discounting tells the shopper the list price is fake (see #2), and stacked overlays hurt mobile usability.

**Fix:** Keep one welcome offer, delay it to exit-intent or 30+ seconds on mobile, and delete `nf-offer-popup`. Keep Bundle & Save only where buying in multiples makes sense (pendants, sconces, path lights).

### 12. A $250 design membership before any proof
**Evidence:** *"Skip the $2,000+ designer fee"*, *"3D renders of your room"*, *"A design studio in your inbox"*, a Membership link in the top bar on every page, and member reviews switched off (correctly) because none exist.

**Why it costs money:** It is an unfulfillable-looking promise on a store with no track record, and it distracts from the core sale.

**Fix:** Pull Membership from the navigation. Offer a free "Send us your room photo, we'll suggest 3 fixtures" email service instead; it builds trust and captures leads. Relaunch the membership after 100 real orders.

### 13. Payment and trust signals are missing where decisions happen
**Evidence:**
- Footer payment icons are off.
- The FAQ references *"payment methods shown below"*.
- The homepage trust row sits below the blog.
- The PDP assurance row offers *"Secure checkout / Encrypted on Shopify"* instead of things buyers weigh (warranty, delivery date, returns cost).
- The cart drawer has discount entry disabled while two popups email out codes.

**Fix:**
- Turn the footer payment icons on.
- Show Apple Pay, Google Pay, Shop Pay and PayPal (if enabled) under Add to Cart.
- Change the PDP row to: delivery date, warranty, 30-day returns, and "Questions? Chat with us".
- Enable the discount field in the cart, or apply the welcome code automatically by link.

### 14. Theme weight and tech debt
**Evidence:**
- `layout/theme.liquid` is 87 KB with 35 script tags.
- `custom-nav.css` is 210 KB and `custom-nav.js` 168 KB, on top of `theme.css` (216 KB) and `theme.js` (221 KB).
- `index.json` is 132 KB, with Liquid loops over 8 collections (twice) and up to 40 products ×4 for image picking.
- About 150 `_bak_*` files sit in theme assets, plus 9 spare themes.
- Google Ads gtag is deferred up to 12 seconds, so early add-to-cart events from bounced mobile sessions can be lost to Smart Bidding (Google Ads' automated bidding).

**Fix:**
- Move backups to git.
- Split and purge unused CSS (custom-nav plus theme together is about 430 KB of CSS).
- Replace the homepage image-picking loops with fixed images.
- Test Core Web Vitals on mobile.
- Fire the AddToCart conversion through Shopify Customer Events instead of the delayed gtag.

### 15. Craft and origin claims a dropship store cannot back up
**Evidence:**
- Shipping policy: *"assembled by hand in small batches... after it leaves the workshop"*.
- Bauhaus lamp: *"Handcrafted glass"*.
- Ceramic pendant SEO: *"handmade character"*.
- FAQ: *"U.S.-based online retailer"*, with no ship-from disclosure while transit is 9 to 10 business days.
- Professionals: *"...all come to us"*.

**Fix:**
- Use *"our manufacturing partners build each made-to-order piece"*.
- State plainly *"Most pieces ship directly from our partner factories overseas; transit is 9 to 10 business days"*. Honesty about origin converts better than buyers discovering it from a tracking number.
- Drop "all come to us".

---

## 8. What is genuinely good

- **Honest concept disclosures.** Professionals, Portfolio and Our Story all say *"These are design concepts created by our team, not client projects."* Most dropship stores fake this; Nora does not.
- **No invented founder myth.** There is no fake "family workshop since 1987", years in business or invented team. The pages are anonymous, but not fabricated.
- **PDP information architecture is better than most in the category.** It has per-variant dimension metafields with a drawn dimension chart, "What's Included", care, install guidance ("Have an electrician do the installation"), measure-before-ordering prompts, a per-product FAQ, and long-form articles. The Cascading Ring page is close to excellent apart from specs and certification.
- **Clear, detailed shipping policy.** It covers in-stock versus made-to-order timelines, a 24-hour change window, curbside freight, partial shipments, cutoff times and carriers. Fix the contradictions elsewhere and it becomes a trust asset.
- **Simple, real offer basics.** Free US shipping with no minimum, 30-day returns, and damage covered at no cost.
- **The day-to-night kitchen slider and "Room by room" band** are distinctive, shoppable and on-brand for lighting.
- **The blog.** 31 practical, buyer-intent guides (sizing, spacing, CCT, lumens, IP ratings) in 4 months, linked from room tiles and product pages. This is the store's best long-term organic asset.
- **The empty-reviews state is honest.** The custom reviews section shows *"No reviews yet. Be the first..."* rather than fake stars when a product has none.
- **Performance awareness.** The hero image is preloaded, unused font preloads were removed and tag libraries are deferred. Someone is watching speed; it just needs a cleanup pass.
- **Apple Pay, Google Pay and dynamic checkout** are on.

---

### Fix order in one line
Remove the fake reviews and fake anchors (#1 and #2) this week, because they are the legal and Merchant Center risk. Next, add a human contact, address, warranty and delivery dates (#3, #5, #6). Then fix specs and certification and own the photography for the products you advertise (#4, #8). After that, trim the store back to a lighting brand (#9).
