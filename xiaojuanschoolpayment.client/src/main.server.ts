// Server entry used only at build time: `ng build` (production configuration) renders the routes in
// prerender-routes.txt with it, so their body text is in the page source for crawlers and AI tools that
// do not run JavaScript. The site is still served as a client-rendered app; see scripts/export-seo-pages.cjs.
export { AppServerModule as default } from './app/app.module.server';
