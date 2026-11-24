export const DEFAULT_CALC = { ppfd: 220, ppe: 2.7, photoperiod: 16, ach: 4 };

export const GROUPS = [
  { id: 'structure', label: 'Конструкция', color: '#8d9b8f' },
  { id: 'grow', label: 'Выращивание', color: '#8fc777' },
  { id: 'water', label: 'Вода / раствор', color: '#69aeca' },
  { id: 'climate', label: 'Климат', color: '#c0a5d9' },
  { id: 'automation', label: 'Автоматика', color: '#d2b477' },
  { id: 'logistics', label: 'Логистика', color: '#c49a6c' },
  { id: 'laboratory', label: 'Лаборатория', color: '#91b7b2' }
];

export const PRODUCTS = [
  {
    id: 'nursery', code: 'GG-NUR-001', name: 'Клонарник / Nursery', short: 'Клонарник', icon: '♧', type: 'racks', category: 'Nursery', description: 'Модуль размножения и выращивания рассады с многоярусными стеллажами.',
    dimensions: { length: 8, width: 6, height: 3 }, chambers: 1, units: 6, levels: 4, unitWidth: 0.62, unitLengthRatio: 0.72, rackRows: 2,
    componentPowers: { pump: 180, circulation: 120, controls: 80 }, waterTankL: 500, ppfd: 140, ach: 4, daylightHours: 18
  },
  {
    id: 'vegetarium', code: 'GG-VEG-001', name: 'Вегетарий', short: 'Вегетарий', icon: '☼', type: 'beds', category: 'Protected cultivation', description: 'Защищённый грунт / вегетарий с грядками, технологическими проходами и водяным узлом.',
    dimensions: { length: 20, width: 8, height: 4 }, chambers: 1, units: 10, levels: 1, unitWidth: 0.9, unitLengthRatio: 0.78, rackRows: 2,
    componentPowers: { pump: 370, circulation: 220, controls: 100 }, waterTankL: 2000, ppfd: 180, ach: 3, daylightHours: 14
  },
  {
    id: 'growbox', code: 'GG-BOX-001', name: 'Growbox', short: 'Гроубокс', icon: '▣', type: 'racks', category: 'Compact systems', description: 'Компактная оболочка для локального цикла выращивания и испытаний.',
    dimensions: { length: 1.2, width: 1.2, height: 2.2 }, chambers: 1, units: 1, levels: 2, unitWidth: 0.72, unitLengthRatio: 0.7, rackRows: 1,
    componentPowers: { pump: 80, circulation: 35, controls: 35 }, waterTankL: 40, ppfd: 250, ach: 8, daylightHours: 18
  },
  {
    id: 'growroom', code: 'GG-GRM-001', name: 'Growroom', short: 'Гроурум', icon: '▤', type: 'racks', category: 'Indoor systems', description: 'Комната выращивания с несколькими стеллажными линиями и технической зоной.',
    dimensions: { length: 6, width: 4, height: 3 }, chambers: 1, units: 4, levels: 3, unitWidth: 0.7, unitLengthRatio: 0.72, rackRows: 2,
    componentPowers: { pump: 250, circulation: 160, controls: 80 }, waterTankL: 500, ppfd: 260, ach: 5, daylightHours: 18
  },
  {
    id: 'chambers3', code: 'GG-CHM-003', name: '3-камерный корпус', short: '3 камеры', icon: '▥', type: 'chambers', category: 'Chamber systems', description: 'Три изолируемые технологические камеры в общей конструктивной оболочке.',
    dimensions: { length: 12, width: 8, height: 3.2 }, chambers: 3, units: 6, levels: 3, unitWidth: 0.7, unitLengthRatio: 0.58, rackRows: 2, chamberCols: 3, chamberRows: 1,
    componentPowers: { pump: 450, circulation: 300, controls: 160 }, waterTankL: 1500, ppfd: 250, ach: 5, daylightHours: 18
  },
  {
    id: 'chambers9', code: 'GG-CHM-009', name: '9-камерный корпус', short: '9 камер', icon: '▦', type: 'chambers', category: 'Chamber systems', description: 'Девять камер по схеме 3 × 3 с общими техническими магистралями.',
    dimensions: { length: 18, width: 12, height: 3.2 }, chambers: 9, units: 18, levels: 3, unitWidth: 0.65, unitLengthRatio: 0.45, rackRows: 2, chamberCols: 3, chamberRows: 3,
    componentPowers: { pump: 900, circulation: 720, controls: 260 }, waterTankL: 3000, ppfd: 250, ach: 5, daylightHours: 18
  },
  {
    id: 'chambers10', code: 'GG-CHM-010', name: '10-камерный корпус', short: '10 камер', icon: '▦', type: 'chambers', category: 'Chamber systems', description: 'Десять камер по схеме 5 × 2; геометрия и оснащение масштабируются по секциям.',
    dimensions: { length: 24, width: 12, height: 3.2 }, chambers: 10, units: 20, levels: 3, unitWidth: 0.65, unitLengthRatio: 0.38, rackRows: 2, chamberCols: 5, chamberRows: 2,
    componentPowers: { pump: 1100, circulation: 850, controls: 300 }, waterTankL: 4000, ppfd: 250, ach: 5, daylightHours: 18
  },
  {
    id: 'container', code: 'GG-CON-040HC', name: 'Морской контейнер 40 HC', short: '1 контейнер', icon: '▰', type: 'container', category: 'Container systems', description: 'Базовый модуль на габаритах типового 40-футового High Cube контейнера; подтвердить фактический типоразмер поставщика.',
    dimensions: { length: 12.19, width: 2.44, height: 2.9 }, chambers: 1, units: 2, levels: 4, unitWidth: 0.42, unitLengthRatio: 0.72, rackRows: 2,
    componentPowers: { pump: 250, circulation: 180, controls: 100 }, waterTankL: 500, ppfd: 250, ach: 8, daylightHours: 18
  },
  {
    id: 'containerHub', code: 'GG-HUB-CON-010', name: 'Контейнерный хаб · 10 модулей', short: '10 контейнеров', icon: '▰', type: 'containerHub', category: 'Container systems', description: 'Комплекс из десяти модулей 40 HC, организованных в две линии с сервисным интервалом.',
    dimensions: { length: 62, width: 8, height: 2.9 }, chambers: 10, units: 20, levels: 4, unitWidth: 0.42, unitLengthRatio: 0.72, rackRows: 2,
    componentPowers: { pump: 1600, circulation: 1500, controls: 450 }, waterTankL: 5000, ppfd: 250, ach: 8, daylightHours: 18
  },
  {
    id: 'greenhouse', code: 'GG-GH-001', name: 'Теплица', short: 'Теплица', icon: '⌂', type: 'greenhouse', category: 'Greenhouse systems', description: 'Масштабируемая тепличная оболочка; габариты, пролёты, высота и грядки задаются параметрами.',
    dimensions: { length: 30, width: 10, height: 4.5 }, chambers: 1, units: 8, levels: 1, unitWidth: 0.9, unitLengthRatio: 0.82, rackRows: 2,
    componentPowers: { pump: 550, circulation: 500, controls: 150 }, waterTankL: 3000, ppfd: 180, ach: 3, daylightHours: 14
  },
  {
    id: 'turnkeyHub', code: 'GG-CAMPUS-001', name: 'Производственный хаб под ключ', short: 'Полный хаб', icon: '⌘', type: 'campus', category: 'Integrated facilities', description: 'Пространственная схема кампуса: лаборатория, nursery, grow halls, водоподготовка, склад, seed bank и engineering.',
    dimensions: { length: 72, width: 52, height: 8 }, chambers: 8, units: 24, levels: 3, unitWidth: 0.7, unitLengthRatio: 0.7, rackRows: 2,
    componentPowers: { pump: 2600, circulation: 2400, controls: 900 }, waterTankL: 12000, ppfd: 220, ach: 4, daylightHours: 16
  }
];

export const COMPONENT_LIBRARY = [
  { id: 'shell-frame', name: 'Каркас / оболочка', group: 'structure', unit: 'м', purpose: 'Несущая геометрия, габариты и конструктивная сетка.', assetObj: null, parametricSource: 'openscad/gg_components.scad#gg_box_frame' },
  { id: 'rack-module', name: 'Стеллажный модуль', group: 'grow', unit: 'шт.', purpose: 'Рама, полки, посадочные лотки и ярусы.', assetObj: 'assets/obj/rack_module_2400x650x2100.obj', parametricSource: 'openscad/gg_components.scad#gg_rack_unit' },
  { id: 'grow-bed', name: 'Грядка / канал', group: 'grow', unit: 'шт.', purpose: 'Посадочная поверхность и технологический проход.', assetObj: 'assets/obj/hydroponic_bed_6000x900.obj', parametricSource: 'openscad/gg_components.scad#gg_grow_bed' },
  { id: 'led-fixture', name: 'LED-линейка', group: 'grow', unit: 'шт.', purpose: 'Светильник с расчётными PPFD и PPE.', assetObj: 'assets/obj/linear_led_fixture_1800.obj', parametricSource: 'openscad/gg_components.scad#gg_led_fixture' },
  { id: 'reservoir', name: 'Бак раствора', group: 'water', unit: 'л', purpose: 'Ёмкость хранения воды или питательного раствора.', assetObj: 'assets/obj/nutrient_tank_500l_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_tank' },
  { id: 'mixing-station', name: 'Смесительная станция', group: 'water', unit: 'компл.', purpose: 'Баки, дозирование, циркуляция, контроль pH/EC.', assetObj: 'assets/obj/mixing_station_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_mixing_station' },
  { id: 'pump-skid', name: 'Насосный узел', group: 'water', unit: 'компл.', purpose: 'Насос, коллектор, арматура и измерение расхода.', assetObj: 'assets/obj/pump_skid_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_pump_skid' },
  { id: 'irrigation', name: 'Орошение / магистраль', group: 'water', unit: 'м', purpose: 'Подача, обратная линия, распределение и дренаж.', assetObj: null, parametricSource: 'geometry generated from route profile' },
  { id: 'ahu', name: 'Климатический блок', group: 'climate', unit: 'шт.', purpose: 'Условный AHU / HVAC-блок; тепловой подбор отдельно.', assetObj: 'assets/obj/ahu_climate_unit_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_ahu' },
  { id: 'dehumidifier', name: 'Осушение', group: 'climate', unit: 'шт.', purpose: 'Производительность определяется влаговыделением культуры.', assetObj: null, parametricSource: 'equipment model required' },
  { id: 'control-cabinet', name: 'Шкаф управления', group: 'automation', unit: 'шт.', purpose: 'PLC, питание, защиты, I/O и коммуникационные шлюзы.', assetObj: 'assets/obj/plc_control_cabinet_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_control_cabinet' },
  { id: 'edge-node', name: 'Edge / Server Node', group: 'automation', unit: 'шт.', purpose: 'Локальная телеметрия, журналирование и сетевые сервисы.', assetObj: 'assets/obj/edge_server_rack_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_edge_rack' },
  { id: 'lab-bench', name: 'Лабораторный стол', group: 'laboratory', unit: 'шт.', purpose: 'Рабочая поверхность, приборы и расходные материалы.', assetObj: 'assets/obj/laboratory_bench_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_lab_bench' },
  { id: 'seed-bank', name: 'Seed bank cabinet', group: 'laboratory', unit: 'шт.', purpose: 'Шкаф хранения семян и коллекционных образцов.', assetObj: 'assets/obj/seed_bank_cabinet_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_seed_bank' },
  { id: 'warehouse-rack', name: 'Складской стеллаж', group: 'logistics', unit: 'шт.', purpose: 'Хранение упаковки, расходных материалов и продукции.', assetObj: 'assets/obj/warehouse_rack_bay_concept.obj', parametricSource: 'openscad/gg_components.scad#gg_warehouse_rack' }
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
