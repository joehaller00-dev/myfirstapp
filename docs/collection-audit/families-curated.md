# Collection audit: design families + curated/seasonal collections

Date: 2026-10-22. Store: Nora Furnish. Scope: 30 `*-collection` design families + 24 curated/seasonal collections (54 total).
Method: read title, description, rules and every product (title, type, status, tags; descriptions/options pulled for anything doubtful). ARCHIVED/DRAFT products were counted but not acted on.

Note on tooling: `collectionRemoveProducts` is not exposed by this Shopify connector, so removals were done with
`productUpdate(product:{id, collectionsToLeave:[collectionId]})` (same effect, synchronous). No tags changed, nothing added.

## Changes made

| Collection | Product (id) | Action | Reason |
|---|---|---|---|
| golden-hour-collection | Anello Vase (gid://shopify/Product/10330852425780) | Removed from collection | Decor > Vases in a lighting design family (owner's complaint). Still in Vases / New in Decor. |
| golden-hour-collection | Galena (gid://shopify/Product/8945063723060) | Removed from collection | Clear "magic cube" crystal on gold steel, no amber/cognac/honey option anywhere in copy, options or images alt text. Contradicts the family's amber-glass look. Still in Grand Collection / Grand Indoor. |
| golden-hour-collection | (collection) | Description rewritten | Old copy promised "an amber glass vase". New: "Amber, cognac and honey glass with warm brass. Pieces that fill a room with the soft glow of late-day sun, from staircase cascades to chandeliers, cloud pendants and pressed glass wall sconces." |
| glow-anywhere-collection | Cadran (gid://shopify/Product/8945875091508) | Removed from collection | Backlit wall clock, hardwired only ("wired in rather than solar"); collection is cord-free light. Only active item with no solar/battery/USB option. |

Golden Hour now 10 products (7 active). Glow Anywhere now 202.

## Questionable keeps (owner's eye)

- **glow-anywhere-collection: description vs contents.** Copy says "Slim rechargeable table lamps and portable floor lights that share the same clean stem-and-shade silhouette", but ~150 active items are solar outdoor wall lights, pillar caps, path/bollard lights, string lights, garden novelty lights. They do fit "cord-free" (nearly all have a Solar power option). Recommend rewriting the description to "cord-free solar and rechargeable light, indoors and out" or splitting the collection. Not edited (outside the brief).
- glow-anywhere: Rena (8896085131316) sand-art lamp + wireless phone charger, power source unclear (likely plugs in).
- glow-anywhere: Harbor, Lunette, Rib, Pedestal, Boulevard, Courtyard, Quadra, Pier, Kinross: description says "wired in rather than solar" but variants offer a Solar option. Kept; product copy is contradictory and should be fixed.
- aurelia-collection ("crystal and gold"): Savannah (8945063821364) comes in copper, nickel or black, no gold finish.
- grand-indoor-lighting / grand-collection: Fronda (8945876828212) ceiling fan among chandeliers and statement fixtures.
- the-hosting-table ("trays, platters and candle holders"): Amani Soy Candle (8865057112116) is a candle rather than a holder; Brocante Tabletop Decor (8858191134772) is an accent object.
- top-picks (tag campaign-50, copy "from statement chandeliers to outdoor lights"): Caliza Wall Clock (10330853212212) is decor. Tag looks intentional, so it was left alone.
- selene-collection: Orchard (8948170555444) description only mentions a resin tree; handle/SEO confirm "Moon and Tree", so it fits. Kasbah = moon and sun projector, fits.
- mesa-collection: Caliza Wall Clock + Breccia Vanity Tray are decor, but the description explicitly includes them. Kept.
- new-in-decor: 5 LED Wall Art lighting items (Icarus, Inara, Jay, Heian, Jaipur). Kept, because the copy promises "wall pieces".
- Cage (8946442862644): indoor/outdoor pendant tagged nav-outdoor-lighting, so it is excluded from Indoor Best Sellers by rule. Fine as is.

## Collections that show (almost) nothing to shoppers

- fall-decor (16), halloween-decor (12), halloween-inflatables (18): every product ARCHIVED, so the storefront pages are empty in peak season.
- autumn-at-home: 90 products, only 8 active (candle holders). Copy promises throws, incense burners, dried stems, porch lanterns and path lights, but all of those are archived or absent.
- home-fragrance-picks, outdoor-lighting-picks, soft-furnishings-picks, poufs-and-floor-cushions-picks: 0 active. ceiling-lights-picks, decor-picks: 1 active each.
- alba, aurelius, angelica, arabella, celestial, emma, haylen, obsidian, raven, solara-brand, umbra, velina: all products ARCHIVED (coherent, but empty).
- kumo-collection 2 active of 7; sorbet-collection 1 active of 5.

## Reviewed, no misfits found

halo, carrara, mesa, kumo, ondine, cadence, isla, sorbet, selene, nordhaven, alba, aurelius, angelica, arabella, celestial, emma, haylen, obsidian, raven, solara-brand, umbra, velina, aurelia, ashford, ironworks, linea, bolla, grand-collection, grand-indoor-lighting, grand-outdoor-lighting, lighting-catalog-2026, hospitality-lighting, office-lighting, retail-lighting, home-project-lighting, outdoor-project-lighting, best-sellers, best-sellers-indoor, best-sellers-outdoor, top-picks, the-hosting-table, new-in-decor, autumn-at-home, fall-decor, halloween-decor, halloween-inflatables, all six *-picks.

## 2026-10-22 follow-up (owner request)
- glow-anywhere-collection: description + SEO rewritten to match the contents (solar wall/path/pillar/bollard lights,
  lanterns, string lights, rechargeable lamps). Old: "Cord-free light for any table, shelf or patio. Slim rechargeable
  table lamps and portable floor lights that share the same clean stem-and-shade silhouette."
- NEW smart collection outdoor-floor-lamps (gid://shopify/Collection/512656769076): rule product type = "Lighting > Outdoor
  Floor Lamps" (8 products: Kinross, Kailua, Kauai, Lampas, Loom, Lindos, Lace, Lombok). They are 31-76in shaded floor
  lamps for patio seating, not path or bollard lights. Published to Online Store and Shop.
