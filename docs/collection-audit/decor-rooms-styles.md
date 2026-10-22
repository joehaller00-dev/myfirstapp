# Collection Audit: Decor, Rooms, Styles, Materials

Read-only review of the Nora Furnish Shopify store, run on 2026-10-22. Nothing was changed in the store.

**Method**
- Manual collections: every product was listed with `collection.products(first:250)` (paginated). ARCHIVED and DRAFT products were ignored.
- Smart collections: ACTIVE members were listed with `products(query:"collection_id:<id> AND status:active")`.
- Products that looked wrong were checked against their description and tags.

**Note:** an Admin product search on `tag:'mat-fabric'` also matches `shop-mat-fabric-paper`, and `tag:'shop-room-kitchen'` also matches `shop-room-kitchen-dining`. Because of that, every flag below was confirmed with a `collection_id` filter, not a tag search.

## Summary

- 64 collections reviewed: 37 decor/home and 27 room/style/material.
- 3 clear misfits and 13 questionable rows (about 37 product placements).
- 20 decor collections have **zero ACTIVE products**. They show as empty pages if they are linked in the navigation:
  - aroma-diffusers, bath-mats-rugs, corner-shelves, curtains-drapes, display-racks
  - floating-shelves, floor-cushions, incense-holders-burners, poufs-floor-cushions, poufs-ottomans
  - shoe-storage, shower-curtains, soft-furnishings, table-linens, throw-blankets
  - throw-pillows, towels, vanity-makeup-mirrors, wall-mirrors, wall-shelves
- bookshelves, storage and storage-shelves each contain only one ACTIVE product, "Easel", which is a picture ledge.
- No glaring errors were found in: accents-objects, ceramic-vases, decorative-objects, glass-vases, home-fragrance, photo-frames, wall-decor, wall-hangings-baskets, bathroom, bedroom, dining-room, entryway-hallway, kids-nursery, style-boho, style-farmhouse-rustic, style-glam, style-industrial, style-scandinavian-japandi, style-vintage-classic, material-alabaster, material-brass, material-ceramic, material-fabric-paper, material-glass, material-iron, material-marble-stone, material-wood.

## Misfits (clear)

| collection handle | collection id | ruleSet | product title | product id | productType | why it's a misfit | proposed fix |
|---|---|---|---|---|---|---|---|
| decorative-trays | gid://shopify/Collection/316502016052 | manual | Agave Succulent Planter | gid://shopify/Product/8859817181236 | Decor > Botanicals | It is a succulent planter. The "bamboo tray" is only its drip saucer, so it is not a decorative tray. | Remove from manual collection (keep in botanicals) |
| wall-clocks | gid://shopify/Collection/316934389812 | manual | Cubetto Desk Clock | gid://shopify/Product/10330853081140 | Decor > Wall Clocks | It is a freestanding desk/bedside clock (description: "on a desk or shelf"), not a wall clock. Its productType is also wrong. | Remove from manual collection. Change productType to a desk/table clock or Decor > Decorative Objects |
| material-copper | gid://shopify/Collection/512253493300 | TAG = mat-copper | Trieste | gid://shopify/Product/8945874337844 | Pillar Lights | The description says "Built from aluminum and glass". Copper is not mentioned. | Remove tag `mat-copper` |

## Questionable (owner judgment)

| collection handle | collection id | ruleSet | product title | product id | productType | why it's questionable | proposed fix |
|---|---|---|---|---|---|---|---|
| vases | gid://shopify/Collection/316501950516 | manual | Alva Candle Holder | gid://shopify/Product/8897167491124 | Decor > Candle Holders | Its productType is candle holder. The description says it doubles as a bud vase, so it fits both, but it is the only non-vase in Vases. | Owner call. If Vases should hold vases only: remove from manual collection |
| botanicals | gid://shopify/Collection/316501917748 | manual | Doro Vase | gid://shopify/Product/10330853015604 | Decor > Vases | A vase in a plants/planters collection. Every other active item there is a planter. | Remove from manual collection (it is already in vases and ceramic-vases) |
| botanicals | gid://shopify/Collection/316501917748 | manual | Cotto Vase | gid://shopify/Product/10330852917300 | Decor > Vases | Same as Doro Vase | Remove from manual collection |
| candle-holders | gid://shopify/Collection/316934455348 | manual | Amani Soy Candle | gid://shopify/Product/8865057112116 | Decor > Candle Holders | A scented candle, not a holder. It fits home-fragrance, where it already is. | Remove from manual collection. Change productType to a candles type |
| bookshelves | gid://shopify/Collection/316250718260 | manual | Easel | gid://shopify/Product/8892734177332 | Lighting > Bookshelves | A metal picture ledge. It is the only active product in Bookshelves, and its productType wrongly starts with "Lighting >". | Change productType to Shelves & Storage > Floating Shelves (or Wall Shelves). Decide whether a ledge belongs in bookshelves |
| decor | gid://shopify/Collection/316502081588 | TAG = nav-decor | Bergamo Desk Lamp | gid://shopify/Product/8865057701940 | Decor > Table Lamps | A desk lamp sits in the Decor collection and has a "Decor >" productType. It already carries `nav-lamps`. | Remove tag `nav-decor`. Change productType to Lighting > Table Lamps |
| material-crystal | gid://shopify/Collection/320567115828 | TAG = mat-crystal | Boulevard | gid://shopify/Product/8945875451956 | Post Lights | A twin-head outdoor driveway post light. The description does not mention crystal. | Check the images. Probably remove tag `mat-crystal` |
| material-crystal | gid://shopify/Collection/320567115828 | TAG = mat-crystal | Ionia | gid://shopify/Product/8945003298868 | Lighting > Floor Lamps | The description says it is an "iron olive branch form" (sold in sixes for aisles). Crystal is not mentioned. | Check the images. Probably remove tag `mat-crystal` |
| material-copper | gid://shopify/Collection/512253493300 | TAG = mat-copper | Ionia | gid://shopify/Product/8945003298868 | Lighting > Floor Lamps | Described as iron. It carries mat-copper, mat-crystal and mat-iron together. | Check the images. Probably remove tag `mat-copper` |
| material-rattan-bamboo | gid://shopify/Collection/320567246900 | TAG = mat-rattan-woven | Rigging | gid://shopify/Product/8945184964660 | Lighting > String Lights | Hemp rope string lights. Rope is woven but it is not rattan or bamboo. | Owner call. If the collection means rattan/bamboo only: remove tag `mat-rattan-woven` |
| staircase | gid://shopify/Collection/490721411124 | TAG = shop-room-staircase | Fronda | gid://shopify/Product/8945876828212 | Lighting > Ceiling Fans | A ceiling fan in a staircase collection. Fans are rarely sold for stairwells. | Remove tag `shop-room-staircase` |
| staircase | gid://shopify/Collection/490721411124 | TAG = shop-room-staircase | Kairos, Chain, Lattice, Lustro, Lisca, Kittiwake, Kailash, Kasumi, Lisse, Statuario, Lucent, Venezia, Saddle, Calacatta, Lineo (15 items) | 8950865166388, 8950866018356, 8950866706484, 8950867034164, 8950867099700, 8950867755060, 8950869164084, 8950869229620, 8950869590068, 10330853244980, 10330853310516, 10330853376052, 10330853408820, 10330853638196, 10330853703732 | Lighting > Linear Suspension | Linear bars are made for islands and dining tables, not tall stairwells. Some long crystal "rain" bars may be fine. | Review the images. Remove `shop-room-staircase` from the plain linear bars |
| home-office | gid://shopify/Collection/320566624308 | TAG = shop-room-home-office | Tilt, Sorelle, Corsa | 10315341430836, 10315344773172, 10315346018356 | Lighting > Vanity Lights | Bathroom vanity bars in Home Office | Remove tag `shop-room-home-office` |
| kitchen-dining | gid://shopify/Collection/320566526004 | TAG = shop-room-kitchen-dining | Reed, Tuxedo, Serto, Sway, Baton, Savona, Corsa | 10315341889588, 10315343429684, 10315343757364, 10315344478260, 10315345068084, 10315345461300, 10315346018356 | Lighting > Vanity Lights | 7 bathroom vanity bars in Kitchen & Dining. They work over a kitchen sink but are not typical. | Owner call. Probably remove tag `shop-room-kitchen-dining` |
| kitchen | gid://shopify/Collection/490721345588 | TAG = shop-room-kitchen | Rime | gid://shopify/Product/10332491481140 | Lighting > Staircase Chandeliers | A long staircase cascade chandelier in Kitchen | Remove tag `shop-room-kitchen` |
| style-mid-century | gid://shopify/Collection/320566951988 | TAG = shop-style-mid-century | Facet, Corona | 10332493578292, 10332493840436 | Lighting > Crystal Chandeliers | Crystal chandeliers are usually glam or classic, not mid-century | Check the images. Probably remove tag `shop-style-mid-century` |

## Other data-hygiene notes (no collection impact today)

- **Egret** (10332494069812) and **Gemma** (10332492857396) carry `shop-mat-fabric-paper`, but both are metal (and crystal). They are not in material-fabric-paper because its rule uses `mat-fabric`/`mat-paper`. Any filter built on `shop-mat-fabric-paper` would show them wrongly.
- Some productTypes are wrong even where collection membership is fine:
  - Easel is typed "Lighting > Bookshelves".
  - Escallop, Edition, Folio and Fable (archived) are also typed "Lighting > Bookshelves".
  - Augusta Wall Clock is typed "Decor > Decorative Objects".
  - Dischi Candle Plates (archived) is typed "Decor > Wall Mirrors".
- These need a ruling on "genuine and good" rather than on fit:
  - decor (483 members) and accents-objects hold many ARCHIVED Halloween/fall items, which are hidden from the storefront.
  - wall-decor contains 30 LED Wall Art lighting products, which fits the title.
