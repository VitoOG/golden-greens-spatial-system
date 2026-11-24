# Engineering Method and Calculation Boundary

## 1. Geometry

For rectangular envelopes:

- `A_floor = L × W`
- `V_gross = L × W × H`
- `A_walls = 2 × H × (L + W)` for a simple four-wall rectangular enclosure, excluding openings and gables.

The net usable volume must be calculated from the actual internal clear dimensions, wall build-up, partitions, structure, raised floor, ceiling services, and equipment. The MVP does not infer a net volume from a generic percentage.

## 2. Growing surface

For rack modules:

`A_grow = Σ(L_rack × W_rack × N_levels)`

For horizontal beds:

`A_grow = Σ(L_bed × W_bed)`

Do not multiply rack floor footprint by a nominal number of levels unless every level is actually usable and illuminated. Exclude aisle area, service gaps, unusable shelf zones, and crop-specific spacing when calculating productive canopy area.

## 3. LED estimate

An idealized first estimate:

`P_LED ≈ A_grow × PPFD_target / PPE_fixture`

Dimensional check:

`m² × µmol/(m²·s) ÷ (µmol/J) = J/s = W`.

Energy:

`E_LED = P_LED × photoperiod / 1000` in kWh/day when P is in W and photoperiod in h/day.

For engineering selection, model fixture photon flux, optics, mounting height, layout, overlap, canopy geometry, target uniformity, dimming, driver losses and manufacturer test data. Distinguish fixture input power from photon output. This MVP estimate is not a lighting design.

## 4. Airflow indicator

`Q = V × ACH` yields m³/h when V is m³ and ACH is h⁻¹.

This is a volumetric indicator only. It does not size a fan or an HVAC unit. Actual system design can be governed by sensible heat, latent load, transpiration, CO₂ strategy, pressure balance, filtration, odor control, door openings and outdoor design conditions.

## 5. Water and nutrient solution

A tank size cannot safely be derived from floor area alone. Required inputs include crop type, plant count, irrigation method, flow per emitter/channel, irrigation schedule, recirculation ratio, source water, purge strategy, cleaning/CIP, buffer duration, and failure reserve. Pump selection requires a system curve and operating point: flow, total dynamic head, NPSH margin, fluid properties, duty cycle, and redundancy.

## 6. Electrical

A future electrical module should separate:

- installed nameplate load;
- estimated simultaneous demand;
- continuous and intermittent loads;
- starting/inrush current;
- phase distribution and imbalance;
- power factor and harmonics;
- protective devices, fault current and selectivity;
- cable ampacity, voltage drop, installation method and environment;
- UPS / emergency / safety loads.

Do not use one generic diversity factor across all systems without an explicit load schedule and operating sequence.

## 7. HVAC and dehumidification

Inputs should include outdoor design conditions, indoor temperature/RH setpoints, envelope U-values, thermal bridges, solar gains, infiltration, lighting heat, equipment heat, occupancy, crop transpiration by growth stage, irrigation evaporation, and ventilation strategy. Dehumidification capacity must be based on a moisture balance, not room volume alone.

## 8. Evidence requirements

For every selected equipment item, store:

- manufacturer and exact model;
- revision/date of datasheet;
- rated values and units;
- operating envelope;
- dimensions and connection details;
- source URL or local evidence file hash;
- assumptions and engineering margin;
- verification status (unverified / source-checked / calculated / approved).
