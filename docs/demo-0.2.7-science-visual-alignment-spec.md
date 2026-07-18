# Demo 0.2.7 Science Visual Alignment Spec

Target Version: Demo 0.2.7

## Goal

Demo 0.2.7 is a corrective visual-model alignment release.

Demo 0.2.6 added scenario selection, route telemetry, and more honest model labels. The next issue is that the text describes stronger concepts than the visuals currently make legible. Demo 0.2.7 should make the three main lenses visibly distinct:

```text
Orbit View = scenario-filtered atlas
Gravity View = conceptual energy terrain
Low-Energy Routes View = relay topology with dynamic edge state
```

This is not a feature expansion release. It should improve visual clarity, scenario focus, and scientific honesty before the Demo 0.3.0 economy layer.

## Source Inputs

- `docs/demo-0.2.6-dynamic-route-scenarios-feedback.md`
- `docs/demo-0.2.7-science-visual-alignment-proposal.md`
- `docs/demo-0.2.6-physics-view-model-research.md`
- `docs/project-directions.md`

## Core Question

Can users understand the active route theater by looking at the visual model, before relying on labels and explanation text?

## Implementation Cut

Implement Option B from the proposal:

```text
Parameterized visual models for Gravity View and Low-Energy Routes View,
plus scenario-specific Orbit View layer presets.
```

Do not add new scenarios. Do not introduce a CR3BP solver, real manifold integration, a 3D physics engine, or an economic model.

## Orbit View Requirements

Orbit View remains the stable approximate spatial atlas, but scenario selection must control default visual focus.

Required behavior:

1. Add scenario-specific default layer presets.
2. Hide or strongly mute unrelated atlas layers by default.
3. Keep manual layer controls available where they already exist, so context can be re-enabled.
4. Make the active scenario identifiable from visible objects, routes, and emphasis.
5. Keep Orbit View labels and badges honest: approximate spatial atlas, not upgraded ephemeris or 3D physics.

Recommended scenario defaults:

### Earth-Moon Gateway Logistics

Default emphasis:

- Earth
- Moon
- LEO Port
- Earth-Moon L1/L2 gateway concept
- lunar gateway / depot concept
- local shuttle and cargo-ladder route classes

Default muted or hidden:

- Mars gateway details
- Ceres / belt markers
- probe orbits
- cycler service markers
- unrelated fast interplanetary transfers

### Earth-Mars Service Corridor

Default emphasis:

- Earth
- Mars
- LEO Port
- Phobos / Deimos gateway concepts
- Aldrin-cycler-inspired service pattern
- fast transfer and taxi timing symbols
- Earth-Mars route windows

Default muted or hidden:

- Moon local logistics unless needed as context
- Ceres / belt routes
- unrelated Lagrange relay/storage nodes
- probe orbits

### Lagrange Relay And Volatile Network

Default emphasis:

- Sun-Earth L1/L2/L4/L5
- Earth-Moon L1/L2
- relay and storage shelves
- Mars gateway shelf
- Ceres / volatile source
- slow-cargo route families
- depot / handoff nodes

Default muted or hidden:

- passenger-focused fast transfers
- probe orbits
- local surface shuttle details unless they connect to the relay chain

## Gravity View Requirements

Gravity View should no longer look like Orbit View with a tilted grid. It should read as conceptual energy terrain.

Required visual primitives:

- closed contour wells around massive bodies
- shelf levels for orbital ports and gateway staging regions
- visible saddle / neck / pass geometry around Lagrange regions
- background slope for solar influence in Earth-Mars and Lagrange / volatile scenarios
- selected-route energy profile or visible well-to-shelf-to-pass cue

Required proxy fields:

Expose at least three of these in the inspector or selected-node details:

```text
wellDepthProxy
escapeEnergyProxy
shelfHeightProxy
saddleThresholdProxy
solarSlopeProxy
routeEnergyClass
```

The values may be hand-authored or normalized proxies. They must be labeled as proxies and must not imply mission-grade delta-v, solved potential fields, or real trajectory optimization.

Allowed animation:

- saddle neck highlight when a route window is usable
- contour emphasis shift by scenario phase
- route-profile marker moving from well to shelf to pass
- selected node pulsing at its proxy energy tier
- subtle background slope emphasis

## Low-Energy Routes View Requirements

Low-Energy Routes View should become a stable relay topology with dynamic edge telemetry.

Required model split:

```text
nodes = stable relay / storage / depot / source / gateway roles
edges = stable route families
edge state = dynamic availability, wait, flow, capacity, reliability, suitability
```

Required node roles:

- gateway
- relay
- storage shelf
- depot
- source
- sink / demand node
- handoff node

Required edge fields:

Expose at least four of these visually or in inspector details:

```text
availability
nextWindow
waitTime
flowProxy
capacityProxy
reliabilityProxy
suitability
travelTimeClass
energyClass
```

Dynamic behavior belongs on edge state, not changing route-family geometry.

Required visual behavior:

1. Active route windows brighten the edge.
2. Closed or waiting windows fade the edge.
3. Flow proxy changes thickness, packet density, or a clearly equivalent state.
4. Wait time appears as a timeline marker, edge label, or selected-edge inspector field.
5. The topology remains useful when animation is paused.

## Layout Requirements

The visual improvement will fail if panels cover the concept area.

Required:

1. Protect the central canvas area on desktop.
2. Keep HUD and inspector panels from hiding the key terrain or topology focus.
3. On mobile, do not attempt the unassigned mobile redesign from `docs/mobile-scenario-experience-proposal.md`.
4. Mobile should remain no worse than Demo 0.2.6: scenario selection and Orbit View stay usable, and Gravity / Low-Energy modes may remain secondary or hidden on narrow screens.

## Out Of Scope

- new economic model
- new scenario set
- commodity prices, revenue, settlement growth, or market scoring
- CR3BP solver
- real manifold integration
- mission-grade delta-v
- ephemeris pipeline upgrade
- full 3D physics engine
- mandatory 3D Orbit View
- full mobile scenario / campaign redesign

## Acceptance Criteria

Demo 0.2.7 is acceptable if:

1. The app identifies itself as Demo 0.2.7.
2. `package.json` version metadata is updated to `0.2.7`.
3. Orbit View applies scenario-specific layer defaults or equivalent emphasis/muting.
4. A reviewer can identify the active scenario from Orbit View without reading the active scenario button.
5. Gravity View visibly reads as energy terrain before labels are read.
6. At least one gravity well and one Lagrange saddle / pass are visually recognizable.
7. Gravity View exposes proxy energy values with clear non-mission-grade labeling.
8. Low-Energy Routes View reads as relay topology, not an orbital trajectory view.
9. At least one Low-Energy edge visibly communicates availability, wait, and flow state.
10. Users can distinguish the three model lenses by sight:
    - Orbit View: approximate spatial atlas
    - Gravity View: conceptual energy terrain
    - Low-Energy Routes View: route-family topology
11. Desktop review confirms that HUD and inspector panels do not obscure the main visual concept area.
12. Mobile review confirms that the experience is no worse than Demo 0.2.6.

## Verification

Implementation should run:

```text
npm run check
npm run build
```

Implementation should also run a local preview and inspect:

- desktop viewport around 1440 x 900
- mobile viewport around 390 x 844
- all three scenarios
- all three desktop view modes
- console errors
- text overlap / clipped controls
- canvas nonblank state after build

Write a Demo 0.2.7 feedback document after the implementation / operations loop:

```text
docs/demo-0.2.7-science-visual-alignment-feedback.md
```

The feedback should record what was implemented, which acceptance criteria passed, which visual gaps remain, and whether the next step should be 0.2.7 follow-up, mobile-specific spec, or Demo 0.3.0 economy planning.
