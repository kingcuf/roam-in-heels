/* ----------------------------------------------------------------------------
 * PLACE PAGES — one page per city and per nearby landmark, so a search like
 * 'stay near Amity University' lands somewhere that answers it.
 *
 * Every distance here is one the site already states in the homes' own copy.
 * Nothing is estimated: if we don't know how far something is, the page says
 * 'nearby' instead of inventing a number.
 *
 * `homes` holds property ids; the app turns them into cards.
 * -------------------------------------------------------------------------- */

const SPIRA = ['spira-3028', 'spira-2212']
const GGN = ['ggn-45']

// Everything the Noida homes' copy says about what is close by.
const NOIDA_NEARBY = [
  { name: 'Okhla Bird Sanctuary metro station', distance: 'about 1 km' },
  { name: 'Amity University, Noida', distance: 'about 2 km' },
  { name: 'DLF Mall of India, Sector 18', distance: 'about 5 km' },
  { name: 'Film City, Noida', distance: 'about 5 km' },
  { name: 'South Delhi', distance: 'about 5 km' },
  { name: 'Vasco Cafe', distance: 'about 7 km' },
]

const NOIDA_FAQ = [
  {
    q: 'What time can I check in and out?',
    a: 'Check-in is any time after 12:00 pm and check-out is before 10:00 am. The 22nd-floor studio has self check-in with a lockbox, so a late arrival there is no trouble at all.',
  },
  {
    q: 'How far is the nearest metro station?',
    a: 'Okhla Bird Sanctuary metro station is about 1 km from the building, on the Magenta Line.',
  },
  {
    q: 'Is there parking?',
    a: 'Yes, at the building for both studios. The 30th-floor studio has free parking on the premises; the 22nd-floor studio uses the paid parking on the premises, which has controlled access. Tell us you are driving and we will sort it out before you arrive.',
  },
  {
    q: 'Can I bring my pet?',
    a: 'Yes, we welcome pets. For the 30th-floor studio we just ask that you let us know in advance.',
  },
  {
    q: 'How many people can stay?',
    a: 'Each studio sleeps two, with one bed and one bathroom.',
  },
]

const GGN_FAQ = [
  {
    q: 'Which metro line is Millennium City Centre on?',
    a: 'The Yellow Line. It is the southern terminus, with direct trains to Rajiv Chowk and Kashmere Gate — no change of line for central Delhi.',
  },
  {
    q: 'What time can I check in and out?',
    a: 'Check-in is after 12:00 pm and check-out is before 10:00 am.',
  },
  {
    q: 'Is there parking?',
    a: 'Yes — free parking directly outside the building.',
  },
  {
    q: 'Can I bring my pet?',
    a: 'Yes, pets are welcome.',
  },
  {
    q: 'How many people can stay?',
    a: 'Up to three guests, in one bedroom with one bathroom.',
  },
]

export const PLACES = [
  /* ---- the two city pages ------------------------------------------------ */
  {
    slug: 'noida',
    kind: 'city',
    city: 'Noida',
    eyebrow: 'Noida · Sector 94',
    h1: 'Luxury Airbnb in Noida',
    lede:
      'We host two studios in Supernova Spira, a high-rise in Sector 94, Noida. Both look out over the Yamuna, both sleep two, and both come with a private balcony, a workspace and high-speed Wi-Fi. You book them straight with us — there is no agency in between.',
    homes: SPIRA,
    nearby: NOIDA_NEARBY,
    faq: NOIDA_FAQ,
    seo: {
      title: 'Luxury Airbnb in Noida, Sector 94 | Roam in Heels',
      description:
        'Two river-view studios in Supernova Spira, Sector 94 Noida. Each sleeps 2, with a private balcony, a workspace and high-speed Wi-Fi. Book direct with the hosts.',
      ogImage: '/og/noida.jpg',
    },
  },
  {
    slug: 'gurugram',
    kind: 'city',
    city: 'Gurugram',
    eyebrow: 'Gurugram · Sector 45',
    h1: 'Luxury Airbnb in Gurugram, near Millennium City Centre metro',
    lede:
      'Our Gurugram home is a one-bedroom flat in Sector 45, near Millennium City Centre metro. It sleeps three, has a lush balcony looking over the city, board games and a basketball court, and parking free outside the door. You book it straight with us.',
    gettingThere:
      'Millennium City Centre, the station the sector is named after, is the southern terminus of the Delhi Metro Yellow Line — trains start there, so you get a seat. It runs straight through to Rajiv Chowk for Connaught Place and on to Kashmere Gate, with no change of line for central Delhi. If you are driving instead, parking is free directly outside the building.',
    goodFor:
      'Work trips into Gurugram, weekends away from Delhi, and anyone travelling with a pet. The flat has a workspace and high-speed Wi-Fi for the hours you are in, a balcony with city views for the end of the day, and board games and a basketball court for the weekend.',
    homes: GGN,
    nearby: [{ name: 'Millennium City Centre metro station', distance: 'nearby' }],
    faq: GGN_FAQ,
    seo: {
      title: 'Luxury Airbnb in Gurugram, Sector 45 | Roam in Heels',
      description:
        'A cozy boho one-bedroom in Sector 45, Gurugram, near Millennium City Centre metro on the Yellow Line. Sleeps 3, pets welcome, free parking. Book direct.',
      ogImage: '/og/gurugram.jpg',
    },
  },

  /* ---- 'near <landmark>' pages ------------------------------------------- */
  {
    slug: 'near-okhla-bird-sanctuary-metro',
    kind: 'landmark',
    city: 'Noida',
    eyebrow: 'Noida · Magenta Line',
    h1: 'Luxury Airbnb near Okhla Bird Sanctuary metro station',
    landmark: 'Okhla Bird Sanctuary metro station',
    distance: 'about 1 km',
    lede:
      'Both our Noida studios are about 1 km from Okhla Bird Sanctuary metro station. If you are in town for a few days and would rather not depend on cabs, this is the pair to look at.',
    gettingThere:
      'Okhla Bird Sanctuary sits on the Magenta Line, roughly a five-minute auto ride from the building, or a walk if you are travelling light. From the platform it is a straight run to Kalkaji Mandir, Hauz Khas and Janakpuri West with no change of train. One stop the other way is Botanical Garden, where you can pick up the Blue Line for Noida City Centre or Dwarka.',
    goodFor:
      'Guests who plan to be out all day and back late. The 22nd-floor studio has self check-in with a lockbox, so you can land at odd hours, take the metro in and let yourself in with nobody waiting up. Both studios have a kitchen for the nights you would rather not go out again.',
    faq: [
      { q: 'Can I walk to the metro station?', a: 'It is about 1 km, so the walk is fine in good weather and an auto takes roughly five minutes.' },
      { q: 'Which line is Okhla Bird Sanctuary on?', a: 'The Magenta Line, which runs between Botanical Garden and Janakpuri West by way of Kalkaji Mandir and Hauz Khas.' },
      { q: 'What if my train gets in late?', a: 'Check-in is after 12:00 pm with no upper limit, and the 22nd-floor studio has a lockbox, so a late arrival is not a problem.' },
    ],
    homes: SPIRA,
    seo: {
      title: 'Luxury Airbnb Near Okhla Bird Sanctuary Metro, Noida | Roam in Heels',
      description:
        'Two river-view studios about 1 km from Okhla Bird Sanctuary metro station on the Magenta Line, Sector 94 Noida. Sleeps 2 each. Book direct with the hosts.',
      ogImage: '/og/noida.jpg',
    },
  },
  {
    slug: 'near-amity-university-noida',
    kind: 'landmark',
    city: 'Noida',
    eyebrow: 'Noida · Sector 125',
    h1: 'Luxury Airbnb near Amity University, Noida',
    landmark: 'Amity University, Noida',
    distance: 'about 2 km',
    lede:
      'Amity University is about 2 km from our Sector 94 studios, which is roughly a ten-minute drive. We host two of them in the same building, on the 22nd and 30th floors.',
    gettingThere:
      "Amity's campus is in Sector 125, a short hop down the Expressway from Sector 94 — about ten minutes by car and a quick auto ride otherwise. It stays quick even in the morning rush, because you are going against most of the traffic.",
    goodFor:
      'Parents in town for a convocation, a move-in weekend or an admission interview. Over three or four days a studio tends to beat a hotel room: there is a kitchen to cook in, a quiet balcony to sit on, and the two studios are in one building, so a family that needs more than two beds can take both and still be on the same lift.',
    faq: [
      { q: 'How far is Amity University from the studio?', a: 'About 2 km — roughly ten minutes by car.' },
      { q: 'Can three of us stay together?', a: 'Each studio sleeps two, so a group of three would take both. They are in the same building, on the 22nd and 30th floors.' },
      { q: 'Is there a kitchen I can cook in?', a: 'Yes. The 22nd-floor studio has a well-equipped kitchenette and the 30th-floor studio has a kitchen.' },
    ],
    homes: SPIRA,
    seo: {
      title: 'Luxury Airbnb Near Amity University, Noida | Roam in Heels',
      description:
        'Two river-view studios about 2 km from Amity University, Noida — a ten-minute drive. Private balcony, kitchen, sleeps 2 each. Book direct with the hosts.',
      ogImage: '/og/noida.jpg',
    },
  },
  {
    slug: 'near-dlf-mall-of-india-noida',
    kind: 'landmark',
    city: 'Noida',
    eyebrow: 'Noida · Sector 18',
    h1: 'Luxury Airbnb near DLF Mall of India, Sector 18',
    landmark: 'DLF Mall of India, Sector 18',
    distance: 'about 5 km',
    lede:
      'DLF Mall of India and the rest of Sector 18 are about 5 km from the building — close enough for an evening out and a cab back afterwards.',
    gettingThere:
      'Sector 18 is ten to fifteen minutes away by cab. The mall, the Atta Market lanes and the Sector 18 restaurants sit in the same pocket, so a single trip covers all three and you are not hopping between parts of the city.',
    goodFor:
      'A weekend of shopping and eating out, without staying in the middle of it. You come back to a quiet high-rise and a balcony over the Yamuna instead of a room above a main road. Both studios have parking at the building if you are driving yourself.',
    faq: [
      { q: 'How far is DLF Mall of India?', a: 'About 5 km, which is ten to fifteen minutes in a cab.' },
      { q: 'What else is worth walking to around Sector 18?', a: 'The Atta Market lanes and the Sector 18 restaurant strip are in the same area as the mall.' },
      { q: 'Is there parking if I drive?', a: 'Yes. The 30th-floor studio has free parking on the premises; the 22nd-floor studio uses the paid parking on the premises, which has controlled access.' },
    ],
    homes: SPIRA,
    seo: {
      title: 'Luxury Airbnb Near DLF Mall of India, Noida | Roam in Heels',
      description:
        'Two river-view studios about 5 km from DLF Mall of India, Sector 18 Noida. Private balcony, kitchen, parking, sleeps 2 each. Book direct with the hosts.',
      ogImage: '/og/noida.jpg',
    },
  },
  {
    slug: 'near-film-city-noida',
    kind: 'landmark',
    city: 'Noida',
    eyebrow: 'Noida · Sector 16A',
    h1: 'Luxury Airbnb near Film City, Noida',
    landmark: 'Film City, Noida',
    distance: 'about 5 km',
    lede:
      'Film City is about 5 km from the building, and South Delhi is roughly the same distance the other way. Both studios are set up for people who are here to work.',
    gettingThere:
      'Film City is in Sector 16A, ten to fifteen minutes from Sector 94 by cab, with the Expressway doing most of the work. Okhla Bird Sanctuary metro is about 1 km from the studios if you would rather take the train in.',
    goodFor:
      'Shoots and long work trips. Each studio has a dedicated workspace and high-speed Wi-Fi — the 22nd-floor one has an ergonomic chair and a Netflix-and-work nook — and the 22nd-floor studio has self check-in, which matters when the call time is before dawn and the wrap is after midnight.',
    faq: [
      { q: 'How far is Film City?', a: 'About 5 km from the building, so ten to fifteen minutes by cab.' },
      { q: 'Is there a proper place to work?', a: 'Yes — both studios have a dedicated workspace with high-speed Wi-Fi, and the 22nd-floor one has an ergonomic chair.' },
      { q: 'Can I come and go at odd hours?', a: 'The 22nd-floor studio has self check-in with a lockbox, so early call times and late wraps are no trouble.' },
    ],
    homes: SPIRA,
    seo: {
      title: 'Luxury Airbnb Near Film City, Noida | Roam in Heels',
      description:
        'Two river-view studios about 5 km from Film City, Noida, with a proper workspace and fast Wi-Fi. Sleeps 2. Book direct with the hosts.',
      ogImage: '/og/noida.jpg',
    },
  },
  /* ---- the building itself ---------------------------------------------- */
  {
    slug: 'supernova-spira',
    kind: 'landmark',
    city: 'Noida',
    eyebrow: 'Noida · Sector 94',
    h1: 'Luxury Airbnb in Supernova Spira, Noida',
    landmark: 'Supernova Spira',
    distance: 'nearby',
    lede:
      'Supernova Spira is one of Noida\u2019s landmark high-rise addresses, in Sector 94 by the Yamuna. We host two studios in it — one on the 22nd floor and one on the 30th — and you can book either on Airbnb or straight with us.',
    gettingThere:
      'The building sits in Sector 94, where the Noida\u2013Greater Noida Expressway meets the river, so South Delhi and Film City are both about 5 km away and Okhla Bird Sanctuary metro is about 1 km. There is a lift, and parking at the building for both studios.',
    goodFor:
      'Guests who want the high-rise version of a city stay: both studios look over the Yamuna from a private balcony, both have central air conditioning, high-speed Wi-Fi and a workspace, and the 22nd-floor one adds a crystal chandelier, a rain shower and self check-in with a lockbox. Couples take them for the sunsets; work travellers take them for the desk and the quiet.',
    nearby: NOIDA_NEARBY,
    faq: [
      {
        q: 'Which floors are your studios on?',
        a: 'One on the 22nd floor and one on the 30th, both in Supernova Spira, Sector 94.',
      },
      {
        q: 'Can I book both studios together?',
        a: 'Yes. They are in the same building, so a group of four can take both and still share a lift — tell us in the enquiry and we will hold them together.',
      },
      {
        q: 'What is the view like?',
        a: 'Both look out over the Yamuna from a private balcony, with the city skyline after dark. The 22nd-floor studio opens onto its balcony through floor-to-ceiling glass doors.',
      },
      {
        q: 'Is there a lift and parking?',
        a: 'Yes to both. The 30th-floor studio has free parking on the premises; the 22nd-floor studio uses the paid parking on the premises, which has controlled access.',
      },
      {
        q: 'How far is the nearest metro?',
        a: 'Okhla Bird Sanctuary metro station, on the Magenta Line, is about 1 km from the building.',
      },
    ],
    homes: SPIRA,
    seo: {
      title: 'Luxury Airbnb in Supernova Spira, Sector 94 Noida | Roam in Heels',
      description:
        'Two luxury Airbnb studios in Supernova Spira, Sector 94 Noida — 22nd and 30th floors, Yamuna river views, private balconies. Book on Airbnb or direct.',
      ogImage: '/og/noida.jpg',
    },
  },

  /* ---- the 'near me' page: a searcher's own location decides, so this page
   * exists to say plainly where we are and let them pick the closest. ------ */
  {
    slug: 'luxury-airbnb-near-me',
    kind: 'hub',
    city: 'Delhi NCR',
    eyebrow: 'Delhi NCR · Noida & Gurugram',
    h1: 'Luxury Airbnb near me — Noida and Gurugram',
    lede:
      'If you are searching for a luxury Airbnb near you and you are anywhere in Delhi NCR, here is exactly where we are. We host three homes: two river-view studios in Supernova Spira, Sector 94 Noida, and a boho one-bedroom in Sector 45, Gurugram. Pick whichever is closest.',
    gettingThere:
      'The Noida studios are in Sector 94, about 1 km from Okhla Bird Sanctuary metro on the Magenta Line, with South Delhi roughly 5 km away. The Gurugram home is in Sector 45, near Millennium City Centre — the southern end of the Yellow Line, which runs straight to Rajiv Chowk and Kashmere Gate. If you are coming from central Delhi, either is a direct metro ride.',
    goodFor:
      'Anyone who needs a few nights in NCR and would rather deal with the hosts than a front desk. All three homes sleep two or three, have a kitchen, a balcony, air conditioning, high-speed Wi-Fi and a workspace, and all three welcome pets.',
    nearbyHeading: 'Where the homes are',
    nearby: [
      { name: 'Supernova Spira, Sector 94, Noida', distance: 'two studios' },
      { name: 'Sector 45, Gurugram', distance: 'one home' },
    ],
    faq: [
      {
        q: 'Where exactly are your homes?',
        a: 'Two are in Supernova Spira, Sector 94, Noida, on the 22nd and 30th floors. The third is in Sector 45, Gurugram, near Millennium City Centre metro.',
      },
      {
        q: 'Which one is closest to Delhi?',
        a: 'From South Delhi the Noida studios are the shorter trip, at roughly 5 km. From central Delhi the Gurugram home is a direct Yellow Line ride to the end of the line.',
      },
      {
        q: 'Do you have anything near a metro station?',
        a: 'Both — the Noida studios are about 1 km from Okhla Bird Sanctuary on the Magenta Line, and the Gurugram home is near Millennium City Centre on the Yellow Line.',
      },
      {
        q: 'Can I book on Airbnb instead of here?',
        a: 'Yes. All three homes are listed on Airbnb, and the links are at the top of every page. Booking direct with us just saves the platform fee.',
      },
    ],
    homes: [...SPIRA, ...GGN],
    seo: {
      title: 'Luxury Airbnb Near Me — Noida & Gurugram | Roam in Heels',
      description:
        'Looking for a luxury Airbnb near you in Delhi NCR? Three homes: two river-view studios in Sector 94 Noida and a boho 1BHK in Sector 45 Gurugram.',
      ogImage: '/og/home.jpg',
    },
  },
]

export const placeBySlug = (slug) => PLACES.find((p) => p.slug === slug)
export const placePath = (place) => `/stays/${place.slug}`
export const citiesOf = () => PLACES.filter((p) => p.kind === 'city')
export const hubsOf = () => PLACES.filter((p) => p.kind === 'hub')
/* The links at the foot of a page: its city's other pages, or — on a hub page
 * that spans the whole of NCR — everywhere we host. */
export const siblingsOf = (place) =>
  place.kind === 'hub'
    ? PLACES.filter((p) => p.slug !== place.slug)
    : PLACES.filter((p) => p.city === place.city && p.slug !== place.slug)
