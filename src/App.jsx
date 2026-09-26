import { useState, useMemo, useEffect, cloneElement, isValidElement } from 'react'

/* ----------------------------------------------------------------------------
 * PROPERTY DATA — replace these fields to relist a different property.
 * Keep the shape stable; the UI reads only from this object.
 * -------------------------------------------------------------------------- */
const property = {
  name: '30th floor — Luxury apartment (Riverview), Noida',
  city: 'Mussoorie',
  region: 'Uttarakhand',
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
export default function App() {
  const [activeImage, setActiveImage] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  return (
    <div className="min-h-screen bg-white text-espresso">
      <NavBar />
      <main>
        <PropertySection
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          openGallery={() => setGalleryOpen(true)}
        />
        <EnquirySection />
      </main>
      <Footer />
      {galleryOpen && <GalleryLightbox onClose={() => setGalleryOpen(false)} />}
      <StickyMobileCta />
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Nav — paper transparent at top, blurs to translucent paper on scroll
 * -------------------------------------------------------------------------- */
function NavBar() {
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
        <a href="#top" className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 shrink">
          <span
            className="w-11 h-11 sm:w-14 sm:h-14 lg:w-[100px] lg:h-[100px] rounded-full bg-cover bg-center shrink-0"
            style={{ backgroundImage: 'url(/logo.png)' }}
            aria-hidden
          />
          <span className="hidden sm:inline font-display text-rose text-lg lg:text-2xl leading-none whitespace-nowrap">
            Roam in heels
          </span>
        </a>
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
          <a
            href="#enquiry"
            className="hidden sm:inline-flex items-center gap-2 border border-cocoa text-espresso hover:bg-bone px-4 sm:px-5 py-1.5 sm:py-2 rounded-pill text-[12px] sm:text-[13px] tracking-[0.02em] transition-colors duration-200 ease-soft ml-1 sm:ml-2 whitespace-nowrap"
          >
            Send enquiry
          </a>
        </div>
      </div>
    </header>
  )
}

/* ----------------------------------------------------------------------------
 * Property showcase
 * -------------------------------------------------------------------------- */
function PropertySection({ activeImage, setActiveImage, openGallery }) {
  const { name, shortDescription, images, gallery, highlights, perfectFor, spaces, pricing } = property
  const totalPhotos = gallery.reduce((n, g) => n + g.photos.length, 0)

  return (
    <section id="property" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-6 sm:pt-10 lg:pt-12">
      {/* Title block */}
      <div className="mb-5 sm:mb-10 max-w-4xl">
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
              <a
                href="#enquiry"
                className="flex w-full items-center justify-center gap-2 bg-rose hover:bg-cocoa text-white font-medium tracking-[0.02em] py-3.5 rounded-pill transition-colors duration-200 ease-soft"
              >
                Send enquiry
                <Icon name="arrow" className="w-4 h-4" />
              </a>

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
function GalleryLightbox({ onClose }) {
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
        <div className="font-display text-cream text-xl sm:text-2xl">Roam in heels</div>
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
function EnquirySection() {
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

  // Local-time ISO (YYYY-MM-DDTHH:MM) for use as `min` on datetime-local inputs.
  const nowLocalISO = useMemo(() => {
    const d = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    return d.toISOString().slice(0, 16)
  }, [])

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
    if (Number(form.guests) > property.highlights.guests) {
      e.guests = `We sleep ${property.highlights.guests}, comfortably`
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
      property: property.name,
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
    <section id="enquiry" className="mt-16 sm:mt-24 lg:mt-32 mb-24 lg:mb-20 bg-cream">
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
            <SuccessState onReset={reset} />
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="mb-2">
                <div className="eyebrow mb-2">Send enquiry</div>
                <h3 className="font-display text-3xl leading-tight">A few quick details.</h3>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <DateTimeField
                  placeholder="Check-in"
                  value={form.checkIn}
                  min={nowLocalISO}
                  onChange={(e) => update('checkIn', e.target.value)}
                  error={errors.checkIn}
                />
                <DateTimeField
                  placeholder="Check-out"
                  value={form.checkOut}
                  min={form.checkIn || nowLocalISO}
                  onChange={(e) => update('checkOut', e.target.value)}
                  error={errors.checkOut}
                />
              </div>

              <Field label="Guests" error={errors.guests}>
                <select
                  value={form.guests}
                  onChange={(e) => update('guests', Number(e.target.value))}
                  className={inputCls(errors.guests)}
                >
                  {Array.from({ length: property.highlights.guests }, (_, i) => i + 1).map((n) => (
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

/* Date+time input that shows a custom placeholder when empty and reveals the
 * native datetime picker on focus.  Trick: render as type="text" while empty
 * & blurred, switch to type="datetime-local" when focused or filled.
 */
function DateTimeField({ placeholder, value, onChange, min, error }) {
  const [focused, setFocused] = useState(false)
  const inputType = (focused || value) ? 'datetime-local' : 'text'
  return (
    <label className="block">
      <input
        type={inputType}
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        min={min}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        className={inputCls(error)}
      />
      {error && <span className="text-[12px] text-clay mt-1.5 block">{error}</span>}
    </label>
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

function SuccessState({ onReset }) {
  return (
    <div className="text-center py-6">
      <div className="mx-auto w-16 h-16 ring-mark flex items-center justify-center mb-5 text-rose">
        <Icon name="check" className="w-7 h-7" />
      </div>
      <div className="eyebrow mb-2">Sent</div>
      <h3 className="font-display text-3xl leading-tight mb-3">Thank you — your note's on its way.</h3>
      <p className="text-bark leading-relaxed max-w-sm mx-auto">
        We've received your enquiry. <em>{property.hostName}</em> will get back to you shortly with availability and the rest of the small details.
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
function Footer() {
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
              A small portfolio of warm, hand-picked private villas in the Indian hills. Hosted personally — never outsourced.
            </p>
          </div>
        </div>
        <div />
        <div className="text-driftwood text-[12.5px] sm:text-right leading-relaxed">
          <div>© {new Date().getFullYear()} Roam in Heels.</div>
          <a href="#enquiry" className="text-rose hover:text-cocoa transition-colors">
            Contact the host
          </a>
        </div>
      </div>
    </footer>
  )
}
