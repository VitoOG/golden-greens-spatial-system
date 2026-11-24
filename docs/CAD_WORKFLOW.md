# CAD workflow

## FreeCAD

1. Open FreeCAD.
2. Open **Macro → Macros…** and select `freecad/GoldenGreens_Generate_Model.FCMacro`.
3. Before running, edit the constants at the top of the macro: `MODEL`, `LENGTH`, `WIDTH`, `HEIGHT`, `GROW_UNITS`, `LEVELS`, `UNIT_WIDTH`.
4. Execute the macro. It creates a new document and does not close existing user documents.
5. The macro saves timestamped `.FCStd` and (when export succeeds) `.step` files under `~/GoldenGreens_Exports/`.
6. Inspect groups, object dimensions and placements. Part::Box / Part::Cylinder primitives remain editable in the property editor.

The FreeCAD macro uses millimetres. It has not been runtime-tested in FreeCAD in the build environment; validate the first run on a copy and inspect the resulting tree before relying on exports.

## Blender

1. Import one or more `.obj` files from `assets/obj/`.
2. Keep the same-base-name `.mtl` beside the OBJ file so materials resolve.
3. The OBJ library uses metres; set Blender scene units to Metric and unit scale 1.0.
4. Use collections to separate structure, growing, water, climate, automation and logistics.
5. For visual refinement, add production materials, grow-light emissive shaders, plants, labels, cameras and lighting. Do not change dimensional source assets without updating their product/component profile.

For the live browser scene, select a product and use **Экспорт OBJ**. The site exports the current configured scene, not only the static component starter asset.

## OpenSCAD

1. Open `openscad/gg_product_template.scad`.
2. Edit the Customizer values or pass `-D 'MODEL="container"'` on the command line.
3. `gg_components.scad` contains reusable modules.
4. Treat exported STL as visualization/prototyping only until the solids are separated, repaired and dimensionally reviewed.
