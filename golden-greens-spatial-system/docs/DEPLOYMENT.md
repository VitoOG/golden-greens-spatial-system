# Static website deployment

## Hosting model

The browser application is a static bundle. It has no database, build tool, CDN, external API dependency or application backend. Python's local HTTP server is only a development file server; Go is not required.

The browser loads `index.html`, `styles.css` and local ES modules from `src/`. The scene generation, rendering, parameter editing, calculations and exports run client-side. GitHub Pages can serve this application as a project site because local asset and module references are relative to the current page path.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. It runs catalog validation and calculation tests on pushes, pull requests and manual dispatch. For pushes to `main` and manual runs, it publishes the repository as a Pages artifact after validation succeeds.

After creating the repository, configure **Settings → Pages → Build and deployment → Source → GitHub Actions**. No Node build, package installation or server deployment is required.

Expected project-site URL:

`https://vitoog.github.io/golden-greens-spatial-system/`

## Local preview

Run `./run-local.sh` and open `http://127.0.0.1:8000`, or run:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Do not open `index.html` directly via `file://`; browser security rules may block ES module imports.

## Integration into another site

Recommended integration: host the configurator as a separate static route and link to it from product cards. Its relative paths also permit hosting beneath a project subpath such as `/products/spatial-configurator/`.

Pass a product ID through a query parameter only after adding explicit URL parsing and validation. Do not embed arbitrary customer values into source code.

## Security and operational notes

- Serve over HTTPS in production.
- Keep uploads disabled; the MVP does not require user-supplied files.
- Do not place secrets, API keys or customer data in this static repository.
- Validate configuration values server-side before future quote generation or procurement workflows.
- Treat generated geometry and preliminary estimates as unapproved design information.
