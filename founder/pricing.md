# Pricing: Nora Furnish

Inputs: panel v1 (100 buyers, $359.99 pitch), panel v3 (20 buyers, target-state store at $249), competitors.csv, numbers.json, price-history.md. Simulated price answers pick what to test; they are not proof.

## 1. What buyers said (Van Westendorp)

| | Today's store (v1, n=100) | Target-state store (v3, n=20) |
|---|---:|---:|
| Point of marginal cheapness (PMC) | $121 | $90 |
| Indifference price (IPP) | $249 | $160 |
| Point of marginal expensiveness (PME) | $449 | $350 |
| Median "too expensive" | $650 | $420 |

The acceptable range for a statement paper pendant is roughly **$120-$450**. Buyers anchor on the price they are shown: v3 saw $249 and its whole curve moved down. Treat $250-$350 as the band that does not trigger "too expensive" for most buyers.

## 2. What competitors charge (links in competitors.csv)

| Comparable | Low | Middle | High |
|---|---|---|---|
| Cloud / wabi-sabi pendant | Etsy shade $42; Walmart look-alikes | Vaxlamp $205 ("was $342"); Etsy organic cloud $474 | Articture $499+ |
| Outdoor wall lantern | Home Depot marketplace $40-$79; Homary $60-$70 | AllModern $99-$118; Destination Lighting $96-$308 (ships in 1 business day) | Rejuvenation $349-$529; RH $395 |
| Moon wall lamp | AliExpress $33-$106; Amazon $68-$90 | - | Nora today $185 |
| Nordic wood hallway ceiling light | Walmart $10-$11 | - | Nora today $178-$202 |
| Design-store pendants (branded, US stock) | Article $199 | CB2 $249; Lulu and Georgia $225+ | Schoolhouse $299-$449; Lightology $695+ |

Nora's commodity items sit 2-17x above identical listings that a buyer finds in one image search. Its statement pieces ($250-$450) sit in the same band as Article, CB2 and Schoolhouse. Those stores have brands, US stock and years of reviews, which Nora does not have yet.

## 3. What the business needs (per piece; White Paper Cloud Pendant 23.6", recorded cost $38.88, plus estimated $25 shipping)

| Price | Contribution before acquisition | After a $120 acquisition cost |
|---:|---:|---:|
| $199 | $89 | -$31 |
| $249 | $130 | $10 |
| **$279** | **$155** | **$35** |
| $299 | $172 | $52 |
| $359.99 (today) | $222 | $102 |

Costs deducted: 2.9% + $0.30 card fees, 10% refund allowance, 5% discount allowance, $9.80 for the guarantee stack (offer.md). Below about $230, a paid-acquired single-piece order loses money. The order-level model (numbers.json, $350 order value) is what the CFO uses.

## 4. The decision

**Price rule (replaces the September/October across-the-board markups):**
1. **Commodity, Lens-able items** (night lights, Nordic wood flush mounts, rope lights, solar items; anything sold under $30 on Walmart, Amazon or AliExpress): **delist from Nora.** They cannot carry a premium brand. If kept, price within 1.3x of the lowest identical US listing, never with a compare-at.
2. **Statement pieces** (sculptural pendants, chandeliers, wall lights a buyer cannot find identical on Amazon): price at **landed cost × 4-6, inside $250-$450**, at or below the design-store band (CB2, Schoolhouse, Lulu and Georgia).
3. **No compare-at prices** unless the item actually sold at that price for 30+ days.
4. **One price, everywhere.** No rolling sales, no per-product popup codes.

**Hero price: White Paper Cloud Pendant 23.6" at $279** (was $359.99). It sits between the v1 indifference price ($249) and the v3 marginal-expensiveness point ($350), below Articture ($499) and Etsy ($474), above Vaxlamp ($205), and keeps $155 per piece before acquisition.

## 5. The ladder

| Rung | What | Price logic | Reason to step up |
|---|---|---|---|
| Good | One piece | List price | - |
| Better | **Pair or trio from one collection** (kitchen island, hallway, stairwell) | 10% off the 2nd and later pieces (the only standing discount) | Islands and hallways need 2-3 lights; this lifts the average order toward the $350+ the model needs |
| Best | **Room set**: pendant(s) + matching sconces + free sizing plan | 10% bundle + free layout help | One decision for a whole room; highest order value |
| Trade | Designers, contractors, rental hosts (verified) | 15% off list, project quotes | Repeat volume |

## 6. Opening offer (true, dated, no fake urgency)

**Relaunch week: free sizing plan plus 10% off a first order over $250, for 14 days from relaunch, ending on a stated date.** After that only the bundle and trade pricing remain. The holiday delivery cutoff ("order by Nov 24 to arrive before Dec 20", set from real transit times in ops.md) is the only urgency message.

## 7. What to test with real buyers

| Test | How | Success line |
|---|---|---|
| $279 vs $329 on the Cloud pendant | Google Shopping split: two equivalent ad groups, or alternate weeks; same page otherwise | At least 300 clicks per arm; the arm with higher contribution per click wins (orders × contribution ÷ clicks) |
| Bundle discount 10% vs free sizing plan only | Alternate weeks on island-pendant pages | Share of orders with 2+ pieces; target ≥30% |
| Trade 15% | Outreach to 30 OKC designers and STR hosts | 3 trade accounts placing a first order within 30 days |

## 8. Price objections to answer in marketing (panel quotes, research only, never testimonials)

1. "I'd screenshot that paper cloud pendant, run it through Google Lens, and find a lookalike on Amazon or AliExpress for way less than $360 from a store I've actually heard of." (v1, P059)
2. "A paper cloud pendant at $360 looks like something I can find for a lot less on Amazon or AliExpress. The 10% off doesn't move me, since every store has a first-order code." (v1, P031)
3. "With the 15% trade discount it lands around $212, the UL number is listed and free 30-day returns take the risk out, so I'd order one to see it in person." (v3, P006, a buyer who said yes)

If the price changes, update `numbers.json` and re-run /founder-cfo (done; see cfo.md).
