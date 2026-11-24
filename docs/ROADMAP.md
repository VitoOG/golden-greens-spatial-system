# Roadmap

## MVP 0.1 — current archive

- Product family catalogue and parametric envelope fields.
- Procedural 3D visualization in browser.
- First-pass area, volume, LED and ACH indicators.
- JSON passport, CSV BOM and OBJ/MTL export.
- FreeCAD and OpenSCAD starter assets.

## 0.2 — product configuration model

- Split product family, sellable SKU, project variant and component instance.
- More precise layouts for chamber blocks, container clusters and greenhouse bays.
- Per-zone equipment counts and service clearances.
- Component placement editor and snap/grid constraints.
- Component-level configuration persistence and versioning.
- Unit-aware data dictionary and input validation.

## 0.3 — evidence-based equipment library

- Manufacturer catalogue and datasheet capture.
- Exact equipment dimensions, power, curves, operating limits and interfaces.
- BOM with quantities, alternates, lead times, cost and evidence links.
- Import/export STEP, glTF/GLB and IFC where applicable.

## 0.4 — engineering calculation services

- Lighting layout / PPFD distribution estimator.
- Psychrometric and thermal-load model.
- Moisture balance and dehumidification.
- Irrigation hydraulic network and pump duty point.
- Electrical load schedule and preliminary distribution design.
- Structural input model for qualified structural design workflow.
- Unit tests, validation cases, uncertainty ranges and reports.

## 0.5 — commerce and delivery

- Storefront product pages and interactive Web 3D viewer.
- Configuration rules and constrained option sets.
- Quote and proposal generator.
- Product passport and assembly / maintenance documents.

## 0.6+ — Twin / OT

- Asset hierarchy and tag namespace.
- PLC I/O list, control narrative, alarms and interlocks.
- SCADA/HMI architecture and historian.
- OT network zones, conduits, VLANs and remote-access boundaries.
- Edge nodes, telemetry contracts and event history.
- Digital Twin state with explicit quality, source and timestamp.

## Acceptance gates

Each phase should have explicit tests, sample configurations, known-good expected outputs, export verification and backward-compatible schema migration. Engineering modules should not be activated for purchasing or construction decisions until their inputs, equations, units, evidence and independent review are validated.
