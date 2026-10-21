# Laughter Studio

Standalone Sanity Studio for [studio.laughterephraim.com](https://studio.laughterephraim.com).
This project owns the content schemas and Studio navigation. The portfolio reads
from the same Sanity project and dataset through its own API client.

## Local development

```bash
bun install
bun run dev
```

Set these values in `.env.local` and in the Studio hosting project's environment:

```dotenv
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_VERSION=YYYY-MM-DD
```

Use the same project, dataset, and API version as the portfolio. These values are
public configuration included in the browser bundle. Never put tokens or other
secrets in variables prefixed with `SANITY_STUDIO_`.

## Vercel deployment

Use this folder as the Vercel project root, `bun run build` as the build command,
and `dist` as the output directory. Configure SPA fallback routing to `index.html`
so direct links to Studio documents work. The custom domain is
`studio.laughterephraim.com`.

Allow `https://studio.laughterephraim.com` in the Sanity project's CORS origins
with credentials enabled. Editors must be invited to the Sanity project and sign
in to the Studio.

`bun run deploy` is an optional Sanity-hosting command, separate from Vercel
deployment. Vercel builds and serves `dist` through its own deployment pipeline.

## Checks

```bash
bun run typecheck
bun run format:check
bun run build
```
