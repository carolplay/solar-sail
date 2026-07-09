# Demo 000 - Solar Network Viewer

Target Version: Demo 000

## Goal

Build a visual sandbox to develop intuition for a future sub-light civilization.

This is not a game. It is a continuously running visualization of transportation infrastructure in the Solar System.

## Requirements

- Display the Sun and major planetary orbits.
- Animate planets moving along their orbits.
- Show:
  - Earth
  - Mars
  - Ceres
  - Earth L4 / L5
- Add one Earth-Mars Cycler moving on a repeating trajectory.
- Add shuttle vehicles that periodically transfer between:
  - Earth <-> Cycler
  - Cycler <-> Mars
- Show labels and ETA for every moving shuttle.
- Allow simulation speed control: 1x, 10x, 100x, 1000x.
- The simulation should run continuously.

## Implemented Nice-To-Haves

- Toggle orbit paths.
- Pause / resume.
- Display current simulation date.
- Click an object to inspect its route and next arrival.
- Shuttle schedule side panel.
- Zoom and drag navigation.

## Current Modeling Notes

- Planet orbits are rendered as heliocentric ellipses using approximate eccentricities.
- The display uses a shared ecliptic projection for planets, Ceres, L-points, and the cycler.
- Shuttle schedules are tied to simplified cycler flyby windows rather than arbitrary timers.
- This is still a visual/plausibility sandbox, not a high-fidelity orbital mechanics solver.

## Deferred

- Moon is intentionally hidden for now and reserved for a later "planet gateway" phase.
- Real Lambert transfers, delta-v accounting, ephemerides, and physically rigorous cycler design are out of scope for this demo phase.

## Out Of Scope

- No gameplay.
- No combat.
- No economy.
- No resources.
- No networking.
- No multiplayer.

## Core Question

Does a living transportation network in the Solar System feel compelling to watch?
