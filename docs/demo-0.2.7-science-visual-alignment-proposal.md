# Demo 0.2.7 Science Visual Alignment Proposal

Target Version: Demo 0.2.7 proposal

## Problem

Demo 0.2.6 moved the project in the right direction: scenario selection exists, route telemetry exists, and the model labels are more honest. The remaining problem is not general feature coverage. It is a science-to-visual mismatch across the scenario views.

Orbit View is stable, but each scenario still behaves too much like a local zoom on the same solar-system atlas. Scenario selection changes focus and labels, but it does not yet fully decide which atlas layers belong in that scenario. This leaves unrelated infrastructure, routes, and probes visible when the user is trying to understand a concrete theater such as Earth-Moon gateway logistics.

Gravity View says it is a conceptual contour / energy terrain view, but visually it still behaves too much like a spatial layout with labels. Lagrange regions are labeled as saddles, but the saddle / pass shape is not visually legible enough.

Low-Energy Routes View says route families are stable while availability and flow are dynamic, but visually it still behaves too much like animated corridors. It does not yet read as a relay-network topology with stable nodes and quantified edge states.

The result is that the UI text has advanced beyond the visual model. Users can read the intended scientific concept, but they cannot yet see it.

## North Star Fit

The north-star question remains:

```text
Which routes, ports, and infrastructure cause civilization to grow?
```

Demo 0.2.7 should improve the user's ability to answer that question visually:

```text
Orbit View frames the scenario atlas.
Gravity View explains the energy terrain.
Low-Energy Routes View explains the transport network.
```

This is a better bridge toward Demo 0.3.0 than adding more scenarios or more route animations.

## Current Evidence

Local review of the current Demo 0.2.6 page showed:

- Scenario selector and route telemetry are present.
- Orbit View remains mostly a zoomed local solar-system atlas, and scenario-specific layer filtering is not strong enough.
- Gravity View includes labels such as conceptual contour terrain, saddle pass, and solar background slope.
- Gravity View does not yet show clearly recognizable contour wells, saddle necks, shelves, or pass geometry.
- Low-Energy Routes View includes heuristic route-window telemetry.
- Low-Energy Routes View does not yet read as a relay network topology.
- HUD and inspector panels can visually obscure the concept area, making subtle terrain or network structure hard to perceive.

This suggests the implementation followed the proposal's wording but lacked strict visual acceptance criteria.

## Recommended Model Split

Demo 0.2.7 should make a sharper split:

```text
Orbit View = scenario-filtered atlas, optionally with 3D visual framing
Gravity View = animated, quantified energy terrain
Low-Energy Routes View = static topology with dynamic edge state
```

This is different from treating both views as animated route diagrams.

## Orbit View Direction

Orbit View should remain the most stable spatial model, but it needs stronger scenario framing.

Recommended model class:

```text
Scenario-filtered approximate atlas
```

The current problem is that scenario selection can still feel like zooming into the same global atlas. Demo 0.2.7 should make each scenario decide which atlas layers are relevant by default.

Default layer behavior should become scenario-specific:

```text
scenario -> default visible layers
scenario -> emphasized objects
scenario -> muted or hidden irrelevant layers
```

The user may still re-enable layers manually, but the first view should express the scenario's scientific question.

Suggested defaults:

### Earth-Moon Gateway Logistics

Show by default:

- Earth
- Moon
- LEO Port
- Earth-Moon L1/L2
- lunar gateway / depot concepts
- local shuttle and cargo-ladder routes
- labels relevant to Earth-Moon logistics

Default atlas layer state:

```text
Planets: on
Nodes: on
Lagrange: on, scoped to Earth-Moon L1/L2 unless context is requested
Cyclers: off
Fast transfers: off
Low energy: on, scoped to Earth-Moon cargo ladder / gateway routes
Probes: off
Labels: on, scoped to active scenario objects
```

Hide by default:

- Ceres / belt markers
- Mars gateways
- probe orbits
- cycler orbits and cycler taxi markers
- unrelated fast interplanetary transfers
- unrelated Sun-Earth relay nodes unless needed as context

### Earth-Mars Service Corridor

Show by default:

- Earth
- Mars
- LEO Port
- Phobos / Deimos gateway concepts
- Aldrin-cycler-inspired service pattern
- fast transfer and taxi timing symbols
- relevant Earth-Mars windows

Hide or mute by default:

- Moon local logistics unless selected as context
- Ceres / belt routes
- Lagrange relay/storage nodes not involved in the service corridor
- probe orbits

### Lagrange Relay And Volatile Network

Show by default:

- Sun-Earth L1/L2/L4/L5
- Earth-Moon L1/L2
- relay and storage shelves
- Mars gateway shelf
- Ceres / volatile source
- slow-cargo route families
- depot / handoff nodes

Hide or mute by default:

- passenger-focused fast transfers
- probe orbits
- local surface shuttle details unless they connect to the relay chain

Optional 3D direction:

Each scenario can later receive a selective 3D visual framing, but 3D should remain a perspective layer over the same approximate / schematic atlas.

Safe claim:

```text
3D scenario perspective uses the same approximate atlas data.
It is visual framing, not a solved 3D ephemeris or inclination model.
```

3D should be considered only after layer filtering makes the 2D scenario clear. Otherwise 3D may make an unfocused atlas look more impressive without making it more coherent.

Visual acceptance criteria:

1. A user can identify the active scenario from the Orbit View without reading the active scenario button.
2. Unrelated atlas layers are hidden or muted by default.
3. Re-enabled context layers remain visually secondary to the scenario's route problem.
4. Orbit View remains the stable spatial reference and does not imply new astrodynamic fidelity.
5. If 3D is added, it is clearly labeled as visual perspective and does not become the default claim of the model.

## Gravity View Direction

Gravity View should become the main animated physical-intuition view.

Recommended model class:

```text
Scenario-normalized relative energy terrain
```

The view should show:

- closed contour wells around massive bodies
- shelf levels for orbital ports and gateway staging regions
- visible saddle / neck / pass geometry around Lagrange regions
- offstage solar background slope in Earth-Mars and Lagrange / volatile scenarios
- selected-route energy profile from well to shelf to saddle to corridor

Gravity View can be animated without making a strong mission-planning claim. The animation should represent changing relative terrain emphasis and route-window access, not exact astrodynamic solving.

Useful animation options:

- saddle neck opens or highlights when a route window is usable
- contour emphasis shifts as scenario phase changes
- route profile marker climbs from well to shelf to pass
- selected node pulses at its quantified energy level
- solar background slope subtly changes emphasis by scenario, not by drawing the Sun

Quantified fields:

```text
wellDepthProxy
escapeEnergyProxy
shelfHeightProxy
saddleThresholdProxy
solarSlopeProxy
routeEnergyClass
```

Possible simple formulas:

```text
wellDepthProxy = normalize(GM / r)
escapeEnergyProxy = normalize(v_escape^2 / 2)
shelfHeightProxy = normalized orbital or gateway energy tier
saddleThresholdProxy = hand-authored pass energy threshold
solarSlopeProxy = scenario background gradient strength
```

These fields do not need to be mission-grade. They need to be stable, inspectable, and visually mapped.

Visual acceptance criteria:

1. A user can identify at least one closed gravity well without reading the label.
2. A user can identify at least one Lagrange saddle / pass shape without reading the label.
3. A selected gateway shows a quantified energy tier or proxy value.
4. Solar influence in Earth-Mars and Lagrange / volatile scenarios appears as background slope, not as a giant visible Sun well.
5. The view no longer looks like Orbit View with a tilted grid.

## Low-Energy Routes View Direction

Low-Energy Routes View should stop trying to make route geometry itself feel dynamic.

Recommended model class:

```text
Relay topology with dynamic route-window state
```

The useful abstraction:

```text
nodes = stable relay / storage / depot / source / gateway roles
edges = stable route families
edge state = dynamic availability, wait, flow, capacity, reliability, suitability
```

The view should read like a network diagram or transport topology, not like another orbital trajectory view.

Node roles:

- gateway
- relay
- storage shelf
- depot
- source
- sink / demand node
- handoff node

Edge fields:

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

Dynamic behavior should be limited to edge state:

- active windows brighten the edge
- closed windows fade the edge
- flow proxy changes edge thickness or packet density
- wait time appears as a timeline marker or edge label
- reliability changes line style or confidence band

The route family geometry should remain stable. Dynamic state should explain whether that family is currently useful.

Visual acceptance criteria:

1. A user can identify the relay network topology without reading the inspector.
2. Nodes have visually distinct roles such as relay, depot, storage, and volatile source.
3. Edges are legible as route families, not precise trajectories.
4. At least one edge visibly displays availability, wait, and flow state.
5. The view is useful even when animation is paused.

## Scenario Implications

### Earth-Moon Gateway Logistics

Orbit View should focus on:

- Earth-Moon local atlas
- LEO, Moon, and Earth-Moon L1/L2
- local shuttle / cargo-ladder route classes
- no unrelated Mars, Ceres, probe, or belt clutter by default

Gravity View should focus on:

- Earth well
- Moon well
- LEO shelf
- Earth-Moon L1/L2 saddle pass
- surface access energy step

Low-Energy Routes View should focus on:

- LEO
- Earth-Moon L1/L2
- lunar gateway / depot
- Moon surface access
- local route cadence and wait

### Earth-Mars Service Corridor

Orbit View should focus on:

- Earth-Mars corridor atlas
- Earth, Mars, cycler service, and taxi burden markers
- relevant fast transfers and windows
- no unrelated Ceres / belt or Lagrange relay clutter by default

Gravity View should focus on:

- Earth departure well
- heliocentric background slope
- Mars capture well
- cycler / service window energy profile

Low-Energy Routes View should focus on:

- scheduled corridor topology
- Earth taxi burden
- Mars taxi burden
- synodic window state
- passenger / priority cargo suitability

### Lagrange Relay And Volatile Network

Orbit View should focus on:

- relay / depot / volatile network atlas
- Sun-Earth and Earth-Moon Lagrange nodes
- Mars gateway shelf
- Ceres / volatile source
- slow-cargo route families
- no passenger-focused fast transfer or probe clutter by default

Gravity View should focus on:

- offstage solar background slope
- Sun-Earth L1/L2 saddle passes
- Earth-Moon handoff pass
- storage shelves
- Mars gateway shelf
- Ceres / volatile source well or source node

Low-Energy Routes View should focus on:

- relay / storage / depot topology
- slow-cargo route families
- edge availability
- wait and flow state
- depot throughput and bulk-cargo suitability

## Options

### Option A: Patch Labels Only

Add more explanatory text to the current views.

Pros:

- low implementation cost
- preserves current structure

Cons:

- does not fix the core science-visual mismatch
- users still have to read the concept instead of seeing it
- Lagrange saddle and relay topology remain weak

Recommendation: reject.

### Option B: Implement Parameterized Visual Models

Build scenario-authored visual primitives for both views.

Gravity primitives:

```text
well, contour, shelf, saddle, slope, energy profile
```

Route topology primitives:

```text
node, role, edge, edge state, route family, telemetry label
```

Pros:

- realistic for Demo 0.2.7
- strong visual improvement
- keeps model claims honest
- supports quantitative proxies without requiring CR3BP
- can include scenario-specific Orbit View layer defaults without changing the physics engine

Cons:

- requires a careful visual design pass
- values are proxy values, not physical outputs
- layer presets may need thoughtful overrides so expert users can still inspect context

Recommendation: preferred.

### Option C: Introduce CR3BP-Based Views

Use Circular Restricted Three-Body Problem models for Lagrange-heavy views.

Pros:

- stronger scientific grounding for local Lagrange systems
- can eventually support real effective potential contours and manifold-inspired structures

Cons:

- too large for a corrective 0.2.7 pass
- requires choosing local two-primary systems
- risks overclaiming if only partially implemented
- does not automatically solve the full relay network

Recommendation: defer to research spike.

## Recommendation

Demo 0.2.7 should choose Option B:

```text
Parameterized visual models for Gravity View and Low-Energy Routes View.
```

The proposal should not expand the scenario list. It should correct the scientific visualization surfaces that 0.2.6 exposed as weak and make Orbit View behave like a scenario atlas rather than only a local zoom mode.

Primary implementation direction:

```text
Orbit View:
scenario-filtered atlas layers, with optional later 3D perspective

Gravity View:
animated quantified contour terrain

Low-Energy Routes View:
static relay topology with dynamic edge telemetry
```

This makes Demo 0.2.7 a visual-model alignment release, not a feature expansion release.

## Risks / Weak Assumptions

- Proxy values may be mistaken for physical simulation outputs if labeling is weak.
- Animated Gravity View can overstate physical rigor if contour motion looks too precise.
- A topology diagram may feel less spatial or cinematic than the current route view.
- Scenario-specific layer filtering may hide context that some reviewers expect, so manual layer controls should still exist.
- Premature 3D could make Orbit View feel more advanced without making the scenario clearer.
- HUD layout may hide the improved visuals unless the central concept area is protected.
- If both views keep the same camera framing, users may still read them as variants of Orbit View.

## Research Needed

No external research is required before a 0.2.7 spec if the team accepts proxy modeling.

Useful optional research:

- CR3BP visual references for future Lagrange contour work
- examples of transport network diagrams with dynamic edge state
- energy-profile visualizations used in orbital mechanics education
- examples of scenario-specific map layer presets and focus/context behavior

## Prototype Cut

Minimum useful 0.2.7 prototype:

1. Add scenario-specific default layer presets to Orbit View.
2. Hide or mute unrelated atlas layers by default for each scenario.
3. Replace Gravity View's coordinate/grid emphasis with contour-like terrain.
4. Add visible closed wells, shelves, and Lagrange saddle/pass necks.
5. Add quantified gravity / energy proxy values in the inspector.
6. Convert Low-Energy Routes View into a node-edge topology for each scenario.
7. Put dynamic state on topology edges, not on changing route geometry.
8. Ensure the central visual remains visible despite HUD and inspector panels.

Do not implement:

- CR3BP solver
- real manifold integration
- mission-grade delta-v
- new economic model
- new scenario set
- full 3D physics engine
- mandatory 3D Orbit View

## Success Criteria

Demo 0.2.7 succeeds if:

1. Orbit View uses scenario-specific layer defaults so unrelated atlas content is hidden or muted by default.
2. A user can identify the active scenario from the Orbit View's visible objects and routes.
3. Gravity View visibly reads as energy terrain before labels are read.
4. Lagrange regions visibly read as saddle / pass structures.
5. Gravity View exposes quantified well depth or energy proxy fields.
6. Low-Energy Routes View visibly reads as relay topology.
7. Low-Energy edge dynamics are limited to route-window state and telemetry.
8. Users can distinguish the three model lenses:
   - Orbit View: approximate spatial atlas
   - Gravity View: energy terrain
   - Low-Energy Routes View: route-family topology
9. The model labels still prevent mission-planning, CR3BP, or real 3D ephemeris claims.

## Open Questions

- Should Gravity View show a side energy-profile strip for the selected route, or keep all energy information in the terrain itself?
- Should route topology use one layout per scenario or a shared topology grammar across scenarios?
- Which proxy value should be primary in the inspector: escape-energy proxy, well-depth proxy, or normalized route-energy class?
- How much animation is enough for Gravity View without making it look like a solved physical field?
- Should 0.2.7 include a small visual reference panel explaining wells, shelves, and saddles, or should the visual carry that alone?
- Should Orbit View layer presets be hard scenario defaults or saved per-scenario user preferences?
- Should 3D Orbit View be deferred until after the 2D scenario atlas is visually clean, or should one scenario receive a 3D prototype in 0.2.7?

## When This Becomes A Spec

Convert this proposal into a Demo 0.2.7 spec when:

1. The team confirms that 0.2.7 is a science-visual alignment release.
2. Orbit View's scenario-specific layer presets are selected.
3. Gravity View's contour / saddle visual grammar is chosen.
4. Low-Energy Routes View's topology grammar is chosen.
5. The exact proxy fields exposed in the inspector are selected.
6. The layout protection for the central visual area is decided.
7. The implementation cut is small enough to verify in the running app.
