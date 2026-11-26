import { mkdir, readFile, writeFile } from "node:fs/promises";
import { getPageMetadata, pagePaths, siteName } from "../src/site-seo.js";

const dist = new URL("../dist/", import.meta.url);
const homepage = new URL("index.html", dist);
const template = await readFile(homepage, "utf8");

const escapeHtml = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function renderPage({ title, description, canonical, noindex, structuredData }) {
    const head = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}" />`,
        canonical && `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
        noindex && '<meta name="robots" content="noindex" />',
        `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
        `<meta property="og:title" content="${escapeHtml(title)}" />`,
        `<meta property="og:description" content="${escapeHtml(description)}" />`,
        canonical && `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
        structuredData && `<script type="application/ld+json" id="page-structured-data">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>`,
    ].filter(Boolean);

    return template.replace("<!-- page metadata -->", () => head.join("\n        "));
}

const sitemapUrls = [];

for (const path of pagePaths) {
    const page = getPageMetadata(path);
    const folder = new URL(path.slice(1), dist);
    await mkdir(folder, { recursive: true });
    await writeFile(new URL("index.html", folder), renderPage(page));

    if (!page.noindex) {
        sitemapUrls.push(page.canonical);
    }
}

const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapUrls.map((url) => `    <url><loc>${escapeHtml(url)}</loc></url>`),
    "</urlset>",
    "",
].join("\n");
const sitemapUrl = new URL("sitemap.xml", getPageMetadata("/").canonical);

await Promise.all([
    writeFile(new URL("sitemap.xml", dist), sitemap),
    writeFile(new URL("sitemap.txt", dist), `${sitemapUrls.join("\n")}\n`),
    writeFile(new URL("robots.txt", dist), `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`),
    writeFile(new URL("404.html", dist), renderPage(getPageMetadata("/404.html"))),
]);
