# Demo 0.2.6 Dynamic Route Scenarios Spec

Target Version: Demo 0.2.6

## Readiness Decision

Demo 0.2.6 is ready to hand to implementation with a constrained cut.

The Science Advisor proposal is accepted with these implementation choices:

- Use three scenarios.
- Make scenarios the primary navigation model.
- Keep Orbit View as the canonical atlas surface.
- Implement Gravity View as parameterized scenario-normalized energy terrain.
- Implement Low-Energy Routes View as stable route families with dynamic availability, waiting, and flow.
- Do not implement CR3BP, real manifold solving, 3D orbit rendering, or an economic model.

## Goal

Turn Demo 0.2.5's physical coherence layer into a scenario-based route substrate that can later support Demo 0.3.0 economic pressure.

Core question:

```text
Which route patterns become usable under time, cadence, and gateway constraints?
```

## Required Scenarios

Implement three scenarios:

1. Earth-Moon Gateway Logistics
2. Earth-Mars Service Corridor
3. Lagrange Relay And Volatile Network

Each scenario should define:

- name
- short route problem
- active focus / camera target
- emphasized node ids
- emphasized route ids
- recommended view lens
- route telemetry values
- explanation article or scenario copy

### Earth-Moon Gateway Logistics

Question:

```text
How does gateway placement reduce surface and orbital logistics friction?
```

Primary nodes:

- Earth
- LEO Port
- Moon
- Earth-Moon L1
- Earth-Moon L2 if available in the current data model

Primary route ideas:

- launch cadence
- local shuttle frequency
- depot support
- waiting cost
- surface access friction

### Earth-Mars Service Corridor

Question:

```text
How do scheduled windows and cycler-like service change Mars access?
```

Primary nodes:

- Earth
- Mars
- Aldrin-cycler-inspired service marker
- Phobos Port
- Deimos Deep Space Port

Primary route ideas:

- synodic cadence
- flyby windows
- taxi burden
- passenger vs cargo suitability
- schedule reliability

### Lagrange Relay And Volatile Network

Question:

```text
How do relay, storage, and slow-cargo corridors make non-planet nodes valuable?
```

Primary nodes:

- Sun-Earth L1/L2/L4/L5 as available
- Earth-Moon L1/L2 as available
- Mars gateways
- Ceres
- Vesta / belt markers

Primary route ideas:

- relay value
- storage value
- route handoff support
- low-energy corridor access
- slow cargo flow
- window availability
- depot throughput
- bulk cargo suitability
- time penalty

## Interaction Requirements

### Scenario Selector

Add a primary scenario selector with the three scenarios.

The selector should be more prominent than scale controls. Existing scale controls may remain as focus/camera support, but should no longer read as the main navigation model.

When a scenario changes:

- update active scenario copy
- update camera/focus
- emphasize relevant nodes and routes
- fade or de-emphasize unrelated layers
- update route telemetry
- update the default inspected object or route

### View Relationship

Use this model:

```text
scenario = route problem / infrastructure question
view = model lens
scale = camera / focus support
```

Orbit View remains the canonical approximate route atlas.

Gravity View should use the selected scenario to choose its conceptual terrain.

Low-Energy Routes View should use the selected scenario to choose route families, availability bands, and flow markers.

### Mobile Cut

On mobile, keep the primary experience simpler:

- scenario selection remains available
- Orbit View remains primary
- Gravity View and Low-Energy Routes View may be hidden, collapsed, or treated as secondary explanation surfaces
- panels should not cover most of the canvas by default

Do not spend Demo 0.2.6 trying to make all concept views equally complete on mobile.

## Dynamic Route Model

Implement a heuristic route-window model.

Required fields per dynamic route family:

- id
- scenario id
- route family name
- from / to or path nodes
- travel time class
- cadence
- duty cycle
- phase offset
- reliability proxy
- capacity proxy
- route suitability
- cargo/passenger suitability label

Minimum model:

```text
routePhase = simulationTime + scenarioOffset + routeOffset
availability = wave(routePhase, cadence, dutyCycle)
waitingCost = timeUntilNextAvailability * cargoUrgency
flow = scenarioDemand * availability * routeSuitability * capacityProxy
```

The exact numeric values can be heuristic. They must be labeled as conceptual.

## Visual Requirements

### Low-Energy Routes View

Show:

- faint persistent route-family corridors
- pulsing availability bands
- moving packets or flow markers for slow cargo
- next-window or wait-time labels
- route telemetry panel or compact row

Do not show:

- direct thick point-to-point lines as if they are solved trajectories
- real manifold / CR3BP claims
- precise mission-planning values

### Gravity View

Implement parameterized scenario-normalized energy terrain.

Use primitives such as:

```text
well: center, depth, radius
shelf: position, height, role
saddle: position, orientation, neck width
slope: direction, strength
corridor: path, energy class, availability cadence
```

Gravity View should explain:

- wells
- shelves
- saddle / pass structures
- background energy slope when relevant
- why gateways matter

It should not claim to draw a solved gravitational potential field.

### Orbit View

Add scenario emphasis without replacing the current route atlas.

Orbit View should:

- keep Demo 0.2.5 physical coherence labels
- highlight scenario nodes and routes
- keep route claim taxonomy visible
- show scenario-specific route telemetry where useful

## Copy / Claim Requirements

The UI must preserve explicit model honesty.

Use labels such as:

```text
Heuristic route-window model
Route families are conceptual; availability and flow are dynamic.
Conceptual contour view of relative energy terrain.
Not a solved gravitational potential field.
```

Avoid language that implies:

- real invariant manifolds
- mission-grade trajectory solving
- real CR3BP computation
- real economic simulation

## Out Of Scope

Do not implement:

- full economic model
- currency
- market prices
- player wallet
- settlement growth
- commodity production
- real invariant manifold computation
- CR3BP / Jacobi contour engine
- full ephemeris pipeline
- authoritative cycler solving
- 3D orbit rendering

## Verification Plan

Verify:

1. The app identifies itself as Demo 0.2.6.
2. The three scenario options exist and can be selected.
3. Scenario selection changes emphasis, copy, telemetry, and focus.
4. Orbit View preserves Demo 0.2.5 physical coherence labels.
5. Low-Energy Routes View shows time-varying availability and/or flow.
6. Users can distinguish stable route families from dynamic route availability.
7. Gravity View shows scenario-normalized energy terrain with wells/shelves/saddles/slopes.
8. The UI labels the route model as heuristic/conceptual.
9. Mobile keeps Orbit View and scenario selection usable without panel domination.
10. `node --check app.js` passes.
11. `node scripts/build.mjs` passes.

## Known Risks Carried From Proposal

- Dynamic corridors may look more authoritative than the model supports.
- Scenario navigation may make the existing scale controls confusing unless scale is visually demoted.
- Moving flow packets may imply a logistics game loop before the economic model exists.
- Gravity View can become misleading if contour terrain is too visually polished without clear labels.
- Three scenarios may still be too much for one implementation pass; if needed, cut Lagrange Relay And Volatile Network to a lighter preview while keeping the data shape.

## Implementation Handoff

Recommended implementation order:

1. Add scenario data model and selector.
2. Wire scenario selection into existing scale/focus and inspector behavior.
3. Add route telemetry fields and heuristic availability calculations.
4. Add Low-Energy Route dynamic visual markers.
5. Refactor Gravity View into scenario-normalized terrain.
6. Simplify mobile concept-view exposure.
7. Run verification and write Demo 0.2.6 feedback.
