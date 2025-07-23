# pages-site-gantry

This repository contains the necessary code for launching a cloud-gov application with two separate functions:

- Building and deploying a preview website (using [Astro](https://astro.build/)) which is based on content and settings from a [pages-editor](https://github.com/cloud-gov/pages-editor/) instance.
- Deploying a [sidecar](https://docs.cloudfoundry.org/devguide/sidecars.html) proxy application to ensure that the site is only accessible to certain users.

This site itself will prioritize standardization and consistency above deep customization.

## Running locally

Both portion of the application can be run locally. They require a number of environment variables to be set, shown in `.env.example`. If those are availble, the site runs in preview mode:

```sh
npm run dev
```

and the proxy runs with:

```sh
node oauth/index.js
```

## Tests

This project uses Vitest and Astro Container for testing Astro components. See [docs/TESTING.md](docs/TESTING.md) for detailed information on writing and running tests.

## CI

This repository contains the defintion for a single Concourse pipeline. This pipeline is responsible for reading from a specific S3 bucket and deploying one application per JSON file found there. Those JSON files correspond to sites created by `pages-editor` and contain at least the following properties:

- `name`: The name of the site
- `apiKey`: The API key corresponding to a "bot" user for the site. This key has read-only access to the site's contents

## Docker

TBD

## Rendering Patterns

This site is designed to render both statically and [on-demand](https://docs.astro.build/en/guides/on-demand-rendering/), depending on the context. This is controlled via the `RENDER_MODE` environment variable; if not supplied, the site will run in `server` mode (on-demand).

- `static` render: this is the default rendering method for Astro and how this site will be rendered for production use. Content is fetched in `src/content.config.ts` from the pages-editor API at build-time. Pages paths are generated via `src/utilities/createGetStaticPath` for dynamically-generated paths. Pages get data via the `getCollection` and `getEntry` functions from `astro:content`. The resulting data will be typed and validated via `zod` as defined on the collection loaders in `src/content.config.ts`
- `server` render: this is how we render the site for use in "live-preview" mode. Content is fetched from pages-editor via `payloadFetch` at run-time. This calls provides page paths and data. The resulting data is not typed (i.e. `data = await reponse.json() as any`) but is assigned to the same zod schema _assuming_ that the structure matches.

Related notes:

- By convention, globals fetched from pages-editor are assigned to a single-element collection with id `"main"`
- Site configuration is fetched in the above fashion or dynamically via `payloadFetch`. This pattern is captured in `src/config.astro`. Note that this function exports an empty fragment that must be present in the rendered page. Any subsequent component can use the site configuration data with `import { data } from "@/config.astro"`
- dynamically serving is currently done via the development server (`npm run dev`) but should eventually be upgraded to the built server files (`npm run build` then `node _site/server/entry.mjs`).

### Naming

!["Launch Complex 22 (Gantry Crane) with a Hermes A-1 missile Photo courtesy of White Sands Missile Range Museum"](https://www.nps.gov/common/uploads/stories/images/nri/20161107/articles/844B4226-1DD8-B71B-0B8061E3C5ABA93C/844B4226-1DD8-B71B-0B8061E3C5ABA93C.jpg)

A gantry is the mobile portion of the structure used to assemble and launch rockets.
