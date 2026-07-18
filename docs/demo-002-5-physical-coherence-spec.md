# Demo 002.5 Physical Coherence Spec

Target Version: Demo 002.5

## Goal

Implement the first physical coherence pass from `docs/demo-002-5-physical-coherence-proposal.md`.

Demo 002.5 should make the running viewer clearer about:

- the coordinate frame currently being shown
- whether local distances are physical or schematic
- what each route line claims
- whether cycler visuals are an orbit, a schedule, or a symbolic service layer
- whether concept views are diagrams rather than computed physics

This is not a full physics-engine upgrade. It is a visual and data-contract upgrade.

## Requirements

### 1. Version Marker

The app should identify itself as:

```text
Demo 002.5
```

### 2. View Contract HUD

The HUD should show:

```text
Frame
Scale
Routes
```

For Orbit View, these values should derive from the active scale mode.

For concept views, these values should make clear that the view is a diagram, not a spatial or computed physics surface.

### 3. Scale Contracts

Each scale mode should carry a contract:

- Solar System: heliocentric map, approximate AU distances, atlas overlays
- Inner System: heliocentric map, approximate AU distances, atlas overlays
- Earth Gateway: planet-local schematic, exaggerated distances, local service categories
- Mars Gateway: planet-local schematic, exaggerated distances, local service categories
- Ceres / Belt: regional/belt schematic, not exact local layout, cargo corridor classes

### 4. Schematic Boundary

Local schematic scales should render a visible frame or boundary that states:

```text
Local offsets are layout symbols, not physical distances.
```

This should reduce the impression that local gateway offsets are exact orbital positions.

### 5. Route Claim Taxonomy

Route-like elements should carry and expose a claim type:

```text
Transfer class
Conceptual corridor
Planning link
Service schedule
Science example
```

The inspector should show both:

```text
Route claim
Geometry
```

when a selected object or route has those fields.

### 6. Route Visual Distinction

Route line styles should visually separate:

- approximate physical orbit geometry
- transfer class
- service schedule
- conceptual corridor
- planning link
- science example

The Orbit View should include a compact route-claim legend on desktop.

### 7. Cycler Restyle

The cycler should no longer read primarily as a precise solved ellipse.

The existing stylized orbit may remain as a faint reference, but the stronger visual should be a service schedule lane showing recurring Earth and Mars flyby windows.

The cycler inspector should continue to state that taxi arcs are timing symbols, not rendezvous trajectories.

### 8. Concept View Boundaries

Gravity Well View and Low-Energy Routes View should remain labeled as conceptual / research placeholders. Demo 002.5 does not need to implement Three.js or CR3BP geometry.

### 9. Concept View Coherence Pass

Gravity Well View should avoid arranging Earth, Moon, and Mars as a straight-line ladder. Even as a concept diagram, the view should use one shared topology for:

- well anchors
- saddle/gateway nodes
- contour/grid sampling
- labels

The potential surface should look dense and smooth enough to read as terrain rather than a sparse wire sketch.

Low-Energy Routes View should avoid direct, thick point-to-point links. Corridors should render as smooth braided paths with multiple control points, so the visual language says "route family / corridor topology" rather than "straight connection."

This is still not a physics-engine upgrade. It is a coherence correction to prevent the conceptual views from contradicting the orbit view.

## Out Of Scope

Do not implement:

- offline ephemeris JSON
- Three.js
- real CR3BP manifolds
- mission optimization
- authoritative cycler trajectories
- economy
- gameplay

## Verification

Verify:

1. `node --check app.js` passes.
2. `node scripts/build.mjs` passes.
3. The app loads locally.
4. The HUD shows Demo 002.5 and Frame / Scale / Routes.
5. Earth Gateway or Mars Gateway shows a schematic boundary.
6. Route lines have visibly different styles.
7. Cycler service schedule appears on desktop solar/inner views.
8. Selecting route-like objects shows route claim and geometry when available.
9. Mobile layout remains usable and avoids overlapping primary controls.
10. Gravity Well View does not place Earth, Moon, and Mars gateway elements in a straight line.
11. Low-Energy Routes View renders smooth corridor families rather than coarse straight links.
