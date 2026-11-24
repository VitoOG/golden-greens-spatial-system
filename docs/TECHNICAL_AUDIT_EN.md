# Golden Greens Spatial Product System
## Technical Audit Report

**Assessment date:** 24 November 2026  
**Repository:** [VitoOG/golden-greens-spatial-system](https://github.com/VitoOG/golden-greens-spatial-system)  
**Reviewed branch and revision:** `main` — `863aea61414834a82e891331ef11ef4bc3bc5c9a`  
**Product stage:** MVP 0.1  
**Assessment type:** Repository-level technical and architectural review

> **Overall conclusion:** A promising early-stage spatial product-configuration platform for CEA infrastructure. It is more substantial than a static 3D greenhouse viewer, but it is not yet a production engineering tool, validated CAD/CAE system, procurement system, or fabrication-ready design environment.

---

## 1. Executive assessment

The project establishes a browser-based parametric product catalogue and spatial configurator for Controlled-Environment Agriculture (CEA). Its current value is the combination of a product-family catalogue, configurable scene generation, preliminary calculation indicators, and portable exports.

The product is best described as an **early spatial product-engineering layer**: it can communicate product concepts, support preliminary configuration discussions, and provide a common visual reference for early engineering coordination.

The central maturity boundary is clear and should remain explicit: visual and parametric configuration is implemented; engineering verification, manufacturing definition, and project-specific design approval are not.

The strategic potential is assessed at **8/10**. This is a judgement about the direction and potential role of the product, not a production-readiness score.

## 2. Scope and evidence

The review covered the repository documentation, application source, product data, schemas, validation and test scripts, CAD starter assets, and the GitHub Actions workflow. The inspected areas included:

- Product and component catalogues: `src/catalog.js`, `src/catalog.es.js`, `data/product-catalog.json`, and `data/components.json`.
- Scene generation, browser interaction, and calculation logic: `src/scene.js`, `src/main.js`, and related rendering code.
- Data contracts and engineering documentation: `schemas/` and `docs/`.
- Validation and tests: `scripts/validate_catalog.py`, `scripts/test_calculation_kernel.mjs`, and `scripts/test_spanish_localization.mjs`.
- CAD interchange sources: `openscad/`, `freecad/`, and `assets/obj/`.
- Deployment workflow: `.github/workflows/pages.yml`.

### Current CI evidence

The latest workflow run associated with the reviewed commit completed successfully on 24 November 2026:

- [GitHub Actions run 45355501369](https://github.com/VitoOG/golden-greens-spatial-system/actions/runs/45355501369) — **success**.
- The validation job passed the product-catalogue script, calculation-kernel tests, Spanish-localization tests, and GitHub Pages entry-point checks.
- The deployment job completed the GitHub Pages deployment.

This confirms that the checks currently defined in the workflow passed for the reviewed commit. It does not establish full browser/WebGL correctness, CAD-runtime correctness, engineering validity, or manufacturing readiness.

**Not verified as part of this review:** interactive browser testing in a target browser, FreeCAD macro execution inside FreeCAD, project-specific engineering calculations, and physical or fabrication validation. The project status document records previous Trimesh and OpenSCAD checks; those checks are not rerun by the current Pages workflow.

## 3. Product capabilities present in MVP 0.1

The repository currently contains 11 product families, ranging from nursery and vegetarium systems to growboxes, growrooms, multi-chamber systems, container facilities, greenhouses, and an integrated production campus.

Implemented capabilities include:

- Interactive WebGL scene rendering with orbit, pan, zoom, object selection, and scene-layer visibility controls.
- Parameter editing for product dimensions, chamber and unit counts, rack levels, growing-unit width, and preliminary calculation inputs.
- Procedural conceptual geometry for structural envelopes, racks, beds, LED representations, tanks, mixing and pump equipment, irrigation, climate equipment, automation cabinets, and campus zones.
- Preliminary indicators for floor area, gross volume, estimated growing surface, LED electrical load and energy, airflow from ACH, and known auxiliary nameplate loads.
- Browser-side export of a JSON configuration/engineering passport, a CSV BOM, and OBJ/MTL scene geometry.
- OpenSCAD component sources and a FreeCAD starter macro for downstream inspection and modelling workflows.

The application is delivered as a static browser project. Rendering and calculations run client-side; no mandatory application backend, database, server API, or package-manager runtime is required.

## 4. Architecture assessment

The MVP uses a sensible low-dependency structure:

| Layer | Current responsibility | Assessment |
|---|---|---|
| Product and component data | Product families, defaults, and reusable component definitions | Implemented, with duplicated representations |
| Configuration state | User-selected dimensions and operating assumptions | Implemented at prototype level |
| Spatial generation | Procedural scene objects and meshes | Implemented for conceptual layouts |
| Calculation kernel | Geometry-derived indicators and first-pass estimates | Implemented; limited engineering scope |
| Browser presentation | WebGL rendering, selection, camera, and layer controls | Implemented; browser E2E not verified |
| Export | JSON, CSV, OBJ/MTL | Implemented for preliminary exchange |
| CAD handoff | OpenSCAD and FreeCAD starter assets | Partial; runtime and geometry validation remain incomplete |

The decision to keep the application static and browser-first is appropriate for this stage. It keeps deployment simple, makes the configurator portable, and avoids introducing backend infrastructure before a clear need exists.

The separation between scene generation and calculation logic is also directionally sound. The calculation kernel can evolve into separately tested engineering modules without making WebGL responsible for engineering decisions.

## 5. Findings and technical limitations

### Finding F-01 — Product data has more than one maintained representation
**Priority: P0 — resolve before expanding the catalogue**

The runtime application imports product and component definitions from `src/catalog.js`. The Python validation script reads product and component data from `data/product-catalog.json` and `data/components.json`.

The architecture documentation identifies both locations as sources for the same bounded contexts, but the current workflow does not run a parity test proving that the runtime JavaScript data and JSON data remain equivalent.

This is a **data-integrity risk**, not evidence that the current records are already inconsistent. Future edits can update one representation while leaving another unchanged.

**Recommendation:** establish one canonical source for each data domain. Prefer versioned JSON as the canonical catalogue and generate the runtime module deterministically, or load the JSON directly in the browser. Add automated parity and schema checks during migration. Apply the same rule to the component library.

### Finding F-02 — JSON Schema files exist, but current CI does not execute schema validation
**Priority: P1 — correct the verification claim and automate the check**

The repository includes product and component schema files. However, the current `scripts/validate_catalog.py` implementation performs custom field checks and does not load or execute the JSON Schema files. The current GitHub Actions workflow invokes that Python script but does not install or call a JSON Schema validator.

The existing `docs/PROJECT_STATUS.md` records “JSON Schema — PASS”. That statement is not reproduced by the current workflow as written. The present evidence supports **custom catalogue validation**, not automated JSON Schema conformance.

**Recommendation:** add a reproducible schema-validation step for both product and component records, pin the validator dependency, include negative test fixtures, and distinguish schema validation from custom semantic checks in the status report.

### Finding F-03 — Calculation outputs are preliminary indicators, not engineering calculations
**Priority: P0 — maintain the maturity boundary in product and commercial use**

The current kernel calculates useful first-pass indicators, including:

- Floor area and gross volume from configured envelope dimensions.
- Estimated growing surface from product-specific layout assumptions.
- LED power from growing area, target PPFD, and PPE.
- Daily LED energy from estimated power and photoperiod.
- Airflow as gross volume multiplied by configured air changes per hour.
- A known auxiliary-load total from indicative component power values.

These formulas are useful for early comparison, but they do not constitute complete system sizing. The current model does not establish PPFD uniformity, optical losses, fixture layout, thermal balance, HVAC capacity, psychrometrics, crop transpiration, dehumidification, water balance, hydraulic losses, pump duty point/NPSH, electrical protection and cable sizing, structural capacity, foundations, fire safety, or building-code compliance.

The “known load” indicator must not be interpreted as a complete facility electrical load: it combines an LED estimate with a limited set of auxiliary nameplate assumptions and excludes major uncalculated systems.

For the campus model, several zone dimensions and derived area/volume calculations are fixed demonstration values. Changing the site envelope does not automatically produce a fully regenerated and validated site plan. The application already warns that the campus zones may extend beyond smaller entered site dimensions.

**Recommendation:** keep the current kernel explicitly labelled as preliminary. Develop separate deterministic modules for lighting, thermal/HVAC, moisture, hydraulics, electrical engineering, and structural inputs. Each module should define units, input validation, equation version, assumptions, uncertainty, test cases, and evidence requirements.

### Finding F-04 — Spatial geometry is conceptual, not a constraint-driven CAD assembly
**Priority: P1 — required for engineering-grade placement**

The scene is generated primarily from procedural boxes, cylinders, and simplified assemblies. This is effective for clear visual communication and configurable product envelopes.

The current implementation does not provide a full assembly-constraint model, engineering-grade placement editor, collision detection, tolerance management, joint definitions, structural connection details, or manufacturing geometry. Camera movement and object selection should not be confused with component placement or engineering constraint solving.

Three distinct geometry maturity levels should be maintained:

1. **Visual geometry** — communicates the layout and product concept.
2. **Parametric engineering geometry** — constrains dimensions, clearances, interfaces, and component placement.
3. **Manufacturing geometry** — defines validated parts, joints, tolerances, materials, and fabrication details.

The current MVP is primarily at level 1, with selected parameter-driven behaviour.

**Recommendation:** implement placement and constraint capabilities incrementally: spatial coordinates and identity, grid/snap rules, collision checks, minimum service clearances, maintainability access, and validated equipment envelopes.

### Finding F-05 — CSV BOM is a preliminary template, not a procurement specification
**Priority: P1 — before quotations or purchasing workflows**

The current CSV export provides a useful starter list of generic system categories and indicative values. It does not yet represent a complete, traceable bill of materials with vendor part numbers, verified quantities, alternates, prices, lead times, datasheet references, revision status, and project-specific procurement rules.

**Recommendation:** evolve the BOM from a generic export into a traceable product structure. Each item should reference a component definition and, where applicable, an exact vendor model, quantity rule, unit, source evidence, price basis, and substitution constraints.

### Finding F-06 — CAD handoff is useful for exploration but not released for fabrication
**Priority: P1 — validate before relying on downstream CAD output**

OBJ/MTL export provides a practical visual interchange path. OpenSCAD and FreeCAD starter assets create a bridge to external modelling tools.

The repository itself warns that conceptual OpenSCAD assemblies can contain intersecting solids and may generate non-manifold STL geometry. The FreeCAD macro is documented as not runtime-tested in the build environment; only its source-level checks are recorded. A successful JavaScript/Pages workflow does not verify a FreeCAD macro run or the integrity of an exported STEP file.

**Recommendation:** define a CAD verification procedure with representative product test cases. Open generated files in the target tools, inspect dimensions and object hierarchy, test solid validity, check units and coordinate frames, and record the outcome. Do not release current conceptual STL/OBJ/STEP outputs as fabrication data without separate validation.

### Finding F-07 — Project verification status needs clearer freshness and reproducibility
**Priority: P2 — improve engineering evidence management**

The project status document is dated 17 November 2026, while the reviewed repository revision and latest successful workflow are from 24 November 2026. In addition, some checks described in the status document are not part of the current GitHub Actions workflow.

**Recommendation:** update the status record for each meaningful release. For each check, record whether it is an automated CI gate, a reproducible local test, a manual tool inspection, or an unverified item. Record the tool version, environment, test input, and result for non-CI checks.

## 6. Maturity matrix

| Area | Current state | Assessment |
|---|---|---|
| Browser 3D visualization | Implemented | Suitable for MVP demonstration; browser E2E remains unverified |
| Parameter-driven configuration | Partial | Product parameters rebuild layouts; no general placement/constraint editor |
| Product catalogue | Implemented | Duplicate maintained representations create drift risk |
| Calculation kernel | Preliminary | Useful indicators; not design calculations |
| BOM | CSV export | Not procurement-grade |
| CAD integration | OBJ/MTL, OpenSCAD, FreeCAD starter | Partial; runtime and solid validation incomplete |
| Engineering validation | Not established | No approved project-specific design evidence |
| Digital Twin / OT | Roadmap | Not implemented as an operational integration |

## 7. Commercial use and positioning

The MVP can support the following activities when its maturity boundary is made explicit:

- Product-family showcase and visual explanation.
- Preliminary customer configuration and option discussions.
- Early pre-sales engineering and concept comparison.
- Visual scope alignment for proposals.
- Initial spatial coordination between growing, water, climate, automation, laboratory, and logistics zones.
- Preliminary configuration export for further engineering review.

It should not yet be marketed or used as a tool that produces approved engineering specifications, final equipment selections, construction documents, procurement-ready BOMs, structural or MEP calculations, or fabrication releases.

The strongest commercial direction is not merely “3D greenhouse visualization”. It is a configurable interface for communicating complete CEA facility concepts, including production areas and their supporting infrastructure.

## 8. Recommended development sequence

### P0 — Data integrity and explicit contracts
- Select one canonical product catalogue and one canonical component library.
- Add parity tests or deterministic catalogue generation.
- Execute JSON Schema validation in CI.
- Version configuration and export schemas.
- Separate Product Family, Product Variant, Project Configuration, Component Definition, and placed Instance identities.
- Define units and provenance for engineering-relevant values.

### P1 — Spatial engineering
- Add a placement editor with explicit coordinates.
- Add grid/snap and placement constraints.
- Add collision and service-clearance checks.
- Use verified component envelopes and connection points.
- Make campus layouts respond predictably to site-boundary changes.

### P2 — Evidence-backed engineering data
- Create a vendor equipment registry with exact manufacturer/model references.
- Store datasheet revision, rated values, operating limits, dimensions, interfaces, and source provenance.
- Generate a traceable BOM with quantities, alternates, and a clear commercial status.
- Add separate calculation modules with test vectors, uncertainty, and auditable reports.
- Establish repeatable OBJ/STEP/FreeCAD validation procedures.

### P3 — System integration
- Keep the Spatial Product System as the spatial and product-configuration layer.
- Integrate with ERICA OS through versioned data contracts for project knowledge, engineering records, and configuration history.
- Integrate with the CEA Runtime through explicit asset identity, PLC/I/O mapping, SCADA topology, and telemetry contracts.
- Keep physical control authority in deterministic controllers and independent safety systems. AI may assist analysis and configuration review, but must not directly control safety-critical processes.

## 9. Indicative ratings

These ratings are qualitative engineering judgement, not measured performance or certification:

| Criterion | Rating |
|---|---:|
| Product concept | 9/10 |
| MVP architecture | 8/10 |
| MVP implementation | 7/10 |
| Engineering calculation validity | 3/10 |
| CAD readiness | 3/10 |
| Commercial potential | 9/10 |
| Production readiness | 2/10 |
| Strategic potential | **8/10** |

The strategic-potential score must not be read as an indication that the current system is ready for production, construction, procurement, or certification.

## 10. Architectural conclusion

Retain the Spatial Product System as a separate Golden Greens product component. Do not merge it into ERICA OS as a monolith and do not move all geometry processing to a server without a demonstrated requirement.

Maintain clear system boundaries:

- **Spatial Product System** — product families, configurable geometry, spatial identity, and visual configuration.
- **ERICA OS** — project knowledge, engineering records, AI-assisted analysis, and infrastructure/project coordination.
- **CEA Runtime** — sensors, deterministic control, PLC/edge execution, actuators, alarms, and independent safety functions.

Connect these domains through versioned, validated data contracts.

**Final assessment:** the project is a credible and commercially useful early-stage product asset for Golden Greens, provided it is positioned as a visualization and preliminary configuration platform. The next meaningful milestone is not a backend rewrite. It is to close the data-integrity and verification gaps, define measurable acceptance criteria for MVP 0.2, and progressively introduce evidence-backed engineering constraints and calculations.

---

## References

- [Repository README](../README.md)
- [Project status](PROJECT_STATUS.md)
- [System architecture](ARCHITECTURE.md)
- [Engineering method and calculation boundary](ENGINEERING_METHOD.md)
- [Product data model](PRODUCT_DATA_MODEL.md)
- [CAD workflow](CAD_WORKFLOW.md)
- [Roadmap](ROADMAP.md)
- [Runtime product catalogue](../src/catalog.js)
- [JSON product catalogue](../data/product-catalog.json)
- [Product schema](../schemas/product.schema.json)
- [Catalogue validation script](../scripts/validate_catalog.py)
- [Calculation and scene tests](../scripts/test_calculation_kernel.mjs)
- [Current CI workflow](../.github/workflows/pages.yml)
- [Reviewed commit](https://github.com/VitoOG/golden-greens-spatial-system/commit/863aea61414834a82e891331ef11ef4bc3bc5c9a)
- [Successful workflow run](https://github.com/VitoOG/golden-greens-spatial-system/actions/runs/45355501369)
