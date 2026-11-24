export const DEFAULT_CALC = { ppfd: 220, ppe: 2.7, photoperiod: 16, ach: 4 };

export const GROUPS = [
  { id: 'structure', label: 'Estructura', color: '#8d9b8f' },
  { id: 'grow', label: 'Cultivo', color: '#8fc777' },
  { id: 'water', label: 'Agua / solución', color: '#69aeca' },
  { id: 'climate', label: 'Climatización', color: '#c0a5d9' },
  { id: 'automation', label: 'Automatización', color: '#d2b477' },
  { id: 'logistics', label: 'Logística', color: '#c49a6c' },
  { id: 'laboratory', label: 'Laboratorio', color: '#91b7b2' }
];

export const PRODUCTS = [
  {
    id: 'nursery', code: 'GG-NUR-001', name: 'Vivero de propagación', short: 'Vivero', icon: '♧', type: 'racks', category: 'Vivero', description: 'Módulo de propagación de plantas y producción de plántulas con estanterías multinivel.',
    dimensions: { length: 8, width: 6, height: 3 }, chambers: 1, units: 6, levels: 4, unitWidth: 0.62, unitLengthRatio: 0.72, rackRows: 2,
    componentPowers: { pump: 180, circulation: 120, controls: 80 }, waterTankL: 500, ppfd: 140, ach: 4, daylightHours: 18
  },
  {
    id: 'vegetarium', code: 'GG-VEG-001', name: 'Vegetario', short: 'Vegetario', icon: '☼', type: 'beds', category: 'Cultivo protegido', description: 'Cultivo protegido con bancales, pasillos técnicos y unidad de agua.',
    dimensions: { length: 20, width: 8, height: 4 }, chambers: 1, units: 10, levels: 1, unitWidth: 0.9, unitLengthRatio: 0.78, rackRows: 2,
    componentPowers: { pump: 370, circulation: 220, controls: 100 }, waterTankL: 2000, ppfd: 180, ach: 3, daylightHours: 14
  },
  {
    id: 'growbox', code: 'GG-BOX-001', name: 'Growbox', short: 'Growbox', icon: '▣', type: 'racks', category: 'Sistemas compactos', description: 'Envolvente compacta para un ciclo local de cultivo y pruebas.',
    dimensions: { length: 1.2, width: 1.2, height: 2.2 }, chambers: 1, units: 1, levels: 2, unitWidth: 0.72, unitLengthRatio: 0.7, rackRows: 1,
    componentPowers: { pump: 80, circulation: 35, controls: 35 }, waterTankL: 40, ppfd: 250, ach: 8, daylightHours: 18
  },
  {
    id: 'growroom', code: 'GG-GRM-001', name: 'Growroom', short: 'Sala de cultivo', icon: '▤', type: 'racks', category: 'Sistemas de interior', description: 'Sala de cultivo con varias líneas de estanterías y zona técnica.',
    dimensions: { length: 6, width: 4, height: 3 }, chambers: 1, units: 4, levels: 3, unitWidth: 0.7, unitLengthRatio: 0.72, rackRows: 2,
    componentPowers: { pump: 250, circulation: 160, controls: 80 }, waterTankL: 500, ppfd: 260, ach: 5, daylightHours: 18
  },
  {
    id: 'chambers3', code: 'GG-CHM-003', name: 'Módulo de 3 cámaras', short: '3 cámaras', icon: '▥', type: 'chambers', category: 'Sistemas multicámara', description: 'Tres cámaras de proceso aislables dentro de una envolvente estructural común.',
    dimensions: { length: 12, width: 8, height: 3.2 }, chambers: 3, units: 6, levels: 3, unitWidth: 0.7, unitLengthRatio: 0.58, rackRows: 2, chamberCols: 3, chamberRows: 1,
    componentPowers: { pump: 450, circulation: 300, controls: 160 }, waterTankL: 1500, ppfd: 250, ach: 5, daylightHours: 18
  },
  {
    id: 'chambers9', code: 'GG-CHM-009', name: 'Módulo de 9 cámaras', short: '9 cámaras', icon: '▦', type: 'chambers', category: 'Sistemas multicámara', description: 'Nueve cámaras en una disposición 3 × 3 con líneas técnicas compartidas.',
    dimensions: { length: 18, width: 12, height: 3.2 }, chambers: 9, units: 18, levels: 3, unitWidth: 0.65, unitLengthRatio: 0.45, rackRows: 2, chamberCols: 3, chamberRows: 3,
    componentPowers: { pump: 900, circulation: 720, controls: 260 }, waterTankL: 3000, ppfd: 250, ach: 5, daylightHours: 18
  },
  {
    id: 'chambers10', code: 'GG-CHM-010', name: 'Módulo de 10 cámaras', short: '10 cámaras', icon: '▦', type: 'chambers', category: 'Sistemas multicámara', description: 'Diez cámaras en una disposición 5 × 2; la geometría y el equipamiento se escalan por secciones.',
    dimensions: { length: 24, width: 12, height: 3.2 }, chambers: 10, units: 20, levels: 3, unitWidth: 0.65, unitLengthRatio: 0.38, rackRows: 2, chamberCols: 5, chamberRows: 2,
    componentPowers: { pump: 1100, circulation: 850, controls: 300 }, waterTankL: 4000, ppfd: 250, ach: 5, daylightHours: 18
  },
  {
    id: 'container', code: 'GG-CON-040HC', name: 'Contenedor marítimo 40 HC', short: '1 contenedor', icon: '▰', type: 'container', category: 'Sistemas en contenedores', description: 'Módulo base con las dimensiones de un contenedor High Cube estándar de 40 pies; debe confirmarse el tamaño real del proveedor.',
    dimensions: { length: 12.19, width: 2.44, height: 2.9 }, chambers: 1, units: 2, levels: 4, unitWidth: 0.42, unitLengthRatio: 0.72, rackRows: 2,
    componentPowers: { pump: 250, circulation: 180, controls: 100 }, waterTankL: 500, ppfd: 250, ach: 8, daylightHours: 18
  },
  {
    id: 'containerHub', code: 'GG-HUB-CON-010', name: 'Hub de contenedores · 10 módulos', short: '10 contenedores', icon: '▰', type: 'containerHub', category: 'Sistemas en contenedores', description: 'Conjunto de diez módulos 40 HC dispuestos en dos filas con un pasillo de servicio.',
    dimensions: { length: 62, width: 8, height: 2.9 }, chambers: 10, units: 20, levels: 4, unitWidth: 0.42, unitLengthRatio: 0.72, rackRows: 2,
    componentPowers: { pump: 1600, circulation: 1500, controls: 450 }, waterTankL: 5000, ppfd: 250, ach: 8, daylightHours: 18
  },
  {
    id: 'greenhouse', code: 'GG-GH-001', name: 'Invernadero', short: 'Invernadero', icon: '⌂', type: 'greenhouse', category: 'Sistemas de invernadero', description: 'Envolvente de invernadero escalable; las dimensiones, luces, altura y bancales se definen mediante parámetros.',
    dimensions: { length: 30, width: 10, height: 4.5 }, chambers: 1, units: 8, levels: 1, unitWidth: 0.9, unitLengthRatio: 0.82, rackRows: 2,
    componentPowers: { pump: 550, circulation: 500, controls: 150 }, waterTankL: 3000, ppfd: 180, ach: 3, daylightHours: 14
  },
  {
    id: 'turnkeyHub', code: 'GG-CAMPUS-001', name: 'Campus de producción integral', short: 'Campus completo', icon: '⌘', type: 'campus', category: 'Instalaciones integradas', description: 'Distribución espacial del campus: laboratorio, vivero, salas de cultivo, tratamiento de agua, almacén, banco de semillas e ingeniería.',
    dimensions: { length: 72, width: 52, height: 8 }, chambers: 8, units: 24, levels: 3, unitWidth: 0.7, unitLengthRatio: 0.7, rackRows: 2,
    componentPowers: { pump: 2600, circulation: 2400, controls: 900 }, waterTankL: 12000, ppfd: 220, ach: 4, daylightHours: 16
  }
];

export const COMPONENT_LIBRARY = [
  { id: 'shell-frame', name: 'Bastidor / envolvente', group: 'structure', unit: 'm', purpose: 'Geometría portante, dimensiones y retícula estructural.', assetObj: null, parametricSource: 'openscad/gg_components.scad#gg_box_frame' },
  { id: 'rack-module', name: 'Módulo de estanterías', group: 'grow', unit: 'ud.', purpose: 'Bastidor, estantes, bandejas de cultivo y niveles.', assetObj: 'assets/obj/rack_module_2400x650x2100.obj', parametricSource: 'openscad/gg_components.scad#gg_rack_unit' },
  { id: 'grow-bed', name: 'Bancal / canal', group: 'grow', unit: 'ud.', purpose: 'Superficie de cultivo y pasillo técnico.', assetObj: 'assets/obj/hydroponic_bed_6000x900.obj', parametricSource: 'openscad/gg_components.scad#gg_grow_bed' },
  { id: 'led-fixture', name: 'Luminaria LED lineal', group: 'grow', unit: 'ud.', purpose: 'Luminaria con parámetros PPFD y PPE para estimación.', assetObj: 'assets/obj/linear_led_fixture_1800.obj', parametricSource: 'openscad/gg_components.scad#gg_led_fixture' },
  { id: 'reservoir', name: 'Depósito de solución', group: 'water', unit: 'L', purpose: 'Depósito para almacenar agua o solución nutritiva.', assetObj: 'assets/obj/nutrient_tank_500l_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_tank' },
  { id: 'mixing-station', name: 'Estación de mezcla', group: 'water', unit: 'conjunto', purpose: 'Depósitos, dosificación, circulación y control de pH/EC.', assetObj: 'assets/obj/mixing_station_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_mixing_station' },
  { id: 'pump-skid', name: 'Conjunto de bombeo', group: 'water', unit: 'conjunto', purpose: 'Bomba, colector, válvulas y medición de caudal.', assetObj: 'assets/obj/pump_skid_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_pump_skid' },
  { id: 'irrigation', name: 'Riego / línea principal', group: 'water', unit: 'm', purpose: 'Impulsión, retorno, distribución y drenaje.', assetObj: null, parametricSource: 'geometría generada a partir del trazado de la ruta' },
  { id: 'ahu', name: 'Unidad de climatización', group: 'climate', unit: 'ud.', purpose: 'Unidad conceptual AHU/HVAC; el dimensionamiento térmico se realiza por separado.', assetObj: 'assets/obj/ahu_climate_unit_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_ahu' },
  { id: 'dehumidifier', name: 'Deshumidificación', group: 'climate', unit: 'ud.', purpose: 'La capacidad depende de la carga de humedad del cultivo.', assetObj: null, parametricSource: 'modelo de equipo pendiente' },
  { id: 'control-cabinet', name: 'Armario de control', group: 'automation', unit: 'ud.', purpose: 'PLC, alimentación, protecciones, E/S y pasarelas de comunicación.', assetObj: 'assets/obj/plc_control_cabinet_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_control_cabinet' },
  { id: 'edge-node', name: 'Nodo Edge / servidor', group: 'automation', unit: 'ud.', purpose: 'Telemetría local, registro de eventos y servicios de red.', assetObj: 'assets/obj/edge_server_rack_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_edge_rack' },
  { id: 'lab-bench', name: 'Mesa de laboratorio', group: 'laboratory', unit: 'ud.', purpose: 'Superficie de trabajo, instrumentos y consumibles.', assetObj: 'assets/obj/laboratory_bench_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_lab_bench' },
  { id: 'seed-bank', name: 'Armario para banco de semillas', group: 'laboratory', unit: 'ud.', purpose: 'Armario para almacenar semillas y muestras de colección.', assetObj: 'assets/obj/seed_bank_cabinet_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_seed_bank' },
  { id: 'warehouse-rack', name: 'Estantería de almacén', group: 'logistics', unit: 'ud.', purpose: 'Almacenamiento de embalajes, consumibles y productos.', assetObj: 'assets/obj/warehouse_rack_bay_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_warehouse_rack' }
];

export function createInitialState(product) {
  return {
    length: product.dimensions.length,
    width: product.dimensions.width,
    height: product.dimensions.height,
    chambers: product.chambers,
    units: product.units,
    levels: product.levels,
    unitWidth: product.unitWidth,
    ppfd: product.ppfd ?? DEFAULT_CALC.ppfd,
    ppe: DEFAULT_CALC.ppe,
    photoperiod: product.daylightHours ?? DEFAULT_CALC.photoperiod,
    ach: product.ach ?? DEFAULT_CALC.ach
  };
}
