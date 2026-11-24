# Data registry

- `product-catalog.json` — product family profiles and defaults. Current browser app imports the same seed profiles from `src/catalog.js`; keep both in sync when changing profiles.
- `components.json` — reusable component groups and component index.
- `campus-zones.json` — functional-zone registry for integrated production facilities.
- `equipment-record-template.json` — evidence-first vendor equipment record. Null values are intentional; do not fill them from guesses.
- `calculation-methods.json` — implemented preliminary equations and explicit limitations.

The current profiles are seed data for prototyping. `componentPowers`, tank volumes, PPFD, ACH and layout dimensions are indicative placeholders until replaced with verified project inputs or manufacturer datasheets.
