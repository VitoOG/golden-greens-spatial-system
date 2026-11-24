#!/usr/bin/env python3
"""Lightweight validation for catalog data and generated OBJ assets."""
from __future__ import annotations
import json
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[1]
errors=[]

def load_json(path):
    try:return json.loads(path.read_text(encoding='utf-8'))
    except Exception as exc:
        errors.append(f"{path.relative_to(ROOT)}: invalid JSON: {exc}");return {}

catalog=load_json(ROOT/'data/product-catalog.json')
components=load_json(ROOT/'data/components.json')
zones=load_json(ROOT/'data/campus-zones.json')
products=catalog.get('products',[]);ids=set()
for p in products:
    pid=p.get('id')
    if not pid:errors.append('product without id')
    elif pid in ids:errors.append(f'duplicate product id: {pid}')
    ids.add(pid)
    d=p.get('dimensions',{})
    for key in ('length','width','height'):
        if not isinstance(d.get(key),(int,float)) or d[key]<=0:errors.append(f'{pid}: invalid dimension {key}')
    for key in ('chambers','units','levels'):
        if not isinstance(p.get(key),int) or p[key] < (0 if key=='units' else 1):errors.append(f'{pid}: invalid {key}')
    if p.get('type') not in {'racks','beds','chambers','container','containerHub','greenhouse','campus'}:errors.append(f'{pid}: unknown product type')
component_ids=set()
for c in components.get('components',[]):
    cid=c.get('id')
    if not cid or cid in component_ids:errors.append(f'duplicate or missing component id: {cid}')
    component_ids.add(cid)
    if c.get('group') not in {'structure','grow','water','climate','automation','logistics','laboratory'}:errors.append(f'{cid}: unknown group')
    asset=c.get('assetObj')
    if asset and not (ROOT/asset).exists():errors.append(f'{cid}: missing OBJ asset {asset}')
zone_ids=set()
for z in zones.get('zones',[]):
    if not z.get('id') or z['id'] in zone_ids:errors.append(f'duplicate or missing campus zone id: {z.get("id")}')
    zone_ids.add(z.get('id'))

obj_files=list((ROOT/'assets/obj').glob('*.obj'))
for obj in obj_files:
    vertices=0;faces=0
    for line in obj.read_text(encoding='utf-8').splitlines():
        if line.startswith('v '):vertices+=1
        elif line.startswith('f '):
            faces+=1
            for token in line.split()[1:]:
                if int(token.split('/')[0])<1:errors.append(f'{obj.name}: non-positive OBJ vertex index')
    if not vertices or not faces:errors.append(f'{obj.name}: empty OBJ mesh')
    if not obj.with_suffix('.mtl').exists():errors.append(f'{obj.name}: missing MTL')

print(f"products: {len(products)}")
print(f"components: {len(components.get('components',[]))}")
print(f"campus zones: {len(zones.get('zones',[]))}")
print(f"OBJ assets: {len(obj_files)}")
if errors:
    print('VALIDATION FAILED')
    for error in errors:print(' -',error)
    sys.exit(1)
print('VALIDATION OK')
