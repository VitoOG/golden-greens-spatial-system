# Golden Greens Spatial Product System

**MVP 0.1 — a browser-based parametric 3D catalog and configurator for CEA products and facility infrastructure.**

The project explores a configurable product family spanning nurseries, growboxes, growrooms, multi-chamber systems, container facilities, greenhouses and integrated production campuses.

> **Maturity boundary:** this is an early-stage visualization and product-configuration prototype. It is not a completed CAD/CAE system, fabrication-ready model set, approved engineering design, procurement specification or certified facility design.

## Live application

The intended GitHub Pages address is:

`https://vitoog.github.io/golden-greens-spatial-system/`

The site is a static browser application. It does not require Go, Node.js, a database, a server-side API, a CDN or external runtime services. GitHub Pages serves the HTML, CSS, JavaScript modules and project assets; WebGL rendering and calculations run in the visitor's browser.

## Implemented MVP capabilities

- 11 product families: nursery, vegetarium, growbox, growroom, 3-, 9- and 10-chamber systems, 40 HC container, 10-container hub, greenhouse and turnkey campus.
- Interactive WebGL scene with orbit, pan, zoom, object selection and visibility controls for scene layers.
- Parameter editing for dimensions, chambers/modules, racks/beds, levels and calculation inputs.
- Procedural conceptual geometry for frames, racks, beds, LED fixtures, tanks, mixing/pump equipment, irrigation, climate units, PLC cabinets, edge/server equipment, laboratory and logistics areas.
- Preliminary metrics for floor area, gross volume, grow area, estimated LED load/energy and air volume based on ACH.
- Browser-side export of configuration passport (JSON), bill of materials (CSV) and scene (OBJ/MTL).
- OpenSCAD component sources, a FreeCAD starter macro and OBJ assets for downstream visualization workflows.

## Run locally

A local static HTTP server is needed because browsers restrict JavaScript ES modules opened directly through `file://`. Python 3 is used only for local file serving; it is not an application backend.

### Linux / macOS

```bash
./run-local.sh
```

Open `http://127.0.0.1:8000`.

### Windows

Run `run-local.bat` and open `http://127.0.0.1:8000`.

Or run manually:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

## Run tests

```bash
python3 scripts/validate_catalog.py
node scripts/test_calculation_kernel.mjs
```

The GitHub Actions workflow runs these checks before deploying updates to GitHub Pages.

## Repository structure

```text
.
├── .github/workflows/pages.yml
├── index.html
├── styles.css
├── src/                   # browser-side catalog, WebGL and scene logic
├── data/                  # product/component catalogs and calculation references
├── schemas/               # JSON schemas
├── assets/obj/            # reusable OBJ/MTL component assets
├── examples/              # example product configurations
├── openscad/              # parametric component sources
├── freecad/               # FreeCAD starter macro
├── scripts/               # catalog validation, asset generation and tests
├── docs/                  # architecture, deployment, methodology and status
└── exports/               # local export destination; generated exports are ignored
```

## Calculation scope and limitations

The current calculation kernel provides preliminary estimates, including:

- Floor area: `A_floor = L × W`.
- Gross volume: `V_gross = L × W × H`.
- Grow area based on configured rack levels or growing-bed surfaces.
- Approximate LED power: `P_LED [W] ≈ A_grow [m²] × PPFD [µmol/(m²·s)] / PPE [µmol/J]`.
- Daily LED energy: `E_LED [kWh/day] = P_LED [W] × photoperiod [h/day] / 1000`.
- Air volume from configured air-change rate: `Q [m³/h] = V_gross [m³] × ACH [1/h]`.

These are not equipment-selection or engineering-design calculations. They do not model PPFD uniformity, optical and driver losses, heat balance, full HVAC/psychrometrics, dehumidification, crop water balance, hydraulic losses, pump duty/NPSH, electrical design, structural capacity, foundations, fire/building requirements or regulatory compliance. Equipment values in product profiles are indicative placeholders and are not vendor-validated.

OpenSCAD starter assemblies contain intersecting conceptual solids and may produce non-manifold warnings on STL export. Repair and validate geometry before any fabrication workflow. OBJ assets are intended for visual composition, not manufacturing release.

Before procurement, construction or operation, each system requires separate engineering design, source-backed component selection, applicable regulatory review and independent verification.

## GitHub Pages deployment

The repository includes `.github/workflows/pages.yml`. After creating the repository:

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main`; the workflow validates the catalog and calculation kernel, then publishes the static site.

No build step or package manager is required. Asset and module paths are relative, so the application works at the GitHub Pages project-site subpath.

## Roadmap

See [`docs/ROADMAP.md`](docs/ROADMAP.md) and [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md). Key future work includes parameter/schema versioning, sourced vendor equipment data, separate HVAC/hydraulic/electrical/structural calculation modules, component assembly and collision checks, and GLB/glTF / STEP exchange workflows.

## Language

The original Russian project description is preserved in [`README.ru.md`](README.ru.md).

## Technical audit

Repository-level technical audit reports for the reviewed MVP 0.1 revision:

- [Technical Audit Report — English](docs/TECHNICAL_AUDIT_EN.md)
- [Informe de auditoría técnica — Español](docs/TECHNICAL_AUDIT_ES.md)

The reports distinguish verified repository behaviour, CI evidence, engineering limitations, and recommended development priorities. They are assessments of the reviewed revision, not certification or approval for construction, procurement, or fabrication.
