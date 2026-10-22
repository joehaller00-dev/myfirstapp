# Collection audit: outdoor lighting + outdoor area collections

Date: 2026-10-22. Scope: 22 outdoor lighting collections plus the 4 smart area collections (garden-pathway, patio-deck, porch-entry, driveway-security).
Method: listed every product (title, productType, status), then read the description, options and tags of anything whose type didn't match the collection. Only ACTIVE products were considered for removal.

Note: this API version has no `collectionRemoveProducts` mutation. Products were removed from manual collections with `productUpdate(product:{id, collectionsToLeave:[...]})`. That call is synchronous, and every removal returned no userErrors. Counts afterwards: landscape-lighting 210 -> 203, outdoor-lanterns 89 -> 85, outdoor-up-down-wall-lights 50 -> 49.

## Changes made (manual collections)

| Collection | Product | Product ID | Action | Reason |
|---|---|---|---|---|
| outdoor-up-down-wall-lights | Summit | gid://shopify/Product/8948171145268 | Removed | A mountain-scene wall-art panel (solar/hardwired). It is not an up-and-down light. It stays in the solar wall, wall lighting and sconce collections |
| outdoor-lanterns | Duet | gid://shopify/Product/8945183064116 | Removed | A knee-height double-shade bollard/post light, not a lantern |
| outdoor-lanterns | Monaco | gid://shopify/Product/10311323516980 | Removed | An outdoor crystal chandelier/pendant, not a lantern |
| outdoor-lanterns | Minuet | gid://shopify/Product/10311320797236 | Removed | An outdoor candle-arm chandelier, not a lantern |
| outdoor-lanterns | Lace | gid://shopify/Product/10311322796084 | Removed | An outdoor floor lamp / side table, not a lantern |
| landscape-lighting | Lace | gid://shopify/Product/10311322796084 | Removed | A patio floor lamp / side table, not landscape (garden/path/spot) lighting |
| landscape-lighting | Lombok | gid://shopify/Product/10311323156532 | Removed | A patio floor lamp ("living room floor lamp outside") |
| landscape-lighting | Lindos | gid://shopify/Product/10311322042420 | Removed | A patio floor lamp for seating areas |
| landscape-lighting | Loom | gid://shopify/Product/10311321059380 | Removed | A patio standard lamp |
| landscape-lighting | Lampas | gid://shopify/Product/10311320567860 | Removed | A portable solar torchiere floor lamp for dining/lounge areas |
| landscape-lighting | Kauai | gid://shopify/Product/10311320141876 | Removed | A patio floor lamp |
| landscape-lighting | Kailua | gid://shopify/Product/10311318700084 | Removed | A USB-rechargeable patio floor lamp |

## Smart collections (tag rules)
No tags were removed because nothing was clearly wrong. outdoor-lighting (nav-outdoor-lighting), outdoor-wall-lights (nav-outdoor-wall-lights) and the four shop-area-* collections contain only outdoor lighting among their ACTIVE products. There were no indoor items, decor, rugs, vases or pillows.

## Questionable, kept (owner decision)
- **Firefly** (gid://shopify/Product/8847902507060), in outdoor-lighting and patio-deck. These are Bluetooth RGBIC fairy string lights. The product is tagged `indoor-lighting`, and the copy says it is "designed to suit real rooms" with no weatherproof rating. If it is indoor-only, remove tags `nav-outdoor-lighting` and `shop-area-patio-deck`.
- **Mosaic** (8944928653364), in driveway-security (tag) and flood-lights. This is a colour-changing accent spotlight, and the copy says it is not for "steady white light to see by". It is a weak fit for security or flood lighting.
- **Plinth** (8945874632756), in step-deck-lights. It is a pier/gate/fence-post cap light. It was kept because the store also files fence-post caps (Rye, Rockport) under Step & Deck.
- **Rockport** (8944932126772), typed Step & Deck but described as a gate-pier/fence-post light. It is fine in post-lights and pillar-lights.
- **Fanale** (10331528462388) and **Castagna** (10311322370100), in outdoor-lanterns. These are lantern-style bollards.
- **Millbrook** (8868056268852), in outdoor-lanterns and driveway-security. This is a solar barn/shed light.
- **Cage** (8946442862644), in outdoor-lanterns. A caged porch pendant/wall light.
- **Riverstone** (8944932323380) and **Rune** (8944932159540), in well-lights. These are in-ground step/deck markers. They are recessed, so they are close to well lights.
- **Skyline** (8944929341492) and **Sargasso** (8944928718900), wall washers in outdoor-spotlights. Sargasso is an IP68 fountain/pond washer.
- **Nocturne** (8948171014196), **Menhir** (8948170162228) and **Mistral** (8948171538484), in outdoor-up-down-wall-lights. They are solar wall lights, and the copy doesn't clearly say they light both up and down.
- **Larme** (10331525120052), in landscape-lighting. A glowing water-drop "floor lamp" sculpture. It was kept as garden decor lighting.
- **Ilex** (10331528069172), in path-lights and landscape-lighting. A minimal outdoor floor-lamp light bar.
- **Portable lanterns** in landscape-lighting: Crescent, Mooring, Merano, Slat and Mercer. These are tabletop/patio lanterns, which are a looser fit than Nara (a garden stone lantern).
- **Kaze** (8945182244916), a wind-chime hanging light, in landscape-lighting and porch-entry.

## Collections reviewed with no issues
bollard-lights, camping-lanterns (all archived), flood-lights (only Mosaic active), motion-sensor-wall-lights (Moonbeam and Nimes have motion-sensor options; Nevis is solar with a motion sensor), outdoor-led-strip-lights, outdoor-lighting, outdoor-post-lights, outdoor-solar-wall-lights (all generic "Outdoor Wall Lights" have a Solar power option), outdoor-spotlights, outdoor-string-lights, outdoor-wall-lighting, outdoor-wall-lights, outdoor-wall-sconces, path-lights, pillar-lights, portable-lanterns, post-lights, garden-pathway, patio-deck, porch-entry, driveway-security.
