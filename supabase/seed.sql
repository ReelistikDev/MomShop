-- MomShop — seed catalog (mirrors lib/data.ts).
-- Image paths point at /public/images placeholders — swap for real photography.
-- Re-runnable: upserts on conflict.

insert into public.collections (slug, name, tagline, description, image, sort_order) values
  ('earrings',  'Earrings',  $$Light enough to forget you're wearing them$$, $$Hand-shaped hoops, studs, and drops in gold fill and sterling silver. Designed to sit comfortably from morning to evening.$$, '/images/collection-earrings.jpg', 1),
  ('necklaces', 'Necklaces', $$Layer them, or wear just one$$, $$Delicate chains and quiet pendants made to live close to the skin. Easy to mix, easy to keep on.$$, '/images/collection-necklaces.jpg', 2),
  ('rings',     'Rings',     $$Simple bands for every day$$, $$Slim, stackable rings finished by hand. Smooth edges, no snagging, made to be worn together.$$, '/images/collection-rings.jpg', 3),
  ('bracelets', 'Bracelets', $$A soft weight on the wrist$$, $$Beaded and chain bracelets strung in small batches. Understated pieces that finish a look without asking for attention.$$, '/images/collection-bracelets.jpg', 4)
on conflict (slug) do update set
  name = excluded.name, tagline = excluded.tagline,
  description = excluded.description, image = excluded.image,
  sort_order = excluded.sort_order;

insert into public.products
  (id, slug, name, collection_slug, price, images, badge, short_description, description, materials, details, care, variants, personalizable, best_seller, is_new, sort_order)
values
  ('petal-hoops', 'petal-hoops', 'Petal Hoops', 'earrings', 42,
   ARRAY['/images/product-1.jpg','/images/hero.jpg','/images/collection-earrings.jpg'],
   'bestseller',
   $$Lightweight handmade hoops designed for everyday wear.$$,
   $$A softly rounded hoop, shaped and polished by hand. Light enough to wear from a morning coffee to a late dinner — the kind of pair you reach for without thinking. A quiet, giftable everyday piece.$$,
   ARRAY['14k gold fill','Hypoallergenic posts'],
   ARRAY['Under 2g each','20mm diameter','Secure click closure'],
   ARRAY['Keep dry; remove before swimming','Wipe gently with a soft cloth'],
   $$[{"name":"Metal","options":["14k Gold Fill","Sterling Silver"]}]$$::jsonb,
   false, true, false, 1),

  ('linen-chain-necklace', 'linen-chain-necklace', 'Linen Chain Necklace', 'necklaces', 58,
   ARRAY['/images/product-2.jpg','/images/hero.jpg','/images/collection-necklaces.jpg'],
   'bestseller',
   $$A fine everyday chain that layers beautifully.$$,
   $$A whisper-fine chain with just enough weight to feel substantial. Wear it on its own for something quiet, or layer it with a pendant. It sits close to the collarbone and never tangles when you take it off.$$,
   ARRAY['14k gold fill','Lobster clasp'],
   ARRAY['Adjustable 16–18 in','Lightweight, tangle-resistant','Lays flat on the skin'],
   ARRAY['Store flat or hung','Avoid lotions and perfume'],
   $$[{"name":"Metal","options":["14k Gold Fill","Sterling Silver"]},{"name":"Length","options":["16\"","18\"","20\""]}]$$::jsonb,
   false, true, false, 2),

  ('hawthorn-studs', 'hawthorn-studs', 'Hawthorn Studs', 'earrings', 36,
   ARRAY['/images/product-3.jpg','/images/collection-earrings.jpg','/images/hero.jpg'],
   'handmade',
   $$Faceted studs that catch the light, quietly.$$,
   $$Small, faceted studs that throw a little light without ever feeling loud. The pair you can sleep in, travel with, and pass along — comfortable enough to forget, pretty enough to notice.$$,
   ARRAY['Sterling silver','Cubic zirconia','Butterfly backs'],
   ARRAY['5mm face','Featherweight','Posts sit flush to the ear'],
   ARRAY['Remove before showering','Polish with a soft cloth'],
   $$[{"name":"Metal","options":["14k Gold Fill","Sterling Silver"]}]$$::jsonb,
   false, false, false, 3),

  ('dew-pearl-pendant', 'dew-pearl-pendant', 'Dew Pearl Pendant', 'necklaces', 64,
   ARRAY['/images/product-4.jpg','/images/collection-necklaces.jpg','/images/banner-lifestyle.jpg'],
   'bestseller',
   $$A single freshwater pearl on a fine chain.$$,
   $$One small freshwater pearl, each a little different, suspended from a fine chain. A soft, giftable piece that feels considered without trying too hard — lovely for a birthday, a thank-you, or no reason at all.$$,
   ARRAY['Freshwater pearl','14k gold fill chain'],
   ARRAY['Adjustable 16–18 in','Pearl 6–7mm','Naturally one of a kind'],
   ARRAY['Put on last, take off first','Keep away from water'],
   $$[{"name":"Metal","options":["14k Gold Fill","Sterling Silver"]},{"name":"Length","options":["16\"","18\"","20\""]}]$$::jsonb,
   false, true, false, 4),

  ('field-band-ring', 'field-band-ring', 'Field Band Ring', 'rings', 48,
   ARRAY['/images/product-5.jpg','/images/collection-rings.jpg'],
   'new',
   $$A slim, smooth band made for stacking.$$,
   $$A slim band with gently rounded edges, finished by hand so it never catches. Wear one on its own or stack a few — it's the quiet base layer the rest of your rings are built around.$$,
   ARRAY['14k gold fill','Solid band'],
   ARRAY['1.5mm wide','Comfort-fit interior','Smooth, snag-free edges'],
   ARRAY['Remove for heavy tasks','Buff with a soft cloth'],
   $$[{"name":"Metal","options":["14k Gold Fill","Sterling Silver"]},{"name":"Ring size","options":["5","6","7","8","9"]}]$$::jsonb,
   false, false, true, 5),

  ('makers-bead-bracelet', 'makers-bead-bracelet', $$Maker's Bead Bracelet$$, 'bracelets', 52,
   ARRAY['/images/product-6.jpg','/images/collection-bracelets.jpg'],
   'handmade',
   $$Hand-strung beads with a soft weight on the wrist.$$,
   $$Strung one bead at a time on a durable cord, with a little gold detail to finish. A relaxed, everyday bracelet that adds warmth to a stack — softly worn-in from the very first day.$$,
   ARRAY['Glass and brass beads','Gold-fill accent','Stretch cord'],
   ARRAY['Fits most wrists','No clasp to fuss with','Soft, flexible fit'],
   ARRAY['Roll on and off gently','Keep dry'],
   $$[{"name":"Tone","options":["Sage","Sand","Stone"]}]$$::jsonb,
   false, false, false, 6),

  ('keepsake-pendant', 'keepsake-pendant', 'Keepsake Pendant', 'necklaces', 72,
   ARRAY['/images/product-7.jpg','/images/personalized.jpg','/images/banner-lifestyle.jpg'],
   'custom',
   $$A hand-stamped pendant, personalized for someone you love.$$,
   $$A smooth little pendant we hand-stamp with an initial, a date, or a short word — whatever you'd like it to hold. It arrives gift-ready in a linen pouch, made to be kept and worn for years.$$,
   ARRAY['14k gold fill','Hand-stamped by us'],
   ARRAY['Up to 8 characters','Adjustable 16–18 in','Arrives in a linen gift pouch'],
   ARRAY['Wipe gently to keep the stamp crisp','Avoid water and lotion'],
   $$[{"name":"Metal","options":["14k Gold Fill","Sterling Silver"]},{"name":"Length","options":["16\"","18\"","20\""]}]$$::jsonb,
   true, true, false, 7),

  ('willow-drops', 'willow-drops', 'Willow Drops', 'earrings', 46,
   ARRAY['/images/product-8.jpg','/images/hero.jpg','/images/collection-earrings.jpg'],
   'new',
   $$Slender drop earrings with an easy, fluid swing.$$,
   $$A long, slender drop that moves with you — graceful but never heavy. Light on the ear and easy to wear up or down, it's the piece that quietly pulls an outfit together.$$,
   ARRAY['14k gold fill','Hypoallergenic hooks'],
   ARRAY['32mm drop','Lightweight on the ear','Open hook closure'],
   ARRAY['Store hung to keep the shape','Keep dry'],
   $$[{"name":"Metal","options":["14k Gold Fill","Sterling Silver"]}]$$::jsonb,
   false, false, true, 8)
on conflict (id) do update set
  name = excluded.name, collection_slug = excluded.collection_slug,
  price = excluded.price, images = excluded.images, badge = excluded.badge,
  short_description = excluded.short_description, description = excluded.description,
  materials = excluded.materials, details = excluded.details, care = excluded.care,
  variants = excluded.variants, personalizable = excluded.personalizable,
  best_seller = excluded.best_seller, is_new = excluded.is_new,
  sort_order = excluded.sort_order;
