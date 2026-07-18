# Project Direction After Demo 001

Target Version: Roadmap after Demo 001

This note captures the design direction from the post-Demo 000 / Demo 001 brainstorm. It is a north-star document, not an implementation checklist.

## Process Note

Future planning work should default to proposals before specs.

Use proposals for brainstorm output, research synthesis, option analysis, and version direction. Convert a proposal into a spec only after the implementation cut is clear, weak assumptions have been researched or explicitly deferred, and success criteria are testable.

See `docs/proposal-workflow.md`.

## Core Thesis

The project is not about simulating space as scenery. It is about simulating how physical constraints shape civilization.

Three working principles:

- Solar-system settlement is not the aviation age. It is closer to the Age of Sail.
- The player should not build cities directly. The player should build the routes, ports, depots, and gateways that let cities emerge.
- Civilization is not made of planets. It is made of settlements, gateways, infrastructure nodes, routes, warehouses, refueling points, orbital towns, and mobile cities.

## Origin

The earliest idea came from observing large alliance-driven SLG games. Their monetization incentives are not the point, but their social structure is useful:

- limited social circles
- alliances
- local identity
- server separation
- cross-server contact
- history, memory, betrayal, and cooperation

That mapped naturally onto a sub-light civilization model:

- one server resembles one colony or settlement
- cross-server contact resembles interstellar contact
- social scale is local rather than globally synchronized
- a civilization can be large while each person lives inside a limited social horizon

The first project phrase was:

```text
Sub-light multi-planet civilization
```

The deeper design goal was:

```text
Do not simulate space itself. Simulate how space shapes civilization.
```

## Pivot: From MMO To Infrastructure

The MMO civilization version is too large to cold-start. The more testable first step is a solar-system transportation infrastructure simulator.

Instead of:

```text
Build cities -> then build roads
```

the project should test:

```text
Build routes -> settlements naturally grow
```

This separates the project from a normal space empire game. It is not:

```text
Build a space empire.
```

It is:

```text
Build the infrastructure that allows a civilization to emerge.
```

## Age Of Sail Metaphor

Near-future solar-system expansion is not like flying from A to B. It is shaped by launch windows, transfer energy, gravity wells, Lagrange regions, depots, ports, and recurring routes.

Useful analogies:

| Age of Sail | Solar-system infrastructure |
| --- | --- |
| Trade winds | Hohmann windows |
| Ocean currents | Low-energy transfers / Interplanetary Transport Network |
| Ports | LEO, Phobos, Ceres |
| Supply stations | Fuel depots |
| Packet ships | Cyclers |
| Straits and sea lanes | Lagrange gateways |
| Shipping companies | Space logistics authorities / companies |

The visual target is a solar system that feels like an ocean of gravity wells, energy terrain, ports, currents, and routes.

## Settlement Network

The unit of civilization is not "planet server." The better unit is:

```text
Settlement / Gateway / Infrastructure Node
```

Candidate node types include:

- Earth
- LEO Port
- Moon
- Earth-Moon L1/L2
- Earth L4/L5
- Sun-Earth L1/L2/L4/L5
- Mars
- Phobos Port
- Deimos Deep Space Port
- Ceres
- Cycler mobile settlement
- Callisto Gateway
- asteroid mining hubs

A star system can have only a few major planets and still support many meaningful social and logistics nodes.

## Demo Roadmap

### Demo 000: Solar Network Viewer

Goal: test whether a living solar-system transportation network is visually compelling.

Status: completed as a first pass.

### Demo 001: Solar Infrastructure Viewer

Goal: make the network more physically credible and easier to inspect across multiple conceptual views.

Primary ideas:

- more credible planetary motion
- public deployment
- Orbit View
- Gravity Well View
- Low-Energy Routes View
- scale modes for Solar System, Inner System, Earth Gateway, Mars Gateway, and Ceres / Asteroid Belt
- NASA-inspired scientific visualization style
- infrastructure nodes such as LEO, Lagrange points, Phobos, Deimos, and Ceres
- route classes such as Cycler Line, Shuttle Transfer, Fast Transfer, Low-Energy Transfer, and Planned Route

Terminology:

```text
Low-Energy Routes View
```

is preferred over:

```text
Transfer Manifold View
```

The view can mention invariant manifolds and the Interplanetary Transport Network as inspiration, but Demo 001 does not calculate real manifolds.

### Demo 002: Physics Contract and Route Atlas

Goal: make the viewer honest about its physics and begin turning it into a reference atlas for routes, nodes, energy regimes, and infrastructure meaning.

Primary ideas:

- define which views are ephemeris-like, schematic, conceptual, or research placeholders
- tie planetary positions to a documented epoch or generated ephemeris dataset
- continue cycler research and stop treating the current stylized ellipse as physically sufficient
- add more logistics nodes and optional orbit layers
- add toggles for infrastructure nodes, Lagrange regions, cycler lines, low-energy routes, probe orbits, and science missions
- add Wikipedia-style explanatory entries for key concepts
- research real 3D gravity-well and low-energy-route visualizations
- improve mobile so panels no longer dominate the main canvas

Execution cut:

- Demo 002 is the trust and atlas pass, not the full physics-engine pass.
- It should ship model labels, documented approximations, layer toggles, explanation entries, cycler honesty, and mobile layout improvements.
- It may use documented Keplerian elements tied to an epoch instead of a full ephemeris pipeline.
- 3D gravity wells, CR3BP manifold tubes, SPICE/Skyfield/JPL data pipelines, and sampled cycler trajectories should be researched but not required for Demo 002 completion.

### Demo 002.5: Physical Coherence Pass

Goal: make the viewer physically coherent at each scale before adding economic pressure or deeper 3D physics.

Primary ideas:

- define a coordinate and scale contract for heliocentric, planet-local, route-atlas, and conceptual views
- distinguish physical geometry, schematic local layout, service schedule, route class, and teaching diagram
- make route-line meaning explicit so users know whether a line is a path, a service pattern, or a concept
- revisit the cycler so it reads as scheduled infrastructure rather than a confident exact ellipse
- decide whether concept views remain primary modes or become secondary explanation/research surfaces
- optionally scope ephemeris JSON or Three.js spikes only after the model contract is clear
- keep all advanced physics claims visibly tied to their actual model and data provenance

See `docs/demo-002-5-physical-coherence-proposal.md`.

### Demo 003: Network Metrics / Infrastructure Potential

Goal: begin explaining why some places naturally become ports, depots, towns, or gateway settlements, including the first economic pressures that make infrastructure valuable.

Primary ideas:

- traffic potential
- route cost
- travel time
- launch window frequency
- route reliability
- depot value
- gateway centrality
- settlement potential
- cargo demand
- passenger demand
- maintenance burden
- capital cost
- operating cost
- route revenue potential
- risk premium

Demo 003 should not yet be a full tycoon game. It should make the system able to explain why Phobos, Deimos, Ceres, LEO, and Lagrange regions matter differently.

Demo 003 should avoid a simple compare/ranking mode. Infrastructure decisions are contextual and should not be reduced to "A is better than B." The useful model is scenario pressure:

```text
Given this demand, cost, risk, route window, and infrastructure state,
which nodes become more valuable?
```

The interface should show tradeoffs and causal pressure rather than absolute winners.

## Important Infrastructure Nodes

### LEO

Earth gravity-well exit and first major port.

### Earth-Moon L1/L2

Earth-Moon logistics, lunar-resource transfer, and deep-space relay points.

### Sun-Earth L1/L2

Solar observation, deep-space telescopes, communications, navigation, and early warning.

### Earth L4/L5 and Sun-Earth L4/L5

Stable regions with long-term industrial, storage, data-center, and settlement potential.

### Phobos

The strongest Mars-port candidate because it is close to Mars, low gravity, and useful for repair, refueling, and surface transfer.

### Deimos

A better outer Mars deep-space port candidate.

### Ceres

A volatile and asteroid-belt resource node. It should not be declared the capital of the belt by fiat; its importance should emerge from network centrality.

### Callisto

A low-radiation gateway candidate for the Jupiter system.

### Low-Energy Transfers / ITN

The solar-system equivalent of slow, cheap ocean currents for non-urgent logistics.

## Possible Game Positions

Potential genres:

- MMO civilization simulation
- persistent CLI civilization server
- idle space logistics tycoon
- network builder / infrastructure simulator

The clearest current position is no longer a conventional game demo. It is closer to:

```text
Gamified Solar-System Infrastructure Simulator
```

or:

```text
Infrastructure systems lab for a living civilization
```

The core question is not:

```text
How do I move cargo from A to B?
```

It is:

```text
Which routes, ports, and infrastructure cause civilization to grow?
```

This can still borrow from game design, but the immediate product shape should be a simulator with game-like interaction:

- scenarios instead of campaign missions
- pressure maps instead of win states
- toggles and interventions instead of build orders
- explanations and telemetry instead of hidden scoring
- iteration and review instead of a closed gameplay loop

## Post-Demo 001 Progression

### Stage 1: Visual Credibility

Make the solar system look like a real transportation and energy network.

Demo 001 belongs here.

### Stage 2: Network Metrics

Add network properties before adding economy:

- traffic volume
- connection count
- route frequency
- route cost
- route reliability
- infrastructure potential

The system should be able to explain why Phobos can matter more than the Mars surface as a port, why Ceres may or may not become a major hub, and why L4/L5 regions have long-term value.

### Stage 3: Emergent Settlements

Do not add a "build city" button.

The player builds:

- dock
- fuel depot
- cycler line
- relay
- warehouse
- maintenance yard

The system grows settlements from network centrality, flow, supply, safety, energy, and reliability:

```text
Outpost -> Port -> Town -> City -> Orbital Metropolis
```

### Stage 4: Gamified Operations Layer

Add operational pressure:

- cargo demand
- passenger demand
- route revenue
- maintenance cost
- schedules
- congestion
- accidents
- ticket prices
- shipping companies or transport authorities

The user manages or tests infrastructure assumptions, not individual spacecraft. This layer should remain simulator-first unless a later proposal justifies a stronger game loop.

### Stage 5: Civilization Layer

Return to the original sub-light civilization idea by adding:

- population migration
- local identity
- political organization
- AI governors
- asynchronous communication
- historical logs
- multi-settlement societies

## Design North Star

```text
Solar-system settlement is the Age of Sail, not the aviation age.
```

```text
Players build the routes and ports that let cities naturally grow.
```

```text
The project simulates how physical constraints shape civilization.
```
