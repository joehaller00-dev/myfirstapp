# Prompts for the work that is not done

Paste each one into a Claude session that can open norafurnish.com in a real browser
(the Claude-in-Chrome session on Joe's computer). The cloud session that made the product
films is blocked by the store's own bot protection, so it cannot see real page loads.

Live theme: "LIVE FIX - PDP restore" (id 187991064628). The Shopify connector refuses
live-theme writes; the Ryze connector's Shopify tools can make them.

---

## 1. White screen and image flash when a product page loads

```
On norafurnish.com product pages (example: /products/layered-amber-glass-linear-chandelier-gold-frame
and /products/solar-floor-lantern-portable-led-outdoor-garden-light) two things are wrong on load:

1. After the header and breadcrumb appear, the rest of the page stays a blank white screen for a long time.
2. Then the first gallery image flashes for about a second in the wrong state: it shows the 3D model
   image, zoomed far in, with a left arrow, before the normal gallery appears.

Reproduce both in the browser with the network throttled to Fast 4G, on desktop and on a phone-sized
viewport. Record a performance trace and tell me exactly what holds the first paint and what causes
the flash, with the file and line in the live theme. Things to check first: the NF-RELOAD-SMOOTH code
in layout/theme.liquid that holds the first frame until #nf-main-end, the 3D model being the first
media item on products that have one, and the gallery's zoom/carousel script initialising late.

Then fix it in the live theme so that (a) content paints as soon as the gallery and buy box are ready,
never a blank page, and (b) the first image shown is the product's normal first photo at its normal
size from the very first frame, with no zoomed 3D frame and no stray arrow.

Do not change the "people viewed in the last 24 hours" line or the low-stock label. Show me a
before/after trace and a screen recording of three product pages loading. Back up every file you
change as an asset named _bak_<file>_loadfix_<date>.txt, as the theme already does.
```

## 2. Gallery image hugging the bottom of the screen while scrolling

```
On norafurnish.com product pages on desktop (example: /products/solar-floor-lantern-portable-led-outdoor-garden-light),
scroll down until the product gallery sticks. The main image sits too low: there is a large gap above
it and almost none below, so it touches the bottom edge of the window.

Fix the sticky gallery in the live theme so the gap above the image and the gap below it are equal
at every desktop window height from 700px to 1200px tall, including with the announcement bar and
sticky header showing. The thumbnails column must stay aligned with the main image. Do not change the
mobile layout.

Show me screenshots at 768, 900 and 1080px window height, before and after, with the two gaps measured
in pixels.
```

## 3. Clean up the Loox reviews

```
Open the Loox Reviews app in my Shopify admin and go through every review, starting with the 50
products tagged campaign-50 (my best sellers).

Keep reviews that read like a real customer wrote them about that specific product. Unpublish
(do not permanently delete) any review that:
- uses a reviewer name from our old hand-written set, such as Sarah, Sarah Mitchell, Marcus, Elena
  Reyes, Diana Calloway, James Okafor, Catherine Brewer, Derek Lawson or Patricia Nguyen;
- is generic praise that could apply to any product ("great quality", "love it", "highly recommend")
  with no detail about this product;
- describes a different product, room or feature than the one it is attached to;
- is a word-for-word or near duplicate of another review in the store;
- reads like marketing copy rather than a customer.

It is fine if this removes half of them. Before you unpublish anything, give me a spreadsheet with
one row per review: product, reviewer name, date, star rating, the review text, keep or remove, and
the reason. After I approve it, unpublish the removals and tell me the new review count and average
rating for each of the 50 best sellers.

Then check that the star ratings on product cards, the product page header and the "Customer Reviews"
section all show the new numbers, on the home page, a collection page and three product pages.
```

## 4. Add the piano music to the product films

```
The 50 campaign products each have a silent wide product film attached in the product metafield
custom.product_video, shown by snippets/nf-pdp-video.liquid in the buy box. The music track is in the
repo joehaller00-dev/myfirstapp on branch claude/peaceful-allen-r1agrh at product-videos/music/.

1. Mix the piano track under every film (loop it to the film's length, fade in over 1 second and out
   over 2 seconds, about -18 LUFS), re-upload each film to Shopify Files and point the product's
   custom.product_video metafield at the new file. The source films are in product-videos/campaign/out/
   (wide cuts) and product-videos/chandra-3d/out/chandra-3d-wide.mp4; upload_manifest.json maps each
   product to its video. Delete each old video file after its replacement is attached, because the
   store is close to its plan limit of 250 videos and 3D models.
2. The films must keep autoplaying muted, because browsers block autoplay with sound. Add a small
   sound on/off button next to the pause button in snippets/nf-pdp-video.liquid. Tapping it unmutes
   that film; it starts muted on every page load.

Show me one product page with the sound button working on desktop and on a phone before doing all 50.
```

## 5. Finish the unverified-claims sweep

```
I removed these from the live theme on 2026-11-10 by disabling their sections: the home page strip
under the hero ("50,000+ Homes Upgraded Since 2024", "Trusted by 11,000+ Trade Professionals", the
ELLE "Redefining modern luxury" quote, "4.7/5 on 1,300+ Reviews"), the "Trusted by 50K+ customers"
pill in the product buy box, and the "Trusted in real homes" testimonial section on product pages.

Search every file in the live theme, every page, blog article, collection description, email template
and the announcement bars for any remaining claim we cannot prove: customer or home counts, trade
professional counts, press quotes or "as seen in" logos, awards, review totals that do not match Loox,
and named customer testimonials. List each one with its file or page and the exact text, then remove
it. Leave the "people viewed in the last 24 hours" line and the low-stock label alone.
```
