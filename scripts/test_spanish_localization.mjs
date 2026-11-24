import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

globalThis.document = { documentElement: { lang: 'es' } };

const { LANG, t } = await import('../src/i18n.js');
const es = await import('../src/catalog.es.js');
const ru = await import('../src/catalog.js');
const sceneModule = await import('../src/scene.js');

const CYRILLIC = /[А-Яа-яЁё]/u;
assert.equal(LANG, 'es');

const html = await readFile(new URL('../es/index.html', import.meta.url), 'utf8');
assert.match(html, /<html lang="es">/);
assert.match(html, /href="\.\.\/styles\.css"/);
assert.match(html, /src="\.\.\/src\/main\.js"/);
assert.match(html, /href="\.\/" lang="es" aria-current="page"/);
assert.doesNotMatch(html, CYRILLIC, 'Spanish HTML must not contain Cyrillic UI text');

assert.equal(es.PRODUCTS.length, 11);
assert.equal(es.PRODUCTS.length, ru.PRODUCTS.length);
assert.deepEqual(es.PRODUCTS.map(p => p.id), ru.PRODUCTS.map(p => p.id));

for (let i = 0; i < es.PRODUCTS.length; i++) {
  const spanish = es.PRODUCTS[i];
  const original = ru.PRODUCTS[i];
  assert.equal(spanish.code, original.code);
  assert.deepEqual(spanish.dimensions, original.dimensions);
  for (const key of ['type','chambers','units','levels','unitWidth','unitLengthRatio','rackRows','chamberCols','chamberRows','waterTankL','ppfd','ach','daylightHours']) {
    if (key in original) assert.deepEqual(spanish[key], original[key], `${spanish.id}: changed ${key}`);
  }
  assert.deepEqual(spanish.componentPowers, original.componentPowers);
  for (const key of ['name','short','category','description']) {
    assert.equal(typeof spanish[key], 'string');
    assert.ok(spanish[key].trim(), `${spanish.id}: empty ${key}`);
    assert.doesNotMatch(spanish[key], CYRILLIC, `${spanish.id}: untranslated ${key}`);
  }
}

assert.deepEqual(es.GROUPS.map(g => g.id), ru.GROUPS.map(g => g.id));
assert.deepEqual(es.COMPONENT_LIBRARY.map(c => c.id), ru.COMPONENT_LIBRARY.map(c => c.id));
for (const component of es.COMPONENT_LIBRARY) {
  for (const field of ['name','unit','purpose']) {
    assert.equal(typeof component[field], 'string');
    assert.doesNotMatch(component[field], CYRILLIC, `${component.id}: untranslated ${field}`);
  }
}

assert.equal(t('structure'), 'estructura');
assert.equal(t('Камера 2 · стеллаж 3'), 'Cámara 2 · estantería 3');
assert.equal(t('Стеллаж 4'), 'Estantería 4');
assert.equal(t('Грядка 2'), 'Bancal 2');

for (const product of es.PRODUCTS) {
  const state = es.createInitialState(product);
  const scene = sceneModule.buildScene(product, state);
  assert.ok(scene.objects.some(o => o.group !== 'grid'), `${product.id}: no visible scene objects`);
  for (const object of scene.objects) {
    assert.doesNotMatch(object.name, CYRILLIC, `${product.id}/${object.id}: untranslated object name "${object.name}"`);
    assert.doesNotMatch(object.group, CYRILLIC, `${product.id}/${object.id}: untranslated group`);
    assert.doesNotMatch(object.description, CYRILLIC, `${product.id}/${object.id}: untranslated description: ${object.description}`);
  }
}
console.log('Spanish localization checks passed: 11 products, component library, 3D scene labels and descriptions.');
