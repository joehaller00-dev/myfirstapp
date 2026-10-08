# Offer: Nora Furnish

Method: the Offers lens (a summary of the published framework in *$100M Offers*; not the author's words). Inputs: panel v1 (100 buyers), board.md, numbers.json, storefront audit, price history.

## 1. The problem list (buyer's words, from the panel and the audit)

Before buying
1. "I've never heard of this store, is it legit?" (88/100 panel buyers passed on trust)
2. "There are no real reviews." (91/100 asked for verified reviews with photos; the site's 838 reviews are imported from AliExpress and shown as "Verified Buyer", 0 of them verified)
3. "I can find the same light cheaper on Amazon or AliExpress." (Google Lens; catalog photos and SKUs come from Dazuma, Baskoraa and AliExpress listings)
4. "The 'sale' is fake." (compare-at prices that were never charged; a countdown that rolls from Fall Sale into Halloween Sale)
5. "Who am I even paying?" (email only, no phone, no name, address hidden in a policy page)
6. "Is it UL listed? My electrician won't hang it otherwise." (30/100; no listing shown on any sampled product, some E14/220V variants)
7. "I can't judge the quality or size from photos." (27/100 wanted samples or real photos)
8. "Too many popups and codes; the list price isn't real."
9. "$360 for a brand nobody knows is a lot."

During
10. "10-12 business days, or 6 weeks, is too long; my electrician is booked." (51/100 wanted a faster or firm date)
11. "'In stock' but it ships from overseas in 3 weeks." (all products show "In stock", including 337 made-to-order)
12. "I don't know when it will arrive."

After
13. "Return shipping on a big fixture would cost a fortune." (94/100 asked for free returns or a prepaid label)
14. "It arrived broken, now what?"
15. "Integrated LED dies after a month and the warranty is 30 days."
16. "The FAQ says no warranty and also a 30-day warranty."
17. "I need help installing or sizing it."
18. "Trade buyers need pricing, specs and repeatable supply." (6/100)

## 2. Solutions, scored (value to buyer 1-5, cost to deliver 1-5; keep high value, low cost)

| # | Solution | Kills | Value | Cost | Keep? |
|---|---|---|---:|---:|---|
| A | Remove imported reviews from "Verified Buyer" display; turn on Judge.me post-purchase requests with photo incentive (not tied to rating) | 1, 2 | 5 | 1 | Yes (legal must-do) |
| B | Clear every compare-at price that was not charged for 30+ days; one honest promotion per quarter | 4, 8 | 4 | 1 | Yes (legal must-do) |
| C | Human contact: chat (Shopify Inbox, free) + Google Voice number, founder name/photo, legal entity and address in footer | 1, 5 | 5 | 1 | Yes |
| D | Free 30-day returns on lighting with prepaid label to a US address (Edmond, OK); resell open-box | 13 | 5 | 2 | Yes |
| E | Arrives damaged: photo, free replacement, no return needed (supplier-backed) | 14 | 4 | 1 | Yes |
| F | Dated delivery window on every page and at checkout ("Arrives Oct 22-28"); 10% back if late | 10, 11, 12 | 4 | 2 | Yes |
| G | Curate to UL/ETL-listed hardwired fixtures, show listing number; delist 220V/E14 variants | 6 | 5 | 3 | Yes (curation, not cost per order) |
| H | Full spec table on every lighting page (lumens, watts, CRI, CCT, dimmer type, base, IP, weight) | 6, 7 | 4 | 2 | Yes |
| I | 1-year replacement warranty on lighting (LED and driver) | 15, 16 | 4 | 2 | Yes (~2-3% of revenue) |
| J | Free sizing help: room photo → size and hanging height in 1 business day | 7, 17 | 4 | 1 | Yes (founder time) |
| K | Own photography of the 30 advertised hero SKUs from inspected samples | 3, 7 | 5 | 3 | Yes (startup cost $3,000) |
| L | Price hero SKUs within reach of identical listings elsewhere (no 12-17x markups on Lens-able items) | 3, 9 | 5 | 3 (margin) | Yes |
| M | US-stocked "Ships in 2 days" line of 10-20 best sellers | 10 | 5 | 5 | Later (after 30+ orders prove demand) |
| N | Material samples / swatches ($15, credited on order) | 7 | 3 | 3 | Trade only |
| O | Trade program: 15% trade price, spec sheets, project quotes | 18 | 4 | 2 | Yes (already have pages) |
| P | $250 design membership | - | 1 | 4 | Cut (no proof yet) |
| Q | Stacked codes (WELCOME10, COMEBACK10, 5%, Member 20%, "Kevin 15", popups) | - | 1 | 4 | Cut |

## 3. The stack

**Name: The Nora Lighting Promise**

**Core:** a curated line of about 150 pendants, chandeliers and wall lights, each sampled and inspected, with full specs and a listed safety certification on every hardwired fixture. Described as the outcome: "the light you pictured, the right size, installed by your electrician without a surprise."

**Bonuses (each kills one objection):**
1. Free sizing help within one business day (kills "I can't judge size or fit").
2. Electrician-ready spec sheet and install guide PDF with every lighting product (kills "will my electrician install it").
3. Bundle pricing: 2+ pieces from the same collection save 10% (lifts AOV for islands, hallways and stairwells; replaces every other code).

**Guarantee:** free 30-day returns on lighting (prepaid label), a free replacement if it arrives damaged, a 1-year warranty on LEDs and drivers, and 10% back if it arrives after the dated window.

**Urgency (true only):** the holiday delivery cutoff. "Order by Nov 24 for delivery before Dec 20" (set from carrier transit, see ops.md). No countdowns, no "only 3 left".

**What is cut:** imported "Verified Buyer" reviews, fake compare-at prices, rolling sales, the membership, the per-product popup, every code except bundle pricing and one welcome offer.

## 4. Cost of the stack (per order, at $350 AOV; added to numbers.json)

| Item | Assumption (est.) | Per order |
|---|---|---:|
| Free returns label | 8% of orders return × $35 domestic label for a large box | $2.80 |
| Late-delivery credit | 15% late × 10% of $350 | $5.25 |
| 1-year warranty replacements | 2.5% of revenue | $8.75 |
| Damaged-on-arrival replacements | Supplier-backed; est. net 1% of revenue | $3.50 |
| Discount allowance | Falls from est. 8% to 5% (one bundle offer + one welcome) | saves $10.50 |
| **Net added cost** | | **≈ $9.80** |

Startup items (in numbers.json): samples and inspection of 30 hero SKUs, own photography, trademark, review-request setup.

## 5. Value equation, before → after (1-10)

| Element | Before | After | What moves it |
|---|---:|---:|---|
| Dream outcome (the statement light in my room) | 6 | 7 | Curated line, sizing help |
| Perceived likelihood (it is real, safe and as pictured) | 1 | 4 | Honest reviews, UL/ETL, human contact, free returns; still capped by **few real reviews** |
| Time to result | 3 | 4 | Dated delivery window, late credit; still 2-3 weeks from overseas |
| Effort and sacrifice | 3 | 6 | Free returns, damage replacement, spec sheet, no code-hunting |

## 6. Re-test result (panel-v2: 20 buyers, same seed 18297, same $359.99 price)

**0 buy · 20 pass (0%)**, against 0 of 100 for v1. Reasons: trust 14, timing 3, price 2, quality 1.

What dropped: almost nobody raised free returns, UL listing or specs as the blocker. Several said the listing numbers and returns were "good signs" but not enough.

What remains:
- **"Brand new store with hardly any reviews."** Copy cannot fix this. Only real orders fix it.
- **"I'd Google Lens it and buy the lookalike on Amazon for a fraction."** Product sameness plus markup.
- **"2-3 weeks is too slow."**
- Wanted: samples, trade pricing, in-stock items shipping in days.

**Plain reading:** the offer was not the only problem. The product sourcing (identical, Lens-able items at 3-17x markup) and the absence of real proof are. Nothing in the copy moves a buyer until there are real reviews and either (a) prices near the identical listings or (b) products a buyer cannot find elsewhere. That points to: price hero SKUs honestly (pricing.md), seed the first 20-30 real orders through channels where trust is borrowed (marketplaces, trade, local), and build a small US-stocked or exclusive line once demand is proven (ops.md, launch.md).

Panel answers are simulated research, not customer quotes.
