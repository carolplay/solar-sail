# Demo 0.2.6 Dynamic Route Scenarios Feedback

Target Version: Demo 0.2.6

## Implemented

- App identity updated to Demo 0.2.6.
- Added primary scenario selector:
  - Earth-Moon Gateway Logistics
  - Earth-Mars Service Corridor
  - Lagrange Relay And Volatile Network
- Scenario selection now changes route problem copy, atlas focus, emphasized nodes / routes, route telemetry, and default inspection target.
- Orbit View remains the canonical atlas surface and keeps the physical coherence contract labels for frame, scale, and route claim.
- Added heuristic dynamic route-window telemetry with cadence, duty cycle, reliability proxy, capacity proxy, suitability, wait proxy, waiting cost, and flow proxy.
- Low-Energy Routes View now presents stable route families with dynamic availability / flow markers and explicit heuristic labeling.
- Gravity View now uses scenario-normalized terrain primitives: wells, shelves, saddle passes, and background slopes.
- Mobile layout keeps scenario selection and Orbit View primary, hides the layer panel, and treats concept views as secondary.
- Follow-up before merge improved local preview ergonomics, package version metadata, and schedule readability.

## Spec Comparison

The constrained spec was mostly met.

The strongest match is the scenario substrate: the app now treats scenarios as route theaters rather than only scale presets. Route-family inspection is also ready for Demo 0.3.0-style economic pressure inputs, while still avoiding prices, wallets, settlement growth, or commodity markets.

The Low-Energy Routes View meets the intended visual metaphor in prototype form: stable route-family corridors persist, while availability brightness and moving packets vary over simulation time. These are still conceptual route families, not solved trajectories.

The Gravity View was refactored away from a generic placeholder into parameterized scenario terrain. The terrain is normalized per scenario and explains wells, shelves, saddles, and solar background slope without claiming a solved potential field.

## Deviations / Scope Adjustments

- Earth-Moon L2 is not added as a separate node because the current data model only had Earth-Moon L1. The UI groups Earth-Moon L1/L2 in Gravity View copy where needed.
- Mobile concept views are simplified aggressively. On narrow screens Orbit View remains the only exposed mode by default; this follows the spec's permission to hide or collapse concept views, but it may be too hidden for review users who want to compare lenses on mobile.
- Route-window numbers are deliberately heuristic and hand-authored. They are suitable for explanation and later economic pressure experiments, not for mission planning.
- Visual inspection used local browser checks and screenshots, but no automated pixel regression test was added.

## Verification

- `scripts/run-node.sh --check app.js` passed. The wrapper uses local `node` when present and falls back to Codex bundled Node only when `node` is not on PATH.
- `scripts/run-node.sh scripts/build.mjs` passed and rebuilt `dist/`.
- Local preview ran at `http://127.0.0.1:4174`.
- Desktop browser check confirmed Demo 0.2.6 identity, all three scenario buttons, scenario switching, route telemetry, and Low-Energy Routes heuristic labels.
- Mobile browser check at 390 x 844 confirmed scenario buttons remain available, layer panel is hidden, Orbit View remains primary, and the header no longer overlaps the language controls.

## Follow-Up Verification

- `package.json` version metadata is now `0.2.6`.
- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/`.
- `npm run preview -- --port 4186` now starts on `http://127.0.0.1:4186` instead of ignoring the CLI port and trying 4173.
- When 4186 is already occupied, a second preview process auto-increments to `http://127.0.0.1:4187`.
- `PORT=...` remains supported as the environment fallback when no CLI `--port` is passed.
- Browser verification at `http://127.0.0.1:4186` confirmed Demo 0.2.6 identity, no console errors, and schedule grouping.
- Schedule rows are now grouped into `Scenario route windows` and `Shuttle schedule`, with scenario rows listed first and visually emphasized.

## Gaps / Deferred Items

- No CR3BP, true manifolds, 3D orbit rendering, ephemeris upgrade, or economic model was implemented.
- Scenario route values are not calibrated against physical references.
- Mobile may need a better secondary access pattern for Gravity View and Low-Energy Routes View in a later UX pass.
- The Lagrange Relay And Volatile Network is visually useful but still has the weakest physical grounding because several relay/storage relationships are schematic.
- Preview auto-increment is intentionally simple and only searches upward from the requested port.

## Recommendation

Demo 0.2.6 is a useful substrate for Demo 0.3.0 planning. The next proposal/spec cycle should decide how route telemetry becomes economic pressure without turning the prototype into a fake market model too early.
