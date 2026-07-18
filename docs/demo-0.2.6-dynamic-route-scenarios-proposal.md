# Demo 0.2.6 Dynamic Route Scenarios Proposal

Target Version: Demo 0.2.6 proposal

## Problem

Demo 0.2.5 improves physical coherence: route claims, scale contracts, schematic boundaries, and cycler service semantics are clearer. That is useful, but the simulator still has a gap before Demo 0.3.0 can add economic pressure.

The gap is time.

Economic value in a transportation network depends on cadence, waiting, availability, reliability, route duration, and the difference between slow cheap routes and fast expensive routes. A static Low-Energy Routes View cannot provide enough information for that model.

The second gap is scenario framing. Current selectors such as Inner System, Earth Gateway, and Mars Gateway behave like scale/camera choices. They do not yet behave like playable route theaters.

Age of Sail analogy:

```text
The world map can be known, but the playable scenario is a concrete route theater:
Mediterranean trade, Atlantic crossing, Indian Ocean ports, or a specific harbor network.
```

Solar-system analogy:

```text
The solar system can be visible, but the playable scenario is Earth-Moon gateway logistics,
Earth-Mars service, or a Lagrange relay / volatile logistics network.
```

## North Star Fit

The project is becoming a gamified infrastructure simulator, not a conventional game demo.

Demo 0.2.6 should make the simulator more playable without adding a full economic model. It should turn the physical/route layer into a scenario surface that later economics can read.

The north-star question remains:

```text
Which routes, ports, and infrastructure cause civilization to grow?
```

Demo 0.2.6 asks a narrower precursor question:

```text
Which route patterns become usable under time, cadence, and gateway constraints?
```

## Science / Simulation Premise

Low-energy transfer corridors are valuable because they trade time and timing constraints for lower energy cost. For this prototype, the important scientific idea is not exact invariant manifold computation. The important idea is:

```text
The solar system has route opportunities that vary with time and geometry.
```

This should be interpreted carefully. The useful abstraction is not that the low-energy network is redrawn from scratch every frame. It is:

```text
nodes and route families are relatively stable;
availability, waiting, suitability, and flow are time-dependent.
```

Demo 0.2.6 should not claim to compute real manifolds. It can use schematic or heuristic time variation as long as the model label is explicit.

Suggested model class:

```text
Dynamic conceptual route model
```

This means:

- route availability changes over simulation time
- routes can have cadence, flow, and waiting cost
- low-energy route families can persist while their availability bands, flow packets, and telemetry change
- values are useful for explanation and later economics, not mission planning

## Game Design Premise

Scale modes should start becoming scenario entrances.

Current pattern:

```text
User chooses a scale -> camera changes.
```

Target pattern:

```text
User chooses a scenario -> the simulator frames a route problem.
```

Scale is still useful, but it becomes support:

```text
scenario = playable/inspectable problem
scale = camera / atlas view
```

## Recommended Scenarios

### Earth-Moon Gateway Logistics

Focus:

- LEO Port
- Moon
- Earth-Moon L1/L2
- lunar gateway / depot concepts

Playable question:

```text
How does gateway placement reduce surface and orbital logistics friction?
```

Useful route properties:

- launch cadence
- local shuttle frequency
- depot support
- waiting cost
- surface access friction

### Earth-Mars Service Corridor

Focus:

- Earth
- Mars
- Aldrin-cycler-inspired service pattern
- fast transfer classes
- taxi timing symbols

Playable question:

```text
How do scheduled windows and cycler-like service change Mars access?
```

Useful route properties:

- synodic cadence
- flyby windows
- taxi burden
- passenger vs cargo suitability
- schedule reliability

### Lagrange Relay And Volatile Network

Focus:

- Sun-Earth L1/L2/L4/L5
- Earth-Moon L1/L2
- Mars gateways
- Ceres
- Vesta / belt markers
- relay, observation, storage, and depot roles
- low-energy cargo corridors

Playable question:

```text
How do relay, storage, and slow-cargo corridors make non-planet nodes valuable?
```

Useful route properties:

- relay value
- storage value
- stability
- route handoff support
- low-energy corridor access
- slow cargo flow
- window availability
- depot throughput
- bulk cargo suitability
- time penalty

Deferred scenarios:

- Mars Gateway Operations can be treated as a focus inside Earth-Mars Service Corridor or Lagrange Relay And Volatile Network.
- Mars-Ceres / Asteroid Volatile Logistics is absorbed into the Lagrange / volatile scenario for 0.2.6.
- Lagrange Relay And Depot Network is no longer separate from volatile logistics because the relay model is most useful when it affects slow cargo and route availability.

## View Relationship

Demo 0.2.6 should treat scenarios as the main interaction entry.

```text
scenario = route problem / infrastructure question
view = model lens
scale = camera / focus support
```

Existing scale modes should be demoted rather than expanded:

- Solar System becomes an overview / atlas focus.
- Inner System becomes a camera preset or is covered by the first two scenarios.
- Earth Gateway is absorbed into Earth-Moon Gateway Logistics.
- Mars Gateway is absorbed into Earth-Mars Service Corridor and the Lagrange / volatile scenario.
- Ceres / Belt is absorbed into Lagrange Relay And Volatile Network.

Orbit View should remain the most stable model surface. A future 3D perspective can be added as a visual mode if it clearly reuses the same approximate / schematic model.

Gravity View should become scenario-bound:

```text
Scenario-normalized energy terrain
```

It should use contour-like energy terrain rather than x/y position axes. In Earth-Moon, the solar background can be treated as mostly common-mode. In Earth-Mars and Lagrange / volatile scenarios, solar gravity should appear as an offstage background energy slope without drawing the Sun as a dominant well. Lagrange regions should be shown as saddle / pass structures, not as gravity wells.

Low-Energy Routes View should then show how route families use those saddles and energy terrain over time.

## Dynamic Low-Energy Route Model

Demo 0.2.6 should make Low-Energy Routes visibly time-dependent without implying that it computes real transfer manifolds.

Possible visual techniques:

- pulsing corridors for availability windows
- moving cargo packets for slow flow
- faint persistent route-family corridors
- braided paths only when labeled as route families, not solved trajectories
- timeline markers for next useful window
- opacity changes for route suitability
- small labels for waiting time or cadence

Minimum viable model:

```text
routePhase = simulationTime + scenarioOffset
availability = wave(routePhase, cadence, dutyCycle)
flow = routeDemand * availability * routeSuitability
waitingCost = timeUntilNextAvailability * cargoUrgency
```

This model treats route topology as relatively stable and route usability as dynamic:

```text
nodes = stable conceptual network
edges = route families
availability = time-dependent
flow = scenario-dependent proxy
```

This does not need to be physically rigorous. It needs to expose the right variables for Demo 0.3.0:

- availability
- cadence
- travel time
- waiting cost
- reliability
- capacity proxy
- route suitability

## Proposed Interaction

Add a scenario selector:

```text
Scenario
Earth-Moon Gateway Logistics
Earth-Mars Service
Lagrange Relay And Volatile Network
```

When a scenario is selected:

- camera/scale shifts to the relevant theater
- relevant route layers become emphasized
- non-relevant layers fade or hide
- explanation text changes to the scenario question
- Low-Energy Routes show time-varying availability if relevant
- route telemetry shows cadence, wait, duration, and suitability

The scenario selector should become primary in 0.2.6. Scale controls may coexist as a simplified focus / camera support, but they should no longer be the main navigation model.

## Recommended Prototype Cut

Demo 0.2.6 should not implement the full economic pressure model.

Build only the dynamic route/scenario substrate:

- scenario selector
- scenario descriptions and active route focus
- time-varying Low-Energy Routes
- route telemetry fields for future economics
- simple route availability timeline
- moving packet or pulse animation for slow cargo flow
- scenario-bound Gravity View using conceptual energy contours
- clear model labels that this is a heuristic route model

## What This Enables For Demo 0.3.0

Demo 0.3.0 can then use 0.2.6 route telemetry as economic inputs:

```text
generalizedCost =
  energyCost
  + timeCost
  + windowPenalty
  + riskPremium
  + congestionPenalty
  + handlingCost
  - depotSupportBonus
```

0.2.6 should provide:

- timeCost
- windowPenalty
- availability
- travel time
- route suitability
- capacity proxy
- depot support hooks

Demo 0.3.0 can add demand, revenue potential, operating cost, capital cost, and infrastructure pressure on top.

## Risks / Weak Assumptions

- Dynamic corridors may look more physically authoritative than they are.
- Scenario selection may add UI complexity if it is layered on top of existing scale controls without simplification.
- Moving packets can make the app look like a logistics game before the model is ready.
- If "dynamic" is interpreted as dynamic manifold geometry, the model becomes much more complex than 0.2.6 needs.
- Low-energy dynamics can become misleading if the labels do not clearly state "heuristic / conceptual."
- The scenario list may grow too fast; 0.2.6 should keep the three recommended scenarios unless implementation feedback forces a cut.

## Science Advisor / Game Design Questions

- What visual metaphor best communicates low-energy transfer timing without pretending to solve manifolds?
- Should slow cargo be represented as packets, continuous flow, availability bands, or a combination of persistent route-family bands plus moving flow markers?
- How should urgency differ between passengers, high-priority cargo, and bulk cargo?
- Which route variables should be exposed to users and which should stay internal until Demo 0.3.0?
- How simple can the contour terrain be while still making Lagrange saddle / pass behavior legible?

## Out Of Scope

Do not implement:

- full economic model
- currency
- market prices
- player wallet
- settlement growth
- commodity production
- real invariant manifold computation
- full ephemeris pipeline
- authoritative cycler solving

## Success Criteria

Demo 0.2.6 succeeds if:

1. Low-Energy Routes visibly change over simulation time.
2. Users can tell that route availability, waiting, and flow are time-dependent.
3. Scenario selection frames concrete route/port problems rather than only camera scale.
4. Users can tell that route families are stable abstractions while availability and flow are dynamic.
5. Gravity View explains scenario energy terrain with wells, shelves, solar background slope, and Lagrange saddles.
6. The app preserves 0.2.5's physical coherence labels.
7. Route telemetry is ready to feed a Demo 0.3.0 economic pressure model.
8. The dynamic route model is clearly labeled as heuristic/conceptual.
9. The prototype feels more playable without becoming a conventional game loop.

## When This Becomes A Spec

Convert this proposal into a Demo 0.2.6 spec when:

1. The three recommended scenarios are confirmed or explicitly cut.
2. The dynamic Low-Energy Route visual metaphor is chosen.
3. The route telemetry fields needed by Demo 0.3.0 are selected.
4. The relationship between scenario selector, view selector, and scale/focus controls is decided.
5. The Gravity View contour model is scoped tightly enough to implement.
6. The implementation cut is small enough to verify in the running app.
