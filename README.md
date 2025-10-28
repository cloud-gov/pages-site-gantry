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

## Formatting

You can auto format your code by using the package.json script:

```sh
npm run format
```

You can check your if the code is formatted by using the package.json script:

```sh
npm run format:check
```

This check is also used in CI to verify the code is formatted in a pull request before the pull request is merged.

## CI

The CI pipeline is used to deploy the sites to allow `pages-editor` users to preview their content updates in the same layout, configuration, and theme as their production site. This repository contains the defintion for a single Concourse pipeline. This pipeline is responsible for reading from a specific S3 bucket and deploying one application per JSON file found there. Those JSON files correspond to sites created by `pages-editor` and contain at least the following properties:

- `name`: The name of the site
- `apiKey`: The API key corresponding to a "bot" user for the site. This key has read-only access to the site's contents

The deployment process is orchestrated through a **Concourse CI pipeline** that automatically deploys multiple sites from a centralized S3 bucket. Here's the complete flow:

**1. Pipeline Setup (`set-pipeline` job)**
- The pipeline first boots up and sets itself using environment-specific configuration
- It uses the `deploy-env` variable to determine which environment to deploy to (likely staging/production)

**2. Code Checks (`test` job)**
- The pipeline runs the automated tests and formatting check whenever the repository source is updated
- If the test or the formatting check fails, the pull request status checks will fail and a developer must fix the issues before being able to merge the pull request

**2. Site Discovery (`new-deploys` job)**
- The pipeline monitors an S3 bucket for changes to site configurations
- It runs the `ls-sites` task which scans the S3 bucket for JSON files in the `_sites/` directory
- Each JSON file represents a site created by the `pages-editor`
- Combines all site configurations into a single `sites.json` file

**3. Parallel Site Deployment**
- For each site discovered, the pipeline runs a `deploy-site-gantry` task
- **Up to 20 sites can deploy simultaneously** (`max_in_flight: 20`)
- Each site gets its own Cloud Foundry application named `{site-name}-site-gantry`

**4. Site Configuration Requirements**
Each site JSON file must contain:
- `name`: The site identifier
- `apiKey`: A read-only API key for accessing site content

**5. Infrastructure Details**
- **Cloud Provider**: Cloud.gov (Cloud Foundry)
- **Deployment Strategy**: Rolling deployment for zero-downtime updates
- **Configuration**: Environment-specific variables and manifests stored in `.cloudgov/` directory
- **Authentication**: Uses GPG keys and GitHub SSH keys for secure access

**6. Triggering Deployments**
- Deployments are automatically triggered when:
  - New site configurations are added to the S3 bucket
  - Existing site configurations are updated
  - The source code repository changes

### Environment Variables

The deployment uses the following environment variables, configured via the Cloud Foundry manifest and vars files:

**Core Application Settings:**
- `NODE_ENV`: Node.js environment (development, staging, production)
- `LOG_LEVEL`: Logging verbosity level
- `NPM_CONFIG_PRODUCTION`: Set to `false` for development dependencies
- `NODE_MODULES_CACHE`: Set to `false` to disable module caching
- `OPTIMIZE_MEMORY`: Set to `true` for memory optimization

**Site Configuration:**
- `SITE`: The site identifier slug
- `APP_ENV`: The deployment environment (staging, production)
- `PREVIEW_MODE`: (Set to `true`) Tells the site it is running in preview mode

**External Service URLs:**
- `EDITOR_APP_URL`: URL to the pages-editor application (e.g., `https://pages-editor-staging.app.cloud.gov`)
- `ASTRO_ENDPOINT`: Local Astro development server endpoint (`http://localhost:4321`)

**Authentication & API:**
- `PAYLOAD_API_KEY`: API key for accessing the site's content via Payload CMS

**Build & Performance:**
- `ASTRO_TELEMETRY_DISABLED`: Set to `1` to disable Astro telemetry collection

**Cloud Foundry Configuration:**
- `CF_APP_NAME`: Application name in format `{site-name}-site-gantry`
- `CF_MANIFEST`: Path to the Cloud Foundry manifest file
- `CF_VARS_FILE`: Environment-specific variables file
- `CF_PATH`: Source code path for deployment
- `CF_API`: Cloud Foundry API endpoint
- `CF_ORG`: Target Cloud Foundry organization
- `CF_SPACE`: Target Cloud Foundry space
- `CF_STACK`: Cloud Foundry stack (e.g., cflinuxfs4)

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
