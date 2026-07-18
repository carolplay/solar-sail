# Demo 0.2.5 Physical Coherence Proposal

Target Version: Demo 0.2.5 proposal

## Problem

Demo 0.2.0 made the viewer more honest by adding model labels, explanation entries, and route-atlas controls. That improved trust, but it did not fully solve the deeper problem: several visible elements still do not physically belong to the same model.

The current experience mixes:

- heliocentric Keplerian planet positions
- exaggerated local gateway layouts
- symbolic Lagrange and port markers
- stylized cycler geometry
- shuttle/taxi timing arcs
- pseudo-3D gravity-well diagrams
- manifold-inspired low-energy route sketches

The labels warn users that these are approximate, schematic, or conceptual. However, the visuals can still imply stronger physical meaning than the model supports.

Demo 0.2.5 should therefore be a physical coherence pass, not a feature expansion pass.

Core question:

```text
Can the viewer make physical sense at each scale, even when it remains approximate?
```

## North Star Fit

The project is about how physical constraints shape civilization. If the physical layer is incoherent, later route economics, settlement potential, and gameplay pressure will inherit weak foundations.

Demo 0.2.5 should make the visual language trustworthy enough that future economic and infrastructure layers can sit on top of it.

This does not mean mission-grade astrodynamics. It means each view should be clear about:

- coordinate frame
- scale type
- model class
- data provenance
- what visual distance means
- what a route line claims
- what a route line does not claim

## Current Evidence

Demo 0.2.0 exposed several coherence gaps.

### Mixed Scale Problem

The solar map, local gateway views, and symbolic infrastructure nodes all use the same canvas and interaction language. This makes schematic local offsets look like they are part of the same physical coordinate system as heliocentric orbits.

This is especially noticeable for:

- Earth Gateway
- Mars Gateway
- Lagrange regions
- moon and moon-adjacent markers
- local shuttle arcs

### Cycler Problem

The current cycler is still visually close to a physical orbit, even though it is better understood in this prototype as scheduled infrastructure.

The viewer should separate:

```text
cycler habitat path
planetary flyby window
taxi rendezvous leg
schedule lane
```

If the actual path remains stylized, the strongest visual should be the recurring schedule and service pattern, not a confident-looking ellipse.

### Route Line Problem

Different route types currently share similar line language:

- physical orbit
- route class
- shuttle/taxi marker
- planned cargo corridor
- low-energy conceptual corridor
- probe example

The app needs a stronger route taxonomy so users can tell whether a line is geometry, timing, service, or explanation.

### Concept View Problem

Gravity Well View and Low-Energy Routes View are useful, but they still feel like scientific visualizations without enough underlying science. They can remain, but their role should be clearer:

```text
teaching diagram, not computed physical surface
```

Three.js or CR3BP work should not be added merely to make them look more impressive. It should be added only if it improves model coherence.

## Options

### Option A - Label-Only Continuation

Keep Demo 0.2.0 mostly as-is and add stronger warnings.

Pros:

- fastest
- low implementation risk
- keeps current UI intact

Cons:

- does not solve the visual contradiction
- labels may become apologies for misleading geometry
- weak foundation for Demo 0.3.0 economics

Assessment:

Not enough for Demo 0.2.5.

### Option B - Coordinate / Scale Contract

Define explicit coordinate and scale contracts for every view and route layer.

Possible frames:

```text
heliocentric map
planet-local schematic
route-atlas overlay
conceptual energy diagram
schedule timeline / service lane
```

Pros:

- directly fixes the source of confusion
- does not require heavy physics tooling
- creates a foundation for future data upgrades

Cons:

- requires UI and data-model cleanup
- may reduce some visual spectacle
- forces hard choices about what the current prototype is allowed to show

Assessment:

Best core for Demo 0.2.5.

### Option C - Offline Ephemeris Upgrade

Generate compact ephemeris JSON offline and interpolate positions in the browser.

Pros:

- improves planet-position credibility
- creates a real data pipeline
- supports future historical/current-date views

Cons:

- does not solve local schematic or route-line confusion by itself
- adds data-generation and provenance work
- may be more accuracy than the current visual model can honestly use

Assessment:

Useful, but should follow the coordinate contract instead of replacing it.

### Option D - 3D Concept View Prototype

Use Three.js for Gravity Well View or Low-Energy Routes View.

Pros:

- could greatly improve terrain, saddle, and tube legibility
- may make concept views feel more physically intuitive
- creates a path for richer physics visualization

Cons:

- can make weak physics look more authoritative
- adds rendering architecture complexity
- does not fix Orbit View and route-atlas coherence

Assessment:

Research candidate for later in 0.2.5, not the first implementation cut.

### Option E - Hide / Downgrade Concept Views

Temporarily reduce Gravity Well and Low-Energy Routes views to explanation surfaces until their models improve.

Pros:

- prevents false confidence
- focuses 0.2.5 on Orbit View and Route Atlas
- keeps the app honest

Cons:

- removes some of the most visually exciting Demo 0.2.0 work
- may feel like a step backward

Assessment:

Worth considering if concept views continue to undermine trust.

## Recommendation

Demo 0.2.5 should use Option B as the main direction:

```text
Build a coordinate, scale, and route-claim contract.
```

The implementation should make a visual distinction between:

- real or approximate physical positions
- schematic local infrastructure
- service schedules
- conceptual route classes
- teaching diagrams

Recommended working title:

```text
Demo 0.2.5 - Physical Coherence Pass
```

This should not primarily be a 3D milestone. It should be the milestone where the viewer stops letting different model types visually blur into each other.

## Proposed Model Contracts

### Heliocentric Orbit Map

Claim:

```text
Approximate positions of major bodies in a shared heliocentric frame.
```

Allowed:

- Sun and major bodies
- documented Keplerian elements or ephemeris-backed positions
- high-level route-atlas overlays that do not claim exact trajectories

Avoid:

- local schematic distances that look physically scaled
- precise-looking taxi arcs
- fake physical cycler certainty

### Planet-Local Schematic Views

Claim:

```text
Local infrastructure layout, exaggerated for legibility.
```

Allowed:

- low orbit port markers
- moon / moon-region markers
- Lagrange regions
- depot and gateway symbols
- local shuttle categories

Avoid:

- implying true local distances
- drawing local schematic paths as mission trajectories
- mixing local offsets into the heliocentric model without visual separation

### Route Atlas Overlay

Claim:

```text
Route class, service pattern, or logistics relationship.
```

Route visual categories should be separated:

```text
Orbit geometry
Transfer class
Service schedule
Conceptual corridor
Research placeholder
Science example
```

Each route should carry:

- route claim
- model class
- confidence level
- whether geometry is physical, schematic, or symbolic
- explanation entry

### Cycler Schedule View

Claim:

```text
Recurring Earth-Mars service pattern inspired by cycler infrastructure.
```

The cycler should be rendered less like a confident exact ellipse and more like infrastructure with:

- flyby windows
- taxi rendezvous warnings
- service timeline
- habitat path confidence label
- explicit separation between cycler path and taxi legs

### Conceptual Physics Views

Claim:

```text
Teaching diagrams for energy terrain and low-energy route ideas.
```

Allowed:

- simple conceptual diagrams
- explanatory labels
- model disclaimers
- optional 3D research prototype if the underlying model supports it

Avoid:

- authoritative-looking 3D surfaces without data provenance
- fake manifold tubes
- hiding the conceptual status behind polished rendering

## Risks / Weak Assumptions

- Users may still expect physically accurate astrodynamics once the visual design becomes more polished.
- Removing or downgrading visual elements may feel less exciting than Demo 0.2.0.
- A coordinate contract may require a modest internal refactor before it becomes visible.
- Ephemeris work can become a rabbit hole if it is not scoped tightly.
- Cycler research may reveal that a simple honest visualization is more timeline-like than orbit-like.

## Research Needed

Minimum research before spec:

- review what orbital elements are currently being used and whether they can be tied to a documented epoch
- identify a compact visual taxonomy for route claim types
- research the simplest honest Aldrin-cycler representation suitable for a browser prototype
- decide whether Earth/Moon and Mars local views should be separate canvases, separate modes, or visibly framed insets
- evaluate whether concept views should remain in Demo 0.2.5 or be moved to a research-only surface

Optional research:

- small Skyfield or Horizons ephemeris JSON experiment
- first Three.js gravity-well spike
- CR3BP visualization references for later manifold work

## Prototype Cut

The smallest useful Demo 0.2.5 prototype:

```text
A physically coherent Orbit View plus an honest Route Atlas overlay.
```

Prototype requirements:

- add model contracts to data objects rather than only UI labels
- distinguish physical, schematic, symbolic, and conceptual geometry in rendering
- separate local schematic views from the heliocentric map more clearly
- downgrade or restyle cycler geometry so it reads as service infrastructure
- classify every route line by claim type
- keep concept views clearly marked as diagrams or temporarily reduce their prominence

Success should be judged by whether a user can answer:

```text
What coordinate frame am I looking at?
Is this distance meaningful?
Is this line a physical path, a route class, a schedule, or a concept?
What does this view simplify?
```

## Out Of Scope

Do not include:

- economy
- settlement scoring
- traffic simulation
- resource extraction
- full ephemeris engine unless scoped as a tiny data experiment
- mission optimization
- authoritative cycler trajectory solving
- production 3D manifold visualization
- gameplay loops

## Open Questions

- Should Demo 0.2.5 keep all three current desktop views, or should concept views become secondary explanation surfaces?
- Should the cycler be primarily visualized as an orbit, a schedule lane, or a hybrid?
- Is a documented Keplerian model enough for 0.2.5, or should ephemeris JSON be part of the spec?
- Should local gateway views appear as separate modes, inset diagrams, or atlas sheets?
- What is the minimum route taxonomy that is legible without adding too much UI?

## When This Becomes A Spec

Convert this proposal into a Demo 0.2.5 spec when the following decisions are made:

1. The coordinate / scale contract is accepted.
2. The route claim taxonomy is chosen.
3. The cycler representation direction is chosen.
4. The ephemeris path is either scoped or explicitly deferred.
5. Concept views are either kept, downgraded, or moved to research-only status.

The resulting spec should be implementation-focused and should avoid reopening 3D, economics, or gameplay unless they directly support physical coherence.
