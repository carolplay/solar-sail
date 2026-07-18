# Demo 0.2.6 Physics View Model Research

Target Version: Demo 0.2.6 research input

Audience: Project lead / planning role

## Purpose

This note summarizes the Science Advisor discussion around Orbit View, Gravity View, Low-Energy Routes View, and possible future physics engines.

The main recommendation is to separate three concerns:

```text
view = how the user inspects a scenario
model = what physical abstraction supports the view
claim = what the UI is allowed to imply
```

Demo 0.2.6 does not need a higher-fidelity astrodynamics engine to become more useful. It needs clearer model boundaries and scenario-bound views. More advanced physics models, especially CR3BP, can unlock stronger Lagrange and manifold views later, but they should not be accidentally implied by visual polish.

## Current View Roles

### Orbit View

Orbit View is the most stable current view. It can remain the canonical map surface.

Recommended model:

```text
Approximate 2D orbital atlas
```

The current two-dimensional browser-side orbital approximation is enough for the main Orbit View. A 3D perspective can be added as a visual mode, but it should reuse the same approximate / schematic route data.

Safe claim:

```text
3D perspective uses the same approximate route atlas.
Vertical separation is visual, not a solved inclination model.
```

What this unlocks:

- better first-read spatial intuition
- stronger presentation of relay and gateway networks
- richer scenario framing without changing the physics contract

What it should not claim:

- real 3D ephemerides
- real orbital inclination solving
- mission-grade geometry

### Gravity View

Gravity View should become scenario-bound rather than a second map with x/y axes.

Recommended model:

```text
Scenario-normalized energy terrain
```

The view should use contour-like energy terrain:

- planetary bodies as local wells
- orbiting ports as shelves on a well
- Lagrange regions as saddle / pass structures
- low-energy corridors as paths through passes
- solar gravity as an offstage background slope when relevant

This is more useful than a global absolute gravity-well view because absolute solar potential would dominate the visual scale and hide local logistics structure.

Scenario treatment:

- Earth-Moon Gateway Logistics: solar background can be treated as mostly common-mode; emphasize Earth well, Moon well, LEO shelf, and Earth-Moon L1/L2 saddle.
- Earth-Mars Service Corridor: include heliocentric background slope as transfer terrain; do not draw the Sun as a huge well in the view.
- Lagrange Relay And Volatile Network: solar background slope becomes central; Lagrange saddles, relay shelves, and slow-cargo corridors become the main concept.

Safe claim:

```text
Conceptual contour view of relative energy terrain.
Not a solved gravitational potential field.
```

What this unlocks:

- clearer explanation of why gateways matter
- better transition from Orbit View to Low-Energy Routes View
- visually legible Lagrange saddle concepts
- route-cost explanations without pretending to compute delta-v

### Low-Energy Routes View

Low-Energy Routes View should not be interpreted as animated real transfer manifolds.

Recommended model:

```text
Stable route-family network with dynamic availability
```

The useful abstraction:

```text
nodes = relatively stable gateway / relay / depot network
edges = route families
availability = time-dependent
flow = scenario-dependent proxy
```

Low-energy transfer trades energy for time and timing constraints. In a simulator context, the network topology can be presented as relatively stable while route usability changes with time.

Dynamic elements should therefore emphasize:

- next useful window
- wait time
- travel time class
- cadence
- duty cycle
- suitability
- reliability proxy
- capacity proxy
- slow-cargo flow proxy

Safe claim:

```text
Heuristic route-window model.
Route families are conceptual; availability and flow are dynamic.
```

What this unlocks:

- direct telemetry inputs for Demo 0.3.0 economic pressure
- a more honest low-energy transfer interface
- slow cheap cargo scenarios without full trajectory solving
- clearer distinction between route structure and route timing

## CR3BP Explanation

CR3BP means:

```text
Circular Restricted Three-Body Problem
```

It models two massive bodies moving in circular orbits around their shared center of mass, plus a third body whose mass is small enough that it does not affect the first two.

Examples:

- Sun-Earth-spacecraft
- Earth-Moon-spacecraft
- Sun-Mars-spacecraft

CR3BP matters because it naturally produces Lagrange points and the energy structures around them. In the rotating reference frame, L1 and L2 behave like saddle regions rather than ordinary destinations or wells.

Concepts CR3BP can support:

- L1/L2/L3/L4/L5 locations in a defined two-primary system
- effective potential contours
- Jacobi constant
- zero-velocity curves
- halo and Lyapunov orbit families
- stable and unstable manifolds
- local transfer gateway explanations

## What CR3BP Could Unlock

### Stronger Gravity View

A CR3BP-based Gravity View could show effective potential contours and saddle behavior for a selected local system:

```text
Earth-Moon CR3BP
Sun-Earth CR3BP
Sun-Mars CR3BP
```

This would make Lagrange saddle / pass behavior much more scientifically grounded.

Unlocked scenario value:

- Earth-Moon Gateway Logistics can show why Earth-Moon L1/L2 are gateway passes.
- Lagrange Relay And Volatile Network can show why relay points are not ordinary stations on a flat map.

### Stronger Low-Energy Routes View

A CR3BP research prototype could generate or approximate route tubes around halo / Lyapunov orbits.

Unlocked scenario value:

- route families can be shown as manifold-inspired tubes rather than purely hand-drawn corridors
- availability windows can be tied to phase and energy level more plausibly
- Lagrange relay networks become more than symbolic graph edges

### Better Model Honesty

CR3BP could reduce the gap between visual language and physical claim for Lagrange-heavy views.

However, it only helps when the view is explicitly local to one two-primary system. It does not automatically solve a full solar-system logistics network.

## Why CR3BP Should Not Be Demo 0.2.6's Main Engine

CR3BP adds real complexity:

- each model must choose a two-primary system
- coordinates are usually normalized
- the useful frame is rotating, not the current orbit map frame
- Jacobi constant and zero-velocity curves need explanation
- manifold routes require numerical integration or precomputed data
- stitching Earth-Moon, Sun-Earth, Sun-Mars, and Mars-belt contexts is nontrivial

It also risks overclaiming. A polished CR3BP-like visual can make users believe the simulator is computing real mission trajectories.

Demo 0.2.6 needs a scenario substrate, not a full astrodynamics upgrade.

## Model Options

### Level 1: Parameterized Conceptual Terrain

Recommended for Demo 0.2.6.

Use hand-authored or parameterized primitives:

```text
well: center, depth, radius
shelf: position, height, role
saddle: position, orientation, neck width
slope: direction, strength
corridor: path, energy class, availability cadence
```

Complexity: low to medium  
Simulation fidelity: low  
Teaching value: high  
Demo 0.2.6 fit: strong

This can make Gravity View and Low-Energy Routes View much clearer without pretending to solve physics.

### Level 2: Approximate Sampled Potential

Possible later enhancement.

Use a grid and simplified potential terms:

```text
potential = backgroundSlope + sum(-GM / softenedDistance)
```

Then draw approximate contours.

Complexity: medium  
Simulation fidelity: medium-low  
Teaching value: medium to high  
Demo 0.2.6 fit: optional research spike, not required

Risk: without a rotating-frame model, Lagrange saddle behavior will not naturally appear correctly.

### Level 3: CR3BP / Jacobi Contours

Future research option.

Use a true CR3BP model for selected local systems and draw effective potential / Jacobi contour structures.

Complexity: high  
Simulation fidelity: high for local three-body contexts  
Teaching value: high  
Demo 0.2.6 fit: too heavy for the main cut

This is the right direction only if the project wants a more serious Lagrange / manifold engine.

## Recommendation To Project Lead

For Demo 0.2.6, use:

```text
Parameterized scenario-normalized energy terrain
+ stable route-family network
+ dynamic route-window telemetry
```

This supports the three recommended scenarios:

- Earth-Moon Gateway Logistics
- Earth-Mars Service Corridor
- Lagrange Relay And Volatile Network

It also keeps the simulator honest:

- Orbit View remains the canonical approximate atlas.
- Gravity View explains wells, shelves, slopes, and saddles.
- Low-Energy Routes View explains route families, windows, waiting, and slow flow.

CR3BP should be treated as a future research track:

```text
CR3BP-inspired visual language now;
CR3BP simulation only after a dedicated research spike.
```

## Open Questions

- Should the Gravity View contour terrain be implemented as hand-authored shapes or generated from a small field function?
- Should a 3D Orbit View be included in 0.2.6, or deferred to avoid competing with scenario navigation work?
- Which local CR3BP system would be the best future research spike: Earth-Moon or Sun-Earth?
- Should Low-Energy Routes View show availability bands, moving flow packets, or both?
