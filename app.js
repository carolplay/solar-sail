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
const inspectArrival = document.getElementById("inspectArrival");
const inspectEta = document.getElementById("inspectEta");
const scheduleList = document.getElementById("scheduleList");
const speedButtons = Array.from(document.querySelectorAll(".speed-button"));

const DAY_MS = 86400000;
const startDate = new Date(Date.UTC(2187, 0, 1, 12));
const state = {
  simDays: 0,
  speed: 10,
  paused: false,
  showOrbits: true,
  selectedId: null,
  hoverId: null,
  width: 0,
  height: 0,
  dpr: 1,
  center: { x: 0, y: 0 },
  au: 1,
  zoom: 1,
  pan: { x: 0, y: 0 },
  dragging: false,
  dragStart: { x: 0, y: 0 },
  dragPanStart: { x: 0, y: 0 },
  hitTargets: [],
  labelBoxes: []
};

const bodies = [
  { id: "earth", name: "Earth", semiMajor: 1, eccentricity: 0.0167, period: 365.25, radius: 7, color: "#6fb8ff", phase: 0.15, argPeri: 1.8, route: "Primary inner-system port" },
  { id: "mars", name: "Mars", semiMajor: 1.524, eccentricity: 0.0934, period: 686.98, radius: 6, color: "#e46f58", phase: 1.95, argPeri: 5.0, route: "Outbound terminus for the cycler corridor" },
  { id: "ceres", name: "Ceres", semiMajor: 2.77, eccentricity: 0.076, period: 1681.6, radius: 4.5, color: "#b8c0ca", phase: 2.8, argPeri: 1.3, route: "Belt anchor and remote traffic marker" }
];

const cyclerOrbit = {
  semiMajor: 1.36,
  eccentricity: 0.27,
  period: 780,
  phase: 0,
  argPeri: 0.22
};

const lagrangePoints = [
  { id: "earth-l4", name: "Earth L4", offset: Math.PI / 3, color: "#ff86b4", route: "Leading Earth Trojan infrastructure cluster" },
  { id: "earth-l5", name: "Earth L5", offset: -Math.PI / 3, color: "#ff86b4", route: "Trailing Earth Trojan infrastructure cluster" }
];

const cycler = {
  id: "cycler",
  name: "Aldrin Cycler",
  period: 780,
  radius: 6,
  color: "#ffd06f",
  route: "Repeating Earth-Mars cycler orbit",
  stops: [
    { id: "earth", day: 0, label: "Earth rendezvous" },
    { id: "mars", day: 258, label: "Mars rendezvous" },
    { id: "earth", day: 780, label: "Earth rendezvous" }
  ]
};

const shuttleRoutes = [
  { id: "earth-cycler-a", name: "Shuttle E-C 01", from: "earth", to: "cycler", stop: "earth", departOffset: -9, duration: 9, color: "#88efbc", route: "Earth launch timed to cycler Earth rendezvous" },
  { id: "earth-cycler-b", name: "Shuttle C-E 02", from: "cycler", to: "earth", stop: "earth", departOffset: 0, duration: 9, color: "#88efbc", route: "Cycler return timed to Earth flyby" },
  { id: "cycler-mars-a", name: "Shuttle C-M 03", from: "cycler", to: "mars", stop: "mars", departOffset: 0, duration: 16, color: "#9df7d0", route: "Mars terminal transfer timed to cycler Mars rendezvous" },
  { id: "cycler-mars-b", name: "Shuttle M-C 04", from: "mars", to: "cycler", stop: "mars", departOffset: -16, duration: 16, color: "#9df7d0", route: "Mars ascent timed to cycler intercept" }
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
    x: state.width * (state.width < 820 ? 0.48 : 0.46),
    y: state.height * (state.width < 820 ? 0.42 : 0.52)
  };
  const usable = Math.min(state.width * 0.82, state.height * 0.78);
  state.au = usable / 6.1;
}

function toScreen(pos) {
  return {
    x: state.center.x + (pos.x - state.center.x) * state.zoom + state.pan.x,
    y: state.center.y + (pos.y - state.center.y) * state.zoom + state.pan.y
  };
}

function fromScreen(point) {
  return {
    x: state.center.x + (point.x - state.center.x - state.pan.x) / state.zoom,
    y: state.center.y + (point.y - state.center.y - state.pan.y) / state.zoom
  };
}

function screenCenter() {
  return toScreen(state.center);
}

function meanAnomaly(body, day = state.simDays) {
  return body.phase + (day / body.period) * Math.PI * 2;
}

function bodyAngle(body, day = state.simDays) {
  return trueAnomaly(meanAnomaly(body, day), body.eccentricity) + body.argPeri;
}

function orbitPosition(orbit, angle, radius = orbit) {
  const tilt = 0.47;
  return {
    x: state.center.x + Math.cos(angle) * radius * state.au,
    y: state.center.y + Math.sin(angle) * radius * state.au * tilt
  };
}

function ellipticalPosition(orbit, day = state.simDays) {
  const anomaly = meanAnomaly(orbit, day);
  const eccentricAnomaly = solveEccentricAnomaly(anomaly, orbit.eccentricity);
  const angle = trueAnomalyFromEccentric(eccentricAnomaly, orbit.eccentricity) + orbit.argPeri;
  const radius = orbit.semiMajor * (1 - orbit.eccentricity * Math.cos(eccentricAnomaly));
  return orbitPosition(orbit.semiMajor, angle, radius);
}

function solveEccentricAnomaly(mean, eccentricity) {
  let eccentric = mean;
  for (let i = 0; i < 6; i++) {
    eccentric -= (eccentric - eccentricity * Math.sin(eccentric) - mean) / (1 - eccentricity * Math.cos(eccentric));
  }
  return eccentric;
}

function trueAnomaly(mean, eccentricity) {
  return trueAnomalyFromEccentric(solveEccentricAnomaly(mean, eccentricity), eccentricity);
}

function trueAnomalyFromEccentric(eccentricAnomaly, eccentricity) {
  return 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
  );
}

function getBodyPosition(id, day = state.simDays) {
  if (id === "sun") return { x: state.center.x, y: state.center.y };
  if (id === "cycler") return getCyclerPosition(day);
  const body = bodies.find((item) => item.id === id);
  if (body) return ellipticalPosition(body, day);
  const point = lagrangePoints.find((item) => item.id === id);
  if (point) return getLagrangePosition(point, day);
  return { x: state.center.x, y: state.center.y };
}

function getLagrangePosition(point, day = state.simDays) {
  const earth = bodies[0];
  const earthRadius = distanceFromSun(earth, day);
  return orbitPosition(earth.semiMajor, bodyAngle(earth, day) + point.offset, earthRadius);
}

function getCyclerPosition(day = state.simDays) {
  return ellipticalPosition(cyclerOrbit, day);
}

function distanceFromSun(orbit, day = state.simDays) {
  const eccentricAnomaly = solveEccentricAnomaly(meanAnomaly(orbit, day), orbit.eccentricity);
  return orbit.semiMajor * (1 - orbit.eccentricity * Math.cos(eccentricAnomaly));
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
    currentEvent: event,
    lastEvent: previousRouteEvent(route, day)
  };
}

function routeEvent(route, day = state.simDays) {
  const stopDay = stopDayFor(route.stop);
  const currentCycle = Math.floor((day - stopDay - route.departOffset) / cycler.period);
  const candidate = eventForCycle(route, currentCycle);
  if (day <= candidate.arrival) {
    return { ...candidate, nextDeparture: candidate.departure, nextArrival: candidate.arrival };
  }
  const next = eventForCycle(route, currentCycle + 1);
  return { ...next, nextDeparture: next.departure, nextArrival: next.arrival };
}

function previousRouteEvent(route, day = state.simDays) {
  const stopDay = stopDayFor(route.stop);
  const cycle = Math.floor((day - stopDay - route.departOffset) / cycler.period);
  const event = eventForCycle(route, cycle);
  return event.arrival < day ? event : eventForCycle(route, cycle - 1);
}

function eventForCycle(route, cycle) {
  const rendezvous = cycle * cycler.period + stopDayFor(route.stop);
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
  return cycler.stops.find((item) => item.id === stop).day;
}

function getShuttlePosition(route, day = state.simDays) {
  const trip = routeProgress(route, day);
  const from = getBodyPosition(route.from, day);
  const to = getBodyPosition(route.to, day);
  if (!trip.active) {
    const stagedForDeparture = trip.currentEvent.departure - day < 45;
    const parkedAt = stagedForDeparture ? route.from : route.to;
    return { ...getBodyPosition(parkedAt, day), parked: true, trip };
  }
  const ease = trip.progress * trip.progress * (3 - 2 * trip.progress);
  const arc = Math.sin(Math.PI * trip.progress) * (route.stop === "earth" ? 18 : 28);
  return {
    x: from.x + (to.x - from.x) * ease,
    y: from.y + (to.y - from.y) * ease - arc,
    parked: false,
    trip
  };
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
  const local = ((day % cycler.period) + cycler.period) % cycler.period;
  const next = cycler.stops.find((stop) => stop.day > local) || cycler.stops[0];
  const eta = next.day > local ? next.day - local : cycler.period - local + next.day;
  return { label: next.label, eta, day: day + eta };
}

function drawSpace() {
  const sun = screenCenter();
  const gradient = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, state.au * state.zoom * 3.4);
  gradient.addColorStop(0, "rgba(255, 188, 78, 0.13)");
  gradient.addColorStop(0.35, "rgba(48, 88, 111, 0.08)");
  gradient.addColorStop(1, "rgba(7, 9, 13, 0)");
  ctx.fillStyle = "#05070b";
  ctx.fillRect(0, 0, state.width, state.height);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  for (let i = 0; i < 90; i++) {
    const x = (i * 181 + 37) % state.width;
    const y = (i * 97 + 19) % state.height;
    const alpha = 0.14 + ((i * 13) % 60) / 180;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, y, i % 5 === 0 ? 1.6 : 1, i % 7 === 0 ? 1.6 : 1);
  }
  ctx.globalAlpha = 1;
}

function drawOrbit(orbit, color = "rgba(255,255,255,0.14)") {
  ctx.beginPath();
  for (let i = 0; i <= 220; i++) {
    const mean = (i / 220) * Math.PI * 2;
    const eccentricAnomaly = solveEccentricAnomaly(mean, orbit.eccentricity);
    const angle = trueAnomalyFromEccentric(eccentricAnomaly, orbit.eccentricity) + orbit.argPeri;
    const radius = orbit.semiMajor * (1 - orbit.eccentricity * Math.cos(eccentricAnomaly));
    const p = toScreen(orbitPosition(orbit.semiMajor, angle, radius));
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawCyclerTrack() {
  ctx.beginPath();
  for (let i = 0; i <= 260; i++) {
    const mean = (i / 260) * Math.PI * 2;
    const eccentricAnomaly = solveEccentricAnomaly(mean, cyclerOrbit.eccentricity);
    const angle = trueAnomalyFromEccentric(eccentricAnomaly, cyclerOrbit.eccentricity) + cyclerOrbit.argPeri;
    const radius = cyclerOrbit.semiMajor * (1 - cyclerOrbit.eccentricity * Math.cos(eccentricAnomaly));
    const p = toScreen(orbitPosition(cyclerOrbit.semiMajor, angle, radius));
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = "rgba(255, 208, 111, 0.3)";
  ctx.lineWidth = 1.4;
  ctx.setLineDash([7, 7]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawRouteLine(route) {
  const trip = routeProgress(route);
  if (!trip.active) return;
  const from = toScreen(getBodyPosition(route.from));
  const to = toScreen(getBodyPosition(route.to));
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.quadraticCurveTo((from.x + to.x) / 2, (from.y + to.y) / 2 - 46 * state.zoom, to.x, to.y);
  ctx.strokeStyle = "rgba(134, 240, 189, 0.28)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

function drawLabel(name, pos, eta, color, selected = false) {
  const text = eta ? `${name} | ETA ${eta}` : name;
  ctx.font = selected ? "700 13px Inter, system-ui" : "600 12px Inter, system-ui";
  const width = ctx.measureText(text).width + 16;
  const center = screenCenter();
  const drawLeft = pos.x > center.x + state.au * state.zoom * 0.5;
  const x = Math.max(8, Math.min(drawLeft ? pos.x - width - 12 : pos.x + 12, state.width - width - 8));
  let y = Math.max(pos.y - 13, 8);
  const box = { x, y, width, height: 24 };
  let guard = 0;
  while (state.labelBoxes.some((other) => overlaps(box, other)) && guard < 14) {
    box.y += 30;
    if (box.y + box.height > state.height - 8) box.y = Math.max(8, pos.y - 34 - guard * 30);
    guard += 1;
  }
  y = box.y;
  state.labelBoxes.push({ x, y, width, height: 24 });
  const labelCenterY = y + 12;
  const lineEndX = x > pos.x ? x : x + width;
  if (Math.hypot(lineEndX - pos.x, labelCenterY - pos.y) > 30) {
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(lineEndX, labelCenterY);
    ctx.strokeStyle = "rgba(205, 224, 239, 0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.fillStyle = selected ? "rgba(18, 28, 36, 0.9)" : "rgba(8, 12, 17, 0.72)";
  ctx.strokeStyle = selected ? color : "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  roundedRect(x, y, width, 24, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#eef6ff";
  ctx.fillText(text, x + 8, y + 16);
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

function drawObject(item, pos, radius, color, eta = "", kind = "body", showLabel = true) {
  const screenPos = toScreen(pos);
  const drawRadius = Math.max(2.5, radius * Math.sqrt(state.zoom));
  const selected = state.selectedId === item.id || state.hoverId === item.id;
  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, drawRadius + (selected ? 5 : 0), 0, Math.PI * 2);
  ctx.fillStyle = selected ? `${color}36` : `${color}18`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, drawRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = kind === "body" ? 12 : 18;
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

  if (showLabel) drawLabel(item.name, screenPos, eta, color, selected);
  state.hitTargets.push({ id: item.id, x: screenPos.x, y: screenPos.y, radius: Math.max(14, drawRadius + 8) });
}

function drawSun() {
  const center = screenCenter();
  const pulse = 1 + Math.sin(state.simDays * 0.05) * 0.05;
  const r = 17 * pulse * Math.sqrt(state.zoom);
  const glow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, r * 4);
  glow.addColorStop(0, "rgba(255, 221, 117, 0.95)");
  glow.addColorStop(0.32, "rgba(255, 152, 74, 0.26)");
  glow.addColorStop(1, "rgba(255, 129, 73, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(center.x, center.y, r * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd46f";
  ctx.beginPath();
  ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
  ctx.fill();
  drawLabel("Sun", center, "", "#ffd46f", state.selectedId === "sun");
  state.hitTargets.push({ id: "sun", x: center.x, y: center.y, radius: 24 });
}

function draw() {
  state.hitTargets = [];
  state.labelBoxes = [];
  drawSpace();
  if (state.showOrbits) {
    bodies.forEach((body) => drawOrbit(body));
    drawOrbit(bodies[0], "rgba(255, 135, 178, 0.16)");
    drawCyclerTrack();
  }
  shuttleRoutes.forEach(drawRouteLine);
  drawSun();

  bodies.forEach((body) => {
    const pos = getBodyPosition(body.id);
    drawObject(body, pos, body.radius, body.color, "", "body");
  });

  lagrangePoints.forEach((point) => {
    const pos = getLagrangePosition(point);
    drawObject(point, pos, 4.2, point.color, "", "point");
  });

  const cyclerStop = nextCyclerStop();
  drawObject(cycler, getCyclerPosition(), cycler.radius, cycler.color, "", "cycler");

  shuttleRoutes.forEach((route) => {
    const pos = getShuttlePosition(route);
    const eta = pos.trip.active ? formatEta(pos.trip.nextArrival - state.simDays) : `Dep ${formatEta(pos.trip.nextDeparture - state.simDays)}`;
    drawObject(route, pos, pos.parked ? 3.8 : 5.2, route.color, eta, "shuttle", !pos.parked);
  });

  updateHud();
  updateSchedule();
}

function updateHud() {
  simDateEl.textContent = formatDate(state.simDays);
  statusPill.textContent = state.paused ? "Paused" : "Running";
  statusPill.style.color = state.paused ? "#ffd06f" : "#79e4b0";
  if (state.selectedId) updateInspector(state.selectedId);
}

function describeObject(id) {
  if (id === "sun") {
    return { name: "Sun", route: "System barycenter for all displayed routes.", arrival: "--", eta: "--" };
  }
  const body = bodies.find((item) => item.id === id);
  if (body) {
    return { name: body.name, route: `${body.route}. Orbital period ${formatOrbitalPeriod(body.period)}.`, arrival: "--", eta: "--" };
  }
  const point = lagrangePoints.find((item) => item.id === id);
  if (point) {
    return { name: point.name, route: point.route, arrival: "Co-orbits with Earth", eta: "--" };
  }
  if (id === "cycler") {
    const stop = nextCyclerStop();
    return { name: cycler.name, route: `${cycler.route}. Next ${stop.label.toLowerCase()} in ${formatEta(stop.eta)}.`, arrival: stop.label, eta: "--" };
  }
  const shuttle = shuttleRoutes.find((item) => item.id === id);
  if (shuttle) {
    const trip = routeProgress(shuttle);
    const from = labelFor(shuttle.from);
    const to = labelFor(shuttle.to);
    const arrivalDay = trip.active ? trip.nextArrival : trip.nextDeparture + shuttle.duration;
    return {
      name: shuttle.name,
      route: `${from} -> ${to}. ${trip.currentEvent.window}; ${trip.active ? "in transfer now" : "next launch window is staged to the cycler flyby"}.`,
      arrival: formatDate(arrivalDay),
      eta: formatEta(arrivalDay - state.simDays)
    };
  }
  return null;
}

function formatOrbitalPeriod(days) {
  return days < 800 ? `${Math.round(days)} d` : `${(days / 365.25).toFixed(1)} y`;
}

function labelFor(id) {
  if (id === "cycler") return cycler.name;
  const body = bodies.find((item) => item.id === id);
  return body ? body.name : id;
}

function updateInspector(id) {
  const info = describeObject(id);
  if (!info) return;
  inspectName.textContent = info.name;
  inspectRoute.textContent = info.route;
  inspectArrival.textContent = info.arrival;
  inspectEta.textContent = info.eta;
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
  const clamped = Math.max(0.55, Math.min(3.5, nextZoom));
  const before = fromScreen(anchor);
  state.zoom = clamped;
  const after = toScreen(before);
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
  if (!state.paused) {
    state.simDays += (elapsed / 1000) * state.speed * 0.08;
  }
  draw();
  requestAnimationFrame(tick);
}

function setSpeed(speed) {
  state.speed = speed;
  speedButtons.forEach((button) => button.classList.toggle("active", Number(button.dataset.speed) === speed));
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function hitTest(point) {
  for (let i = state.hitTargets.length - 1; i >= 0; i--) {
    const target = state.hitTargets[i];
    const dx = point.x - target.x;
    const dy = point.y - target.y;
    if (Math.hypot(dx, dy) <= target.radius) return target.id;
  }
  return null;
}

speedButtons.forEach((button) => {
  button.addEventListener("click", () => setSpeed(Number(button.dataset.speed)));
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
  setZoom(state.zoom * factor, point);
}, { passive: false });

canvas.addEventListener("pointerdown", (event) => {
  const point = pointerPosition(event);
  state.dragging = true;
  state.dragStart = point;
  state.dragPanStart = { ...state.pan };
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  const point = pointerPosition(event);
  if (state.dragging) {
    state.pan.x = state.dragPanStart.x + point.x - state.dragStart.x;
    state.pan.y = state.dragPanStart.y + point.y - state.dragStart.y;
    canvas.style.cursor = "grabbing";
    return;
  }
  state.hoverId = hitTest(point);
  canvas.style.cursor = state.hoverId ? "pointer" : "grab";
});

canvas.addEventListener("pointerup", (event) => {
  const point = pointerPosition(event);
  const moved = Math.hypot(point.x - state.dragStart.x, point.y - state.dragStart.y) > 5;
  state.dragging = false;
  canvas.releasePointerCapture(event.pointerId);
  canvas.style.cursor = "grab";
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
requestAnimationFrame(tick);
