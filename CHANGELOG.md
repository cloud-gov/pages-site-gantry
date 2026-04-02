## 0.3.0 (2026-04-02)

### Added

- add styling for collections

### Fixed

- non collection page view content area
- relative basepath in filter component
- tag label vs title association, date, and layout tweak for slug view
- run mapped content through filter template. refactor tests to expect correct object labels for tags
- static path generation for collection items
- disappearing border on filtered clone
- remove unneeded filter changes, tag route, fix issue with page status
- remove console log and clean up styles

### Maintenance

- refactor collection items and filtering (#204)
- collection entries in line with councils
- update related items so links match schema changes. add date
- added page n of n to collection list views
- **ci**: Remove deprecated security-considerations automation
- incorporate pagefind filter into collection items
- **ci**: Remove deprecated security-considerations automation
- add function to update pagination status text
- added test for pagination status message
- **ci**: Remove deprecated security-considerations automation
- integrate councils based theme (#201)
- integrate councils theme
- page content styling

## 0.2.0 (2026-03-13)

### Added

- **ci**: Add release deployment pipeline

## 0.1.0 (2026-03-10)

### Added

- add scrollable table styling and center small tables
- add an background image to homepage text blocks (#182)
- add custom card grid component (#174)
- Create the route for policy pages #161
- Create the route for policy pages #161
- add test for cardGrid feature block
- Add ability to change image size in lexical editor
- Add ability to change image size in lexical editor
- add custom card grid component (#174)
- Create the route for policy pages #161
- Create the route for policy pages #161
- add test for cardGrid feature block
- Create the route for policy pages #161
- Create the route for policy pages #161
- Create filtering component #126
- User page title in breadcrumb on slug pages
- Add 404 page
- add an accordion feature to lexical editor (#160)
- Adding related items component
- Adding related items component
- Adding related items component
- add resource list rich text converter (#155)
- User-generated general collections
- add table component to rich text editor (#150)
- Update Alert component to add alignment (left or center) and remove publish date trigger #147
- Update Footer component to display fetched content #142
- Update Footer component to display fetched content #142
- Updating breadcrumb navigation for pagination pages
- Create an alert component to display site wide alerts #112
- Adding in-page navigation
- Adding side navigation to single pages
- Enable custom home page layout
- Create the pre footer to allow for addition custom link #101
- add DAP site component (#118)
- search view component (#109)
- Update events collection and slug page
- Create the pre footer to allow for addition custom link #101
- Add Resources collection
- include collection paging and assert rev. chronological ordering (#81)
- Add two color and font theming from site config
- Create image media component (#75)
- Add breadcrumbs to site
- Add menu to astro content validation
- Adding dropdown capability to main nav
- Add leadership collection to content
- Creating a dynamic global nav
- Creating slug page for all individual pages
- Adding posts section to site
- Render CMS Media uploads in site
- Updating events page to match designs
- Updating Reports page styles and component structure
- Add reports pages
- add link component
- add new template components, collection config
- change CI pipeline to deploy an app per site

### Fixed

- collectionEntry key
- remove console.logging
- remedy bug where link array is undefined
- clean up some typescript errors
- typescript error resolved in queries
- catch some missing category(ies) / tag(s) conversion
- related items label vs. title for link
- cover all menu blockTypes. added menu component test
- include site link blockType
- formatting and redundant declarations
- add passthrough to menu global for dropdown items
- replace passthrough on main nav with strict typing, add pass through to footers
- footer/prefooter link zod schema
- correct api call for collection-entry
- fetch collection endpoint url
- apply a baseurl
- conditional baseurl applied to footer
- update prerender branch
- npm audit fix
- revert package audit change
- revert package update
- apply node converters in table child elements (#187)
- clarify comment
- test fixed, missing ul in allowedClasses
- card grid image layout display (#176)
- add footer with link
- null-safe image alt tag
- formatting
- standardize class case
- horizontal card image ratio (#179)
- use baseUrl for image path
- reduce styling away from usa-hero
- remove text color
- horizontal card image ratio (#179)
- card grid image layout display (#176)
- add footer with link
- null-safe image alt tag
- formatting
- standardize class case
- test fixed, missing ul in allowedClasses
- Preview deployment image paths and static file serving
- Homepage card description to check string type
- typo in function name
- make id unique and update tests for custom heading
- emit process list headers with configurable heading level (#156)
- formatting lint
- derive heading level from a single set value
- remove console log
- remove console.log
- revise download attribute and add link icon
- move table converters to separate utility
- lint errors
- typo in folder name
- remove duplicate helper function
- next and previous pagination links
- minimum pages for pagination error
- attempt to fix path to svg sprite
- image path for sprite
- using uswds next & prev svgs
- remove unused parameters
- use tablet column class for mobile
- Refactor the API fetch queries from Payload #82
- Astro config to build CSS properly
- Add clear buildpack cache check to ci
- Search baseUrl when BASEURL env var is undefined
- add payload live reload to collection slug template (#103)
- Standardize content mapping and queries (#80)
- Hosting images in the file system instead of pointing to node_modules
- Slight change to BASEURL var
- Media URL utility in RichText component
- CI preview launch bucket prefix
- add api calls to dynamically rendered content
- correct pipeline errors

### Maintenance

- Remove deprecated security-considerations automation files
- remove deprecated collection artifacts (#197)
- remove unneeded includes
- remove deprecated features from collection item template
- update custom collections views, queries, and layout (#191)
- update schema for collection menu items
- remap footer link label expectations
- update menu to account for collectionEntryLink parent collectionType
- add test to build menu utility
- refactor footer and prefooter links to account for collection entry links
- update page and collection entry rich text content param
- revise test for collection entity slug utility
- clean up Layout and fix typescript error
- run npm audit fix
- revise table converter test
- Small style updates for card grid (#180)
- **deps**: bump the npm_and_yarn group across 1 directory with 3 updates
- **deps**: bump devalue in the npm_and_yarn group across 1 directory
- Optionally render the hero button if text and url not set (#175)
- make title and filtersSlugMetaData optional
- Update font hierarchy
- move text block logic to component
- Update font hierarchy
- Update font hierarchy
- Fixing side navigation rendering
- Update alert styles
- Update alert styles
- update download file component for rich text blocks (#152)
- Update alert styles
- Refactor PayloadPreview to render when PREVIEW_MODE is true
- Remove link from tags
- refine site search UI (#122)
- use next_offset and make limit into a constant variable
- tidy up params gathering
- refactor paging into a utility, add a state handler for paging offset
- update test to include paging and results count features
- **ci**: Rework the preview app deploy and delete pipelines
- Run prettier formatting
- Add staging ci deployment
- Removing home breadcrumb in preview environment
- Changing API call to build from URL path
- Set security considerations action to read only
- add site metadata management
- only fetch drafts in previewer
- update images, add richText component
- fix build
- sanitize input, let data be nullable, drop reloader
- deploy

### Documentation

- update readme and name
