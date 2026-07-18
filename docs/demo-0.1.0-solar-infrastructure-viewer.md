# Demo 0.1.0 — Solar Infrastructure Viewer

Target Version: Demo 0.1.0

## Goal

Upgrade Demo 0.0.0 from a stylized orbit animation into a more physically grounded solar-system infrastructure visualizer.

This is still **not gameplay**. It is a visualization/research prototype for building intuition around:

- planetary motion
- gravity wells
- transfer windows
- cycler routes
- low-energy route corridors
- logistics nodes such as LEO, Lagrange points, Phobos, Deimos, Ceres, and Sun–Earth Lagrange points

The core question:

> Does the Solar System feel like an ocean of energy terrain, routes, gateways, and infrastructure nodes rather than a flat map of planets?

---

## Scope Philosophy

Demo 0.1.0 should improve physical credibility without becoming a full orbital-mechanics research project.

Important simplification:

- **Orbit View** should update continuously.
- **Gravity Well View** may be rendered as a static snapshot when entered.
- **Low-Energy Routes View** may also be rendered as a static conceptual snapshot when entered.
- Gravity wells and transfer manifolds are allowed to be simplified / approximate / illustrative.

The aim is to communicate useful intuition, not to calculate perfect trajectories.

---

## 1. Physics / Ephemeris Research

Before implementation, create a short research note:

```text
docs/physics-engine-research.md
```

Research options for more realistic planetary motion and orbit rendering:

- NASA/JPL ephemeris / SPICE
- JPL Horizons data
- Skyfield
- Orekit
- poliastro
- lightweight browser-side Keplerian approximation
- offline precomputed ephemeris tables

Decision preference:

- Keep the browser demo lightweight.
- Prefer credible planetary positions over perfect spacecraft navigation.
- If full browser-side ephemeris is too heavy, generate precomputed JSON data offline and load it in the web app.
- For Demo 0.1.0, using approximate Keplerian elements is acceptable if clearly documented.

Deliverable:

```text
docs/physics-engine-research.md
```

It should include:

- options considered
- implementation complexity
- browser feasibility
- accuracy tradeoffs
- recommendation for Demo 0.1.0

---

## 2. Real Web Deployment

Deploy the demo to a public URL so it can be viewed from other devices.

Preferred options:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Requirements:

```bash
npm run build
npm run preview
```

The deployed version should be accessible outside localhost.

---

## 3. Multiple View Modes

Add a view mode switcher:

```text
[Orbit View] [Gravity Well View] [Low-Energy Routes View]
```

### 3.1 Orbit View

This is the main real-time view.

Show:

- Sun
- Earth
- Mars
- Ceres
- major orbital paths
- Earth L4 / L5
- Sun–Earth L1 / L2 / L4 / L5 if feasible
- Aldrin / Earth–Mars cycler
- shuttle transfers
- route classes

This view should animate continuously.

### 3.2 Gravity Well View

A simplified energy-map view.

Purpose:

> Show that distance and travel cost are not the same thing.

This can be a static conceptual rendering generated when the user enters the mode.

Suggested representation:

```text
Earth Surface
  ↓ deep gravity well
LEO
  ↓
Earth-Moon L1/L2
  ↓
Interplanetary Transfer
  ↓
Mars / Phobos
  ↓
Ceres / Asteroid Belt
```

This view should emphasize:

- gravity wells
- gateway nodes
- energy cost
- why LEO, Phobos, and Ceres matter

It does not need to be physically exact.

### 3.3 Low-Energy Routes View

A simplified “space ocean current” view.

Purpose:

> Show low-energy corridors as a kind of solar-system current / trade wind system.

This can also be a static conceptual rendering generated when the user enters the mode.

Show:

- Lagrange gateways
- low-energy corridors
- stable/unstable transfer tube concepts as stylized curves
- slow/cheap vs fast/expensive route classes
- possible connection between Earth system, Mars system, and Ceres

It does not need true manifold computation in Demo 0.1.0.

Terminology note:

```text
Low-Energy Routes View
```

is the user-facing name. It can be documented as inspired by invariant manifolds and the Interplanetary Transport Network, but Demo 0.1.0 should not imply that it computes real manifold geometry.

---

## 4. Multi-Scale Zoom

Add scale modes or zoom levels:

```text
Solar System
Inner System
Earth Gateway
Mars Gateway
Ceres / Asteroid Belt
```

Objects should appear, hide, or simplify depending on zoom level.

### 4.1 Solar System View

Show the broad network:

- Sun
- Earth
- Mars
- Ceres
- asteroid belt arc
- major route classes

### 4.2 Inner System View

Show:

- Earth
- Mars
- Ceres if within framing
- Earth–Mars cycler
- major transfer paths

### 4.3 Earth Gateway View

Show:

- Earth
- LEO Port
- Moon
- Earth-Moon L1
- Earth-Moon L2
- Earth L4
- Earth L5
- Sun-Earth L1
- Sun-Earth L2
- Sun-Earth L4
- Sun-Earth L5 if feasible

### 4.4 Mars Gateway View

Show:

- Mars
- Phobos Port
- Deimos Deep Space Port
- Mars orbit
- Mars cycler connection point
- shuttle routes between Mars surface, Phobos, and cycler

### 4.5 Ceres / Asteroid Belt View

Show:

- Ceres
- asteroid belt arc
- optional Vesta placeholder
- planned/possible cargo drift routes
- role as water / volatile / logistics hub

---

## 5. NASA-Inspired Art Direction

Use a scientific visualization style inspired by NASA public tools such as NASA Eyes and the NASA solar viewer.

Style goals:

- dark space background
- restrained glow
- clean labels
- mission-control style panels
- scientific / calm / legible
- avoid arcade neon
- clear route legend
- good contrast at different zoom levels

Target mood:

```text
NASA mission-control adjacent
scientific but approachable
calm rather than flashy
```

---

## 6. Infrastructure Nodes

Add or prepare the data model for the following nodes.

### Earth System

- Earth
- LEO Port
- Moon
- Earth-Moon L1
- Earth-Moon L2
- Earth L4
- Earth L5

Suggested roles:

```text
LEO Port: Earth gravity-well exit, assembly, refueling
Earth-Moon L1: lunar transfer gateway
Earth-Moon L2: deep-space staging / comms
Earth L4/L5: stable industrial / settlement / storage zones
```

### Sun–Earth System

- Sun-Earth L1
- Sun-Earth L2
- Sun-Earth L4
- Sun-Earth L5

Suggested roles:

```text
Sun-Earth L1: solar observation / warning / power monitoring
Sun-Earth L2: deep-space telescope / navigation / communication
Sun-Earth L4/L5: stable industrial, data, or storage infrastructure zones
```

### Mars System

- Mars
- Phobos Port
- Deimos Deep Space Port

Suggested roles:

```text
Phobos Port: Mars gateway, orbital port, maintenance, fuel transfer
Deimos Deep Space Port: outer Mars gateway, asteroid-belt departure node
```

### Asteroid Belt

- Ceres
- asteroid belt arc
- optional Vesta placeholder

Suggested Ceres role:

```text
Ceres: water / volatile resource hub, asteroid-belt logistics gateway
```

---

## 7. Route Classes

Add route categories.

```text
Cycler Line
Shuttle Transfer
Fast Transfer
Low-Energy Transfer
Planned Route
```

Suggested visual language:

```text
Cycler Line: gold dashed orbit
Shuttle Transfer: short green arc
Fast Transfer: sharp bright arc
Low-Energy Transfer: faint curved blue/purple corridor
Planned Route: thin dotted grey line
```

Purpose:

> Make it clear that the Solar System has different “kinds of routes,” not one generic spaceship path.

---

## 8. Object Inspection Panel

Clicking any object should show:

```text
Name
Type
Role
Parent system
Current position / phase
Next event
Connected routes
Infrastructure potential
```

Example:

```text
Phobos Port
Type: Mars Gateway
Role: orbital port / maintenance / fuel transfer
Parent system: Mars
Connected routes:
- Mars Surface Shuttle
- Earth-Mars Cycler Transfer
- Deimos Deep Space Route
Infrastructure potential: High
```

---

## 9. Static Snapshot Rule for Complex Views

Gravity Well View and Low-Energy Routes View may be expensive or conceptually complex.

For Demo 0.1.0:

- They do not need to update continuously.
- They can render once when entered.
- They can use simplified, symbolic, or stylized geometry.
- They should clearly communicate that they are conceptual / approximate.
- They should not block work on Orbit View.

This keeps Demo 0.1.0 achievable.

---

## 10. Out of Scope

Do not implement yet:

- economy
- resources
- population growth
- player actions
- multiplayer
- real route optimization
- true manifold computation
- true spacecraft navigation
- combat
- settlement simulation

Demo 0.1.0 is still a visualization and research prototype.

---

## Success Criteria

Demo 0.1.0 succeeds if:

1. Planetary motion feels more physically credible than Demo 0.0.0.
2. The demo is publicly accessible online.
3. Users can switch between Orbit, Gravity Well, and Low-Energy Routes views.
4. Users can understand why LEO, Lagrange points, Phobos, Deimos, and Ceres matter.
5. Cycler and shuttle routes feel like infrastructure, not just moving icons.
6. Different scale levels make gateway nodes easier to understand.
7. The codebase remains ready for later simulation/game layers.

---

## Implementation Note

Do not try to solve every physics problem in Demo 0.1.0.

Recommended approach:

```text
Realistic enough planetary motion
+
Conceptual gravity-well view
+
Conceptual low-energy-routes view
+
Clear infrastructure-node visual language
```

The purpose of this version is to make the Solar System feel like:

> an ocean of gravity wells, currents, ports, and routes.
