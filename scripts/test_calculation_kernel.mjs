import assert from 'node:assert/strict';
import { PRODUCTS, createInitialState } from '../src/catalog.js';
import { buildScene, getCalculationMetrics, createProductReport, exportSceneOBJ } from '../src/scene.js';

const get = id => {
  const p = PRODUCTS.find(x => x.id === id);
  assert.ok(p, `missing product ${id}`);
  return [p, createInitialState(p)];
};

for (const product of PRODUCTS) {
  const state = createInitialState(product);
  const scene = buildScene(product, state);
  const metrics = getCalculationMetrics(product, state);
  const report = createProductReport(product, state);
  const exported = exportSceneOBJ(scene);
  assert.ok(scene.objects.filter(o => o.group !== 'grid').length > 0, `${product.id}: no scene objects`);
  assert.ok(Number.isFinite(metrics.growArea) && metrics.growArea >= 0, `${product.id}: invalid growing area`);
  assert.ok(Number.isFinite(metrics.ledPowerW) && metrics.ledPowerW >= 0, `${product.id}: invalid LED estimate`);
  assert.equal(report.status, 'PRELIMINARY_CONCEPT');
  assert.ok(exported.obj.includes('mtllib golden-greens-materials.mtl'));
  assert.ok(exported.obj.includes('\nf '), `${product.id}: OBJ has no faces`);
}

{
  const [p,s] = get('growroom');
  const m = getCalculationMetrics(p,s);
  assert.equal(m.floorArea,24);
  assert.equal(m.grossVolume,72);
  assert.ok(Math.abs(m.growArea-20.664)<1e-6);
  assert.ok(Math.abs(m.ledPowerW-(20.664*260/2.7))<1e-6);
  assert.equal(m.airflowM3h,360);
}
{
  const [p,s] = get('containerHub');
  const m = getCalculationMetrics(p,s);
  assert.ok(Math.abs(m.floorArea-(10*12.19*2.44))<1e-6);
  assert.equal(buildScene(p,s).objects.filter(o=>o.id.startsWith('GG-CONTAINER-')).length,10);
}
{
  const [p,s] = get('turnkeyHub');
  const m = getCalculationMetrics(p,s);
  assert.equal(m.floorArea,957);
  assert.ok(m.grossVolume>3800 && m.grossVolume<3900);
  assert.ok(buildScene(p,s).objects.some(o=>o.id==='GG-SEED-BANK'));
  assert.ok(buildScene(p,s).objects.some(o=>o.id==='GG-CAMPUS-MIXING'));
}
{
  const [p,s] = get('growbox');
  s.length=1.5;s.width=1.4;s.height=2.4;s.levels=3;
  const scene=buildScene(p,s),m=getCalculationMetrics(p,s);
  assert.ok(Math.abs(m.floorArea-2.1)<1e-9);
  assert.ok(scene.objects.some(o=>o.id==='GG-WATER-TANK'));
}
console.log(`Calculation and scene tests passed for ${PRODUCTS.length} product families.`);
