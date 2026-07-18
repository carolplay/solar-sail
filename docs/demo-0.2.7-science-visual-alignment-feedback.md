# Demo 0.2.7 Science Visual Alignment Feedback

Target Version: Demo 0.2.7

## Implemented

- Updated app identity and package metadata to Demo 0.2.7 / version `0.2.7`.
- Added scenario-specific Orbit View layer presets:
  - Earth-Moon defaults to planets, nodes, Lagrange, low-energy, and labels; cyclers, fast transfers, and probes are off.
  - Earth-Mars defaults to planets, nodes, cyclers, fast transfers, and labels; unrelated Lagrange, low-energy, and probes are off.
  - Lagrange Relay / Volatile defaults to planets, nodes, Lagrange, low-energy, and labels; cyclers, fast transfers, and probes are off.
- Kept the manual layer controls available on desktop, so reviewers can re-enable context after the scenario default is applied.
- Strengthened Gravity View as conceptual energy terrain:
  - closed contour rings around terrain wells
  - visible shelf bands
  - saddle / neck pass geometry
  - solar background slope emphasis
  - well-to-shelf-to-pass route profile cue
- Added Gravity View proxy inspector fields:
  - `wellDepthProxy`
  - `escapeEnergyProxy`
  - `shelfHeightProxy`
  - `saddleThresholdProxy`
  - `solarSlopeProxy`
  - `routeEnergyClass`
- Reworked Low-Energy Routes View into a relay topology:
  - stable nodes with gateway, relay, storage shelf, depot, source, sink / demand node, and handoff roles
  - stable route-family edges
  - dynamic edge brightness, thickness, packet density, wait labels, and flow labels
- Kept route telemetry explicitly heuristic and non-mission-grade.
- Follow-up correction: LEO Port now advances around Earth faster than the Moon in Earth Gateway scale, while keeping the distance exaggerated as a local schematic cue.
- Follow-up correction: Gravity View no longer uses XY-style terrain grid lines or a special saddle marker. It now relies on contour lines, soft terrain color wash, and local contour necking around saddle regions.
- Follow-up correction: Gravity View contour lines now come from one continuous proxy potential field instead of separate hand-drawn well and saddle overlays. The extra dashed well-to-shelf cue was removed to avoid competing with the contour language.
- Follow-up correction: Gravity View contour levels were densified so the Lagrange saddle / pass neck is easier to read from continuous contour shape rather than from a special marker.
- Follow-up addition: massive-body wells now expose a fixed `EEU` value, where Earth surface escape energy is `1.00 EEU`. This separates fixed body well depth from scenario-normalized terrain proxies.
- Follow-up addition: Gravity View now includes a fixed well-depth comparison gauge. The `EEU` bar values stay fixed while the animated scan cue helps compare body well depths without implying changing gravity.
- Follow-up correction: Gravity View now uses the demo's approximate orbital positions to place fixed-depth body wells each frame. The contour field updates over time from those moving well sources while `EEU` values remain fixed.
- Follow-up correction: LEO Port and other shelf / pass markers are explicitly massless in Gravity View. They may move as orbital state markers, but only massive bodies contribute fixed-depth well sources to the contour field.
- Follow-up correction: Gravity View now respects atlas layer visibility for markers. Planets controls massive well markers, Nodes controls massless infrastructure / shelf markers such as LEO Port, Lagrange controls pass markers, and Labels controls marker labels.
- Follow-up correction: Massless shelf / pass markers no longer contribute lift or color wash to the Gravity View potential field. The contour field is driven by moving massive-body wells plus the static scenario background term, so LEO orbital motion no longer changes the contours.

## Acceptance Check

- App identifies itself as Demo 0.2.7: passed.
- `package.json` version is `0.2.7`: passed.
- Orbit View applies scenario-specific layer defaults: passed.
- Active scenario is visible from Orbit View emphasis: passed for the three existing scenarios.
- Gravity View reads as energy terrain before labels: passed in local desktop review.
- At least one gravity well and Lagrange saddle / pass are recognizable: passed.
- Gravity View exposes proxy energy values with non-mission-grade labeling: passed.
- Low-Energy Routes View reads as relay topology: passed.
- Low-Energy edges communicate availability, wait, and flow: passed.
- The three view lenses are visually distinct: passed.
- Desktop panels do not obscure the main concept area: passed after wrapping concept-title text to avoid the inspector.
- Mobile is no worse than Demo 0.2.6: passed; mobile keeps scenario selection and Orbit View usable, while secondary concept modes remain hidden on narrow screens.

## Verification

- `npm run check` passed.
- `npm run build` passed.
- Local preview ran at `http://127.0.0.1:4187`.
- Desktop browser check used a 1440 x 900 viewport.
- Mobile browser check used a 390 x 844 viewport.
- Desktop review covered all three scenarios and all three view modes.
- Browser console check reported no errors.
- Screenshot checks confirmed nonblank canvas output.
- Mobile review confirmed scenario switching still works in Orbit View, layer panel remains hidden, controls fit, and no console errors were reported.
- Follow-up browser check confirmed LEO Port position changes around Earth over successive frames / dates in Earth Gateway scale.

## Gaps / Deferred

- Gravity terrain remains hand-normalized and conceptual. It is not CR3BP, not a solved potential field, not ephemeris-driven, and not mission-grade delta-v.
- Low-Energy topology uses heuristic route-window values. It does not solve manifolds or real launch windows.
- Mobile still does not expose a full concept-view comparison flow. This follows the 0.2.7 constraint to avoid the separate mobile redesign.
- Scenario layer presets reset when switching scenarios. This is acceptable for default scenario framing, but a later UX pass may preserve a user-modified custom layer state separately.
- The Lagrange / volatile visual model is clearer than 0.2.6, but its physical grounding is still the weakest because several relay/storage relationships are schematic.

## Recommendation

Planning should accept Demo 0.2.7 as an implementation of the visual alignment spec.

Suggested follow-up: carry the remaining mobile concept-view access and any stronger physics calibration into a later scoped proposal. Do not expand this release into economics or real trajectory solving.
