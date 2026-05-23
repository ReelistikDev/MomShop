-- MomShop — seed catalog (mirrors lib/data.ts): handmade earrings.
-- Signature pieces are hand-painted wood rounds (night skies, forests,
-- mountains, bears), plus leather and mixed-material pairs.
-- Image paths point at /public/images placeholders — swap for real photography.
-- Re-runnable: upserts on conflict.

insert into public.materials (slug, name, tagline, description, image, sort_order) values
  ('wood',    'Wood',    $$Hand-painted little scenes$$, $$Light wood rounds, hand-painted with night skies, forests, and mountains, then sealed to last. Each one is painted by hand, so no two are quite the same.$$, '/images/material-wood.jpg', 1),
  ('leather', 'Leather', $$Soft, supple, full of movement$$, $$Genuine leather cut into clean shapes that move with you. Soft to the touch and easy to wear from morning to night.$$, '/images/material-leather.jpg', 2),
  ('mixed',   'Mixed',   $$Wood, leather & a little brass$$, $$Where materials meet — wood paired with leather or a touch of brass for pieces with a bit more to say.$$, '/images/material-mixed.jpg', 3)
on conflict (slug) do update set
  name = excluded.name, tagline = excluded.tagline,
  description = excluded.description, image = excluded.image,
  sort_order = excluded.sort_order;

insert into public.products
  (id, slug, name, material, style, price, images, badge, short_description, description, materials, details, care, variants, personalizable, best_seller, is_new, sort_order)
values
  ('moonlit-pines', 'moonlit-pines', 'Moonlit Pines', 'wood', 'Round', 34,
   ARRAY['/images/product-1.jpg','/images/material-wood.jpg','/images/banner-lifestyle.jpg'],
   'bestseller',
   $$A crescent moon over a hand-painted pine forest.$$,
   $$A crescent moon hangs over a hand-painted pine forest on a light wood round. The deep twilight sky is painted by hand and sealed to last — a little piece of a quiet night you can wear anywhere.$$,
   ARRAY['Birch wood','Hand-painted & sealed','Surgical steel hooks'],
   ARRAY['Lightweight on the ear','~35mm round','Each one slightly unique'],
   ARRAY['Keep dry; avoid soaking & perfume','Wipe gently with a soft cloth'],
   $$[{"name":"Hardware","options":["Surgical Steel","Brass"]}]$$::jsonb,
   false, true, false, 1),

  ('wandering-bear', 'wandering-bear', 'Wandering Bear', 'wood', 'Round', 36,
   ARRAY['/images/product-2.jpg','/images/material-wood.jpg','/images/banner-lifestyle.jpg'],
   'bestseller',
   $$A bear ambling through a painted, starry treeline.$$,
   $$A bear wanders through a hand-painted treeline under a scatter of stars. Painted on light wood and sealed by hand — calm, woodsy, and just a little wild.$$,
   ARRAY['Birch wood','Hand-painted & sealed','Surgical steel hooks'],
   ARRAY['Lightweight on the ear','~35mm round','Each one slightly unique'],
   ARRAY['Keep dry; avoid soaking & perfume','Wipe gently with a soft cloth'],
   $$[{"name":"Hardware","options":["Surgical Steel","Brass"]}]$$::jsonb,
   false, true, false, 2),

  ('starry-forest', 'starry-forest', 'Starry Forest', 'wood', 'Round', 32,
   ARRAY['/images/product-3.jpg','/images/material-wood.jpg','/images/hero.jpg'],
   'handmade',
   $$A scatter of stars above hand-painted pines.$$,
   $$Stars scattered above a hand-painted pine forest on a light wood round. Quietly detailed and light on the ear — the pair that makes people lean in for a closer look.$$,
   ARRAY['Birch wood','Hand-painted & sealed','Surgical steel hooks'],
   ARRAY['Lightweight on the ear','~32mm round','Each one slightly unique'],
   ARRAY['Keep dry; avoid soaking & perfume','Wipe gently with a soft cloth'],
   $$[{"name":"Hardware","options":["Surgical Steel","Brass"]}]$$::jsonb,
   false, true, false, 3),

  ('mountain-range', 'mountain-range', 'Mountain Range', 'wood', 'Round', 38,
   ARRAY['/images/product-4.jpg','/images/material-wood.jpg'],
   'custom',
   $$Hand-painted peaks — engrave the back if you'd like.$$,
   $$Hand-painted peaks under an open sky on a light wood round. Add a small initial or date and we'll engrave it on the back — a wearable little landscape, made personal and gift-ready.$$,
   ARRAY['Birch wood','Hand-painted & sealed','Optional back engraving'],
   ARRAY['Lightweight despite the size','~38mm round','Up to 12 characters'],
   ARRAY['Keep dry; avoid soaking & perfume','Wipe gently with a soft cloth'],
   $$[{"name":"Hardware","options":["Surgical Steel","Brass"]}]$$::jsonb,
   true, false, true, 4),

  ('saddle-teardrops', 'saddle-teardrops', 'Saddle Teardrops', 'leather', 'Drops', 28,
   ARRAY['/images/product-5.jpg','/images/material-leather.jpg','/images/hero.jpg'],
   'bestseller',
   $$Soft leather teardrops that move with you.$$,
   $$A simple teardrop cut from genuine leather — soft, light, and full of easy movement. Broken-in from the first wear, it's the kind of pair that just goes with everything.$$,
   ARRAY['Genuine leather','Surgical steel hooks'],
   ARRAY['Featherlight','45mm drop','Soft, flexible feel'],
   ARRAY['Keep dry','Reshape gently if needed'],
   $$[{"name":"Tone","options":["Tan","Cognac","Black"]}]$$::jsonb,
   false, true, false, 5),

  ('fringe-danglers', 'fringe-danglers', 'Fringe Danglers', 'leather', 'Statement', 34,
   ARRAY['/images/product-6.jpg','/images/material-leather.jpg'],
   'handmade',
   $$Hand-cut leather fringe with plenty of swing.$$,
   $$Fine leather fringe, hand-cut to fall and sway with you. A statement that still feels soft and wearable — light on the ear, with a relaxed, handmade edge.$$,
   ARRAY['Genuine leather','Surgical steel hooks'],
   ARRAY['Light despite the length','65mm drop','Soft movement'],
   ARRAY['Keep dry','Store hanging to keep the shape'],
   $$[{"name":"Tone","options":["Tan","Cognac","Black"]}]$$::jsonb,
   false, false, false, 6),

  ('harvest-studs', 'harvest-studs', 'Harvest Studs', 'leather', 'Studs', 22,
   ARRAY['/images/product-7.jpg','/images/material-leather.jpg'],
   'new',
   $$Tiny leather studs in warm, earthy tones.$$,
   $$A small leather disc on a steel post — understated and comfortable enough to wear every day. Warm, earthy, and quietly different from the usual stud.$$,
   ARRAY['Genuine leather','Surgical steel posts'],
   ARRAY['Featherlight','12mm','Nickel-free posts'],
   ARRAY['Keep dry','Wipe gently'],
   $$[{"name":"Tone","options":["Tan","Cognac","Black"]}]$$::jsonb,
   false, false, true, 7),

  ('grove-mixed-drops', 'grove-mixed-drops', 'Grove Mixed Drops', 'mixed', 'Drops', 36,
   ARRAY['/images/product-8.jpg','/images/material-mixed.jpg','/images/banner-lifestyle.jpg'],
   'handmade',
   $$Hand-painted wood paired with leather and brass.$$,
   $$A hand-painted wood piece brought together with soft leather and a small brass accent. The materials play off each other — warm grain, painted color, a little shine — while staying light and wearable.$$,
   ARRAY['Birch wood','Genuine leather','Brass accent','Surgical steel hooks'],
   ARRAY['Lightweight','42mm drop','Mixed-material detail'],
   ARRAY['Keep dry','Wipe gently; avoid soaking'],
   $$[{"name":"Hardware","options":["Surgical Steel","Brass"]},{"name":"Tone","options":["Tan","Cognac","Black"]}]$$::jsonb,
   false, false, false, 8)
on conflict (id) do update set
  name = excluded.name, material = excluded.material, style = excluded.style,
  price = excluded.price, images = excluded.images, badge = excluded.badge,
  short_description = excluded.short_description, description = excluded.description,
  materials = excluded.materials, details = excluded.details, care = excluded.care,
  variants = excluded.variants, personalizable = excluded.personalizable,
  best_seller = excluded.best_seller, is_new = excluded.is_new,
  sort_order = excluded.sort_order;
