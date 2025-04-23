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

## CI

This repository contains the defintion for a single Concourse pipeline. This pipeline is responsible for reading from a specific S3 bucket and deploying one application per JSON file found there. Those JSON files correspond to sites created by `pages-editor` and contain at least the following properties:
- `name`: The name of the site
- `apiKey`: The API key corresponding to a "bot" user for the site. This key has read-only access to the site's contents


## Docker

TBD


### Naming

!["Launch Complex 22 (Gantry Crane) with a Hermes A-1 missile Photo courtesy of White Sands Missile Range Museum"](https://www.nps.gov/common/uploads/stories/images/nri/20161107/articles/844B4226-1DD8-B71B-0B8061E3C5ABA93C/844B4226-1DD8-B71B-0B8061E3C5ABA93C.jpg)

A gantry is the mobile portion of the structure used to assemble and launch rockets.
