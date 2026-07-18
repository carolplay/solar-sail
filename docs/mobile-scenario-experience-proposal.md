# Mobile Scenario Experience Proposal

Target Version: Unassigned mobile direction proposal

## Problem

The current mobile version is not truly playable.

This is not only a responsive layout problem. The desktop interaction model assumes that the user can keep several things visible at once:

```text
map + scenario selector + view selector + scale/focus controls + inspector + telemetry
```

On a phone, that model collapses. The canvas becomes small, controls cover the view, route lines are hard to tap, and telemetry turns into dense reading instead of usable action.

Mobile should therefore stop trying to be a smaller desktop atlas.

## Core Direction

Mobile and desktop should become different product surfaces backed by the same simulation engine.

```text
shared engine = scenarios, routes, nodes, telemetry, time model
desktop surface = atlas / systems lab
mobile surface = scenario briefing / campaign-like route inspection
```

Desktop can remain exploratory:

- compare views
- inspect many nodes
- keep route layers visible
- switch between Orbit, Gravity, and Low-Energy lenses
- behave like an infrastructure systems lab

Mobile should become guided:

- choose a scenario
- read the current route problem
- inspect a small number of key route cards
- watch the map focus on one route at a time
- follow windows, waiting, and flow changes
- feel closer to a campaign briefing or operations feed

## North Star Fit

The project is still about:

```text
Which routes, ports, and infrastructure cause civilization to grow?
```

Mobile should answer a narrower question:

```text
What is happening in this route theater right now, and which route should I care about?
```

The phone experience should not ask users to manually reconstruct the system from a dense atlas. It should curate the system into playable moments.

## Product Split

### Desktop

Desktop is the planning table.

Primary verbs:

- inspect
- compare
- toggle
- pan / zoom
- switch model lens
- evaluate assumptions

Best fit:

- long sessions
- spatial learning
- route/system comparison
- science explanation
- debugging model claims

### Mobile

Mobile is the briefing deck.

Primary verbs:

- choose scenario
- swipe route cards
- follow current window
- inspect one route
- advance a story step
- review alerts / changes

Best fit:

- short sessions
- scenario review
- route status
- onboarding
- campaign-style learning
- lightweight operations check

## Proposed Mobile Model

### 1. Scenario First

The first mobile choice should be scenario, not view.

Example:

```text
Earth-Moon Gateway Logistics
Earth-Mars Service Corridor
Lagrange Relay And Volatile Network
```

Selecting a scenario should load:

- one route theater
- one key question
- two or three route cards
- a focused map
- current window / wait / flow state

### 2. Route Cards

Route cards should become the main mobile interaction surface.

Each card should show:

- route name
- route role
- window state
- wait time
- flow proxy
- cadence
- suitability
- model label

Example card:

```text
LEO - EM L1 - Lunar Cargo Ladder
Window: open
Flow: 34%
Cadence: 27 d
Best for: bulk cargo
Model: heuristic route-window
```

Tapping a card should:

- focus the map on that route
- highlight nodes and path
- update the compact inspector
- optionally animate one route packet / pulse

### 3. Briefing / Campaign Steps

Mobile can introduce scenario knowledge as steps rather than views.

Example Earth-Moon sequence:

```text
1. Earth is the deep well.
2. LEO is the first logistics shelf.
3. EM L1 is a gateway pass.
4. Lunar cargo waits for route windows.
5. Depot support changes route usefulness.
```

This can feel campaign-like without becoming a campaign game. The user is learning a route theater through guided system moments.

### 4. Operations Feed

Mobile should expose time and route status as a compact feed.

Examples:

```text
Now open: LEO -> EM L1
Waiting: Mars cycler window, 20 months
Slow flow: Volatile Belt Drift, 48%
Watch: Lagrange handoff reliability is low
```

This feed can later become the bridge into Demo 0.3.0 economic pressure.

### 5. Focus Map

The map should remain present, but it should not carry the whole interaction.

Mobile map rules:

- show one active route at a time by default
- avoid many simultaneous labels
- avoid dense layer toggles
- avoid exposing all desktop views
- keep route highlight tied to the active card or step
- use animation to explain the selected route, not the whole system

## View Policy

Mobile should not pursue full desktop view parity.

Default mobile surface:

```text
Scenario briefing + route cards + focused Orbit map
```

Gravity View and Low-Energy Routes View can become:

- inline explanation frames
- one-step story moments
- compact route-card illustrations
- optional advanced drawer

They should not be equal top-level modes on small phones unless a later UX proposal proves they are usable.

## Shared Engine Boundary

Mobile and desktop should share:

- scenario data
- route families
- route-window telemetry
- node metadata
- model labels
- time simulation
- future economic inputs

They should not necessarily share:

- layout hierarchy
- top-level navigation
- visible controls
- map density
- view count
- inspector structure

This keeps implementation coherent while allowing the product surfaces to diverge.

## Candidate Mobile Experience Shapes

### Option A - Route Card First

Best near-term option.

Structure:

```text
Scenario tabs
Active route card stack
Focused map
Compact operations feed
```

Pros:

- easiest to implement from current 0.2.6 scenario route data
- makes telemetry actionable
- keeps mobile focused

Cons:

- less spatially rich than desktop
- may feel more like a dashboard than an atlas

### Option B - Campaign Briefing

Structure:

```text
Scenario
Step 1 / 2 / 3 / 4
Map animates each concept
Route card explains the current step
```

Pros:

- strong onboarding
- makes scientific ideas easier to learn
- aligns with scenario/campaign direction

Cons:

- needs authored content
- can become linear and less replayable

### Option C - Operations Feed

Structure:

```text
Alerts / windows / route events
Tap event -> focused map + route card
```

Pros:

- best bridge to future economic pressure
- naturally supports short mobile sessions

Cons:

- weak as a first-time teaching surface
- needs enough event variety to feel alive

## Recommendation

Use Option A as the first mobile redesign direction:

```text
Route Card First
```

Then borrow from Option B and C:

- use briefing steps for onboarding and explanation
- use operations feed for time-sensitive route status

The mobile product should become:

```text
Scenario briefing + route cards + focused map + operations feed
```

## Out Of Scope

Do not attempt in the first mobile pass:

- full desktop view parity
- full Gravity View controls
- full Low-Energy Routes controls
- all layer toggles
- dense route labels
- complex map tapping
- economic simulation
- campaign progression system
- user accounts or persistent saves

## Open Questions

- Should mobile scenario selection feel like tabs, cards, or a campaign list?
- Should the first screen be the active scenario or a scenario chooser?
- How many route cards can mobile support before it feels dense?
- Should route cards be swipeable, stacked vertically, or a bottom sheet?
- Should operations feed be above or below route cards?
- Which route telemetry fields are essential on mobile?
- Should mobile allow changing simulation speed, or only show current/next windows?
- Should Gravity / Low-Energy explanations appear as step illustrations or optional drawers?

## Prototype Cut

A first prototype should test only:

1. Scenario-first mobile entry.
2. Two or three route cards for the active scenario.
3. One focused map route at a time.
4. Compact route telemetry.
5. Simple operations feed.
6. No top-level Gravity / Low-Energy mode buttons on phone.

Success means a mobile user can understand:

```text
what scenario they are in,
which route matters,
whether it is open or waiting,
and why that route matters.
```

## When This Becomes A Spec

Convert this proposal into a mobile spec when:

1. The first mobile scenario flow is chosen.
2. Route card fields are selected.
3. The relationship between route cards and map focus is defined.
4. The mobile policy for Gravity / Low-Energy explanations is chosen.
5. The implementation cut is small enough to verify on a phone viewport.
