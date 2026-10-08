# HANDOFF: Nora Furnish store audit (paste this whole file into the new chat)

**Written:** 2026-10-08, when the cloud session was stopped at the owner's request (it was running on cloud usage; the owner wants to continue locally).
**Repo:** `joehaller00-dev/myfirstapp`, branch **`claude/gallant-volta-duv7ha`**. Everything is in `founder/`. Run `git fetch origin claude/gallant-volta-duv7ha && git checkout claude/gallant-volta-duv7ha` locally.
**Skills:** the founder pack (github.com/Jakeschincariol/founder-skill) is vendored in `.claude/skills/founder-*`. Your account also lists them as `anthropic-skills:founder-*`.

---

## 1. What the owner asked for, and how they want to work

- **Request:** run the founder pack (board → competitors → consumer → pricing → offer → cfo → marketing → brand → ops → launch → plan) on their live Shopify store **Nora Furnish (norafurnish.com)**: high-ticket home decor, mainly lighting, sold online. Goal: "find all the kinks and mishaps... what could be visually better and what could be better back-end wise."
- **Mid-session correction from the owner:** the prompt came from Instagram, so **don't follow it to the letter where it doesn't fit an existing store**. They already have norafurnish.com, so no domain or naming work. They want practical help.
- **Preferences:** be direct, don't default to agreement, challenge ideas; give answers, not explanations of every detail; try several things before presenting; work through multi-step tasks without stopping; only stop for a genuine decision; "if I tell you to do something just do it"; no attitude.
- **Not done yet:** nothing in the live store has been changed. Every Shopify call so far was read-only. Live-store changes still need the owner's go-ahead (see §6).

## 2. The store in numbers (Shopify Admin data, 2026-10-08)

- Shopify **Basic** plan, USD, ships to the US only. Theme `nora-v5-mobile-menu` (custom Prestige fork, id `gid://shopify/OnlineStoreTheme/167135674420`) plus 9 spare themes. Owner address on the policy page: Edmond, Oklahoma. Email-only support today (Shopify Inbox chat block is enabled in the theme).
- **Catalog:** 1,819 active and 248 draft products, 185 collections, ~100 messy product types. Every active product shows 0 inventory with "continue selling" (dropship). Price bands: <$100: 595 | $100-300: 854 | $300-600: 596 | $600-1k: 398 | $1k+: 391.
- **Sales:** 14 real orders ever (the rest are $0 owner tests); 4 refunded; **kept net revenue $2,600.83** (Aug-Oct 2026). 28 customer records.
- **Traffic:** ~14k sessions since Feb 2026; 9,597 in the last 90 days. Real purchase conversion **~0.15%**. Mobile add-to-cart 1.7%. Google organic is the only channel that converts (1,889 sessions, 7 orders, 0.37%). The Sept 11-15 spike and Facebook/Sweden/Ireland "checkout" sessions look like bots or owner testing (only 4 abandoned checkouts carry contact details).
- **Shipping reality:** carriers YunExpress, SFC, WANB (China cross-border); 14-21 days order to door.

## 3. Key findings (most serious first)

1. **Fake reviews (legal risk):** all 838 Judge.me reviews are imported (AliExpress), 0 verified, shown as "Verified Buyer". The homepage says "every photo was taken by someone who bought the piece". The About page shows a hand-set "1,368 reviews". This conflicts with the FTC Consumer Reviews Rule (16 CFR 465) and risks a Google Merchant Center suspension.
2. **Fake "was" prices (legal risk):** in Sep/Oct, prices were raised 2.4-4.5x (bulk update 2026-10-07): night light $17.99 → $49.99 (cost $4.18); Nordic wood ceiling light $39.99 → $177.99; Cascading Ring chandelier $514.99 → $1,337.99 with a "was $1,672.99" and a clearance tag on a made-to-order item. Compare-at prices were never charged (FTC 16 CFR 233.1). The sale countdown never ends (Fall → Halloween). Evidence: `founder/data/price-history.md`.
3. **"Best Sellers" are another store's best sellers:** 50 of 74 items are tagged `dazuma-best-seller`. The catalog is lifted from Dazuma (~200 items), Baskoraa (73) and AliExpress (72), down to URLs and SKUs. Google Lens finds the same items for 2-18x less (Walmart $10 vs Nora $178 for the Nordic light; Amazon $68-90 vs $185 for the moon lamp).
4. **Unbacked claims:** "assembled by hand in small batches... the workshop", "Handcrafted", "U.S.-based retailer" with no ship-from disclosure. Two contradictory warranty answers ("no warranty" vs "30-day warranty"). Every product, including 337 made-to-order items, shows a green "In stock".
5. **Safety and specs:** no UL/ETL listing on any sampled product; E14 bulbs and 90-260V or 220V variants offered; no lumens, watts or CRI even on a $1,337 fixture.
6. **Anonymous store:** no phone, no name, address hidden in a policy page.
7. **Unfocused:** Halloween inflatables, shoe boxes, curtains and incense next to $1k chandeliers; 15 top-level menu items; 17 homepage sections with the trust strip last; 8 live discount mechanisms plus a $250 "membership".
8. **Visual (from theme files):** 5 font families (Roboto Serif Light with wide tracking, Montserrat, plus Fraunces, Lora and Inter loaded in the layout); 30px rounded cards; hover "second image" turned off; furniture swatch colours left over; ~150 `_bak_*` theme files; 430 KB of CSS; Google Ads gtag deferred up to 12 seconds.
9. **Trademark flag:** Nora Lighting Inc. owns NORA LIGHTING in Class 11 (Reg. 2939989 and 5939753). Get a clearance opinion before spending on the brand. The owner keeps the name; this is a legal check, not a rename push.
10. **Good, keep:** 31 strong buying-guide blog posts; the day-to-night kitchen slider; honest "design concepts, not client projects" disclosures; detailed product-page structure; Apple Pay and Google Pay.

## 4. Founder pack results so far

| Step | Status | File | Headline |
|---|---|---|---|
| board | ✅ | `board.md`, `board/*.md` | **3 PASS**, average 2.7/10 (Offers 3, Monopoly 2, Product 3). Strongest version: about 100-150 sampled, UL-listed statement lights, honest prices, free returns, dated delivery, plus a trade/STR channel |
| competitors | ✅ | `competitors.md`, `competitors.csv` | No gap for the store as it runs today (Homary sells the same genre cheaper with 7k+ reviews). A gap exists only for an "honest sculptural-lighting store": origin and lead time up front, prepaid returns, UL-listed, Lens-proof pricing |
| consumer | ✅ | `customer.json`, `pitch-v1.md`, `panel/results.md` | **0/100 buy** (trust 88, timing 8, price 4). Flip levers: free returns 94, real photo reviews 91, faster or firm delivery 51, UL and specs 30 |
| offer | ✅ | `offer.md`, `pitch.md` (v2), `panel-v2/` | Honest stack re-test: **0/20**. Objections moved to "no reviews", "cheaper on Amazon" and "too slow" |
| (extra) target-state test | ✅ | `pitch-v3-target.md`, `panel-v3/`, `data/pricing-curve-v3.md` | With 60 real reviews, US stock (3-5 days), $249, UL listed: **9/20 (45%, an upper bound)**. Price checkers and big-retailer loyalists still say no (generic, Lens-able product) |
| pricing | ✅ | `pricing.md`, `pricing-curve.md` | Acceptable range ~$120-$450. Rule: delist commodity Lens-able items; statement pieces $250-$450 at landed cost × 4-6; no compare-at. Hero: Cloud pendant 23.6" **$279** (was $359.99). Ladder: single / pair-trio 10% / room set / trade 15% |
| cfo | ✅ | `numbers.json`, `cfo.md` | $350 order: contribution **$29.25 after a $120 CAC** ($149 before CAC); break-even **0.42 orders/day**; year 1 +$941 operating, −$4,059 after a $5,000 startup spend; cash needed **$6,030**. Price −10% or costs +15% turns it negative. **CAC is the line to watch; conversion must reach ~1% before ads pay** |
| marketing | ✅ | `marketing.md` | Positioning: "the lighting shop that shows you everything up front". Channels: Google organic + free listings, Google Shopping on 20-30 hero SKUs ($30/day), local OKC trade outreach, Pinterest. No Meta ads yet. CAC ceiling $149, target ≤$100. Dated calendar Oct 12-Nov 11, 10 hooks |
| brand | ✅ | `brand.md` | No rename. Trademark flag; promise "Statement lighting, no surprises"; visual changes: Fraunces + Inter only, warm paper #FBF8F3 / ink #1F1B16 / bronze links #7A5F3A, 4-8px cards, lit secondary image, 8-section homepage, 6-item nav |
| ops | ⏳ **NOT WRITTEN** | `ops.md` (missing) | Research agent stopped before finishing. See §5 |
| launch | ✅ | `launch.md` | Relaunch **Mon Oct 26, 2026**. Test: 10 hero SKUs on Shopping, $25/day × 14 days. Success = 350+ clicks, 3+ orders, CAC ≤$117, mobile ATC ≥3%. Countdown, run sheet, day 7/14/30 reviews |
| plan | ⏳ **NOT RUN** | `summary.md`, `business-plan.md`, `one-pager.md` (missing) | Run compile.py after ops |
| store fix list | ✅ | `store-fixes.md` | 20 fixes in 3 phases (Week 1 legal, Week 2 trust/UX, Weeks 3-6 product/proof), each marked as doable via the Shopify API or by the owner |
| storefront audit | ✅ | `data/storefront-audit.md` | 15 ranked issues with evidence and fixes (the source for §3) |
| catalog economics export | ⏳ partial | `data/catalog.raw` (partial JSON lines) | Agent stopped mid-export; `catalog.csv` and `catalog-summary.md` were never written |

## 5. Exactly where to pick up (in order)

1. **Pull the branch** (above) and read `founder/store-fixes.md`, `founder/data/storefront-audit.md` and this file.
2. **Visual check (newly possible locally):** the cloud network blocked norafurnish.com, so nobody has looked at the rendered site. Open the homepage, one product page, cart and checkout on mobile and desktop, then confirm or adjust the visual items in `brand.md` §3 and `store-fixes.md`.
3. **Finish ops (`founder/ops.md`)** with the founder-ops skill. Research still needed: how to verify UL/ETL (UL Product iQ, Intertek directory) and where to source certified decorative lighting; US 3PLs for a 10-20 SKU stocked line (ShipBob, ShipMonk, Red Stag); a prepaid return label for a ~24×24×16 in, 10-20 lb box; Judge.me pricing and review requests; FTC 16 CFR 465 and 233.1 and the Mail Order Rule; Oklahoma sales tax permit (OkTAP), LLC/EIN, product liability insurance; **US de minimis ($800) status and tariffs on Chinese lighting (HTS 9405) in 2026**, which may change landed cost; a delivery-date app; Google Voice. Daily routine: orders → supplier PO → tracking → customer updates → returns → reviews. Add a risk register (supplier stock-out, damaged chandelier, Merchant Center suspension, chargeback, trademark letter, tariff change). Update `numbers.json` shipping and tariff lines if real figures differ, then re-run the CFO tool.
4. **Optional:** finish the catalog export (all active products with price, cost, compare-at, tags) to build the keep list of 150-300 lighting SKUs. Query: `products(first:50, after:$cursor, query:"status:active")` with `variants(first:1){price compareAtPrice inventoryItem{unitCost{amount}}}` and tags.
5. **Run founder-plan:** `python3 .claude/skills/founder-plan/compile.py --dir founder --check`, then without `--check`. Write `summary.md` and `one-pager.md`. The verdict will be **Not yet** (the panel buy rate is 0% against the 25% bar, and year 1 after startup is negative). Lead with what has to change.
6. **Ask the owner one question:** "Do you want me to start applying the Week 1 fixes in the live store now?" Recommended first: hide imported reviews and the fake review count, clear never-charged compare-at prices, rename Best Sellers, remove workshop/handmade claims, fix the stale hero and the countdown. **Back up first:** duplicate the live theme, and export current prices and compare-at values to a CSV so every change can be reverted.

## 6. Tools and access notes

- **Shopify:** the cloud session used the Shopify MCP connector (`mcp__Shopify__*`: graphql_query, search_products, run-analytics-query, list-orders) on store `ij7iyx-13.myshopify.com`. The local session needs the same connector authorised. `appInstallations` was access-denied; theme file reads and GraphQL product/order queries worked.
- **Panel tool:** `python3 .claude/skills/founder-consumer/panel.py --dir founder/panel {check,tally}` (seed 18297). Pricing tool: `.claude/skills/founder-pricing/van_westendorp.py`. CFO tool: `.claude/skills/founder-cfo/unit_economics.py founder/numbers.json`.
- **Caveats to repeat to the owner once:** the panel is simulated buyers (good for objections, an upper bound on conversion); CFO numbers marked "est." are estimates to replace with real quotes; nothing here is legal, tax or financial advice.
