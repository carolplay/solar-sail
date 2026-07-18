# Demo 0.2.0 - Physics Contract and Route Atlas

Target Version: Demo 0.2.0

## Goal

Demo 0.2.0 should make the viewer honest about its physics.

Demo 0.1.0 proved that a solar-system infrastructure viewer is visually compelling, but it also exposed a core problem: the current prototype mixes real orbital concepts, approximate browser-side physics, symbolic local layouts, and conceptual teaching diagrams without clearly separating them.

Demo 0.2.0 should establish a clear physics contract:

```text
What is physically modeled?
What is approximate?
What is schematic?
What is only a conceptual explanation?
```

The second goal is to begin turning the solar system into a route atlas: a map of meaningful logistics nodes, transfer families, energy levels, probes, depots, and recurring corridors.

This is still not a game. It is a stronger research and visualization prototype.

## Core Question

Can the viewer explain why a route, node, or orbit matters without pretending every displayed element is mission-grade astrodynamics?

## Design Principles

- Be more physically explicit, not merely more visually complex.
- Separate ephemeris-like views, schematic infrastructure views, and conceptual physics views.
- Keep the Age of Sail metaphor: windows, currents, ports, depots, gateways, and scheduled routes.
- Treat cyclers as the most important interplanetary infrastructure example, but do not fake confidence where research is still incomplete.
- Make the app useful as a reference artifact, not just an animation.

---

## 1. Physics Model Contract

Add an explicit model label to each view.

Suggested labels:

```text
Ephemeris-like
Schematic
Conceptual
Research Placeholder
```

These labels should appear in the HUD or inspection panel so users understand what kind of truth the current view is claiming.

### Orbit View

Model class:

```text
Ephemeris-like / approximate
```

Purpose:

- show the current or selected-date configuration of major bodies
- keep the main solar-system map visually grounded
- avoid arbitrary phase choices where possible

Requirements:

- Define a clear epoch, such as `2026-07-09`.
- Document the time span covered by the model.
- Replace arbitrary phase values with either:
  - generated ephemeris tables, or
  - documented Keplerian elements tied to a known epoch
- Clearly state that spacecraft trajectories are not mission-optimized.

Preferred implementation path:

```text
Offline ephemeris generation -> compact JSON -> browser interpolation
```

Candidate tools:

- JPL Horizons export
- Skyfield
- SPICE as a later high-credibility path

### Gateway / Local Scale Views

Model class:

```text
Schematic
```

Purpose:

- make local infrastructure legible
- show hierarchy between planet, orbit, moon, Lagrange region, port, depot, and shuttle route

Requirements:

- Do not imply true physical scale when local layouts are exaggerated.
- Add a visible indicator such as:

```text
Local schematic scale - distances exaggerated for readability
```

- Distinguish between:
  - low orbit
  - moon orbit
  - Lagrange region
  - surface access
  - deep-space departure

### Gravity Well View

Model class:

```text
Conceptual / research placeholder
```

Purpose:

- teach that distance and energy cost are not the same thing
- show why gravity wells shape logistics

Problem in Demo 0.1.0:

The view communicates the idea, but the 2D/pseudo-3D presentation is not strong enough. It does not yet produce a real sense of terrain, slope, saddle, or energy surface.

Demo 0.2.0 requirement:

- Continue research toward a real 3D gravity-well visualization.
- Decide whether the next implementation should use Three.js.
- Prefer an interactive 3D surface where users can rotate, zoom, and compare Earth, Moon, Mars, Phobos, Deimos, and Ceres wells.
- If the final Demo 0.2.0 implementation remains conceptual, label it clearly.

### Low-Energy Routes View

Model class:

```text
Conceptual / research placeholder
```

Purpose:

- teach low-energy corridors as the solar-system equivalent of currents and trade winds
- introduce Lagrange gateways, invariant-manifold inspiration, halo/Lyapunov orbit families, and slow cargo corridors

Problem in Demo 0.1.0:

The view is not yet visually or physically convincing. It suggests the idea, but it does not help users really understand transfer manifolds.

Demo 0.2.0 requirement:

- Continue research on circular restricted three-body problem visualization.
- Investigate:
  - CR3BP effective potential surfaces
  - zero-velocity curves / surfaces
  - halo and Lyapunov orbit families
  - stable and unstable manifold tubes
  - precomputed static geometry for browser rendering
- Decide whether the route view should become a real 3D scene.
- Keep the user-facing name:

```text
Low-Energy Routes View
```

but document the scientific inspiration:

```text
invariant manifolds / Interplanetary Transport Network
```

---

## 2. Cycler Research and Upgrade

Cyclers remain the best near-term example of interplanetary scheduled infrastructure.

Demo 0.1.0 currently treats the Aldrin cycler as a stylized repeating ellipse with schedule markers. That is useful as a metaphor, but not physically strong enough.

Demo 0.2.0 should research and improve this.

### Research Questions

- What is the simplest honest way to represent an Earth-Mars cycler?
- Which parts of an Aldrin cycler can be shown without solving a full trajectory?
- How should the viewer represent the difference between:
  - the cycler habitat trajectory
  - Earth taxi rendezvous
  - Mars taxi rendezvous
  - high delta-v taxi legs
  - flyby timing
- Should the cycler be rendered as:
  - a known repeating corridor
  - a sampled precomputed path
  - a schematic schedule lane
  - a research placeholder

### Requirements

- Rename or label the current cycler as an approximation if it remains stylized.
- Add a cycler explanation panel entry.
- Show the cycler as infrastructure, not merely as a moving vehicle.
- Separate:

```text
Cycler orbit
Taxi transfer
Planetary flyby window
```

- Add a note that real cycler taxis require substantial maneuvering and are not represented by simple short arcs.

### Possible Deliverables

- `docs/cycler-research.md`
- improved cycler data model
- cycler route class toggle
- inspection-panel explanation of cycler limitations
- optional precomputed cycler path experiment

---

## 3. Logistics Nodes and Orbit Toggles

Demo 0.2.0 should begin defining additional key logistics points and orbit families.

The goal is not to show every possible object. The goal is to let users selectively reveal layers of solar-system infrastructure and energy context.

### Node Families

Add or prepare data structures for:

- planetary bodies
- natural satellites
- low orbit ports
- Lagrange gateways
- fuel depots
- relay stations
- deep-space ports
- asteroid resource hubs
- probe or science mission trajectories
- recurring logistics corridors

### Candidate Additions

Earth system:

- LEO Port
- GEO / high Earth orbit marker
- Earth-Moon L1
- Earth-Moon L2
- lunar orbit / lunar gateway marker

Sun-Earth system:

- Sun-Earth L1
- Sun-Earth L2
- Sun-Earth L4/L5

Mars system:

- low Mars orbit
- Phobos Port
- Deimos Deep Space Port
- Mars-Sun Lagrange candidates as future placeholders

Asteroid belt:

- Ceres
- Vesta
- Pallas or Hygiea as optional later markers
- water / volatile logistics hubs

Outer system, research-only:

- Callisto Gateway
- Jupiter system radiation boundary note

### Probe / Mission Orbit Layers

Add optional toggles for non-logistics orbits that teach different energy regimes.

Candidate examples:

- Parker Solar Probe style solar dive orbit
- Solar Orbiter style inclined solar orbit
- James Webb / Sun-Earth L2 halo-region marker
- asteroid rendezvous probe path
- Mars transfer probe path
- Jupiter gravity-assist path as later research

These should be clearly labeled as educational orbit examples, not infrastructure routes.

### Toggle Requirements

Add layer controls for:

```text
Planets
Infrastructure Nodes
Lagrange Regions
Cycler Lines
Fast Transfers
Low-Energy Routes
Probe Orbits
Science Missions
Labels
```

Controls should avoid covering the main canvas, especially on mobile.

---

## 4. Wikipedia-Style Explanation Mode

Demo 0.2.0 should generate a reference-style explanation surface inside the app.

Purpose:

- make the prototype self-explanatory
- help users understand what each route, node, orbit, and view means
- turn the demo into a shareable educational artifact

### Requirements

Add a Wikipedia-like information panel, article drawer, or linked explanation mode.

It should include entries for:

- Orbit View
- Gravity Well View
- Low-Energy Routes View
- LEO Port
- Earth-Moon L1/L2
- Sun-Earth L1/L2/L4/L5
- Phobos Port
- Deimos Deep Space Port
- Ceres
- Cycler
- Hohmann transfer
- low-energy transfer
- launch window
- fuel depot
- gateway

Each entry should include:

- short definition
- why it matters for infrastructure
- what the demo models
- what the demo simplifies
- links or citations where appropriate

### Tone

The writing should feel like a compact encyclopedia, not marketing copy.

Example shape:

```text
Phobos Port

Phobos is the larger and inner moon of Mars. Because it has very low gravity and orbits close to Mars, it is often discussed as a useful staging point for Mars surface access, maintenance, and refueling.

In this demo, Phobos Port is shown as a schematic Mars gateway. Its exact position and transfer costs are not mission-accurate.
```

---

## 5. 3D Visualization Research

The two new Demo 0.1.0 concept views are not yet strong enough.

Demo 0.2.0 should decide whether 3D is required for the next major visual leap.

### Gravity Well 3D Research

Investigate:

- Three.js surface rendering
- heightfield terrain for effective potential
- multiple wells in one scene
- exaggerated vertical scale controls
- labels anchored to 3D points
- mobile interaction limits

### Low-Energy Routes 3D Research

Investigate:

- Three.js tube geometry
- precomputed manifold tube datasets
- CR3BP reference implementations
- rendering halo/Lyapunov loops
- showing stable vs unstable families
- using simplified 3D curves before full physics

### Research Deliverable

Create:

```text
docs/3d-physics-view-research.md
```

It should recommend one of:

- keep 2D and improve visual language
- add Three.js for concept views only
- add a full 3D scene architecture
- generate precomputed 3D data offline

---

## 6. Mobile Layout Upgrade

Demo 0.1.0 is usable on mobile, but the panels cover too much of the main view.

Demo 0.2.0 should treat mobile as a real design target, not just a responsive afterthought.

### Problems

- inspector panel blocks too much canvas
- controls compete with the main view
- scale and mode buttons consume vertical space
- concept view explanations cover the visuals they are explaining

### Requirements

- Move inspector content into a bottom sheet on mobile.
- Simplify mobile view modes. Mobile does not need to expose Gravity Well View or Low-Energy Routes View by default.
- Treat Gravity Well View and Low-Energy Routes View as desktop/tablet-first research views unless a mobile-specific 3D design proves usable.
- Mobile can prioritize:

```text
Orbit View
Route Atlas
Explanation
```

- Bottom sheet states:

```text
collapsed
peek
expanded
```

- Keep the default mobile state mostly canvas-first.
- Use compact icon or segmented controls where possible.
- Let users temporarily hide all panels.
- Keep schedule and Wikipedia-style explanation content out of the default canvas view.

Success condition:

On a phone viewport, the main solar-system view should remain the primary experience, not a background behind panels. It is acceptable for mobile to offer fewer view modes than desktop.

---

## 7. Updated View Set

Demo 0.2.0 should keep the three main desktop views, but make their model status explicit.

```text
Orbit View
Gravity Well View
Low-Energy Routes View
```

Mobile may expose a reduced view set:

```text
Orbit View
Route Atlas
Explanation
```

Possible secondary modes:

```text
Route Atlas
Explanation
```

Do not add a large gameplay interface yet.

---

## 8. Out of Scope

Do not implement yet:

- player construction
- economy
- settlement growth
- resource extraction
- revenue simulation
- multiplayer
- combat
- full mission optimization
- authoritative spacecraft navigation

Demo 0.2.0 is a foundation pass: physics credibility, route meaning, explainability, and layout quality.

---

## Demo 0.2.0 Delivery Cut

Demo 0.2.0 should prioritize trust-building over deep simulation.

The executable Demo 0.2.0 scope is:

- explicit model labels for every major view and selected object
- documented orbital epoch, model time span, and approximation limits
- route-atlas data structures for nodes, route families, layers, and explanation entries
- layer toggles for the most important infrastructure and route classes
- a cycler presentation that clearly separates cycler orbit, taxi transfer, and flyby window
- Wikipedia-style explanation entries for the core nodes, routes, and concepts
- mobile layout changes that keep the canvas primary, including a bottom-sheet inspector
- a 3D physics-view research note that recommends the next technical path

Demo 0.2.0 should not require:

- a production ephemeris pipeline
- JPL Horizons, Skyfield, or SPICE integration
- real CR3BP manifold generation
- real mission optimization
- Three.js implementation of gravity wells or manifold tubes
- complete probe and science-mission coverage
- outer-system logistics visualization beyond research placeholders

If planetary positions are not generated from an ephemeris table, Demo 0.2.0 may use documented Keplerian elements tied to a clear epoch. If concept views remain 2D or pseudo-3D, they must be labeled as conceptual or research placeholders.

## Demo 0.2.5 Deferrals

Demo 0.2.5 is the follow-up pass for items that need research, data generation, or a larger rendering architecture.

Candidate Demo 0.2.5 work:

- decide whether to add Three.js for concept views only or create a fuller 3D scene architecture
- prototype an interactive 3D gravity-well surface
- prototype simplified 3D low-energy route tubes inspired by invariant manifolds
- generate compact offline ephemeris JSON for browser interpolation
- research sampled Earth-Mars cycler paths beyond the current stylized ellipse
- evaluate CR3BP reference implementations and precomputed static geometry
- expand probe/science mission layers after the base layer system is stable
- revisit mobile interaction if 3D views become part of the product experience

Demo 0.2.5 should still avoid claiming mission-grade astrodynamics unless the data and model support that claim.

---

## Success Criteria

Demo 0.2.0 succeeds if:

1. Users can tell which parts are ephemeris-like, schematic, conceptual, or research placeholders.
2. Planetary positions are tied to a documented epoch or generated ephemeris dataset.
3. Cycler visualization is more honest and better explained.
4. Logistics nodes and route/orbit families can be toggled by layer.
5. Probe or science mission orbits help explain different energy regimes.
6. The app includes Wikipedia-style explanations for key concepts.
7. Gravity Well and Low-Energy Routes views have a clear 3D research path or first 3D implementation.
8. Mobile no longer feels dominated by panels.

## Implementation Note

Demo 0.2.0 should not chase perfect astrodynamics. It should build trust.

The right outcome is:

```text
This is not mission software,
but I understand exactly what kind of model I am looking at.
```
