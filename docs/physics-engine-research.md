# Physics / Simulation Model Research

Target Version: Demo 001, with Demo 002 upgrade path

Demo 001 is a browser visualization prototype, not a spacecraft navigation tool. The implementation favors credible intuition, stable performance, and clear documentation over high-precision astrodynamics.

## Options Considered

### NASA/JPL Ephemeris / SPICE

SPICE is the high-credibility option for mission-grade planetary and spacecraft geometry. It has excellent provenance, but browser delivery would require kernels, bindings, and a data-loading strategy that is heavier than this prototype needs.

Complexity: high  
Browser feasibility: low to medium  
Accuracy: excellent  
Demo 001 fit: too heavy

### JPL Horizons Data

Horizons can provide authoritative precomputed positions for selected bodies and dates. It is a strong option for generating offline ephemeris tables that the browser can load as JSON.

Complexity: medium  
Browser feasibility: high if precomputed  
Accuracy: high for selected bodies and dates  
Demo 001 fit: good later, not required now

### Skyfield

Skyfield is a practical Python library for ephemeris-backed astronomy calculations. It would be useful for an offline build step that generates position tables.

Complexity: medium  
Browser feasibility: indirect only  
Accuracy: high when paired with appropriate ephemerides  
Demo 001 fit: good candidate for Demo 002+

### Orekit

Orekit is powerful and broad, but it is a Java ecosystem tool aimed at serious flight dynamics and mission analysis.

Complexity: high  
Browser feasibility: low  
Accuracy: high  
Demo 001 fit: too heavy

### poliastro

poliastro is useful for orbital mechanics exploration in Python. It is better suited to research notebooks or offline trajectory experiments than a lightweight browser demo.

Complexity: medium  
Browser feasibility: indirect only  
Accuracy: medium to high depending on model  
Demo 001 fit: useful for future route research

### Browser-Side Keplerian Approximation

This is the current Demo 001 approach. Each displayed body uses simplified two-body Keplerian elements: semi-major axis, eccentricity, orbital period, phase, and argument of periapsis. The app solves Kepler's equation with a small Newton iteration and renders approximate true anomaly positions.

Complexity: low  
Browser feasibility: high  
Accuracy: approximate  
Demo 001 fit: best current fit

### Offline Precomputed Ephemeris Tables

A build step could generate compact JSON position tables using Horizons or Skyfield, then the browser could interpolate between samples.

Complexity: medium  
Browser feasibility: high  
Accuracy: high enough for visualization  
Demo 001 fit: strong upgrade path

## Current Demo 001 Model

The implemented model uses lightweight browser-side Keplerian approximation for Mercury, Earth, Mars, Ceres, Vesta, and a stylized Earth-Mars cycler orbit. Gateway nodes are positioned relative to their parent bodies:

- Sun-Earth L1/L2 are approximated as small offsets along the Sun-Earth line.
- Sun-Earth L4/L5 are placed 60 degrees ahead of and behind Earth on its orbit.
- Earth-Moon L1 is shown as a local Earth-system gateway in Earth Gateway scale.
- Phobos, Deimos, LEO, and local transfer nodes are symbolic offsets that preserve infrastructure meaning rather than physical scale.

Gravity Well View and Low-Energy Routes View are timestamped conceptual snapshots. They can be rotated and zoomed in the browser, but they do not compute delta-v, invariant manifolds, or optimized transfers.

## Low-Energy Transfer Visualization Reference

The Demo 001 conceptual views now follow the visual language in Luke Chu's low-energy transfer explainer more closely: pseudo-3D effective-potential terrain, saddle regions around Lagrange points, halo/Lyapunov-style loops, and stable/unstable tube families. The implementation still does not numerically solve the circular restricted three-body problem. It draws symbolic geometry intended to teach the idea of energy terrain and transfer corridors.

The current Low-Energy Routes View should be treated as a placeholder inspired by transfer-manifold concepts. To reach the desired effect, a later version should use a better engine: either a browser-side CR3BP renderer, a precomputed manifold dataset, or offline-generated mesh/tube geometry loaded as static JSON.

## Cycler Schedule Note

The first implementation pass used a stylized 780-day cycle with a 258-day Earth-to-Mars rendezvous offset. That was too loose. The revised Demo 001 model uses the commonly cited Aldrin-cycler simplification: one Earth-Mars synodic period per cycle, about 2.135 Earth years or roughly 780 days, and about 146 days for the Earth-to-Mars crossing.

The visible shuttle/taxi transfers remain conceptual. In a real cycler architecture, short taxis must perform demanding rendezvous and departure burns near planetary flybys; Demo 001 shows them as infrastructure timing markers rather than physically integrated transfer vehicles.

## Recommendation

Keep Demo 001 on browser-side Keplerian approximations and symbolic gateway geometry. The result is lightweight, explainable, and visually responsive. For a later demo, add an offline ephemeris generation step using JPL Horizons or Skyfield and load the generated JSON in the app.
