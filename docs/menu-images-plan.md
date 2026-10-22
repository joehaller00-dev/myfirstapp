# Phone menu and collection images: plan

Owner request (2026-10-22): "put a lot prettier images for every single option ... all the hero images, absolute beauties. I just really want it to be satisfying to click." The menu photos should also load faster and more smoothly.

Theme: **PREVIEW v7** (`gid://shopify/OnlineStoreTheme/187544633396`, unpublished). Nothing has been uploaded or changed in the store. The files under `theme-full/` are ready to upload. Each changed file sits next to a `.orig` copy of the live version, taken on 2026-10-22 (MD5 values are listed in section 5).

The photos were chosen from file names, alt text, media position and image size only. The CDN is blocked from the sandbox, so **nobody has looked at these images yet**. Check them on the preview before publishing (section 6).

---

## 1. Where the phone menu photos come from today

The phone drawer is `#sidebar-menu` (the Prestige theme's header sidebar). It is decorated by **`assets/nf-drawer-v2.js`**, which `snippets/header-sidebar.liquid` loads with `defer` together with `assets/nf-drawer-v2.css`.

| Drawer element | Size on a phone | Image source (in the order it is tried) |
|---|---|---|
| **4 quick tiles** (Best Sellers, New Arrivals, Shop By, Sale) | 2-column, about 165x86 px | Hard-coded `TILE` URLs in `buildTiles()` in `nf-drawer-v2.js`: Thicket rustic dining, Ginkgo leaf chandelier, Forge vaulted living room, Lunette poolside. They were requested with `w: 520` **CSS** px, so a 3x phone downloaded **1200 px** files. |
| **First-level rows** (Shop All, Indoor, Outdoor, Decor, Inspirations, plus the top-bar "More to explore" rows) with a 48 px thumbnail | 48x48 | `imgFor()`: first the `IMG` hard-codes (`grand collection`, `autumn at home`, `new arrivals`). Then `MAP` from **`#nfd-img-map`**, which **`snippets/nf-menu-img-map.liquid`** (`depth:'top'`) prints into every page from header-sidebar. That map gives `collection.featured_image` for `/collections/x` links (the collection image, or else its first product's image). Pages borrow a collection through `page_map`, and headings through `title_map` (`t:<title>` keys). After that come the desktop dropdown photos copied by `harvest()` (a phone never has them) and the `PIC` map. |
| **Sub-panel hero** (16:10 banner at the top of Indoor, Outdoor, Chandeliers and so on) | about 340 px wide | `heroFor(href)` reads **`#nfd-hero-map`**, printed inline by `header-sidebar.liquid` (NF-DRAWER-V3). It holds `collection.image` at 900w plus the `custom.nf_band_pos` metafield. Handles in `nfd_skip` are left out: best-sellers, ceiling-light, wall-lights, lamps, ambient-lighting, outdoor-lighting, outdoor-wall-lights, decor, soft-furnishings, storage-shelves, poufs-floor-cushions, home-fragrance and sale. The `nfd_force` borrowings apply, and the two pages professionals and custom-lighting get photos. Without an entry, the code falls back to `imgFor()`, then to the first row photo. |
| **Sub-panel rows**: thumbnails, or a 2-column 4:3 photo grid when there are 4 or more link rows that all have photos | 48 px / about 160 px | `mapFor()` reads **`#nfd-img-map-all`** (`nf-menu-img-map`, `depth:'all'`). That map arrives inside **`sections/nf-menus-drawer.liquid`**, which **`assets/nf-menus.js`** fetches through the Section Rendering API (`/?section_id=nf-menus-drawer`) as soon as the page is parsed and caches in sessionStorage. Source again: `collection.featured_image`. |
| Desktop mega menu figures | n/a on phones | `snippets/mega-menu-images.liquid`, from block settings. Not part of this change. |

The menus are `main-menu-v3` (the drawer) plus the `top-bar` first level.

**Summary:** apart from the 4 tiles and 3 hard-coded rows, every menu photo is **`collection.image`**, or the collection's first product image when it has none. Many collection images are white-background PNG cut-outs (`image_1787…png`, `97_…png`, `143_…png`, `Untitled_design…png`) or supplier codes such as `X_1_…jpg`. That is why the menu looks flat.

### Collection pages

- `templates/collection.json`, `collection.decor.json` and `collection.room-sets.json` start with **`sections/nf-coll-mod.liquid`**. It has no per-collection hero. Its photo strip shows one tile per sub-collection, using `c.image | default: c.featured_image` at 240/400/600w. These tiles are the per-collection images a shopper sees there.
- **`sections/nf-coll-banner.liquid`** is the thin banner under the trust icons. It uses a fixed section-setting image per template: `nf-banner-crystal-pendants.jpg` (default and lighting), `hero_decor.webp` (decor) and `nf-pro-hub.jpg` (room sets). It is not per collection.
- **`sections/nf-collection-head.liquid`** is the large band hero. It is enabled only in `collection.lighting-collection.json` (disabled elsewhere). Its image is the section setting, else `collection.image`, else the first product image, positioned by `custom.nf_band_pos`.
- `sections/collection-banner.liquid` is disabled in every template. It would use `collection.image`.

---

## 2. Approach

1. **New `snippets/nf-menu-picks.liquid`**: one line of `key=files/<file>` pairs. The key is a collection handle, or a page path for Inspirations. It covers 85 hand-picked photos, all **from the store's own active products** (no AI, no Files uploads, no white cut-outs, no spec or "pillar" infographics, no review overlays). The other files read it with `capture`/`render` and split it, so changing a photo means editing one line.
2. `nf-menu-img-map.liquid` (rows and thumbnails), the `#nfd-hero-map` block in `header-sidebar.liquid` (panel heroes, which now override `nfd_skip` as well) and `nf-coll-mod.liquid` (collection-page tiles) all **prefer the pick**. Without a pick they fall back to exactly what they do today.
3. Best Sellers, New Arrivals and Sale tiles read the same map, so the tile and its collection page match. Shop By keeps the owner-approved Forge vaulted living room.
4. Photos are served **same origin** as `/cdn/shop/files/<file>?width=N`. That is the path `image_url` produces today; the hard-coded links used `cdn.shopify.com` instead, which costs a second DNS and TLS connection on phones.

How photos were picked: each collection's products sorted BEST_SELLING. Many best sellers are archived `nf-*` imports, so active products were also queried with `collection_id:… status:ACTIVE`. Media were scored on scene words in the file name and alt text (living-room, dining, foyer, garden, pathway, dusk, night, glow, poolside, porch …). Points were taken off for `-pillar.jpg` / "energy efficiency" infographics, `-callout`, `overlay_` review images, `nf-white-…` cut-outs, size and variant shots, opaque hash names and PNGs. Images 2048 px or larger and earlier media positions scored higher. The best scorers were then assigned by hand, with **no photo used twice**, so neighbouring rows look different.

---

## 3. Proposed photo for every menu item

The URLs are the product media originals; the theme requests them as `/cdn/shop/files/<file>?width=N`. "#" is the media position on the product page, counting from 1.

| # | Menu item | key | Current (collection.image) | Proposed (product, media position, URL) | Why |
|---|---|---|---|---|---|
| 1 | Sale tile + Sale row/hero | `sale` | `underground-fixture-stone-ceiling-uplight.jpg` | **Nimbus** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/cloud-pendant-lights-cream-living-room.jpg | scene: living-room; alt "Three White Cloud Pendant Lights over a cream living ro"; 2048x2048 |
| 2 | Best Sellers tile + row | `best-sellers` | `contemporary-brass-branch-chandelier-living-ro` | **Cirrus** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/cascading-ring-staircase-chandelier-grand-foyer.jpg | scene: foyer, staircase; alt "Cascading Ring Staircase Chandelier glowing in a grand "; 2048x2048 |
| 3 | New Arrivals tile + row | `new-arrivals` | `rustic-wood-cage-linear-chandelier-1.jpg` | **Rhapsody** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/butterfly-chandelier-double-height-living-room.jpg | scene: living-room; alt "Glowing Butterfly Staircase Chandelier, Gold Iron and A"; 1080x1080 |
| 4 | Shop All row | `shop-all` | `(borrowed / hard-coded)` | **Chandra** (#6) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/full-moon-wall-lamp-above-bed.jpg | scene: above-bed; alt "Full Moon Wall Lamp glowing above a bed"; 2048x2048 |
| 5 | Indoor row + hero | `indoor-lighting` | `twisted-ribbon-led-pendant-light-5.jpg` | **Grange** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/elegant-organic-stick-chandelier-modern-dining-room-intricate-sophistication.jpg | scene: dining; alt "Chandelier over a modern dining room table"; 1000x1000 |
| 6 | Outdoor row + hero | `outdoor-lighting` | `reed-lights-garden-pathway-warm-glow-dusk.jpg` | **Lombok** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/luxury-outdoor-seating-dusk-silver-metal-table-lamp.jpg | scene: dusk; alt "Woven Shade Patio Floor Lamp, Black Steel Outdoor Floor"; 4320x4320 |
| 7 | Decor row + hero | `decor` | `nf-tile-decor.jpg` | **Icarus** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/feather-led-wall-lamp-golden-elegant-modern-living-room.jpg | scene: living-room; alt "Gilded Feather Wall Light, White Resin LED Wall Art Sco"; 1080x1080 |
| 8 | Inspirations row (page) | `/pages/inspiration` | `(borrowed / hard-coded)` | **Regalia** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/italian-style-chandelier-luxurious-living-room-large-windows-plants.jpg | scene: living-room; alt "Crystal Halo Staircase Chandelier, Titanium Gold Duplex"; 1080x1080 |
| 9 | Indoor > Chandeliers | `chandeliers` | `nf_chandeliers_mega_53681663-6972-4f69-8767-16` | **Belvedere** (#7) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/gold-rectangular-chandelier-crystal-warm-luxurious-living-room.jpg | scene: living-room; alt "Gold Rectangular Crystal Chandelier, Linear Island Ceil"; 1020x1020 |
| 10 | Indoor > Ceiling Lights | `ceiling-light` | `nf_chandelier_dining_ac6d9ab2-5aa4-4b6d-9026-2` | **Ellipse** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/black-led-ring-chandelier-bright-living-room-fireplace.jpg | scene: living-room, fireplace; 1000x1000 |
| 11 | Indoor > Pendant Lights | `pendants` | `mini-crystal-pendant-lights-modern-kitchen-isl` | **Lucciola** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/firefly-pendant-light-over-dining-table.jpg | scene: dining; alt "Firefly Branch Chandelier, Gold Metal Modern Ceiling Li"; 1080x1080 |
| 12 | Indoor > Wall Lights & Sconces | `wall-lights` | `cone-wall-light-stone-bedroom.webp` | **Spindle** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/spiral-wall-sconce-modern-living-room-warm-ambient-glow.jpg | scene: glow, living-room; alt "Twist Spiral Wall Sconce, Black and White Metal Wall Li"; 1080x1080 |
| 13 | Indoor > Floor & Table Lamps | `lamps` | `bedroom-focused-task-pendant.jpg` | **Obelisk** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/linear-floor-lamp-cozy-modern-living-room-warm-ambient-glow.jpg | scene: glow, living-room; alt "Slim Column Floor Lamp, Black or White LED Accent Light"; 1080x1080 |
| 14 | Outdoor > Wall Lights | `outdoor-wall-lights` | `outdoor-black-sconce-vintage-design-soft-glow-` | **Reeded** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/reeded-glass-wall-sconce-limestone-dusk.jpg | scene: dusk, limestone, stone; 2048x2048 |
| 15 | Outdoor > Post & Path Lights | `outdoor-post-lights` | `pair-moon-shaped-stone-pillar-lights-modern-ho` | **Orrery** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/marble-globe-pillar-lights-modern-garden-pathway-dusk.jpg | scene: dusk, garden, pathway; alt "Planet Glass Globe Pillar Light, Die Cast Aluminum Post"; 1020x1020 |
| 16 | Outdoor > Solar & Landscape | `landscape-lighting` | `6_0524e462-5fcd-4fec-ab65-b2b436981854.jpg` | **Larme** (#6) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/vibrant-modern-teardrop-outdoor-light-glowing-garden-night.jpg | scene: night, glow, garden; alt "Teardrop Glow Outdoor Floor Lamp, White Sculptural Land"; 1080x1080 |
| 17 | Decor > Wall Decor | `wall-decor` | `S5f3db042027a4eb2a411f8ef0d4dfa88V.webp` | **Caliza Wall Clock** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/travertine-stone-wall-clock-with-warm-led-backlight-round.jpg | scene: stone; alt "Travertine Stone Wall Clock with Warm LED Backlight, Ro"; 2048x2048 |
| 18 | Shop By > Room Sets | `room-sets` | `nf-rs2-aurelia-kitchen.jpg` | **Selene Garden Set** (#4) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/moon-shaped-pillar-light-pool-terrace-dusk_b701aeb3-2ab5-4051-9f66-df0f9f1cb45f.jpg | scene: dusk, pool; 2048x2048 |
| 19 | Modern Chandeliers | `modern-chandeliers` | `criss-linear-chandelier-living-room.jpg` | **Calloway** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/luxurious-modern-glass-ball-chandelier-gold-frame-round-dining-table.jpg | scene: dining; alt "Copper frame above a round table"; 1080x1080 |
| 20 | Crystal Chandeliers | `crystal-chandeliers` | `ceramic-crystal-led-chandelier-living-room.jpg` | **Isolde** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-led-dimmable-dining-room-crystal-chandelier-roundrectangle-283003.jpg | scene: dining; alt "Chandelier lit above a dining table"; 1000x1000 |
| 21 | Staircase Chandeliers | `staircase-chandeliers` | `large-gold-chandelier-dramatic-contemporary-gr` | **Rosace** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-crystal-chandelier-pendant-lighting-living-room.jpg | scene: living-room, staircase; alt "Crystal Flower Ball Staircase Chandelier, Gold Iron Lon"; 1080x1080 |
| 22 | Candle Chandeliers | `candle-chandeliers` | `2_4682f222-f516-4ebd-802c-1408d900d2c9.jpg` | **Juliette** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/classic-six-arm-central-sphere-modern-gold-and-crystal-chandeliers-dining-room.jpg | scene: dining; alt "Crystal Crescent Candle Chandelier, Gold Metal French C"; 1080x1080 |
| 23 | Linear Chandeliers / Linear Pendants | `linear-suspension` | `halo-rings-wood-led-linear-pendant-2.jpg` | **Lunula** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/c-shape-pendant-light-office-lobby-reception.webp | scene: office, lobby; alt "Set of 2 Crescent Arc Pendant Lights, Black Iron Linear"; 1080x1080 |
| 24 | Flush Mount | `flush-mount-lighting` | `multi-bladed-modern-rustic-tangled-flush-mount` | **Rondelle** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/luxury-bedroom-multi-ring-ceiling-lights.jpg | scene: bedroom; alt "Overlapping Rings LED Ceiling Light, Acrylic Semi Flush"; 1080x1080 |
| 25 | Semi-Flush Mount | `semi-flush-mount-lighting` | `image_1786137842878_130b7db1_1786137843261_cc7` | **Rondelle** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-living-room-multi-ring-ceiling-lights.jpg | scene: living-room; alt "Overlapping Rings LED Ceiling Light, Acrylic Semi Flush"; 1080x1080 |
| 26 | Ceiling Fan Lights | `ceiling-fans` | `5-blade-fan-light-textured-bedroom.jpg` | **Eolia** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-dual-head-ceiling-fans-led-living-room.jpg | scene: living-room; alt "Bladeless Ceiling Fan Light, Black and Gold Acrylic LED"; 1080x1080 |
| 27 | Kitchen Island Pendants / Kitchen | `kitchen` | `halo-rings-wood-led-linear-pendant-2_33050972-` | **Swell** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/curved-wave-pendant-light-marble-kitchen-island.jpg | scene: kitchen; alt "Curved Wave Pendant Light glowing over a marble kitchen"; 2048x2048 |
| 28 | Staircase Pendants / Staircase | `staircase` | `contemporary-stairs-chandelier-interior_57703e` | **Rowan** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/crystal-staircase-chandelier-luxurious-foyer-ambient.jpg | scene: foyer, staircase; alt "Twig Copper Crystal Staircase Chandelier, Warm Gold Lon"; 1080x1080 |
| 29 | Wall Sconces | `wall-sconces` | `modern-brass-wall-sconce-contemporary-bedroom-` | **Stromboli** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-chrome-wall-sconce-round-cozy-living-room.jpg | scene: living-room; alt "Lava Glass Disc Wall Sconce, Polished Metal Accent Ligh"; 1080x1080 |
| 30 | Vanity Lights | `vanity-lighting` | `image_1786137036449_c4156697_1786137037301_b5c` | **Baton** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/contemporary-vanity-light-bar-modern-marble-bathroom-warm-elegant-glow.jpg | scene: glow, bathroom; alt "Slender Rod Vanity Light, Black and Gold LED Bath Bar"; 1080x1080 |
| 31 | Picture & Mirror Lights | `picture-lights` | `modern-led-rotatable-vanity-light-bar-for-dres` | **Streak** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-linear-wall-sconces-living-room-painting.jpg | scene: living-room, painting; alt "Two Modern Linear Wall Sconces flanking a painting abov"; 2048x2048 |
| 32 | LED Wall Sconces | `led-wall-sconces` | `flush-mount-adjustable-reading-wall-light-2.jp` | **Rudi** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/led-wall-reading-light-modern-bedroom-wall-lamp.jpg | scene: bedroom; alt "Bedside Reading Wall Light, Metal Adjustable Spot Sconc"; 1080x1080 |
| 33 | Swing Arm Sconces | `swing-arm-sconces` | `cone-shade-swing-arm-wall-sconce-2.jpg` | **Sogno** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/bedroom-swing-arm-wall-sconce-1.jpg | scene: bedroom; alt "Bedroom Swing Arm Wall Sconce"; 1080x1080 |
| 34 | Table Lamps | `table-lamps` | `S9ce2a97b45ed4f4e90442fe247c41a69n.webp` | **Sylvan** (#7) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/square-wood-lamp-cozy-bedside-table-warm-natural-glow.jpg | scene: glow; 1080x1080 |
| 35 | Floor Lamps | `floor-lamps` | `X_1_33480f59-f3f5-4aed-8163-7cfc20731408.jpg` | **Girder** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/reading-floor-lamps-living-room-gray-sofa-ambient.jpg | scene: living-room; 1080x1080 |
| 36 | Rechargeable Lamps | `rechargeable-lamps` | `Se410352baced438091e617d61f761dedH.webp` | **Sylvan** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/square-wood-lamp-bedroom-nightstand.webp | scene: night, bedroom, nightstand; alt "Wood Grain Accent Table Lamp, Rechargeable LED Bedside "; 1080x1080 |
| 37 | Ambient & Novelty | `ambient-lighting` | `feather-wall-light-warm-white-wood-wall-living` | **Heian** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/bird-wall-light-modern-living-room-gray-sofa-decorative-plants.jpg | scene: living-room; alt "Origami Crane Bird Light, White Paper Fold LED Wall Sco"; 1080x1080 |
| 38 | LED Strip Lights | `led-strip-lights` | `X_1_4b78bbd2-0693-411e-993b-abb0e8845d5f.jpg` | **Riga** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/led-linear-downlight-living-room-ceiling.webp | scene: living-room; alt "Trimless Linear Downlight, Recessed Magnetic LED Profil"; 1080x1080 |
| 39 | Indoor Best Sellers | `best-sellers-indoor` | `modern-linear-wall-sconce-wood-accent-wall.web` | **Filo** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/ultra-thin-linear-wall-lights-above-bed-oak-wall.jpg | scene: above-bed; alt "Two Ultra Thin Linear Wall Lights on an oak wall above "; 2048x2048 |
| 40 | Outdoor Wall Sconces | `outdoor-wall-sconces` | `modern-globe-wall-sconce-black-doorway-stylish` | **Sentry** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/rectangular-wall-light-navy-door-white-clapboard-porch.jpg | scene: porch; alt "Rectangular Wall Light above a navy front door on a whi"; 2048x2048 |
| 41 | Motion Sensor Wall Lights | `motion-sensor-wall-lights` | `solar-light-outdoor-wall-front-door-porch.jpg` | **Klara** (#7) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/solar-powered-motion-sensor-wall-light-modern-house-entrance-dusk.jpg | scene: dusk, entrance; 1080x1080 |
| 42 | Post Lights | `post-lights` | `modern-outdoor-wall-pillar-lights-balcony-sett` | **Quentin** (#6) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/garden-pathway-street-light-pillar-night.jpg | scene: night, garden, pathway; alt "Lantern Pillar Light, Die Cast Aluminum Fence Post Cap "; 1080x1080 |
| 43 | Pillar Lights | `pillar-lights` | `square-outdoor-pillar-lights-stone-column-exte` | **Quadra** (#8) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/cube-pillar-light-stone-garden-wall.jpg | scene: garden, stone; alt "Cube Pillar Light on a stone garden wall at twilight"; 2048x2048 |
| 44 | Bollard Lights | `bollard-lights` | `modern-round-outdoor-post-light-black-waterpro` | **Cabana** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/decorative-bollards-with-lights-lounge-poolside.jpg | scene: pool, lounge; alt "Glass Box Bollard Light, Black Stainless Steel Pool Dec"; 1080x1080 |
| 45 | Path Lights | `path-lights` | `2_365244a7-0909-4a59-a36b-31a41a611c41.jpg` | **Pastorale** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/elegant-path-lighting-outdoor-garden-bed-dusk-illumination.jpg | scene: dusk, garden; alt "Shepherd Hook Lantern Path Light, Antique Copper Garden"; 1080x1080 |
| 46 | Outdoor Spotlights | `outdoor-spotlights` | `linear-led-wall-washer-modern-stone-entry-wall` | **Vireo** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/solar-lawn-spotlight-white-hydrangeas.jpg | scene: hydrangeas; alt "Solar Lawn Spotlight lighting white hydrangeas in a gar"; 2048x2048 |
| 47 | Step & Deck Lights | `step-deck-lights` | `outdoor-stair-lighting-strips-modern-home-step` | **Ravine** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/waterproof-solar-deck-lights-modern-poolside-dusk.jpg | scene: dusk, pool; alt "Tapered Trapezoid Solar Deck Light, Modern Landscape Pa"; 1080x1080 |
| 48 | Porch & Entry | `porch-entry` | `black-outdoor-sconce-light-grid-gray-stone-wal` | **Paxton** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-outdoor-pillar-lights-luxury-home-entrance.webp | scene: entrance; alt "Square Lantern Pillar Light, Black Die Cast Aluminum Po"; 1080x1080 |
| 49 | Patio & Deck | `patio-deck` | `led-solar-lanterns-outdoor-warm-illumination-c` | **Lindos** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/stylish-outdoor-patio-floor-lamps-chic-lounge-dusk-illumination.jpg | scene: dusk, patio, lounge; alt "Crossed Frame Patio Floor Lamp, Black Copper Outdoor Fl"; 1080x1080 |
| 50 | Garden & Pathway | `garden-pathway` | `4_da8e10d2-12d0-4710-9719-8ba387fadd9a.jpg` | **Porcini** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/mushroom-path-lights-illuminating-garden-pathway-dusk-greenery.jpg | scene: dusk, garden, pathway; alt "Mushroom Path Light, Wide Cap Aluminum Landscape Light"; 1080x1080 |
| 51 | Driveway & Security | `driveway-security` | `contemporary-outdoor-wall-light-covered-porch-` | **Palatino** (#8) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/led-marble-bollard-light-warm-illumination-curved-driveway.jpg | scene: driveway; alt "Patterned Marble Lamp Post, Vintage Stainless Steel Pos"; 1080x1080 |
| 52 | Outdoor Lanterns | `outdoor-lanterns` | `S860dae0cd1044ae699ab6a59b9e2079fi.webp` | **Mooring** (#8) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/warm-inviting-glow-stone-patio-outdoor-led-lantern-night.jpg | scene: night, glow, patio, stone; alt "Woven Rope Lantern, Stainless Steel Frame Outdoor Floor"; 1080x1080 |
| 53 | Outdoor String Lights | `outdoor-string-lights` | `led-globe-string-lights-wooden-fence.jpg` | **Riviera** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/led-globe-string-lights-pergola-backyard-dining.jpg | scene: dining, pergola; alt "Globe String Lights, Multi Power Outdoor Patio and Perg"; 1080x1080 |
| 54 | Outdoor LED Strip Lights | `outdoor-led-strip-lights` | `outdoor-stair-lighting-strips-patio-seating-st` | **Hikari** (#8) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/outdoor-stair-lighting-strips-modern-staircase-edges-warm-ambient-glow.jpg | scene: glow, staircase; 1020x1020 |
| 55 | Outdoor Best Sellers | `best-sellers-outdoor` | `outdoor-embedded-led-light-strips-stone-steps.` | **Yukon** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/ice-cube-step-light-warm-white-limestone-steps.jpg | scene: limestone, stone; alt "Warm white Ice Cube Step Lights glowing on limestone ga"; 2048x2048 |
| 56 | LED Wall Art | `led-wall-art` | `feather-wall-light-warm-white-wood-wall-living` | **Inara** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/moon-wall-lamp-cozy-living-room-corner-warm-ambient-glow.jpg | scene: glow, living-room; alt "Crescent Moon Wall Light, Sandstone LED Wall Art Panel"; 1080x1080 |
| 57 | Outdoor Room Sets | `outdoor-room-sets` | `nf-rs2-cadence-front-entry.jpg` | **Selene Garden Set** (#3) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/moon-shaped-pillar-light-infinity-pool-sunset_29231109-f1f3-4160-b4ae-796f659fd117.jpg | scene: sunset, pool; 2048x2048 |
| 58 | Home Room Sets | `homes-room-sets` | `nf-rs2-nordhaven-dining.jpg` | **Golden Hour Entry Set** (#4) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-crystal-chandelier-golden-elegant-hallway_e10f0e73-ccd8-4a57-a75d-d788bed5e287.jpg | scene: hallway, staircase; 1000x1000 |
| 59 | Hospitality Room Sets | `hospitality-room-sets` | `9_7ed767cb-d6ca-471f-99a1-d8a6905c313b.jpg` | **Isla Terrace Restaurant Set** (#3) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/three-rattan-outdoor-pendant-lights-patio-dining-set_f2757f10-cc5b-45fe-84b9-6666a8f32402.jpg | scene: dining, patio; 1080x1080 |
| 60 | Living Room | `living-room` | `mid-century-chrome-retro-chandeliers-green-sof` | **Margaux** (#6) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/soft-ambient-living-room-velvet-sofa-french-style-chandelier-scrolling.jpg | scene: living-room; alt "Draped Bead French Candle Chandelier, Black Metal Ceili"; 1080x1080 |
| 61 | Dining Room | `dining-room` | `gold-large-chandelier-crystals-dining-room.jpg` | **Egret** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/crystal-gold-led-chandelier-dining-room.jpg | scene: dining; alt "Crystal Plume Chandelier, Gold Iron French Ceiling Ligh"; 1080x1080 |
| 62 | Bedroom | `bedroom` | `scalloped-wall-sconce-bedside-nightstand.webp` | **Beaumont** (#7) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/midcentury-modern-chandelier-elegant-bedroom-upholstered-bed.jpg | scene: bedroom; alt "Chandelier above an upholstered bed"; 1080x1080 |
| 63 | Bathroom | `bathroom` | `image_1787960616368_b9218e10_1787960616426_499` | **Rotary** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/vanity-led-lights-for-mirror-warm-minimalist-bathroom-sink.jpg | scene: bathroom; 1080x1080 |
| 64 | Home Office | `home-office` | `image_1786137489722_07a6533c_1786137490341_46d` | **Lunula** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/c-shape-pendant-light-office-hallway.jpg | scene: hallway, office; alt "Set of 2 Crescent Arc Pendant Lights, Black Iron Linear"; 1080x1080 |
| 65 | Entryway & Hallway | `entryway-hallway` | `retro-wall-sconce-living-room-pair.webp` | **Rosalie** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-crystal-chandelier-cascading-dark-wall-modern-living.jpg | scene: staircase; alt "Crystal Petal Rod Staircase Chandelier, Linear Gold Lon"; 1080x1080 |
| 66 | Golden Hour | `golden-hour-collection` | `97_a3358920-40ac-43d5-9781-2387c9b315a0.png` | **Rocca** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-crystal-chandelier-golden-modern-dining-table.jpg | scene: dining, staircase; alt "Crystal Cube Spiral Staircase Chandelier, Copper Long D"; 1080x1080 |
| 67 | Isla | `isla-collection` | `modern-rattan-pendant-light-covered-patio.jpg` | **Wicklow** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/outdoor-rattan-lanterns-poolside-deck-warm-glow-dusk.jpg | scene: dusk, glow, pool; alt "Woven Rattan Solar Lantern, Brown Portable Outdoor Gard"; 1080x1080 |
| 68 | Modern | `style-modern` | `lava-ripple-pendant-cord.jpg` | **Yaletown** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/skyline-linear-led-lighting-living-room-fireplace.webp | scene: living-room, fireplace; alt "Skyline Linear Wall Light, Rotatable Slim Steel Bar Sco"; 1080x1080 |
| 69 | Minimalist | `style-minimalist` | `tall-linear-outdoor-wall-sconce-textured-stone` | **Tess** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/3_1eff7f5e-fc88-47b4-94f4-34d59db36db5.jpg | in-room shot; alt "Chandelier lit in a living room"; 1000x1000 |
| 70 | Scandinavian & Japandi | `style-scandinavian-japandi` | `linear-led-wall-light-bedside-wood-accent-wall` | **Droplet** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/contemporary-mini-pendant-lights-open-plan-dining-kitchen.jpg | scene: dining, kitchen; alt "Teardrop Mini Pendant Light, Metal and Acrylic Kitchen "; 1080x1080 |
| 71 | Glam | `style-glam` | `1_6ce16c6d-fc5f-4ce2-8c94-6a71ac5a6615.jpg` | **Versailles** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/french-chandelier-vintage-inspired-lighting-for-dining-room-and-entryway.jpg | scene: dining; alt "Chandelier in a dining room and entryway"; 983x1080 |
| 72 | Vintage & Classic | `style-vintage-classic` | `peacock-wall-light-ornate-fan-backplate-exteri` | **Laurel** (#6) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/country-french-chandelier-rustic-elegant-ceiling-light-for-dining-room.jpg | scene: dining; alt "Country French Leaf Crystal Chandelier, Champagne Gold "; 1080x1080 |
| 73 | Industrial | `style-industrial` | `Sb66fe444a5da426cb401f3b65b36cdbau.webp` | **Mirabelle** (#7) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/black-candlestick-lantern-patio-table-sunset-cozy-garden.jpg | scene: sunset, garden, patio; alt "Solar Candle Lantern, Black Portable Hanging Garden Lan"; 1080x1080 |
| 74 | Halo Collection | `halo-collection` | `cascading-ring-staircase-chandelier-grand-foye` | **Hoop** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/ring-staircase-pendant-light-modern-spiral-wooden-steps-elegant.jpg | scene: staircase; alt "Floating Ring Staircase Chandelier, Gold Aluminum Long "; 1080x1080 |
| 75 | Bolla Collection | `bolla-collection` | `143_4436cb4c-0da8-4ead-9f04-58dadb45b361.png` | **Gibbous** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/opal-glass-globe-chandelier-modern-cozy-living-room-sofa.jpg | scene: living-room; alt "Opal glass globe chandelier in a living room"; 1080x1080 |
| 76 | Ondine Collection | `ondine-collection` | `brass-flow-wave-led-linear-pendant-1.jpg` | **Shoreline** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-curved-wall-sconce-living-room.jpg | scene: living-room; alt "Wave Curve Wall Sconce, Black Aluminum Linear Light"; 1080x1080 |
| 77 | Ironworks Collection | `ironworks-collection` | `N_LI001746.jpg` | **Barnes** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/vintage-barn-wall-sconce-edison-bulb-stone-wall.jpg | scene: stone; alt "Vintage Barn Wall Sconce with a glowing Edison bulb on "; 2048x2048 |
| 78 | Kumo Collection | `kumo-collection` | `S32b4137fa7dd451da0365dd82ae2e941g.webp` | **Nimbus** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/rounded-cloud-pendant-light-warm-led-living-room.jpg | scene: living-room; 1080x1080 |
| 79 | Linea Collection | `linea-collection` | `modern-linear-wall-sconces-living-room-paintin` | **Tandem** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-vertical-tube-wall-sconce-living-room.jpg | scene: living-room; alt "Twin Tube Wall Sconce, Black Gold or Copper Linear Ligh"; 1080x1080 |
| 80 | Shop by Room > Hospitality (top bar) | `hospitality` | `97_eaff6145-d7f1-4c09-a074-e70b8417f552.png` | **Cascata** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/sophisticated-tiered-glass-chandelier-living-room.jpg | scene: living-room; alt "Crystal Waterfall Tiered Chandelier, Gold Metal Ceiling"; 1080x1080 |
| 81 | Shop by Material > Wood (top bar) | `material-wood` | `image_1787879214207_959d8db3_1787879214283_8b9` | **Grain** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/wood-bathroom-vanity-light-round-mirror.jpg | scene: bathroom; alt "Rotating Wood Vanity Light, Oak or Walnut LED Bath Bar"; 1020x1020 |
| 82 | Hospitality Lighting (pro) | `hospitality-lighting` | `clear-glass-pendant-lighting-cafe-setting.jpg` | **Gem** (#1) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/mini-crystal-pendant-lights-sage-green-kitchen.jpg | scene: kitchen; alt "Three Mini Crystal Pendant Lights over a marble table i"; 2048x2048 |
| 83 | Retail Lighting (pro) | `retail-lighting` | `surface-mounted-adjustable-spotlight-walk-in-c` | **Parallel** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/tall-vertical-wall-light-classic-living-room-fireplace.jpg | scene: living-room, fireplace; 1080x1080 |
| 84 | Outdoor Project Lighting (pro) | `outdoor-project-lighting` | `outdoor-ice-cube-lights-garden-border.jpg` | **Kinross** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/outdoor-standing-lights-patio-pool-dusk.webp | scene: dusk, pool, patio; 1080x1080 |
| 85 | Office Lighting (pro) | `office-lighting` | `round-office-pendant-light-black-6000k.jpg` | **Ripple** (#2) https://cdn.shopify.com/s/files/1/0750/8380/8820/files/wave-hanging-light-modern-dining-room.jpg | scene: dining; alt "Wave Hanging Light, Modern Aluminum LED Linear Suspensi"; 1080x1080 |
### Items that keep their current photo (50)

These were left alone for one of three reasons: the current collection image is already a good room photo; no active product has a recognisable scene photo (the decor and soft-goods supplier images have hash names such as `S96e54…webp`, so they need someone to look at them); or the collection is empty or a draft:

- `accents-objects`: keeps `image_1787879007678_4a41e8c6_1787879007733_b98ac38a.png` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `ashford-collection`: keeps `craftsman-grid-lantern-porch-light-black-aluminum-wall-lante`
- `aurelia-collection`: keeps `modern-minimalist-personality-living-room-dining-room-bedroo`
- `autumn-at-home`: keeps `nf-tile-autumn-at-home.jpg` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `bedside-lamps`: keeps `square-wood-lamp-soft-light-comfortable-armchair.jpg`
- `botanicals`: keeps `image_1787875197423_3897a08a_1787875197489_7b28c922.png` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `cadence-collection`: keeps `modern-gold-candle-chandeliers-ribbed-glass-shades.jpg`
- `candle-holders`: keeps `Se5e2189cc5384dcb831f802fa4aa4efcC.webp`
- `carrara-collection`: keeps `scalloped-wall-sconce-bathroom-mirror.webp`
- `ceramic-vases`: keeps `Untitled_design_-_2025-07-25T011124.803.png` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `clearance`: keeps `mini-crystal-pendant-lights-sage-green-kitchen.jpg`
- `decor-gifts-under-100`: keeps `S35e8c4c9a7c34aeaaa9cd860e1a4c01ah_e6f0dc30-1a89-49db-ab55-8`
- `decorative-objects`: keeps `S35e8c4c9a7c34aeaaa9cd860e1a4c01ah.webp`
- `decorative-trays`: keeps `Sf4848ae47b8a429d8c26ae6f40feaedar.webp`
- `display-racks`: keeps `image_1787879611831_200fc914_1787879611999_c5e4fa90.png` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `glass-vases`: keeps `4_4748eaa0-a754-43d6-be26-44c36def32f5.png` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `grand-collection`: keeps `multi-light-pendant-chandelier-rustic-dining-room_b58280cc-3`
- `grand-indoor-lighting`: keeps `multi-light-pendant-chandelier-rustic-dining-room.webp`
- `home-fragrance`: keeps `Sfe8b992423a549c38925cd265f63d3fcO.webp` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `home-project-lighting`: keeps `square-wood-lamp-modern-living-room-rustic-ambient-light.jpg`
- `kids-nursery`: keeps `image_1787961709758_384dda43_1787961710110_994fc5c9.png` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `material-crystal`: keeps `style-gold-crystal-french-chandelier.jpg`
- `material-fabric-paper`: keeps `reading-nook-adjustable-pendant.jpg`
- `material-glass`: keeps `moon-light-patio-deck-outdoor-decor.jpg`
- `material-metal`: keeps `gold-chainlink-led-linear-chandelier-2.webp`
- `material-rattan-bamboo`: keeps `rattan-outdoor-pendant-light-rustic-dining-table-garden-sett`
- `material-stone-ceramic`: keeps `moon-shaped-stone-pillar-light-glowing-on-garden-pedestal.jp`
- `mesa-collection`: keeps `natural-travertine-stone-wall-sconce-uplight.jpg`
- `new-in-decor`: keeps `Untitled_design_-_2025-07-25T011124.803_66529dac-b795-4023-8` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `nordhaven-collection`: keeps `wood-ring-pendant-light-dual-ring-warm-dining-table.jpg`
- `offices-room-sets`: keeps `script-line-led-linear-pendant-1.jpg`
- `outdoor-solar-wall-lights`: keeps `modern-solar-powered-black-wall-fence-lights-4-pack-963788.j`
- `outdoor-up-down-wall-lights`: keeps `up-down-outdoor-wall-lights-balcony-railing-evening-sky.jpg`
- `photo-frames`: keeps `nf-tile-photo-frames.jpg`
- `plug-in-sconces`: keeps `adjustable-swing-arm-wall-sconce-1.jpg`
- `poufs-floor-cushions`: keeps `image_1787887666643_0c4ec075_1787887666941_f0f5bb1f.png` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `retail-room-sets`: keeps `nf-rs2-carrara-boutique.jpg` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `retail-spaces`: keeps `endless-arches-led-canvas-wall-art-3.jpg`
- `salons-and-spas-room-sets`: keeps `nf-rs2-mesa-spa.jpg` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `selene-collection`: keeps `moon-wall-lamp-cozy-living-room-corner-warm-ambient-glow.jpg`
- `soft-furnishings`: keeps `nf-tile-soft-furnishings.jpg` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `storage-shelves`: keeps `nf-tile-shelves-storage.jpg` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `style-boho`: keeps `close-up-woven-rattan-outdoor-pendant-light-warm-glow.jpg`
- `style-farmhouse-rustic`: keeps `modern-antler-chandelier-dining-room-lighting.jpg`
- `style-mid-century`: keeps `mid-century-swing-arm-wall-sconce-3.jpg`
- `the-hosting-table`: keeps `nf-tile-autumn-at-home_f92578e5-377d-4731-ba34-2a69cf50ced2.`
- `throw-blankets`: keeps `S30fc1ffecf804953b152657251e68917i_730f53b6-884e-4012-a33d-a` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `vases`: keeps `image_1787879793195_167afa3a_1787879793339_ab46dbec.png` (no active product photo found, or a supplier photo with a meaningless name that needs eyes)
- `wall-clocks`: keeps `S46e4e8b341714aeda225cf5e93f9e2a4g.webp`
- `wall-hangings-baskets`: keeps `S65e3f6725e814369aa34d8f159bd92a7F.webp`
**Worth a look by eye first:** decor sub-collections (vases, ceramic-vases, glass-vases, botanicals, accents-objects, candle-holders, decorative-trays, decorative-objects, the-hosting-table, wall-hangings-baskets, photo-frames, wall-clocks), plus hospitality's old `97_…png` and kids-nursery's PNG. A shot can be swapped in with one edit to `nf-menu-picks.liquid`.

### Option A (no code, optional): make the picks the collection images

The same picks can be written into **`collection.image`**, either with `collectionUpdate(input:{id, image:{src}})` or in Admin > Collections > image. Then everything that reads `collection.image` changes too: the lighting-collection `nf-collection-head` hero, SEO and og:image, and the desktop menus. The theme picks keep working either way. Shopify copies the file into `collections/`, so the CDN path changes but the picture is the same.

<details><summary>Handle → collection id → image src (85 rows)</summary>

| handle | collection id | image src |
|---|---|---|
| `sale` | gid://shopify/Collection/320525926452 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/cloud-pendant-lights-cream-living-room.jpg |
| `best-sellers` | gid://shopify/Collection/312750735412 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/cascading-ring-staircase-chandelier-grand-foyer.jpg |
| `new-arrivals` | gid://shopify/Collection/320525860916 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/butterfly-chandelier-double-height-living-room.jpg |
| `shop-all` | gid://shopify/Collection/512505872436 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/full-moon-wall-lamp-above-bed.jpg |
| `indoor-lighting` | gid://shopify/Collection/320040402996 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/elegant-organic-stick-chandelier-modern-dining-room-intricate-sophistication.jpg |
| `outdoor-lighting` | gid://shopify/Collection/316226011188 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/luxury-outdoor-seating-dusk-silver-metal-table-lamp.jpg |
| `decor` | gid://shopify/Collection/316502081588 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/feather-led-wall-lamp-golden-elegant-modern-living-room.jpg |
| `chandeliers` | gid://shopify/Collection/316224962612 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/gold-rectangular-chandelier-crystal-warm-luxurious-living-room.jpg |
| `ceiling-light` | gid://shopify/Collection/316224929844 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/black-led-ring-chandelier-bright-living-room-fireplace.jpg |
| `pendants` | gid://shopify/Collection/316224995380 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/firefly-pendant-light-over-dining-table.jpg |
| `wall-lights` | gid://shopify/Collection/316631679028 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/spiral-wall-sconce-modern-living-room-warm-ambient-glow.jpg |
| `lamps` | gid://shopify/Collection/316225257524 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/linear-floor-lamp-cozy-modern-living-room-warm-ambient-glow.jpg |
| `outdoor-wall-lights` | gid://shopify/Collection/320065044532 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/reeded-glass-wall-sconce-limestone-dusk.jpg |
| `outdoor-post-lights` | gid://shopify/Collection/316923019316 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/marble-globe-pillar-lights-modern-garden-pathway-dusk.jpg |
| `landscape-lighting` | gid://shopify/Collection/316226043956 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/vibrant-modern-teardrop-outdoor-light-glowing-garden-night.jpg |
| `wall-decor` | gid://shopify/Collection/316501786676 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/travertine-stone-wall-clock-with-warm-led-backlight-round.jpg |
| `room-sets` | gid://shopify/Collection/490650402868 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/moon-shaped-pillar-light-pool-terrace-dusk_b701aeb3-2ab5-4051-9f66-df0f9f1cb45f.jpg |
| `modern-chandeliers` | gid://shopify/Collection/316923904052 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/luxurious-modern-glass-ball-chandelier-gold-frame-round-dining-table.jpg |
| `crystal-chandeliers` | gid://shopify/Collection/489600843828 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-led-dimmable-dining-room-crystal-chandelier-roundrectangle-283003.jpg |
| `staircase-chandeliers` | gid://shopify/Collection/320335577140 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-crystal-chandelier-pendant-lighting-living-room.jpg |
| `candle-chandeliers` | gid://shopify/Collection/490742120500 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/classic-six-arm-central-sphere-modern-gold-and-crystal-chandeliers-dining-room.jpg |
| `linear-suspension` | gid://shopify/Collection/320391610420 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/c-shape-pendant-light-office-lobby-reception.webp |
| `flush-mount-lighting` | gid://shopify/Collection/316225028148 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/luxury-bedroom-multi-ring-ceiling-lights.jpg |
| `semi-flush-mount-lighting` | gid://shopify/Collection/316225060916 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-living-room-multi-ring-ceiling-lights.jpg |
| `ceiling-fans` | gid://shopify/Collection/319231098932 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-dual-head-ceiling-fans-led-living-room.jpg |
| `kitchen` | gid://shopify/Collection/490721345588 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/curved-wave-pendant-light-marble-kitchen-island.jpg |
| `staircase` | gid://shopify/Collection/490721411124 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/crystal-staircase-chandelier-luxurious-foyer-ambient.jpg |
| `wall-sconces` | gid://shopify/Collection/316225159220 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-chrome-wall-sconce-round-cozy-living-room.jpg |
| `vanity-lighting` | gid://shopify/Collection/316225224756 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/contemporary-vanity-light-bar-modern-marble-bathroom-warm-elegant-glow.jpg |
| `picture-lights` | gid://shopify/Collection/316924887092 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-linear-wall-sconces-living-room-painting.jpg |
| `led-wall-sconces` | gid://shopify/Collection/316924821556 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/led-wall-reading-light-modern-bedroom-wall-lamp.jpg |
| `swing-arm-sconces` | gid://shopify/Collection/316924723252 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/bedroom-swing-arm-wall-sconce-1.jpg |
| `table-lamps` | gid://shopify/Collection/316225290292 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/square-wood-lamp-cozy-bedside-table-warm-natural-glow.jpg |
| `floor-lamps` | gid://shopify/Collection/316225323060 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/reading-floor-lamps-living-room-gray-sofa-ambient.jpg |
| `rechargeable-lamps` | gid://shopify/Collection/316933767220 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/square-wood-lamp-bedroom-nightstand.webp |
| `ambient-lighting` | gid://shopify/Collection/316935700532 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/bird-wall-light-modern-living-room-gray-sofa-decorative-plants.jpg |
| `led-strip-lights` | gid://shopify/Collection/316935602228 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/led-linear-downlight-living-room-ceiling.webp |
| `best-sellers-indoor` | gid://shopify/Collection/320567377972 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/ultra-thin-linear-wall-lights-above-bed-oak-wall.jpg |
| `outdoor-wall-sconces` | gid://shopify/Collection/316923674676 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/rectangular-wall-light-navy-door-white-clapboard-porch.jpg |
| `motion-sensor-wall-lights` | gid://shopify/Collection/316923805748 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/solar-powered-motion-sensor-wall-light-modern-house-entrance-dusk.jpg |
| `post-lights` | gid://shopify/Collection/316923478068 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/garden-pathway-street-light-pillar-night.jpg |
| `pillar-lights` | gid://shopify/Collection/316923510836 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/cube-pillar-light-stone-garden-wall.jpg |
| `bollard-lights` | gid://shopify/Collection/320341344308 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/decorative-bollards-with-lights-lounge-poolside.jpg |
| `path-lights` | gid://shopify/Collection/316923117620 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/elegant-path-lighting-outdoor-garden-bed-dusk-illumination.jpg |
| `outdoor-spotlights` | gid://shopify/Collection/316923215924 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/solar-lawn-spotlight-white-hydrangeas.jpg |
| `step-deck-lights` | gid://shopify/Collection/316923183156 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/waterproof-solar-deck-lights-modern-poolside-dusk.jpg |
| `porch-entry` | gid://shopify/Collection/320566689844 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-outdoor-pillar-lights-luxury-home-entrance.webp |
| `patio-deck` | gid://shopify/Collection/320566722612 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/stylish-outdoor-patio-floor-lamps-chic-lounge-dusk-illumination.jpg |
| `garden-pathway` | gid://shopify/Collection/320566755380 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/mushroom-path-lights-illuminating-garden-pathway-dusk-greenery.jpg |
| `driveway-security` | gid://shopify/Collection/320566788148 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/led-marble-bollard-light-warm-illumination-curved-driveway.jpg |
| `outdoor-lanterns` | gid://shopify/Collection/316922986548 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/warm-inviting-glow-stone-patio-outdoor-led-lantern-night.jpg |
| `outdoor-string-lights` | gid://shopify/Collection/320341311540 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/led-globe-string-lights-pergola-backyard-dining.jpg |
| `outdoor-led-strip-lights` | gid://shopify/Collection/320341278772 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/outdoor-stair-lighting-strips-modern-staircase-edges-warm-ambient-glow.jpg |
| `best-sellers-outdoor` | gid://shopify/Collection/320567410740 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/ice-cube-step-light-warm-white-limestone-steps.jpg |
| `led-wall-art` | gid://shopify/Collection/320391577652 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/moon-wall-lamp-cozy-living-room-corner-warm-ambient-glow.jpg |
| `outdoor-room-sets` | gid://shopify/Collection/490660659252 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/moon-shaped-pillar-light-infinity-pool-sunset_29231109-f1f3-4160-b4ae-796f659fd117.jpg |
| `homes-room-sets` | gid://shopify/Collection/490660626484 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-crystal-chandelier-golden-elegant-hallway_e10f0e73-ccd8-4a57-a75d-d788bed5e287.jpg |
| `hospitality-room-sets` | gid://shopify/Collection/490650959924 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/three-rattan-outdoor-pendant-lights-patio-dining-set_f2757f10-cc5b-45fe-84b9-6666a8f32402.jpg |
| `living-room` | gid://shopify/Collection/320566460468 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/soft-ambient-living-room-velvet-sofa-french-style-chandelier-scrolling.jpg |
| `dining-room` | gid://shopify/Collection/490721378356 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/crystal-gold-led-chandelier-dining-room.jpg |
| `bedroom` | gid://shopify/Collection/320566493236 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/midcentury-modern-chandelier-elegant-bedroom-upholstered-bed.jpg |
| `bathroom` | gid://shopify/Collection/320566558772 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/vanity-led-lights-for-mirror-warm-minimalist-bathroom-sink.jpg |
| `home-office` | gid://shopify/Collection/320566624308 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/c-shape-pendant-light-office-hallway.jpg |
| `entryway-hallway` | gid://shopify/Collection/320566591540 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-crystal-chandelier-cascading-dark-wall-modern-living.jpg |
| `golden-hour-collection` | gid://shopify/Collection/512220594228 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-crystal-chandelier-golden-modern-dining-table.jpg |
| `isla-collection` | gid://shopify/Collection/512220528692 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/outdoor-rattan-lanterns-poolside-deck-warm-glow-dusk.jpg |
| `style-modern` | gid://shopify/Collection/320566820916 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/skyline-linear-led-lighting-living-room-fireplace.webp |
| `style-minimalist` | gid://shopify/Collection/320566853684 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/3_1eff7f5e-fc88-47b4-94f4-34d59db36db5.jpg |
| `style-scandinavian-japandi` | gid://shopify/Collection/320566984756 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/contemporary-mini-pendant-lights-open-plan-dining-kitchen.jpg |
| `style-glam` | gid://shopify/Collection/320567050292 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/french-chandelier-vintage-inspired-lighting-for-dining-room-and-entryway.jpg |
| `style-vintage-classic` | gid://shopify/Collection/320567017524 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/country-french-chandelier-rustic-elegant-ceiling-light-for-dining-room.jpg |
| `style-industrial` | (look up) | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/black-candlestick-lantern-patio-table-sunset-cozy-garden.jpg |
| `halo-collection` | gid://shopify/Collection/512220332084 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/ring-staircase-pendant-light-modern-spiral-wooden-steps-elegant.jpg |
| `bolla-collection` | gid://shopify/Collection/512525238324 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/opal-glass-globe-chandelier-modern-cozy-living-room-sofa.jpg |
| `ondine-collection` | gid://shopify/Collection/512220463156 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-curved-wall-sconce-living-room.jpg |
| `ironworks-collection` | gid://shopify/Collection/512525172788 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/vintage-barn-wall-sconce-edison-bulb-stone-wall.jpg |
| `kumo-collection` | gid://shopify/Collection/512220430388 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/rounded-cloud-pendant-light-warm-led-living-room.jpg |
| `linea-collection` | gid://shopify/Collection/512525205556 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/modern-vertical-tube-wall-sconce-living-room.jpg |
| `hospitality` | (look up) | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/sophisticated-tiered-glass-chandelier-living-room.jpg |
| `material-wood` | gid://shopify/Collection/320567214132 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/wood-bathroom-vanity-light-round-mirror.jpg |
| `hospitality-lighting` | gid://shopify/Collection/320564723764 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/mini-crystal-pendant-lights-sage-green-kitchen.jpg |
| `retail-lighting` | gid://shopify/Collection/320564789300 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/tall-vertical-wall-light-classic-living-room-fireplace.jpg |
| `outdoor-project-lighting` | gid://shopify/Collection/320564854836 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/outdoor-standing-lights-patio-pool-dusk.webp |
| `office-lighting` | gid://shopify/Collection/320564756532 | https://cdn.shopify.com/s/files/1/0750/8380/8820/files/wave-hanging-light-modern-dining-room.jpg |
</details>

---

## 4. Speed and smoothness

**What happens today:**
- Photos are created as `<img data-nfd-src>` and only get a `src` when the drawer opens (`onOpen`), when the menu button gets a `pointerdown`, or when a panel becomes active. They have `decoding=async` and a 0.35 s opacity fade. There is no `srcset`: `sized()` picks one width from 120–1200 using CSS width × DPR (capped at 2.6).
- The tiles passed `w: 520` (CSS px), so each of the 4 tiles downloaded **1200 px** on 3x phones and **1200** on 2x. They are about 165 px wide.
- 1.2 s after opening, `warmAll()` loaded **every** sub-panel photo (about 240) at once.
- Hard-coded URLs used `cdn.shopify.com`, a second origin.
- The `NF-DRAWER-REVEAL` safety sweep ran a `querySelectorAll` every 700 ms on every page, forever.
- A photo could pop in half-painted, because `is-in` was set on `load` before decode.

**Changes (all in `theme-full/`; diffs below):**

| # | File | Change |
|---|---|---|
| S1 | `assets/nf-drawer-v2.js` `sized()` | DPR capped at **2** (was 2.6); top bucket 960. `cdn.shopify.com/s/files/1/0750/8380/8820/` is rewritten to same-origin `/cdn/shop/`. |
| S2 | `nf-drawer-v2.js` `buildTiles()` | Tiles use `w: 200` (CSS width), so 3x and 2x phones fetch **480 w instead of 1200 w**, about 4–5x fewer bytes per tile. Best Sellers, New Arrivals and Sale read `MAP['/collections/…']`. The old constants stay as fallback. |
| S3 | `nf-drawer-v2.js` `loadIn(root, hi)` | `fetchPriority='high'` for what is on screen now. `img.decode()` before `is-in`, so there are no half-decoded frames. A `data-nfd-dec` flag stops the safety sweep revealing a photo early. On error the photo is revealed, so the shimmer never hangs. |
| S4 | `nf-drawer-v2.js` `init()` | **Preload on idle after `load`**: `build()` and `loadIn(main panel)`, which is the 4 tiles and about 9 row thumbnails (roughly 150 KB). Skipped on Save-Data or 2G. The `pointerdown` on the menu button still loads them, now at high priority. |
| S5 | `nf-drawer-v2.js` `warmAll()` / panel observer | Photos warm **one level ahead** instead of all 240 at once. Opening the drawer warms the first-level panels (Indoor, Outdoor, Decor, Shop By, Inspirations). Opening a panel warms the panels its rows lead to. `pointerdown` on any row still loads its panel at once. |
| S6 | `nf-drawer-v2.js` reveal sweep | The 700 ms interval only works while `#sidebar-menu[open]`. |
| S7 | `assets/nf-drawer-v2.css` | Soft entrance: opacity 0.45 s plus scale 1.04 → 1 over 0.9 s (ease-out). A warm shimmer placeholder (`#efe9e2`) sits behind tiles, heroes, thumbnails and grid images and stops via `:has(> .is-in)`. Reduced-motion users get neither. |
| S8 | `snippets/nf-menu-img-map.liquid`, `header-sidebar.liquid`, `nf-coll-mod.liquid` | Picks are emitted as `/cdn/shop/files/…?width=240` (map) or `900` (hero). Collection tiles get a proper `srcset` (240/400/600w), `loading=lazy`, `decoding=async` and width/height. |

Not changed: `nf-menus.js` (section fetch and sessionStorage cache) and `nf-menus-drawer.liquid`. They already render the snippet that now uses the picks. The `nf-menus` fingerprint (`nfm4`) covers menu URLs and titles but not the snippet's output, so a phone's **sessionStorage** copy of the sub-panels can show old photos for the rest of that tab session (it refreshes in the background after load). To force it at once, change `nfm4` to `nfm5` in `header-sidebar.liquid` line 6. That is optional; the diff below includes it.

---

## 5. Exact code changes

New and full files (upload these). Originals are next to them as `.orig`.

| Path in theme | Status | Live MD5 the `.orig` was taken from |
|---|---|---|
| `snippets/nf-menu-picks.liquid` | **new** | n/a |
| `snippets/nf-menu-img-map.liquid` | rewrite | a558c46155c1ac17e5f98ec1e829a7f0 |
| `snippets/header-sidebar.liquid` | edit | 60f1ef488f816a40582aed59bf472537 |
| `sections/nf-coll-mod.liquid` | edit | c0d8137ebf209fa9f70ee4b7d462dbb1 |
| `assets/nf-drawer-v2.js` | edit | 1a715385a2bd52b9696e57e0d224ee4a |
| `assets/nf-drawer-v2.css` | edit | 19aef2e5bcfb6225ed3b3c861aa2719b |

Upload `snippets/nf-menu-picks.liquid` **first**, because the other three Liquid files render it. Before uploading, check that the live MD5 still matches; if a file changed since, merge the diff instead.


### `snippets/nf-menu-img-map.liquid`

```diff
--- snippets/nf-menu-img-map.liquid.orig
+++ snippets/nf-menu-img-map.liquid
@@ -1,4 +1,7 @@
 {%- comment -%}
+  2026-10-22 NF-MENU-PICKS: every row now prefers the hand picked room / dusk photo from snippets/nf-menu-picks.liquid
+  (store product media, served same origin from /cdn/shop/), then falls back to the collection's own image as before.
+  Pages and title headings look up the pick of the collection they borrow. Rollback: restore nf-menu-img-map.liquid.orig.
   2026-10-19: photos for the new Shop By group rows (New Collections, Shop By Collection) and Outdoor's Shop by Area.
   2026-10-17: reads main-menu-v3 (the MOD-style preview menu) instead of main-menu.
   NF-MENU-IMG (round 16, owner: "there should be an image for every single menu item" on phones, and Shop By was blank).
@@ -9,7 +12,9 @@
   fitting collection (lists below). Params: id (element id), depth: 'top' = only the first level (printed in every
   page, tiny), 'all' = every level (arrives with the deferred drawer panels).
 {%- endcomment -%}
+{%- capture nf_picks -%}{%- render 'nf-menu-picks' -%}{%- endcapture -%}
 {%- liquid
+  assign nf_picks = nf_picks | strip
   assign w = 240
   assign page_map = '/pages/professionals=style-glam,/pages/hospitality-lighting-projects=hospitality-lighting,/pages/office-lighting-projects=office-lighting,/pages/retail-lighting-projects=retail-lighting,/pages/home-lighting-projects=home-project-lighting,/pages/outdoor-lighting-projects=outdoor-project-lighting,/pages/restaurant-cafe-lighting-projects=kitchen-dining,/pages/rental-property-lighting-projects=living-room,/pages/salon-spa-lighting-projects=bathroom,/pages/school-library-lighting-projects=home-office,/pages/gym-studio-lighting-projects=style-industrial,/pages/model-home-staging-lighting=bedroom,/pages/bulk-order-form=room-sets,/pages/bulk-project-orders=hospitality-lighting,/pages/project-portfolio=style-modern,/pages/ideas-and-guides=living-room,/pages/catalog=best-sellers,/blogs/blog=bedroom,/pages/custom-lighting=material-crystal,/pages/inspiration=living-room,/pages/lighting-catalog=best-sellers' | split: ','
   assign title_map = 'shop by=living-room,shop by category=ceiling-light,shop by room=bedroom,shop by outdoor area=garden-pathway,shop by style=style-modern,shop by material=material-wood,industries=hospitality-lighting,services=room-sets,project collections=office-lighting,featured=new-arrivals,ideas & guides=living-room,professionals=style-glam,best sellers=best-sellers-indoor,lighting guides=living-room,autumn at home=autumn-at-home,sale=clearance,inspiration=living-room,follow=bedroom,shop all=best-sellers,new collections=golden-hour-collection,shop by collection=grand-collection,shop by area=garden-pathway' | split: ','
@@ -47,40 +52,63 @@
   {%- assign p = u | split: '://' | last -%}
   {%- if u contains '://' -%}{%- assign p = p | split: '/' -%}{%- assign p = p | slice: 1, p.size | join: '/' | prepend: '/' -%}{%- endif -%}
   {%- assign p = p | split: '#' | first | split: '?' | first -%}
-  {%- assign img = blank -%}
+  {%- assign src = '' -%}
   {%- assign key = p -%}
+  {%- comment -%} the collection (or the collection a page borrows) whose photo this row shows {%- endcomment -%}
+  {%- assign ch = '' -%}
   {%- if p contains '/collections/' -%}
-    {%- assign h = p | split: '/collections/' | last | split: '/' | first -%}
-    {%- assign c = collections[h] -%}
-    {%- if c != blank -%}{%- assign img = c.featured_image -%}{%- endif -%}
+    {%- assign ch = p | split: '/collections/' | last | split: '/' | first -%}
   {%- else -%}
-    {%- for pm in page_map -%}
-      {%- assign pk = pm | split: '=' | first -%}
-      {%- if pk == p -%}{%- assign ph = pm | split: '=' | last -%}{%- assign img = collections[ph].featured_image -%}{%- break -%}{%- endif -%}
-    {%- endfor -%}
+    {%- assign pk = ',' | append: p | append: '=' -%}
+    {%- if p != '' and nf_picks contains pk -%}
+      {%- assign src = nf_picks | split: pk | last | split: ',' | first | prepend: '/cdn/shop/' | append: '?width=' | append: w -%}
+    {%- else -%}
+      {%- for pm in page_map -%}
+        {%- assign pmk = pm | split: '=' | first -%}
+        {%- if pmk == p -%}{%- assign ch = pm | split: '=' | last -%}{%- break -%}{%- endif -%}
+      {%- endfor -%}
+    {%- endif -%}
+  {%- endif -%}
+  {%- if src == '' and ch != '' -%}
+    {%- assign pk = ',' | append: ch | append: '=' -%}
+    {%- if nf_picks contains pk -%}
+      {%- assign src = nf_picks | split: pk | last | split: ',' | first | prepend: '/cdn/shop/' | append: '?width=' | append: w -%}
+    {%- else -%}
+      {%- assign c = collections[ch] -%}
+      {%- if c != blank and c.featured_image != blank -%}{%- assign src = c.featured_image | image_url: width: w -%}{%- endif -%}
+    {%- endif -%}
   {%- endif -%}
   {%- comment -%} group headings and titles: keyed by title as well {%- endcomment -%}
   {%- assign tk = 't:' | append: t -%}
-  {%- assign timg = blank -%}
+  {%- assign tsrc = '' -%}
   {%- for tm in title_map -%}
     {%- assign tt = tm | split: '=' | first -%}
-    {%- if tt == t -%}{%- assign th = tm | split: '=' | last -%}{%- assign timg = collections[th].featured_image -%}{%- break -%}{%- endif -%}
+    {%- if tt == t -%}
+      {%- assign th = tm | split: '=' | last -%}
+      {%- assign pk = ',' | append: th | append: '=' -%}
+      {%- if nf_picks contains pk -%}
+        {%- assign tsrc = nf_picks | split: pk | last | split: ',' | first | prepend: '/cdn/shop/' | append: '?width=' | append: w -%}
+      {%- elsif collections[th].featured_image != blank -%}
+        {%- assign tsrc = collections[th].featured_image | image_url: width: w -%}
+      {%- endif -%}
+      {%- break -%}
+    {%- endif -%}
   {%- endfor -%}
-  {%- if timg == blank -%}{%- assign timg = img -%}{%- endif -%}
+  {%- if tsrc == '' -%}{%- assign tsrc = src -%}{%- endif -%}
   {%- assign sk = ',' | append: key | append: ',' -%}
-  {%- if img != blank and p != '/collections' and p != '/' and p != '' -%}
+  {%- if src != '' and p != '/collections' and p != '/' and p != '' -%}
     {%- unless seen contains sk -%}
       {%- assign seen = seen | append: key | append: ',' -%}
       {%- if n > 0 -%},{%- endif -%}{%- assign n = n | plus: 1 -%}
-      {{- key | json -}}:{{- img | image_url: width: w | json -}}
+      {{- key | json -}}:{{- src | json -}}
     {%- endunless -%}
   {%- endif -%}
   {%- assign stk = ',' | append: tk | append: ',' -%}
-  {%- if timg != blank -%}
+  {%- if tsrc != '' -%}
     {%- unless seen contains stk -%}
       {%- assign seen = seen | append: tk | append: ',' -%}
       {%- if n > 0 -%},{%- endif -%}{%- assign n = n | plus: 1 -%}
-      {{- tk | json -}}:{{- timg | image_url: width: w | json -}}
+      {{- tk | json -}}:{{- tsrc | json -}}
     {%- endunless -%}
   {%- endif -%}
 {%- endfor -%}
```

### `snippets/header-sidebar.liquid`

```diff
--- snippets/header-sidebar.liquid.orig
+++ snippets/header-sidebar.liquid
@@ -2,8 +2,8 @@
 {%- comment -%} NF-MENUS-LOADER (2026-10-17): assets/nf-menus.js used to be loaded by snippets/nf-topbar.liquid, which is no longer
   rendered (the utility row became snippets/nf-utilbar.liquid), so the phone drawer's sub panels never arrived and Indoor, Outdoor
   etc. did nothing when tapped. The loader now lives here, keyed on the menus it serves. {%- endcomment -%}
-{%- comment -%} NF-M4 (2026-10-21): fingerprint prefix nfm3 -> nfm4 so phones drop their cached copy of the old sub panels {%- endcomment -%}
-{%- capture nf_menus_fp -%}nfm4{%- for l1 in linklists['main-menu-v3'].links -%}{{ l1.url }}{{ l1.title }}{%- for l2 in l1.links -%}{{ l2.url }}{{ l2.title }}{%- for l3 in l2.links -%}{{ l3.url }}{{ l3.title }}{%- endfor -%}{%- endfor -%}{%- endfor -%}|{%- for l1 in linklists['top-bar'].links -%}{{ l1.url }}{{ l1.title }}{%- for l2 in l1.links -%}{{ l2.url }}{{ l2.title }}{%- for l3 in l2.links -%}{{ l3.url }}{{ l3.title }}{%- endfor -%}{%- endfor -%}{%- endfor -%}{%- endcapture -%}
+{%- comment -%} NF-M4 (2026-10-21): fingerprint prefix nfm3 -> nfm4; NF-MENU-PICKS (2026-10-22): nfm4 -> nfm5 so phones drop sub panels cached with the old photos {%- endcomment -%}
+{%- capture nf_menus_fp -%}nfm5{%- for l1 in linklists['main-menu-v3'].links -%}{{ l1.url }}{{ l1.title }}{%- for l2 in l1.links -%}{{ l2.url }}{{ l2.title }}{%- for l3 in l2.links -%}{{ l3.url }}{{ l3.title }}{%- endfor -%}{%- endfor -%}{%- endfor -%}|{%- for l1 in linklists['top-bar'].links -%}{{ l1.url }}{{ l1.title }}{%- for l2 in l1.links -%}{{ l2.url }}{{ l2.title }}{%- for l3 in l2.links -%}{{ l3.url }}{{ l3.title }}{%- endfor -%}{%- endfor -%}{%- endfor -%}{%- endcapture -%}
 <script src="{{ 'nf-menus.js' | asset_url }}" defer data-nf-menus-key="{{ nf_menus_fp | md5 }}-{{ 'nf-menus.js' | asset_url | split: 'v=' | last }}" data-nf-menus-url="{{ routes.root_url }}"></script>
 {%- comment -%} NF-DRAWER-V2 (2026-09-12): phone drawer redesign, see assets/nf-drawer-v2.js. Rollback = delete the next 2 lines. {%- endcomment -%}
 <link rel="stylesheet" href="{{ 'nf-drawer-v2.css' | asset_url }}" media="screen and (max-width: 999px)">
@@ -12,6 +12,8 @@
 {%- assign nfd_skip = ',best-sellers,ceiling-light,wall-lights,lamps,ambient-lighting,outdoor-lighting,outdoor-wall-lights,decor,soft-furnishings,storage-shelves,poufs-floor-cushions,home-fragrance,sale,' -%}
 {%- assign nfd_force = ',soft-furnishings=throw-blankets,storage-shelves=display-racks,ambient-lighting=led-strip-lights,' -%}
 {%- capture nfd_urls -%}{%- for nfd_l1 in linklists['main-menu-v3'].links -%}{{ nfd_l1.url }} {% for nfd_l2 in nfd_l1.links %}{{ nfd_l2.url }} {% endfor -%}{%- endfor -%}{%- endcapture -%}
+{%- comment -%} NF-MENU-PICKS (2026-10-22): a hand picked room / dusk photo from snippets/nf-menu-picks.liquid wins over the collection image and over nfd_skip; square product photos are cropped to 16:10 a little above centre (fixtures hang from the top). {%- endcomment -%}
+{%- capture nfd_picks -%}{%- render 'nf-menu-picks' -%}{%- endcapture -%}{%- assign nfd_picks = nfd_picks | strip -%}
 <script type="application/json" id="nfd-hero-map">{
 {%- assign nfd_n = 0 -%}{%- assign nfd_seen = ',' -%}
 {%- assign nfd_list = nfd_urls | split: ' ' -%}
@@ -20,6 +22,14 @@
 {%- assign nfd_h = nfd_u | split: '/collections/' | last | split: '?' | first | split: '#' | first | split: '/' | first -%}
 {%- assign nfd_k = ',' | append: nfd_h | append: ',' -%}
 {%- if nfd_seen contains nfd_k -%}{%- continue -%}{%- endif -%}
+{%- assign nfd_pkk = ',' | append: nfd_h | append: '=' -%}
+{%- if nfd_picks contains nfd_pkk -%}
+{%- assign nfd_seen = nfd_seen | append: nfd_h | append: ',' -%}
+{%- assign nfd_pu = nfd_picks | split: nfd_pkk | last | split: ',' | first | prepend: '/cdn/shop/' | append: '?width=900' -%}
+{%- if nfd_n > 0 -%},{%- endif -%}{%- assign nfd_n = nfd_n | plus: 1 -%}
+{{- '/collections/' | append: nfd_h | json -}}:{"u":{{ nfd_pu | json }},"p":"50% 38%"}
+{%- continue -%}
+{%- endif -%}
 {%- assign nfd_fk = ',' | append: nfd_h | append: '=' -%}{%- assign nfd_src = nfd_h -%}
 {%- if nfd_force contains nfd_fk -%}{%- assign nfd_src = nfd_force | split: nfd_fk | last | split: ',' | first -%}{%- elsif nfd_skip contains nfd_k -%}{%- continue -%}{%- endif -%}
 {%- assign nfd_c = collections[nfd_src] -%}
```

### `sections/nf-coll-mod.liquid`

```diff
--- sections/nf-coll-mod.liquid.orig
+++ sections/nf-coll-mod.liquid
@@ -226,6 +226,8 @@
     </div>
     {%- if line != blank -%}<p class="nf-cm__line">{{ line | escape }}</p>{%- endif -%}
     {%- if tiles != blank -%}
+      {%- comment -%} NF-MENU-PICKS (2026-10-22): the sub collection tiles show the same hand picked room / dusk photo as the phone menu (snippets/nf-menu-picks.liquid), else the collection image as before. {%- endcomment -%}
+      {%- capture cm_picks -%}{%- render 'nf-menu-picks' -%}{%- endcapture -%}{%- assign cm_picks = cm_picks | strip -%}
       {%- capture tiles_html -%}
         {%- assign tl = tiles | split: '##' -%}
         {%- for t in tl -%}
@@ -235,10 +237,15 @@
           {%- if c == blank or c.all_products_count == 0 -%}{%- continue -%}{%- endif -%}
           {%- assign tn = tp[1] | default: c.title | strip -%}
           {%- assign img = c.image | default: c.featured_image -%}
+          {%- assign cm_pk = ',' | append: th | append: '=' -%}
+          {%- assign cm_pu = '' -%}
+          {%- if cm_picks contains cm_pk -%}{%- assign cm_pu = cm_picks | split: cm_pk | last | split: ',' | first | prepend: '/cdn/shop/' -%}{%- endif -%}
           <li class="nf-cm__tile">
             <a href="{{ c.url }}">
               <span class="nf-cm__img">
-                {%- if img != blank -%}{{- img | image_url: width: 600 | image_tag: loading: 'lazy', widths: '240,400,600', sizes: '(max-width: 699px) 150px, 220px', alt: tn -}}{%- endif -%}
+                {%- if cm_pu != '' -%}
+                  <img src="{{ cm_pu }}?width=400" srcset="{{ cm_pu }}?width=240 240w, {{ cm_pu }}?width=400 400w, {{ cm_pu }}?width=600 600w" sizes="(max-width: 699px) 150px, 220px" width="600" height="600" loading="lazy" decoding="async" alt="{{ tn | escape }}">
+                {%- elsif img != blank -%}{{- img | image_url: width: 600 | image_tag: loading: 'lazy', widths: '240,400,600', sizes: '(max-width: 699px) 150px, 220px', alt: tn -}}{%- endif -%}
               </span>
               <span class="nf-cm__name">{{ tn | escape }}</span>
             </a>
```

### `assets/nf-drawer-v2.js`

```diff
--- assets/nf-drawer-v2.js.orig
+++ assets/nf-drawer-v2.js
@@ -40,10 +40,13 @@
     }
     return s;
   }
+  /* NF-MENU-SPEED (2026-10-22): 2x is the most a 48-360px menu photo needs (3x phones were pulling 1200px files), and
+     cdn.shopify.com file URLs are served from the shop's own /cdn/shop/ path, so no second DNS + TLS connection. */
   function sized(u, cssW) {
     if (!u) return '';
-    var need = cssW * Math.min(window.devicePixelRatio || 1, 2.6), b = [120, 180, 240, 360, 480, 720, 960, 1200], w = 1200;
+    var need = cssW * Math.min(window.devicePixelRatio || 1, 2), b = [120, 180, 240, 360, 480, 720, 960], w = 960;
     for (var i = 0; i < b.length; i++) { if (b[i] >= need) { w = b[i]; break; } }
+    u = String(u).replace(/^(https?:)?\/\/cdn\.shopify\.com\/s\/files\/1\/0750\/8380\/8820\//, '/cdn/shop/');
     if (u.indexOf('//') === 0) u = 'https:' + u;
     try {
       var x = new URL(u, location.origin);
@@ -88,8 +91,8 @@
   /* NF-DRAWER-IMG-0921: hand picked row and tile photos (owner 2026-09-21) */
   var IMG = {
     'grand collection': 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/ceramic-crystal-led-chandelier-bedroom.jpg',
-    'autumn at home': 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/Sf155150a3621467292178e7cfaea3226f.webp',
-    'new arrivals': 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-lighting-chandelier-sleek-luxurious-living-room.jpg'
+    'autumn at home': 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/Sf155150a3621467292178e7cfaea3226f.webp'
+    /* 2026-10-22: 'new arrivals' removed, its photo now comes from snippets/nf-menu-picks.liquid via the photo map */
   };
   /* NF-MENU-IMG (round 16): photos printed by the server for every menu row (snippets/nf-menu-img-map.liquid):
      #nfd-img-map (first level, in the page) and #nfd-img-map-all (every level, arrives with the sub panels).
@@ -116,10 +119,18 @@
     i.setAttribute('data-nfd-src', sized(u, w));
     return i;
   }
-  function loadIn(root) {
+  /* NF-MENU-SPEED (2026-10-22): a photo is decoded off the main thread before it fades in, so it never pops in half
+     painted; tiles and heroes ask for high fetch priority when they are the thing the shopper is looking at. */
+  function reveal(i) { i.removeAttribute('data-nfd-dec'); i.classList.add('is-in'); }
+  function loadIn(root, hi) {
     if (!root) return;
     Array.prototype.forEach.call(root.querySelectorAll('img[data-nfd-src]'), function (i) {
-      i.addEventListener('load', function () { i.classList.add('is-in'); }, { once: true });
+      if (hi) try { i.fetchPriority = 'high'; } catch (e) {}
+      if (i.decode) i.setAttribute('data-nfd-dec', '1');
+      i.addEventListener('error', function () { reveal(i); }, { once: true });
+      i.addEventListener('load', function () {
+        if (i.decode) i.decode().then(function () { reveal(i); }, function () { reveal(i); }); else reveal(i);
+      }, { once: true });
       i.src = i.getAttribute('data-nfd-src');
       i.removeAttribute('data-nfd-src');
     });
@@ -160,17 +171,23 @@
     }
     /* 2026-10-22 (owner): the four tiles use room photos from active products, each different and none of the homepage heroes:
        Best Sellers = Thicket (dining room), New Arrivals = Ginkgo (dining), Shop By = Forge (vaulted living room), Sale = Lunette (on sale, poolside deck). */
+    /* NF-MENU-PICKS (2026-10-22, owner: "absolute beauties"): Best Sellers, New Arrivals and Sale take their photo from
+       snippets/nf-menu-picks.liquid through the photo map (Cirrus ring chandelier in a grand foyer, Rhapsody butterfly
+       chandelier in a double height living room, Nimbus cloud pendants over a cream living room); the constants below are
+       only the fallback when the map is missing. w is the tile's CSS width (about 165px on a phone), not a pixel width:
+       it was 520, which made 3x phones download 1200px files for each tile. */
     var TILE = { bs: 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/multi-light-pendant-chandelier-rustic-dining-room.webp', na: 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/black-geometric-chandelier-leaf-design-modern-dining-table.jpg',
       sb: 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/candles-chandelier-vaulted-living-room.jpg', sale: 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/moon-shaped-stone-light-poolside-deck-lounge.jpg' };
-    tile('Best Sellers', TILE.bs, { w: 520, href: H.tb['best sellers'] || '/collections/best-sellers' });
-    tile('New Arrivals', TILE.na, { w: 520, href: '/collections/new-arrivals' });
+    var TW = 200;
+    tile('Best Sellers', MAP['/collections/best-sellers'] || TILE.bs, { w: TW, href: H.tb['best sellers'] || '/collections/best-sellers' });
+    tile('New Arrivals', MAP['/collections/new-arrivals'] || TILE.na, { w: TW, href: '/collections/new-arrivals' });
     /* 2026-10-19: Shop By now opens main-menu-v3's Shop By (Room, New Collections, Style, Collection) */
-    if (byT['shop by']) tile('Shop By', TILE.sb, { w: 520, btn: byT['shop by'], sub: 'Room, style, collection' });
+    if (byT['shop by']) tile('Shop By', TILE.sb, { w: TW, btn: byT['shop by'], sub: 'Room, style, collection' });
     /* 2026-10-22 (owner: cleaner menu): the four tiles (Best Sellers, New Arrivals, Shop By, Sale) are not repeated as rows below */
     ['shop by', 'best sellers', 'new arrivals', 'sale'].forEach(function (t) { var r = byT[t] && byT[t].closest('li'); if (r) r.classList.add('nfd-hide-ext'); });
     /* NF-SALE-TILE-V1 (2026-09-13): real warm photo for the Sale tile (Shopify File nf-sale-tile-lantern-v2.jpg, 720x360), sharper 520w request; red Sale chip is CSS. */
     /* 2026-10-22 (owner: the lantern photo looked off): a clean photo of an active sale product, Chandra full moon wall lamp. */
-    tile('Sale', TILE.sale, { w: 520, href: '/collections/sale', cls: 'nfd-tile--sale', sub: 'Shop the markdowns' });
+    tile('Sale', MAP['/collections/sale'] || TILE.sale, { w: TW, href: '/collections/sale', cls: 'nfd-tile--sale', sub: 'Shop the markdowns' });
     return wrap;
   }
 
@@ -300,11 +317,26 @@
     if (sb.hasAttribute('open')) warmAll();
   }
   var warmed = false;
+  var idleCb = window.requestIdleCallback || function (f) { return setTimeout(f, 250); };
+  /* NF-MENU-SPEED (2026-10-22): warm one level ahead instead of all ~240 panel photos at once. When the drawer is open
+     the first level panels (Indoor, Outdoor, Decor, Shop By, Inspirations) load; when one of those is opened, the
+     panels its rows lead to load in the background; a finger on any row still loads its panel at once (pointerdown). */
+  function childPanels(p) {
+    var out = [];
+    Array.prototype.forEach.call(p.querySelectorAll('[data-target], [aria-controls^="header-panel"]'), function (b) {
+      var c = document.getElementById(b.getAttribute('data-target') || b.getAttribute('aria-controls'));
+      if (c && c !== p && c.classList.contains('header-sidebar__sub-panel')) out.push(c);
+    });
+    return out;
+  }
+  function warmAhead(p) {
+    if (!p) return;
+    idleCb(function () { childPanels(p).forEach(function (c) { loadIn(c); }); }, { timeout: 2000 });
+  }
   function warmAll() {
     if (warmed || !cp) return; warmed = true;
-    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 250); };
-    /* 2026-10-22: wait until the drawer has finished sliding in (about 240 photos used to start loading during the slide and made it stutter) */
-    setTimeout(function () { idle(function () { Array.prototype.forEach.call(cp.querySelectorAll('.header-sidebar__sub-panel'), loadIn); }, { timeout: 3000 }); }, 1200);
+    /* 2026-10-22: wait until the drawer has finished sliding in (photos that start loading during the slide make it stutter) */
+    setTimeout(function () { warmAhead(sb.querySelector('.header-sidebar__main-panel')); }, 700);
   }
   function build() {
     if (built) return true;
@@ -322,7 +354,8 @@
       new MutationObserver(function () {
         var id = activeId(), p = id && document.getElementById(id);
         if (!p) return;
-        loadIn(p);
+        loadIn(p, true);
+        warmAhead(p);
         var tries = 0;
         (function settle() {
           if (activeId() !== id) return;
@@ -342,7 +375,7 @@
       if (!b) return;
       var id = b.getAttribute('aria-controls') || b.getAttribute('data-target') || b.getAttribute('data-nfd-open');
       var p = id && document.getElementById(id);
-      if (p) loadIn(p);
+      if (p) loadIn(p, true);
     }, { passive: true });
     wireHistory();
     return true;
@@ -392,10 +425,21 @@
     if (!MQ.matches) return;
     if (!build()) return;
     var main = sb.querySelector('.header-sidebar__main-panel');
-    loadIn(main);
+    loadIn(main, true);
     var MN = window.__nfMenus;
     if (!MN || MN.loaded) warmAll();
   }
+  /* NF-MENU-SPEED (2026-10-22): the first screen of the drawer (4 tiles + about 9 row thumbnails, roughly 150KB at
+     200/48px CSS widths) is fetched while the page sits idle after load, so the menu opens with its photos already
+     there. Skipped with Save-Data or on 2G. */
+  function lowData() {
+    var c = navigator.connection;
+    return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
+  }
+  function preloadFirstScreen() {
+    if (!MQ.matches || lowData()) return;
+    if (build()) loadIn(sb.querySelector('.header-sidebar__main-panel'));
+  }
   function init() {
     var s = document.getElementById('sidebar-menu');
     if (!s) return;
@@ -403,10 +447,12 @@
     if (s.hasAttribute('open')) onOpen();
     var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
     idle(function () { if (MQ.matches) build(); }, { timeout: 1500 });
+    var afterLoad = function () { idle(preloadFirstScreen, { timeout: 4000 }); };
+    if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad, { once: true });
     /* the drawer is usually opened with a tap on the menu button: start its first photos on touch down */
     document.addEventListener('pointerdown', function (e) {
       if (!MQ.matches || !e.target.closest || !e.target.closest('[aria-controls="sidebar-menu"]')) return;
-      if (build()) loadIn(sb.querySelector('.header-sidebar__main-panel'));
+      if (build()) loadIn(sb.querySelector('.header-sidebar__main-panel'), true);
     }, { capture: true, passive: true });
   }
   if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
@@ -415,10 +461,11 @@
 /* NF-DRAWER-REVEAL-0927: drawer pictures sometimes stayed at opacity 0 because the markup is rebuilt after the load
    listener was attached. Reveal any .nfd-img that has loaded, whenever it loads or the drawer changes. */
 (function(){if(window.__nfdReveal)return;window.__nfdReveal=1;
-function on(i){if(i&&i.classList&&i.classList.contains('nfd-img')&&!i.classList.contains('is-in')&&i.complete&&i.naturalWidth>0)i.classList.add('is-in')}
+function on(i){if(i&&i.classList&&i.classList.contains('nfd-img')&&!i.classList.contains('is-in')&&!i.hasAttribute('data-nfd-dec')&&i.complete&&i.naturalWidth>0)i.classList.add('is-in')}
 /* NF-DRAWER-LAZY-V1 (2026-10-08, site speed): only load a menu photo once the phone drawer is open and its panel is showing. Before, every DOM change hydrated all 233 drawer photos on page load (about 10 MB on the homepage). */ function nfdShown(i){var sb=i.closest('#sidebar-menu');if(sb&&!sb.hasAttribute('open'))return false;if(i.closest('[hidden]'))return false;return true} function sweep(){var a=document.querySelectorAll('img.nfd-img:not(.is-in)');for(var k=0;k<a.length;k++){var i=a[k];if(!i.getAttribute('src')&&i.getAttribute('data-nfd-src')&&nfdShown(i)){i.src=i.getAttribute('data-nfd-src');i.removeAttribute('data-nfd-src')}on(i)}}
 document.addEventListener('load',function(e){on(e.target)},true);
 var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(sweep,40)}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['open','class','src']});
 document.addEventListener('click',function(){setTimeout(sweep,60);setTimeout(sweep,400)},true);
-setInterval(function(){if(document.querySelector('img.nfd-img:not(.is-in)'))sweep()},700);
+/* 2026-10-22: the safety sweep only runs while the drawer is open (photos now load one level ahead, so some always wait) */
+setInterval(function(){if(document.querySelector('#sidebar-menu[open] img.nfd-img:not(.is-in)'))sweep()},700);
 sweep();})();
```

### `assets/nf-drawer-v2.css`

```diff
--- assets/nf-drawer-v2.css.orig
+++ assets/nf-drawer-v2.css
@@ -7,8 +7,17 @@
   --nfd-head: var(--heading-font-family, "Roboto Serif", Georgia, serif);
   --nfd-ui: Montserrat, var(--text-font-family, system-ui), sans-serif;
 }
-#sidebar-menu.nfd2 .nfd-img { display: block; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .35s ease; }
-#sidebar-menu.nfd2 .nfd-img.is-in { opacity: 1; }
+#sidebar-menu.nfd2 .nfd-img { display: block; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity .45s ease, transform .9s cubic-bezier(.2, .7, .2, 1); }
+#sidebar-menu.nfd2 .nfd-img.is-in { opacity: 1; transform: none; }
+/* NF-MENU-SPEED (2026-10-22): a soft warm shimmer holds each photo's place until it has loaded and decoded, then the
+   photo fades in while settling from 104% to 100% (no pop). The shimmer stops as soon as the photo is in. */
+#sidebar-menu.nfd2 :is(.nfd-tile, .nfd-hero, .nfd-thumb, .nfd-grid__img) {
+  background-color: #efe9e2;
+  background-image: linear-gradient(100deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 70%);
+  background-size: 220% 100%; background-repeat: no-repeat; animation: nfd-shim 1.4s ease-in-out infinite;
+}
+#sidebar-menu.nfd2 :is(.nfd-tile, .nfd-hero, .nfd-thumb, .nfd-grid__img):has(> .nfd-img.is-in) { animation: none; background-image: none; }
+@keyframes nfd-shim { from { background-position: 120% 0; } to { background-position: -120% 0; } }
 
 /* quick tiles */
 #sidebar-menu.nfd2 .nfd-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 2px 0 14px; }
@@ -127,6 +136,8 @@
 @media (prefers-reduced-motion: reduce) {
   #sidebar-menu.nfd2 .header-sidebar__sub-panel:not([hidden]) { animation: none; }
   #sidebar-menu.nfd2 .nfd-img, #sidebar-menu.nfd2 .nfd-tile, #sidebar-menu.nfd2 .nfd-thumb { transition: none; }
+  #sidebar-menu.nfd2 .nfd-img { transform: none; }
+  #sidebar-menu.nfd2 :is(.nfd-tile, .nfd-hero, .nfd-thumb, .nfd-grid__img) { animation: none; background-image: none; }
 }
 
 /* NF-SALE-TILE-V1 (2026-09-13, owner: "the Sale tile is literally just red"): a real warm photo (glowing brass post lantern
```

### `snippets/nf-menu-picks.liquid` (new, full file)

The full file is at `theme-full/snippets/nf-menu-picks.liquid`. It is a comment followed by one line: `,sale=files/cloud-pendant-lights-cream-living-room.jpg,best-sellers=files/cascading-ring-staircase-chandelier-grand-foyer.jpg,…` with 85 pairs in total, matching the table in section 3.

---

## 6. Checks on the preview after upload

1. On a phone (or DevTools at 390 px, DPR 3), open the menu and look at all four tiles. Check that the Best Sellers, New Arrivals and Sale photos crop well at about 2:1 and that the Sale chip reads clearly on the cream Nimbus photo.
2. Open Indoor, Outdoor, Decor and Shop By. Look at each 16:10 hero; the pick crop is `50% 38%`. If a fixture's top is cut off, change that pick's photo, or add a per-handle position.
3. In the Network panel, filtered on `cdn/shop/files`, check that tiles load at `width=480`, thumbnails at `120`/`180`, and heroes at `720`. There should be no `cdn.shopify.com` requests from the drawer, and nothing loads during the slide-in.
4. Throttle to Slow 4G and reload. After `load`, the 4 tiles and thumbnails should be fetched on idle, so the first menu open shows the photos straight away and they fade in without a pop.
5. Open a collection page with sub-collection tiles (Indoor, Outdoor, Decor). Each tile should show its pick.
6. Look at the items flagged "worth a look by eye" in section 3.

Rollback: upload the `.orig` files, and delete `snippets/nf-menu-picks.liquid` last.
