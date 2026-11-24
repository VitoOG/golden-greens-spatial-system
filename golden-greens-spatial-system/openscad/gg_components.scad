// Golden Greens reusable conceptual component library.
// All OpenSCAD dimensions in this file are millimetres.
// Not a structural design: profiles, joints, materials and loads are placeholders.

module gg_box_frame(L=6000, W=4000, H=3000, post=100, beam=100, floor_t=100, floor=true) {
    if (floor) color("#657568") translate([-L/2,0,-W/2]) cube([L,floor_t,W]);
    for (x=[-L/2+post/2,L/2-post/2])
        for (z=[-W/2+post/2,W/2-post/2])
            color("#9aa99b") translate([x-post/2,floor_t,z-post/2]) cube([post,H,post]);
    color("#9aa99b") {
        translate([-L/2,H+floor_t-beam/2,-W/2]) cube([L,beam,beam]);
        translate([-L/2,H+floor_t-beam/2,W/2-beam]) cube([L,beam,beam]);
        translate([-L/2,H+floor_t-beam/2,-W/2]) cube([beam,beam,W]);
        translate([L/2-beam,H+floor_t-beam/2,-W/2]) cube([beam,beam,W]);
    }
}

module gg_rack_unit(L=2500, D=650, H=2100, levels=3, post=40, shelf_t=50) {
    color("#81918a") {
        for (x=[-L/2+post/2,L/2-post/2])
            for (z=[-D/2+post/2,D/2-post/2])
                translate([x-post/2,0,z-post/2]) cube([post,H,post]);
    }
    for (i=[0:levels-1]) {
        y=250+(H-450)*(i+0.25)/levels;
        color("#8da08e") translate([-L/2+post,y,-D/2+post]) cube([L-2*post,shelf_t,D-2*post]);
        color("#536d53") translate([-L/2+post+50,y+shelf_t,-D/2+post+40]) cube([L-2*post-100,25,D-2*post-80]);
        color("#e6d9a8") translate([-L*0.42,y+shelf_t+130,-D*0.24]) cube([L*0.84,45,D*0.48]);
    }
}

module gg_grow_bed(L=6000, W=900, H=420) {
    color("#536d53") translate([-L/2,80,-W/2]) cube([L,H-80,W]);
    color("#81918a") {
        for (x=[-L/2+100,L/2-160]) translate([x,0,-W/2]) cube([60,120,W]);
        for (z=[-W/2+80,W/2-140]) translate([-L/2,0,z]) cube([L,100,60]);
    }
}

module gg_tank(D=1100, H=1300, wall=5) {
    color("#6a9bb0") difference() {
        cylinder(d=D,h=H,$fn=48);
        translate([0,0,wall]) cylinder(d=D-2*wall,h=H,$fn=48);
    }
    color("#456d80") translate([0,0,H-45]) cylinder(d=D+30,h=55,$fn=48);
}

module gg_pump_skid(L=1200, W=650, H=850) {
    color("#53635c") translate([-L/2,0,-W/2]) cube([L,120,W]);
    color("#34758e") translate([-L*.25,120,-W*.22]) cube([L*.35,H*.55,W*.44]);
    color("#81918a") translate([L*.18,120,-W*.12]) cylinder(d=260,h=H*.5,$fn=36);
    color("#4d9ab5") translate([-L*.05,H*.65,0]) rotate([90,0,90]) cylinder(d=90,h=L*.4,$fn=24);
}

module gg_mixing_station(D=800,H=1700,channels=2) {
    for (i=[0:channels-1])
        color(i==0 ? "#bf9c67" : "#4d9ab5") translate([(i-(channels-1)/2)*(D+180),0,0]) gg_tank(D,H);
    color("#53635c") translate([-D,0,-D*.8]) cube([D*2,H*.45,120]);
}

module gg_led_fixture(L=1800,W=100,H=45) {
    color("#e6d9a8") translate([-L/2,-H/2,-W/2]) cube([L,H,W]);
}

module gg_ahu(L=1400,W=800,H=700) {
    color("#8d8eae") translate([-L/2,0,-W/2]) cube([L,H,W]);
    color("#53635c") translate([-L*.28,H,-W*.28]) cube([L*.56,160,W*.56]);
}

module gg_control_cabinet(W=700,D=500,H=1800) {
    color("#788b7e") translate([-W/2,0,-D/2]) cube([W,H,D]);
    color("#284a3c") translate([-W*.25,H*.58,D/2]) cube([W*.5,H*.2,12]);
}

module gg_edge_rack(W=600,D=800,H=2200) {
    color("#4d6258") translate([-W/2,0,-D/2]) cube([W,H,D]);
    for (y=[H*.2,H*.4,H*.6,H*.8]) color("#92b7a7") translate([-W*.35,y,D/2]) cube([W*.7,35,12]);
}

module gg_lab_bench(L=3000,D=750,H=900) {
    color("#81918a") translate([-L/2,0,-D/2]) cube([L,H*.72,D]);
    color("#d9e3d7") translate([-L/2,H*.72,-D/2]) cube([L,70,D]);
    for (x=[-L*.3,0,L*.3]) color("#80a9c0") translate([x,H*.8,0]) cylinder(d=180,h=250,$fn=32);
}

module gg_seed_bank(W=1800,D=650,H=2200,shelves=5) {
    color("#9aaf79") translate([-W/2,0,-D/2]) cube([W,H,D]);
    for (i=[1:shelves]) color("#d9e3d7") translate([-W*.45,H*i/(shelves+1),D/2]) cube([W*.9,35,18]);
}

module gg_warehouse_rack(L=2400,D=900,H=2600,levels=4) {
    color("#bf9c67") {
        for (x=[-L/2+35,L/2-35]) for (z=[-D/2+35,D/2-35]) translate([x-35,0,z-35]) cube([70,H,70]);
        for (i=[1:levels]) translate([-L/2,H*i/(levels+1),-D/2]) cube([L,65,D]);
    }
}

module gg_container_40hc(L=12190,W=2440,H=2900,post=90) {
    gg_box_frame(L,W,H,post,post,80,true);
    for (i=[1:18]) {
        x=-L/2+L*i/19;
        color("#667d82") {
            translate([x,180,-W/2]) cube([28,H*.78,30]);
            translate([x,180,W/2-30]) cube([28,H*.78,30]);
        }
    }
}

module gg_greenhouse_bay(L=30000,W=10000,H=4500,post=100,bays=6) {
    gg_box_frame(L,W,H,post,post,100,true);
    color("#81918a") translate([-L/2,H,-60]) cube([L,80,120]);
    for (i=[1:bays-1]) color("#81918a") translate([-L/2+L*i/bays,H*.18,-W/2]) cube([70,H*.82,W]);
    color("#9aa99b") {
        translate([-L/2,H,W/2]) rotate([0,0,0]) cube([L,80,60]);
        translate([-L/2,H,-W/2]) cube([L,80,60]);
    }
}
