include <gg_components.scad>;

// OpenSCAD Customizer parameters. Units are millimetres.
MODEL = "growroom"; // [nursery,vegetarium,growbox,growroom,chambers3,chambers9,chambers10,container,container_hub,greenhouse,turnkeyHub]
LENGTH = 6000;
WIDTH = 4000;
HEIGHT = 3000;
CHAMBERS = 1;
GROW_UNITS = 4;
LEVELS = 3;
UNIT_WIDTH = 700;
SHOW_WATER = true;
SHOW_CLIMATE = true;
SHOW_AUTOMATION = true;
SHOW_ROOF = false;

module rack_rows(L,W,H,units,levels,unit_width) {
    rows = min(2,units);
    cols = ceil(units/rows);
    rack_l = min(L*.82,(L/cols)*.82);
    for (i=[0:units-1]) {
        c=i%cols; r=floor(i/cols);
        x=-L/2+(c+.5)*L/cols;
        z=rows==1 ? 0 : -W*.24+r*(W*.48);
        translate([x,100,z]) gg_rack_unit(rack_l,min(unit_width,W*.35),H*.72,levels);
    }
}

module bed_rows(L,W,units,unit_width) {
    gap=W/units;
    for(i=[0:units-1]) translate([0,0,-W/2+gap*(i+.5)]) gg_grow_bed(L*.82,min(unit_width,gap*.82),420);
}

module grow_product() {
    gg_box_frame(LENGTH,WIDTH,HEIGHT,100,100,100,true);
    rack_rows(LENGTH,WIDTH,HEIGHT,GROW_UNITS,LEVELS,UNIT_WIDTH);
    if(SHOW_WATER) {
        translate([LENGTH*.32,0,-WIDTH*.32]) gg_tank(1000,1300);
        translate([LENGTH*.32-1100,0,-WIDTH*.32+500]) gg_mixing_station(650,1200,2);
        translate([LENGTH*.32-650,0,-WIDTH*.32+1400]) gg_pump_skid();
    }
    if(SHOW_CLIMATE) translate([-LENGTH*.34,HEIGHT*.55,WIDTH*.3]) gg_ahu();
    if(SHOW_AUTOMATION) translate([-LENGTH*.35,0,-WIDTH*.32]) gg_control_cabinet();
}

if (MODEL=="growbox" || MODEL=="growroom" || MODEL=="nursery") {
    grow_product();
} else if (MODEL=="vegetarium" || MODEL=="greenhouse") {
    gg_greenhouse_bay(LENGTH,WIDTH,HEIGHT,100,6);
    bed_rows(LENGTH,WIDTH,GROW_UNITS,UNIT_WIDTH);
    if(SHOW_WATER) translate([LENGTH*.36,0,-WIDTH*.32]) gg_tank(1500,1600);
    if(SHOW_CLIMATE) translate([-LENGTH*.34,HEIGHT*.55,WIDTH*.3]) gg_ahu();
    if(SHOW_AUTOMATION) translate([-LENGTH*.35,0,-WIDTH*.32]) gg_control_cabinet();
} else if (MODEL=="container") {
    gg_container_40hc(LENGTH,WIDTH,HEIGHT);
    rack_rows(LENGTH,WIDTH,HEIGHT,2,LEVELS,UNIT_WIDTH);
    if(SHOW_WATER) translate([LENGTH*.32,0,-WIDTH*.3]) gg_tank(650,1000);
    if(SHOW_AUTOMATION) translate([-LENGTH*.35,0,-WIDTH*.3]) gg_control_cabinet(500,400,1600);
} else if (MODEL=="container_hub") {
    for(row=[0:1]) for(col=[0:4]) translate([-(5*12190+4*280)/2+6095+col*12470,0,(row-.5)*4200]) {
        gg_container_40hc();
        translate([0,80,0]) rack_rows(12190,2440,2900,2,LEVELS,420);
    }
} else if (MODEL=="chambers3" || MODEL=="chambers9" || MODEL=="chambers10") {
    cols=MODEL=="chambers3"?3:MODEL=="chambers9"?3:5;
    rows=MODEL=="chambers3"?1:2;
    gg_box_frame(LENGTH,WIDTH,HEIGHT,100,100,100,true);
    for(c=[1:cols-1]) color("#829085") translate([-LENGTH/2+LENGTH*c/cols,100,0]) cube([80,HEIGHT*.65,WIDTH]);
    for(r=[1:rows-1]) color("#829085") translate([0,100,-WIDTH/2+WIDTH*r/rows]) cube([LENGTH,HEIGHT*.65,80]);
    rack_rows(LENGTH,WIDTH,HEIGHT,GROW_UNITS,LEVELS,UNIT_WIDTH);
    if(SHOW_WATER) translate([LENGTH*.4,0,-WIDTH*.4]) gg_tank(1400,1600);
    if(SHOW_CLIMATE) translate([-LENGTH*.4,HEIGHT*.6,WIDTH*.4]) gg_ahu();
    if(SHOW_AUTOMATION) translate([-LENGTH*.4,0,-WIDTH*.4]) gg_control_cabinet();
} else if (MODEL=="turnkeyHub") {
    color("#46564a") translate([-36000,-60,-26000]) cube([72000,120,52000]);
    // Nursery
    translate([-25000,0,-15000]) {
        gg_box_frame(12000,8000,3400,100,100,100,true);
        translate([0,100,-1200]) gg_rack_unit(4500,620,2400,3);
        translate([0,100,1200]) gg_rack_unit(4500,620,2400,3);
    }
    // Laboratory
    translate([-9000,0,-15000]) {
        gg_box_frame(8000,7000,3400,100,100,100,true);
        translate([0,650,0]) gg_lab_bench(5600,750,900);
    }
    // Engineering / server room
    translate([3000,0,-17000]) {
        gg_box_frame(8000,6000,3200,100,100,100,true);
        translate([-1800,0,0]) gg_edge_rack();
        translate([0,0,0]) gg_edge_rack();
        translate([1800,0,0]) gg_edge_rack();
    }
    // Indoor grow hall
    translate([16000,0,-6000]) {
        gg_box_frame(18000,12000,4200,100,100,100,true);
        for (z=[-3200,0,3200]) translate([0,100,z]) gg_rack_unit(3300,620,3000,3);
    }
    // Warehouse / packing
    translate([29000,0,-17000]) {
        gg_box_frame(12000,9000,4000,100,100,100,true);
        translate([-3200,0,0]) gg_warehouse_rack();
        translate([0,0,0]) gg_warehouse_rack();
        translate([3200,0,0]) gg_warehouse_rack();
    }
    // Seed bank
    translate([-29000,0,1000]) {
        gg_box_frame(6000,5000,3000,100,100,100,true);
        translate([-1400,0,0]) gg_seed_bank();
        translate([0,0,0]) gg_seed_bank();
        translate([1400,0,0]) gg_seed_bank();
    }
    // Water treatment
    translate([-19000,0,14000]) {
        gg_box_frame(9000,8000,3400,100,100,100,true);
        translate([-1600,0,0]) gg_tank(1200,1500);
        translate([1600,0,0]) gg_tank(900,1300);
    }
    // Nutrient mixing
    translate([-6000,0,14000]) {
        gg_box_frame(8000,6000,3200,100,100,100,true);
        gg_mixing_station(650,1200,2);
    }
    // Greenhouse
    translate([17000,0,15000]) {
        gg_greenhouse_bay(22000,10000,5000,100,5);
        for(z=[-3600,-2400,-1200,0,1200,2400,3600]) translate([0,0,z]) gg_grow_bed(18000,850,420);
    }
    // Harvest / processing
    translate([30000,0,2000]) {
        gg_box_frame(9000,7000,3600,100,100,100,true);
        gg_warehouse_rack(5000,900,2600,3);
    }
}
