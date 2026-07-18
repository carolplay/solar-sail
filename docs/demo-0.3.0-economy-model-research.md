# Demo 0.3.0 Economy Model Research

Target Version: Demo 0.3.0 research input

## Purpose

Demo 0.3.0 may be the first version to introduce economic factors, but it should not invent an economy from intuition alone.

This note summarizes research directions from transport economics, virtual economy literature, and online-game economy practice. The goal is to identify the smallest defensible economic model for solar-system infrastructure without prematurely building a full tycoon game.

## Research Inputs

### Transport Economics

Transport economics is relevant because this project is fundamentally about movement over costly networks, not about a spaceless market.

Useful concepts:

- generalized cost: monetary cost plus time, risk, delay, and inconvenience
- accessibility: how reachable valuable destinations are from a node
- capacity: route or port throughput
- congestion: demand increasing effective cost
- induced demand: new capacity can create new traffic, not merely serve existing traffic
- network effects: value depends on connected routes and reachable opportunities

Demo implication:

```text
Economic value should be derived from accessibility, generalized cost, capacity, and demand pressure.
```

This is a better fit than a simple "node score" or direct comparison mode.

### Spatial / Gravity Models

Gravity-style models are commonly used to estimate interaction or trade flow from origin weight, destination weight, and travel friction.

Demo implication:

```text
Potential flow can be approximated as:

origin demand * destination value * route suitability / generalized cost
```

For this project, "distance" should usually be replaced by generalized transfer cost:

- delta-v / energy proxy
- time of flight
- launch-window frequency
- reliability
- depot availability
- route capacity
- risk

### Virtual Economy Literature

Virtual economies are useful because persistent online worlds must manage production, destruction, currency creation, player markets, and inflation.

Important lessons:

- Virtual economies are real enough to generate measurable exchange, labor, specialization, and prices.
- They are also designed systems; fun, legibility, and stability matter more than strict realism.
- Currency sources and sinks are central to inflation control.
- Item durability, decay, taxes, and market fees can function as sinks.
- Player behavior can destabilize a system through hoarding, arbitrage, exploits, farming, or real-money trade.

Demo implication:

```text
If Demo 0.3.0 introduces money, it must also define sources, sinks, and observability.
```

Without that, currency becomes decorative and risks misleading the design.

### MMO Economy Practice

#### EVE Online

EVE's public economic reports are valuable because they expose production, destruction, mining, faucets, price indexes, and raw data.

Relevant practice:

- Track production and destruction separately.
- Track faucets and sinks explicitly.
- Publish price indexes and trend reports.
- Treat destruction, logistics, industry, mining, and money supply as connected systems.

Demo implication:

```text
Demo 0.3.0 should expose economic telemetry before trying to simulate a full market.
```

Useful telemetry examples:

- cargo demand
- passenger demand
- route volume
- route revenue potential
- maintenance burden
- capital cost
- operating cost
- risk premium
- depot throughput

#### Old School RuneScape

Research on OSRS market interventions found that transaction taxes and item sinks can have non-obvious effects.

Demo implication:

```text
Economic controls should be treated as interventions with side effects, not as simple balance knobs.
```

This supports keeping Demo 0.3.0 small and observable.

#### Star Wars Galaxies / Faucet-Drain Practice

Historical MMO economy discussion emphasizes faucets, drains, item decay, and the need to prevent runaway inflation or meaningless abundance.

Demo implication:

```text
If a currency exists, Demo 0.3.0 needs both creation paths and deletion paths.
```

However, Demo 0.3.0 may avoid player currency entirely and model costs/revenues as explanatory metrics instead.

## Candidate Model For Demo 0.3.0

Recommended direction:

```text
Scenario-based infrastructure economics
```

Do not start with a full player economy.

Start with scenarios:

- Mars settlement support
- asteroid volatile logistics
- science mission supply
- passenger migration
- emergency maintenance
- high-priority fast cargo
- low-priority bulk cargo

Each scenario defines demand weights and acceptable costs.

### Core Data Model

```text
Node
Route
Infrastructure
DemandScenario
FlowEstimate
EconomicPressure
```

### Generalized Route Cost

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

### Potential Flow

```text
potentialFlow =
  originDemand
  * destinationValue
  * routeSuitability
  / generalizedCost
```

This should be treated as a heuristic, not an econometric claim.

### Economic Pressure

```text
economicPressure =
  routeRevenuePotential
  + strategicValue
  + depotValue
  + relayValue
  - capitalCost
  - operatingCost
  - maintenanceBurden
  - riskReserve
```

The output should explain why pressure changes, not only show a number.

## Interface Direction

Avoid:

- direct node ranking
- "best port" comparisons
- full market simulation
- player currency
- auction houses
- commodity price speculation

Prefer:

- scenario selector
- pressure map
- route-volume overlays
- cost breakdown cards
- telemetry panels
- "why did this change?" explanations

Example:

```text
Scenario: asteroid volatile logistics

Phobos pressure increased because:
- Mars-Ceres route demand increased
- depot support lowers effective transfer cost
- route window penalty remains high
- maintenance burden is moderate
```

## Demo 0.3.0 Recommendation

Demo 0.3.0 should not be called "economy simulation" yet.

Better framing:

```text
Demo 0.3.0 - Economic Pressure Map
```

or:

```text
Demo 0.3.0 - Infrastructure Economics Prototype
```

The build should introduce economic pressure as an explanatory layer over the route atlas.

## Out Of Scope For Demo 0.3.0

- full currency loop
- player wallet
- commodity market
- auction house
- market-clearing prices
- settlement population simulation
- real firms or AI agents
- inflation control
- real-money economy

## Research Sources

- EVE Online, Monthly Economic Report - May 2026: https://www.eveonline.com/news/view/monthly-economic-report-may-2026
- EVE Online, Monthly Economic Report - June 2025: https://www.eveonline.com/news/view/monthly-economic-report-june-2025
- Hogan-Hennessy, Xenopoulos, Silva, "Market Interventions in a Large-Scale Virtual Economy": https://arxiv.org/abs/2210.07970
- Asadi, Hemadi, "Understanding Currencies in Video Games: A Review": https://arxiv.org/abs/2203.14253
- Castronova, "Virtual Worlds: A First-Hand Account of Market and Society on the Cyberian Frontier" reference summary: https://en.wikipedia.org/wiki/Edward_Castronova
- Wired, "Fun in Following the Money": https://www.wired.com/2004/05/fun-in-following-the-money
- Transport economics overview: https://en.wikipedia.org/wiki/Transport_economics
- Generalised cost overview: https://en.wikipedia.org/wiki/Generalised_cost
- Accessibility formula overview: https://en.wikipedia.org/wiki/Accessibility_(transport)
- Enhanced Gravity Model of trade: https://arxiv.org/abs/1506.00348
