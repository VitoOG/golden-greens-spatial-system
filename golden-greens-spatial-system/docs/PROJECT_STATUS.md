# Project Status — 2026-11-17

## State model

- **KNOWN-GOOD** — source files present; JavaScript syntax check; product scene generation and report/OBJ export tests pass for all 11 profiles; JSON catalog/schema checks pass; 14 OBJ component assets parse as meshes in Trimesh; OpenSCAD 2021.01 successfully renders the selector branches tested, including the turnkey campus.
- **CURRENT** — MVP 0.1. Conceptual object geometry, local browser configurator, initial formulas, CAD interchange sources.
- **TARGET** — versioned product/configuration registry, evidence-backed vendor equipment data, engineering calculation services, storefront integration and Digital Twin linkage.
- **TRANSITION** — import into FreeCAD/Blender, review geometry and component properties, replace placeholders with verified equipment, refine spatial layouts and test in the actual deployment browser.
- **RECOVERY** — archive is self-contained; restore by extracting ZIP. Generated exports are reproducible from the included scripts and source profiles.

## Verification performed

| Check | Result | Notes |
|---|---|---|
| `node --check` | PASS | `catalog.js`, `gl.js`, `scene.js`, `main.js` |
| Calculation / scene test | PASS | `node scripts/test_calculation_kernel.mjs`, 11 product families |
| Catalog validation | PASS | product IDs, fields, components, zones, OBJ refs |
| JSON Schema | PASS | 11 products, 15 components |
| OBJ parsing | PASS | 14 component assets loaded by Trimesh |
| OpenSCAD render | PASS with warning | Model selector renders; combined conceptual assemblies may be non-manifold |
| FreeCAD macro runtime | NOT VERIFIED | FreeCAD GUI not installed in build environment; only Python syntax checked |
| Full browser/WebGL E2E | NOT VERIFIED | Browser runtime could not be exercised in this build environment; test on target workstation/browser |

## Known limitations

1. Geometry is conceptual, not fabrication-ready.
2. Browser models are generated procedurally from simplified component dimensions.
3. The turnkey campus uses a fixed demonstration zone layout; changing overall site size does not automatically relocate all zones.
4. Container hub models standard 40 HC modules and exposes an approximate site envelope; clearances must be checked for each count/layout.
5. Equipment power, tank volume, PPFD, PPE and ACH values are seed assumptions. They are not vendor-certified selections.
6. HVAC, dehumidification, water balance, hydraulics, electrical design, structure, fire and building compliance are not calculated.
7. OpenSCAD assembly STL may be non-manifold because conceptual component solids intersect. Do not send it to fabrication.
8. FreeCAD output is generated when the macro is run inside FreeCAD; this archive does not include a pre-generated FCStd file.

## Next actions

1. Run the local website on the target Arch workstation and inspect 3D rendering and interaction.
2. Open representative OBJ assets in Blender and FreeCAD.
3. Run the FreeCAD macro, inspect groups/parameters, and export STEP from the GUI.
4. Decide standard envelope profiles (growbox / growroom / 3-9-10 chamber / 40 HC / greenhouse) and their permitted configuration ranges.
5. Replace each equipment placeholder with source-backed records.
