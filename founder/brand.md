# Brand: Nora Furnish

Scope note: the owner already has norafurnish.com and is keeping the name, so this skips name generation and domains. It covers the one legal flag, the voice, and what to change visually on the live theme (`nora-v5-mobile-menu`, read from the theme files).

## 1. One legal flag on the name (not a rename recommendation)

Nora Lighting, Inc. (Commerce, CA; about 150 staff, 30+ years in lighting) holds USPTO registrations for **NORA LIGHTING** in Class 11, lighting goods: Reg. No. 2939989 (registered 2005, renewed) and Reg. No. 5939753 (2019, stylized), plus NORA NSPEC LIGHTING (Reg. No. 5076214). Sources: [Justia 2939989](https://trademark.justia.com/745/47/nora-lighting-74547440.html), [Nora Lighting marks](https://trademark.justia.com/owners/nora-lighting-inc-3041876). "Nora Furnish" selling lighting puts the shared dominant word **NORA** on the same goods. That is the textbook setup for a likelihood-of-confusion claim, and a Google search for "Nora Furnish lighting" already returns Nora Lighting pages.

**What to do:** before spending on photography, packaging or ads under this name, spend about $300-$500 on a trademark attorney's clearance opinion (search USPTO at https://tmsearch.uspto.gov, Classes 11 and 35). If the opinion is bad, a light-touch fix keeps the domain: lead with a distinct mark (e.g. a sub-brand for the lighting line) and use "Nora Furnish" as the store name. Not legal advice.

## 2. Promise, tagline and voice

**Promise (what a customer can count on every time):** *You'll know exactly what you're getting, where it ships from and when it arrives, and if it's not right, it goes back free.*

**Tagline options:**
1. *Statement lighting, no surprises.* (recommended; it answers the trust objection directly)
2. *Light the room you pictured.*
3. *Sized for your room. Listed for your electrician.*

**Voice: plain, warm, exact.**

| Trait | Do | Don't |
|---|---|---|
| Plain | "Ships from our partner factory overseas. Arrives Oct 22 to 28." | "Artisan-crafted in our workshop" (not true) |
| Warm | "Send a photo of your island and I'll tell you what size fits." | "Elevate your space with timeless luxury" |
| Exact | "23.6 in wide, 1,800 lumens, 3000K, UL listed (E123456)" | "Bright, warm glow"; "2700K 3999K" |

**Before → after (from today's homepage):**
- Before: *"The First Days of Fall Sale. Shorter Days, Warmer Rooms. Shop the Sale"* (stale sale, the button goes to Best Sellers)
- After: *"Statement lighting, no surprises. Free returns, real delivery dates, UL-listed fixtures. Shop ceiling lights"*

## 3. What to change visually (from the live theme settings and sections)

| Area | Today (theme files) | Change to | Why |
|---|---|---|---|
| **Fonts** | Settings: Roboto Serif Light headings with very wide letter-spacing (16) + Montserrat body (spacing 5). Layout also loads Fraunces, Lora and Inter from Google Fonts: 5 families. | **Two families:** keep Fraunces (display, already loaded) for headings and Inter for body/UI; drop Roboto Serif, Montserrat and Lora. Heading letter-spacing 0-2, body 0. | Fewer fonts read as more premium and load faster. Wide-tracked light serifs look generic "template luxury" and are hard to read on mobile. |
| **Colour** | Pure white background, #1c1c1c buttons, gold #c9a36a for ratings and chat, terracotta #a65440 sale accent | **Warm paper** #FBF8F3 background, **ink** #1F1B16 text and primary buttons (contrast 16.2:1, passes WCAG AA and AAA), **brass** #9A7B4F accent for badges and icons only (3.7:1 on paper: large text and icons only), and a darker **bronze** #7A5F3A for text links (5.6:1, passes AA). Retire the red-terracotta sale accent with the fake sales. | Lighting photographs warmer on an off-white; one accent, used sparingly, looks curated. |
| **Cards** | Custom CSS `.card {border-radius: 30px}`; square images; secondary image on hover **off** | Radius 4-8px; **turn on the secondary image** and make it the light switched on (or installed in a room) | 30px pill cards look playful, not high-ticket. For lighting, "off vs on" is the most persuasive image you have. |
| **Homepage** | 17 sections; countdown bar first; Halloween inflatables tabs; trust strip last; hard-coded "Verified Buyer" photo wall | **8 sections:** hero (one room, lit) → trust strip (free returns · delivery date · UL listed · talk to a person) → shop by room → day-to-night kitchen slider (keep, it's the best thing on the site) → 8 hero products → founder note with photo → guides → newsletter | Today's page leads with a fake countdown and Halloween; a buyer of a $300 light needs proof first. |
| **Navigation** | 15 top-level items + top bar + pills | Ceiling · Wall · Lamps · Outdoor · Trade · Guides (Home decor folded into one menu if kept) | Decision fatigue; the brand reads as a general store. |
| **Product page** | Green "In stock" on everything; assurance row "Secure checkout / Encrypted on Shopify"; supplier photos; Bundle & Save 10/15% | Delivery window ("Arrives Oct 22-28"); assurance row = delivery date · free returns · 1-year warranty · chat; a spec table above the fold on desktop; own photos for hero SKUs | Puts the four things buyers asked for where they decide. |
| **Swatches** | `color_swatch_config` still holds furniture colours ("Beige Gray Seat + Gold Base", "White Door"...) | Trim to lighting finishes (black, brass, chrome, white, wood, glass, paper) | Leftover furniture data; sloppy swatches undercut "curated". |
| **Overlays** | Newsletter popup + per-product 10% popup + countdown bar + cookie banner on first visit | One delayed welcome offer (exit intent or 30s on mobile); remove `nf-offer-popup` and the countdown | Stacked overlays hurt mobile and signal discount-store. |
| **Logo/favicon** | `CLEAN_FAVICON` image | Keep; check the 32px icon reads as a single mark, not tiny text | - |

## 4. The first five touchpoints

1. **Homepage hero:** one real lit room, the tagline, the trust strip directly underneath.
2. **Packaging:** supplier boxes can't be changed yet. Add a printed insert in the shipment, or emailed at delivery: "Inspected for Nora. Questions? Text [number]. Free returns: scan here."
3. **Order confirmation:** the delivery window in the first line, where it ships from, and who to text.
4. **First social post:** "Here's how we check a light before we list it" (a sample on the bench, with the listing number checked on UL Product iQ).
5. **Reply to the first complaint:** within 4 business hours, a named person, the fix offered before they ask (replacement or prepaid label), then a follow-up when it's resolved.

No copied competitor names, logos or taglines. Fraunces and Inter are free under the SIL Open Font License (Google Fonts).
