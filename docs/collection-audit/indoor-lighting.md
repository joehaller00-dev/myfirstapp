# Indoor Lighting collection audit (2026-10-22)

Scope: 44 indoor-lighting category collections. Only ACTIVE products were judged; ARCHIVED/DRAFT were ignored.
Method: listed each collection's active products (title + productType), then checked descriptions and tags (`shop-outdoor`, `nav-outdoor-lighting`, `indoor-lighting`, `shop-indoor`) on anything that looked off. A catalog-wide check of all 878 active products confirmed which collections each one sits in.

Note on tooling: `collectionRemoveProducts` is not exposed by the Shopify MCP's Admin schema. Manual-collection removals were done with
`productUpdate(product:{id, collectionsToLeave:[collectionId]})`. This removes the product from only the listed collection and changes nothing else.
Smart collections were handled with `tagsRemove`. Smart-collection membership updates asynchronously, so it can take a few minutes to show.

Rule applied: an outdoor-only product (productType "Outdoor ...", outdoor tags, no indoor tag, outdoor description) sitting among indoor products in an indoor collection is a misfit.
A collection whose whole active assortment is outdoor was left as it is and flagged (see below). Emptying it would not help.

## Removals from manual collections

| Collection | Product (id) | Action | Reason |
|---|---|---|---|
| chandeliers | Minuet (10311320797236) | removed | "Outdoor Pendants" type: an outdoor pergola/gazebo chandelier with no indoor tags |
| pendants | Minuet (10311320797236) | removed | same |
| chandeliers | Monaco (10311323516980) | removed | "Outdoor Pendants" type: an acrylic-crystal outdoor porch chandelier with no indoor tags |
| pendants | Monaco (10311323516980) | removed | same |
| floor-lamps | Kinross (8945876172852) | removed | "Outdoor Floor Lamps": patio/entry standing lantern |
| floor-lamps | Kailua (10311318700084) | removed | Outdoor Floor Lamps (patio) |
| floor-lamps | Kauai (10311320141876) | removed | Outdoor Floor Lamps (patio) |
| floor-lamps | Lampas (10311320567860) | removed | Outdoor Floor Lamps (solar torchiere) |
| floor-lamps | Loom (10311321059380) | removed | Outdoor Floor Lamps (patio) |
| floor-lamps | Lindos (10311322042420) | removed | Outdoor Floor Lamps (patio) |
| floor-lamps | Lace (10311322796084) | removed | Outdoor Floor Lamps (patio) |
| floor-lamps | Lombok (10311323156532) | removed | Outdoor Floor Lamps (patio) |
| linear-wall-sconces | Sonata (8944896966708) | removed | compact square/round flush LED wall light with adjustable head, not linear (kept in Wall Sconces, LED Wall Sconces, Reading Wall Lamps) |
| up-and-down-wall-sconces | Serata (8944896999476) | removed | single tilting-head wall reading light, not an up/down sconce (kept in Wall Sconces, LED Wall Sconces, Reading Wall Lamps) |

## Tag removals (smart collections)

| Smart collection | Product (id) | Tag removed | Reason |
|---|---|---|---|
| ceiling-light | Minuet (10311320797236) | nav-ceiling-light | outdoor-only chandelier; still in Outdoor Lighting via nav-outdoor-lighting |
| ceiling-light | Monaco (10311323516980) | nav-ceiling-light | outdoor-only chandelier; still in Outdoor Lighting |
| lamps | Kinross, Kailua, Kauai, Lampas, Loom, Lindos, Lace, Lombok (ids above) | nav-lamps | outdoor-only patio floor lamps; still in Outdoor Lighting / Patio & Deck |

## Questionable items, kept (owner decision)

- **novelty-lights**: all 16 active products are outdoor garden novelty lights (Lunaria, Lilypad, Lithos, Kalamos, Karst, Kaze, Linn, Kasbah, Kaya, Lark, Kelp, Kielder, Lantau, Lichen, Kanoko, Larme). The collection fits its products, but it should not sit in the indoor menu. Consider moving it under Outdoor.
- **wall-washer-lights**: all 11 active products are outdoor-tagged (6 wall washers, plus Pinnacle, Meridian, Prow, Minuto, Nave typed "Outdoor Wall Lights"). The collection is effectively outdoor. Minuto (a small up/down cube) is a loose fit.
- **string-lights / fairy-string-lights / led-strip-lights / ambient-lighting**: every string and strip light is outdoor-tagged (Rauland, Rover, Rigging, Riviera, Ruscus, Firefly; Heliotrope, Ionic, Hoshi, Inlay, Hampton, Hideaway, Highline, Hikari, Hillside, Intaglio, Headland). These are usually indoor/outdoor products. Kept. Either confirm they are suitable indoors or move the collections.
- **led-strip-lights / ambient-lighting**: Riga (8945876893748), a "Recessed Lighting" trimless linear downlight for coves/channels. Adjacent to strip lighting.
- **ceiling-light / pendants**: Gourd (10331527381044), "Outdoor Pendants" type but also tagged shop-indoor (rattan pendant/wall light). Kept.
- **ceiling-light / pendants / indoor-lighting**: Cage (8946442862644), a porch-style caged pendant tagged both indoor and outdoor (kitchen/dining tags). Kept.
- **wall-lights / led-wall-sconces / indoor-lighting**: Newport (8866985279540), "Outdoor Wall Lighting" type; its title says "Porch Garden Wall Lamp & Indoor". Kept as dual use.
- **chandeliers / modern-chandeliers / staircase-chandeliers / pendants**: linear-suspension pieces (Kairos, Chain, Lattice, Lustro, Lisca, Kittiwake, Lodge, Fizz, Lindau, Kailash, Kasumi, Loggia, Venezia, Walden). Their descriptions call them LED/linear chandeliers. Acceptable.
- **flush-mount-lighting**: Rocio (10332491710516), a crystal-strand staircase chandelier. Check whether it is truly a flush/close-to-ceiling fitting. Also Rivoli and Ryo are semi-flush/recessed, and Azalea, Brezza, Blanche, Ferris are ceiling fans with lights. All kept.
- **semi-flush-mount-lighting**: Ryo (8896010551348) is described as a *recessed* trimless twin spotlight but has productType "Semi-Flush Mount Lights". Likely mistyped. Kept pending a recessed collection or a type fix.
- **linear-wall-sconces**: Ruota (8846459043892), a rotatable bedside reading wall lamp. Its shape is not described as linear. Picture lights Palo and Orsa are bar-shaped and fine.
- **down-light-wall-sconces**: Piston (8895495110708), a plug-in sconce with a rotating head (aimable down). Kept.
- **led-wall-art / ambient-lighting**: Robin (bird-silhouette wall lamp), Pillow (cloud wall light) and Palma (moon sconce) are decorative wall lights, not wall art strictly. Kept.
- **wall-sconces / bedside-lamps / wall-lights**: Dagny (8868260905012), typed "Bedside Lamps" but it is a bedside *wall* lamp. Fits both.
- **ambient-novelty-lamps / night-lights / table-lamps**: Scrivo (10331524038708), a writable acrylic LED message lamp. Fits all three.
- **table-lamps / lamps**: Bergamo Desk Lamp (8865057701940), productType "Decor > Table Lamps". The product fits, but the type should be "Lighting > Table Lamps".
- **sunset-lamps**: has 0 active products (all 11 are archived/draft), so the collection is empty on the storefront.
- **floor-lamps**: the 8 removed outdoor floor lamps no longer have a dedicated floor-lamp collection. Consider an "Outdoor Floor Lamps" collection.

## Collections reviewed with no issues
table-lamps, bedside-lamps, rechargeable-lamps, mushroom-lamps, ambient-novelty-lamps, night-lights, reading-floor-lamps, decorative-floor-lamps, wall-sconces, swing-arm-sconces, plug-in-sconces, mirror-lights, picture-lights, reading-wall-lamps, uplight-wall-sconces, diffused-light-wall-sconces, led-wall-sconces, vanity-lighting, modern-chandeliers, crystal-chandeliers, candle-chandeliers, staircase-chandeliers, linear-suspension, ceiling-fans, indoor-lighting (smart), wall-lights (smart).
**lighting** (1538 products): no active product with a non-lighting type (no decor items). 47 active items carry legacy types without the "Lighting >" prefix (e.g. "Pillar Lights", "Outdoor Wall Lights", "Ceiling Fans", "LED Wall Art"). They are all genuine lights. Their types could be normalised.
No decor or vase items were found in any indoor-lighting collection among active products.
