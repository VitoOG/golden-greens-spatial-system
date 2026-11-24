# OpenSCAD starter library

- `gg_components.scad` contains reusable modules (frames, racks, beds, tanks, pump skid, mixing station, LED, AHU, PLC cabinet, server rack, lab bench, seed bank, warehouse rack, 40 HC container, greenhouse bay).
- `gg_product_template.scad` is the model selector and Customizer template.
- All dimensions use millimetres.
- Example:

```bash
openscad -o /tmp/gg-container.stl -D 'MODEL="container"' openscad/gg_product_template.scad
openscad -o /tmp/gg-campus.stl -D 'MODEL="turnkeyHub"' openscad/gg_product_template.scad
```

The template is a conceptual assembly. Overlapping component solids can cause non-manifold warnings in STL export. For manufacturing use, isolate each component and define valid solid joins, clearances, materials, tolerances and connection details.
