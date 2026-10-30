/* ----------------------------------------------------------------------------
 * SEO — the title, description, social card and structured data for each page.
 *
 * One source of truth, read twice: the prerender script bakes it into the
 * static HTML that crawlers and WhatsApp see, and the app re-applies it when a
 * guest moves between pages without a reload.
 * -------------------------------------------------------------------------- */

export const SITE = 'https://www.roam-in-heels.com'

// The host's number, written once and used everywhere.
export const PHONE_DISPLAY = '+91 89203 72018'
export const PHONE_E164 = '+918920372018'
export const PHONE_HREF = `tel:${PHONE_E164}`
export const WHATSAPP_HREF = `https://wa.me/${PHONE_E164.replace('+', '')}`

export const HOST_NAME = 'Mansi & Deependra'
export const INSTAGRAM = 'https://www.instagram.com/roam_in_heels'

/* Per-page title and description. Kept short enough that search results and
 * WhatsApp previews show them whole. */
const PAGE_SEO = {
  'spira-3028': {
    title: 'Luxury Airbnb Studio in Sector 94, Noida | Roam in Heels',
    description:
      'A bright studio on the 30th floor with Yamuna river views, a private balcony, a workspace and fast Wi-Fi. Sleeps 2, pets welcome. Book direct with the hosts.',
    ogImage: '/og/spira-3028.jpg',
  },
  'spira-2212': {
    title: 'Luxury Airbnb Studio, Supernova Spira Noida | Roam in Heels',
    description:
      'A designer studio on the 22nd floor: crystal chandelier, rain shower and a sunset balcony over the Yamuna. Sleeps 2, 1 km from the metro.',
    ogImage: '/og/spira-2212.jpg',
  },
  'ggn-45': {
    title: 'Luxury Airbnb 1BHK Near Millennium Metro, Gurugram | Roam in Heels',
    description:
      'A cozy boho one-bedroom in Sector 45, Gurugram — lush balcony, board games, pets welcome, free parking. Sleeps 3. Book direct with the hosts.',
    ogImage: '/og/ggn-45.jpg',
  },
  home: {
    title: 'Luxury Airbnb in Noida & Gurugram | Roam in Heels',
    description:
      'Three luxury Airbnb homes — two river-view studios in Supernova Spira, Noida and a cozy boho 1BHK in Sector 45, Gurugram. Book on Airbnb or direct with us.',
    ogImage: '/og/home.jpg',
  },
}

/* Where each home is, as plainly as a search engine wants it. */
const ADDRESS = {
  'spira-3028': { streetAddress: 'Supernova Spira, Sector 94', addressLocality: 'Noida', addressRegion: 'Uttar Pradesh' },
  'spira-2212': { streetAddress: 'Supernova Spira, Sector 94', addressLocality: 'Noida', addressRegion: 'Uttar Pradesh' },
  'ggn-45': { streetAddress: 'Sector 45', addressLocality: 'Gurugram', addressRegion: 'Haryana' },
}

/* A route is {kind:'home'} | {kind:'property', property} | {kind:'place', place}. */
export function pathFor(route) {
  if (route?.kind === 'property') return `/homes/${route.property.id}`
  if (route?.kind === 'place') return `/stays/${route.place.slug}`
  return '/'
}

export function seoFor(route) {
  const page = route?.kind === 'place'
    ? route.place.seo
    : PAGE_SEO[route?.kind === 'property' ? route.property.id : 'home']
  const path = pathFor(route)
  return { ...page, path, canonical: SITE + path }
}

/* ----------------------------------------------------------------------------
 * Structured data — what tells Google this is a place to stay, not a blog.
 * -------------------------------------------------------------------------- */

function organization() {
  return {
    '@type': 'LodgingBusiness',
    '@id': `${SITE}/#business`,
    name: 'Roam in Heels',
    description: 'Short-stay homes in Noida and Gurugram, hosted personally by Mansi & Deependra.',
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/og/home.jpg`,
    telephone: PHONE_E164,
    priceRange: '₹₹',
    areaServed: ['Noida', 'Gurugram', 'Delhi NCR'],
    sameAs: [INSTAGRAM],
  }
}

function lodging(property) {
  const { guests, bedrooms, beds, bathrooms } = property.highlights
  return {
    '@type': ['Apartment', 'LodgingBusiness'],
    '@id': `${SITE}${pathFor(property)}#home`,
    name: property.name,
    description: property.shortDescription,
    url: SITE + pathFor(property),
    telephone: PHONE_E164,
    priceRange: '₹₹',
    image: property.images.map((src) => SITE + src),
    address: { '@type': 'PostalAddress', ...ADDRESS[property.id], addressCountry: 'IN' },
    numberOfRooms: bedrooms,
    numberOfBedrooms: bedrooms,
    numberOfBathroomsTotal: bathrooms,
    occupancy: { '@type': 'QuantitativeValue', maxValue: guests, unitText: 'guests' },
    bed: { '@type': 'BedDetails', numberOfBeds: beds },
    amenityFeature: (property.amenities || []).map((name) => ({
      '@type': 'LocationFeatureSpecification', name, value: true,
    })),
    petsAllowed: true,
    smokingAllowed: false,
    checkinTime: '12:00',
    checkoutTime: '10:00',
    containedInPlace: {
      '@type': 'Place',
      name: property.area,
      address: { '@type': 'PostalAddress', ...ADDRESS[property.id], addressCountry: 'IN' },
    },
    isPartOf: { '@id': `${SITE}/#business` },
  }
}

function breadcrumb(property) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'All homes', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: property.name, item: SITE + pathFor(property) },
    ],
  }
}

/* The home page lists the three homes, so Google can see all of them at once. */
function homeList(properties) {
  return {
    '@type': 'ItemList',
    name: 'Homes to stay in Noida and Gurugram',
    itemListElement: properties.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: SITE + pathFor(p),
    })),
  }
}

/* A city or landmark page: the homes it offers, plus its questions. */
function placeGraph(place, properties) {
  const homes = place.homes.map((id) => properties.find((p) => p.id === id)).filter(Boolean)
  const url = `${SITE}/stays/${place.slug}`
  const graph = [
    organization(),
    {
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: place.h1,
      description: place.seo.description,
      about: { '@type': 'Place', name: place.landmark || place.city },
      isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: homes.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.name, url: SITE + `/homes/${p.id}`,
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'All homes', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: place.h1, item: url },
      ],
    },
  ]
  if (place.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: place.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  }
  return graph
}

/* One @graph per page, so every block can point at the others by id. */
export function jsonLdFor(route, properties) {
  let graph
  if (route?.kind === 'property') {
    graph = [organization(), lodging(route.property), breadcrumb(route.property)]
  } else if (route?.kind === 'place') {
    graph = placeGraph(route.place, properties)
  } else {
    graph = [
      organization(),
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE, name: 'Roam in Heels', publisher: { '@id': `${SITE}/#business` } },
      homeList(properties),
    ]
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}
