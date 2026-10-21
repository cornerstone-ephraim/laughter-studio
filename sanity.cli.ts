/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = "Laughter Ephraim Studio";
const description =
  "Manage Laughter Ephraim’s portfolio, selected works, testimonials, and website content.";
const studioUrl = "https://studio.laughterephraim.com/";

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: "a87zeguban2dpe0fz25tudkn",
  },
  vite: {
    plugins: [
      {
        name: "studio-metadata",
        transformIndexHtml: { order: "post", handler: applyMetadata },
        // Sanity emits its production HTML during bundle generation rather than
        // passing it through Vite's HTML entry pipeline.
        generateBundle: {
          order: "post",
          handler(_options, bundle) {
            const document = bundle["index.html"];
            if (
              !document ||
              document.type !== "asset" ||
              typeof document.source !== "string"
            ) {
              throw new Error("Could not find the generated Studio HTML.");
            }
            document.source = applyMetadata(document.source);
          },
        },
      },
    ],
  },
});

function applyMetadata(html: string) {
  const metadata = `
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${studioUrl}" />
    <meta property="og:site_name" content="${title}" />
    <meta property="og:image" content="${studioUrl}static/android-chrome-512x512.png" />
    <meta property="og:image:alt" content="Laughter Ephraim" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${studioUrl}static/android-chrome-512x512.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
    <link rel="apple-touch-icon" href="/static/apple-touch-icon.png" />
    <link rel="manifest" href="/static/site.webmanifest" />
  `;

  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<link\b[^>]*\brel="(?:icon|apple-touch-icon|manifest)"[^>]*\/?\s*>/g,
      "",
    )
    .replace("</head>", `${metadata}</head>`);
}
