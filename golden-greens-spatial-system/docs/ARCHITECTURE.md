# System Architecture

## Purpose

The Spatial Product System is the spatial/product layer of the Golden Greens engineering environment. It is intended to support both product presentation and early-stage engineering coordination.

## Bounded contexts

| Context | Responsibility | Source of truth in MVP |
|---|---|---|
| Product Catalog | Product families, variants, default configurations | `src/catalog.js` + `data/product-catalog.json` |
| Component Library | Reusable CEA equipment and assemblies | `src/catalog.js` + `data/components.json` |
| Geometry Generator | Scene objects, component transforms, spatial grouping | `src/scene.js` |
| Calculation Kernel | Geometry-derived indicators and first-pass estimates | `src/scene.js` (`getCalculationMetrics`) |
| Presentation | Browser interface, selection, layer filtering | `src/main.js`, `index.html`, `styles.css` |
| CAD Interchange | OpenSCAD source, FreeCAD macro, OBJ/MTL assets | `openscad/`, `freecad/`, `assets/obj/` |
| Product Documentation | JSON passport and BOM exports | browser exporters |

## Object identity

Every selectable scene object has a stable-ish local ID, display name, group, description, a specification dictionary, one or more meshes, and a bounding box derived from mesh dimensions. The next revision should separate stable component definition IDs from project instance IDs. Proposed convention:

- `component_type_id`: reusable component type, e.g. `water-tank`;
- `instance_id`: unique instance in one project, e.g. `GG-PROJ-A/WATER/TANK-001`;
- `product_id`: commercial product family / variant;
- `project_id`: one customer or internal deployment configuration.

## Units and coordinate system

- Length: metres.
- Area: square metres.
- Volume: cubic metres.
- Electrical power: watts.
- Water volume: litres.
- Coordinate frame: X = long axis, Y = vertical, Z = short axis.
- Origin: product footprint centre; floor datum approximately Y = 0.

The MVP does not yet define a full site survey datum, elevation benchmark, northing/easting transform, or georeferencing.

## Data flow

```text
Product Profile + User Parameters
              |
              v
      Geometry Generator
              |
       +------+------+
       |             |
       v             v
   3D Scene      Geometry Metrics
       |             |
       +------+------+
              v
   Passport JSON / BOM CSV / OBJ
              |
       Blender / FreeCAD / Website
```

## Target architecture

```text
Storefront / Engineering UI
              |
     Product Configuration API
              |
  Product + Variant + Project Registry
              |
   Parametric Geometry Service
              |
     Engineering Calculation Kernel
       |       |        |       |
   Lighting  HVAC   Hydraulics Electrical
       |       |        |       |
   Equipment & Vendor Datasheet Registry
              |
    BOM / Cost / Compliance Evidence
              |
   CAD Assets / glTF / STEP / Drawings
              |
      Digital Twin / OT Integration
```

The target design should keep engineering calculation modules deterministic and testable. AI can suggest or review configuration changes, but the validated calculation and approval pipeline must remain explicit and auditable.
