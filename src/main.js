import { LANG, t } from './i18n.js';
const { PRODUCTS, GROUPS, createInitialState } = LANG === 'es' ? await import('./catalog.es.js') : await import('./catalog.js');
import { buildScene, getCalculationMetrics, createProductReport, exportSceneOBJ } from './scene.js';
import { createRenderer, projectPoint } from './gl.js';

const $ = (id) => document.getElementById(id);
const canvas = $('sceneCanvas');
const state = { product: PRODUCTS.find(p => p.id === 'growroom'), values: null, scene: null, renderer: null, camera: null, selectedId: null, visibleGroups: {}, showGrid: true, dragging: false, moved: false, pointer: null, lastFrame: null };
state.values = createInitialState(state.product);
for (const group of GROUPS) state.visibleGroups[group.id] = true;

function safeNumber(id, fallback) {
  const value = Number($(id).value);
  return Number.isFinite(value) ? value : fallback;
}
function clamp(n,min,max){return Math.min(max,Math.max(min,n));}
function format(n,d=2){return Number(n||0).toLocaleString(LANG === 'es' ? 'es-ES' : 'ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d});}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function setInputs() {
  const v=state.values;
  $('lengthInput').value=v.length;$('widthInput').value=v.width;$('heightInput').value=v.height;
  $('chambersInput').value=v.chambers;$('unitsInput').value=v.units;$('levelsInput').value=v.levels;$('unitWidthInput').value=v.unitWidth;
  $('ppfdInput').value=v.ppfd;$('ppeInput').value=v.ppe;$('photoperiodInput').value=v.photoperiod;$('achInput').value=v.ach;
}

function renderCatalog(filter='') {
  const root=$('productList');root.innerHTML='';
  const query=filter.trim().toLowerCase();
  const list=PRODUCTS.filter(p=>[p.name,p.short,p.category,p.description,p.code].join(' ').toLowerCase().includes(query));
  for(const product of list){
    const button=document.createElement('button');button.type='button';button.className='product-card'+(product.id===state.product.id?' selected':'');
    button.innerHTML=`<span class="product-icon">${escapeHTML(product.icon)}</span><span><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.category)} · ${format(product.dimensions.length,1)} × ${format(product.dimensions.width,1)} × ${format(product.dimensions.height,1)} м</small></span><span class="product-chevron">›</span>`;
    button.addEventListener('click',()=>selectProduct(product.id));root.appendChild(button);
  }
  $('productCount').textContent=String(PRODUCTS.length).padStart(2,'0');
  if(!list.length)root.innerHTML=`<div class="form-note" style="padding:12px">${t('Совпадений нет.')}</div>`;
}

function renderLayerControls() {
  const root=$('layerControls');root.innerHTML='';
  for(const group of GROUPS){
    const label=document.createElement('label');label.className='layer-chip';
    const input=document.createElement('input');input.type='checkbox';input.checked=state.visibleGroups[group.id];input.addEventListener('change',()=>{state.visibleGroups[group.id]=input.checked;draw();});
    const text=document.createElement('span');text.textContent=group.label;
    label.append(input,text);root.appendChild(label);
  }
}

function selectProduct(id) {
  const product=PRODUCTS.find(p=>p.id===id);if(!product)return;
  state.product=product;state.values=createInitialState(product);state.selectedId=null;
  $('viewportTitle').textContent=product.name;$('viewportSubtitle').textContent=product.description;
  $('modeTag').textContent=product.type==='campus'?(LANG === 'es' ? 'VISTA DEL CAMPUS' : 'CAMPUS OVERVIEW'):(LANG === 'es' ? 'MODELO DE PRODUCTO' : 'PRODUCT MODEL');
  setInputs();renderCatalog($('catalogSearch').value);buildCurrentScene();fitCamera();
  updateSelectedBar(null);updateMetrics();renderObjectInspector(null);
}

function buildCurrentScene() {
  state.scene=buildScene(state.product,state.values);
  const count=state.scene.objects.filter(o=>o.group!=='grid').length;
  $('objectCountChip').textContent=`${count} ${LANG === 'es' ? 'OBJETOS' : 'OBJECTS'}`;
  state.selectedId=null;
  draw();
}

function fitCamera() {
  const v=state.values;
  const campus=state.product.type==='campus';
  const max=Math.max(v.length,v.width,v.height,4);
  state.camera={yaw:.82,pitch:.62,radius:campus?Math.max(v.length,v.width)*1.65:max*2.15,target:campus?[0,.1,0]:[0,Math.min(v.height*.38,2),0]};
  draw();
}

function cameraEye() {
  const c=state.camera,cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);
  return [c.target[0]+c.radius*cp*Math.sin(c.yaw),c.target[1]+c.radius*sp,c.target[2]+c.radius*cp*Math.cos(c.yaw)];
}

function draw() {
  if(!state.renderer||!state.scene||!state.camera)return;
  const result=state.renderer.render(state.scene,{eye:cameraEye(),target:state.camera.target},state.visibleGroups,state.selectedId,state.showGrid);
  state.lastFrame=result;
}

function updateMetrics() {
  const p=state.product,v=state.values,r=getCalculationMetrics(p,v);
  $('floorAreaLabel').textContent=p.type==='campus'?t('Суммарная площадь зданий'):p.type==='containerHub'?t('Площадь контейнеров'):t('Площадь пола');
  $('grossVolumeLabel').textContent=p.type==='campus'?t('Суммарный объём зданий'):p.type==='containerHub'?t('Объём контейнеров'):t('Валовый объём');
  $('floorAreaMetric').textContent=format(r.floorArea,1);
  $('grossVolumeMetric').textContent=format(r.grossVolume,1);
  $('growAreaMetric').textContent=format(r.growArea,1);
  $('ledPowerMetric').textContent=format(r.ledPowerW/1000,2);
  $('airflowMetric').textContent=format(r.airflowM3h,0);
  $('energyMetric').textContent=format(r.ledEnergyKwh,1);
  $('knownLoadMetric').textContent=format(r.estimatedKnownLoadW/1000,2);
  const warnings=[];
  if(p.type==='containerHub'){
    const count=Math.max(1,Math.round(v.chambers)),rows=Math.ceil(count/5),cols=Math.min(5,count),minL=cols*12.19+Math.max(0,cols-1)*.05,minW=rows*2.44+Math.max(0,rows-1)*.8;
    if(v.length<minL)warnings.push(`${t('Длина площадки меньше компоновочного минимума')}: ${format(minL,2)} m.`);
    if(v.width<minW)warnings.push(`${t('Ширина площадки меньше ориентировочного минимума')}: ${format(minW,2)} m.`);
  }
  if(p.type==='campus'&&(v.length<72||v.width<52))warnings.push(t('Зоны кампуса пока расположены по фиксированному демонстрационному генплану и могут выйти за заданную границу участка.'));
  if(p.type==='chambers'&&v.length/Math.max(1,p.chamberCols||1)<2.5)warnings.push(t('Проверь полезную длину секции и сервисные проходы камер.'));
  const base=t('LED — идеализированная оценка PPFD/PPE; воздух — валовый объём × ACH. Не рассчитаны HVAC, осушение, влаговыделение, гидравлика, кабели, защита и конструкции.');
  $('calcStatus').textContent=(warnings.length?(LANG === 'es' ? 'Verificar: ' : 'Проверить: ')+warnings.join(' '):(t('Предварительная оценка.')+' ')+base);
}

function updateSelectedBar(object) {
  $('selectedObjectName').textContent=object?t(object.name):state.product.name;
  $('selectedObjectId').textContent=object?object.id:state.product.code;
}

function renderObjectInspector(object) {
  const root=$('objectInspector');
  if(!object){root.innerHTML=`<span class="eyebrow">${LANG === 'es' ? 'PERFIL DEL OBJETO' : 'OBJECT PROFILE'}</span><strong>${t('Выбери компонент в 3D-сцене')}</strong><p>${t('Нажми на объект. Здесь появятся назначение, габариты и инженерные свойства выбранного элемента.')}</p>`;return;}
  const entries=Object.entries(object.spec||{}).slice(0,10);
  const detail=entries.map(([k,v])=>`<div><dt>${escapeHTML(k.replaceAll('_',' '))}</dt><dd>${escapeHTML(typeof v==='object'?JSON.stringify(v):String(v))}</dd></div>`).join('');
  root.innerHTML=`<span class="eyebrow">${escapeHTML(t(object.group).toUpperCase())} · ${escapeHTML(object.id)}</span><strong>${escapeHTML(t(object.name))}</strong><p>${escapeHTML(t(object.description||''))}</p>${detail?`<dl>${detail}</dl>`:''}`;
}

function pickObject(clientX,clientY) {
  if(!state.lastFrame||!state.scene)return null;
  const rect=canvas.getBoundingClientRect();
  const px=(clientX-rect.left)*(canvas.width/rect.width),py=(clientY-rect.top)*(canvas.height/rect.height);
  let best=null,bestDistance=Infinity;
  for(const object of state.scene.objects){
    if(object.group==='grid'||state.visibleGroups[object.group]===false)continue;
    const p=projectPoint(object.center,state.lastFrame.viewProjection,state.lastFrame.width,state.lastFrame.height);if(!p)continue;
    const dist=Math.hypot(p.x-px,p.y-py);
    const maxDim=Math.max(...object.size);
    const tolerance=clamp(maxDim*canvas.height/(state.camera.radius*2.2),16,66);
    if(dist<tolerance&&dist<bestDistance){best=object;bestDistance=dist;}
  }
  return best;
}

function handleInputChange() {
  const old=state.values;
  state.values={
    length:clamp(safeNumber('lengthInput',old.length),.5,200),width:clamp(safeNumber('widthInput',old.width),.5,200),height:clamp(safeNumber('heightInput',old.height),1,30),
    chambers:clamp(Math.round(safeNumber('chambersInput',old.chambers)),1,100),units:clamp(Math.round(safeNumber('unitsInput',old.units)),0,200),levels:clamp(Math.round(safeNumber('levelsInput',old.levels)),1,12),unitWidth:clamp(safeNumber('unitWidthInput',old.unitWidth),.2,3),
    ppfd:clamp(safeNumber('ppfdInput',old.ppfd),0,1500),ppe:clamp(safeNumber('ppeInput',old.ppe),.1,5),photoperiod:clamp(safeNumber('photoperiodInput',old.photoperiod),0,24),ach:clamp(safeNumber('achInput',old.ach),0,60)
  };
  setInputs();buildCurrentScene();updateMetrics();
}

function downloadBlob(filename,content,type='text/plain;charset=utf-8') {
  const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function exportJSON(){
  const report=createProductReport(state.product,state.values);report.product_id=state.product.id;report.parameters={...state.values};report.components=state.scene.objects.filter(o=>o.group!=='grid').map(o=>({id:o.id,name:o.name,group:o.group,spec:o.spec}));
  downloadBlob(`${state.product.id}-engineering-passport.json`,JSON.stringify(report,null,2),'application/json;charset=utf-8');
}
function exportOBJ(){
  const files=exportSceneOBJ(state.scene);downloadBlob(`${state.product.id}-model.obj`,files.obj,'text/plain;charset=utf-8');
  setTimeout(()=>downloadBlob('golden-greens-materials.mtl',files.mtl,'text/plain;charset=utf-8'),350);
}
async function importJSON(file) {
  if(!file)return;
  if(file.size>2*1024*1024){$('calcStatus').textContent=t('Импорт отклонён: JSON-файл больше 2 MiB.');return;}
  try {
    const parsed=JSON.parse(await file.text());
    const productId=parsed.product_id||parsed.product?.id;
    const product=PRODUCTS.find(p=>p.id===productId);
    if(!product)throw new Error(t('Неизвестный product_id в конфигурации.'));
    selectProduct(product.id);
    const p=parsed.parameters||{};
    const geometry=parsed.geometry||{};
    const configuration=parsed.configuration||{};
    const assumptions=parsed.assumptions||{};
    const imported={
      length:p.length??geometry.length_m,width:p.width??geometry.width_m,height:p.height??geometry.height_m,
      chambers:p.chambers??configuration.chambers,units:p.units??configuration.growing_units,levels:p.levels??configuration.levels,unitWidth:p.unitWidth??configuration.unit_width_m,
      ppfd:p.ppfd??assumptions.ppfd_umol_m2_s,ppe:p.ppe??assumptions.ppe_umol_J,photoperiod:p.photoperiod??assumptions.photoperiod_h_day,ach:p.ach??assumptions.air_changes_per_hour
    };
    for(const [key,value] of Object.entries(imported))if(value!==undefined&&value!==null&&Number.isFinite(Number(value)))state.values[key]=Number(value);
    state.values.length=clamp(state.values.length,.5,200);state.values.width=clamp(state.values.width,.5,200);state.values.height=clamp(state.values.height,1,30);
    state.values.chambers=clamp(Math.round(state.values.chambers),1,100);state.values.units=clamp(Math.round(state.values.units),0,200);state.values.levels=clamp(Math.round(state.values.levels),1,12);
    state.values.unitWidth=clamp(state.values.unitWidth,.2,3);state.values.ppfd=clamp(state.values.ppfd,0,1500);state.values.ppe=clamp(state.values.ppe,.1,5);
    state.values.photoperiod=clamp(state.values.photoperiod,0,24);state.values.ach=clamp(state.values.ach,0,60);
    setInputs();buildCurrentScene();fitCamera();updateMetrics();
    $('calcStatus').textContent=LANG === 'es' ? `Configuración ${product.code} importada. Comprueba los valores de entrada y las hipótesis.` : `Импортирована конфигурация ${product.code}. Проверь входные значения и статус допущений.`;
  } catch(error) {
    $('calcStatus').textContent=`${t('Ошибка импорта:')} ${error.message}`;
  }
}

function exportBOM(){
  const v=state.values,met=getCalculationMetrics(state.product,v),p=state.product;
  const rows=[['item_id','item','quantity','unit','power_W','status'],
    ['SHELL-001','Оболочка / каркас',1,'комплект','', 'геометрия концептуальная'],
    ['GROW-001','Стеллажи / грядки',v.units,'шт.','', 'параметрическая конфигурация'],
    ['LED-EST','LED установленная мощность (оценка)',format(met.ledPowerW,1),'W',format(met.ledPowerW,1),'оценка PPFD/PPE'],
    ['WATER-001','Бак воды / раствора',1,'шт.','',`номинал ${p.waterTankL||0} л — placeholder`],
    ['PUMP-001','Насосная группа',1,'комплект',p.componentPowers?.pump||0,'требуется рабочая точка'],
    ['FAN-001','Циркуляция / вентиляторы',1,'комплект',p.componentPowers?.circulation||0,'условная установленная мощность'],
    ['CTRL-001','Управление / PLC / I/O',1,'комплект',p.componentPowers?.controls||0,'архитектурный placeholder'],
    ['HVAC-TBD','HVAC / осушение',1,'комплект','','не рассчитано'],
    ['PIPE-TBD','Трубопроводы / арматура',1,'комплект','','не рассчитано']
  ];
  const csv=rows.map(row=>row.map(cell=>`"${String(cell).replaceAll('"','""')}"`).join(';')).join('\r\n');
  downloadBlob(`${p.id}-bom.csv`,'\uFEFF'+csv,'text/csv;charset=utf-8');
}

function initEvents() {
  $('catalogSearch').addEventListener('input',e=>renderCatalog(e.target.value));
  for(const id of ['lengthInput','widthInput','heightInput','chambersInput','unitsInput','levelsInput','unitWidthInput','ppfdInput','ppeInput','photoperiodInput','achInput']){
    $(id).addEventListener('change',handleInputChange);$(id).addEventListener('keydown',e=>{if(e.key==='Enter'){e.target.blur();handleInputChange();}});
  }
  $('exportJsonButton').addEventListener('click',exportJSON);$('exportObjButton').addEventListener('click',exportOBJ);$('exportBomButton').addEventListener('click',exportBOM);
  $('importJsonButton').addEventListener('click',()=>$('importJsonInput').click());
  $('importJsonInput').addEventListener('change',e=>{const file=e.target.files?.[0];importJSON(file);e.target.value='';});
  $('campusButton').addEventListener('click',()=>selectProduct('turnkeyHub'));
  $('homeViewButton').addEventListener('click',fitCamera);$('resetCameraButton').addEventListener('click',fitCamera);
  $('roofToggleButton').addEventListener('click',()=>{state.visibleGroups.structure=!state.visibleGroups.structure;const b=$('roofToggleButton');b.classList.toggle('active',state.visibleGroups.structure);b.setAttribute('aria-pressed',String(state.visibleGroups.structure));renderLayerControls();draw();});
  $('labelsToggleButton').addEventListener('click',()=>{state.showGrid=!state.showGrid;const b=$('labelsToggleButton');b.classList.toggle('active',state.showGrid);b.setAttribute('aria-pressed',String(state.showGrid));draw();});

  canvas.addEventListener('pointerdown',e=>{state.dragging=true;state.moved=false;state.pointer={x:e.clientX,y:e.clientY,button:e.button,shift:e.shiftKey};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{
    if(!state.dragging||!state.pointer)return;
    const dx=e.clientX-state.pointer.x,dy=e.clientY-state.pointer.y;
    if(Math.abs(dx)+Math.abs(dy)>2)state.moved=true;
    if(state.pointer.button===2||state.pointer.shift){
      const scale=state.camera.radius*.0016;const right=[Math.cos(state.camera.yaw),0,-Math.sin(state.camera.yaw)];
      state.camera.target[0]-=dx*scale*right[0];state.camera.target[2]-=dx*scale*right[2];state.camera.target[1]+=dy*scale;
    }else{
      state.camera.yaw-=dx*.008;state.camera.pitch=clamp(state.camera.pitch+dy*.006,.12,1.45);
    }
    state.pointer={...state.pointer,x:e.clientX,y:e.clientY};draw();
  });
  const endDrag=e=>{
    if(state.dragging&&!state.moved&&state.pointer){const object=pickObject(e.clientX,e.clientY);state.selectedId=object?.id||null;updateSelectedBar(object);renderObjectInspector(object);draw();}
    state.dragging=false;state.pointer=null;
  };
  canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',()=>{state.dragging=false;state.pointer=null;});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('wheel',e=>{e.preventDefault();state.camera.radius=clamp(state.camera.radius*Math.exp(e.deltaY*.001),2,260);draw();},{passive:false});
  window.addEventListener('resize',draw);
}

function init() {
  try {
    state.renderer=createRenderer(canvas);
    $('renderStatus').textContent='WEBGL ONLINE';
  } catch(error) {
    $('webglFallback').classList.remove('hidden');$('renderStatus').textContent=LANG === 'es' ? 'WEBGL NO DISPONIBLE' : 'WEBGL UNAVAILABLE';console.error(error);return;
  }
  renderCatalog();renderLayerControls();setInputs();buildCurrentScene();fitCamera();updateMetrics();initEvents();
  $('viewportTitle').textContent=state.product.name;$('viewportSubtitle').textContent=state.product.description;
  renderObjectInspector(null);
}

init();
