import { useState, useMemo, useEffect, cloneElement, isValidElement } from 'react'

/* ----------------------------------------------------------------------------
 * PROPERTY DATA — one entry per home. The UI reads only from these objects;
 * add a third by appending another with the same shape.
 * `dashName` must match the property's name in the Roam in Heels dashboard:
 * enquiries are filed under it, so the dashboard's property filter finds them.
 * -------------------------------------------------------------------------- */
const LOCATION_BODY = "Supernova Spira is one of Noida's iconic high-rise addresses in Sector 94. The location offers quick access to:\n\n• Amity University — approx. 2 km\n• DLF Mall of India, Sector 18 — approx. 5 km\n• Nearest Metro: Okhla Bird Sanctuary — approx. 1 km\n• Film City & South Delhi — approx. 5 km\n• Vasco Cafe — approx. 7 km\n\nYou get the comfort of a peaceful high-rise stay while staying well-connected to major city spots."

const spira2212 = {
  id: 'spira-2212',
  dashName: 'Spira 2212',
  floor: '22nd floor',
  area: 'Supernova Spira, Noida',
  backupNote: true,         // another Spira unit can stand in if this one is booked
  name: '22nd floor — Designer river-view studio, Noida',
  cardTitle: 'Designer river-view studio',
  cardLine: 'Crystal chandelier, rain shower and a sunset balcony over the Yamuna.',
  airbnb: 'https://www.airbnb.co.in/rooms/1746225491231648460',
  shortDescription:
    "We're an IIT graduate couple who love designing beautiful spaces and hosting amazing guests. This 22nd-floor studio in Supernova Spira, Sector 94 Noida brings elegant designer interiors with a premium hotel-like feel — a crystal chandelier over a plush L-shaped sofa, a comfortable bed with high-quality linens, a rain shower, a Netflix-and-work nook, and a private balcony with river and sunset views. High-speed Wi-Fi, a well-equipped kitchenette and hassle-free self check-in make it easy for couples, work travellers and staycation lovers.",
  images: [
    '/photos/2212/exterior-1.jpg',  // cover — sunset over the Yamuna from the balcony
    '/photos/2212/bedroom-7.jpg',   // bed facing the river through glass doors
    '/photos/2212/living-2.jpg',
    '/photos/2212/kitchen-2.jpg',
    '/photos/2212/workspace-1.jpg',
  ],
  gallery: [
    { label: 'Living room', photos: Array.from({ length: 7 }, (_, i) => `/photos/2212/living-${i + 1}.jpg`) },
    { label: 'Bedroom',     photos: Array.from({ length: 8 }, (_, i) => `/photos/2212/bedroom-${i + 1}.jpg`) },
    { label: 'Balcony',     photos: [...Array.from({ length: 4 }, (_, i) => `/photos/2212/balcony-${i + 1}.jpg`), '/photos/2212/exterior-1.jpg', '/photos/2212/exterior-2.jpg'] },
    { label: 'Kitchen',     photos: Array.from({ length: 6 }, (_, i) => `/photos/2212/kitchen-${i + 1}.jpg`) },
    { label: 'Bathroom',    photos: Array.from({ length: 2 }, (_, i) => `/photos/2212/bathroom-${i + 1}.jpg`) },
    { label: 'Workspace',   photos: Array.from({ length: 2 }, (_, i) => `/photos/2212/workspace-${i + 1}.jpg`) },
    { label: 'Entrance',    photos: Array.from({ length: 2 }, (_, i) => `/photos/2212/extra-${i + 1}.jpg`) },
  ],
  highlights: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
  perfectFor: [
    {
      emoji: '❤️',
      title: 'Couples & sunset lovers',
      body: "Designed for two. Watch the sun go down over the Yamuna from the wicker seats on the balcony, then settle in under the crystal chandelier with a movie on Netflix or a round of Jenga.\n\nThe bed opens straight onto the balcony through floor-to-ceiling glass doors, so you wake up to the river and the city skyline — a lovely setting for birthdays, anniversaries or simply a quiet night in.",
    },
    {
      emoji: '💻',
      title: 'Work travellers & remote workers',
      body: "A dedicated workspace with an ergonomic chair, high-speed Wi-Fi and a calm, private setting make it easy to take calls and get focused work done.\n\nWhen the laptop closes, the same corner turns into a cozy Netflix and Prime Video spot with a river-view balcony right beside it.",
    },
    {
      emoji: '🌆',
      title: 'Staycation lovers',
      body: "A premium, hotel-like escape without leaving the city: designer interiors, warm lighting, a spa-like rain shower and sparkling skyline views after dark. Perfect for a solo reset or a weekend away from routine.",
    },
    {
      emoji: '🗓️',
      title: 'Longer stays',
      body: "Stays of 28 days or more are welcome. The kitchenette, wardrobe and chest of drawers, clothes drying rack and daily housekeeping (10 am – 6 pm) make it comfortable to settle in for a while.",
    },
    { emoji: '🚇', title: 'City explorers & metro travellers', body: LOCATION_BODY },
  ],
  spaces: [
    {
      emoji: '🌅',
      title: 'Balcony with river & sunset views',
      body: "A peaceful private balcony with comfortable wicker seating and a glass-top table, looking out over the Yamuna and the Noida skyline. After dark, warm ambient lighting turns it into the perfect spot to sip a drink and take in the sparkling city lights.",
    },
    {
      emoji: '🛋️',
      title: 'Living room',
      body: "Unwind beneath a stunning crystal chandelier on a plush L-shaped sofa with soft throws and elegant cushions, around a stylish marble-top coffee table. Floor-to-ceiling curtains add warmth and privacy.\n\nInside: sofa, central air conditioning, ceiling fan, board games (Jenga).",
    },
    {
      emoji: '🌙',
      title: 'Bedroom',
      body: "A bright, cozy room with a double bed, soft cotton linens and warm neutral tones. Floor-to-ceiling glass doors open onto the balcony — curtains open for the morning light, room-darkening blinds for a lazy lie-in.\n\nInside: bed linen, extra pillows and blankets, hangers, wardrobe and chest of drawers, clothes drying rack.",
    },
    {
      emoji: '🍽️',
      title: 'Kitchen',
      body: "A sleek, modern kitchenette with ample storage, a spacious countertop and sink, and a thoughtfully stocked tea-and-coffee corner — everything you need for a quick breakfast, a cup of chai or a light meal.\n\nInside: induction cooker, microwave, oven, fridge, freezer, mini fridge, electric kettle, coffee and tea, sugar and basic spices, pots and pans, oil, salt and pepper, crockery and cutlery, wine glasses.",
    },
    {
      emoji: '🛁',
      title: 'Bathroom',
      body: "A modern bathroom with a sleek wall-mounted toilet, contemporary wash basin and a spacious overhead rain shower for a spa-like feel.\n\nInside: hot water, shampoo, body soap, shower gel, bidet, towels and toilet paper.",
    },
    {
      emoji: '💻',
      title: 'Workspace & entertainment',
      body: "A multipurpose corner with a cushioned ergonomic chair — catch up on work, or switch off with your favourite shows.\n\nInside: dedicated workspace, high-speed Wi-Fi, HDTV with Netflix and Amazon Prime Video.",
    },
    {
      emoji: '🏠',
      title: 'Check-in, safety & facilities',
      body: "Self check-in with a lockbox — check-in after 12:00 pm, check-out before 10:00 am. Quiet hours 10:00 pm – 8:00 am; up to 2 guests.\n\nLift, central air conditioning, smoke alarm and fire extinguisher, paid parking on premises with controlled access, pets welcome, and housekeeping available every day from 10:00 am to 6:00 pm.",
    },
  ],
  hostName: 'Mansi & Deependra',
}

const spira3028 = {
  id: 'spira-3028',
  dashName: 'Spira 3028',      // the property's name in the Roam in Heels dashboard
  floor: '30th floor',
  area: 'Supernova Spira, Noida',
  backupNote: true,
  name: '30th floor — Luxury apartment (Riverview), Noida',
  cardTitle: 'Riverview luxury studio',
  cardLine: 'Minimalist luxury, river views and a private balcony, 30 floors above Sector 94.',
  airbnb: 'https://www.airbnb.co.in/rooms/1676660261082003123',
  shortDescription:
    "Hosted by Mansi & Deependra, a corporate-professional IIT graduate couple, this 30th-floor studio in Supernova Spira, Sector 94 Noida offers river views, minimalist luxury, cozy lighting, balcony seating, Smart TV, Wi-Fi, workspace, kitchen essentials, mini fridge, and games like Jenga & String Hockey. Perfect for couples, small families, work travellers, and staycation lovers. Near Okhla Bird Sanctuary Metro, Amity, Sector 18, DLF Mall, Film City & South Delhi.",
  // Hero gallery — 1 large + 4 thumbnails on desktop. Re-order to surface your favourites.
  images: [
    '/photos/bedroom-4.jpg', // hero — balcony view king-bed shot
    '/photos/balcony-1.jpg',
    '/photos/kitchen-7.jpg',
    '/photos/bathroom-1.jpg',
    '/photos/workspace-2.jpg',
  ],
  // Full gallery — shown in the lightbox, grouped by room.
  gallery: [
    { label: 'Bedrooms',  photos: Array.from({ length: 11 }, (_, i) => `/photos/bedroom-${i + 1}.jpg`) },
    { label: 'Balcony',   photos: Array.from({ length: 8  }, (_, i) => `/photos/balcony-${i + 1}.jpg`) },
    { label: 'Kitchen',   photos: Array.from({ length: 7  }, (_, i) => `/photos/kitchen-${i + 1}.jpg`) },
    { label: 'Bathroom',  photos: Array.from({ length: 8  }, (_, i) => `/photos/bathroom-${i + 1}.jpg`) },
    { label: 'Workspace', photos: Array.from({ length: 2  }, (_, i) => `/photos/workspace-${i + 1}.jpg`) },
  ],
  highlights: {
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  perfectFor: [
    {
      emoji: '❤️',
      title: 'Couples looking for private time',
      body: "A cozy, private, and aesthetic high-rise escape for couples who want to spend quality time together. The warm lighting, plush bed, Smart TV, games, private balcony, and river-view backdrop make it ideal for date nights, birthdays, anniversaries, or a peaceful staycation.\n\nYou can cook a simple meal together in the compact kitchen, watch your favourite shows on the Smart TV, play Jenga or String Hockey, enjoy tea on the balcony, or simply unwind in your own private space above the city. The 30th-floor view of the Yamuna River and Noida skyline adds a beautiful backdrop to your stay.",
    },
    {
      emoji: '👨‍👩‍👧',
      title: 'Small families seeking a comfortable stay',
      body: "A clean, safe, and convenient space for small families visiting Noida or Delhi NCR. With a comfortable bed, sofa seating, Smart TV, kitchen essentials, bathroom amenities, mini fridge, and private balcony, the studio works well for short family stays, weekend breaks, or city visits.\n\nThe kitchen includes basic utensils, crockery, cups, kettle, tea, sugar, and essential Indian spices, making it easy to prepare light meals or enjoy a relaxed breakfast at home. The bathroom is equipped with high-quality essentials such as towels, handwash, shampoo, dental kit, and body wash.",
    },
    {
      emoji: '💻',
      title: 'Work travellers & remote workers',
      body: "Being corporate professionals ourselves, we understand the importance of reliable Wi-Fi, a calm environment, a practical workspace, and easy connectivity.\n\nThe apartment is suitable for work-from-stay plans, business travel, client visits, online meetings, and focused work sessions. A dedicated work desk and Wi-Fi help you stay productive, while the peaceful interiors and high-rise balcony make it easy to unwind after work.\n\nThe location is also convenient for guests visiting nearby corporate, academic, and business areas including Amity University, Sector 18, Film City, South Delhi, and the Noida–Greater Noida Expressway.",
    },
    {
      emoji: '🌆',
      title: 'Staycation lovers',
      body: "Perfect for anyone who wants a break from routine without travelling too far. The 30th-floor view, minimalist decor, cozy interiors, warm lighting, Smart TV, games, and balcony seating create a relaxed staycation vibe right in the heart of Noida.\n\nIt is a great choice for solo resets, couple weekends, peaceful celebrations, or simply taking a pause from city life while still enjoying comfort, privacy, and beautiful skyline views.",
    },
    {
      emoji: '🚇',
      title: 'City explorers & metro travellers',
      body: "Supernova Spira is one of Noida's iconic high-rise addresses in Sector 94. The location offers quick access to:\n\n• Amity University — approx. 2 km\n• DLF Mall of India, Sector 18 — approx. 5 km\n• Nearest Metro: Okhla Bird Sanctuary — approx. 1 km\n• Film City & South Delhi — approx. 5 km\n• Vasco Cafe — approx. 7 km\n\nYou get the comfort of a peaceful high-rise stay while staying well-connected to major city spots.",
    },
  ],
  spaces: [
    {
      emoji: '🌃',
      title: '30th-floor river & skyline view',
      body: "The apartment sits on the 30th floor, offering beautiful views of the Yamuna River, Noida skyline, and sparkling city lights. The height gives the space a calm, elevated feeling while keeping you close to the city.",
    },
    {
      emoji: '🌙',
      title: 'Bedroom',
      body: "The bedroom is designed for restful sleep with a plush bed, soft bedding, warm lighting, and a soothing neutral palette. It is perfect for winding down after a long day, watching a movie, or enjoying a quiet night in.\n\nInside: bed linen, extra pillows and blankets, hangers, clothes storage, room-darkening blinds, safe, towels and bed sheets.",
    },
    {
      emoji: '🛋️',
      title: 'Living area',
      body: "The living space includes a comfortable sofa, Smart TV, soft lighting, and tasteful decor. It is ideal for relaxing, having conversations, watching your favourite shows, or spending a cozy evening indoors.\n\nInside: Smart TV, air conditioning, sofa seating.",
    },
    {
      emoji: '🌅',
      title: 'Balcony',
      body: "The private balcony is one of the highlights of the home. With cozy seating and a high-rise view, it is perfect for morning tea, evening coffee, late-night conversations, or simply watching the city lights.",
    },
    {
      emoji: '🍽️',
      title: 'Kitchen',
      body: "The kitchen is compact and well-equipped for everyday use. It includes basic utensils, crockery, cups, kettle, tea, sugar, and essential Indian spices. You can prepare light meals, heat food, or enjoy a relaxed breakfast at home.\n\nInside: fridge, mini fridge, freezer, microwave, oven, cooking basics (pots, pans, oil, salt, pepper), crockery and cutlery.",
    },
    {
      emoji: '💻',
      title: 'Workspace',
      body: "A dedicated work desk and Wi-Fi make the apartment suitable for remote work, calls, and short business stays. The calm environment helps you stay productive while still enjoying a staycation-style setting.\n\nInside: dedicated workspace, Wi-Fi.",
    },
    {
      emoji: '🎲',
      title: 'Games & entertainment',
      body: "The apartment includes games like Jenga and String Hockey, along with a Smart TV, making it easy to spend quality time indoors. It is great for couples, families, or anyone who wants to relax without stepping out.\n\nInside: Smart TV, board games (Jenga, String Hockey).",
    },
    {
      emoji: '🛁',
      title: 'Bathroom',
      body: "The bathroom is clean and equipped with high-quality essentials such as towels, handwash, shampoo, dental kit, and body wash.\n\nInside: bath, hot water, shampoo, body soap, shower gel, cleaning products, bidet.",
    },
    {
      emoji: '🏠',
      title: 'Safety & facilities',
      body: "Smoke alarm for safety, free parking on premises, and we welcome pets on prior request.",
    },
  ],
  pricing: {
    perNight: 14500,
    currency: '₹',
    note: 'A weekday rate — weekends and festival weeks are quoted on enquiry.',
  },
  hostName: 'Mansi & Deependra',
}

const ggn45 = {
  id: 'ggn-45',
  dashName: '685, Sector 45, Ggn',
  floor: 'Sector 45, Gurugram',
  area: 'Near Millennium City Centre metro',
  name: 'Premium cozy ambience — near Millennium metro, Gurugram',
  cardTitle: 'Boho city escape',
  cardLine: 'Warm boho interiors, a lush balcony with city views, basketball and board games.',
  airbnb: 'https://www.airbnb.co.in/rooms/1789171154499946061',
  shortDescription:
    "Your cozy city escape in Gurugram. A premium, aesthetic one-bedroom near Millennium City Centre Metro, made for slow mornings, coffee dates, workcations and weekend plans. With a cozy bedroom, stylish interiors, a lush balcony with city views and warm boho vibes, this place is your perfect little reset from the daily chaos. Come, stay, chill and make some memories.",
  images: [
    '/photos/ggn45/bedroom-1.jpg',  // cover — bed with the balcony door and city light
    '/photos/ggn45/balcony-1.jpg',
    '/photos/ggn45/living-1.jpg',
    '/photos/ggn45/kitchen-1.jpg',
    '/photos/ggn45/bathroom-1.jpg',
  ],
  gallery: [
    { label: 'Bedroom',     photos: Array.from({ length: 6 },  (_, i) => `/photos/ggn45/bedroom-${i + 1}.jpg`) },
    { label: 'Living room', photos: Array.from({ length: 9 },  (_, i) => `/photos/ggn45/living-${i + 1}.jpg`) },
    { label: 'Balcony',     photos: Array.from({ length: 7 },  (_, i) => `/photos/ggn45/balcony-${i + 1}.jpg`) },
    { label: 'Kitchen',     photos: Array.from({ length: 10 }, (_, i) => `/photos/ggn45/kitchen-${i + 1}.jpg`) },
    { label: 'Bathroom',    photos: Array.from({ length: 5 },  (_, i) => `/photos/ggn45/bathroom-${i + 1}.jpg`) },
  ],
  highlights: { guests: 3, bedrooms: 1, beds: 1, bathrooms: 1 },
  perfectFor: [
    {
      emoji: '❤️',
      title: 'Couples',
      body: "Looking for something more than just a hotel room? This is your little space to actually spend time together — play a game of basketball, challenge each other over board games, have slow coffee mornings on the balcony, curl up for a cozy evening and take a few aesthetic pictures.\n\nPerfect for date nights, birthdays, anniversaries, staycations or a spontaneous weekend together.",
    },
    {
      emoji: '💻',
      title: 'Remote workers & business trips',
      body: "A comfortable home base with a dedicated workspace and reliable Wi-Fi for workcations, business trips and remote working — and the balcony is right there when it's time to switch off.",
    },
    {
      emoji: '🌿',
      title: 'Weekend getaways',
      body: "No elaborate plans needed. Check in, grab a coffee, play some games and enjoy a slow weekend together.",
    },
    {
      emoji: '🐾',
      title: 'Pet parents',
      body: "Your furry friends are welcome too — bring your pet along and make the trip a little more special.",
    },
    {
      emoji: '🚇',
      title: 'City explorers',
      body: "Located in Sector 45 Gurugram, with easy connectivity to the city's major areas and transport network:\n\n• Millennium City Centre Metro — approx. 2.5 km\n• Fortis Hospital, Sector 44 — approx. 2 km\n• Sector 31 HUDA Market — approx. 3.5 km\n• Galleria Market, Sector 28 — approx. 3.5 km\n• Leisure Valley Park — approx. 4 km\n• Medanta Hospital, Sector 38 — approx. 4.5 km",
    },
  ],
  spaces: [
    {
      emoji: '🛏️',
      title: 'Bedroom',
      body: "A comfortable bedroom with a plush upholstered bed, crisp white linens, soft cushions and warm lighting — whether you're catching up on sleep or having a laid-back evening. A glass door opens towards the balcony and the green city view.\n\nInside: air conditioning, ceiling fan, wardrobe, work desk and chair.",
    },
    {
      emoji: '🛋️',
      title: 'Living room',
      body: "Warm boho interiors with a cozy grey sofa, a marble-top coffee table, woven wall art, a vintage clock and a gallery wall of classic-car prints — designed to feel like a little escape from the city.\n\nInside: sofa, air conditioning, ceiling fan, floor lamp.",
    },
    {
      emoji: '🌿',
      title: 'Balcony with city views',
      body: "Your little outdoor corner, lush with plants, rattan stools and a wooden table — grab your morning coffee, have evening conversations or simply take a breather. After dark, rope-hung Edison bulbs light up the city nightscape.",
    },
    {
      emoji: '🏀',
      title: 'Basketball & board games',
      body: "Because staying in doesn't have to mean being bored. Grab a ball and challenge your partner to a quick game of in-house basketball, or pick a board game for a laid-back evening.\n\nAlso: free Netflix and Prime Video.",
    },
    {
      emoji: '🍳',
      title: 'Kitchen',
      body: "A modern modular kitchen to prepare simple meals, coffee or a quick snack whenever you want.\n\nInside: induction cooktop, chimney, microwave, fridge, pots and pans, crockery and cutlery, glasses, and basic spices.",
    },
    {
      emoji: '🚿',
      title: 'Bathroom',
      body: "A stylish bathroom with warm marble-look walls, a vessel wash basin, a wall-hung toilet with health faucet and a rain shower.",
    },
    {
      emoji: '💻',
      title: 'Workspace & Wi-Fi',
      body: "A dedicated workspace gives you a comfortable spot to focus, and Wi-Fi keeps you connected whether you're joining a work call, streaming or planning your day.",
    },
    {
      emoji: '🏠',
      title: 'Parking & pets',
      body: "Free, safe parking directly outside the building, and pets are welcome.",
    },
  ],
  hostName: 'Mansi & Deependra',
}

const PROPERTIES = [spira3028, spira2212, ggn45]
const propertyById = (id) => PROPERTIES.find((p) => p.id === id)

/* ----------------------------------------------------------------------------
 * SUBMIT HANDLER — POSTs to /api/enquiry, which sends the email via Resend.
 * Server-side handler lives in /api/enquiry.js at the project root.
 * -------------------------------------------------------------------------- */
async function handleSubmit(payload) {
  const res = await fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Failed to send enquiry')
  }
  return { ok: true }
}

/* ----------------------------------------------------------------------------
 * Inline icons — Lucide-flavoured, 1.5 stroke, currentColor.
 * -------------------------------------------------------------------------- */
const Icon = ({ name, className = 'w-5 h-5' }) => {
  const c = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    guests:    <><circle cx="9" cy="8" r="3.2" {...c}/><path d="M3 20c.8-3.4 3.4-5 6-5s4.8 1.5 5.6 4" {...c}/><circle cx="17" cy="9" r="2.4" {...c}/><path d="M15 20c.6-2.6 2.4-3.8 4.4-3.8" {...c}/></>,
    bed:       <><path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6" {...c}/><path d="M3 18h18M7 12h4v3H7z" {...c}/></>,
    bath:      <><path d="M5 11V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2" {...c}/><path d="M3 11h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" {...c}/><path d="M7 19l-1 2M17 19l1 2" {...c}/></>,
    door:      <><path d="M6 3h12v18H6z" {...c}/><circle cx="15" cy="12" r="0.8" fill="currentColor" stroke="none"/></>,
    pool:      <><path d="M3 18c2 1 3-1 5 0s3 1 5 0 3-1 5 0 2 0 3 0" {...c}/><path d="M7 14V6a2 2 0 0 1 2-2h2M17 14V6a2 2 0 0 0-2-2h-2" {...c}/></>,
    wifi:      <><path d="M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0" {...c}/><circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none"/></>,
    kitchen:   <><rect x="4" y="3" width="16" height="18" rx="2" {...c}/><path d="M4 9h16M9 13v4M15 13v4" {...c}/></>,
    parking:   <><rect x="3" y="3" width="18" height="18" rx="3" {...c}/><path d="M10 17V8h3a3 3 0 0 1 0 6h-3" {...c}/></>,
    tv:        <><rect x="3" y="5" width="18" height="12" rx="2" {...c}/><path d="M9 21h6M12 17v4" {...c}/></>,
    fireplace: <><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 2 2 1 0-2 0-3 0-5z" {...c}/></>,
    view:      <><path d="M3 19l5-7 4 5 3-4 6 8" {...c}/><circle cx="17" cy="6" r="2" {...c}/></>,
    ac:        <><circle cx="12" cy="12" r="2.2" {...c}/><path d="M12 4v16M4 12h16M6 6l12 12M18 6L6 18" {...c}/></>,
    breakfast: <><path d="M4 11h13a3 3 0 1 1 0 6H4z" {...c}/><path d="M8 7c0-1 1-1 1-2s-1-1-1-2M12 7c0-1 1-1 1-2s-1-1-1-2" {...c}/></>,
    housekeeping: <><path d="M5 21l3-9h8l3 9z" {...c}/><path d="M9 12V7a3 3 0 0 1 6 0v5" {...c}/></>,
    pin:       <><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" {...c}/><circle cx="12" cy="10" r="2.4" {...c}/></>,
    check:     <path d="M5 12l4 4 10-10" {...c}/>,
    arrow:     <path d="M5 12h14M13 6l6 6-6 6" {...c}/>,
    chev:      <path d="M6 9l6 6 6-6" {...c}/>,
    phone:     <path d="M5 4h3l2 5-2 1c1 2.5 3.5 5 6 6l1-2 5 2v3a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2z" {...c}/>,
    sparkle:   <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" {...c}/>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" {...c}/><circle cx="12" cy="12" r="4" {...c}/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/></>,
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[name] ?? null}
    </svg>
  )
}

/* ============================================================================
 * Main App
 * ========================================================================= */
/* ----------------------------------------------------------------------------
 * Routing — two kinds of page, no router library needed:
 *   /                 home: intro + one card per property
 *   /homes/<id>       that property's details + the enquiry form
 * vercel.json rewrites /homes/* to index.html so a shared link loads directly.
 * -------------------------------------------------------------------------- */
const homePath = (id) => `/homes/${id}`
function currentPropertyId() {
  const m = /^\/homes\/([^/?#]+)/.exec(window.location.pathname)
  return m && propertyById(m[1]) ? m[1] : null
}
function navigate(to) {
  if (to === window.location.pathname) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
// Plain <a href> that routes in-app on a normal click, but still lets
// cmd/ctrl-click open a new tab.
function Link({ to, className, children, ...rest }) {
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={onClick} className={className} {...rest}>{children}</a>
}

export default function App() {
  const [pageId, setPageId] = useState(currentPropertyId)
  // Which home's gallery is open in the lightbox (null = closed)
  const [galleryFor, setGalleryFor] = useState(null)

  useEffect(() => {
    const onPop = () => { setPageId(currentPropertyId()); setGalleryFor(null) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // A new page starts at the top, and says which home it is in the tab title.
  const property = pageId ? propertyById(pageId) : null
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
    document.title = property
      ? `${property.cardTitle} · ${property.floor} — Roam in Heels`
      : 'Roam in Heels — Homes in Noida & Gurugram'
  }, [pageId])

  return (
    <div className="min-h-screen bg-white text-espresso">
      <NavBar onDetail={!!property} />
      <main>
        {property ? (
          <PropertyPage key={property.id} property={property} openGallery={() => setGalleryFor(property.id)} />
        ) : (
          <>
            <Intro />
            <PropertyCards />
          </>
        )}
      </main>
      <Footer onDetail={!!property} />
      {galleryFor && <GalleryLightbox property={propertyById(galleryFor)} onClose={() => setGalleryFor(null)} />}
      {property && <StickyMobileCta />}
    </div>
  )
}

/* One property: its details, then the enquiry form already set to it. */
function PropertyPage({ property, openGallery }) {
  // The form's home picker starts on this home; the guest can still switch it.
  const [enquiryProp, setEnquiryProp] = useState(property.id)
  const toForm = () => {
    setEnquiryProp(property.id)
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-5 sm:pt-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[14px] text-bark hover:text-rose transition-colors">
          <span aria-hidden className="text-lg leading-none">‹</span> All homes
        </Link>
      </div>
      <PropertySection property={property} openGallery={openGallery} onEnquire={toForm} />
      <EnquirySection propertyId={enquiryProp} setPropertyId={setEnquiryProp} />
    </>
  )
}

/* ----------------------------------------------------------------------------
 * Intro + the property cards — the first thing a visitor sees
 * -------------------------------------------------------------------------- */
function Intro() {
  return (
    <section id="top" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-6 sm:pt-10 lg:pt-12">
      <div className="eyebrow mb-3">Noida · Gurugram</div>
      <h1 className="font-display text-[clamp(2rem,5vw+0.25rem,4rem)] leading-[1.08] tracking-[-0.01em] max-w-4xl">
        Three homes in Noida & Gurugram, hosted by {spira3028.hostName}.
      </h1>
      <p className="text-bark mt-4 text-[16px] sm:text-[17px] font-light leading-[1.7] max-w-2xl">
        Two river-view studios high above the Yamuna in Noida, and a cozy boho one-bedroom near Millennium City Centre metro in Gurugram — pick the one that suits your stay and send us an enquiry from its page.
      </p>
    </section>
  )
}

function PropertyCards() {
  return (
    <section id="homes" aria-label="Our homes" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mt-8 sm:mt-12 mb-16 sm:mb-24">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {PROPERTIES.map((p) => {
          const h = p.highlights
          return (
            <Link
              key={p.id}
              to={homePath(p.id)}
              aria-label={`${p.cardTitle}, ${p.floor} — view details`}
              className="group bg-white rounded-[20px] shadow-card hover:shadow-soft overflow-hidden flex flex-col transition-shadow duration-200 ease-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/40"
            >
              <div className="block relative overflow-hidden bg-bone aspect-[4/3]">
                <img src={p.images[0]} alt={p.name} loading="eager" className="w-full h-full object-cover transition-transform duration-[480ms] ease-soft group-hover:scale-[1.03]" />
                <span className="absolute top-4 left-4 bg-white/95 text-espresso text-[12px] tracking-[0.06em] uppercase px-3 py-1.5 rounded-pill shadow-soft">
                  {p.floor}
                </span>
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <h2 className="font-display text-2xl sm:text-[1.75rem] leading-[1.15]">{p.cardTitle}</h2>
                <p className="text-bark mt-2 text-[15px] leading-[1.6] font-light">{p.cardLine}</p>
                <p className="text-driftwood mt-3 text-[13px]">
                  {h.guests} guests · {h.bedrooms} bedroom · {h.beds} bed · {h.bathrooms} bathroom
                </p>
                <div className="mt-auto pt-6">
                  <span className="flex w-full items-center justify-center gap-2 bg-rose group-hover:bg-cocoa text-white py-3 rounded-pill text-[14px] tracking-[0.02em] transition-colors duration-200 ease-soft">
                    View details <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * Nav — paper transparent at top, blurs to translucent paper on scroll
 * -------------------------------------------------------------------------- */
function NavBar({ onDetail }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'sticky top-0 z-40 transition-all duration-[260ms] ease-soft border-b border-stone/60',
        scrolled
          ? 'bg-white/85 backdrop-blur-md backdrop-saturate-150'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-16 sm:h-20 lg:h-[120px] flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 shrink">
          <span
            className="w-11 h-11 sm:w-14 sm:h-14 lg:w-[100px] lg:h-[100px] rounded-full bg-cover bg-center shrink-0"
            style={{ backgroundImage: 'url(/logo.png)' }}
            aria-hidden
          />
          <span className="hidden sm:inline font-display text-rose text-lg lg:text-2xl leading-none whitespace-nowrap">
            Roam in heels
          </span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {[
            { label: 'Airbnb',      icon: '/icons/airbnb.png',    href: 'https://www.airbnb.co.in/rooms/1676660261082003123?photo_id=2619490219&source_impression_id=p3_1778331410_P3OKpLmJ8GlmxTOG&previous_page_section_name=1000' },
            { label: 'Booking.com', icon: '/icons/booking.svg',   href: 'https://www.booking.com/Share-4Tk1Yt' },
            { label: 'MakeMyTrip',  icon: '/icons/mmt.png',       href: 'https://www.makemytrip.com/hotels/hotel-details/?checkin=05162026&checkout=05172026&city=NOIDA&country=India&roomStayQualifier=2e0e&hotelId=202605031227156320&locusId=locusId&locusType=city&currency=INR&source=INGO' },
            { label: 'Instagram',   icon: '/icons/instagram.png', href: 'https://www.instagram.com/roam_in_heels?igsh=MTA0ODA3bzk5NGc2NA==' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Roam in Heels on ${link.label}`}
              title={link.label}
              className="block w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden hover:opacity-80 active:scale-[0.96] transition-all duration-200 ease-soft"
            >
              <img src={link.icon} alt={link.label} className="w-full h-full object-contain" />
            </a>
          ))}
          {onDetail && <a
            href="#enquiry"
            className="hidden sm:inline-flex items-center gap-2 border border-cocoa text-espresso hover:bg-bone px-4 sm:px-5 py-1.5 sm:py-2 rounded-pill text-[12px] sm:text-[13px] tracking-[0.02em] transition-colors duration-200 ease-soft ml-1 sm:ml-2 whitespace-nowrap"
          >
            Send enquiry
          </a>}
        </div>
      </div>
    </header>
  )
}

/* ----------------------------------------------------------------------------
 * Property showcase
 * -------------------------------------------------------------------------- */
function PropertySection({ property, openGallery, onEnquire }) {
  const { name, shortDescription, images, gallery, highlights, perfectFor, spaces } = property
  const [activeImage, setActiveImage] = useState(0)
  const totalPhotos = gallery.reduce((n, g) => n + g.photos.length, 0)

  return (
    <section id="property" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-4 sm:pt-6">
      {/* Title block */}
      <div className="mb-5 sm:mb-10 max-w-4xl">
        <div className="eyebrow mb-3">{property.floor} · {property.area}</div>
        <h1 className="font-display text-[clamp(1.875rem,5vw+0.25rem,4rem)] leading-[1.1] sm:leading-[1.05] tracking-[-0.01em]">
          {name}
        </h1>
      </div>

      {/* Gallery */}
      <div className="relative">
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 rounded-2xl overflow-hidden h-[30rem]">
          <button
            onClick={openGallery}
            className="col-span-2 row-span-2 group relative overflow-hidden bg-bone"
          >
            <img src={images[0]} alt={name} loading="eager" className="w-full h-full object-cover transition-transform duration-[480ms] ease-soft group-hover:scale-[1.03]" />
          </button>
          {images.slice(1, 5).map((src, i) => (
            <button key={i} onClick={openGallery} className="relative overflow-hidden group bg-bone">
              <img src={src} alt={`${name} ${i + 2}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-[480ms] ease-soft group-hover:scale-[1.03]" />
            </button>
          ))}
          <button
            onClick={openGallery}
            className="absolute bottom-5 right-5 inline-flex items-center gap-2 bg-white/95 hover:bg-white text-[13px] tracking-[0.02em] text-espresso px-5 py-2.5 rounded-pill shadow-soft border border-stone transition-colors"
          >
            Show all {totalPhotos} photos
          </button>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="relative rounded-2xl overflow-hidden bg-bone">
            <img src={images[activeImage]} alt={name} loading="eager" className="w-full h-72 object-cover" />
            <button
              onClick={openGallery}
              className="absolute bottom-3 right-3 bg-white/95 text-xs tracking-[0.02em] px-4 py-1.5 rounded-pill shadow-soft border border-stone"
            >
              All {totalPhotos} photos
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 -mx-5 px-5">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`shrink-0 rounded-lg overflow-hidden border transition-colors ${
                  i === activeImage ? 'border-rose' : 'border-transparent'
                }`}
              >
                <img src={src} alt="" className="w-16 h-16 object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="mt-14 grid lg:grid-cols-3 gap-12 lg:gap-16">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-14">
          {/* Host strip */}
          <div className="flex items-center justify-between border-b border-stone pb-7">
            <div>
              <h2 className="font-display text-3xl sm:text-[2rem] leading-[1.1]">
                Hosted by {property.hostName}
              </h2>
              <p className="text-bark mt-1.5 text-[15px]">
                {highlights.guests} {highlights.guests === 1 ? 'guest' : 'guests'} · {highlights.bedrooms} {highlights.bedrooms === 1 ? 'bedroom' : 'bedrooms'} · {highlights.beds} {highlights.beds === 1 ? 'bed' : 'beds'} · {highlights.bathrooms} {highlights.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
              </p>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-bark leading-[1.75] text-[17px] font-light max-w-2xl">
              {shortDescription}
            </p>
          </div>

          {/* Perfect for */}
          <div id="perfect-for">
            <h3 className="font-display text-2xl sm:text-3xl mb-6">
              Perfect for
            </h3>
            <div className="border-t border-stone">
              {perfectFor.map((item) => (
                <Accordion key={item.title} emoji={item.emoji} title={item.title}>
                  {item.body}
                </Accordion>
              ))}
            </div>
          </div>

          {/* The space */}
          <div id="the-space">
            <h3 className="font-display text-2xl sm:text-3xl mb-6">
              The Space
            </h3>
            <div className="border-t border-stone">
              {spaces.map((item) => (
                <Accordion key={item.title} emoji={item.emoji} title={item.title}>
                  {item.body}
                </Accordion>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — sticky booking card */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-32">
            <div className="bg-white rounded-[20px] p-7 shadow-card">
              <button
                onClick={onEnquire}
                className="flex w-full items-center justify-center gap-2 bg-rose hover:bg-cocoa text-white font-medium tracking-[0.02em] py-3.5 rounded-pill transition-colors duration-200 ease-soft"
              >
                Enquire about this home
                <Icon name="arrow" className="w-4 h-4" />
              </button>
              {property.airbnb && (
                <a
                  href={property.airbnb}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 border border-stone text-bark hover:bg-bone py-3 rounded-pill text-[14px] transition-colors duration-200 ease-soft"
                >
                  <img src="/icons/airbnb.png" alt="" className="w-4 h-4 object-contain" />
                  View on Airbnb
                </a>
              )}

              <div className="mt-7 pt-6 border-t border-stone grid grid-cols-2 gap-3 text-[13px]">
                <Trust label="Hosted personally" />
                <Trust label="Direct contact" />
                <Trust label="No platform fees" />
                <Trust label="Flexible dates" />
              </div>
            </div>

            <p className="text-center text-[12px] text-driftwood italic mt-5 px-4">
              <span className="font-display text-rose text-base align-middle">Roam in heels</span>
              {' '}— a small portfolio of warm places.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Trust({ label }) {
  return (
    <div className="flex items-center gap-2 text-bark">
      <Icon name="check" className="w-4 h-4 text-rose shrink-0" />
      <span>{label}</span>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Gallery lightbox
 * -------------------------------------------------------------------------- */
function GalleryLightbox({ property, onClose }) {
  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(46,31,20,0.94)' }}
      onClick={onClose}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 backdrop-blur" style={{ background: 'rgba(46,31,20,0.78)' }}>
        <button onClick={onClose} className="text-cream text-sm tracking-[0.04em] uppercase border border-cream/30 rounded-pill px-4 py-1.5 hover:bg-cream/10 transition">
          ✕ Close
        </button>
        <div className="font-display text-cream text-lg sm:text-2xl truncate ml-4">{property.cardTitle}</div>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-5 sm:px-8" onClick={(e) => e.stopPropagation()}>
        {property.gallery.map((group) => (
          <section key={group.label} className="mb-16 last:mb-0">
            <div className="flex items-baseline gap-4 mb-7 flex-wrap">
              <h2 className="font-display text-4xl sm:text-5xl leading-none" style={{ color: '#FDE0C4' }}>
                {group.label}
              </h2>
              <span className="text-cream/60 text-sm">{group.photos.length} photos</span>
              <div className="flex-1 border-b border-cream/15" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.photos.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt={group.label}
                  loading="lazy"
                  className="w-full rounded-[12px] bg-bone/10"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Sticky mobile CTA
 * -------------------------------------------------------------------------- */
function StickyMobileCta() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-stone px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="font-display text-base sm:text-lg text-espresso leading-tight min-w-0 truncate">
          Book direct with the host
        </div>
        <a
          href="#enquiry"
          className="inline-flex items-center gap-1.5 bg-rose hover:bg-cocoa text-white px-4 sm:px-5 py-2.5 rounded-pill text-[13px] tracking-[0.02em] shadow-card transition-colors shrink-0"
        >
          Send enquiry <Icon name="arrow" className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

/* ============================================================================
 * Enquiry section
 * ========================================================================= */
function EnquirySection({ propertyId, setPropertyId }) {
  const initial = {
    fullName: '',
    mobile: '',
    checkIn: '',          // ISO datetime-local string (YYYY-MM-DDTHH:MM)
    checkOut: '',
    guests: 2,
    message: '',
    referralSource: '',
    referralOther: '',
  }
  const [form, setForm]     = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const chosen = propertyById(propertyId)
  // Guest cap: the chosen home's, or the largest of them when any will do.
  const maxGuests = chosen ? chosen.highlights.guests : Math.max(...PROPERTIES.map((p) => p.highlights.guests))

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'A name, please'
    if (!form.mobile.trim()) {
      e.mobile = 'A mobile number, please'
    } else if (!/^[+()0-9\s-]{7,20}$/.test(form.mobile.trim())) {
      e.mobile = 'That number doesn\'t look quite right'
    }
    if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn) {
      e.checkOut = 'Check-out should be after check-in'
    }
    if (Number(form.guests) < 1) e.guests = 'At least one'
    if (Number(form.guests) > maxGuests) {
      e.guests = `We sleep ${maxGuests}, comfortably`
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    const payload = {
      ...form,
      // The dashboard name ('Spira 2212'), so the enquiry lands under the right
      // property there; '' when the guest is happy with any home.
      property: chosen ? chosen.dashName : '',
      propertyLabel: chosen ? `${chosen.dashName} — ${chosen.name}` : 'Any home — whichever is free',
      submittedAt: new Date().toISOString(),
    }
    try {
      const res = await handleSubmit(payload)
      if (!res?.ok) throw new Error('submit failed')
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  function reset() {
    setForm(initial)
    setErrors({})
    setStatus('idle')
  }

  return (
    <section id="enquiry" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-[120px] mt-16 sm:mt-24 lg:mt-32 mb-24 lg:mb-20 bg-cream">
      <div
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-20 lg:py-28 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center bg-cover bg-center rounded-[24px] overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(253,240,219,0.92) 0%, rgba(253,240,219,0.65) 45%, rgba(253,240,219,0.25) 100%), url(/enquiry-bg.jpg)',
        }}
      >
        {/* LEFT — pitch */}
        <div className="relative">
          <div className="eyebrow mb-5">Slip into the booking</div>
          <h2 className="font-display text-[clamp(2.25rem,3.5vw+.25rem,3.5rem)] leading-[1.05] tracking-[-0.01em]">
            Tell us when you'd like to come, we'll tell you everything else.
          </h2>

        </div>

        {/* RIGHT — form card */}
        <div className="bg-white rounded-[20px] shadow-card p-7 sm:p-10">
          {status === 'success' ? (
            <SuccessState onReset={reset} hostName={spira3028.hostName} />
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="mb-2">
                <div className="eyebrow mb-2">Send enquiry</div>
                <h3 className="font-display text-3xl leading-tight">A few quick details.</h3>
              </div>

              <label className="block">
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className={inputCls(false)}
                  aria-label="Which home"
                >
                  <option value="">Any home — whichever is free</option>
                  {PROPERTIES.map((p) => (
                    <option key={p.id} value={p.id}>{p.floor} — {p.cardTitle}</option>
                  ))}
                </select>
                {chosen?.backupNote && <span className="text-[12.5px] text-bark mt-2 block leading-relaxed">
                  <Icon name="sparkle" className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-rose" />
                  In case the unit is not available on your dates, we will provide another unit in the same building.
                </span>}
              </label>

              <Field label="Full name" required error={errors.fullName}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className={inputCls(errors.fullName)}
                  autoComplete="name"
                />
              </Field>

              <Field label="Mobile number" required error={errors.mobile}>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => update('mobile', e.target.value)}
                  className={inputCls(errors.mobile)}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </Field>

              <StayPicker
                checkIn={form.checkIn}
                checkOut={form.checkOut}
                onChange={(ci, co) => { update('checkIn', ci); update('checkOut', co) }}
                error={errors.checkOut}
              />

              <Field label="Guests" error={errors.guests}>
                <select
                  value={form.guests}
                  onChange={(e) => update('guests', Number(e.target.value))}
                  className={inputCls(errors.guests)}
                >
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </Field>

              <Field label="Anything we should know">
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className={inputCls(false) + ' resize-none'}
                />
              </Field>

              {/* Referral source — select with conditional "Others" text input */}
              <div>
                <label className="block">
                  <select
                    value={form.referralSource}
                    onChange={(e) => update('referralSource', e.target.value)}
                    className={inputCls(false)}
                    aria-label="How did you hear about us"
                  >
                    <option value="" disabled>How did you hear about us</option>
                    <option>Airbnb</option>
                    <option>Booking.com</option>
                    <option>Make my trip</option>
                    <option>Agoda</option>
                    <option>Friends & family</option>
                    <option>Others</option>
                  </select>
                </label>
                {form.referralSource === 'Others' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      maxLength={100}
                      placeholder="Tell us how you heard about us"
                      aria-label="Tell us how you heard about us"
                      value={form.referralOther}
                      onChange={(e) => update('referralOther', e.target.value.slice(0, 100))}
                      className={inputCls(false)}
                    />
                    <div className="text-[11px] text-driftwood mt-1.5 text-right">
                      {form.referralOther.length} / 100
                    </div>
                  </div>
                )}
              </div>

              {status === 'error' && (
                <div className="text-[13px] text-clay bg-clay/5 border border-clay/30 rounded-md px-3 py-2.5">
                  Something went a little sideways. Try again, or message us on WhatsApp.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 bg-rose hover:bg-cocoa disabled:opacity-60 text-white font-medium tracking-[0.02em] py-3.5 rounded-pill transition-colors duration-200 ease-soft active:scale-[0.98]"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>Send enquiry <Icon name="arrow" className="w-4 h-4"/></>
                )}
              </button>

              <p className="text-[11.5px] text-driftwood text-center leading-relaxed">
                By sending you agree to be contacted by the host. We never share your number.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* Collapsible accordion item built on native <details>/<summary> for built-in
 * keyboard + a11y. Body accepts plain text with newlines.
 */
function Accordion({ emoji, title, children }) {
  return (
    <details className="group border-b border-stone last:border-b-0">
      <summary className="cursor-pointer flex items-center justify-between gap-4 py-5 list-none [&::-webkit-details-marker]:hidden hover:text-rose transition-colors">
        <span className="font-display text-xl sm:text-[1.4rem] text-espresso group-hover:text-rose transition-colors flex items-center gap-3">
          <span className="text-2xl shrink-0" aria-hidden>{emoji}</span>
          <span>{title}</span>
        </span>
        <Icon name="chev" className="w-5 h-5 text-rose transition-transform duration-300 ease-soft group-open:rotate-180 shrink-0" />
      </summary>
      <div className="pb-6 -mt-1 text-bark text-[15px] leading-[1.75] font-light max-w-2xl whitespace-pre-line pl-12 pr-2">
        {children}
      </div>
    </details>
  )
}

/* ----------------------------------------------------------------------------
 * Stay picker — tap-to-pick calendar instead of the browser's datetime box,
 * which made guests type "dd/mm/yyyy, --:--". Tap the check-in day, then the
 * check-out day; times are a dropdown that starts at the house times.
 * Values stay 'YYYY-MM-DDTHH:MM' so the API, email and dashboard are unchanged.
 * -------------------------------------------------------------------------- */
const DEFAULT_IN = '12:00'   // check-in after 12:00 pm
const DEFAULT_OUT = '10:00'  // check-out before 10:00 am
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const pad2 = (n) => String(n).padStart(2, '0')
const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const TIMES = Array.from({ length: 48 }, (_, i) => `${pad2(Math.floor(i / 2))}:${i % 2 ? '30' : '00'}`)
function fmtTime(t) {
  const [h, m] = t.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${pad2(m)} ${h >= 12 ? 'PM' : 'AM'}`
}
function fmtDay(key) {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function StayPicker({ checkIn, checkOut, onChange, error }) {
  const inDay = checkIn.slice(0, 10), inTime = checkIn.slice(11, 16) || DEFAULT_IN
  const outDay = checkOut.slice(0, 10), outTime = checkOut.slice(11, 16) || DEFAULT_OUT
  const [open, setOpen] = useState(false)
  // Which end the next tap sets. After check-in is picked it moves to check-out.
  const [picking, setPicking] = useState('in')
  const today = ymd(new Date())
  const [view, setView] = useState(() => {
    const d = inDay ? new Date(inDay + 'T00:00') : new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })

  const set = (ci, co) => onChange(ci ? `${ci}T${inTime}` : '', co ? `${co}T${outTime}` : '')
  const openAt = (which) => {
    setPicking(which === 'out' && !inDay ? 'in' : which)
    setOpen(true)
  }
  function pickDay(key) {
    if (key < today) return
    if (picking === 'in' || !inDay || key < inDay) {
      // A new check-in; keep the check-out only if it still comes after it.
      set(key, outDay && outDay > key ? outDay : '')
      setPicking('out')
    } else {
      set(inDay, key)
      setPicking('in')
      setOpen(false)
    }
  }

  // Calendar grid for the viewed month, weeks starting Monday.
  const first = new Date(view.y, view.m, 1)
  const lead = (first.getDay() + 6) % 7
  const days = new Date(view.y, view.m + 1, 0).getDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => ymd(new Date(view.y, view.m, i + 1)))]
  const thisMonth = new Date().getFullYear() * 12 + new Date().getMonth()
  const canPrev = view.y * 12 + view.m > thisMonth
  const shift = (n) => setView(({ y, m }) => { const d = new Date(y, m + n, 1); return { y: d.getFullYear(), m: d.getMonth() } })
  const nights = inDay && outDay
    ? Math.round((new Date(outDay + 'T00:00') - new Date(inDay + 'T00:00')) / 86400000) : 0

  const box = (which, label, day, time) => {
    const active = open && picking === which
    return (
      <button
        type="button"
        onClick={() => (active ? setOpen(false) : openAt(which))}
        aria-expanded={active}
        className={[
          'text-left rounded-md bg-white px-4 py-2.5 border transition-all duration-200 ease-soft',
          active ? 'border-rose ring-2 ring-rose/15' : error && which === 'out' ? 'border-clay' : 'border-stone hover:border-driftwood',
        ].join(' ')}
      >
        <span className="block text-[11px] uppercase tracking-[0.08em] text-driftwood">{label}</span>
        <span className={`block text-[15px] mt-0.5 ${day ? 'text-espresso' : 'text-driftwood'}`}>
          {day ? `${fmtDay(day)} · ${fmtTime(time)}` : 'Add date'}
        </span>
      </button>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {box('in', 'Check-in', inDay, inTime)}
        {box('out', 'Check-out', outDay, outTime)}
      </div>
      {error && <span className="text-[12px] text-clay mt-1.5 block">{error}</span>}

      {open && (
        <div className="mt-3 rounded-[14px] border border-stone bg-white p-4 shadow-soft">
          <div className="text-[13px] text-bark mb-3">
            {picking === 'in' ? 'Select your check-in date' : 'Now select your check-out date'}
          </div>
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month"
              className="w-9 h-9 rounded-full hover:bg-bone disabled:opacity-30 disabled:hover:bg-transparent text-xl leading-none">‹</button>
            <div className="font-display text-lg">{MONTHS[view.m]} {view.y}</div>
            <button type="button" onClick={() => shift(1)} aria-label="Next month"
              className="w-9 h-9 rounded-full hover:bg-bone text-xl leading-none">›</button>
          </div>
          <div className="grid grid-cols-7 text-center text-[11px] uppercase tracking-[0.06em] text-driftwood mb-1">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map((d) => <div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {cells.map((key, i) => {
              if (!key) return <div key={'b' + i} />
              const past = key < today
              const isIn = key === inDay, isOut = key === outDay
              const between = inDay && outDay && key > inDay && key < outDay
              return (
                <button
                  key={key}
                  type="button"
                  disabled={past}
                  onClick={() => pickDay(key)}
                  aria-label={fmtDay(key)}
                  aria-pressed={isIn || isOut}
                  className={[
                    'h-10 text-[14px] transition-colors',
                    between ? 'bg-bone' : '',
                    isIn && outDay ? 'rounded-l-full' : '',
                    isOut ? 'rounded-r-full' : '',
                    isIn || isOut ? 'bg-rose text-white font-medium rounded-full' : past ? 'text-stone cursor-not-allowed' : 'text-espresso hover:bg-bone rounded-full',
                    key === today && !isIn && !isOut ? 'font-semibold underline underline-offset-4 decoration-rose/50' : '',
                  ].join(' ')}
                >
                  {Number(key.slice(8))}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-stone">
            <label className="block">
              <span className="block text-[11px] uppercase tracking-[0.08em] text-driftwood mb-1">Check-in time</span>
              <select value={inTime} onChange={(e) => onChange(inDay ? `${inDay}T${e.target.value}` : '', checkOut)}
                disabled={!inDay} className={inputCls(false) + ' py-2 disabled:opacity-50'}>
                {TIMES.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-[11px] uppercase tracking-[0.08em] text-driftwood mb-1">Check-out time</span>
              <select value={outTime} onChange={(e) => onChange(checkIn, outDay ? `${outDay}T${e.target.value}` : '')}
                disabled={!outDay} className={inputCls(false) + ' py-2 disabled:opacity-50'}>
                {TIMES.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button type="button" onClick={() => { onChange('', ''); setPicking('in') }}
              className="text-[13px] text-bark underline underline-offset-2 hover:text-rose">Clear dates</button>
            <div className="flex items-center gap-3">
              {nights > 0 && <span className="text-[13px] text-bark">{nights} night{nights === 1 ? '' : 's'}</span>}
              <button type="button" onClick={() => setOpen(false)}
                className="bg-espresso text-white text-[13px] px-5 py-2 rounded-pill hover:opacity-90">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, required, error, children }) {
  const placeholder = label ? (required ? `${label} *` : label) : undefined
  const enhanced = isValidElement(children) && placeholder
    ? cloneElement(children, {
        placeholder,
        'aria-label': children.props['aria-label'] ?? label,
      })
    : children
  return (
    <label className="block">
      {enhanced}
      {error && <span className="text-[12px] text-clay mt-1.5 block">{error}</span>}
    </label>
  )
}

function inputCls(hasError) {
  return [
    'w-full rounded-md bg-white px-4 py-3 text-[15px] text-espresso',
    'border transition-all duration-200 ease-soft',
    'placeholder:text-driftwood',
    'focus:outline-none focus:ring-2',
    hasError
      ? 'border-clay focus:border-clay focus:ring-clay/20'
      : 'border-stone focus:border-rose focus:ring-rose/15',
  ].join(' ')
}

function SuccessState({ onReset, hostName }) {
  return (
    <div className="text-center py-6">
      <div className="mx-auto w-16 h-16 ring-mark flex items-center justify-center mb-5 text-rose">
        <Icon name="check" className="w-7 h-7" />
      </div>
      <div className="eyebrow mb-2">Sent</div>
      <h3 className="font-display text-3xl leading-tight mb-3">Thank you — your note's on its way.</h3>
      <p className="text-bark leading-relaxed max-w-sm mx-auto">
        We've received your enquiry. <em>{hostName}</em> will get back to you shortly with availability and the rest of the small details.
      </p>
      <button
        onClick={onReset}
        className="mt-7 text-[13px] text-rose hover:text-cocoa underline-offset-2 hover:underline transition-colors"
      >
        Send another enquiry
      </button>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Footer
 * -------------------------------------------------------------------------- */
function Footer({ onDetail }) {
  return (
    <footer className="bg-white border-t border-stone pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-14 grid sm:grid-cols-[auto_1fr_auto] gap-6 sm:gap-8 items-start text-[14px] text-bark">
        <div className="flex items-start gap-4">
          <span
            className="w-14 h-14 rounded-full bg-cover bg-center shrink-0"
            style={{ backgroundImage: 'url(/logo.png)' }}
            aria-hidden
          />
          <div>
            <div className="font-display text-rose text-2xl leading-none pt-1">Roam in heels</div>
            <p className="mt-2 max-w-md leading-relaxed">
              A small portfolio of warm, hand-picked homes. Hosted personally — never outsourced.
            </p>
          </div>
        </div>
        <div />
        <div className="text-driftwood text-[12.5px] sm:text-right leading-relaxed">
          <div>© {new Date().getFullYear()} Roam in Heels.</div>
          <a href={onDetail ? '#enquiry' : '#homes'} className="text-rose hover:text-cocoa transition-colors">
            Contact the host
          </a>
        </div>
      </div>
    </footer>
  )
}
