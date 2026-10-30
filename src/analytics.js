/* ----------------------------------------------------------------------------
 * Tracking — Meta Pixel, GA4 and (optionally) a Google Ads remarketing tag.
 *
 *   VITE_META_PIXEL_ID   overrides the live pixel below, for a test pixel
 *   VITE_GA4_ID          e.g. G-XXXXXXXXXX      — traffic + audiences
 *   VITE_GOOGLE_ADS_ID   e.g. AW-123456789      — Google / YouTube remarketing
 *
 * Every event carries the guest's device (desktop or mobile, make, model) and,
 * where there is one, the home they are looking at — so an audience can be as
 * narrow as 'opened the 30th floor on an iPhone and never enquired'.
 * -------------------------------------------------------------------------- */

// The live Roam in Heels pixel. A pixel id is public, so it lives here;
// the env var is only an override for a test pixel.
const META_ID = import.meta.env.VITE_META_PIXEL_ID || '2187466458470797'
const GA4_ID = import.meta.env.VITE_GA4_ID
const ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID

const hasMeta = !!META_ID
const hasGoogle = !!(GA4_ID || ADS_ID)

/* ----------------------------------------------------------------------------
 * Which device is this?
 *
 * The user-agent string is the only thing every browser gives us, and modern
 * Chrome has stopped putting the phone's model in it (it sends a bare 'K').
 * So we read the string first, then ask the Client Hints API for the real
 * model and overwrite what we guessed — Chrome on Android answers it, Safari
 * and Firefox don't, which is why iPhones can only ever report 'iPhone'.
 * -------------------------------------------------------------------------- */

const isBrowser = typeof window !== 'undefined'
const ua = isBrowser ? navigator.userAgent || '' : ''
// iPadOS Safari claims to be a Mac, and only the touch points give it away.
const isIpad = /iPad/.test(ua) || (/Macintosh/.test(ua) && isBrowser && navigator.maxTouchPoints > 1)

function deviceType() {
  if (isIpad || (/Android/.test(ua) && !/Mobile/.test(ua))) return 'tablet'
  if (/Mobi|iPhone|iPod|Android/.test(ua)) return 'mobile'
  return 'desktop'
}

function deviceOs() {
  if (/Android/.test(ua)) return 'Android'
  if (isIpad) return 'iPadOS'
  if (/iPhone|iPod/.test(ua)) return 'iOS'
  if (/Windows/.test(ua)) return 'Windows'
  if (/CrOS/.test(ua)) return 'ChromeOS'
  if (/Mac OS X/.test(ua)) return 'macOS'
  if (/Linux/.test(ua)) return 'Linux'
  return 'unknown'
}

function browserName() {
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\/|Opera/.test(ua)) return 'Opera'
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Chrome\//.test(ua)) return 'Chrome'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'unknown'
}

/* The model as the user-agent string has it: 'Android 13; SM-G991B) ...'. */
function modelFromUa() {
  if (isIpad) return 'iPad'
  if (/iPhone|iPod/.test(ua)) return 'iPhone'
  const m = /Android[^;)]*;\s*([^;)]+?)(?:\s+Build\/[^;)]*)?\)/.exec(ua)
  const model = m && m[1].trim()
  // Chrome's reduced user agent sends 'K' instead of the model.
  return !model || model === 'K' || model === 'Android' ? '' : model
}

/* Phone makers, by how their models are spelled in the model string. */
const MAKERS = [
  [/^(SM-|GT-|SHV-)/i, 'Samsung'],
  [/^Pixel/i, 'Google'],
  [/(Redmi|POCO|^MI\b|^M20|^M21|^22|^23|Xiaomi)/i, 'Xiaomi'],
  [/(OnePlus|^CPH|^KB2|^LE2)/i, 'OnePlus'],
  [/(realme|^RMX)/i, 'realme'],
  [/^(vivo|V2[0-9])/i, 'vivo'],
  [/^iQOO/i, 'iQOO'],
  [/^(OPPO|^PH|^PG)/i, 'OPPO'],
  [/(moto|^XT[0-9])/i, 'Motorola'],
  [/Infinix/i, 'Infinix'],
  [/TECNO/i, 'TECNO'],
  [/Nokia/i, 'Nokia'],
  [/Lava/i, 'Lava'],
]

function makeFor(model, os) {
  if (os === 'iOS' || os === 'iPadOS' || os === 'macOS') return 'Apple'
  for (const [pattern, name] of MAKERS) if (pattern.test(model)) return name
  if (os === 'Windows') return 'PC'
  return 'unknown'
}

// Filled once, read by every event. The model may be upgraded a moment later.
const device = {
  device_type: deviceType(),
  device_os: deviceOs(),
  device_model: modelFromUa() || 'unknown',
  device_make: makeFor(modelFromUa(), deviceOs()),
  browser: browserName(),
  viewport: isBrowser ? `${window.innerWidth}x${window.innerHeight}` : '',
}

/* Ask Chrome for the real model. Resolves in a few ms, so the very first
 * PageView can still go out with the user-agent's guess. */
function refineDevice() {
  const uaData = isBrowser && navigator.userAgentData
  if (!uaData?.getHighEntropyValues) return
  uaData.getHighEntropyValues(['model', 'platform', 'platformVersion'])
    .then((hints) => {
      if (hints.model) {
        device.device_model = hints.model
        device.device_make = makeFor(hints.model, device.device_os)
      }
    })
    .catch(() => {})
}

if (isBrowser) {
  window.addEventListener('resize', () => {
    device.viewport = `${window.innerWidth}x${window.innerHeight}`
  })
}

/* ----------------------------------------------------------------------------
 * The events
 * -------------------------------------------------------------------------- */

/* One home's attributes, in the shape both platforms get. */
function homeOf(property) {
  return property
    ? { home_id: property.id, home_name: property.name, home_area: property.area }
    : { home_id: 'any', home_name: 'Any home — whichever is free', home_area: '' }
}

/* Device first, then the event's own attributes. */
const attrs = (extra = {}) => ({ ...device, ...extra })

function loadScript(src) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

function initMeta() {
  if (window.fbq) return
  const fbq = function (...args) {
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args)
  }
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = window._fbq = fbq
  loadScript('https://connect.facebook.net/en_US/fbevents.js')
  fbq('init', META_ID)
}

function initGoogle() {
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID || ADS_ID}`)
  }
  // Page views are sent by hand below, because the site routes without reloading.
  if (GA4_ID) window.gtag('config', GA4_ID, { send_page_view: false })
  if (ADS_ID) window.gtag('config', ADS_ID)
}

export function initTracking() {
  refineDevice()
  if (hasMeta) initMeta()
  if (hasGoogle) initGoogle()
}

/* A page view in both worlds. Called on first paint and on every route change. */
export function trackPageView(path, title) {
  if (hasMeta) window.fbq('track', 'PageView', attrs())
  if (GA4_ID) {
    window.gtag('event', 'page_view', attrs({
      page_path: path,
      page_title: title,
      page_location: window.location.href,
    }))
  }
}

/* The retargeting workhorse: this guest looked at this home. */
export function trackListingView(property) {
  const home = homeOf(property)
  if (hasMeta) {
    window.fbq('track', 'ViewContent', attrs({
      ...home,
      content_type: 'home_listing',
      content_ids: [property.id],
      content_name: property.name,
      content_category: property.area,
    }))
  }
  if (hasGoogle) {
    window.gtag('event', 'view_item', attrs({
      ...home,
      items: [{ item_id: property.id, item_name: property.name, item_category: property.area }],
    }))
  }
}

export function trackGalleryOpen(property) {
  const home = homeOf(property)
  if (hasMeta) {
    window.fbq('trackCustom', 'GalleryOpen', attrs({ ...home, content_ids: [home.home_id] }))
  }
  if (hasGoogle) window.gtag('event', 'gallery_open', attrs(home))
}

/* Started filling the enquiry form — warm, but not yet a lead. */
export function trackEnquiryStart(property) {
  const home = homeOf(property)
  if (hasMeta) {
    window.fbq('trackCustom', 'EnquiryStart', attrs({ ...home, content_ids: [home.home_id] }))
  }
  if (hasGoogle) window.gtag('event', 'begin_checkout', attrs(home))
}

/* The conversion. Mark this one as the goal in Ads and GA4. */
export function trackEnquirySent({ property, checkIn, checkOut, guests }) {
  const home = homeOf(property)
  const stay = {
    check_in: checkIn || '',
    check_out: checkOut || '',
    guests: Number(guests) || 0,
  }
  if (hasMeta) {
    window.fbq('track', 'Lead', attrs({
      ...home,
      ...stay,
      content_type: 'home_listing',
      content_ids: [home.home_id],
      content_name: home.home_name,
    }))
  }
  if (hasGoogle) window.gtag('event', 'generate_lead', attrs({ ...home, ...stay }))
}

/* Left for Airbnb, Booking, MakeMyTrip or Instagram. */
export function trackOutbound(label) {
  if (hasMeta) window.fbq('trackCustom', 'OutboundClick', attrs({ destination: label }))
  if (hasGoogle) window.gtag('event', 'outbound_click', attrs({ destination: label }))
}
