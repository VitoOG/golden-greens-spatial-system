#!/usr/bin/env python3
"""Generate simple metre-scale OBJ/MTL component models for Golden Greens."""
from __future__ import annotations
from dataclasses import dataclass
from math import cos, sin, pi
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "assets" / "obj"
MATERIALS = {
    "steel": "#81918a", "frame": "#9ba99b", "shelf": "#8da08e", "tray": "#536d53",
    "plant": "#75b86c", "led": "#e6d9a8", "tank": "#6a9bb0", "water_dark": "#456d80",
    "blue": "#4d9ab5", "climate": "#8d8eae", "cabinet": "#788b7e", "amber": "#bf9c67",
    "white": "#d9e3d7", "floor": "#68766b", "dark": "#53635c"
}

@dataclass
class Part:
    name: str
    material: str
    vertices: list[tuple[float,float,float]]
    faces: list[tuple[int,...]]

class Model:
    def __init__(self, name: str):
        self.name = name
        self.parts: list[Part] = []
    def box(self, name, center, size, material="steel"):
        x,y,z=center; sx,sy,sz=size
        v=[(x+dx*sx/2,y+dy*sy/2,z+dz*sz/2) for dx,dy,dz in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
        f=[(0,3,2,1),(4,5,6,7),(0,4,7,3),(1,2,6,5),(0,1,5,4),(3,7,6,2)]
        self.parts.append(Part(name,material,v,f))
    def cylinder(self,name,center,diameter,height,material="tank",segments=32):
        x,y,z=center; r=diameter/2; v=[]
        for yy in (y-height/2,y+height/2):
            for i in range(segments):
                a=2*pi*i/segments;v.append((x+sin(a)*r,yy,z+cos(a)*r))
        bottom=len(v);v.append((x,y-height/2,z));top=len(v);v.append((x,y+height/2,z))
        f=[]
        for i in range(segments):
            j=(i+1)%segments;f.extend([(i,j,segments+j,segments+i),(bottom,j,i),(top,segments+i,segments+j)])
        self.parts.append(Part(name,material,v,f))
    def rack(self,prefix="Rack",L=2.4,D=.65,H=2.1,levels=3):
        post=.045;base=.15
        for x in (-L/2+post/2,L/2-post/2):
            for z in (-D/2+post/2,D/2-post/2):self.box(prefix+" upright",(x,base+H/2,z),(post,H,post),"steel")
        for level in range(levels):
            y=base+.25+(H-.4)*(level+.25)/levels
            self.box(prefix+" shelf",(0,y,0),(L-.08,.055,D-.04),"shelf")
            self.box(prefix+" tray",(0,y+.045,0),(L-.16,.03,D-.12),"tray")
            self.box(prefix+" LED",(0,y+.16,0),(L*.82,.045,D*.45),"led")
            for i in range(5):self.cylinder(prefix+" plant",(-L*.34+L*.68*i/4,y+.29,(i%2-.5)*D*.28),.12,.20,"plant",12)
    def save(self):
        ROOT.mkdir(parents=True,exist_ok=True)
        base=ROOT/f"{self.name}.obj";mtl=ROOT/f"{self.name}.mtl"
        lines=[f"# {self.name} — generated conceptual geometry; 1 unit = 1 metre",f"mtllib {mtl.name}"]
        offset=1
        for part in self.parts:
            lines += [f"\no {re.sub(r'[^A-Za-z0-9_]+','_',part.name)}",f"usemtl {part.material}"]
            lines += ["v %.6f %.6f %.6f"%v for v in part.vertices]
            lines += ["f "+" ".join(str(i+offset) for i in face) for face in part.faces]
            offset += len(part.vertices)
        mtl_lines=["# Golden Greens material palette"]
        for name,hexv in MATERIALS.items():
            n=int(hexv[1:],16);r=((n>>16)&255)/255;g=((n>>8)&255)/255;b=(n&255)/255
            mtl_lines += [f"newmtl {name}",f"Kd {r:.4f} {g:.4f} {b:.4f}","Ka 0.15 0.15 0.15","Ks 0.10 0.10 0.10","Ns 24","d 1",""]
        base.write_text("\n".join(lines)+"\n",encoding="utf-8")
        mtl.write_text("\n".join(mtl_lines)+"\n",encoding="utf-8")
        print(f"generated {base.relative_to(ROOT.parent.parent)} ({len(self.parts)} parts)")


def build_rack():
    m=Model("rack_module_2400x650x2100");m.rack();m.save()
def build_bed():
    m=Model("hydroponic_bed_6000x900");m.box("bed tray",(0,.22,0),(6,.28,.9),"tray");m.box("plant surface",(0,.39,0),(5.88,.06,.78),"shelf")
    for i in range(9):m.cylinder("plant marker",(-2.6+i*.65,.58,0),.16,.25,"plant",12)
    m.save()
def build_tank():
    m=Model("nutrient_tank_500l_concept");m.cylinder("tank body",(0,.65,0),.8,1.3,"tank");m.cylinder("tank lid",(0,1.33,0),.84,.08,"water_dark");m.save()
def build_mix():
    m=Model("mixing_station_concept");m.cylinder("A stock tank",(-.55,.55,0),.55,1.1,"amber");m.cylinder("B stock tank",(.55,.55,0),.55,1.1,"blue");m.box("skid base",(0,.1,0),(1.65,.2,.9),"dark");m.box("dosing panel",(0,.75,.55),(.8,.75,.08),"cabinet");m.save()
def build_pump():
    m=Model("pump_skid_concept");m.box("skid",(0,.12,0),(1.3,.24,.65),"dark");m.box("pump motor",(-.25,.48,0),(.55,.5,.45),"blue");m.cylinder("pump housing",(.28,.46,0),.38,.42,"steel");m.box("manifold",(.35,.76,0),(.75,.1,.12),"blue");m.save()
def build_led():
    m=Model("linear_led_fixture_1800");m.box("LED housing",(0,0,0),(1.8,.055,.10),"led");m.save()
def build_ahu():
    m=Model("ahu_climate_unit_concept");m.box("AHU cabinet",(0,.45,0),(1.4,.9,.8),"climate");m.box("duct",(0,1.0,-.48),(1.0,.18,.18),"steel");m.save()
def build_control():
    m=Model("plc_control_cabinet_concept");m.box("cabinet",(0,.9,0),(.72,1.8,.52),"cabinet");m.box("HMI",(0,1.12,.27),(.28,.35,.02),"water_dark");m.save()
def build_edge():
    m=Model("edge_server_rack_concept");m.box("rack",(0,1.1,0),(.6,2.2,.8),"dark")
    for i in range(4):m.box("server shelf",(0,.4+i*.42,.42),(.48,.08,.02),"steel")
    m.save()
def build_lab():
    m=Model("laboratory_bench_concept");m.box("bench cabinet",(0,.34,0),(3,.68,.75),"steel");m.box("worktop",(0,.72,0),(3,.08,.82),"white")
    for x in (-.8,0,.8):m.cylinder("instrument marker",(x,1.0,0),.18,.45,"blue",16)
    m.save()
def build_seed():
    m=Model("seed_bank_cabinet_concept");m.box("cabinet",(0,1.1,0),(1.8,2.2,.65),"shelf")
    for y in (.45,.85,1.25,1.65):m.box("shelf",(0,y,.34),(1.65,.035,.05),"white")
    m.save()
def build_warehouse():
    m=Model("warehouse_rack_bay_concept");L=2.4;D=.9;H=2.6
    for x in (-1.15,1.15):
        for z in (-.4,.4):m.box("upright",(x,H/2,z),(.07,H,.07),"amber")
    for y in (.7,1.3,1.9,2.5):m.box("shelf",(0,y,0),(L,.07,D),"amber")
    m.save()
def build_container():
    m=Model("shipping_container_40hc_frame_concept");L=12.19;W=2.44;H=2.9;post=.09
    for x in (-L/2+post/2,L/2-post/2):
        for z in (-W/2+post/2,W/2-post/2):m.box("corner post",(x,H/2,z),(post,H,post),"frame")
    for z in (-W/2+post/2,W/2-post/2):m.box("top side rail",(0,H,z),(L,post,post),"frame");m.box("bottom side rail",(0,.12,z),(L,post,post),"frame")
    m.box("floor",(0,.06,0),(L,.12,W),"floor")
    for i in range(1,18):
        x=-L/2+L*i/18;m.box("corrugation",(x,1.45,-W/2),(0.025,2.25,.045),"steel");m.box("corrugation",(x,1.45,W/2),(0.025,2.25,.045),"steel")
    m.save()
def build_greenhouse():
    m=Model("greenhouse_bay_30000x10000_concept");L=30;W=10;H=4.5;post=.1
    m.box("floor reference",(0,.05,0),(L,.1,W),"floor")
    for x in (-L/2,L/2):
        for z in (-W/2,W/2):m.box("post",(x,H/2,z),(post,H,post),"frame")
    for z in (-W/2,W/2):m.box("eave beam",(0,H,z),(L,.1,.1),"frame")
    m.box("ridge beam",(0,H+1,0),(L,.1,.1),"frame")
    for z in (-3.8,-2.7,-1.35,0,1.35,2.7,3.8):m.box("growing bed",(0,.35,z),(24,.5,.8),"tray")
    m.save()

if __name__=="__main__":
    for builder in [build_rack,build_bed,build_tank,build_mix,build_pump,build_led,build_ahu,build_control,build_edge,build_lab,build_seed,build_warehouse,build_container,build_greenhouse]:builder()
