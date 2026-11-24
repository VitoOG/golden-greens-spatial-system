const COLORS = {
  floor: '#68766b', frame: '#9ba99b', steel: '#81918a', darkSteel: '#53635c', shelf: '#8da08e', tray: '#536d53', plant: '#75b86c', plant2: '#a2cb79', led: '#e6d9a8', blue: '#4d9ab5', blueDark: '#34758e', tank: '#6a9bb0', tankDark: '#456d80', climate: '#8d8eae', cabinet: '#788b7e', amber: '#bf9c67', seed: '#9aaf79', road: '#3f4e43', wall: '#829085', white: '#d9e3d7'
};

const m = (shape, x, y, z, sx, sy, sz, color, rotation = [0,0,0]) => ({ shape, position: [x,y,z], scale: [sx,sy,sz], color, rotation });
const box = (x,y,z,sx,sy,sz,color,rotation) => m('box',x,y,z,sx,sy,sz,color,rotation);
const cyl = (x,y,z,sx,sy,sz,color) => m('cylinder',x,y,z,sx,sy,sz,color);

function addObject(scene, id, name, group, description, spec, meshes) {
  if (!meshes.length) return null;
  const min = [Infinity,Infinity,Infinity], max = [-Infinity,-Infinity,-Infinity];
  for (const mesh of meshes) for (let i=0;i<3;i++) {
    const half = Math.abs(mesh.scale[i]) / 2;
    min[i] = Math.min(min[i], mesh.position[i] - half); max[i] = Math.max(max[i], mesh.position[i] + half);
  }
  const center = min.map((v,i)=>(v+max[i])/2);
  const size = min.map((v,i)=>Math.max(.05,max[i]-v));
  const object = { id, name, group, description, spec: spec || {}, meshes, center, size };
  scene.objects.push(object);
  return object;
}

function addGrid(scene, extent = 42, step = 2) {
  const meshes = [];
  for (let p=-extent;p<=extent;p+=step) {
    meshes.push(box(p,-.13,0,.012,.01,extent*2,'#334238'));
    meshes.push(box(0,-.13,p,extent*2,.01,.012,'#334238'));
  }
  addObject(scene,'GG-GRID','Рабочая координатная сетка','grid','Справочная сетка сцены. Не является строительной разметкой.',{step_m:step},meshes);
}

function addBuildingFrame(scene, id, name, cx, cz, L, W, H, options = {}) {
  const meshes = [];
  const floorT = Math.max(.10, Math.min(.18, H*.035));
  meshes.push(box(cx, floorT/2, cz, L, floorT, W, options.floorColor || COLORS.floor));
  const col = Math.max(.10, Math.min(.18, Math.min(L,W)*.025));
  const y = H/2 + floorT/2;
  for (const dx of [-L/2+col/2,L/2-col/2]) for (const dz of [-W/2+col/2,W/2-col/2]) meshes.push(box(cx+dx,y,cz+dz,col,H,col,COLORS.frame));
  const beam = Math.max(.10,col*.85);
  meshes.push(box(cx,H+floorT/2,cz-W/2+beam/2,L,beam,beam,COLORS.frame));
  meshes.push(box(cx,H+floorT/2,cz+W/2-beam/2,L,beam,beam,COLORS.frame));
  meshes.push(box(cx-L/2+beam/2,H+floorT/2,cz,beam,beam,W,COLORS.frame));
  meshes.push(box(cx+L/2-beam/2,H+floorT/2,cz,beam,beam,W,COLORS.frame));
  if (options.greenhouse) {
    const ridgeY = H + Math.min(1.1,H*.22);
    meshes.push(box(cx,ridgeY,cz,.10,.10,W,COLORS.frame));
    for (let dx=-L/2+2;dx<L/2;dx+=4) {
      meshes.push(box(cx+dx,H*.82,cz,.065,H*.36,W,COLORS.steel));
    }
    // Sloped roof purlins represented by thin bars; rotation around Z.
    const rise = ridgeY - H;
    const run = W/2;
    const angle = Math.atan2(rise,run);
    meshes.push(box(cx,ridgeY-rise/2,cz-W/4, L,.07,Math.hypot(run,rise),COLORS.steel,[angle,0,0]));
    meshes.push(box(cx,ridgeY-rise/2,cz+W/4, L,.07,Math.hypot(run,rise),COLORS.steel,[-angle,0,0]));
  }
  if (options.container) {
    const count = Math.max(8,Math.floor(L/1.15));
    for (let i=1;i<count;i++) {
      const xx = cx-L/2 + L*i/count;
      meshes.push(box(xx,H*.52,cz-W/2,.035,H*.78,.05,COLORS.darkSteel));
      meshes.push(box(xx,H*.52,cz+W/2,.035,H*.78,.05,COLORS.darkSteel));
    }
    meshes.push(box(cx,H*.52,cz-W/2,L,H*.78,.035,'#667d82'));
    meshes.push(box(cx,H*.52,cz+W/2,L,H*.78,.035,'#667d82'));
  }
  const label = options.greenhouse ? 'Каркас теплицы' : options.container ? 'Каркас контейнера' : 'Конструктивная оболочка';
  return addObject(scene,id,name,'structure',`${label}: базовая компоновочная геометрия без расчёта несущей способности и узлов соединения.`,{length_m:L,width_m:W,height_m:H,floor_area_m2:L*W,gross_volume_m3:L*W*H,construction:'conceptual frame'},meshes);
}

function addRack(scene, id, name, x, z, rackLength, rackDepth, H, levels, options = {}) {
  const meshes = [];
  const baseY = options.baseY ?? .22;
  const rackHeight = Math.min(H*.72, Math.max(1.0,H-.55));
  const post = Math.max(.035,Math.min(.07,rackDepth*.08));
  const topY = baseY + rackHeight;
  for (const dx of [-rackLength/2+post/2,rackLength/2-post/2]) for (const dz of [-rackDepth/2+post/2,rackDepth/2-post/2]) {
    meshes.push(box(x+dx,baseY+rackHeight/2,z+dz,post,rackHeight,post,COLORS.steel));
  }
  const levelCount = Math.max(1,Math.round(levels));
  for (let level=0;level<levelCount;level++) {
    const yy = baseY + .28 + (rackHeight-.42) * (level+0.25) / levelCount;
    meshes.push(box(x,yy,z,rackLength-.08,.065,rackDepth-.04,COLORS.shelf));
    meshes.push(box(x,yy+.055,z,rackLength-.14,.035,rackDepth-.12,COLORS.tray));
  }
  addObject(scene,id,name,'grow','Модуль выращивания: стойки, посадочные лотки и ярусы. Сечение профилей и несущая способность не рассчитываются.',{rack_length_m:rackLength,rack_depth_m:rackDepth,levels:levelCount,growing_surface_m2:rackLength*rackDepth*levelCount},meshes);

  const lights=[]; const plants=[];
  for (let level=0;level<levelCount;level++) {
    const shelfY = baseY + .28 + (rackHeight-.42) * (level+0.25) / levelCount;
    lights.push(box(x,shelfY+.15,z,rackLength*.84,.055,rackDepth*.48,COLORS.led));
    const plantCount = Math.max(2,Math.min(5,Math.floor(rackLength/1.1)));
    for (let p=0;p<plantCount;p++) {
      const px=x-rackLength*.38+(rackLength*.76)*(p/(Math.max(1,plantCount-1)));
      const pz=z + (p%2===0?-1:1)*rackDepth*.19;
      plants.push(cyl(px,shelfY+.17,pz,.11,.25,.11,p%3===0?COLORS.plant2:COLORS.plant));
    }
  }
  addObject(scene,`${id}-LED`,`${name} · LED`, 'grow','Условная световая линейка. Фактический поток, оптика, равномерность и тепловые характеристики задаются выбранной моделью светильника.',{fixture_type:'linear LED',design_input:'PPFD / PPE'},lights);
  addObject(scene,`${id}-PLANTS`,`${name} · растения`, 'grow','Визуальные маркеры посадочных мест; не являются ботанической моделью или нормой плотности посадки.',{visual_instances:plants.length},plants);
}

function addBed(scene,id,name,x,z,L,W,H=0.42) {
  const meshes=[box(x,.22,z,L,.25,W,COLORS.tray),box(x,.37,z,L-.12,.06,W-.12,'#67865c')];
  addObject(scene,id,name,'grow','Посадочная грядка / NFT-канал. Реальные уклоны, сечения, пролёты и гидравлика задаются отдельным расчётом.',{length_m:L,width_m:W,levels:1,growing_surface_m2:L*W},meshes);
  const plants=[];const n=Math.max(4,Math.min(10,Math.floor(L/1.4)));
  for(let i=0;i<n;i++) plants.push(cyl(x-L*.42+L*.84*i/Math.max(1,n-1),.59,z,.16,.25,.16,i%2?COLORS.plant:COLORS.plant2));
  addObject(scene,`${id}-CROP`,`${name} · посадки`,'grow','Условные растения для визуальной плотности.',{visual_instances:n},plants);
}

function addTank(scene,id,name,x,z,H,litres=500,scaleFactor=1) {
  const radius=Math.min(.68,Math.max(.16,Math.sqrt(Math.max(1,litres)/1000)*.53));
  const h=Math.min(H*.52,Math.max(.55,1.2*scaleFactor));
  const meshes=[cyl(x,h/2+.18,z,radius*2,h,radius*2,COLORS.tank),cyl(x,h+.19,z,radius*2.04,.09,radius*2.04,COLORS.tankDark),box(x+radius*.8,h*.55+.18,z,radius*.18,.11,.11,COLORS.blueDark)];
  addObject(scene,id,name,'water','Цилиндрическая ёмкость, отображённая как компоновочный объект. Проверить полезный объём, свободный борт, материал, опоры и санитарное исполнение.',{nominal_volume_l:litres,visual_height_m:h,visual_diameter_m:radius*2,fluid:'TBD'},meshes);
}

function addWaterStation(scene, dims, product) {
  const {length:L,width:W,height:H}=dims;
  const scale=Math.max(.3,Math.min(1,Math.min(L,W)/4));
  const x=L*.34,z=-W*.34;
  addTank(scene,'GG-WATER-TANK','Бак воды / раствора',x,z,H,product.waterTankL||500,scale);
  const mixX=x-Math.min(.95,L*.18),mixZ=z+Math.min(.55,W*.14);
  addTank(scene,'GG-MIX-TANK','Смесительный бак',mixX,mixZ,H,Math.max(40,(product.waterTankL||500)*.35),scale*.72);
  const pumpX=x-Math.min(.8,L*.14),pumpZ=z+Math.min(1.35,W*.32);
  const pumpMeshes=[box(pumpX,.18+.32*scale,pumpZ,.9*scale,.55*scale,.55*scale,COLORS.blueDark),cyl(pumpX+.18*scale,.18+.62*scale,pumpZ,.28*scale,.24*scale,.28*scale,COLORS.steel),box(pumpX+.40*scale,.18+.60*scale,pumpZ,.42*scale,.12*scale,.12*scale,COLORS.blue)];
  addObject(scene,'GG-PUMP-SKID','Насосный узел','water','Условный насосный скимд с коллектором. Рабочая точка, напор, NPSH, резервирование и материал уплотнений не рассчитаны.',{rated_power_W:product.componentPowers?.pump??250,flow_rate_m3_h:null,head_m:null},pumpMeshes);
  const mixMeshes=[box(mixX,.16+.12*scale,mixZ+.42*scale,1.35*scale,.2*scale,.55*scale,COLORS.darkSteel),cyl(mixX-.16*scale,.16+.6*scale,mixZ+.42*scale,.18*scale,.9*scale,.18*scale,COLORS.amber),cyl(mixX+.22*scale,.16+.6*scale,mixZ+.42*scale,.18*scale,.9*scale,.18*scale,COLORS.blue)];
  addObject(scene,'GG-MIX-STATION','Смесительная станция','water','Дозирование и смешивание. Дозирующие насосы, датчики pH/EC и алгоритмы управления должны быть определены по процессу.',{process:'mixing and dosing',sensors:['pH','EC','temperature'],dosing_channels:null},mixMeshes);
  const pipeMeshes=[box(0,.35*scale,z+Math.min(1.1,W*.28),L*.72,.055*scale,.055*scale,COLORS.blue),box(pumpX,.35*scale,0,.055*scale,.055*scale,W*.68,COLORS.blue),box(mixX,.35*scale,mixZ,.055*scale,.055*scale,.8*scale,COLORS.blueDark)];
  addObject(scene,'GG-IRRIGATION-MAIN','Магистраль орошения','water','Схематическая подача/обратная линия. Диаметры, расходы, скорость, потери давления и баланс зон не рассчитаны.',{pipe_material:'TBD',diameter_mm:null,design_flow_m3_h:null},pipeMeshes);
}

function addClimate(scene,L,W,H) {
  const scale=Math.max(.3,Math.min(1,Math.min(L,W)/4));
  const x=-L*.35,z=W*.34;
  const meshes=[box(x,H*.78,z,1.35*scale,.65*scale,.75*scale,COLORS.climate),box(x-.15*scale,H*.78,z+.4*scale,.65*scale,.28*scale,.08*scale,COLORS.darkSteel),box(x+.8*scale,H*.78,z,.45*scale,.28*scale,.45*scale,COLORS.steel),box(x,H*.9,0,1.1*scale,.14*scale,.18*scale,COLORS.climate)];
  addObject(scene,'GG-HVAC-UNIT','Климатический блок / AHU','climate','Габаритный макет климатического блока и воздуховода. Холодопроизводительность, осушение и подбор вентиляторов не определены.',{cooling_capacity_kW:null,dehumidification_kg_h:null,airflow_m3_h:null,installed_power_W:null},meshes);
  const grille=[box(x-.55*scale,H*.65,z,1.1*scale,.06*scale,.06*scale,'#9eafbc'),box(x+.55*scale,H*.65,z,1.1*scale,.06*scale,.06*scale,'#9eafbc')];
  addObject(scene,'GG-AIR-DISTRIBUTION','Воздухораспределение','climate','Условная схема воздухораспределения; требуется аэродинамическая проверка и карта скоростей воздуха.',{design_airflow_m3_h:null,air_velocity_m_s:null},grille);
}

function addAutomation(scene,L,W,H,componentPowers={}) {
  const scale=Math.max(.3,Math.min(1,Math.min(L,W)/4));
  const x=-L*.36,z=-W*.32,base=.18;
  const meshes=[box(x,base+.88*scale,z,.72*scale,1.75*scale,.52*scale,COLORS.cabinet),box(x,base+.88*scale,z+.275*scale,.28*scale,.36*scale,.018*scale,'#284a3c'),box(x+.23*scale,base+.90*scale,z+.28*scale,.13*scale,.08*scale,.025*scale,COLORS.plant),box(x+.55*scale,base+.36*scale,z,.56*scale,.72*scale,.48*scale,COLORS.darkSteel)];
  addObject(scene,'GG-PLC-CABINET','Шкаф PLC / I/O','automation','Условный шкаф управления. В проекте потребуются однолинейная схема, защита, тепловой расчёт шкафа, I/O list и safety concept.',{plc:'TBD',remote_io:'TBD',power_W:componentPowers.controls??80,io_points:null,network:'Ethernet / RS-485 TBD'},meshes);
  const server=[box(x-1.1*scale,base+.85*scale,z,.48*scale,1.55*scale,.62*scale,'#4d6258'),box(x-1.1*scale,base+1.1*scale,z+.32*scale,.34*scale,.28*scale,.02*scale,'#92b7a7'),box(x-1.1*scale,base+.58*scale,z+.32*scale,.34*scale,.08*scale,.02*scale,COLORS.blue)];
  addObject(scene,'GG-EDGE-NODE','Edge / Server Node','automation','Локальный вычислительный узел для телеметрии, HMI/SCADA и журнала событий. Конкретная аппаратная платформа не выбрана.',{role:'edge gateway / local server',network:'LAN / VLAN / Mesh backhaul TBD'},server);
}

function addRackLayout(scene,product,state,origin=[0,0],prefix='GG-RACK') {
  const L=state.length,W=state.width,H=state.height,units=Math.max(0,Math.round(state.units)),levels=Math.max(1,Math.round(state.levels));
  if (!units) return;
  const isChamber=product.type==='chambers';
  if (isChamber) {
    let cols=product.chamberCols||Math.ceil(Math.sqrt(state.chambers));
    let rows=product.chamberRows||Math.ceil(state.chambers/cols);
    if (state.chambers !== product.chambers) { cols=Math.max(1,Math.min(state.chambers,Math.round(Math.sqrt(state.chambers*L/Math.max(W,.1))))); rows=Math.ceil(state.chambers/cols); }
    const cellL=L/cols,cellW=W/rows;
    const per=Math.max(1,Math.ceil(units/state.chambers));
    let n=0;
    for(let ch=0;ch<state.chambers && n<units;ch++){
      const c=ch%cols,r=Math.floor(ch/cols),cx=origin[0]-L/2+(c+.5)*cellL,cz=origin[1]-W/2+(r+.5)*cellW;
      for(let k=0;k<per && n<units;k++,n++){
        const offset=(k-(per-1)/2)*Math.min(.8,cellW*.22);
        const depth=Math.min(state.unitWidth,cellW*.22);
        const len=Math.max(.7,cellL*.68);
        addRack(scene,`${prefix}-${String(n+1).padStart(2,'0')}`,`Камера ${ch+1} · стеллаж ${k+1}`,cx,cz+offset,len,depth,H,levels,{baseY:.2});
      }
    }
    const parts=[];
    for(let c=1;c<cols;c++) parts.push(box(origin[0]-L/2+c*cellL,H*.36,origin[1],.10,H*.72,W,COLORS.wall));
    for(let r=1;r<rows;r++) parts.push(box(origin[0],H*.36,origin[1]-W/2+r*cellW,L,.10,H*.72,COLORS.wall));
    addObject(scene,'GG-CHAMBER-PARTITIONS','Межкамерные перегородки','structure','Схематические разделители камер; огнестойкость, пароизоляция, звукоизоляция и санитарные узлы не заданы.',{chambers:state.chambers,grid:`${cols} × ${rows}`},parts);
    return;
  }
  const rows=Math.min(2,units),cols=Math.ceil(units/rows),rackDepth=Math.min(state.unitWidth,Math.max(.28,W*.35));
  const len=Math.max(.65,Math.min(L*.82,(L/cols)*.82));
  let n=0;
  for(let r=0;r<rows;r++) for(let c=0;c<cols && n<units;c++,n++){
    const x=origin[0]-L/2+(c+.5)*L/cols;
    const z=rows===1?origin[1]:origin[1]-W*.24+r*(W*.48);
    addRack(scene,`${prefix}-${String(n+1).padStart(2,'0')}`,`Стеллаж ${n+1}`,x,z,len,rackDepth,H,levels,{baseY:.2});
  }
}

function addBedLayout(scene,state,origin=[0,0],prefix='GG-BED') {
  const count=Math.max(0,Math.round(state.units));if(!count)return;
  const W=state.width,L=state.length;
  const margin=Math.min(.65,W*.08);
  const gap=(W-2*margin)/count;
  const bedW=Math.min(state.unitWidth,Math.max(.35,gap*.72));
  for(let i=0;i<count;i++){
    const z=origin[1]-W/2+margin+gap*(i+.5);
    addBed(scene,`${prefix}-${String(i+1).padStart(2,'0')}`,`Грядка ${i+1}`,origin[0],z,L*.82,bedW);
  }
}

function addSingleContainer(scene,product,state,cx=0,cz=0,index=1) {
  const L=state.length,W=state.width,H=state.height;
  addBuildingFrame(scene,`GG-CONTAINER-${index}`,`Контейнер ${index}`,cx,cz,L,W,H,{container:true,floorColor:'#58686b'});
  const localProduct={...product,type:'racks'};
  addRackLayout(scene,localProduct,{...state,length:L,width:W,height:H,units:Math.min(state.units,2),levels:state.levels,unitWidth:Math.min(state.unitWidth,W*.24)},[cx,cz],`GG-CON-${index}-RACK`);
}

function buildCampus(scene,product,state) {
  const L=state.length,W=state.width,H=state.height;
  addObject(scene,'GG-CAMPUS-PLATFORM','Территория производственного кампуса','structure','Условная площадка комплекса. Генплан, отметки рельефа, водоотвод, пожарные проезды и санитарные разрывы не рассчитаны.',{site_length_m:L,site_width_m:W,site_area_m2:L*W},[box(0,-.24,0,L,.18,W,'#46564a')]);
  const roads=[box(0,-.13,0,L*.9,.05,3.4,COLORS.road),box(-8,-.12,0,3.1,.05,W*.82,COLORS.road),box(20,-.12,0,3.1,.05,W*.82,COLORS.road)];
  addObject(scene,'GG-CAMPUS-ROADS','Проезды и технологические коридоры','logistics','Схема движения и сервисных коридоров; проверка радиусов разворота и требований пожарного доступа не выполнена.',{road_width_m:3.1},roads);

  const zones=[
    {id:'NURSERY',name:'Nursery / клонарник',x:-25,z:-15,l:12,w:8,h:3.4,kind:'racks'},
    {id:'LAB',name:'Лаборатория',x:-9,z:-15,l:8,w:7,h:3.4,kind:'lab'},
    {id:'ENGINEERING',name:'Engineering / PLC / Server',x:3,z:-17,l:8,w:6,h:3.2,kind:'server'},
    {id:'GROW-HALL',name:'Grow Hall / камеры',x:16,z:-6,l:18,w:12,h:4.2,kind:'racks'},
    {id:'WAREHOUSE',name:'Склад и упаковка',x:29,z:-17,l:12,w:9,h:4,kind:'warehouse'},
    {id:'SEED-BANK',name:'Seed Bank',x:-29,z:1,l:6,w:5,h:3,kind:'seed'},
    {id:'WATER',name:'Water Treatment',x:-19,z:14,l:9,w:8,h:3.4,kind:'water'},
    {id:'MIXING',name:'Mixing Station',x:-6,z:14,l:8,w:6,h:3.2,kind:'mix'},
    {id:'GREENHOUSE',name:'Теплица / vegetarium',x:17,z:15,l:22,w:10,h:5,kind:'greenhouse'},
    {id:'HARVEST',name:'Harvest / Processing',x:30,z:2,l:9,w:7,h:3.6,kind:'warehouse'}
  ];
  for(const z of zones){
    addBuildingFrame(scene,`GG-ZONE-${z.id}`,z.name,z.x,z.z,z.l,z.w,z.h,{greenhouse:z.kind==='greenhouse'});
    if(z.kind==='racks'){
      const sub={...product,type:'racks'};
      const local={length:z.l,width:z.w,height:z.h,units:z.id==='NURSERY'?4:8,levels:3,unitWidth:.62};
      addRackLayout(scene,sub,local,[z.x,z.z],`GG-${z.id}-RACK`);
    }
    if(z.kind==='lab'){
      const lm=[box(z.x,z.h*.20,z.z,5.6,.18,.85,COLORS.white),box(z.x,z.h*.08,z.z,5.2,.55,.62,COLORS.steel),box(z.x-1,z.h*.43,z.z,1.1,.5,.48,COLORS.blueDark),cyl(z.x+.6,z.h*.43,z.z,.22,.55,.22,'#c1d9d0'),cyl(z.x+1.4,z.h*.43,z.z,.20,.55,.20,'#80a9c0')];
      addObject(scene,'GG-LAB-BENCH','Лабораторный стол и приборы','laboratory','Схематическая лабораторная рабочая станция. Перечень анализов, вытяжка, водоподготовка и требования биобезопасности задаются отдельно.',{bench_length_m:5.6,utilities:'water / power / data TBD'},lm);
    }
    if(z.kind==='server'){
      const sm=[];for(let i=0;i<3;i++) sm.push(box(z.x-2+i*1.6,1.15,z.z,.72,2.3,.72,i===1?COLORS.blueDark:COLORS.darkSteel));
      addObject(scene,'GG-CAMPUS-SERVER','Серверные стойки и Edge Nodes','automation','Макеты серверных стоек; тепловая нагрузка, UPS, сеть, кибербезопасность и резервирование не рассчитаны.',{rack_count:3,ups:'TBD',network:'segmented OT/IT TBD'},sm);
    }
    if(z.kind==='warehouse'){
      const wm=[];for(let r=0;r<3;r++)for(let s=0;s<3;s++){
        const xx=z.x-3+r*3;const zz=z.z-2+s*2;
        wm.push(box(xx,1.2,zz,.08,2.4,.08,COLORS.amber),box(xx,2.0,zz,2.6,.08,.7,COLORS.amber),box(xx,.8,zz,2.6,.08,.7,COLORS.amber));
      }
      addObject(scene,`GG-${z.id}-RACKS`,`${z.name} · складские стеллажи`,'logistics','Схематические стеллажи и места хранения. Нагрузки на пол, пожарные проходы и логистика паллет не рассчитаны.',{rack_bays:9},wm);
    }
    if(z.kind==='seed'){
      const bm=[];for(let i=0;i<3;i++){bm.push(box(z.x-1.6+i*1.6,1.2,z.z,.9,2.4,1.0,COLORS.seed));bm.push(box(z.x-1.6+i*1.6,1.25,z.z+.53,.65,.18,.04,COLORS.white));}
      addObject(scene,'GG-SEED-BANK','Шкафы Seed Bank','laboratory','Визуальная компоновка хранения семян. Температурные/влажностные режимы, герметичность, инвентаризация и резервирование не определены.',{storage_policy:'TBD',climate_control:'required to specify'},bm);
    }
    if(z.kind==='water'){
      const oldL=state.length,oldW=state.width,oldH=state.height;
      addTank(scene,'GG-CAMPUS-WATER-TANK','Резервуары водоподготовки',z.x-1,z.z-1, z.h,6000,1.2);
      addTank(scene,'GG-CAMPUS-RO-TANK','Технологический бак',z.x+1.7,z.z+1,z.h,2000,.8);
    }
    if(z.kind==='mix'){
      const mm=[cyl(z.x-1,1.0,z.z,.7,1.7,.7,COLORS.amber),cyl(z.x+1,1.0,z.z,.7,1.7,.7,COLORS.blue),box(z.x,1.4,z.z+1.5,2.7,.18,.65,COLORS.darkSteel),box(z.x, .5,z.z+1.5,2.3,.8,.48,COLORS.blueDark)];
      addObject(scene,'GG-CAMPUS-MIXING','Дозирование и смешивание растворов','water','Модель технологической зоны дозирования. Рабочие объёмы, химическая совместимость, локализация проливов и автоматика требуют отдельной проработки.',{channels:null,pH_EC:'online sensors TBD'},mm);
    }
    if(z.kind==='greenhouse'){
      const bedState={length:z.l,width:z.w,units:7,unitWidth:.85};addBedLayout(scene,bedState,[z.x,z.z], 'GG-GH-BED');
    }
  }
  const siteServices=[box(4,.26,13,4,.52,1.4,COLORS.climate),box(4,.65,13,2.8,.24,.8,COLORS.blueDark)];
  addObject(scene,'GG-CAMPUS-UTILITIES','Utility backbone / инженерный узел','automation','Сводная зона инженерных коммуникаций и автоматики. Фактические трассы, мощности и резервирование отсутствуют.',{services:['power','water','air','data'],network_topology:'TBD'},siteServices);
}

export function buildScene(product,state) {
  const scene={objects:[],productId:product.id,createdAt:new Date().toISOString()};
  if(product.type==='campus'){
    buildCampus(scene,product,state);addGrid(scene,48,4);return scene;
  }
  const L=state.length,W=state.width,H=state.height;
  if(product.type==='containerHub'){
    const length=12.19,width=2.44,height=Math.min(H,2.9),count=Math.max(1,Math.min(50,Math.round(state.chambers))),cols=Math.min(5,count),rows=Math.ceil(count/cols);
    const gapX=Math.max(.05,(L-cols*length)/Math.max(1,cols-1));
    const actualGroupL=cols*length+(cols-1)*gapX;
    const unitsPerContainer=Math.max(1,Math.round(state.units/count));
    let index=0;
    for(let row=0;row<rows;row++)for(let col=0;col<cols && index<count;col++,index++){
      const cx=-actualGroupL/2+length/2+col*(length+gapX);
      const cz=rows===1?0:-W/2+width/2+row*(W-width)/Math.max(1,rows-1);
      addSingleContainer(scene,product,{...state,length,width,height,units:unitsPerContainer,levels:state.levels,unitWidth:.42},cx,cz,index+1);
    }
    const padW=W,padL=L;
    addObject(scene,'GG-HUB-SERVICE-AISLE','Сервисный проход контейнерного хаба','logistics','Компоновочный проход между линиями контейнеров.',{container_count:count,clear_width_m:Math.max(0,W-rows*width)},[box(0,-.02,0,padL,.06,padW,'#4e6053')]);
    addWaterStation(scene,{length:padL,width:padW,height},product);addClimate(scene,padL,padW,height);addAutomation(scene,padL,padW,height,product.componentPowers);
    addGrid(scene,Math.max(40,Math.ceil(Math.max(L,W)*.8)),4);return scene;
  }
  if(product.type==='container'){
    addSingleContainer(scene,product,state,0,0,1);
  } else {
    addBuildingFrame(scene,`GG-SHELL-${product.id}`,`${product.short} · оболочка`,0,0,L,W,H,{greenhouse:product.type==='greenhouse'});
    if(product.type==='beds'||product.type==='greenhouse') addBedLayout(scene,state,[0,0]);
    else addRackLayout(scene,product,state,[0,0]);
  }
  if(product.type==='chambers'){
    // The chamber partitions are generated with the growing layout.
  }
  addWaterStation(scene,{length:L,width:W,height:H},product);
  addClimate(scene,L,W,H);
  addAutomation(scene,L,W,H,product.componentPowers);
  addGrid(scene,Math.max(20,Math.ceil(Math.max(L,W)*1.5)),2);
  return scene;
}

export function getCalculationMetrics(product,state) {
  const L=Number(state.length),W=Number(state.width),H=Number(state.height);
  let floorArea=L*W,grossVolume=floorArea*H;
  if(product.type==='containerHub') { floorArea=Math.max(1,Number(state.chambers))*12.19*2.44; grossVolume=floorArea*Math.min(H,2.9); }
  if(product.type==='campus') {
    const zones=[[12,8,3.4],[8,7,3.4],[8,6,3.2],[18,12,4.2],[12,9,4],[6,5,3],[9,8,3.4],[8,6,3.2],[22,10,5],[9,7,3.6]];
    floorArea=zones.reduce((a,z)=>a+z[0]*z[1],0);grossVolume=zones.reduce((a,z)=>a+z[0]*z[1]*z[2],0);
  }
  let growArea=0;
  if(product.type==='beds'||product.type==='greenhouse') {
    const count=Math.max(0,Number(state.units)),margin=Math.min(.65,W*.08),gap=(W-2*margin)/Math.max(1,count);
    const bedWidth=Math.min(Number(state.unitWidth),Math.max(0,gap*.72));
    growArea=count*L*.82*bedWidth;
  }
  else if(product.type==='chambers'){
    let cols=product.chamberCols||Math.ceil(Math.sqrt(state.chambers));
    let rows=product.chamberRows||Math.ceil(state.chambers/cols);
    if (state.chambers !== product.chambers) { cols=Math.max(1,Math.min(state.chambers,Math.round(Math.sqrt(state.chambers*L/Math.max(W,.1))))); rows=Math.ceil(state.chambers/cols); }
    const cellLength=L/cols,cellWidth=W/rows;
    growArea=Math.max(0,Number(state.units))*cellLength*.68*Math.min(Number(state.unitWidth),cellWidth*.22)*Math.max(1,Number(state.levels));
  } else if(product.type==='containerHub'){
    const moduleLength=12.19,containerCount=Math.max(1,Number(state.chambers)),perContainer=Math.max(1,Math.round(Number(state.units)/containerCount));
    growArea=containerCount*perContainer*(moduleLength*.82*.42*Math.max(1,Number(state.levels))); 
  } else if(product.type==='campus') {
    // Fixed concept campus zones: 4 nursery racks + 8 grow-hall racks + 7 greenhouse beds.
    const nursery=4*(12/2*.82)*.62*3;
    const growHall=8*(18/4*.82)*.62*3;
    const ghMargin=Math.min(.65,10*.08),ghGap=(10-2*ghMargin)/7,ghBedWidth=Math.min(.85,ghGap*.72);
    const greenhouse=7*22*.82*ghBedWidth;
    growArea=nursery+growHall+greenhouse;
  } else {
    const units=Math.max(0,Number(state.units)),rows=Math.min(2,Math.max(1,units)),cols=Math.ceil(units/rows);
    const unitLength=Math.max(.65,Math.min(L*.82,(L/cols)*.82));
    const depth=Math.min(Number(state.unitWidth),Math.max(.28,W*.35));
    growArea=units*unitLength*depth*Math.max(1,Number(state.levels));
  }
  const ppfd=Math.max(0,Number(state.ppfd)),ppe=Math.max(.1,Number(state.ppe)),hours=Math.max(0,Number(state.photoperiod)),ach=Math.max(0,Number(state.ach));
  const ledPowerW=growArea*ppfd/ppe;
  const ledEnergyKwh=ledPowerW/1000*hours;
  const airflowM3h=grossVolume*ach;
  const knownAux=Object.values(product.componentPowers||{}).reduce((sum,v)=>sum+Number(v||0),0);
  return {floorArea,grossVolume,growArea,ledPowerW,ledEnergyKwh,airflowM3h,knownAuxPowerW:knownAux,estimatedKnownLoadW:ledPowerW+knownAux};
}

function fmt(n,d=2){return Number(n).toFixed(d);}
export function createProductReport(product,state) {
  const metrics=getCalculationMetrics(product,state);
  return {
    schema_version:'0.1.0',generated_at:new Date().toISOString(),status:'PRELIMINARY_CONCEPT',
    product:{id:product.id,code:product.code,name:product.name,family:product.category},
    geometry:{length_m:+state.length,width_m:+state.width,height_m:+state.height,site_envelope_area_m2:+fmt(Number(state.length)*Number(state.width),3),floor_area_m2:+fmt(metrics.floorArea,3),gross_volume_m3:+fmt(metrics.grossVolume,3)},
    configuration:{chambers:+state.chambers,growing_units:+state.units,levels:+state.levels,unit_width_m:+state.unitWidth,estimated_growing_surface_m2:+fmt(metrics.growArea,3)},
    assumptions:{ppfd_umol_m2_s:+state.ppfd,ppe_umol_J:+state.ppe,photoperiod_h_day:+state.photoperiod,air_changes_per_hour:+state.ach},
    estimates:{led_electrical_power_kW:+fmt(metrics.ledPowerW/1000,3),led_energy_kWh_day:+fmt(metrics.ledEnergyKwh,3),airflow_m3_h:+fmt(metrics.airflowM3h,2),known_auxiliary_nameplate_W:metrics.knownAuxPowerW,known_load_estimate_kW:+fmt(metrics.estimatedKnownLoadW/1000,3)},
    uncalculated:['HVAC cooling/heating capacity','dehumidification capacity','crop transpiration and water balance','pipe diameter / head loss / pump duty point','electrical protection, cable sizing and phase balance','structural loads and foundations','fire safety, egress and code compliance'],
    notes:['Geometry is a concept model, not a construction drawing.','Equipment ratings are placeholders until vendor datasheets and design conditions are entered.','Lighting power is an idealized estimate from growing surface × target PPFD ÷ PPE.','Airflow is gross volume × ACH; ACH must be justified by process and climate design.']
  };
}

export function exportSceneOBJ(scene) {
  let vertexOffset=1;
  const lines=['# Golden Greens Spatial Product System — generated OBJ','mtllib golden-greens-materials.mtl'];
  const materials=new Map();
  const transformVertex=(mesh,local)=>{
    const [cx,cy,cz]=mesh.position,[sx,sy,sz]=mesh.scale,[rx,ry,rz]=mesh.rotation||[0,0,0];
    let x=local[0]*sx,y=local[1]*sy,z=local[2]*sz;
    let yy=Math.cos(rx)*y-Math.sin(rx)*z,zz=Math.sin(rx)*y+Math.cos(rx)*z;y=yy;z=zz;
    let xx=Math.cos(ry)*x+Math.sin(ry)*z;zz=-Math.sin(ry)*x+Math.cos(ry)*z;x=xx;z=zz;
    xx=Math.cos(rz)*x-Math.sin(rz)*y;yy=Math.sin(rz)*x+Math.cos(rz)*y;x=xx;y=yy;
    return [cx+x,cy+y,cz+z];
  };
  const addCube=(mesh)=>{
    const verts=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]].map(p=>transformVertex(mesh,p));
    const faces=[[1,2,3,4],[5,8,7,6],[1,5,6,2],[4,3,7,8],[1,4,8,5],[2,6,7,3]];
    return {verts,faces};
  };
  const addCylinder=(mesh)=>{
    const [sx,sy,sz]=mesh.scale;const verts=[];const faces=[];const n=24;
    for(let i=0;i<n;i++){const a=2*Math.PI*i/n;verts.push(transformVertex(mesh,[Math.sin(a)*.5,-.5,Math.cos(a)*.5]));}
    for(let i=0;i<n;i++){const a=2*Math.PI*i/n;verts.push(transformVertex(mesh,[Math.sin(a)*.5,.5,Math.cos(a)*.5]));}
    const bottom=verts.push(transformVertex(mesh,[0,-.5,0]))-1,top=verts.push(transformVertex(mesh,[0,.5,0]))-1;
    for(let i=0;i<n;i++){const j=(i+1)%n;faces.push([i,j,n+j,n+i]);faces.push([bottom,j,i]);faces.push([top,n+i,n+j]);}
    return {verts,faces};
  };
  for(const object of scene.objects){
    if(object.group==='grid') continue;
    lines.push(`\ng ${sanitize(object.id)}_${sanitize(object.name)}`);
    for(const mesh of object.meshes){
      const color=mesh.color||'#ffffff';const material=`mat_${sanitize(color)}`;materials.set(material,color);lines.push(`usemtl ${material}`);
      const geo=mesh.shape==='cylinder'?addCylinder(mesh):addCube(mesh);
      for(const v of geo.verts) lines.push(`v ${v.map(n=>Number(n).toFixed(5)).join(' ')}`);
      for(const f of geo.faces) lines.push(`f ${f.map(i=>i+vertexOffset).join(' ')}`);
      vertexOffset+=geo.verts.length;
    }
  }
  const mtl=['# Golden Greens material palette'];
  for(const [name,hex] of materials){const n=parseInt(hex.replace('#',''),16);mtl.push(`newmtl ${name}`,`Kd ${((n>>16)&255)/255} ${((n>>8)&255)/255} ${(n&255)/255}`,'Ka 0.18 0.18 0.18','d 1','');}
  return {obj:lines.join('\n'),mtl:mtl.join('\n')};
}

function sanitize(value){return String(value).normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,60)||'object';}
