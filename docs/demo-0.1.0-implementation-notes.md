# Demo 0.1.0 Implementation Notes

Target Version: Demo 0.1.0

This note tracks how the implementation maps to `docs/demo-0.1.0-solar-infrastructure-viewer.md`.

For explicit out-of-spec choices, known gaps, and manual test feedback, see `docs/demo-0.1.0-spec-delta-and-test-feedback.md`.

## Implemented In This Pass

- Added `npm run build` and `npm run preview` scripts through plain Node scripts.
- Added Orbit View, Gravity Well View, and Low-Energy Routes View controls.
- Kept Orbit View animated continuously.
- Added pseudo-3D conceptual rendering for Gravity Well View and Low-Energy Routes View.
- Added snapshot timestamps for Gravity Well View and Low-Energy Routes View.
- Added drag/rotate/zoom support for conceptual snapshots. Wheel zooms the pseudo-3D scene; drag rotates; modified drag pans.
- Added scale modes: Solar System, Inner System, Earth Gateway, Mars Gateway, and Ceres / Belt.
- Added Mercury and infrastructure nodes for LEO Port, Moon, Earth-Moon L1, Sun-Earth L1/L2/L4/L5, Phobos Port, Deimos Deep Space Port, Mars cycler connection, Ceres, Vesta, and Ceres Drift Hub.
- Added route classes for Cycler Line, Shuttle Transfer, Fast Transfer, Low-Energy Transfer, and Planned Route.
- Expanded object inspection to include type, role, parent system, position/phase, next event, connected routes, infrastructure potential, and ETA where applicable.
- Documented the physics/simulation model in `docs/physics-engine-research.md`.
- Added camera-style animated transitions when switching scale modes.

## Deliberate Simplifications

- Planetary motion uses approximate Keplerian elements rather than JPL/SPICE ephemerides.
- The Aldrin cycler is still stylized, but its cadence now follows the rough one-synodic-period / 146-day Earth-to-Mars simplification.
- Local gateway geometry is symbolic at small scales so nodes remain visible and useful.
- Gravity wells are pseudo-3D qualitative effective-potential terrain, not delta-v charts.
- Transfer manifolds are pseudo-3D stylized tube families, not computed invariant manifolds.
- Low-Energy Routes View still does not provide the desired full visual effect. A better engine is needed for real circular restricted three-body problem surfaces, halo/Lyapunov orbit families, and stable/unstable manifold tubes.
- Deployment workflow is not added yet because GitHub Pages upload/account setup is deferred.

## Spec Decisions Captured

- Physics should be documented rather than made mission-accurate in this version.
- The date epoch is not important yet, so the existing future visualization framing remains.
- Earth-Moon L1 is the only Earth-Moon Lagrange point represented in this version.
- Sun-Earth L1/L2/L4/L5 are represented where useful.
- Scale modes now apply only to Orbit View. Conceptual views are static timestamped snapshots with their own camera controls.

## Follow-Up Candidates

- Add a GitHub Pages workflow once the repository target is chosen.
- Add generated ephemeris JSON if the prototype needs stronger planetary-position credibility.
- Replace the manifold sketch with a dedicated CR3BP/manifold rendering engine or precomputed manifold dataset.
- Split the large `app.js` into data, physics, rendering, and UI modules if Demo 0.2.0 grows the codebase.
- Add automated browser screenshot checks for each view and scale mode.
