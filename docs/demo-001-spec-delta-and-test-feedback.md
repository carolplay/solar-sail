# Demo 001 Spec Delta and Test Feedback

This note records choices that are outside, narrower than, or more specific than `docs/demo-001-solar-infrastructure-viewer.md`, plus feedback discovered while manually testing the prototype.

## Out-of-Spec or Scope-Adjusted Choices

### Deployment Deferred

The spec asks for a public deployment. Demo 001 currently provides local build and preview scripts only:

- `npm run build`
- `npm run preview`

GitHub Pages deployment is intentionally deferred until the repository/account workflow is chosen. No GitHub Actions workflow has been added yet.

### Build Tooling Is Minimal

Instead of adding Vite or another bundler, the implementation uses plain Node scripts that copy static files into `dist/`. This keeps the app lightweight and avoids adding package dependencies before they are needed.

### Physics Is Approximate

Planetary motion uses browser-side Keplerian approximations. No SPICE, Horizons, Skyfield, Orekit, poliastro, or precomputed ephemeris table is used.

The model is documented in `docs/physics-engine-research.md`, but it should not be treated as an authoritative ephemeris.

### Mercury Was Added

Mercury was added after the initial spec review because the prototype is visually framing the inner system. This is a useful extension, but Mercury is not listed in the original Demo 001 required body set.

### Earth-Moon Lagrange Points Reduced

The original spec lists Earth-Moon L1 and L2. The implementation includes Earth-Moon L1 only, based on the later design clarification that Earth-Moon L1 is the relevant point for this version.

### Scale Modes Only Apply to Orbit View

The original spec says to add scale modes or zoom levels. In this implementation, scale modes apply only to Orbit View. Gravity Well View and Low-Energy Routes View are timestamped conceptual snapshots with their own camera controls.

This avoids confusing combinations such as "Mars Gateway" plus "Gravity Well View", where the static conceptual scene does not actually have subsystem-specific content.

### Static Views Became Interactive Snapshots

The spec allows Gravity Well View and Low-Energy Routes View to be static snapshots. The implementation keeps them conceptually static, but adds timestamp, drag/rotate/zoom, and modified-drag pan controls.

They are not time-evolving simulations.

### Low-Energy Routes View Is a Placeholder

The Low-Energy Routes View still does not provide the desired visual effect. It is only a symbolic pseudo-3D sketch of halo loops and tube-like paths, inspired by transfer-manifold and Interplanetary Transport Network concepts.

To satisfy the intended visual target, a later version likely needs one of:

- a circular restricted three-body problem renderer
- precomputed stable/unstable manifold geometry
- an offline-generated mesh/tube dataset loaded as static JSON
- a dedicated 3D rendering layer, probably Three.js

### Cycler and Shuttle Dynamics Are Conceptual

The Aldrin cycler cadence was corrected to the common simplified description: roughly one Earth-Mars synodic period per cycle and about 146 days from Earth to Mars.

The shuttle transfers remain conceptual. They are schedule and infrastructure markers, not physically solved rendezvous trajectories.

## Test Feedback Incorporated

### Desktop HUD Overlap

Initial desktop screenshots showed the view-mode controls overlapping the title panel. The controls were moved lower so the header, mode switcher, and scale switcher have clear separation.

### Concept View Title Collision

The first conceptual views placed title text partly underneath the left HUD. Concept titles were moved into the open center/right canvas area.

### Legend Collision in Concept Views

The normal orbit legend competed with the conceptual-view explanatory legend. The orbit legend is now hidden in Gravity Well View and Low-Energy Routes View.

### Mobile Layout Collision

Mobile testing showed the inspector overlapping the view/scale controls. The mobile layout now stacks header, mode switcher, scale switcher, inspector, and playback controls in that order.

### Concept View Interactions

Manual browser testing verified:

- Gravity Well View shows a snapshot date.
- Subsystem scale buttons are disabled in concept views.
- Returning to Orbit View re-enables scale buttons.
- Drag and wheel interactions affect the conceptual pseudo-3D scene.
- No browser console errors were observed during these checks.

### Local Preview Permission

The sandbox blocks local port binding without network permission. The preview server worked after local network permission was granted for the turn.

## Test Commands Used

Because `node` and `npm` were not on the regular shell path, tests were run with the bundled Node runtime:

```bash
/Users/guoya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
/Users/guoya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/build.mjs
```

The app was then tested through the local preview server at:

```text
http://127.0.0.1:4173
```

## Known Follow-Ups

- Add the GitHub Pages workflow once the repository target is chosen.
- Replace the Low-Energy Routes placeholder with a real or precomputed manifold-inspired visualization.
- Consider a real 3D rendering layer for the concept views.
- Add automated screenshot tests for desktop and mobile breakpoints.
- Split the large `app.js` into modules before adding more simulation behavior.
