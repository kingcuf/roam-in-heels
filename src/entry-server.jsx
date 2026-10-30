/* The build renders every page through here, so the HTML a crawler receives
 * already holds the headings, the copy and the photos. */
import { renderToString } from 'react-dom/server'
import App, { PROPERTIES } from './App.jsx'
import { seoFor, jsonLdFor, pathFor, SITE } from './seo.js'
import { resolve, allPaths } from './router.js'

export { PROPERTIES, seoFor, jsonLdFor, pathFor, SITE, resolve }

export const routes = () => allPaths(PROPERTIES)
export const routeFor = (path) => resolve(path, PROPERTIES)

export function render(path) {
  return renderToString(<App initialPath={path} />)
}
