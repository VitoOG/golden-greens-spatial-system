# Product Data Model — proposed canonical entities

| Entity | Key | Purpose |
|---|---|---|
| ProductFamily | `family_id` | Nursery, Growroom, Container Farm, Greenhouse |
| ProductVariant | `product_id` | Sellable base SKU and variant rules |
| ProjectConfiguration | `project_config_id` | Customer or internal configured instance |
| GeometryProfile | `geometry_profile_id` | Envelope, zones, partitions and openings |
| SpatialObject | `instance_id` | One placed room, rack, tank, fan, sensor or cabinet |
| ComponentDefinition | `component_type_id` | Reusable equipment/component master record |
| EquipmentModel | `equipment_model_id` | Exact vendor model and datasheet facts |
| CalculationRun | `calculation_run_id` | Inputs, versioned equations, outputs, uncertainty |
| BOMItem | `bom_item_id` | Quantity, unit, vendor choice, alternate and cost |
| EvidenceRecord | `evidence_id` | Datasheet, drawing, test record, hash and source |
| AutomationAsset | `automation_asset_id` | PLC, I/O, server, edge node, network endpoint |
| TelemetryTag | `tag_id` | Signal definition, unit, source and quality |

## Required provenance fields

Engineering-relevant numerical values should carry: `value`, `unit`, `source_type`, `source_ref`, `revision`, `verified_at`, `verification_status`, and `notes`. A number without provenance should be labelled as an assumption or placeholder.

## Configuration state

Recommended explicit states:

- `DRAFT` — initial configuration;
- `GEOMETRY_CHECKED` — envelope and placement constraints validated;
- `CALCULATION_PENDING` — required design inputs incomplete;
- `CALCULATED` — deterministic modules completed;
- `ENGINEERING_REVIEW` — awaiting independent review;
- `APPROVED_FOR_QUOTE` — commercial proposal use only;
- `APPROVED_FOR_BUILD` — only after separate project-specific verification and approval.

The current MVP is `DRAFT` / `PRELIMINARY_CONCEPT` only.
