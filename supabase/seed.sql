-- MomShop — seed catalog (mirrors lib/data.ts): handmade earrings.
-- Image paths point at /public/images placeholders — swap for real photography.
-- Re-runnable: upserts on conflict.

insert into public.materials (slug, name, tagline, description, image, sort_order) values
  ('wood',    'Wood',    $$CNC-cut, light as can be$$, $$Light-toned wood, cut and sanded by hand, then sealed for everyday wear. Warm, natural, and barely-there on the ear.$$, '/images/material-wood.jpg', 1),
  ('leather', 'Leather', $$Soft, supple, full of movement$$, $$Genuine leather cut into clean shapes that move with you. Soft to the touch and easy to wear from morning to night.$$, '/images/material-leather.jpg', 2),
  ('mixed',   'Mixed',   $$Wood, leather & a little brass$$, $$Where materials meet — wood paired with leather or a touch of brass for pieces with a bit more to say.$$, '/images/material-mixed.jpg', 3)
on conflict (slug) do update set
  name = excluded.name, tagline = excluded.tagline,
  description = excluded.description, image = excluded.image,
  sort_order = excluded.sort_order;

insert into public.products
  (id, slug, name, material, style, price, images, badge, short_description, description, materials, details, care, variants, personalizable, best_seller, is_new, sort_order)
values
  ('birch-studs', 'birch-studs', 'Birch Studs', 'wood', 'Studs', 24,
   ARRAY['/images/product-1.jpg','/images/hero.jpg','/images/material-wood.jpg'],
   'bestseller',
   $$Lightweight CNC-cut wood studs for everyday wear.$$,
   $$A small, smooth wood stud cut on the CNC and sanded by hand. Light enough to forget you're wearing them — the pair you reach for on a normal Tuesday. Warm, simple, and easy to gift.$$,
   ARRAY['Light maple','Hand-sealed finish','Surgical steel posts'],
   ARRAY['Featherlight — under 1g','10mm','Nickel-free posts'],
   ARRAY['Keep dry; wipe with a soft cloth','Avoid soaking or perfume'],
   $$[{"name":"Finish","options":["Natural Maple","Light Walnut"]}]$$::jsonb,
   false, true, false, 1),

  ('aspen-hoops', 'aspen-hoops', 'Aspen Hoops', 'wood', 'Hoops', 32,
   ARRAY['/images/product-2.jpg','/images/material-wood.jpg','/images/hero.jpg'],
   'bestseller',
   $$Warm wooden hoops with an easy, everyday swing.$$,
   $$An open wooden hoop, cut clean and sanded smooth. It catches the light with a warm, natural grain and stays light on the ear all day. Quiet enough for work, pretty enough for after.$$,
   ARRAY['Light walnut','Hand-sealed finish','Surgical steel hooks'],
   ARRAY['Under 2g each','35mm drop','Smooth, snag-free edges'],
   ARRAY['Keep dry','Store flat, out of direct sun'],
   $$[{"name":"Finish","options":["Natural Maple","Light Walnut"]},{"name":"Hardware","options":["Surgical Steel","Brass"]}]$$::jsonb,
   false, true, false, 2),

  ('meadow-drops', 'meadow-drops', 'Meadow Drops', 'wood', 'Drops', 30,
   ARRAY['/images/product-3.jpg','/images/material-wood.jpg','/images/banner-lifestyle.jpg'],
   'handmade',
   $$Laser-cut botanical drops in light wood.$$,
   $$A slender leaf shape, laser-cut from light wood and finished by hand. It moves softly when you do and keeps an outfit feeling calm and considered. A little nod to the outdoors you can wear anywhere.$$,
   ARRAY['Light maple','Laser-cut detail','Surgical steel hooks'],
   ARRAY['Lightweight on the ear','40mm drop','Open hook closure'],
   ARRAY['Keep dry','Wipe gently with a soft cloth'],
   $$[{"name":"Finish","options":["Natural Maple","Light Walnut"]}]$$::jsonb,
   false, false, false, 3),

  ('quarry-geometrics', 'quarry-geometrics', 'Quarry Geometrics', 'wood', 'Statement', 38,
   ARRAY['/images/product-4.jpg','/images/material-wood.jpg'],
   'new',
   $$Bold geometric wood — engrave it if you'd like.$$,
   $$A clean geometric shape cut on the CNC for a bit more presence. Surprisingly light for its size, and a lovely blank canvas — add a small initial or date and we'll engrave it for you, gift-ready.$$,
   ARRAY['Light walnut','CNC-cut','Surgical steel posts'],
   ARRAY['Lightweight despite the size','45mm','Optional hand engraving'],
   ARRAY['Keep dry','Avoid soaking and perfume'],
   $$[{"name":"Finish","options":["Natural Maple","Light Walnut"]},{"name":"Hardware","options":["Surgical Steel","Brass"]}]$$::jsonb,
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
   $$Light wood paired with leather and a hint of brass.$$,
   $$Wood, leather, and a small brass accent brought together in one easy drop. The materials play off each other — warm grain, soft leather, a little shine — while staying light and wearable.$$,
   ARRAY['Light maple','Genuine leather','Brass accent','Surgical steel hooks'],
   ARRAY['Lightweight','42mm drop','Mixed-material detail'],
   ARRAY['Keep dry','Wipe gently; avoid soaking'],
   $$[{"name":"Finish","options":["Natural Maple","Light Walnut"]},{"name":"Tone","options":["Tan","Cognac","Black"]}]$$::jsonb,
   false, false, false, 8)
on conflict (id) do update set
  name = excluded.name, material = excluded.material, style = excluded.style,
  price = excluded.price, images = excluded.images, badge = excluded.badge,
  short_description = excluded.short_description, description = excluded.description,
  materials = excluded.materials, details = excluded.details, care = excluded.care,
  variants = excluded.variants, personalizable = excluded.personalizable,
  best_seller = excluded.best_seller, is_new = excluded.is_new,
  sort_order = excluded.sort_order;
