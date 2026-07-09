const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");
const simDateEl = document.getElementById("simDate");
const statusPill = document.getElementById("statusPill");
const pauseButton = document.getElementById("pauseButton");
const pauseIcon = document.getElementById("pauseIcon");
const zoomOutButton = document.getElementById("zoomOutButton");
const zoomInButton = document.getElementById("zoomInButton");
const orbitToggle = document.getElementById("orbitToggle");
const inspectName = document.getElementById("inspectName");
const inspectRoute = document.getElementById("inspectRoute");
const inspectDetails = document.getElementById("inspectDetails");
const scheduleList = document.getElementById("scheduleList");
const speedButtons = Array.from(document.querySelectorAll(".speed-button"));
const modeButtons = Array.from(document.querySelectorAll(".mode-button"));
const scaleButtons = Array.from(document.querySelectorAll(".scale-button"));

const DAY_MS = 86400000;
const startDate = new Date(Date.UTC(2187, 0, 1, 12));
const tilt = 0.47;

const state = {
  simDays: 0,
  speed: 10,
  paused: false,
  showOrbits: true,
  viewMode: "orbit",
  scaleMode: "solar",
  selectedId: null,
  hoverId: null,
  width: 0,
  height: 0,
  dpr: 1,
  center: { x: 0, y: 0 },
  centerWorld: { x: 0, y: 0 },
  cameraCenterWorld: { x: 0, y: 0 },
  targetCenterWorld: { x: 0, y: 0 },
  cameraSpanAu: 6.2,
  targetSpanAu: 6.2,
  transition: null,
  conceptSnapshotDay: 0,
  concept: {
    rotation: -0.22,
    pitch: 0.34,
    zoom: 1,
    pan: { x: 0, y: 0 }
  },
  au: 1,
  zoom: 1,
  pan: { x: 0, y: 0 },
  dragging: false,
  dragStart: { x: 0, y: 0 },
  dragPanStart: { x: 0, y: 0 },
  hitTargets: [],
  labelBoxes: []
};

const scaleModes = {
  solar: {
    label: "Solar System",
    spanAu: 6.2,
    center: () => ({ x: 0, y: 0 }),
    visible: new Set(["sun", "mercury", "earth", "mars", "ceres", "vesta", "earth-l4", "earth-l5", "cycler"])
  },
  inner: {
    label: "Inner System",
    spanAu: 3.5,
    center: () => ({ x: 0.55, y: 0 }),
    visible: new Set(["sun", "mercury", "earth", "mars", "ceres", "earth-l4", "earth-l5", "sun-earth-l1", "sun-earth-l2", "cycler"])
  },
  earth: {
    label: "Earth Gateway",
    spanAu: 0.025,
    center: () => getBodyWorld("earth"),
    visible: new Set(["earth", "leo-port", "moon", "earth-moon-l1", "sun-earth-l1", "sun-earth-l2", "earth-l4", "earth-l5"])
  },
  mars: {
    label: "Mars Gateway",
    spanAu: 0.02,
    center: () => getBodyWorld("mars"),
    visible: new Set(["mars", "phobos-port", "deimos-port", "mars-cycler-point"])
  },
  ceres: {
    label: "Ceres / Belt",
    spanAu: 1.2,
    center: () => getBodyWorld("ceres"),
    visible: new Set(["ceres", "vesta", "ceres-drift-hub"])
  }
};

const bodies = [
  {
    id: "mercury",
    name: "Mercury",
    type: "Terrestrial world",
    parent: "Sun",
    role: "Inner-system reference world and high-solar-energy logistics marker",
    infrastructure: "Low",
    semiMajor: 0.387,
    eccentricity: 0.2056,
    period: 87.969,
    radius: 4.2,
    color: "#c7a36c",
    phase: 2.3,
    argPeri: 0.5
  },
  {
    id: "earth",
    name: "Earth",
    type: "Terrestrial world",
    parent: "Sun",
    role: "Primary inner-system origin and deep gravity well",
    infrastructure: "High",
    semiMajor: 1,
    eccentricity: 0.0167,
    period: 365.256,
    radius: 7,
    color: "#78bfff",
    phase: 0.15,
    argPeri: 1.8
  },
  {
    id: "mars",
    name: "Mars",
    type: "Terrestrial world",
    parent: "Sun",
    role: "Outbound terminus for cycler logistics and surface-to-orbit shuttles",
    infrastructure: "High",
    semiMajor: 1.524,
    eccentricity: 0.0934,
    period: 686.98,
    radius: 6,
    color: "#e9785f",
    phase: 1.95,
    argPeri: 5.0
  },
  {
    id: "ceres",
    name: "Ceres",
    type: "Dwarf planet / belt hub",
    parent: "Asteroid Belt",
    role: "Water, volatile, and long-haul cargo logistics gateway",
    infrastructure: "High",
    semiMajor: 2.77,
    eccentricity: 0.076,
    period: 1681.6,
    radius: 4.8,
    color: "#c5cbd4",
    phase: 2.8,
    argPeri: 1.3
  },
  {
    id: "vesta",
    name: "Vesta",
    type: "Asteroid placeholder",
    parent: "Asteroid Belt",
    role: "Optional belt logistics marker for future cargo-route planning",
    infrastructure: "Medium",
    semiMajor: 2.36,
    eccentricity: 0.089,
    period: 1325,
    radius: 3.8,
    color: "#aeb6c1",
    phase: 4.3,
    argPeri: 2.6
  }
];

const cyclerOrbit = {
  id: "cycler",
  name: "Aldrin Cycler",
  type: "Cycler Line",
  parent: "Earth-Mars corridor",
  role: "Repeating Earth-Mars flyby orbit that behaves like scheduled interplanetary infrastructure",
  infrastructure: "Very high",
  semiMajor: 1.6,
  eccentricity: 0.393,
  period: 780,
  phase: 0,
  argPeri: 0.22,
  radius: 6,
  color: "#ffd06f",
  stops: [
    { id: "earth", day: 0, label: "Earth rendezvous" },
    { id: "mars", day: 146, label: "Mars rendezvous" },
    { id: "earth", day: 780, label: "Earth rendezvous" }
  ]
};

const gatewayNodes = [
  {
    id: "leo-port",
    name: "LEO Port",
    type: "Earth Gateway",
    parent: "Earth System",
    role: "Earth gravity-well exit, assembly, and refueling node",
    infrastructure: "Very high",
    color: "#90f0c6",
    radius: 4.5,
    position: () => offsetFrom("earth", 0.00072, bodyAngle(getBody("earth")) + 1.4)
  },
  {
    id: "moon",
    name: "Moon",
    type: "Natural satellite",
    parent: "Earth System",
    role: "Nearby mass anchor for Earth-Moon logistics and staging",
    infrastructure: "Medium",
    color: "#d7dce3",
    radius: 4.6,
    position: () => offsetFrom("earth", 0.00257, lunarAngle())
  },
  {
    id: "earth-moon-l1",
    name: "Earth-Moon L1",
    type: "Earth Gateway",
    parent: "Earth-Moon System",
    role: "Lunar transfer gateway and staging point between Earth orbit and lunar space",
    infrastructure: "High",
    color: "#c6a7ff",
    radius: 4.2,
    position: () => offsetFrom("earth", 0.00217, lunarAngle())
  },
  {
    id: "sun-earth-l1",
    name: "Sun-Earth L1",
    type: "Solar observation gateway",
    parent: "Sun-Earth System",
    role: "Solar warning, power monitoring, and heliophysics observation point",
    infrastructure: "Medium",
    color: "#ffa96f",
    radius: 4,
    position: () => offsetFrom("earth", 0.010, bodyAngle(getBody("earth")) + Math.PI)
  },
  {
    id: "sun-earth-l2",
    name: "Sun-Earth L2",
    type: "Deep-space observation gateway",
    parent: "Sun-Earth System",
    role: "Deep-space telescope, navigation, and communications staging point",
    infrastructure: "High",
    color: "#ffa96f",
    radius: 4,
    position: () => offsetFrom("earth", 0.010, bodyAngle(getBody("earth")))
  },
  {
    id: "earth-l4",
    name: "Sun-Earth L4",
    type: "Solar Lagrange zone",
    parent: "Sun-Earth System",
    role: "Leading stable industrial, data, or storage zone",
    infrastructure: "Medium",
    color: "#ff91bb",
    radius: 4.2,
    position: () => lagrangeOrbit("earth", Math.PI / 3)
  },
  {
    id: "earth-l5",
    name: "Sun-Earth L5",
    type: "Solar Lagrange zone",
    parent: "Sun-Earth System",
    role: "Trailing stable industrial, data, or storage zone",
    infrastructure: "Medium",
    color: "#ff91bb",
    radius: 4.2,
    position: () => lagrangeOrbit("earth", -Math.PI / 3)
  },
  {
    id: "phobos-port",
    name: "Phobos Port",
    type: "Mars Gateway",
    parent: "Mars System",
    role: "Mars orbital port, maintenance yard, and fuel-transfer gateway",
    infrastructure: "High",
    color: "#9ff1c7",
    radius: 4.5,
    position: () => offsetFrom("mars", 0.00085, marsMoonAngle(1.0))
  },
  {
    id: "deimos-port",
    name: "Deimos Deep Space Port",
    type: "Mars Gateway",
    parent: "Mars System",
    role: "Outer Mars gateway for asteroid-belt departure and deep-space staging",
    infrastructure: "High",
    color: "#b8f3dd",
    radius: 4.2,
    position: () => offsetFrom("mars", 0.0018, marsMoonAngle(2.4))
  },
  {
    id: "mars-cycler-point",
    name: "Mars Cycler Connection",
    type: "Transfer node",
    parent: "Mars System",
    role: "Symbolic intercept point where Mars shuttles meet the Earth-Mars cycler",
    infrastructure: "High",
    color: "#ffd06f",
    radius: 4,
    position: () => offsetFrom("mars", 0.0031, bodyAngle(getBody("mars")) + 0.9)
  },
  {
    id: "ceres-drift-hub",
    name: "Ceres Drift Hub",
    type: "Planned Route Node",
    parent: "Asteroid Belt",
    role: "Conceptual staging point for slow cargo drift routes through the belt",
    infrastructure: "Medium",
    color: "#9fc7ff",
    radius: 4,
    position: () => offsetFrom("ceres", 0.12, bodyAngle(getBody("ceres")) + 1.2)
  }
];

const routeClasses = [
  {
    id: "cycler-line",
    name: "Cycler Line",
    type: "Cycler Line",
    role: "Scheduled high-capacity infrastructure orbit",
    color: "#ffd06f",
    dash: [8, 7],
    from: "earth",
    to: "mars"
  },
  {
    id: "earth-mars-fast",
    name: "Fast Earth-Mars Transfer",
    type: "Fast Transfer",
    role: "Bright, higher-energy route class for quick crew or priority cargo transfers",
    color: "#8fd4ff",
    dash: [],
    from: "earth",
    to: "mars"
  },
  {
    id: "earth-ceres-low",
    name: "Low-Energy Belt Corridor",
    type: "Low-Energy Transfer",
    role: "Faint slow corridor connecting Sun-Earth gateways to the asteroid belt",
    color: "#8da7ff",
    dash: [3, 10],
    from: "earth-l5",
    to: "ceres"
  },
  {
    id: "mars-ceres-planned",
    name: "Mars-Ceres Planned Route",
    type: "Planned Route",
    role: "Thin dotted cargo planning route between Mars gateways and Ceres",
    color: "#9aa6b2",
    dash: [2, 8],
    from: "mars",
    to: "ceres"
  }
];

const shuttleRoutes = [
  {
    id: "earth-cycler-a",
    name: "Shuttle E-C 01",
    type: "Shuttle Transfer",
    parent: "Earth-Mars corridor",
    role: "Earth launch timed to cycler Earth rendezvous",
    infrastructure: "Medium",
    from: "leo-port",
    to: "cycler",
    stop: "earth",
    departOffset: -9,
    duration: 9,
    color: "#88efbc"
  },
  {
    id: "earth-cycler-b",
    name: "Shuttle C-E 02",
    type: "Shuttle Transfer",
    parent: "Earth-Mars corridor",
    role: "Cycler return timed to Earth flyby",
    infrastructure: "Medium",
    from: "cycler",
    to: "leo-port",
    stop: "earth",
    departOffset: 0,
    duration: 9,
    color: "#88efbc"
  },
  {
    id: "cycler-mars-a",
    name: "Shuttle C-M 03",
    type: "Shuttle Transfer",
    parent: "Mars System",
    role: "Mars terminal transfer timed to cycler Mars rendezvous",
    infrastructure: "Medium",
    from: "cycler",
    to: "phobos-port",
    stop: "mars",
    departOffset: 0,
    duration: 16,
    color: "#9df7d0"
  },
  {
    id: "cycler-mars-b",
    name: "Shuttle M-C 04",
    type: "Shuttle Transfer",
    parent: "Mars System",
    role: "Mars ascent timed to cycler intercept",
    infrastructure: "Medium",
    from: "phobos-port",
    to: "cycler",
    stop: "mars",
    departOffset: -16,
    duration: 16,
    color: "#9df7d0"
  },
  {
    id: "mars-surface-phobos",
    name: "Mars Surface Shuttle",
    type: "Shuttle Transfer",
    parent: "Mars System",
    role: "Reusable local shuttle between Mars surface and Phobos Port",
    infrastructure: "High",
    from: "mars",
    to: "phobos-port",
    stop: "mars",
    departOffset: -4,
    duration: 4,
    color: "#c4f7b4"
  }
];

let lastFrame = performance.now();

function resize() {
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  state.center = {
    x: state.width * (state.width < 820 ? 0.5 : 0.47),
    y: state.height * (state.width < 820 ? 0.43 : 0.53)
  };
  updateScaleMetrics();
}

function updateScaleMetrics() {
  const config = scaleModes[state.scaleMode];
  const usable = Math.min(state.width * 0.78, state.height * 0.74);
  state.targetCenterWorld = config.center();
  state.targetSpanAu = config.spanAu;
  if (!state.transition) {
    state.cameraCenterWorld = state.targetCenterWorld;
    state.cameraSpanAu = state.targetSpanAu;
  }
  state.centerWorld = state.cameraCenterWorld;
  state.au = usable / state.cameraSpanAu;
}

function resetViewForScale() {
  state.zoom = 1;
  state.pan = { x: 0, y: 0 };
  updateScaleMetrics();
}

function startCameraTransition(targetMode) {
  const target = scaleModes[targetMode];
  state.transition = {
    started: performance.now(),
    duration: 820,
    fromCenter: { ...state.cameraCenterWorld },
    toCenter: target.center(),
    fromSpan: state.cameraSpanAu,
    toSpan: target.spanAu
  };
}

function updateCameraTransition(now) {
  if (!state.transition) return;
  const t = Math.min(1, (now - state.transition.started) / state.transition.duration);
  const eased = t * t * (3 - 2 * t);
  state.cameraCenterWorld = {
    x: lerp(state.transition.fromCenter.x, state.transition.toCenter.x, eased),
    y: lerp(state.transition.fromCenter.y, state.transition.toCenter.y, eased)
  };
  state.cameraSpanAu = lerp(state.transition.fromSpan, state.transition.toSpan, eased);
  if (t >= 1) state.transition = null;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function worldToScreen(pos, useTilt = true) {
  return {
    x: state.center.x + (pos.x - state.centerWorld.x) * state.au * state.zoom + state.pan.x,
    y: state.center.y + (pos.y - state.centerWorld.y) * state.au * state.zoom * (useTilt ? tilt : 1) + state.pan.y
  };
}

function screenToWorld(point) {
  return {
    x: state.centerWorld.x + (point.x - state.center.x - state.pan.x) / (state.au * state.zoom),
    y: state.centerWorld.y + (point.y - state.center.y - state.pan.y) / (state.au * state.zoom * tilt)
  };
}

function meanAnomaly(body, day = state.simDays) {
  return body.phase + (day / body.period) * Math.PI * 2;
}

function solveEccentricAnomaly(mean, eccentricity) {
  let eccentric = mean;
  for (let i = 0; i < 7; i += 1) {
    eccentric -= (eccentric - eccentricity * Math.sin(eccentric) - mean) / (1 - eccentricity * Math.cos(eccentric));
  }
  return eccentric;
}

function trueAnomalyFromEccentric(eccentricAnomaly, eccentricity) {
  return 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
  );
}

function bodyAngle(body, day = state.simDays) {
  const eccentric = solveEccentricAnomaly(meanAnomaly(body, day), body.eccentricity);
  return trueAnomalyFromEccentric(eccentric, body.eccentricity) + body.argPeri;
}

function orbitalRadius(body, day = state.simDays) {
  const eccentric = solveEccentricAnomaly(meanAnomaly(body, day), body.eccentricity);
  return body.semiMajor * (1 - body.eccentricity * Math.cos(eccentric));
}

function ellipticalWorld(orbit, day = state.simDays) {
  const angle = bodyAngle(orbit, day);
  const radius = orbitalRadius(orbit, day);
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function getBody(id) {
  if (id === "cycler") return cyclerOrbit;
  return bodies.find((body) => body.id === id);
}

function getBodyWorld(id, day = state.simDays) {
  if (id === "sun") return { x: 0, y: 0 };
  if (id === "cycler") return ellipticalWorld(cyclerOrbit, day);
  const body = bodies.find((item) => item.id === id);
  if (body) return ellipticalWorld(body, day);
  const node = gatewayNodes.find((item) => item.id === id);
  if (node) return node.position(day);
  return { x: 0, y: 0 };
}

function offsetFrom(parentId, distance, angle) {
  const parent = getBodyWorld(parentId);
  return {
    x: parent.x + Math.cos(angle) * distance,
    y: parent.y + Math.sin(angle) * distance
  };
}

function lagrangeOrbit(parentId, offset) {
  const parent = getBody(parentId);
  return {
    x: Math.cos(bodyAngle(parent) + offset) * orbitalRadius(parent),
    y: Math.sin(bodyAngle(parent) + offset) * orbitalRadius(parent)
  };
}

function lunarAngle() {
  return bodyAngle(getBody("earth")) + 0.7 + (state.simDays / 27.32) * Math.PI * 2;
}

function marsMoonAngle(offset) {
  return bodyAngle(getBody("mars")) + offset + (state.simDays / 7.7) * Math.PI * 2;
}

function visibleInScale(id) {
  return scaleModes[state.scaleMode].visible.has(id);
}

function drawSpace() {
  const sun = worldToScreen({ x: 0, y: 0 });
  const gradient = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, Math.max(220, state.au * state.zoom * 2.8));
  gradient.addColorStop(0, "rgba(255, 188, 78, 0.14)");
  gradient.addColorStop(0.45, "rgba(51, 86, 110, 0.08)");
  gradient.addColorStop(1, "rgba(5, 7, 11, 0)");
  ctx.fillStyle = "#05070b";
  ctx.fillRect(0, 0, state.width, state.height);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  for (let i = 0; i < 120; i += 1) {
    const x = (i * 181 + 37) % state.width;
    const y = (i * 97 + 19) % state.height;
    const alpha = 0.10 + ((i * 13) % 60) / 230;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, i % 5 === 0 ? 1.5 : 1, i % 7 === 0 ? 1.5 : 1);
  }
  ctx.globalAlpha = 1;
}

function drawOrbit(orbit, color = "rgba(255,255,255,0.14)", dash = []) {
  ctx.beginPath();
  for (let i = 0; i <= 260; i += 1) {
    const mean = (i / 260) * Math.PI * 2;
    const eccentric = solveEccentricAnomaly(mean, orbit.eccentricity);
    const angle = trueAnomalyFromEccentric(eccentric, orbit.eccentricity) + orbit.argPeri;
    const radius = orbit.semiMajor * (1 - orbit.eccentricity * Math.cos(eccentric));
    const p = worldToScreen({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = orbit.id === "cycler" ? 1.5 : 1;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawAsteroidBelt() {
  ctx.beginPath();
  for (let i = 0; i <= 180; i += 1) {
    const angle = (i / 180) * Math.PI * 2;
    const noise = Math.sin(i * 2.1) * 0.035;
    const p = worldToScreen({ x: Math.cos(angle) * (2.6 + noise), y: Math.sin(angle) * (2.6 - noise) });
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = "rgba(187, 196, 206, 0.16)";
  ctx.lineWidth = state.scaleMode === "ceres" ? 2 : 1.2;
  ctx.setLineDash([1, 8]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawCurvedRoute(fromId, toId, color, dash = [], bend = -0.18, width = 1.3) {
  const from = worldToScreen(getBodyWorld(fromId));
  const to = worldToScreen(getBodyWorld(toId));
  const mid = {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2 + Math.hypot(to.x - from.x, to.y - from.y) * bend
  };
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.quadraticCurveTo(mid.x, mid.y, to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.setLineDash([]);
}

function routeProgress(route, day = state.simDays) {
  const event = routeEvent(route, day);
  const active = day >= event.departure && day <= event.arrival;
  const progress = active ? (day - event.departure) / route.duration : 0;
  return {
    active,
    progress,
    nextDeparture: active ? event.departure : event.nextDeparture,
    nextArrival: active ? event.arrival : event.nextArrival,
    currentEvent: event
  };
}

function routeEvent(route, day = state.simDays) {
  const stopDay = stopDayFor(route.stop);
  const currentCycle = Math.floor((day - stopDay - route.departOffset) / cyclerOrbit.period);
  const candidate = eventForCycle(route, currentCycle);
  if (day <= candidate.arrival) {
    return { ...candidate, nextDeparture: candidate.departure, nextArrival: candidate.arrival };
  }
  const next = eventForCycle(route, currentCycle + 1);
  return { ...next, nextDeparture: next.departure, nextArrival: next.arrival };
}

function eventForCycle(route, cycle) {
  const rendezvous = cycle * cyclerOrbit.period + stopDayFor(route.stop);
  const departure = rendezvous + route.departOffset;
  const arrival = departure + route.duration;
  return {
    cycle,
    departure,
    arrival,
    rendezvous,
    origin: labelFor(route.from),
    destination: labelFor(route.to),
    window: route.stop === "earth" ? "Earth flyby" : "Mars flyby"
  };
}

function stopDayFor(stop) {
  return cyclerOrbit.stops.find((item) => item.id === stop).day;
}

function getShuttleWorld(route, day = state.simDays) {
  const trip = routeProgress(route, day);
  const from = getBodyWorld(route.from, day);
  const to = getBodyWorld(route.to, day);
  if (!trip.active) {
    const stagedForDeparture = trip.currentEvent.departure - day < 45;
    const parkedAt = stagedForDeparture ? route.from : route.to;
    return { ...getBodyWorld(parkedAt, day), parked: true, trip };
  }
  const ease = trip.progress * trip.progress * (3 - 2 * trip.progress);
  const bend = Math.sin(Math.PI * trip.progress) * (route.stop === "earth" ? 0.016 : 0.024);
  return {
    x: from.x + (to.x - from.x) * ease,
    y: from.y + (to.y - from.y) * ease - bend,
    parked: false,
    trip
  };
}

function drawLabel(name, screenPos, color, selected = false, hint = "") {
  const text = hint ? `${name} | ${hint}` : name;
  ctx.font = selected ? "700 13px Inter, system-ui" : "600 12px Inter, system-ui";
  const width = Math.min(ctx.measureText(text).width + 16, Math.max(150, state.width - 28));
  const drawLeft = screenPos.x > state.width * 0.58;
  const x = Math.max(8, Math.min(drawLeft ? screenPos.x - width - 12 : screenPos.x + 12, state.width - width - 8));
  const box = { x, y: Math.max(screenPos.y - 13, 8), width, height: 24 };
  let guard = 0;
  while (state.labelBoxes.some((other) => overlaps(box, other)) && guard < 14) {
    box.y += 30;
    if (box.y + box.height > state.height - 8) box.y = Math.max(8, screenPos.y - 34 - guard * 30);
    guard += 1;
  }
  state.labelBoxes.push(box);
  const lineEndX = box.x > screenPos.x ? box.x : box.x + box.width;
  const lineEndY = box.y + 12;
  if (Math.hypot(lineEndX - screenPos.x, lineEndY - screenPos.y) > 30) {
    ctx.beginPath();
    ctx.moveTo(screenPos.x, screenPos.y);
    ctx.lineTo(lineEndX, lineEndY);
    ctx.strokeStyle = "rgba(205, 224, 239, 0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  roundedRect(box.x, box.y, box.width, box.height, 5);
  ctx.fillStyle = selected ? "rgba(18, 28, 36, 0.92)" : "rgba(8, 12, 17, 0.72)";
  ctx.strokeStyle = selected ? color : "rgba(255,255,255,0.12)";
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#eef6ff";
  ctx.fillText(text, box.x + 8, box.y + 16, box.width - 16);
}

function overlaps(a, b) {
  return a.x < b.x + b.width + 5 &&
    a.x + a.width + 5 > b.x &&
    a.y < b.y + b.height + 5 &&
    a.y + a.height + 5 > b.y;
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawObject(item, worldPos, radius, color, kind = "node", labelHint = "", showLabel = true) {
  const screenPos = worldToScreen(worldPos);
  if (screenPos.x < -80 || screenPos.x > state.width + 80 || screenPos.y < -80 || screenPos.y > state.height + 80) return;
  const selected = state.selectedId === item.id || state.hoverId === item.id;
  const drawRadius = Math.max(2.8, radius * Math.sqrt(state.zoom));
  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, drawRadius + (selected ? 5 : 0), 0, Math.PI * 2);
  ctx.fillStyle = selected ? `${color}3d` : `${color}1f`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, drawRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = kind === "body" ? 12 : 16;
  ctx.fill();
  ctx.shadowBlur = 0;

  if (kind === "shuttle") {
    ctx.strokeStyle = "#06130c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenPos.x + drawRadius + 4, screenPos.y);
    ctx.lineTo(screenPos.x - drawRadius, screenPos.y - drawRadius * 0.75);
    ctx.lineTo(screenPos.x - drawRadius * 0.45, screenPos.y);
    ctx.lineTo(screenPos.x - drawRadius, screenPos.y + drawRadius * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  if (showLabel) drawLabel(item.name, screenPos, color, selected, labelHint);
  state.hitTargets.push({ id: item.id, x: screenPos.x, y: screenPos.y, radius: Math.max(14, drawRadius + 8) });
}

function drawSun() {
  if (!visibleInScale("sun")) return;
  const center = worldToScreen({ x: 0, y: 0 });
  const pulse = 1 + Math.sin(state.simDays * 0.05) * 0.04;
  const r = 17 * pulse * Math.sqrt(state.zoom);
  const glow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, r * 4);
  glow.addColorStop(0, "rgba(255, 221, 117, 0.95)");
  glow.addColorStop(0.32, "rgba(255, 152, 74, 0.26)");
  glow.addColorStop(1, "rgba(255, 129, 73, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(center.x, center.y, r * 4, 0, Math.PI * 2);
  ctx.fill();
  const sun = {
    id: "sun",
    name: "Sun",
    type: "Star",
    parent: "Solar System",
    role: "Central gravity source for the displayed infrastructure network",
    infrastructure: "Foundational"
  };
  drawObject(sun, { x: 0, y: 0 }, 17, "#ffd46f", "body");
}

function drawOrbitView() {
  state.hitTargets = [];
  state.labelBoxes = [];
  updateScaleMetrics();
  drawSpace();
  if (state.showOrbits) {
    if (state.scaleMode !== "earth" && state.scaleMode !== "mars") {
      bodies.forEach((body) => {
        if (visibleInScale(body.id) || state.scaleMode === "ceres") drawOrbit(body);
      });
      drawAsteroidBelt();
      if (visibleInScale("cycler")) drawOrbit(cyclerOrbit, "rgba(255, 208, 111, 0.34)", [8, 7]);
    }
    if (state.scaleMode === "earth") drawLocalOrbit("earth", 0.00257, "#d7dce3");
    if (state.scaleMode === "mars") {
      drawLocalOrbit("mars", 0.00085, "#9ff1c7");
      drawLocalOrbit("mars", 0.0018, "#b8f3dd");
    }
  }

  if (state.scaleMode !== "earth" && state.scaleMode !== "mars") {
    routeClasses.forEach((route, index) => {
      if (visibleInScale(route.from) || visibleInScale(route.to) || state.scaleMode === "ceres") {
        drawCurvedRoute(route.from, route.to, `${route.color}88`, route.dash, -0.12 - index * 0.025, route.type === "Fast Transfer" ? 1.6 : 1.2);
      }
    });
  }

  drawSun();
  bodies.forEach((body) => {
    if (visibleInScale(body.id)) drawObject(body, getBodyWorld(body.id), body.radius, body.color, "body");
  });
  gatewayNodes.forEach((node) => {
    if (visibleInScale(node.id)) drawObject(node, node.position(), node.radius, node.color, "node");
  });
  if (visibleInScale("cycler")) drawObject(cyclerOrbit, getBodyWorld("cycler"), cyclerOrbit.radius, cyclerOrbit.color, "cycler", nextCyclerStop().label);

  shuttleRoutes.forEach((route) => {
    const show = visibleInScale(route.from) || visibleInScale(route.to) || (state.scaleMode === "inner" && route.stop !== "mars");
    if (!show) return;
    drawShuttleRoute(route);
    const pos = getShuttleWorld(route);
    const eta = pos.trip.active ? formatEta(pos.trip.nextArrival - state.simDays) : `T ${formatEta(pos.trip.nextDeparture - state.simDays)}`;
    drawObject(route, pos, pos.parked ? 3.8 : 5.2, route.color, "shuttle", eta, !pos.parked);
  });
}

function drawLocalOrbit(parentId, distance, color) {
  const center = getBodyWorld(parentId);
  ctx.beginPath();
  for (let i = 0; i <= 160; i += 1) {
    const a = (i / 160) * Math.PI * 2;
    const p = worldToScreen({ x: center.x + Math.cos(a) * distance, y: center.y + Math.sin(a) * distance });
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = `${color}55`;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawShuttleRoute(route) {
  const trip = routeProgress(route);
  if (!trip.active && state.scaleMode !== "mars" && state.scaleMode !== "earth") return;
  drawCurvedRoute(route.from, route.to, "rgba(134, 240, 189, 0.28)", [], route.stop === "earth" ? -0.18 : -0.26, 1.2);
}

function drawGravityView() {
  state.hitTargets = [];
  state.labelBoxes = [];
  drawSpace();
  drawConceptTitle("Gravity Well View", `Snapshot ${formatDate(state.conceptSnapshotDay)} | pseudo-3D effective-potential terrain.`);
  drawPotentialSurface();
  const nodes = [
    { id: "earth", name: "Earth Well", x: -1.0, y: 0.1, z: -1.6, color: "#78bfff", role: "deep gravity well" },
    { id: "leo-port", name: "LEO Port", x: -0.82, y: -0.08, z: -1.0, color: "#90f0c6", role: "exit shelf" },
    { id: "earth-moon-l1", name: "Earth-Moon L1", x: -0.38, y: -0.05, z: -0.42, color: "#c6a7ff", role: "saddle gateway" },
    { id: "moon", name: "Moon Well", x: 0.05, y: 0.16, z: -0.86, color: "#d7dce3", role: "secondary well" },
    { id: "sun-earth-l1", name: "Sun-Earth L1/L2", x: 0.48, y: -0.10, z: -0.28, color: "#ffa96f", role: "solar saddle" },
    { id: "phobos-port", name: "Mars / Phobos Shelf", x: 0.95, y: 0.22, z: -0.62, color: "#9ff1c7", role: "gateway shelf" }
  ];
  nodes.forEach((node) => {
    const p = projectIso(node.x, node.y, node.z);
    drawConceptNode(node, p.x, p.y, node.role);
  });
  drawConceptLegend(["Wells are steep energy costs, not just distances", "L1/L2 regions are saddle passes in the terrain", "Gateways matter because they sit on useful shelves and ridges"]);
}

function drawTransferView() {
  state.hitTargets = [];
  state.labelBoxes = [];
  drawSpace();
  drawConceptTitle("Transfer Manifold View", `Snapshot ${formatDate(state.conceptSnapshotDay)} | approximate tube sketch; better manifold engine needed.`);
  drawManifoldTubes();
  const nodes = [
    { id: "sun-earth-l1", name: "Sun-Earth L1/L2", x: -0.82, y: -0.18, z: 0.02, color: "#ffa96f", role: "halo gateway" },
    { id: "earth-moon-l1", name: "Earth-Moon L1", x: -0.42, y: 0.28, z: 0.04, color: "#c6a7ff", role: "lunar gateway" },
    { id: "mars-cycler-point", name: "Mars Cycler Node", x: 0.38, y: -0.20, z: 0.0, color: "#ffd06f", role: "cycler intercept" },
    { id: "phobos-port", name: "Phobos / Deimos", x: 0.72, y: 0.24, z: 0.02, color: "#9ff1c7", role: "Mars gateway" },
    { id: "ceres", name: "Ceres Belt Hub", x: 1.08, y: -0.05, z: 0.0, color: "#c5cbd4", role: "slow cargo target" }
  ];
  nodes.forEach((node) => {
    const p = projectIso(node.x, node.y, node.z);
    drawConceptNode(node, p.x, p.y, node.role);
  });
  drawConceptLegend(["Halo orbits are shown as loops around saddle gateways", "Blue tubes imply slow stable/unstable manifold corridors", "Gold arcs remain fast/cycler infrastructure, not true manifolds"]);
}

function drawConceptTitle(title, subtitle) {
  const x = state.width > 900 ? Math.max(420, state.width * 0.34) : 24;
  const y = state.width > 900 ? 112 : 360;
  ctx.fillStyle = "#f4f7fb";
  ctx.font = "700 24px Inter, system-ui";
  ctx.fillText(title, x, y);
  ctx.fillStyle = "#b8c6d6";
  ctx.font = "500 14px Inter, system-ui";
  ctx.fillText(subtitle, x, y + 26);
}

function projectIso(x, y, z = 0) {
  const angle = state.concept.rotation;
  const rotated = {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  };
  const scale = Math.min(state.width, state.height) * (state.width > 900 ? 0.27 : 0.34) * state.concept.zoom;
  const origin = {
    x: (state.width > 900 ? state.width * 0.55 : state.width * 0.53) + state.concept.pan.x,
    y: (state.width > 900 ? state.height * 0.52 : state.height * 0.58) + state.concept.pan.y
  };
  return {
    x: origin.x + (rotated.x - rotated.y) * scale * 0.92,
    y: origin.y + (rotated.x + rotated.y) * scale * state.concept.pitch - z * scale * 0.52
  };
}

function effectivePotential(x, y) {
  const wells = [
    { x: -1.0, y: 0.1, mass: 1.35, soft: 0.10 },
    { x: 0.05, y: 0.16, mass: 0.46, soft: 0.09 },
    { x: 0.95, y: 0.22, mass: 0.62, soft: 0.14 }
  ];
  const centrifugal = 0.16 * (x * x + y * y);
  const pull = wells.reduce((sum, well) => {
    const d = Math.hypot(x - well.x, y - well.y) + well.soft;
    return sum - well.mass / d;
  }, 0);
  return Math.max(-1.65, Math.min(0.58, pull * 0.34 + centrifugal));
}

function drawPotentialSurface() {
  const step = 0.18;
  ctx.lineWidth = 1;
  for (let y = -0.75; y <= 0.78; y += step) {
    ctx.beginPath();
    for (let x = -1.35; x <= 1.32; x += step) {
      const z = effectivePotential(x, y);
      const p = projectIso(x, y, z);
      if (x <= -1.34) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = "rgba(119, 203, 255, 0.16)";
    ctx.stroke();
  }
  for (let x = -1.35; x <= 1.32; x += step) {
    ctx.beginPath();
    for (let y = -0.75; y <= 0.78; y += step) {
      const z = effectivePotential(x, y);
      const p = projectIso(x, y, z);
      if (y <= -0.74) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
    ctx.stroke();
  }
  drawContour(-0.70, "rgba(198, 167, 255, 0.32)");
  drawContour(-0.42, "rgba(255, 169, 111, 0.30)");
}

function drawContour(level, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 8]);
  for (let y = -0.7; y <= 0.72; y += 0.14) {
    ctx.beginPath();
    let started = false;
    for (let x = -1.3; x <= 1.28; x += 0.07) {
      const z = effectivePotential(x, y);
      if (Math.abs(z - level) < 0.035) {
        const p = projectIso(x, y, z + 0.03);
        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawManifoldTubes() {
  drawHaloLoop(-0.82, -0.18, "#ffa96f");
  drawHaloLoop(-0.42, 0.28, "#c6a7ff");
  drawHaloLoop(0.72, 0.24, "#9ff1c7");
  drawManifoldPath([
    [-0.82, -0.18, 0.12],
    [-0.52, -0.42, 0.34],
    [-0.08, -0.26, 0.44],
    [0.38, -0.20, 0.18],
    [0.72, 0.24, 0.08]
  ], "#8da7ff", 13);
  drawManifoldPath([
    [-0.42, 0.28, 0.10],
    [-0.18, 0.50, 0.30],
    [0.24, 0.42, 0.32],
    [0.72, 0.24, 0.10],
    [1.08, -0.05, 0.02]
  ], "#7ee0ff", 10);
  drawManifoldPath([
    [-0.88, -0.12, -0.02],
    [-0.22, -0.58, 0.08],
    [0.38, -0.20, 0.06],
    [1.08, -0.05, 0.00]
  ], "#ffd06f", 6, []);
}

function drawHaloLoop(cx, cy, color) {
  ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const a = (i / 120) * Math.PI * 2;
    const p = projectIso(cx + Math.cos(a) * 0.13, cy + Math.sin(a) * 0.08, Math.sin(a) * 0.12);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = `${color}aa`;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawManifoldPath(points, color, width, dash = [9, 10]) {
  for (let offset = -1; offset <= 1; offset += 1) {
    ctx.beginPath();
    points.forEach((point, index) => {
      const p = projectIso(point[0], point[1] + offset * 0.035, point[2] + Math.abs(offset) * 0.04);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = offset === 0 ? `${color}a8` : `${color}38`;
    ctx.lineWidth = offset === 0 ? width * 0.22 : width * 0.12;
    ctx.setLineDash(dash);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawConceptNode(item, x, y, hint) {
  const selected = state.selectedId === item.id || state.hoverId === item.id;
  ctx.beginPath();
  ctx.arc(x, y, selected ? 18 : 14, 0, Math.PI * 2);
  ctx.fillStyle = `${item.color}30`;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = item.color;
  ctx.shadowColor = item.color;
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;
  drawLabel(item.name, { x, y }, item.color, selected, hint);
  state.hitTargets.push({ id: item.id, x, y, radius: 22 });
}

function drawEnergyDrop(x, y, depth, index) {
  if (index === 0) return;
  ctx.fillStyle = depth > 0.55 ? "rgba(255, 169, 111, 0.58)" : "rgba(141, 167, 255, 0.52)";
  ctx.font = "700 12px Inter, system-ui";
  ctx.fillText(depth > 0.55 ? "higher delta-v" : "lower-energy step", x - 45, y + 36);
}

function drawTube(from, to, color, dash, bend) {
  const fx = from.x * state.width;
  const fy = from.y * state.height;
  const tx = to.x * state.width;
  const ty = to.y * state.height;
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.quadraticCurveTo((fx + tx) / 2, (fy + ty) / 2 + bend, tx, ty);
  ctx.strokeStyle = `${color}55`;
  ctx.lineWidth = dash.length ? 2.2 : 2.8;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawConceptLegend(items) {
  const x = state.width > 900 ? Math.max(420, state.width * 0.34) : 24;
  const y = state.height - 92;
  ctx.fillStyle = "rgba(8, 12, 17, 0.72)";
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  roundedRect(x, y, Math.min(560, state.width - x * 2), 62, 7);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#d9e3ef";
  ctx.font = "600 13px Inter, system-ui";
  items.forEach((item, index) => ctx.fillText(item, x + 16, y + 20 + index * 16));
}

function draw() {
  if (state.viewMode === "orbit") drawOrbitView();
  if (state.viewMode === "gravity") drawGravityView();
  if (state.viewMode === "manifold") drawTransferView();
  updateHud();
  updateSchedule();
}

function updateHud() {
  simDateEl.textContent = formatDate(state.simDays);
  const conceptual = state.viewMode !== "orbit";
  statusPill.textContent = conceptual ? "Concept" : state.paused ? "Paused" : "Running";
  statusPill.style.color = conceptual ? "#8fd4ff" : state.paused ? "#ffd06f" : "#79e4b0";
  pauseButton.disabled = conceptual;
  orbitToggle.disabled = conceptual;
  scaleButtons.forEach((button) => {
    button.disabled = conceptual;
    button.setAttribute("aria-disabled", String(conceptual));
  });
  if (state.selectedId) updateInspector(state.selectedId);
}

function describeObject(id) {
  if (id === "sun") {
    return objectInfo({
      id,
      name: "Sun",
      type: "Star",
      parent: "Solar System",
      role: "Central gravity source for all displayed infrastructure routes",
      infrastructure: "Foundational"
    }, "--");
  }
  const body = bodies.find((item) => item.id === id);
  if (body) return objectInfo(body, `${angleDegrees(bodyAngle(body))} deg / ${formatOrbitalPeriod(body.period)}`);
  const node = gatewayNodes.find((item) => item.id === id);
  if (node) return objectInfo(node, positionSummary(node.position()));
  if (id === "cycler") {
    const stop = nextCyclerStop();
    return objectInfo(cyclerOrbit, `${stop.label} in ${formatEta(stop.eta)}`, stop.label, formatEta(stop.eta));
  }
  const shuttle = shuttleRoutes.find((item) => item.id === id);
  if (shuttle) {
    const trip = routeProgress(shuttle);
    const arrivalDay = trip.active ? trip.nextArrival : trip.nextDeparture + shuttle.duration;
    return objectInfo(
      shuttle,
      trip.active ? "in transfer" : "staged for next window",
      `${trip.active ? "Arrives" : "Launches"} ${formatDate(trip.active ? arrivalDay : trip.nextDeparture)}`,
      formatEta((trip.active ? arrivalDay : trip.nextDeparture) - state.simDays)
    );
  }
  const route = routeClasses.find((item) => item.id === id);
  if (route) return objectInfo(route, "conceptual route class");
  return null;
}

function objectInfo(item, phase, nextEvent = "--", eta = "--") {
  const connected = connectedRoutes(item.id);
  return {
    name: item.name,
    lead: item.role,
    details: [
      ["Type", item.type || "Infrastructure node"],
      ["Role", item.role],
      ["Parent system", item.parent || "--"],
      ["Position / phase", phase],
      ["Next event", nextEvent],
      ["Connected routes", connected.length ? connected.join(", ") : "--"],
      ["Infrastructure potential", item.infrastructure || "Medium"],
      ["ETA", eta]
    ]
  };
}

function connectedRoutes(id) {
  return [...routeClasses, ...shuttleRoutes]
    .filter((route) => route.from === id || route.to === id || (id === "cycler" && (route.from === "cycler" || route.to === "cycler")))
    .map((route) => route.name);
}

function updateInspector(id) {
  const info = describeObject(id);
  if (!info) return;
  inspectName.textContent = info.name;
  inspectRoute.textContent = info.lead;
  inspectDetails.innerHTML = info.details.map(([label, value]) => `
    <div>
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>
  `).join("");
}

function updateSchedule() {
  const rows = shuttleRoutes
    .map((route) => {
      const trip = routeProgress(route);
      const active = trip.active;
      const event = trip.currentEvent;
      const time = active ? event.arrival : event.departure;
      return {
        id: route.id,
        name: route.name,
        route: `${labelFor(route.from)} -> ${labelFor(route.to)}`,
        eta: formatEta(time - state.simDays),
        meta: `${active ? "Arrives" : "Departs"} ${formatDate(time)} near ${event.window}`,
        active,
        sortDay: time
      };
    })
    .sort((a, b) => a.sortDay - b.sortDay);

  scheduleList.innerHTML = rows.map((row) => `
    <button class="schedule-item" type="button" data-route-id="${row.id}">
      <span class="schedule-route">${row.route}</span>
      <span class="schedule-eta">${row.active ? "ETA" : "T"} ${row.eta}</span>
      <span class="schedule-meta">${row.name} - ${row.meta}</span>
    </button>
  `).join("");
}

function setZoom(nextZoom, anchor = { x: state.width / 2, y: state.height / 2 }) {
  const clamped = Math.max(0.55, Math.min(3.8, nextZoom));
  const before = screenToWorld(anchor);
  state.zoom = clamped;
  const after = worldToScreen(before);
  state.pan.x += anchor.x - after.x;
  state.pan.y += anchor.y - after.y;
}

function selectAt(point) {
  const id = hitTest(point);
  if (!id) return false;
  state.selectedId = id;
  updateInspector(id);
  return true;
}

function tick(now) {
  const elapsed = Math.min(80, now - lastFrame);
  lastFrame = now;
  updateCameraTransition(now);
  if (!state.paused && state.viewMode === "orbit") {
    state.simDays += (elapsed / 1000) * state.speed * 0.08;
  }
  draw();
  requestAnimationFrame(tick);
}

function setSpeed(speed) {
  state.speed = speed;
  speedButtons.forEach((button) => button.classList.toggle("active", Number(button.dataset.speed) === speed));
}

function setViewMode(mode) {
  state.viewMode = mode;
  state.selectedId = null;
  if (mode !== "orbit") {
    state.conceptSnapshotDay = state.simDays;
    state.concept.rotation = mode === "gravity" ? -0.22 : 0.12;
    state.concept.pitch = mode === "gravity" ? 0.34 : 0.28;
    state.concept.zoom = 1;
    state.concept.pan = { x: 0, y: 0 };
  }
  document.body.dataset.viewMode = mode;
  modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.viewMode === mode));
  canvas.style.cursor = mode === "orbit" ? "grab" : "default";
  updateInspector(mode === "gravity" ? "leo-port" : mode === "manifold" ? "sun-earth-l1" : "earth");
}

function setScaleMode(mode) {
  state.scaleMode = mode;
  scaleButtons.forEach((button) => button.classList.toggle("active", button.dataset.scaleMode === mode));
  state.zoom = 1;
  state.pan = { x: 0, y: 0 };
  startCameraTransition(mode);
  const representatives = {
    solar: "earth",
    inner: "cycler",
    earth: "leo-port",
    mars: "phobos-port",
    ceres: "ceres"
  };
  state.selectedId = representatives[mode] || "earth";
  updateInspector(state.selectedId);
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function hitTest(point) {
  for (let i = state.hitTargets.length - 1; i >= 0; i -= 1) {
    const target = state.hitTargets[i];
    if (Math.hypot(point.x - target.x, point.y - target.y) <= target.radius) return target.id;
  }
  return null;
}

function labelFor(id) {
  if (id === "cycler") return cyclerOrbit.name;
  const body = bodies.find((item) => item.id === id);
  if (body) return body.name;
  const node = gatewayNodes.find((item) => item.id === id);
  if (node) return node.name;
  return id;
}

function formatDate(day) {
  const date = new Date(startDate.getTime() + day * DAY_MS);
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(date);
}

function formatEta(days) {
  if (days <= 0.05) return "Arriving";
  if (days < 1) return `${Math.round(days * 24)} h`;
  if (days < 90) return `${Math.ceil(days)} d`;
  return `${Math.round(days / 30)} mo`;
}

function nextCyclerStop(day = state.simDays) {
  const local = ((day % cyclerOrbit.period) + cyclerOrbit.period) % cyclerOrbit.period;
  const next = cyclerOrbit.stops.find((stop) => stop.day > local) || cyclerOrbit.stops[0];
  const eta = next.day > local ? next.day - local : cyclerOrbit.period - local + next.day;
  return { label: next.label, eta, day: day + eta };
}

function formatOrbitalPeriod(days) {
  return days < 800 ? `${Math.round(days)} d` : `${(days / 365.25).toFixed(1)} y`;
}

function angleDegrees(angle) {
  const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return Math.round((normalized * 180) / Math.PI);
}

function positionSummary(pos) {
  return `${pos.x.toFixed(3)} AU, ${pos.y.toFixed(3)} AU`;
}

speedButtons.forEach((button) => {
  button.addEventListener("click", () => setSpeed(Number(button.dataset.speed)));
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setViewMode(button.dataset.viewMode));
});

scaleButtons.forEach((button) => {
  button.addEventListener("click", () => setScaleMode(button.dataset.scaleMode));
});

pauseButton.addEventListener("click", () => {
  state.paused = !state.paused;
  pauseIcon.textContent = state.paused ? ">" : "||";
  pauseButton.title = state.paused ? "Resume simulation" : "Pause simulation";
  pauseButton.setAttribute("aria-label", pauseButton.title);
});

zoomOutButton.addEventListener("click", () => setZoom(state.zoom / 1.25));
zoomInButton.addEventListener("click", () => setZoom(state.zoom * 1.25));

orbitToggle.addEventListener("change", () => {
  state.showOrbits = orbitToggle.checked;
});

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const point = pointerPosition(event);
  const factor = event.deltaY > 0 ? 0.88 : 1.14;
  if (state.viewMode === "orbit") {
    setZoom(state.zoom * factor, point);
    return;
  }
  state.concept.zoom = Math.max(0.55, Math.min(2.6, state.concept.zoom * factor));
}, { passive: false });

canvas.addEventListener("pointerdown", (event) => {
  const point = pointerPosition(event);
  state.dragging = true;
  state.dragStart = point;
  state.dragPanStart = { ...state.pan };
  state.conceptDragStart = {
    rotation: state.concept.rotation,
    pitch: state.concept.pitch,
    pan: { ...state.concept.pan },
    mode: event.shiftKey || event.altKey ? "pan" : "rotate"
  };
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  const point = pointerPosition(event);
  if (state.dragging) {
    if (state.viewMode === "orbit") {
      state.pan.x = state.dragPanStart.x + point.x - state.dragStart.x;
      state.pan.y = state.dragPanStart.y + point.y - state.dragStart.y;
    } else if (state.conceptDragStart?.mode === "pan") {
      state.concept.pan.x = state.conceptDragStart.pan.x + point.x - state.dragStart.x;
      state.concept.pan.y = state.conceptDragStart.pan.y + point.y - state.dragStart.y;
    } else {
      state.concept.rotation = state.conceptDragStart.rotation + (point.x - state.dragStart.x) * 0.008;
      state.concept.pitch = Math.max(0.18, Math.min(0.54, state.conceptDragStart.pitch + (point.y - state.dragStart.y) * 0.0018));
    }
    canvas.style.cursor = "grabbing";
    return;
  }
  state.hoverId = hitTest(point);
  canvas.style.cursor = state.hoverId ? "pointer" : state.viewMode === "orbit" ? "grab" : "default";
});

canvas.addEventListener("pointerup", (event) => {
  const point = pointerPosition(event);
  const moved = Math.hypot(point.x - state.dragStart.x, point.y - state.dragStart.y) > 5;
  state.dragging = false;
  state.conceptDragStart = null;
  canvas.releasePointerCapture(event.pointerId);
  canvas.style.cursor = state.viewMode === "orbit" ? "grab" : "default";
  if (!moved) selectAt(point);
});

canvas.addEventListener("pointercancel", () => {
  state.dragging = false;
});

canvas.addEventListener("mouseleave", () => {
  state.hoverId = null;
});

scheduleList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-route-id]");
  if (!item) return;
  state.selectedId = item.dataset.routeId;
  updateInspector(state.selectedId);
});

window.addEventListener("resize", resize);
resize();
setSpeed(10);
document.body.dataset.viewMode = state.viewMode;
updateInspector("earth");
requestAnimationFrame(tick);
