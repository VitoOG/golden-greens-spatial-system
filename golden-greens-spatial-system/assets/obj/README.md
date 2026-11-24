# OBJ component library

- Units: metres (1 OBJ unit = 1 m).
- Each `.obj` references the `.mtl` with the same base name.
- Keep the OBJ and its MTL in the same directory when importing into Blender or FreeCAD.
- OBJ meshes are conceptual visual assets. They have no parametric constraints, engineering tolerances, connector metadata, material certificates or manufacturing detail.
- For editable parametric construction, use `openscad/gg_components.scad` or the FreeCAD macro.
- Rebuild deterministically with `python3 scripts/generate_obj_assets.py`.
