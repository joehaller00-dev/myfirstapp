# Relaunch plan: Nora Furnish

Not a new launch: the store is live and has ~12 real orders. This is a **relaunch of an honest, focused store**, with a cheap real-world test before any real ad budget. Target relaunch: **Monday, October 26, 2026**. Owner = Joe (the founder) unless noted; "Claude" = changes Claude can make through the Shopify Admin API if the owner says go.

## 1. Test before you spend

**The test:** after the Week-1 and Week-2 fixes (store-fixes.md), run Google Shopping on **10 hero SKUs** at honest prices (pricing.md rule) for **14 days at $25/day ($350 total)**, plus 30 trade outreach emails.

**Success line, written before running:**
- At least **350 clicks** and **3+ orders** (≥0.85% click-to-order) with blended CAC **≤ $117**, i.e. $350 ÷ 3.
- Mobile add-to-cart rate **≥ 3%** (today 1.7%).
- Zero refunds for "not as described" in the first 30 days after delivery.
- Trade: **2+ accounts** opened and 1 first order.

**Compare with the panel:** the simulated panel says today's store converts 0% and the target state up to 45% (an upper bound, since models lean agreeable). Real conversion today is ~0.15%. If the test lands under 0.5% conversion, trust the real buyers: go back to pricing (Lens-able items) and offer (reviews, US stock), not to bigger budgets.

## 2. Countdown (today Thursday Oct 8 → relaunch Mon Oct 26)

| Week | Task | Owner | Deadline | Critical path? |
|---|---|---|---|---|
| **Oct 8-11** | Decide the keep list: ~150-300 lighting SKUs (catalog summary in data/) | Owner | Oct 10 | **Yes** |
| | Remove imported "Verified Buyer" reviews from display, fake review count, homepage proof wall | Claude/Owner (Judge.me) | Oct 11 | **Yes (legal)** |
| | Clear never-charged compare-at prices; remove `clearance` from made-to-order; kill the countdown; fix the hero | Claude | Oct 11 | **Yes (legal)** |
| | Rename Best Sellers → Editor's Picks; remove workshop/handmade claims; one warranty; one shipping truth | Claude | Oct 11 | Yes |
| | Email suppliers for UL/ETL file numbers on every hardwired keep-list SKU | Owner | Oct 11 (answers by Oct 18) | **Yes** |
| | Book a trademark clearance consult on NORA (brand.md §1) | Owner | Oct 16 | No (but before ad spend) |
| **Oct 12-18** | Unpublish everything off the keep list; delete stacked discount codes and the membership from nav | Claude | Oct 14 | Yes |
| | Navigation to 6 items; homepage to 8 sections; trust strip under hero; fonts to Fraunces + Inter; card radius; secondary "lit" image | Claude (theme) | Oct 16 | No |
| | Google Voice number; founder note and photo; address and entity in footer | Owner | Oct 16 | Yes |
| | Free-returns policy + prepaid label flow (Shopify returns); 1-year warranty text | Owner + Claude | Oct 16 | Yes |
| | Delivery-date app/snippet replacing "In stock" | Claude | Oct 18 | Yes |
| | Order samples of the 10 test SKUs (arrive ~14-21 days) | Owner | Oct 12 | **Yes** (samples gate own photography; test can start with supplier photos if honest) |
| **Oct 19-25** | Spec tables on the 10 test SKUs; rewrite their copy; reprice per pricing.md | Claude + Owner (supplier data) | Oct 21 | **Yes** |
| | Merchant Center feed re-sync; fix warnings; Judge.me review requests on | Owner | Oct 22 | **Yes** |
| | Exclude internal traffic; bot filter | Owner | Oct 22 | No |
| | Build the Shopping campaign (10 SKUs, $25/day), not live | Owner | Oct 23 | Yes |
| | Soft open: 3 friends/family place real orders at full price and report the experience end to end (refund them after if needed) | Owner | Oct 23-25 | No |
| **Oct 26** | **Relaunch** | All | Oct 26 | - |

## 3. Relaunch day run sheet (Mon Oct 26, CT)

| Time | What | Owner |
|---|---|---|
| 8:00 | Check site on phone: homepage, 3 product pages, cart, checkout (Apple Pay, card), chat, phone | Joe |
| 8:30 | Shopping campaign live; confirm products approved in Merchant Center | Joe |
| 9:00 | Email the 28 existing customers: founder note + relaunch offer (ends Nov 8) | Joe |
| 9:30 | 10 trade outreach emails | Joe |
| 10:00 | Pinterest: 5 pins | Joe |
| 12:00 | Check ads: spend, clicks, disapprovals | Joe |
| 13:00-17:00 | Staff chat and phone; reply to every message within 1 hour | Joe |
| 17:00 | Log the day: sessions (real), add-to-carts, orders, questions asked (they are the next FAQ) | Joe |
| If something breaks | Checkout error → pause ads first, then debug. Merchant Center disapproval → fix the flagged field, don't appeal blind. Supplier out of stock → unpublish the SKU, email any buyer the same day with options. | Joe |

## 4. The first 30 days

**Weekly numbers (Mondays):** real sessions; mobile add-to-cart (≥3%); conversion (≥0.7% by day 30); CAC (≤$117); orders per day vs CFO break-even (0.42/day ≈ 13 orders/month); refund rate (<10%); verified reviews collected (target 10 by day 45).

**Reviews:**
- **Day 7 (Nov 2):** any orders yet? If clicks ≥150 and add-to-carts <3, the product page or price is the problem: change the price on the worst SKU and rewrite its top section.
- **Day 14 (Nov 9):** test verdict against the success line. Pass → raise to $40/day and add 10 SKUs. Fail → stop ads, keep organic and trade, revisit pricing and offer.
- **Day 30 (Nov 25):** first deliveries reviewed. Refund reasons per SKU, delivery accuracy vs promised window, reviews in. Decide whether to stock the top 3 SKUs in the US (ops.md phase 2) before spring.

**Holiday cutoff:** "Order by Nov 24 for delivery before Dec 20" (overseas transit 14-21 days observed + 5-day buffer). Re-check against ops.md transit data before publishing.
