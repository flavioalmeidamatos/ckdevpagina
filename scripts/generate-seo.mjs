import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cwd = process.cwd();

const normalizeSiteUrl = (value) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return '';
  }
};

const envSiteUrl =
  normalizeSiteUrl(process.env.SITE_URL) ||
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  normalizeSiteUrl(process.env.VERCEL_URL) ||
  'http://localhost:4173';

const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const publicSiteUrl = envSiteUrl.replace(/\/+$/, '');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${publicSiteUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

const robots = isProduction
  ? `User-agent: *
Allow: /
Disallow: /stitch/

Sitemap: ${publicSiteUrl}/sitemap.xml
`
  : `User-agent: *
Disallow: /
`;

writeFileSync(resolve(cwd, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(resolve(cwd, 'robots.txt'), robots, 'utf8');

console.log(`SEO files generated for ${publicSiteUrl} (${isProduction ? 'production' : 'non-production'})`);
