/* ----------------------------------------------------------------------------
 * Which page is this url? Shared by the browser and by the build's prerender,
 * so both agree on what lives at every path.
 * -------------------------------------------------------------------------- */
import { PLACES, placeBySlug, placePath } from './places'

export const HOME = { kind: 'home' }

export function resolve(path, properties) {
  const url = (path || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/'

  const home = /^\/homes\/([^/]+)$/.exec(url)
  if (home) {
    const property = properties.find((p) => p.id === home[1])
    if (property) return { kind: 'property', property }
  }

  const stay = /^\/stays\/([^/]+)$/.exec(url)
  if (stay) {
    const place = placeBySlug(stay[1])
    if (place) return { kind: 'place', place }
  }

  // Anything else falls back to the list of homes.
  return HOME
}

/* Every url the build should write out, in the order they go in the sitemap. */
export const allPaths = (properties) => [
  '/',
  ...properties.map((p) => `/homes/${p.id}`),
  ...PLACES.map((p) => placePath(p)),
]
