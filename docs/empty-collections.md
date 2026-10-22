# Empty collections audit (read-only)

Generated 2026-10-22 from the Admin API (Nora Furnish). No mutations were run.

## Method

- All 228 collections were listed. For each one, ACTIVE products were counted with `productsCount(query:"collection_id:<id> status:active")`. Every zero was then checked by listing the collection's products and their status, and every listed product was ARCHIVED or DRAFT.
- **53 candidates** have 0 ACTIVE products: 8 are completely empty, and 45 hold only ARCHIVED or DRAFT products.
- **Menus:** all 10 menus were walked to 3 levels and matched on `/collections/<handle>` or the collection resourceId. Menus the live theme uses: `main-menu-v3` (header and drawer), `top-bar`, `main-menu` (tile fallback) and `main-menu-preview` (nf-goes-well and nf-coll-mod default). No live theme file references `main-menu-backup-20261015` or `main-menu-preview-backup-20261015`, and `main-menu-v2` is unused. References in live menus are shown in **bold**.
- **Discounts:** all 14 discount nodes were checked. They use only `code-discount-eligible`, `multi-item-discount-eligible`, `member-eligible-regular` and all-items targets. The MEMBERWELCOME app discount's config metafield references only `member-eligible-regular` (490721771572). **No discount references any candidate.**
- **Theme code:** every file in the sections, snippets, templates, layout, config and blocks folders, plus the JS, JSON and liquid assets, was searched in the LIVE theme 187531657268 and the working copy 187544633396. Files were matched by md5 to the local caches, and the 62 uncached files were fetched into the scratchpad `fetched/` folder. Not searched: the nf-dims-*.json data files, photoswipe/vendor.min.js and the `_bak_*` backup files. Both themes return identical hits.
- **Pages and articles:** 39 pages and 58 articles were scanned for `/collections/<handle>`. The only hit is article `bathroom-vanity-lighting-guide`, which links to vanity-makeup-mirrors.

## Candidates

| handle | id | title | total products | active | type / rule | menu refs (**live**) | discount refs | theme refs | recommendation |
|---|---|---|---|---|---|---|---|---|---|
| display-racks | 316224077876 | Display Racks | 30 | 0 | manual | main-menu-backup-20261015: Decor > Wall Shelves > Display Racks | none | collection-subcategory-nav.liquid (`current ==` check, subnav display); header-sidebar.liquid `nfd_force storage-shelves=display-racks` (Storage drawer hero borrows this collection image); directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| corner-shelves | 316497035316 | Corner Shelves | 14 | 0 | manual | main-menu-backup-20261015: Decor > Wall Shelves > Corner Shelves; main-menu-preview-backup-20261015: Home & Decor > Shelves & Storage > Corner Shelves | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| soft-furnishings | 316501524532 | Soft Furnishings | 173 | 0 | smart: TAG EQUALS nav-soft-furnishings (any) | **top-bar: Shop By > Shop by Category > Soft Furnishings**; main-menu-backup-20261015: Soft Furnishings; main-menu-backup-20261015: Soft Furnishings > Soft Furnishings; main-menu-preview-backup-20261015: Home & Decor > Soft Furnishings | none | snippets/nf-cpills.liquid (rendered from layout/theme.liquid: hard link + image from collections[soft-furnishings]); assets/nf-drawer-v2.js label->URL map (link); header-sidebar.liquid skip/force lists; collection-subcategory-nav.liquid hero block + dept list; nf-collection-head.liquid dept list; nf-pdp-taxo.liquid breadcrumb dept list; list-collections.json (disabled block); index.nfp-test.json (test template) | delete (remove live top-bar items + hard-coded theme links first) |
| throw-pillows | 316501557300 | Throw Pillows | 21 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Soft Furnishings > Throw Pillows; main-menu-preview-backup-20261015: Home & Decor > Soft Furnishings > Throw Pillows | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| throw-blankets | 316501590068 | Throw Blankets | 28 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Soft Furnishings > Throw Blankets; main-menu-preview-backup-20261015: Home & Decor > Soft Furnishings > Throw Blankets | none | header-sidebar.liquid `nfd_force soft-furnishings=throw-blankets` (drawer hero image borrowed); directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| curtains-drapes | 316501655604 | Curtains & Drapes | 23 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Soft Furnishings > Curtains; main-menu-preview-backup-20261015: Home & Decor > Soft Furnishings > Curtains & Drapes | none | page.custom-curtains.json + page.custom-lighting.json `fallback_collection` (hero/card image fallback, cosmetic); directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| table-linens | 316501688372 | Table Linens | 21 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Soft Furnishings > Table Linens; main-menu-preview-backup-20261015: Home & Decor > Soft Furnishings > Table Linens | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| wall-mirrors | 316501721140 | Wall Mirrors | 3 | 0 | manual | main-menu-preview-backup-20261015: Home & Decor > Wall Decor > Wall Mirrors | none | collection-subcategory-nav.liquid (`current ==` check); directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| camping-lanterns | 316923445300 | Camping Lanterns | 11 | 0 | manual | main-menu-backup-20261015: Outdoor Lighting > Outdoor Lanterns > Camping Lanterns | none | snippets/nf-shop-nav.liquid tile list (link); directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| sunset-lamps | 316933832756 | Sunset Lamps | 11 | 0 | manual | main-menu-backup-20261015: Table & Floor Lamps > Ambient & Novelty > Sunset Lamps; main-menu-preview-backup-20261015: Indoor > Ambient Lighting > Sunset Lamps | none | sections/nf-coll-mod.liquid tile lists (link tiles); directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| vanity-makeup-mirrors | 316934357044 | Vanity & Makeup Mirrors | 6 | 0 | manual | - | none | sections/nf-coll-mod.liquid tile list (link tile); directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link); blog article bathroom-vanity-lighting-guide links it | delete |
| floating-shelves | 316934717492 | Floating Shelves | 25 | 0 | manual | main-menu-backup-20261015: Decor > Wall Shelves > Floating Shelves; main-menu-preview-backup-20261015: Home & Decor > Shelves & Storage > Floating Shelves | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| shoe-storage | 316934750260 | Shoe Storage | 20 | 0 | manual | main-menu-backup-20261015: Decor > Storage > Shoe Storage; main-menu-preview-backup-20261015: Home & Decor > Shelves & Storage > Shoe Storage | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| poufs-floor-cushions | 316934881332 | Poufs & Floor Cushions | 49 | 0 | smart: TAG EQUALS nav-poufs-floor-cushions (any) | **top-bar: Shop By > Shop by Category > Poufs & Floor Cushions**; main-menu-backup-20261015: Soft Furnishings > Poufs & Floor Cushions | none | assets/nf-drawer-v2.js label->URL map (link); header-sidebar.liquid skip list; collection-subcategory-nav.liquid hero block; nf-collection-head.liquid dept list; list-collections.json (disabled block); index.nfp-test.json (test template) | delete (remove live top-bar items + hard-coded theme links first) |
| aroma-diffusers | 316935733300 | Aroma Diffusers & Humidifiers | 23 | 0 | manual | main-menu-backup-20261015: Decor > Home Fragrance > Aroma Diffusers & Humidifiers; main-menu-preview-backup-20261015: Home & Decor > Home Fragrance > Aroma Diffusers | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| bath-mats-rugs | 316937076788 | Bath Mats & Rugs | 10 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Bath; main-menu-backup-20261015: Soft Furnishings > Bath > Bath Mats & Rugs; main-menu-preview-backup-20261015: Home & Decor > Bath; main-menu-preview-backup-20261015: Home & Decor > Bath > Bath Mats & Rugs | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| shower-curtains | 316937109556 | Shower Curtains | 15 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Bath > Shower Curtains; main-menu-preview-backup-20261015: Home & Decor > Bath > Shower Curtains | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| incense-holders-burners | 319143510068 | Incense Holders & Burners | 28 | 0 | manual | main-menu-backup-20261015: Decor > Home Fragrance > Incense Holders & Burners; main-menu-preview-backup-20261015: Home & Decor > Home Fragrance > Incense Holders | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| poufs-ottomans | 319143608372 | Poufs & Ottomans | 26 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Poufs & Floor Cushions > Poufs & Ottomans; main-menu-preview-backup-20261015: Home & Decor > Soft Furnishings > Poufs & Ottomans | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| floor-cushions | 319143641140 | Floor Cushions | 26 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Poufs & Floor Cushions > Floor Cushions | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| wall-shelves | 319231721524 | Wall Shelves | 66 | 0 | smart: TAG EQUALS grp-wall-shelves (any) | main-menu-backup-20261015: Decor > Wall Shelves | none | directory tiles (templates/list-collections.json + list-collections.nf-directory.json, link) | delete |
| home-fragrance-picks | 319468929076 | Home Fragrance Picks | 4 | 0 | manual | - | none | none | delete |
| outdoor-lighting-picks | 319469912116 | Outdoor Lighting Picks | 3 | 0 | manual | - | none | none | delete |
| soft-furnishings-picks | 319470207028 | Soft Furnishings Picks | 4 | 0 | manual | - | none | none | delete |
| poufs-and-floor-cushions-picks | 319470665780 | Poufs and Floor Cushions Picks | 4 | 0 | manual | - | none | none | delete |
| halloween-inflatables | 489639542836 | Halloween Inflatables | 18 | 0 | smart: TAG EQUALS hw-inflatables | main-menu-backup-20261015: Autumn at Home > Halloween Inflatables | none | nf-pdp-taxo.liquid exclusion list only | delete |
| halloween-decor | 489639575604 | Halloween Decor | 12 | 0 | smart: TAG EQUALS hw-decor | main-menu-backup-20261015: Autumn at Home > Halloween Decor | none | nf-pdp-taxo.liquid exclusion list only | delete |
| fall-decor | 489639608372 | Fall Decor | 16 | 0 | smart: TAG EQUALS fall-decor | main-menu-backup-20261015: Autumn at Home > Fall Decor | none | nf-pdp-taxo.liquid exclusion list; nf-seasonal.liquid uses the TAG fall-decor (not the collection) | delete |
| short-term-rentals-room-sets | 490660692020 | Short Term Rentals Room Sets | 10 | 0 | smart: TAG EQUALS room-set-short-term-rentals | - | none | **layout/theme.liquid L8-34 room-set redirect shim (FUNCTIONAL): when this collection page renders it meta-refreshes to /collections/room-sets/...; deleting the collection turns the old URL into a 404** | keep-functional (redirect shim) - or add URL redirect first, then delete |
| schools-and-libraries-room-sets | 490660724788 | Schools and Libraries Room Sets | 10 | 0 | smart: TAG EQUALS room-set-schools-and-libraries | - | none | **layout/theme.liquid L8-34 room-set redirect shim (FUNCTIONAL): when this collection page renders it meta-refreshes to /collections/room-sets/...; deleting the collection turns the old URL into a 404** | keep-functional (redirect shim) - or add URL redirect first, then delete |
| gyms-and-studios-room-sets | 490660757556 | Gyms and Studios Room Sets | 9 | 0 | smart: TAG EQUALS room-set-gyms-and-studios | - | none | **layout/theme.liquid L8-34 room-set redirect shim (FUNCTIONAL): when this collection page renders it meta-refreshes to /collections/room-sets/...; deleting the collection turns the old URL into a 404** | keep-functional (redirect shim) - or add URL redirect first, then delete |
| model-homes-and-staging-room-sets | 490660790324 | Model Homes and Staging Room Sets | 11 | 0 | smart: TAG EQUALS room-set-model-homes-and-staging | - | none | **layout/theme.liquid L8-34 room-set redirect shim (FUNCTIONAL): when this collection page renders it meta-refreshes to /collections/room-sets/...; deleting the collection turns the old URL into a 404** | keep-functional (redirect shim) - or add URL redirect first, then delete |
| towels | 490712825908 | Towels | 6 | 0 | manual | main-menu-backup-20261015: Soft Furnishings > Bath > Towels; main-menu-preview-backup-20261015: Home & Decor > Bath > Towels | none | none | delete |
| members-only | 490721673268 | Members Only | 0 | 0 | smart: TAG EQUALS members-only | - | none | **sections/nf-mem-portal.liquid L116 `collections['members-only']` drives the Members-only shop panel (FUNCTIONAL)**; snippets/buy-buttons.liquid gates by product TAG members-only (not the collection); nf-pdp-taxo.liquid exclusion list | keep-functional (members portal) |
| switches-and-controls | 490722852916 | Switches and Controls | 0 | 0 | smart: TAG EQUALS nav-switches-controls | - | none | none | delete |
| light-switches | 490722885684 | Light Switches | 0 | 0 | manual | - | none | none | delete |
| dimmer-switches | 490722918452 | Dimmer Switches | 0 | 0 | manual | - | none | none | delete |
| power-outlets | 490722951220 | Power Outlets | 0 | 0 | manual | - | none | none | delete |
| wall-plates | 490722983988 | Wall Plates | 0 | 0 | manual | - | none | none | delete |
| electrical-kits | 490723016756 | Electrical Kits | 0 | 0 | manual | - | none | none | delete |
| plate-kits | 490723049524 | Plate Kits | 0 | 0 | manual | - | none | none | delete |
| alba-collection | 512223805492 | Alba Collection | 6 | 0 | manual | - | none | none | delete |
| aurelius-collection | 512223838260 | Aurelius Collection | 6 | 0 | manual | - | none | none | delete |
| angelica-collection | 512223871028 | Angelica Collection | 4 | 0 | manual | - | none | none | delete |
| arabella-collection | 512223903796 | Arabella Collection | 4 | 0 | manual | - | none | none | delete |
| celestial-collection | 512223936564 | Celestial Collection | 3 | 0 | manual | - | none | none | delete |
| emma-collection | 512223969332 | Emma Collection | 5 | 0 | manual | - | none | none | delete |
| haylen-collection | 512224002100 | Haylen Collection | 6 | 0 | manual | - | none | none | delete |
| obsidian-collection | 512224034868 | Obsidian Collection | 3 | 0 | manual | - | none | none | delete |
| raven-collection | 512224067636 | Raven Collection | 3 | 0 | manual | - | none | none | delete |
| solara-brand-collection | 512224100404 | Solara Collection | 4 | 0 | manual | - | none | none | delete |
| umbra-collection | 512224133172 | Umbra Collection | 2 | 0 | manual | - | none | none | delete |
| velina-collection | 512224165940 | Velina Collection | 4 | 0 | manual | - | none | none | delete |
## Keep (functional)

- **members-only** (490721673268): `sections/nf-mem-portal.liquid` line 116 reads `collections['members-only']` to fill the "Members only shop" panel on the membership portal. It shows an empty-state message while the collection has 0 products. This collection is part of the membership logic, so keep it even though it is empty. Product gating in buy-buttons uses the members-only *tag*.
- **short-term-rentals-room-sets, schools-and-libraries-room-sets, gyms-and-studios-room-sets, model-homes-and-staging-room-sets**: `layout/theme.liquid` lines 8-34 (both themes) contain a redirect shim. When one of these collection pages renders, it sets a canonical link and meta-refreshes to `/collections/room-sets/...`. Deleting the collection breaks the redirect and the old URL returns 404. Keep these, or create URL redirects in Navigation > URL redirects before deleting them.

## Delete, after cleanup

- **soft-furnishings** and **poufs-floor-cushions** are still live navigation hubs:
  - Live menu items: top-bar "Shop By > Shop by Category > Soft Furnishings" and "... > Poufs & Floor Cushions".
  - Hard-coded links in `snippets/nf-cpills.liquid` (soft-furnishings, rendered by layout/theme.liquid) and in the label-to-URL map in `assets/nf-drawer-v2.js` (both handles).
  - Remove those links first, otherwise they will point to a 404.
- The cosmetic image dependencies degrade quietly: the header-sidebar `nfd_force` drawer heroes (display-racks, throw-blankets) and the curtains-drapes `fallback_collection` on page.custom-curtains and page.custom-lighting. Clear those settings when convenient.
- The directory templates (`templates/list-collections*.json`) and the `nf-coll-mod` / `nf-shop-nav` tile lists name the deleted handles in their group strings. Prune those strings so no empty tiles or dead links remain.

## Delete, no references

home-fragrance-picks, outdoor-lighting-picks, soft-furnishings-picks, poufs-and-floor-cushions-picks, towels (backup menus only), the switches family (switches-and-controls, light-switches, dimmer-switches, power-outlets, wall-plates, electrical-kits, plate-kits), and the 12 brand families (alba, aurelius, angelica, arabella, celestial, emma, haylen, obsidian, raven, solara-brand, umbra and velina collections).

The switches family was created 2026-10-09 and already has images and descriptions, which suggests a planned product line. Confirm with the owner before deleting it.

## Recreate definitions

The JSON below has one entry per candidate. `productIds` lists the members of manual collections. Smart collections rebuild from `ruleSet`, and their `memberProducts` shows the current matches with each product's status.

```json
[
 {
  "id": "gid://shopify/Collection/316224077876",
  "title": "Display Racks",
  "handle": "display-racks",
  "descriptionHtml": "<p>Display racks and stands that put small things on show and keep them organized. The range includes clear acrylic ladder shelves, figure display cases and CD and record racks, wooden jewelry stands, a wall mounted sword display, walnut and bamboo headphone stands, stackable and slanted wine racks, a two tier mug rack and tiered desktop risers.</p><p>Pick the material to suit what you display. Clear acrylic keeps the focus on collectibles and figures, while wood works well for jewelry, mugs and wine. Tiered risers help items at the back stay visible, so measure shelf depth and item height before choosing the number of tiers.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Display Racks, Display Racks and Stands | Nora Furnish",
   "description": "Display racks and stands for plants, books, collectibles and shoes, in metal, wood and bamboo for small and large rooms. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/image_1787879611831_200fc914_1787879611999_c5e4fa90.png?v=1789850015",
   "altText": "Walnut tiered display rack holding mugs on a warm kitchen counter"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8897625915444",
   "gid://shopify/Product/8897625882676",
   "gid://shopify/Product/8895989579828",
   "gid://shopify/Product/8895818170420",
   "gid://shopify/Product/8895814860852",
   "gid://shopify/Product/8895814828084",
   "gid://shopify/Product/8895814762548",
   "gid://shopify/Product/8895814697012",
   "gid://shopify/Product/8895814664244",
   "gid://shopify/Product/8895814631476",
   "gid://shopify/Product/8895814565940",
   "gid://shopify/Product/8895814533172",
   "gid://shopify/Product/8895814500404",
   "gid://shopify/Product/8895814467636",
   "gid://shopify/Product/8895814205492",
   "gid://shopify/Product/8895447203892",
   "gid://shopify/Product/8895447138356",
   "gid://shopify/Product/8895447105588",
   "gid://shopify/Product/8895447040052",
   "gid://shopify/Product/8859818852404",
   "gid://shopify/Product/8859818819636",
   "gid://shopify/Product/8856724537396",
   "gid://shopify/Product/8856724504628",
   "gid://shopify/Product/8856724471860",
   "gid://shopify/Product/8856724308020",
   "gid://shopify/Product/8856724242484",
   "gid://shopify/Product/8856723456052",
   "gid://shopify/Product/8856723423284",
   "gid://shopify/Product/8856723390516",
   "gid://shopify/Product/8854477701172"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316497035316",
  "title": "Corner Shelves",
  "handle": "corner-shelves",
  "descriptionHtml": "<p>Corner shelves that make use of corners in bathrooms, kitchens, offices and living rooms. The collection includes a tension pole corner shower organizer, suction cup and stainless steel shower shelves, a brushed gold bathroom corner shelf, tempered glass shelves, a corner shelf with towel rack, a hanging wood corner shelf, a geometric wooden wall shelf, a slim spice rack and a clamp on desk shelf.</p><p>In the shower, tension pole and suction cup designs install without drilling, but suction cups need smooth, non porous tile and clean surfaces to hold. For heavier items or living spaces, a screw mounted shelf is more secure.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Corner Shelves, Corner Shelves and Stands | Nora Furnish",
   "description": "Corner shelves that use awkward corners for books, plants and decor, in wall mounted and freestanding designs. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/Sd4323024747b486f9c7a6b79f15ee1988.jpg?v=1789281423",
   "altText": "Hanging wooden shelf with a potted plant in warm sunlight"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8896118849588",
   "gid://shopify/Product/8895989579828",
   "gid://shopify/Product/8895490326580",
   "gid://shopify/Product/8895490293812",
   "gid://shopify/Product/8895490261044",
   "gid://shopify/Product/8895490228276",
   "gid://shopify/Product/8895490195508",
   "gid://shopify/Product/8895490129972",
   "gid://shopify/Product/8895490097204",
   "gid://shopify/Product/8892734406708",
   "gid://shopify/Product/8856724668468",
   "gid://shopify/Product/8856724635700",
   "gid://shopify/Product/8856724209716",
   "gid://shopify/Product/8854478225460"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316501524532",
  "title": "Soft Furnishings",
  "handle": "soft-furnishings",
  "descriptionHtml": "<p>Soft furnishings for the bedroom, living room, bath and dining table. The collection includes cushion covers in chenille, corduroy, waffle knit and tufted plush, fleece, flannel and lamb fluff throw blankets, linen blackout and embroidered sheer curtains, jute and linen table runners, yarn dyed cotton towels, shower curtains and liners and absorbent bath and floor mats.</p><p>Mix textures within one color family so a room feels layered rather than busy, such as a corduroy cushion with a knit throw. Before ordering curtains, measure window width and the height from rod to floor.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Soft Furnishings, Throws, Pillows and Curtains | Nora Furnish",
   "description": "Shop soft furnishings at Nora Furnish. Cushions, throw blankets, curtains and table linens with free US shipping and 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/nf-tile-soft-furnishings.jpg?v=1789847220",
   "altText": "Rust knit throw and ochre cushions on a linen sofa in evening light"
  },
  "ruleSet": {
   "appliedDisjunctively": true,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "nav-soft-furnishings"
    }
   ]
  },
  "productIds": null,
  "memberProducts": []
 },
 {
  "id": "gid://shopify/Collection/316501557300",
  "title": "Throw Pillows",
  "handle": "throw-pillows",
  "descriptionHtml": "<p>Throw pillows, cushion covers and pillowcases for sofas, chairs and beds. The collection includes cushion covers in chenille, corduroy, waffle knit, diamond tufted plush and boho tassel styles, flower shaped plush pillows, velvet and coral fleece covers, mulberry silk and bamboo pillowcases, plush shams and waterproof zippered pillow protectors.</p><p>Match the cover to your insert size, or choose an insert about 2 inches larger than the cover for a fuller look. On a sofa, mix two or three sizes and textures, with larger pillows at the ends. Silk pillowcases do best washed cool and gently, and zippered protectors help a bed pillow last longer.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Throw Pillows, Decorative Pillow Covers | Nora Furnish",
   "description": "Throw pillows and pillow covers for sofas and beds, in linen, velvet, boucle and woven textures in modern and boho styles. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/nf-tile-throw-pillows.jpg?v=1789850834",
   "altText": "Stack of terracotta rust and ochre cushions on a walnut bench in low warm light"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8897627324468",
   "gid://shopify/Product/8897627291700",
   "gid://shopify/Product/8897627258932",
   "gid://shopify/Product/8897625653300",
   "gid://shopify/Product/8896735445044",
   "gid://shopify/Product/8896111902772",
   "gid://shopify/Product/8896111870004",
   "gid://shopify/Product/8896111837236",
   "gid://shopify/Product/8896085655604",
   "gid://shopify/Product/8895964282932",
   "gid://shopify/Product/8865056555060",
   "gid://shopify/Product/8865056489524",
   "gid://shopify/Product/8865056358452",
   "gid://shopify/Product/8865056292916",
   "gid://shopify/Product/8865056260148",
   "gid://shopify/Product/8865056194612",
   "gid://shopify/Product/8860347170868",
   "gid://shopify/Product/8858190282804",
   "gid://shopify/Product/8858190250036",
   "gid://shopify/Product/8858190217268",
   "gid://shopify/Product/8858190151732"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316501590068",
  "title": "Throw Blankets",
  "handle": "throw-blankets",
  "descriptionHtml": "<p>Throw blankets for sofas, beds and reading chairs. The collection includes chunky and tasseled knit throws, Nordic plaid and geometric knits, chenille and leopard jacquard designs, extra soft flannel, coral fleece and lamb fluff blankets, a cotton gauze knit, a cooling ice silk summer blanket, a wearable flannel shawl and a knit bed runner.</p><p>Choose the fabric for the season and how you use it. Fleece, flannel and lamb fluff are warm for winter evenings, cotton gauze and ice silk stay light for warm months, and chunky knits add texture as a sofa accent. A bed runner across the foot of the bed adds color without a full coverlet.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Throw Blankets, Throws for Sofa and Bed | Nora Furnish",
   "description": "Throw blankets for sofas and beds, in knit, fleece, cotton and chunky textures that keep you warm and finish a room. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S30fc1ffecf804953b152657251e68917i_730f53b6-884e-4012-a33d-a4ba485b324f.webp?v=1789849958",
   "altText": "Rust waffle knit throw blanket draped over a chair in a warm room"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8897168736308",
   "gid://shopify/Product/8897168703540",
   "gid://shopify/Product/8897168638004",
   "gid://shopify/Product/8897168572468",
   "gid://shopify/Product/8897168539700",
   "gid://shopify/Product/8897168506932",
   "gid://shopify/Product/8897168474164",
   "gid://shopify/Product/8897168441396",
   "gid://shopify/Product/8897168408628",
   "gid://shopify/Product/8860346679348",
   "gid://shopify/Product/8860346646580",
   "gid://shopify/Product/8860346613812",
   "gid://shopify/Product/8860346581044",
   "gid://shopify/Product/8860346548276",
   "gid://shopify/Product/8860346482740",
   "gid://shopify/Product/8860346449972",
   "gid://shopify/Product/8860346417204",
   "gid://shopify/Product/8860346384436",
   "gid://shopify/Product/8860346318900",
   "gid://shopify/Product/8859164770356",
   "gid://shopify/Product/8859164737588",
   "gid://shopify/Product/8859164704820",
   "gid://shopify/Product/8859164672052",
   "gid://shopify/Product/8859164639284",
   "gid://shopify/Product/8859164606516",
   "gid://shopify/Product/8859164540980",
   "gid://shopify/Product/8858189922356",
   "gid://shopify/Product/8858189889588"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316501655604",
  "title": "Curtains & Drapes",
  "handle": "curtains-drapes",
  "descriptionHtml": "<p>Curtains and drapes for living rooms, bedrooms and nurseries. The collection includes linen, velvet, chenille and herringbone blackout panels, thermal noise reducing curtains, embroidered and jacquard tulle sheers, S fold and solid white sheers, Japanese style wrinkled linen panels, gold foil marble and embossed designs, and no drill and self adhesive blackout panels.</p><p>For fullness, the total width of your panels should be about 1.5 to 2 times the window width. Mount the rod a few inches above the frame and extend it past each side so open curtains do not cover the glass. For bedrooms, pair a blackout panel with a sheer to control light through the day.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Curtains & Drapes, Blackout and Sheer Curtains | Nora Furnish",
   "description": "Curtains and drapes for living rooms and bedrooms, in blackout, thermal, linen and sheer panels in many widths and lengths. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/image_1787878677242_dd8cb49a_1787878677333_374a5f83.png?v=1789849943",
   "altText": "Burgundy velvet drapes beside an armchair lit by a warm floor lamp"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8897167720500",
   "gid://shopify/Product/8897167687732",
   "gid://shopify/Product/8897167654964",
   "gid://shopify/Product/8897167622196",
   "gid://shopify/Product/8897167589428",
   "gid://shopify/Product/8897167556660",
   "gid://shopify/Product/8897167130676",
   "gid://shopify/Product/8896118980660",
   "gid://shopify/Product/8896118947892",
   "gid://shopify/Product/8865468940340",
   "gid://shopify/Product/8865468907572",
   "gid://shopify/Product/8865468874804",
   "gid://shopify/Product/8865468842036",
   "gid://shopify/Product/8865468809268",
   "gid://shopify/Product/8865468383284",
   "gid://shopify/Product/8865057865780",
   "gid://shopify/Product/8865057800244",
   "gid://shopify/Product/8865057734708",
   "gid://shopify/Product/8865057570868",
   "gid://shopify/Product/8865057538100",
   "gid://shopify/Product/8865057505332",
   "gid://shopify/Product/8865057472564",
   "gid://shopify/Product/8865057243188"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316501688372",
  "title": "Table Linens",
  "handle": "table-linens",
  "descriptionHtml": "<p>Table linens for everyday meals, holidays and parties. The collection includes table runners in jute burlap, linen, cotton linen, jacquard, gauze cheesecloth and metallic gold, patchwork burlap and lace and holiday elk runners, a waterproof cotton linen runner, rattan, braided, vinyl woven and metallic leaf placemats and a placemat and coaster set.</p><p>A runner usually looks best about one third the width of the table, with 6 to 12 inches of overhang at each end. For daily use with kids, washable vinyl or waterproof runners and placemats are easier to keep clean, while jute, linen and gauze suit relaxed or rustic settings.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Table Linens, Tablecloths and Runners | Nora Furnish",
   "description": "Table linens for everyday meals and holidays: tablecloths, runners, placemats and napkins in cotton, linen and lace. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S3f3cca6c87f34df5ab01cdc18f548256O.webp?v=1789849973",
   "altText": "Ochre patterned table runner on a candlelit dining table"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8897627619380",
   "gid://shopify/Product/8897627422772",
   "gid://shopify/Product/8897627390004",
   "gid://shopify/Product/8897627357236",
   "gid://shopify/Product/8896118685748",
   "gid://shopify/Product/8896112427060",
   "gid://shopify/Product/8896111804468",
   "gid://shopify/Product/8895964446772",
   "gid://shopify/Product/8895964414004",
   "gid://shopify/Product/8865468448820",
   "gid://shopify/Product/8865468416052",
   "gid://shopify/Product/8865457373236",
   "gid://shopify/Product/8860346843188",
   "gid://shopify/Product/8860346810420",
   "gid://shopify/Product/8860346777652",
   "gid://shopify/Product/8860346744884",
   "gid://shopify/Product/8860346712116",
   "gid://shopify/Product/8860346286132",
   "gid://shopify/Product/8858190053428",
   "gid://shopify/Product/8858189725748",
   "gid://shopify/Product/8858189692980"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316501721140",
  "title": "Wall Mirrors",
  "handle": "wall-mirrors",
  "descriptionHtml": "<p>Mirrors and mirrored accents that add light and reflection to a room. The collection currently includes a set of 10 round mirror candle plates, which can sit under pillar candles on a dining table, mantel or tray to reflect candlelight and protect the surface beneath.</p><p>When placing any mirror or mirrored piece, think about what it will reflect. Opposite or beside a window, a mirror bounces daylight further into the room. With candle plates, choose a plate a little wider than the candle base so wax stays on the glass.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Wall Mirrors, Decorative Wall Mirrors | Nora Furnish",
   "description": "Wall mirrors for entryways, bathrooms and living rooms, in round, arched and full length frames from modern to vintage. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/Seec9a860bc0d464881d1a8e3dac004d97.webp?v=1789849542",
   "altText": "Ornate gold oval wall mirror on a dark wall beside a lit brass candlestick"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8847070396468",
   "gid://shopify/Product/8847070199860",
   "gid://shopify/Product/8847069315124"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316923445300",
  "title": "Camping Lanterns",
  "handle": "camping-lanterns",
  "descriptionHtml": "<p>Camping lanterns are compact lights for tents, campsites and backup at home. This collection includes magnetic and rechargeable LED lanterns, USB C rechargeable camping lights, tent lanterns, a retro style portable lantern, a solar leaf lantern and a solar string light with a hook.</p><p>Think about how you will hang it. A hook works for tent loops and branches, while a magnetic base sticks to a car or metal table. USB C charging lets you top up from the same power bank as your phone.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Camping Lanterns, LED Camping Lanterns | Nora Furnish",
   "description": "Camping lanterns and tent lights for trips, patios and emergencies, in rechargeable and solar LED designs. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/image_1787875918728_d55cb5b6_1787875919301_b769210b.png?v=1789247088",
   "altText": "Vintage camping lantern glowing on a wooden porch at night"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8895822889012",
   "gid://shopify/Product/8868264542260",
   "gid://shopify/Product/8868264345652",
   "gid://shopify/Product/8868264181812",
   "gid://shopify/Product/8866984984628",
   "gid://shopify/Product/8866984951860",
   "gid://shopify/Product/8866941960244",
   "gid://shopify/Product/8866941927476",
   "gid://shopify/Product/8865940308020",
   "gid://shopify/Product/8865940078644",
   "gid://shopify/Product/8847901294644"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316933832756",
  "title": "Sunset Lamps",
  "handle": "sunset-lamps",
  "descriptionHtml": "<p>Sunset lamps project a warm circle of colored light onto a wall, a popular look for bedrooms, photos and video backdrops. This collection includes table and desk projection lamps, a crystal sunset lamp, a USB smart projector, a rainbow projector, an astronaut projector and an ocean wave lamp.</p><p>Place the lamp a few feet from a plain, light colored wall; the farther away it sits, the larger and softer the circle. An adjustable head lets you move the glow between wall and ceiling.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Sunset Lamps, Sunset Projection Lamps | Nora Furnish",
   "description": "Sunset lamps that project a warm glow onto the wall, for bedrooms, photos and relaxing. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S66773e48edf3427c92ef6b76945582ffv.webp?v=1789247607",
   "altText": "Oval glass sunset lamp casting a warm beam"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8897168310324",
   "gid://shopify/Product/8895818203188",
   "gid://shopify/Product/8868342071348",
   "gid://shopify/Product/8847901950004",
   "gid://shopify/Product/8847749120052",
   "gid://shopify/Product/8847749087284",
   "gid://shopify/Product/8847749054516",
   "gid://shopify/Product/8847749021748",
   "gid://shopify/Product/8847748956212",
   "gid://shopify/Product/8847748890676",
   "gid://shopify/Product/8847748857908"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316934357044",
  "title": "Vanity & Makeup Mirrors",
  "handle": "vanity-makeup-mirrors",
  "descriptionHtml": "",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Vanity & Makeup Mirrors, Lighted Makeup Mirrors | Nora Furnish",
   "description": "Vanity and makeup mirrors with LED lights and magnification for dressing tables and bathrooms. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/image_1787961265244_1ceab12a_1787961265429_3cb69ba5.png?v=1789849557",
   "altText": "Lit round makeup mirror on a warm oak vanity at dusk"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8852480065588",
   "gid://shopify/Product/8852479836212",
   "gid://shopify/Product/8851522519092",
   "gid://shopify/Product/8847070396468",
   "gid://shopify/Product/8847070199860",
   "gid://shopify/Product/8847069315124"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316934717492",
  "title": "Floating Shelves",
  "handle": "floating-shelves",
  "descriptionHtml": "<p>Floating shelves mount directly to the wall to hold books, plants and small decor. This collection includes solid wood floating bookshelves, boho arch and three tier shelves, a hidden compartment shelf, macrame and gothic fence designs, stainless steel and matte black bathroom shelves, plus acrylic display risers and a ladder shelf.</p><p>Fix shelves into wall studs, or use anchors rated for the weight you plan to carry, especially for books. Leave 10 to 12 inches between stacked shelves for most decor and more for tall plants.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Floating Shelves, Wall Mounted Floating Shelves | Nora Furnish",
   "description": "Floating shelves for books, plants and decor, in wood and metal, for living rooms, kitchens and bathrooms. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S6bd4996b024f450db7bd4dc05f90ff7f4.webp?v=1789850030",
   "altText": "Arched wooden floating shelf on a dark wall above lit candles"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8854477930548",
   "gid://shopify/Product/8897626013748",
   "gid://shopify/Product/8897625980980",
   "gid://shopify/Product/8895989612596",
   "gid://shopify/Product/8895490621492",
   "gid://shopify/Product/8892734406708",
   "gid://shopify/Product/8892734046260",
   "gid://shopify/Product/8856724471860",
   "gid://shopify/Product/8856723357748",
   "gid://shopify/Product/8854478192692",
   "gid://shopify/Product/8854478159924",
   "gid://shopify/Product/8854478127156",
   "gid://shopify/Product/8854478094388",
   "gid://shopify/Product/8854478061620",
   "gid://shopify/Product/8854478028852",
   "gid://shopify/Product/8854477996084",
   "gid://shopify/Product/8854477963316",
   "gid://shopify/Product/8854477897780",
   "gid://shopify/Product/8854477865012",
   "gid://shopify/Product/8854477832244",
   "gid://shopify/Product/8854477799476",
   "gid://shopify/Product/8854477766708",
   "gid://shopify/Product/8854477733940",
   "gid://shopify/Product/8854477635636",
   "gid://shopify/Product/8854477602868"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316934750260",
  "title": "Shoe Storage",
  "handle": "shoe-storage",
  "descriptionHtml": "<p>Shoe storage for entryways, closets and small apartments. The range covers clear foldable and stackable shoe boxes, multi tier metal racks, adjustable and telescopic racks, dustproof shoe cabinets, slot organizers that stack one shoe over the other, and a 10 tier organizer that hangs over a door.</p>\n<p>Measure the space and your largest pair before choosing. Boots and high tops need a taller tier or box than flats and sneakers, and a closed cabinet or lidded box keeps dust off shoes you do not wear every week.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Shoe Storage, Shoe Racks and Organizers | Nora Furnish",
   "description": "Shoe storage for entryways, closets and hallways, including racks, cabinets and stackable boxes. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/Sc0fc92b23a81421d95898966f75b103ei.webp?v=1789849987",
   "altText": "Bamboo shoe bench against a warm cream entryway wall"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8859818688564",
   "gid://shopify/Product/8859818623028",
   "gid://shopify/Product/8859818590260",
   "gid://shopify/Product/8859818557492",
   "gid://shopify/Product/8859818491956",
   "gid://shopify/Product/8859818459188",
   "gid://shopify/Product/8859818393652",
   "gid://shopify/Product/8856723947572",
   "gid://shopify/Product/8856723914804",
   "gid://shopify/Product/8856723882036",
   "gid://shopify/Product/8856723849268",
   "gid://shopify/Product/8856723816500",
   "gid://shopify/Product/8856723783732",
   "gid://shopify/Product/8856723750964",
   "gid://shopify/Product/8856723718196",
   "gid://shopify/Product/8856723685428",
   "gid://shopify/Product/8856723619892",
   "gid://shopify/Product/8856723554356",
   "gid://shopify/Product/8856723521588",
   "gid://shopify/Product/8856723324980"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316934881332",
  "title": "Poufs & Floor Cushions",
  "handle": "poufs-floor-cushions",
  "descriptionHtml": "<p>Extra seating that sits low and moves easily. Choose from storage ottomans and poufs in teddy velvet, PU leather and boho prints, tufted meditation cushions, pleated pumpkin cushions, woven straw and cotton tatami cushions, round seat pads and Moroccan leather pouf covers, plus cat paw and cartoon cushions for kids.</p>\n<p>Check whether a pouf comes as a cover only. Unstuffed and fillable covers need filling, and spare blankets or out of season clothes work well, which adds storage and lets you set the firmness. For a footrest, aim for a height close to your sofa seat.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Poufs & Floor Cushions | Poufs, Ottomans and Floor Pillows",
   "description": "Shop poufs and floor cushions at Nora Furnish. Ottomans, floor pillows and meditation cushions with free US shipping and 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/image_1787887666643_0c4ec075_1787887666941_f0f5bb1f.png?v=1789849039",
   "altText": "Tan leather pouf on a terracotta tiled floor in warm low light"
  },
  "ruleSet": {
   "appliedDisjunctively": true,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "nav-poufs-floor-cushions"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/8896735608884",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896735576116",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896735543348",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896735510580",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896735477812",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896735412276",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896711622708",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896711589940",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896711491636",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896711426100",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8896711393332",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896711295028",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8896711262260",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896711163956",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896711131188",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8896711065652",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895495438388",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895495307316",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872545746996",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872545714228",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8872545648692",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8872545517620",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872545452084",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8872545419316",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872544960564",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872544927796",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872538177588",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872538112052",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8872538013748",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537948212",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537915444",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537849908",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537784372",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537751604",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537718836",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537653300",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537620532",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537587764",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537522228",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8872537391156",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8868066099252",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8868066066484",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854478389300",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8852479574068",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8852479541300",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8852479311924",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8852479279156",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8852479246388",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8852479082548",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/316935733300",
  "title": "Aroma Diffusers & Humidifiers",
  "handle": "aroma-diffusers",
  "descriptionHtml": "<p>Diffusers and humidifiers for bedrooms, offices, desks and cars. The range includes 3L ultrasonic cool mist humidifiers, flame effect aroma diffusers, a mini fireplace diffuser, raindrop and onion shaped humidifiers, models with built in night lights, a smart WiFi diffuser, portable USB and car diffusers, and a waterless compact diffuser.</p>\n<p>Pick tank size by how long you want it to run. A 3L humidifier suits a bedroom overnight, while a small USB model suits a desk. Add essential oil only to units sold as aroma diffusers, and empty and dry the tank every few days to keep it clean.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Aroma Diffusers & Humidifiers | Essential Oil Diffusers",
   "description": "Aroma diffusers and humidifiers for essential oils, with mist and light settings for bedrooms and living rooms. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S064f1993423046ec9e430fc6587d6142r.jpg?v=1789281413",
   "altText": "Flame effect aroma diffuser glowing on a table"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8865457274932",
   "gid://shopify/Product/8862668226612",
   "gid://shopify/Product/8862668193844",
   "gid://shopify/Product/8862668161076",
   "gid://shopify/Product/8862668128308",
   "gid://shopify/Product/8862668095540",
   "gid://shopify/Product/8862667931700",
   "gid://shopify/Product/8862667604020",
   "gid://shopify/Product/8862667538484",
   "gid://shopify/Product/8862667505716",
   "gid://shopify/Product/8862667472948",
   "gid://shopify/Product/8862667440180",
   "gid://shopify/Product/8862667407412",
   "gid://shopify/Product/8862667374644",
   "gid://shopify/Product/8862667309108",
   "gid://shopify/Product/8862667276340",
   "gid://shopify/Product/8862667243572",
   "gid://shopify/Product/8862667178036",
   "gid://shopify/Product/8862667112500",
   "gid://shopify/Product/8862667079732",
   "gid://shopify/Product/8862667046964",
   "gid://shopify/Product/8859164147764",
   "gid://shopify/Product/8858189824052"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316937076788",
  "title": "Bath Mats & Rugs",
  "handle": "bath-mats-rugs",
  "descriptionHtml": "<p>Bath mats and bathroom textiles in one place. There are absorbent non slip mats, quick dry 3 piece mat sets, velvet memory foam rug sets, L shaped and cat head diatomaceous earth mats and curved shower room mats, along with fabric, waffle, linen and PEVA shower curtains to match.</p>\n<p>Diatomaceous earth mats dry quickly on hard floors and suit the spot right outside the shower, while memory foam and velvet rugs feel softer underfoot by the sink. Check that the backing grips your floor type, and wash fabric mats often so they stay absorbent.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Bath Mats & Rugs, Bath Mats and Bathroom Rugs | Nora Furnish",
   "description": "Bath mats and bathroom rugs that are soft, absorbent and non slip, in many sizes and colors. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/nf-tile-bath-mats-rugs.jpg?v=1789850835",
   "altText": "Rust tufted bath mat on a warm oak floor beside a stone bath at golden hour"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8897168244788",
   "gid://shopify/Product/8897168179252",
   "gid://shopify/Product/8896085491764",
   "gid://shopify/Product/8895447662644",
   "gid://shopify/Product/8895447629876",
   "gid://shopify/Product/8865457242164",
   "gid://shopify/Product/8865457176628",
   "gid://shopify/Product/8865056882740",
   "gid://shopify/Product/8865056751668",
   "gid://shopify/Product/8865056718900"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/316937109556",
  "title": "Shower Curtains",
  "handle": "shower-curtains",
  "descriptionHtml": "<p>Shower curtains and liners for tubs and walk in showers. Patterns run from black and gray marble to watercolor botanicals, leaf prints, a bamboo zen garden, dolphins, seashells and a 3D water cube design, with solid gray waterproof, thick waffle, magnetic linen and clear PEVA options.</p>\n<p>Measure the rod width and the drop from rod to tub edge or floor before ordering. Pair a fabric curtain with a waterproof liner tucked inside the tub to keep water off the floor, and choose a magnetic or weighted hem if the curtain tends to blow inward.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Shower Curtains, Fabric Shower Curtains | Nora Furnish",
   "description": "Shower curtains in fabric and waffle weave, in many colors and patterns for every bathroom. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/nf-tile-shower-curtains.jpg?v=1789850836",
   "altText": "Linen shower curtain on a bronze rail lit by warm evening light"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8938731175988",
   "gid://shopify/Product/8938731143220",
   "gid://shopify/Product/8938731110452",
   "gid://shopify/Product/8896760873012",
   "gid://shopify/Product/8896760840244",
   "gid://shopify/Product/8896760807476",
   "gid://shopify/Product/8896760774708",
   "gid://shopify/Product/8896760709172",
   "gid://shopify/Product/8896760676404",
   "gid://shopify/Product/8896085557300",
   "gid://shopify/Product/8896085033012",
   "gid://shopify/Product/8865057210420",
   "gid://shopify/Product/8865057013812",
   "gid://shopify/Product/8865056981044",
   "gid://shopify/Product/8865056948276"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/319143510068",
  "title": "Incense Holders & Burners",
  "handle": "incense-holders-burners",
  "descriptionHtml": "<p>Incense holders, burners and backflow censers for everyday use.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Incense Holders & Burners | Nora Furnish",
   "description": "Incense holders, burners and backflow censers in ceramic, brass and resin, for everyday use and meditation. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S2bb1e39dcb914f52bee9b52bf9afc7a2h.webp?v=1789850360",
   "altText": "Cast iron oil burner lit by a tealight on a wooden table by a brick wall"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8896673087540",
   "gid://shopify/Product/8896673054772",
   "gid://shopify/Product/8896673022004",
   "gid://shopify/Product/8896672956468",
   "gid://shopify/Product/8896672923700",
   "gid://shopify/Product/8896672890932",
   "gid://shopify/Product/8896672858164",
   "gid://shopify/Product/8896672825396",
   "gid://shopify/Product/8896670957620",
   "gid://shopify/Product/8896670924852",
   "gid://shopify/Product/8896670892084",
   "gid://shopify/Product/8896670826548",
   "gid://shopify/Product/8896670793780",
   "gid://shopify/Product/8896670761012",
   "gid://shopify/Product/8896670695476",
   "gid://shopify/Product/8896670662708",
   "gid://shopify/Product/8896670597172",
   "gid://shopify/Product/8896670564404",
   "gid://shopify/Product/8896670531636",
   "gid://shopify/Product/8896670498868",
   "gid://shopify/Product/8896670433332",
   "gid://shopify/Product/8896670400564",
   "gid://shopify/Product/8896670335028",
   "gid://shopify/Product/8896670302260",
   "gid://shopify/Product/8896670269492",
   "gid://shopify/Product/8896670203956",
   "gid://shopify/Product/8896670171188",
   "gid://shopify/Product/8860348121140"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/319143608372",
  "title": "Poufs & Ottomans",
  "handle": "poufs-ottomans",
  "descriptionHtml": "<p>Poufs, ottomans and upholstered footrests.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Poufs & Ottomans, Poufs and Footrests | Nora Furnish",
   "description": "Poufs and ottomans for living rooms and bedrooms, in knit, leather and upholstered designs that double as seats. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S6f0ddafb5ad54e63a52dc7bd33c00b33E.webp?v=1789850045",
   "altText": "Patterned leather pouf on a rug in warm dappled afternoon light"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8896735576116",
   "gid://shopify/Product/8896735543348",
   "gid://shopify/Product/8896735510580",
   "gid://shopify/Product/8896735477812",
   "gid://shopify/Product/8896735412276",
   "gid://shopify/Product/8896711622708",
   "gid://shopify/Product/8896711426100",
   "gid://shopify/Product/8896711393332",
   "gid://shopify/Product/8896711295028",
   "gid://shopify/Product/8896711163956",
   "gid://shopify/Product/8896711131188",
   "gid://shopify/Product/8896711065652",
   "gid://shopify/Product/8895495438388",
   "gid://shopify/Product/8895495307316",
   "gid://shopify/Product/8872545648692",
   "gid://shopify/Product/8872545517620",
   "gid://shopify/Product/8872545452084",
   "gid://shopify/Product/8872544960564",
   "gid://shopify/Product/8872538112052",
   "gid://shopify/Product/8854478389300",
   "gid://shopify/Product/8852479574068",
   "gid://shopify/Product/8852479541300",
   "gid://shopify/Product/8852479311924",
   "gid://shopify/Product/8852479279156",
   "gid://shopify/Product/8852479246388",
   "gid://shopify/Product/8852479082548"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/319143641140",
  "title": "Floor Cushions",
  "handle": "floor-cushions",
  "descriptionHtml": "<p>Floor cushions, floor pillows and tatami seating.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Floor Cushions, Floor Pillows and Tatami Seats | Nora Furnish",
   "description": "Floor cushions, floor pillows and tatami seating for reading corners, meditation and kids rooms. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/image_1787887885391_faf10b65_1787887885715_3e78260c.png?v=1789850057",
   "altText": "Brown tufted floor cushion on a wood floor beside a mustard armchair"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8896735608884",
   "gid://shopify/Product/8896711622708",
   "gid://shopify/Product/8896711589940",
   "gid://shopify/Product/8896711491636",
   "gid://shopify/Product/8896711262260",
   "gid://shopify/Product/8896711131188",
   "gid://shopify/Product/8896711065652",
   "gid://shopify/Product/8872545746996",
   "gid://shopify/Product/8872545714228",
   "gid://shopify/Product/8872545419316",
   "gid://shopify/Product/8872544927796",
   "gid://shopify/Product/8872538177588",
   "gid://shopify/Product/8872538013748",
   "gid://shopify/Product/8872537948212",
   "gid://shopify/Product/8872537915444",
   "gid://shopify/Product/8872537849908",
   "gid://shopify/Product/8872537784372",
   "gid://shopify/Product/8872537751604",
   "gid://shopify/Product/8872537718836",
   "gid://shopify/Product/8872537653300",
   "gid://shopify/Product/8872537620532",
   "gid://shopify/Product/8872537587764",
   "gid://shopify/Product/8872537522228",
   "gid://shopify/Product/8872537391156",
   "gid://shopify/Product/8868066099252",
   "gid://shopify/Product/8868066066484"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/319231721524",
  "title": "Wall Shelves",
  "handle": "wall-shelves",
  "descriptionHtml": "<p>Shelves and display racks for walls, corners, desks and bathrooms. Options include wood and aluminum floating bathroom shelves, hanging corner shelves, boho geometric wall shelves, tension pole and suction cup shower organizers, clamp on desk shelves, acrylic display risers and figure cases, mug, wine and spice racks, and walnut and bamboo headphone stands.</p>\n<p>For wall mounted shelves, find the studs or use anchors rated above the weight you plan to load, and leave a few inches of clearance above the tallest item. In bathrooms, aluminum, acrylic and metal hold up best to daily steam.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Wall Shelves, Floating and Corner Wall Shelves | Nora Furnish",
   "description": "Wall shelves for books, plants and decor: floating shelves, corner shelves and display racks. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/image_1787887127399_d6992815_1787887127571_59942a70.png?v=1789849308",
   "altText": "Walnut floating shelf with a drawer on a warm wall above a leather armchair"
  },
  "ruleSet": {
   "appliedDisjunctively": true,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "grp-wall-shelves"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/8854477930548",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8897626013748",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8897625980980",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8897625915444",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8897625882676",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8896118849588",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895989612596",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895989579828",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8895818170420",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814860852",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814828084",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814762548",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814697012",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814664244",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814631476",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814565940",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814533172",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814500404",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814467636",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895814205492",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895490621492",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895490326580",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895490293812",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895490261044",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895490228276",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895490195508",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895490129972",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895490097204",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895447203892",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8895447138356",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895447105588",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8895447040052",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8892734406708",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8892734046260",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8859818852404",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8859818819636",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8856724668468",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856724635700",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856724537396",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856724504628",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856724471860",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8856724308020",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856724242484",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8856724209716",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856723456052",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856723423284",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856723390516",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8856723357748",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854478225460",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854478192692",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8854478159924",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854478127156",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8854478094388",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8854478061620",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854478028852",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8854477996084",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8854477963316",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854477897780",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854477865012",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854477832244",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854477799476",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8854477766708",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854477733940",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854477701172",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/8854477635636",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/8854477602868",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/319468929076",
  "title": "Home Fragrance Picks",
  "handle": "home-fragrance-picks",
  "descriptionHtml": "",
  "templateSuffix": null,
  "sortOrder": "MANUAL",
  "seo": {
   "title": "Home Fragrance Picks, Home Fragrance Picks | Nora Furnish",
   "description": "A short edit of our favorite diffusers, incense burners and home fragrance pieces. Free US shipping and easy 30 day returns."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S2de4c010a56b4429910ac4192f1f6308L.webp?v=1789281434",
   "altText": "Ceramic oil burners glowing with tealights beside roses"
  },
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8862667178036",
   "gid://shopify/Product/8896672956468",
   "gid://shopify/Product/8862667538484",
   "gid://shopify/Product/8862667374644"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/319469912116",
  "title": "Outdoor Lighting Picks",
  "handle": "outdoor-lighting-picks",
  "descriptionHtml": "",
  "templateSuffix": null,
  "sortOrder": "MANUAL",
  "seo": {
   "title": "Outdoor Lighting Picks, Outdoor Lighting Picks | Nora Furnish",
   "description": "A short edit of our favorite garden, path and outdoor wall lights. Free US shipping and easy 30 day returns."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8847901524020",
   "gid://shopify/Product/8847901261876",
   "gid://shopify/Product/8847901655092"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/319470207028",
  "title": "Soft Furnishings Picks",
  "handle": "soft-furnishings-picks",
  "descriptionHtml": "",
  "templateSuffix": null,
  "sortOrder": "MANUAL",
  "seo": {
   "title": "Soft Furnishings Picks, Soft Furnishings Picks | Nora Furnish",
   "description": "A short edit of our favorite throws, pillows and curtains. Free US shipping and easy 30 day returns."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8897168703540",
   "gid://shopify/Product/8865056718900",
   "gid://shopify/Product/8897625653300",
   "gid://shopify/Product/8897627324468"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/319470665780",
  "title": "Poufs and Floor Cushions Picks",
  "handle": "poufs-and-floor-cushions-picks",
  "descriptionHtml": "",
  "templateSuffix": null,
  "sortOrder": "MANUAL",
  "seo": {
   "title": "Poufs and Floor Cushions Picks | Pouf and Floor Cushion Picks",
   "description": "A short edit of our favorite poufs, ottomans and floor cushions. Free US shipping and easy 30 day returns."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/8896711065652",
   "gid://shopify/Product/8896711622708",
   "gid://shopify/Product/8896735608884",
   "gid://shopify/Product/8896711131188"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/489639542836",
  "title": "Halloween Inflatables",
  "handle": "halloween-inflatables",
  "descriptionHtml": "<p>Lit inflatable ghosts, pumpkins, cats and archways for the yard. Each one has a built in fan and LED lights, and packs away flat when the season is over.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Halloween Inflatables, Lighted Yard Inflatables | Nora Furnish",
   "description": "Halloween inflatables for the yard: lit ghosts, pumpkins, cats and archways with built in fans and LED lights. Free US shipping and easy 30 day returns."
  },
  "image": null,
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "hw-inflatables"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/10310533251124",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533218356",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533120052",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533087284",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533054516",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533021748",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532988980",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532956212",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532923444",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532890676",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532726836",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532694068",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532661300",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532628532",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532595764",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532562996",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532530228",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310532497460",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/489639575604",
  "title": "Halloween Decor",
  "handle": "halloween-decor",
  "descriptionHtml": "<p>Pumpkin lanterns, hanging ghosts, string lights and spooky table pieces for the porch and the house.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Halloween Decor, Spooky Porch and Table Decor | Nora Furnish",
   "description": "Halloween decor for the porch and the house: pumpkin lanterns, hanging ghosts, string lights and spooky table pieces. Free US shipping and easy 30 day returns."
  },
  "image": null,
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "hw-decor"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/10310534398004",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310534365236",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310534299700",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310534266932",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310534037556",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533972020",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533939252",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533906484",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533808180",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533709876",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533644340",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533611572",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/489639608372",
  "title": "Fall Decor",
  "handle": "fall-decor",
  "descriptionHtml": "<p>Wreaths, garlands and faux pumpkins for autumn, from the front door to the table.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Fall Decor, Wreaths, Garlands and Pumpkins | Nora Furnish",
   "description": "Fall decor for autumn: wreaths, garlands and faux pumpkins for the front door, mantel and table. Free US shipping and easy 30 day returns."
  },
  "image": null,
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "fall-decor"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/10310534463540",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310534430772",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310534332468",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310534004788",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533873716",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533840948",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533578804",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533546036",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533513268",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533480500",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533447732",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533414964",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533382196",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533349428",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533316660",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10310533283892",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/490660692020",
  "title": "Short Term Rentals Room Sets",
  "handle": "short-term-rentals-room-sets",
  "descriptionHtml": "<p>Ready to order lighting sets for Airbnb and short term rentals, each matched by finish and priced 10% under buying the pieces on their own.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Airbnb and Rental Lighting Sets | Nora Furnish",
   "description": "Matched lighting sets for Airbnb and short term rentals, including rental bedroom, living room and kitchen sets and a cordless guest lamp set."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/image_1787889221121_51ca4fff_1787889221314_ccdae786.png?v=1790344829",
   "altText": "Short Term Rentals room sets"
  },
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "room-set-short-term-rentals"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/10319220899892",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319220310068",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319219687476",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319219654708",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319219621940",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319219589172",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319219556404",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319219523636",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319219425332",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10317968506932",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/490660724788",
  "title": "Schools and Libraries Room Sets",
  "handle": "schools-and-libraries-room-sets",
  "descriptionHtml": "<p>Ready to order lighting sets for schools and libraries, each matched by finish and priced 10% under buying the pieces on their own.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "School and Library Lighting Sets | Nora Furnish",
   "description": "Matched lighting sets for schools and libraries, including classroom, reading room, study carrel and library lounge sets."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/white-branch-wave-led-linear-pendant-1.jpg?v=1790344831",
   "altText": "Schools and Libraries room sets"
  },
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "room-set-schools-and-libraries"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/10319222112308",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/10319222079540",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319222046772",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319222014004",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319221981236",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/10319221915700",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319221882932",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319221850164",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/10319221784628",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319221653556",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/490660757556",
  "title": "Gyms and Studios Room Sets",
  "handle": "gyms-and-studios-room-sets",
  "descriptionHtml": "<p>Ready to order lighting sets for gyms, yoga and fitness studios, each matched by finish and priced 10% under buying the pieces on their own.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Gym and Studio Lighting Sets | Nora Furnish",
   "description": "Matched lighting sets for gyms and fitness studios, including gym floor, yoga studio, Pilates studio and locker room sets."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/Se9f024bf67ec4dc581ba0c4e00824d384.webp?v=1790344832",
   "altText": "Gyms and Studios room sets"
  },
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "room-set-gyms-and-studios"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/10319224242228",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319224045620",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/10319224012852",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319223947316",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319223914548",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319223881780",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319223816244",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319223390260",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319222702132",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/490660790324",
  "title": "Model Homes and Staging Room Sets",
  "handle": "model-homes-and-staging-room-sets",
  "descriptionHtml": "<p>Ready to order lighting sets for model homes and home staging, each matched by finish and priced 10% under buying the pieces on their own.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Home Staging Lighting Sets | Nora Furnish",
   "description": "Matched lighting sets for model homes and home staging, including staged living room, kitchen, primary bedroom and dining room sets."
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/S2876cd27c34c4951981656c359b6f0e8s_51b33e82-9521-44ed-b546-a8a78a077e29.webp?v=1790344833",
   "altText": "Model Homes and Staging room sets"
  },
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "room-set-model-homes-and-staging"
    }
   ]
  },
  "productIds": null,
  "memberProducts": [
   {
    "id": "gid://shopify/Product/15411401359412",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319226601524",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319226535988",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319226470452",
    "status": "DRAFT"
   },
   {
    "id": "gid://shopify/Product/10319226372148",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319226306612",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319226208308",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319226011700",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319225651252",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319224504372",
    "status": "ARCHIVED"
   },
   {
    "id": "gid://shopify/Product/10319224274996",
    "status": "ARCHIVED"
   }
  ]
 },
 {
  "id": "gid://shopify/Collection/490712825908",
  "title": "Towels",
  "handle": "towels",
  "descriptionHtml": "<p>Soft, absorbent cotton towels in woven stripes and patterns, in face and bath sizes.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Cotton Towels, Face and Bath Towels | Nora Furnish",
   "description": "Soft, absorbent 100% cotton towels with yarn dyed woven stripes and patterns. Face and bath sizes that dry fast and hold their color. Free shipping across the USA."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/10330852327476",
   "gid://shopify/Product/10330852294708",
   "gid://shopify/Product/10330852261940",
   "gid://shopify/Product/10330852229172",
   "gid://shopify/Product/10330852196404",
   "gid://shopify/Product/10330852130868"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/490721673268",
  "title": "Members Only",
  "handle": "members-only",
  "descriptionHtml": "",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": null,
   "description": null
  },
  "image": null,
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "members-only"
    }
   ]
  },
  "productIds": null,
  "memberProducts": []
 },
 {
  "id": "gid://shopify/Collection/490722852916",
  "title": "Switches and Controls",
  "handle": "switches-and-controls",
  "descriptionHtml": "<p>Solid brass and natural marble light switches, dimmers, outlets and wall plates that fit standard US wall boxes.</p>",
  "templateSuffix": "",
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": null,
   "description": null
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/nf-sw-ctx-brass-3-way-rotary-dimmer-switch-1-to-5-gang-9551709.jpg?v=1790493428",
   "altText": "Brass toggle switches on a plaster wall"
  },
  "ruleSet": {
   "appliedDisjunctively": false,
   "rules": [
    {
     "column": "TAG",
     "relation": "EQUALS",
     "condition": "nav-switches-controls"
    }
   ]
  },
  "productIds": null,
  "memberProducts": []
 },
 {
  "id": "gid://shopify/Collection/490722885684",
  "title": "Light Switches",
  "handle": "light-switches",
  "descriptionHtml": "<p>Brass and marble toggle light switches in 1 to 5 gang.</p>",
  "templateSuffix": "",
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": null,
   "description": null
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/nf-sw-ctx-brass-3-way-rotary-dimmer-switch-1-to-5-gang-9551709_709284be-5cf1-42bf-8a20-283052d6330f.jpg?v=1790493428",
   "altText": "Brass toggle switches on a plaster wall"
  },
  "ruleSet": null,
  "productIds": [],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/490722918452",
  "title": "Dimmer Switches",
  "handle": "dimmer-switches",
  "descriptionHtml": "<p>Brass and marble rotary dimmers, including 3 way push on, twist to dim controls.</p>",
  "templateSuffix": "",
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": null,
   "description": null
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/the-brass-3-way-rotary-dimmer-switch-1-to-5-gang-3281807.png?v=1790493549",
   "altText": "Brass dimmer switch on a deep red wall"
  },
  "ruleSet": null,
  "productIds": [],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/490722951220",
  "title": "Power Outlets",
  "handle": "power-outlets",
  "descriptionHtml": "<p>Brass and marble outlets with standard, USB-C and GFCI options, plus data, TV and phone jacks.</p>",
  "templateSuffix": "",
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": null,
   "description": null
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/nf-sw-ctx-unlacquered-brass-plate-4054132.jpg?v=1790493431",
   "altText": "Brass outlet plate in warm afternoon light"
  },
  "ruleSet": null,
  "productIds": [],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/490722983988",
  "title": "Wall Plates",
  "handle": "wall-plates",
  "descriptionHtml": "<p>Brass and marble wall plates in 1 to 5 gang for standard decorator switches and outlets.</p>",
  "templateSuffix": "",
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": null,
   "description": null
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/nf-sw-ctx-brass-tv-socket-1-gang-9336207.jpg?v=1790493432",
   "altText": "Brass wall plate on a walnut wall"
  },
  "ruleSet": null,
  "productIds": [],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/490723016756",
  "title": "Electrical Kits",
  "handle": "electrical-kits",
  "descriptionHtml": "<p>Sample kits to see and feel our brass switches, dimmers and outlets at home.</p>",
  "templateSuffix": "",
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": null,
   "description": null
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/the-brass-electrical-sample-kit-2078595.png?v=1790493493",
   "altText": "Brass dimmer switch beside framed art"
  },
  "ruleSet": null,
  "productIds": [],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/490723049524",
  "title": "Plate Kits",
  "handle": "plate-kits",
  "descriptionHtml": "<p>Wall plate sample kits to compare finishes and stones in your own light.</p>",
  "templateSuffix": "",
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": null,
   "description": null
  },
  "image": {
   "url": "https://cdn.shopify.com/s/files/1/0750/8380/8820/collections/the-brass-plate-6-piece-sample-kit-7452845.png?v=1790493494",
   "altText": "Wall plate samples in every finish on linen"
  },
  "ruleSet": null,
  "productIds": [],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512223805492",
  "title": "Alba Collection",
  "handle": "alba-collection",
  "descriptionHtml": "<p>Layered petals of natural alabaster set on solid brass in a brushed gold finish. When lit, the stone glows warm from within and its veining shows through, so each piece looks slightly different. The Alba family includes a chandelier, a pendant and a wall sconce, each offered in a standard or smart version.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Alba Alabaster and Brass Lighting | Nora Furnish",
   "description": "Alba chandelier, pendant and sconce: layered natural alabaster petals on solid brass in brushed gold, with smart versions available."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419382431796",
   "gid://shopify/Product/15419381841972",
   "gid://shopify/Product/15419381448756",
   "gid://shopify/Product/15418552188980",
   "gid://shopify/Product/15418552156212",
   "gid://shopify/Product/15418552025140"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512223838260",
  "title": "Aurelius Collection",
  "handle": "aurelius-collection",
  "descriptionHtml": "<p>Stainless steel and powder coated iron with an irregular, icicle style edge, finished in jet black or polished gold. The Aurelius family covers a chandelier in single or double layer designs, pendants and wall sconces, all in matching plate finishes.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Aurelius Black and Gold Lighting | Nora Furnish",
   "description": "Aurelius chandeliers, pendants and sconces in stainless steel and iron with jet black or polished gold plates."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419464810548",
   "gid://shopify/Product/15419464482868",
   "gid://shopify/Product/15419393802292",
   "gid://shopify/Product/15418550550580",
   "gid://shopify/Product/15418549633076",
   "gid://shopify/Product/15418549502004"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512223871028",
  "title": "Angelica Collection",
  "handle": "angelica-collection",
  "descriptionHtml": "<p>Solid brass in a brushed gold finish, from a chandelier with 6, 8 or 10 lights to a pendant, a wall sconce and a table lamp. The Angelica family keeps one warm metal throughout, so pieces can be repeated across a dining room, hallway and bedroom.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Angelica Solid Brass Lighting | Nora Furnish",
   "description": "Angelica chandelier, pendant, sconce and table lamp in solid brass with a brushed gold finish."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419391279156",
   "gid://shopify/Product/15419391246388",
   "gid://shopify/Product/15419391180852",
   "gid://shopify/Product/15419391148084"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512223903796",
  "title": "Arabella Collection",
  "handle": "arabella-collection",
  "descriptionHtml": "<p>Sculpted yellow travertine with a soft, natural glow. The Arabella family includes a statement chandelier, a pendant with two or three stone orbs, a wall sconce and a table lamp. Because travertine is a natural stone, the color, veining and pitting vary from piece to piece.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Arabella Travertine Stone Lighting | Nora Furnish",
   "description": "Arabella chandelier, pendant, sconce and table lamp carved from natural yellow travertine stone."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15418556743732",
   "gid://shopify/Product/15418556678196",
   "gid://shopify/Product/15418556579892",
   "gid://shopify/Product/15418556547124"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512223936564",
  "title": "Celestial Collection",
  "handle": "celestial-collection",
  "descriptionHtml": "<p>Hand cut K9 crystal on gold finished metal, made to scatter light across ceilings and walls. The Celestial family includes a round chandelier in four diameters, a pendant in two lengths and a matching wall sconce.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Celestial K9 Crystal and Gold Lighting | Nora Furnish",
   "description": "Celestial chandelier, pendant and sconce in hand cut K9 crystal with gold finished metal."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419462287412",
   "gid://shopify/Product/15419461926964",
   "gid://shopify/Product/15418555170868"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512223969332",
  "title": "Emma Collection",
  "handle": "emma-collection",
  "descriptionHtml": "<p>Die cast aluminum and brushed gold metal in a gold and pearl black finish with a mid century outline. The Emma family covers a chandelier, a hanging chandelier, a pendant, a wall sconce and a staircase chandelier, so an entry, stairwell and landing can match.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Emma Gold and Pearl Black Lighting | Nora Furnish",
   "description": "Emma chandeliers, staircase chandelier, pendant and sconce in gold and pearl black die cast aluminum."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419390787636",
   "gid://shopify/Product/15419390754868",
   "gid://shopify/Product/15419390623796",
   "gid://shopify/Product/15419390591028",
   "gid://shopify/Product/15419390558260"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512224002100",
  "title": "Haylen Collection",
  "handle": "haylen-collection",
  "descriptionHtml": "<p>Integrated LED linear wall lights for the outside of the house, weather sealed to IP65. Choose three color temperatures with remote dimming, full RGB color, a dusk to dawn light sensor version, a smart version with app control, or a solar version that needs no wiring.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Haylen Outdoor LED Linear Wall Lights | Nora Furnish",
   "description": "Haylen outdoor linear wall lights, IP65: dimmable, RGB, light sensor, smart and solar versions."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419467530292",
   "gid://shopify/Product/15419464450100",
   "gid://shopify/Product/15419389116468",
   "gid://shopify/Product/15418557759540",
   "gid://shopify/Product/15418557661236",
   "gid://shopify/Product/15418557530164"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512224034868",
  "title": "Obsidian Collection",
  "handle": "obsidian-collection",
  "descriptionHtml": "<p>A black frame set with hand cut K9 crystals, so the fixture reads dark and graphic by day and sparkles once it is lit. The Obsidian family includes a chandelier in five sizes, a pendant and a wall sconce.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Obsidian Black Crystal Lighting | Nora Furnish",
   "description": "Obsidian chandelier, pendant and sconce: black frames with hand cut K9 crystal detail."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419465826356",
   "gid://shopify/Product/15419464941620",
   "gid://shopify/Product/15419461730356"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512224067636",
  "title": "Raven Collection",
  "handle": "raven-collection",
  "descriptionHtml": "<p>Black fixtures with embedded K9 crystals and integrated LED light. The Raven family includes a chandelier with smart control, a pendant and a wall sconce, each in a modern, graphic shape.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Raven Black and Crystal LED Lighting | Nora Furnish",
   "description": "Raven chandelier, pendant and sconce: black LED fixtures with embedded K9 crystals."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419392294964",
   "gid://shopify/Product/15419392163892",
   "gid://shopify/Product/15419392098356"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512224100404",
  "title": "Solara Collection",
  "handle": "solara-brand-collection",
  "descriptionHtml": "<p>Solid brass frames set with hand cut K9 crystal, in brushed gold or brushed graphite. The Solara family includes a circular chandelier in three widths, a pendant, a mini pendant in round or square and a wall sconce.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Solara Brass and Crystal Lighting | Nora Furnish",
   "description": "Solara chandelier, pendants and sconce in solid brass and K9 crystal, brushed gold or graphite."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15418554286132",
   "gid://shopify/Product/15418554155060",
   "gid://shopify/Product/15418553892916",
   "gid://shopify/Product/15418553827380"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512224133172",
  "title": "Umbra Collection",
  "handle": "umbra-collection",
  "descriptionHtml": "<p>Pearl black K9 crystal for a darker, moodier sparkle than clear crystal. The Umbra family includes a pendant in three sizes and a matching wall sconce.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Umbra Pearl Black Crystal Lighting | Nora Furnish",
   "description": "Umbra pendant and sconce in pearl black K9 crystal."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15419461107764",
   "gid://shopify/Product/15419393835060"
  ],
  "memberProducts": null
 },
 {
  "id": "gid://shopify/Collection/512224165940",
  "title": "Velina Collection",
  "handle": "velina-collection",
  "descriptionHtml": "<p>Layered panels of natural alabaster held in solid brass. The stone softens the light into an even, warm glow and shows its own veining. The Velina family includes a chandelier, a linear pendant, a table lamp and a wall sconce.</p>",
  "templateSuffix": null,
  "sortOrder": "BEST_SELLING",
  "seo": {
   "title": "Velina Alabaster and Brass Lighting | Nora Furnish",
   "description": "Velina chandelier, pendant, table lamp and sconce in natural alabaster with solid brass frames."
  },
  "image": null,
  "ruleSet": null,
  "productIds": [
   "gid://shopify/Product/15418555531316",
   "gid://shopify/Product/15418555498548",
   "gid://shopify/Product/15418555334708",
   "gid://shopify/Product/15418555301940"
  ],
  "memberProducts": null
 }
]
```
