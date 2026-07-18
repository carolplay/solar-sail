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
const modelBadge = document.getElementById("modelBadge");
const modelNote = document.getElementById("modelNote");
const frameBadge = document.getElementById("frameBadge");
const scaleBadge = document.getElementById("scaleBadge");
const routeBadge = document.getElementById("routeBadge");
const articleButton = document.getElementById("articleButton");
const articleDrawer = document.getElementById("articleDrawer");
const articleTitle = document.getElementById("articleTitle");
const articleBody = document.getElementById("articleBody");
const articleClose = document.getElementById("articleClose");
const speedButtons = Array.from(document.querySelectorAll(".speed-button"));
const modeButtons = Array.from(document.querySelectorAll(".mode-button"));
const scaleButtons = Array.from(document.querySelectorAll(".scale-button"));
const scenarioButtons = Array.from(document.querySelectorAll(".scenario-button"));
const languageButtons = Array.from(document.querySelectorAll(".language-button"));
const layerToggles = Array.from(document.querySelectorAll("[data-layer]"));
const sheetButtons = Array.from(document.querySelectorAll("[data-sheet-state]"));
const reviewMenu = document.getElementById("reviewMenu");
const reviewDrawer = document.getElementById("reviewDrawer");
const reviewClose = document.getElementById("reviewClose");
const reviewForm = document.getElementById("reviewForm");
const reviewTitle = document.getElementById("reviewTitle");
const reviewEyebrow = document.getElementById("reviewEyebrow");
const reviewPrompt = document.getElementById("reviewPrompt");
const reviewPromptLabel = document.getElementById("reviewPromptLabel");
const reviewFeedback = document.getElementById("reviewFeedback");
const reviewFeedbackWrap = document.getElementById("reviewFeedbackWrap");
const reviewFeedbackLabel = document.getElementById("reviewFeedbackLabel");
const reviewRatingGroup = document.getElementById("reviewRatingGroup");
const reviewRatingButtons = Array.from(document.querySelectorAll(".rating-button"));
const reviewSnapshot = document.getElementById("reviewSnapshot");
const reviewSnapshotLabel = document.getElementById("reviewSnapshotLabel");
const reviewSubmit = document.getElementById("reviewSubmit");
const reviewCancel = document.getElementById("reviewCancel");
const reviewStatus = document.getElementById("reviewStatus");

const DAY_MS = 86400000;
const modelEpochLabel = "2026-07-09";
const modelTimeSpan = "Approximate over decades near the documented epoch; not mission-grade.";
const demoVersion = "Demo 0.2.7";
const startDate = new Date(Date.UTC(2026, 6, 9, 12));
const tilt = 0.47;
const leoPeriodDays = 0.0646;
const gravityWellDepthUnits = {
  earth: { value: 1.00, label: "Earth escape-energy unit", basis: "Earth surface escape energy = 1.00 EEU" },
  moon: { value: 0.05, label: "Earth escape-energy unit", basis: "Moon surface escape energy, normalized to Earth" },
  mars: { value: 0.20, label: "Earth escape-energy unit", basis: "Mars surface escape energy, normalized to Earth" },
  ceres: { value: 0.002, label: "Earth escape-energy unit", basis: "Ceres surface escape energy, normalized to Earth" }
};

const state = {
  simDays: 0,
  speed: 10,
  paused: false,
  showOrbits: true,
  layers: {
    planets: true,
    infrastructure: true,
    lagrange: true,
    cyclers: true,
    fastTransfers: true,
    lowEnergy: true,
    probeOrbits: true,
    labels: true
  },
  activeArticleId: "orbit-view",
  scenarioId: "earth-moon",
  viewMode: "orbit",
  scaleMode: "solar",
  selectedId: null,
  hoverId: null,
  language: "en",
  reviewAction: "question",
  reviewTargetId: null,
  reviewRating: "",
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

const translations = {
  en: {
    appTitle: "Solar Infrastructure Viewer",
    frameLabel: "Frame",
    scaleLabel: "Scale",
    routesLabel: "Routes",
    orbitView: "Orbit View",
    gravityView: "Gravity Well View",
    lowEnergyView: "Low-Energy Routes View",
    solarSystem: "Solar System",
    innerSystem: "Inner System",
    earthGateway: "Earth Gateway",
    marsGateway: "Mars Gateway",
    ceresBelt: "Ceres / Belt",
    atlasLayers: "Atlas Layers",
    layerPlanets: "Planets",
    layerNodes: "Nodes",
    layerLagrange: "Lagrange",
    layerCyclers: "Cyclers",
    layerFast: "Fast",
    layerLowEnergy: "Low energy",
    layerProbes: "Probes",
    layerLabels: "Labels",
    orbitsToggle: "Orbits",
    inspection: "Inspection",
    openExplanation: "Open explanation",
    shuttleSchedule: "Shuttle Schedule",
    explanation: "Explanation",
    askAboutThis: "Ask about this",
    leaveFeedback: "Leave feedback",
    offlineReview: "Offline Review",
    questionTitle: "Ask about this",
    feedbackTitle: "Leave feedback",
    questionLabel: "Question",
    feedbackSummaryLabel: "Feedback summary",
    feedbackDetailLabel: "Feedback detail",
    includeSnapshot: "Include canvas snapshot",
    saveLocally: "Save locally",
    saving: "Saving...",
    savedQuestion: "Saved to operations/questions-local.jsonl",
    savedFeedback: "Saved to operations/feedback-local.jsonl",
    saveFailed: "Could not save. Use the local preview server, not GitHub Pages.",
    cancel: "Cancel",
    ratingGood: "Good",
    ratingNeedsWork: "Needs work",
    running: "Running",
    paused: "Paused",
    research: "Research",
    eta: "ETA",
    timePrefix: "T",
    arriving: "Arriving",
    selectObject: "Select an object",
    inspectHint: "Click a planet, station point, cycler, or shuttle to inspect its route.",
    legendPhysicalOrbit: "Physical orbit",
    legendTransferClass: "Transfer class",
    legendServiceSchedule: "Service schedule",
    legendConceptCorridor: "Concept corridor",
    legendSchematicNode: "Schematic node"
  },
  zh: {
    appTitle: "太阳系基础设施视图",
    frameLabel: "坐标框架",
    scaleLabel: "尺度",
    routesLabel: "路线",
    orbitView: "轨道视图",
    gravityView: "能量井视图",
    lowEnergyView: "低能路线视图",
    solarSystem: "太阳系",
    innerSystem: "内太阳系",
    earthGateway: "地球门户",
    marsGateway: "火星门户",
    ceresBelt: "谷神星 / 小行星带",
    atlasLayers: "图层",
    layerPlanets: "行星",
    layerNodes: "节点",
    layerLagrange: "拉格朗日",
    layerCyclers: "循环器",
    layerFast: "快速",
    layerLowEnergy: "低能",
    layerProbes: "探测器",
    layerLabels: "标签",
    orbitsToggle: "轨道",
    inspection: "检查",
    openExplanation: "打开解释",
    shuttleSchedule: "穿梭时刻表",
    explanation: "解释",
    askAboutThis: "提问",
    leaveFeedback: "反馈",
    offlineReview: "离线勘查",
    questionTitle: "提出问题",
    feedbackTitle: "记录反馈",
    questionLabel: "问题",
    feedbackSummaryLabel: "反馈摘要",
    feedbackDetailLabel: "反馈细节",
    includeSnapshot: "附带画布截图",
    saveLocally: "保存到本地",
    saving: "保存中...",
    savedQuestion: "已保存到 operations/questions-local.jsonl",
    savedFeedback: "已保存到 operations/feedback-local.jsonl",
    saveFailed: "保存失败。需要使用本地 preview server，而不是 GitHub Pages。",
    cancel: "取消",
    ratingGood: "可用",
    ratingNeedsWork: "需要改",
    running: "运行中",
    paused: "已暂停",
    research: "研究",
    eta: "到达",
    timePrefix: "T",
    arriving: "正在到达",
    selectObject: "选择对象",
    inspectHint: "点击行星、站点、循环器或穿梭路线来检查。",
    legendPhysicalOrbit: "物理轨道",
    legendTransferClass: "转移类型",
    legendServiceSchedule: "服务时刻",
    legendConceptCorridor: "概念通道",
    legendSchematicNode: "示意节点"
  }
};

function t(key) {
  return translations[state.language]?.[key] || translations.en[key] || key;
}

const viewModels = {
  orbit: {
    label: "Ephemeris-like / approximate",
    note: `Epoch ${modelEpochLabel}. Keplerian browser model; spacecraft routes are classified overlays.`,
    frame: "Heliocentric map",
    scale: "AU positions",
    routes: "Typed atlas overlay"
  },
  gravity: {
    label: "Conceptual contour terrain",
    note: "Approximate orbit positions drive fixed-depth wells through a normalized proxy terrain; not a solved gravitational potential field.",
    frame: "Scenario energy lens",
    scale: "Normalized terrain",
    routes: "Terrain primitives"
  },
  manifold: {
    label: "Heuristic route-window model",
    note: "Route families are conceptual; availability and flow are dynamic.",
    frame: "Scenario route lens",
    scale: "Cadence / wait",
    routes: "Dynamic availability"
  }
};

const scenarios = {
  "earth-moon": {
    id: "earth-moon",
    name: "Earth-Moon Gateway Logistics",
    problem: "How does gateway placement reduce surface and orbital logistics friction?",
    focusMode: "earth",
    recommendedView: "orbit",
    defaultInspectId: "earth-moon-cargo-ladder",
    demand: 0.72,
    urgency: 0.62,
    offset: 18,
    emphasis: {
      nodes: new Set(["earth", "leo-port", "moon", "earth-moon-l1", "sun-earth-l1", "sun-earth-l2"]),
      routes: new Set(["earth-moon-cargo-ladder", "leo-l1-shuttle", "lunar-surface-hop"])
    },
    layerPreset: {
      planets: true,
      infrastructure: true,
      lagrange: true,
      cyclers: false,
      fastTransfers: false,
      lowEnergy: true,
      probeOrbits: false,
      labels: true
    },
    terrain: {
      title: "Earth-Moon Gateway Terrain",
      subtitle: "Earth and Moon wells move with approximate orbit positions; LEO and L1/L2 are massless orbital markers.",
      legend: ["Wells: Earth and Moon drive the contour field", "Shelves: LEO and gateway staging are massless markers", "Saddles: L1/L2 are pass markers, not gravity wells"],
      nodes: [
        { id: "earth", name: "Earth Well", x: -0.72, y: 0.00, z: -1.46, color: "#78bfff", role: "deep well" },
        { id: "leo-port", name: "LEO Shelf", x: -0.50, y: -0.18, z: -0.84, color: "#90f0c6", role: "exit shelf" },
        { id: "earth-moon-l1", name: "Earth-Moon L1/L2", x: -0.08, y: 0.08, z: -0.22, color: "#c6a7ff", role: "saddle pass" },
        { id: "moon", name: "Moon Well", x: 0.34, y: 0.22, z: -0.66, color: "#d7dce3", role: "secondary well" }
      ],
      profile: ["earth", "leo-port", "earth-moon-l1", "moon"],
      wells: [
        { x: -0.72, y: 0.00, mass: 1.45, soft: 0.12 },
        { x: 0.34, y: 0.22, mass: 0.45, soft: 0.10 }
      ],
      saddles: [
        { x: -0.08, y: 0.08, lift: 0.24, width: 4.8 },
        { x: 0.08, y: 0.28, lift: 0.14, width: 5.6 }
      ],
      shelves: [{ x: -0.50, y: -0.18, lift: 0.10, width: 4.0 }],
      slope: { x: 0.02, y: -0.01 }
    }
  },
  "earth-mars": {
    id: "earth-mars",
    name: "Earth-Mars Service Corridor",
    problem: "How do scheduled windows and cycler-like service change Mars access?",
    focusMode: "inner",
    recommendedView: "orbit",
    defaultInspectId: "earth-mars-cycler-service",
    demand: 0.82,
    urgency: 0.86,
    offset: 120,
    emphasis: {
      nodes: new Set(["earth", "mars", "leo-port", "cycler", "mars-cycler-point", "phobos-port", "deimos-port"]),
      routes: new Set(["earth-mars-cycler-service", "earth-mars-fast-window", "mars-terminal-taxi", "cycler-line", "earth-mars-fast"])
    },
    layerPreset: {
      planets: true,
      infrastructure: true,
      lagrange: false,
      cyclers: true,
      fastTransfers: true,
      lowEnergy: false,
      probeOrbits: false,
      labels: true
    },
    terrain: {
      title: "Earth-Mars Service Terrain",
      subtitle: "Earth and Mars wells move with approximate orbit positions; ports and intercepts are massless markers.",
      legend: ["Wells: Earth and Mars drive the contour field", "Markers: ports and cycler intercepts do not create wells", "Passes: service windows are timing markers, not solved trajectories"],
      nodes: [
        { id: "earth", name: "Earth Port Shelf", x: -0.76, y: -0.10, z: -0.72, color: "#78bfff", role: "origin well" },
        { id: "cycler", name: "Cycler Service", x: -0.10, y: 0.10, z: -0.20, color: "#ffd06f", role: "schedule shelf" },
        { id: "mars-cycler-point", name: "Mars Intercept", x: 0.42, y: -0.18, z: -0.30, color: "#ffd06f", role: "taxi pass" },
        { id: "phobos-port", name: "Phobos Port", x: 0.74, y: 0.12, z: -0.52, color: "#9ff1c7", role: "arrival shelf" },
        { id: "mars", name: "Mars Well", x: 0.90, y: 0.00, z: -0.82, color: "#e9785f", role: "destination well" }
      ],
      profile: ["earth", "cycler", "mars-cycler-point", "phobos-port", "mars"],
      wells: [
        { x: -0.76, y: -0.10, mass: 0.75, soft: 0.15 },
        { x: 0.90, y: 0.00, mass: 0.72, soft: 0.16 }
      ],
      saddles: [
        { x: -0.10, y: 0.10, lift: 0.16, width: 4.0 },
        { x: 0.42, y: -0.18, lift: 0.14, width: 4.5 }
      ],
      shelves: [{ x: 0.74, y: 0.12, lift: 0.11, width: 4.0 }],
      slope: { x: 0.18, y: -0.05 }
    }
  },
  "lagrange-volatile": {
    id: "lagrange-volatile",
    name: "Lagrange Relay And Volatile Network",
    problem: "How do relay, storage, and slow-cargo corridors make non-planet nodes valuable?",
    focusMode: "solar",
    recommendedView: "manifold",
    defaultInspectId: "volatile-belt-drift",
    demand: 0.66,
    urgency: 0.38,
    offset: 260,
    emphasis: {
      nodes: new Set(["earth", "mars", "ceres", "vesta", "earth-l4", "earth-l5", "sun-earth-l1", "sun-earth-l2", "earth-moon-l1", "deimos-port", "ceres-drift-hub"]),
      routes: new Set(["volatile-belt-drift", "lagrange-relay-chain", "mars-ceres-cargo-handoff", "earth-ceres-low", "mars-ceres-planned"])
    },
    layerPreset: {
      planets: true,
      infrastructure: true,
      lagrange: true,
      cyclers: false,
      fastTransfers: false,
      lowEnergy: true,
      probeOrbits: false,
      labels: true
    },
    terrain: {
      title: "Lagrange Relay And Volatile Terrain",
      subtitle: "Earth, Mars, and Ceres wells move with approximate orbit positions; relay shelves are massless markers.",
      legend: ["Wells: massive bodies drive the contour field", "Markers: relay and storage shelves do not create wells", "Saddles: Lagrange regions mark handoffs, not free wells"],
      nodes: [
        { id: "sun-earth-l1", name: "Sun-Earth L1/L2", x: -0.88, y: -0.20, z: -0.16, color: "#ffa96f", role: "relay saddle" },
        { id: "earth-l4", name: "L4/L5 Storage", x: -0.52, y: 0.30, z: -0.12, color: "#ff91bb", role: "storage shelf" },
        { id: "earth-moon-l1", name: "EM L1/L2", x: -0.22, y: -0.02, z: -0.10, color: "#c6a7ff", role: "handoff pass" },
        { id: "deimos-port", name: "Mars Gateway", x: 0.42, y: 0.12, z: -0.22, color: "#b8f3dd", role: "relay shelf" },
        { id: "ceres", name: "Ceres Volatiles", x: 0.94, y: -0.08, z: -0.44, color: "#c5cbd4", role: "bulk cargo well" }
      ],
      profile: ["sun-earth-l1", "earth-l4", "earth-moon-l1", "deimos-port", "ceres"],
      wells: [
        { x: 0.94, y: -0.08, mass: 0.45, soft: 0.18 },
        { x: 0.42, y: 0.12, mass: 0.28, soft: 0.18 }
      ],
      saddles: [
        { x: -0.88, y: -0.20, lift: 0.18, width: 4.2 },
        { x: -0.22, y: -0.02, lift: 0.15, width: 4.0 }
      ],
      shelves: [
        { x: -0.52, y: 0.30, lift: 0.12, width: 3.4 },
        { x: 0.42, y: 0.12, lift: 0.10, width: 3.8 }
      ],
      slope: { x: 0.28, y: -0.09 }
    }
  }
};

const dynamicRouteFamilies = [
  {
    id: "earth-moon-cargo-ladder",
    scenarioId: "earth-moon",
    name: "LEO - EM L1 - Lunar Cargo Ladder",
    type: "Low-Energy Transfer",
    claim: "conceptual-corridor",
    geometry: "stable route family",
    role: "Slow cargo ladder that waits for Earth-Moon gateway alignment and depot support.",
    from: "leo-port",
    to: "moon",
    path: ["leo-port", "earth-moon-l1", "moon"],
    color: "#8da7ff",
    travelClass: "weeks",
    cadence: 27.3,
    dutyCycle: 0.34,
    phaseOffset: 4,
    reliability: 0.84,
    capacity: 0.72,
    suitability: 0.78,
    payload: "bulk cargo",
    waitUnit: "lunar cadence"
  },
  {
    id: "leo-l1-shuttle",
    scenarioId: "earth-moon",
    name: "LEO Gateway Shuttle Frequency",
    type: "Shuttle Transfer",
    claim: "service-schedule",
    geometry: "local timing band",
    role: "Frequent local gateway service with moderate waiting cost.",
    from: "leo-port",
    to: "earth-moon-l1",
    path: ["leo-port", "earth-moon-l1"],
    color: "#90f0c6",
    travelClass: "days",
    cadence: 9,
    dutyCycle: 0.52,
    phaseOffset: 1,
    reliability: 0.90,
    capacity: 0.58,
    suitability: 0.82,
    payload: "crew and priority cargo",
    waitUnit: "local shuttle"
  },
  {
    id: "lunar-surface-hop",
    scenarioId: "earth-moon",
    name: "Gateway - Lunar Surface Hop",
    type: "Shuttle Transfer",
    claim: "service-schedule",
    geometry: "surface access marker",
    role: "Short local hop that exposes surface access friction.",
    from: "earth-moon-l1",
    to: "moon",
    path: ["earth-moon-l1", "moon"],
    color: "#d7dce3",
    travelClass: "days",
    cadence: 6,
    dutyCycle: 0.46,
    phaseOffset: 3,
    reliability: 0.88,
    capacity: 0.48,
    suitability: 0.74,
    payload: "surface logistics",
    waitUnit: "surface shuttle"
  },
  {
    id: "earth-mars-cycler-service",
    scenarioId: "earth-mars",
    name: "Cycler Service Window",
    type: "Cycler Line",
    claim: "service-schedule",
    geometry: "scheduled service family",
    role: "Aldrin-cycler-inspired service with high capacity but strict taxi timing.",
    from: "earth",
    to: "mars-cycler-point",
    path: ["leo-port", "cycler", "mars-cycler-point"],
    color: "#ffd06f",
    travelClass: "months",
    cadence: 780,
    dutyCycle: 0.12,
    phaseOffset: 40,
    reliability: 0.76,
    capacity: 0.92,
    suitability: 0.70,
    payload: "passengers",
    waitUnit: "cycler cycle"
  },
  {
    id: "earth-mars-fast-window",
    scenarioId: "earth-mars",
    name: "Fast Earth-Mars Window",
    type: "Fast Transfer",
    claim: "transfer-class",
    geometry: "transfer class window",
    role: "Higher-energy window for urgent crew or priority cargo.",
    from: "earth",
    to: "mars",
    path: ["earth", "mars"],
    color: "#8fd4ff",
    travelClass: "months",
    cadence: 780,
    dutyCycle: 0.20,
    phaseOffset: 120,
    reliability: 0.68,
    capacity: 0.42,
    suitability: 0.88,
    payload: "urgent crew",
    waitUnit: "synodic window"
  },
  {
    id: "mars-terminal-taxi",
    scenarioId: "earth-mars",
    name: "Mars Terminal Taxi",
    type: "Shuttle Transfer",
    claim: "service-schedule",
    geometry: "taxi timing marker",
    role: "Mars-system taxi burden between intercepts and Phobos or Deimos ports.",
    from: "mars-cycler-point",
    to: "phobos-port",
    path: ["mars-cycler-point", "phobos-port", "deimos-port"],
    color: "#9ff1c7",
    travelClass: "days",
    cadence: 16,
    dutyCycle: 0.40,
    phaseOffset: 6,
    reliability: 0.82,
    capacity: 0.50,
    suitability: 0.76,
    payload: "terminal transfer",
    waitUnit: "taxi interval"
  },
  {
    id: "lagrange-relay-chain",
    scenarioId: "lagrange-volatile",
    name: "Sun-Earth Relay Chain",
    type: "Low-Energy Transfer",
    claim: "conceptual-corridor",
    geometry: "relay route family",
    role: "Stable relay and storage handoff through Sun-Earth and Earth-Moon Lagrange regions.",
    from: "sun-earth-l1",
    to: "earth-l5",
    path: ["sun-earth-l1", "earth-moon-l1", "earth-l5"],
    color: "#ff91bb",
    travelClass: "months",
    cadence: 180,
    dutyCycle: 0.38,
    phaseOffset: 30,
    reliability: 0.80,
    capacity: 0.64,
    suitability: 0.72,
    payload: "relay cargo",
    waitUnit: "relay cadence"
  },
  {
    id: "volatile-belt-drift",
    scenarioId: "lagrange-volatile",
    name: "Volatile Belt Drift",
    type: "Low-Energy Transfer",
    claim: "conceptual-corridor",
    geometry: "slow cargo route family",
    role: "Slow bulk cargo corridor connecting relay storage to Ceres volatile supply.",
    from: "earth-l5",
    to: "ceres",
    path: ["earth-l5", "deimos-port", "ceres-drift-hub", "ceres"],
    color: "#8da7ff",
    travelClass: "years",
    cadence: 420,
    dutyCycle: 0.46,
    phaseOffset: 210,
    reliability: 0.70,
    capacity: 0.88,
    suitability: 0.82,
    payload: "bulk volatiles",
    waitUnit: "slow cargo window"
  },
  {
    id: "mars-ceres-cargo-handoff",
    scenarioId: "lagrange-volatile",
    name: "Mars-Ceres Cargo Handoff",
    type: "Planned Route",
    claim: "planned-relationship",
    geometry: "handoff planning band",
    role: "Cargo handoff between Mars gateways and belt storage nodes.",
    from: "deimos-port",
    to: "ceres",
    path: ["deimos-port", "ceres-drift-hub", "ceres"],
    color: "#b8f3dd",
    travelClass: "months-years",
    cadence: 260,
    dutyCycle: 0.32,
    phaseOffset: 74,
    reliability: 0.66,
    capacity: 0.74,
    suitability: 0.68,
    payload: "depot cargo",
    waitUnit: "handoff window"
  }
];

const scaleModes = {
  solar: {
    label: "Solar System",
    frame: "Heliocentric map",
    scaleClaim: "Approximate AU distances",
    routeClaim: "Atlas overlays, not trajectories",
    spanAu: 6.2,
    center: () => ({ x: 0, y: 0 }),
    visible: new Set(["sun", "mercury", "earth", "mars", "ceres", "vesta", "earth-l4", "earth-l5", "cycler"])
  },
  inner: {
    label: "Inner System",
    frame: "Heliocentric map",
    scaleClaim: "Approximate AU distances",
    routeClaim: "Atlas overlays, not trajectories",
    spanAu: 3.5,
    center: () => ({ x: 0.55, y: 0 }),
    visible: new Set(["sun", "mercury", "earth", "mars", "ceres", "earth-l4", "earth-l5", "sun-earth-l1", "sun-earth-l2", "cycler"])
  },
  earth: {
    label: "Earth Gateway",
    frame: "Planet-local schematic",
    scaleClaim: "Distances exaggerated",
    routeClaim: "Local service categories",
    spanAu: 0.025,
    center: () => getBodyWorld("earth"),
    visible: new Set(["earth", "leo-port", "moon", "earth-moon-l1", "sun-earth-l1", "sun-earth-l2", "earth-l4", "earth-l5"])
  },
  mars: {
    label: "Mars Gateway",
    frame: "Planet-local schematic",
    scaleClaim: "Distances exaggerated",
    routeClaim: "Local service categories",
    spanAu: 0.02,
    center: () => getBodyWorld("mars"),
    visible: new Set(["mars", "phobos-port", "deimos-port", "mars-cycler-point"])
  },
  ceres: {
    label: "Ceres / Belt",
    frame: "Belt-local schematic",
    scaleClaim: "Regional context, not exact local layout",
    routeClaim: "Cargo corridor classes",
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
    position: () => offsetFrom("earth", 0.00072, leoAngle())
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
    claim: "service-schedule",
    geometry: "symbolic service lane",
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
    claim: "transfer-class",
    geometry: "schematic route class",
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
    claim: "conceptual-corridor",
    geometry: "conceptual corridor",
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
    claim: "planned-relationship",
    geometry: "symbolic planning link",
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
    claim: "service-schedule",
    geometry: "taxi timing marker",
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
    claim: "service-schedule",
    geometry: "taxi timing marker",
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
    claim: "service-schedule",
    geometry: "taxi timing marker",
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
    claim: "service-schedule",
    geometry: "taxi timing marker",
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
    claim: "service-schedule",
    geometry: "local service marker",
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

const probeOrbits = [
  {
    id: "parker-style-probe",
    name: "Solar Dive Probe",
    type: "Educational Probe Orbit",
    claim: "science-example",
    geometry: "educational orbit example",
    parent: "Inner Solar System",
    role: "Shows a high-energy solar science dive, inspired by close solar probe trajectories",
    infrastructure: "Science example",
    semiMajor: 0.62,
    eccentricity: 0.74,
    period: 110,
    radius: 3.4,
    color: "#ff9f6f",
    phase: 1.1,
    argPeri: 0.35
  },
  {
    id: "jwst-style-l2",
    name: "L2 Observatory Region",
    type: "Educational Science Mission",
    claim: "science-example",
    geometry: "educational local marker",
    parent: "Sun-Earth L2",
    role: "Shows why Sun-Earth L2 is useful for observatories and thermal stability",
    infrastructure: "Science example",
    radius: 3.8,
    color: "#b9a7ff",
    position: () => offsetFrom("sun-earth-l2", 0.0022, state.simDays * 0.045)
  }
];

const explanationEntries = {
  "orbit-view": {
    title: "Orbit View",
    definition: "Orbit View is the main map of worlds, ports, gateways, and scheduled route classes.",
    matters: "It keeps the infrastructure readable in a solar-system frame, so users can see why ports and corridors form around planets, Lagrange regions, and belt hubs.",
    models: `Planetary positions use a documented Keplerian approximation from epoch ${modelEpochLabel}.`,
    simplifies: `The model is ${modelTimeSpan} Spacecraft transfers are schematic and not optimized trajectories.`
  },
  "gravity-view": {
    title: "Gravity Well View",
    definition: "Gravity View is a scenario-normalized conceptual terrain view of relative energy cost.",
    matters: "It explains why wells, shelves, saddles, passes, and background slopes shape gateway logistics.",
    models: "Demo 0.2.7 uses parameterized primitives for wells, shelves, saddle passes, route profile cues, and solar background slopes.",
    simplifies: "It is not a solved gravitational potential field, not CR3BP, and not a mission-grade delta-v surface."
  },
  "low-energy-routes-view": {
    title: "Low-Energy Routes View",
    definition: "Low-Energy Routes View shows stable conceptual route families with dynamic route windows.",
    matters: "It exposes the future economic inputs: cadence, waiting, availability, reliability, capacity, and route suitability.",
    models: "Demo 0.2.7 uses a heuristic route-window model where topology stays stable while availability and flow change over simulation time.",
    simplifies: "It does not solve invariant manifolds, CR3BP tubes, launch windows, or any real mission trajectory."
  },
  "leo-port": {
    title: "LEO Port",
    definition: "LEO Port represents a low Earth orbit logistics node.",
    matters: "It is the first major staging point after launch and a natural place for assembly, refueling, and crew transfer.",
    models: "The demo places it as a schematic node close to Earth.",
    simplifies: "The displayed distance and orbital motion are exaggerated for readability."
  },
  "earth-moon-l1": {
    title: "Earth-Moon L1",
    definition: "Earth-Moon L1 is a gateway region between Earth and the Moon.",
    matters: "It is useful as a staging point for lunar logistics, transfer vehicles, and deep-space routing.",
    models: "The demo marks it as a local schematic Lagrange gateway.",
    simplifies: "It does not compute an actual halo orbit or stationkeeping requirement."
  },
  "sun-earth-l1": {
    title: "Sun-Earth L1/L2/L4/L5",
    definition: "Sun-Earth Lagrange regions are useful solar-system reference zones around Earth orbit.",
    matters: "L1 supports solar monitoring, L2 supports observatories, and L4/L5 are long-term stable industrial or storage candidates.",
    models: "The demo places them relative to Earth and the Sun to show their infrastructure role.",
    simplifies: "The positions are schematic and do not represent exact libration orbits."
  },
  "phobos-port": {
    title: "Phobos Port",
    definition: "Phobos Port is a Mars-system gateway built around Mars's inner moon.",
    matters: "Phobos has low gravity and sits close to Mars, making it a strong staging candidate for surface access, maintenance, and refueling.",
    models: "The demo shows Phobos as a schematic Mars gateway and shuttle endpoint.",
    simplifies: "Its exact orbital position, transfer cost, and operational constraints are not mission-accurate."
  },
  "deimos-port": {
    title: "Deimos Deep Space Port",
    definition: "Deimos Deep Space Port is an outer Mars gateway concept.",
    matters: "It can serve as a calmer staging point for asteroid-belt departures and Mars-system cargo routing.",
    models: "The demo places it as a schematic high Mars orbit node.",
    simplifies: "It does not model real Deimos operations or transfer costs."
  },
  ceres: {
    title: "Ceres",
    definition: "Ceres is the largest body in the asteroid belt and a candidate volatile logistics hub.",
    matters: "Water and volatiles make it important for refueling, cargo staging, and long-haul belt infrastructure.",
    models: "The demo shows Ceres as a belt hub with nearby slow cargo routing.",
    simplifies: "Resource availability, extraction, and economics are not simulated."
  },
  cycler: {
    title: "Cycler",
    definition: "A cycler is an orbiting habitat or vehicle path that repeatedly encounters two worlds.",
    matters: "It is scheduled interplanetary infrastructure: the expensive habitat keeps moving while taxis meet it near flybys.",
    models: "The demo shows a stylized Earth-Mars cycler schedule, flyby windows, and taxi markers.",
    simplifies: "Real cycler taxis require substantial maneuvering. The short arcs here are timing symbols, not true rendezvous trajectories."
  },
  "hohmann-transfer": {
    title: "Hohmann Transfer",
    definition: "A Hohmann transfer is a simple two-burn transfer between circular or near-circular orbits.",
    matters: "It is a useful baseline for explaining fast transfer windows and route energy.",
    models: "The demo uses fast-transfer route classes as readable infrastructure lanes.",
    simplifies: "It does not compute burn magnitudes, launch windows, or arrival geometry."
  },
  "low-energy-transfer": {
    title: "Low-Energy Transfer",
    definition: "A low-energy transfer uses gravitational structure and time to reduce propulsion needs.",
    matters: "Slow cargo can use these corridors like trade winds, exchanging speed for lower energy cost.",
    models: "The demo shows manifold-inspired corridors as educational route families.",
    simplifies: "No real invariant manifold is calculated in Demo 0.2.7."
  },
  "launch-window": {
    title: "Launch Window",
    definition: "A launch window is a period when departure geometry makes a route practical.",
    matters: "Scheduled infrastructure depends on windows: taxis, cyclers, and cargo lanes all need timing.",
    models: "The demo schedule shows recurring rendezvous and shuttle events.",
    simplifies: "The windows are simplified timing markers, not optimized mission opportunities."
  },
  "fuel-depot": {
    title: "Fuel Depot",
    definition: "A fuel depot stores propellant near useful route junctions.",
    matters: "Depots can turn difficult trips into chained legs and make ports more valuable.",
    models: "Demo 0.2.7 treats depots as route-atlas concepts, not simulated inventory.",
    simplifies: "There is no economy, extraction, or propellant flow model yet."
  },
  gateway: {
    title: "Gateway",
    definition: "A gateway is a staging location where local, regional, and deep-space routes meet.",
    matters: "Gateways become useful when they reduce operational friction between surface access, orbit, and interplanetary transfer.",
    models: "The demo shows gateways as labeled nodes and connection points.",
    simplifies: "Stationkeeping, construction cost, and traffic demand are not simulated."
  }
};

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

function leoAngle() {
  return bodyAngle(getBody("earth")) + 1.4 + (state.simDays / leoPeriodDays) * Math.PI * 2;
}

function marsMoonAngle(offset) {
  return bodyAngle(getBody("mars")) + offset + (state.simDays / 7.7) * Math.PI * 2;
}

function visibleInScale(id) {
  return scaleModes[state.scaleMode].visible.has(id);
}

function layerEnabled(layer) {
  return state.layers[layer] !== false;
}

function nodeLayer(node) {
  if (node.type?.includes("Lagrange") || node.id.includes("-l1") || node.id.includes("-l2") || node.id.includes("-l4") || node.id.includes("-l5")) {
    return "lagrange";
  }
  return "infrastructure";
}

function routeLayer(route) {
  if (route.type === "Cycler Line" || route.from === "cycler" || route.to === "cycler") return "cyclers";
  if (route.type === "Fast Transfer") return "fastTransfers";
  if (route.type === "Low-Energy Transfer" || route.type === "Planned Route") return "lowEnergy";
  if (route.type === "Shuttle Transfer") return "fastTransfers";
  return "infrastructure";
}

function objectModelClass(item) {
  if (item.id === "cycler" || item.type === "Cycler Line") return "Schematic / cycler approximation";
  if (item.type?.includes("Educational")) return "Educational example";
  if (item.type?.includes("Lagrange") || item.id?.includes("-l1") || item.id?.includes("-l2") || item.id?.includes("-l4") || item.id?.includes("-l5")) return "Schematic Lagrange region";
  if (gatewayNodes.some((node) => node.id === item.id)) return "Local schematic";
  if (shuttleRoutes.some((route) => route.id === item.id)) return "Schematic taxi transfer";
  if (routeClasses.some((route) => route.id === item.id)) return "Route class";
  return "Keplerian approximation";
}

function articleIdFor(id) {
  if (id === "earth-moon-l2") return "earth-moon-l1";
  if (id === "sun-earth-l2" || id === "earth-l4" || id === "earth-l5") return "sun-earth-l1";
  if (id === "cycler-line" || id === "earth-cycler-a" || id === "earth-cycler-b" || id === "cycler-mars-a" || id === "cycler-mars-b" || id === "mars-cycler-point") return "cycler";
  if (id === "earth-mars-fast") return "hohmann-transfer";
  if (id === "earth-ceres-low" || id === "mars-ceres-planned" || id === "ceres-drift-hub") return "low-energy-transfer";
  if (id === "mars-surface-phobos") return "gateway";
  if (id === "parker-style-probe" || id === "jwst-style-l2") return "low-energy-transfer";
  return explanationEntries[id] ? id : "orbit-view";
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

function routeStyle(route, index = 0) {
  const scenarioBoost = scenarioEmphasisFor(route.id);
  const styles = {
    "transfer-class": { color: "rgba(143, 212, 255, 0.76)", dash: [], width: 1.7, bend: -0.15 - index * 0.025 },
    "conceptual-corridor": { color: "rgba(141, 167, 255, 0.50)", dash: [3, 12], width: 1.2, bend: -0.22 - index * 0.025 },
    "planned-relationship": { color: "rgba(154, 166, 178, 0.42)", dash: [2, 9], width: 1, bend: -0.12 - index * 0.025 },
    "service-schedule": { color: "rgba(255, 208, 111, 0.46)", dash: [10, 10], width: 1.2, bend: -0.10 - index * 0.02 },
    "science-example": { color: "rgba(255, 159, 111, 0.48)", dash: [5, 8], width: 1, bend: -0.16 }
  };
  const style = styles[route.claim] || { color: `${route.color}88`, dash: route.dash || [], width: 1.2, bend: -0.12 - index * 0.025 };
  return {
    ...style,
    color: withAlpha(style.color, scenarioBoost * alphaFromColor(style.color, 0.68)),
    width: style.width + (scenarioBoost > 0.95 ? 0.7 : 0)
  };
}

function withAlpha(color, alpha) {
  if (color.startsWith("rgba")) return color.replace(/,\s*[\d.]+\)$/, `, ${Math.max(0.08, Math.min(1, alpha)).toFixed(2)})`);
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0.08, Math.min(1, alpha)).toFixed(2)})`;
  }
  return color;
}

function alphaFromColor(color, fallback) {
  const match = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/);
  return match ? Number(match[1]) : fallback;
}

function currentScenario() {
  return scenarios[state.scenarioId] || scenarios["earth-moon"];
}

function scenarioEmphasisFor(id) {
  const scenario = currentScenario();
  if (scenario.emphasis.nodes.has(id) || scenario.emphasis.routes.has(id)) return 1;
  if (state.viewMode !== "orbit") return 1;
  return 0.34;
}

function currentScenarioRoutes() {
  return dynamicRouteFamilies.filter((route) => route.scenarioId === state.scenarioId);
}

function applyScenarioLayerPreset() {
  const preset = currentScenario().layerPreset;
  if (!preset) return;
  state.layers = { ...state.layers, ...preset };
  layerToggles.forEach((toggle) => {
    toggle.checked = state.layers[toggle.dataset.layer] !== false;
  });
}

function routeWindowMetrics(route, day = state.simDays) {
  const scenario = scenarios[route.scenarioId] || currentScenario();
  const phase = ((day + scenario.offset + route.phaseOffset) % route.cadence + route.cadence) % route.cadence;
  const openDays = route.cadence * route.dutyCycle;
  const availability = phase <= openDays ? 1 : 0;
  const edgeSoftness = Math.min(1, Math.min(phase, Math.abs(openDays - phase)) / Math.max(1, openDays * 0.22));
  const pulse = availability ? 0.55 + edgeSoftness * 0.45 : 0.10 + Math.max(0, 1 - (phase - openDays) / Math.max(1, route.cadence * 0.18)) * 0.18;
  const wait = availability ? 0 : route.cadence - phase;
  const flow = scenario.demand * pulse * route.suitability * route.capacity;
  const waitingCost = wait * scenario.urgency;
  return {
    availability,
    pulse,
    wait,
    nextWindow: day + wait,
    flow,
    waitingCost
  };
}

function claimLabel(claim) {
  const labels = {
    "transfer-class": "Transfer class",
    "conceptual-corridor": "Conceptual corridor",
    "planned-relationship": "Planning link",
    "service-schedule": "Service schedule",
    "science-example": "Science example"
  };
  return labels[claim] || "Route overlay";
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
  ctx.save();
  ctx.globalAlpha *= scenarioEmphasisFor(item.id);
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
  ctx.restore();
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
  if (isLocalSchematicScale()) drawSchematicFrame(scaleModes[state.scaleMode]);
  if (state.showOrbits) {
    if (state.scaleMode !== "earth" && state.scaleMode !== "mars") {
      if (layerEnabled("planets")) bodies.forEach((body) => {
        if (visibleInScale(body.id) || state.scaleMode === "ceres") drawOrbit(body);
      });
      drawAsteroidBelt();
      if (layerEnabled("cyclers") && visibleInScale("cycler")) drawOrbit(cyclerOrbit, "rgba(255, 208, 111, 0.14)", [12, 14]);
      if (layerEnabled("probeOrbits")) probeOrbits.forEach((probe) => {
        if (probe.semiMajor) drawOrbit(probe, `${probe.color}55`, [5, 8]);
      });
    }
    if (state.scaleMode === "earth" && layerEnabled("infrastructure")) drawLocalOrbit("earth", 0.00257, "#d7dce3");
    if (state.scaleMode === "mars") {
      if (layerEnabled("infrastructure")) {
        drawLocalOrbit("mars", 0.00085, "#9ff1c7");
        drawLocalOrbit("mars", 0.0018, "#b8f3dd");
      }
    }
  }

  if (state.scaleMode !== "earth" && state.scaleMode !== "mars") {
    routeClasses.forEach((route, index) => {
      if (!layerEnabled(routeLayer(route))) return;
      if (visibleInScale(route.from) || visibleInScale(route.to) || state.scaleMode === "ceres") {
        const style = routeStyle(route, index);
        drawCurvedRoute(route.from, route.to, style.color, style.dash, style.bend, style.width);
        drawRouteClaimMarker(route, style, index);
      }
    });
  }

  if (layerEnabled("lowEnergy")) {
    currentScenarioRoutes().forEach((route, index) => {
      const show = route.path.some((id) => visibleInScale(id)) || state.scaleMode === currentScenario().focusMode || state.scaleMode === "solar";
      if (show) drawDynamicRouteFamily(route, index);
    });
  }

  drawSun();
  bodies.forEach((body) => {
    if (layerEnabled("planets") && visibleInScale(body.id)) drawObject(body, getBodyWorld(body.id), body.radius, body.color, "body", "", layerEnabled("labels"));
  });
  gatewayNodes.forEach((node) => {
    if (layerEnabled(nodeLayer(node)) && visibleInScale(node.id)) drawObject(node, node.position(), node.radius, node.color, "node", "", layerEnabled("labels"));
  });
  if (layerEnabled("cyclers") && visibleInScale("cycler")) drawObject(cyclerOrbit, getBodyWorld("cycler"), cyclerOrbit.radius, cyclerOrbit.color, "cycler", nextCyclerStop().label, layerEnabled("labels"));
  if (layerEnabled("cyclers") && (state.scaleMode === "solar" || state.scaleMode === "inner")) drawCyclerServiceLane();

  if (layerEnabled("probeOrbits")) {
    probeOrbits.forEach((probe) => {
      const worldPos = probe.position ? probe.position() : ellipticalWorld(probe);
      const show = probe.id === "jwst-style-l2" ? state.scaleMode === "earth" || state.scaleMode === "inner" : state.scaleMode === "solar" || state.scaleMode === "inner";
      if (show) drawObject(probe, worldPos, probe.radius, probe.color, "node", "science", layerEnabled("labels"));
    });
  }

  shuttleRoutes.forEach((route) => {
    if (!layerEnabled(routeLayer(route))) return;
    const show = visibleInScale(route.from) || visibleInScale(route.to) || (state.scaleMode === "inner" && route.stop !== "mars");
    if (!show) return;
    drawShuttleRoute(route);
    const pos = getShuttleWorld(route);
    const eta = pos.trip.active ? formatEta(pos.trip.nextArrival - state.simDays) : `T ${formatEta(pos.trip.nextDeparture - state.simDays)}`;
    drawObject(route, pos, pos.parked ? 3.8 : 5.2, route.color, "shuttle", eta, !pos.parked && layerEnabled("labels"));
  });
}

function drawDynamicRouteFamily(route, index = 0) {
  const metrics = routeWindowMetrics(route);
  const style = routeStyle(route, index);
  const points = route.path.map((id) => worldToScreen(getBodyWorld(id)));
  if (points.length < 2) return;
  ctx.save();
  ctx.globalAlpha = scenarioEmphasisFor(route.id);
  drawScreenRoutePath(points, withAlpha(route.color, 0.20), [6, 12], 3.6 + index * 0.2, -0.12);
  const pulseAlpha = 0.18 + metrics.pulse * 0.52;
  drawScreenRoutePath(points, withAlpha(route.color, pulseAlpha), style.dash?.length ? style.dash : [10, 10], 1.6 + metrics.pulse * 2.2, -0.12);
  const markerCount = Math.max(1, Math.round(1 + metrics.flow * 3));
  for (let i = 0; i < markerCount; i += 1) {
    const progress = ((state.simDays / Math.max(24, route.cadence * 0.42)) + i / markerCount + route.phaseOffset * 0.01) % 1;
    const p = pointOnRoutePath(points, progress, -0.12);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.6 + metrics.flow * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(route.color, 0.52 + metrics.pulse * 0.30);
    ctx.fill();
  }
  const marker = pointOnRoutePath(points, 0.50, -0.12);
  const selected = state.selectedId === route.id || state.hoverId === route.id;
  ctx.save();
  ctx.translate(marker.x, marker.y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = selected ? route.color : withAlpha(route.color, 0.72);
  ctx.strokeStyle = "rgba(5, 7, 11, 0.92)";
  ctx.lineWidth = 2;
  ctx.fillRect(-5, -5, 10, 10);
  ctx.strokeRect(-5, -5, 10, 10);
  ctx.restore();
  if ((selected || state.viewMode === "orbit") && layerEnabled("labels")) {
    drawLabel(route.name, marker, route.color, selected, `Wait ${formatEta(metrics.wait)}`);
  }
  state.hitTargets.push({ id: route.id, x: marker.x, y: marker.y, radius: 18 });
  ctx.restore();
}

function drawScreenRoutePath(points, color, dash, width, bend = -0.10) {
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
      return;
    }
    const previous = points[index - 1];
    const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
    const mid = {
      x: (previous.x + point.x) / 2,
      y: (previous.y + point.y) / 2 + distance * bend
    };
    ctx.quadraticCurveTo(mid.x, mid.y, point.x, point.y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.setLineDash([]);
}

function pointOnRoutePath(points, progress, bend = -0.10) {
  const segments = points.length - 1;
  const scaled = Math.min(0.999, Math.max(0, progress)) * segments;
  const index = Math.min(segments - 1, Math.floor(scaled));
  const tValue = scaled - index;
  const from = points[index];
  const to = points[index + 1];
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const control = {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2 + distance * bend
  };
  const inv = 1 - tValue;
  return {
    x: inv * inv * from.x + 2 * inv * tValue * control.x + tValue * tValue * to.x,
    y: inv * inv * from.y + 2 * inv * tValue * control.y + tValue * tValue * to.y
  };
}

function pointOnPolyline(points, progress) {
  if (points.length === 1) return points[0];
  const segments = points.length - 1;
  const scaled = Math.min(0.999, Math.max(0, progress)) * segments;
  const index = Math.min(segments - 1, Math.floor(scaled));
  const tValue = scaled - index;
  return {
    x: lerp(points[index].x, points[index + 1].x, tValue),
    y: lerp(points[index].y, points[index + 1].y, tValue)
  };
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
  const style = routeStyle(route);
  drawCurvedRoute(route.from, route.to, "rgba(134, 240, 189, 0.30)", style.dash, route.stop === "earth" ? -0.18 : -0.26, 1.2);
}

function drawRouteClaimMarker(route, style, index = 0) {
  const from = worldToScreen(getBodyWorld(route.from));
  const to = worldToScreen(getBodyWorld(route.to));
  const bend = style.bend ?? -0.14;
  const mid = {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2 + Math.hypot(to.x - from.x, to.y - from.y) * bend
  };
  const t = 0.5;
  const marker = {
    x: (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * mid.x + t * t * to.x,
    y: (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * mid.y + t * t * to.y
  };
  const selected = state.selectedId === route.id || state.hoverId === route.id;
  const size = selected ? 8 : 6;
  ctx.save();
  ctx.translate(marker.x, marker.y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = selected ? route.color : style.color;
  ctx.strokeStyle = "rgba(5, 7, 11, 0.92)";
  ctx.lineWidth = 2;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.strokeRect(-size / 2, -size / 2, size, size);
  ctx.restore();
  if (selected && layerEnabled("labels")) drawLabel(route.name, marker, route.color, true, claimLabel(route.claim));
  state.hitTargets.push({ id: route.id, x: marker.x, y: marker.y, radius: Math.max(14, size + 8 + index) });
}

function isLocalSchematicScale() {
  return state.scaleMode === "earth" || state.scaleMode === "mars" || state.scaleMode === "ceres";
}

function drawSchematicFrame(config) {
  const margin = state.width < 620 ? 12 : 22;
  const top = state.width < 620 ? 142 : 126;
  const bottom = state.width < 620 ? 138 : 92;
  const x = margin;
  const y = Math.min(top, state.height - bottom - 180);
  const width = state.width - margin * 2;
  const height = Math.max(180, state.height - y - bottom);
  ctx.save();
  ctx.strokeStyle = "rgba(255, 206, 111, 0.34)";
  ctx.fillStyle = "rgba(255, 206, 111, 0.035)";
  ctx.setLineDash([10, 10]);
  roundedRect(x, y, width, height, 8);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#ffd06f";
  ctx.font = "800 12px Inter, system-ui";
  ctx.fillText(`${config.frame} | ${config.scaleClaim}`, x + 14, y + 23);
  ctx.fillStyle = "#c9d4df";
  ctx.font = "600 12px Inter, system-ui";
  ctx.fillText("Local offsets are layout symbols, not physical distances.", x + 14, y + 42);
  ctx.restore();
}

function drawCyclerServiceLane() {
  if (state.width < 860 || state.viewMode !== "orbit") return;
  const x = Math.max(420, state.width * 0.36);
  const y = state.height - 156;
  const width = Math.min(420, state.width - x - 360);
  if (width < 260) return;
  const height = 76;
  const local = ((state.simDays % cyclerOrbit.period) + cyclerOrbit.period) % cyclerOrbit.period;
  ctx.save();
  roundedRect(x, y, width, height, 8);
  ctx.fillStyle = "rgba(8, 12, 17, 0.66)";
  ctx.strokeStyle = "rgba(255, 208, 111, 0.28)";
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffd06f";
  ctx.font = "800 12px Inter, system-ui";
  ctx.fillText("Cycler service schedule", x + 14, y + 20);
  ctx.fillStyle = "#aebccd";
  ctx.font = "600 11px Inter, system-ui";
  ctx.fillText("Flyby windows, not solved rendezvous geometry", x + 14, y + 38);
  const lineX = x + 18;
  const lineY = y + 56;
  const lineW = width - 36;
  ctx.strokeStyle = "rgba(255, 208, 111, 0.50)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lineX, lineY);
  ctx.lineTo(lineX + lineW, lineY);
  ctx.stroke();
  cyclerOrbit.stops.forEach((stop) => {
    const stopX = lineX + (stop.day / cyclerOrbit.period) * lineW;
    ctx.beginPath();
    ctx.arc(stopX, lineY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = stop.id === "earth" ? "#78bfff" : "#e9785f";
    ctx.fill();
  });
  const cursorX = lineX + (local / cyclerOrbit.period) * lineW;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cursorX - 1, lineY - 11, 2, 22);
  ctx.restore();
}

function drawGravityView() {
  state.hitTargets = [];
  state.labelBoxes = [];
  drawSpace();
  const scenario = currentScenario();
  const primitives = dynamicGravityPrimitives();
  drawConceptTitle(scenario.terrain.title, `${scenario.terrain.subtitle} Not a solved gravitational potential field.`);
  drawSolarSlope(scenario.terrain.slope || { x: 0, y: 0 }, primitives);
  drawPotentialSurface(primitives);
  drawFixedWellDepthGauge();
  scenario.terrain.nodes.forEach((node) => {
    if (!gravityNodeLayerVisible(node)) return;
    const dynamicNode = dynamicGravityNode(node);
    const p = projectIso(dynamicNode.x, dynamicNode.y, dynamicNode.z);
    drawConceptNode(dynamicNode, p.x, p.y, gravityNodeLabelHint(dynamicNode), layerEnabled("labels"));
  });
  drawConceptLegend(scenario.terrain.legend);
}

function gravityNodeLayerVisible(node) {
  if (fixedWellDepthFor(node.id)) return layerEnabled("planets");
  if (node.id.includes("-l1") || node.id.includes("-l2") || node.id.includes("-l4") || node.id.includes("-l5") || node.role.includes("saddle") || node.role.includes("pass")) {
    return layerEnabled("lagrange");
  }
  return layerEnabled("infrastructure");
}

function gravityNodeLabelHint(node) {
  const fixedDepth = fixedWellDepthFor(node.id);
  if (!fixedDepth) return node.role;
  return `${node.role}; ${formatWellDepth(fixedDepth.value)}`;
}

function drawTransferView() {
  state.hitTargets = [];
  state.labelBoxes = [];
  drawSpace();
  const scenario = currentScenario();
  drawConceptTitle("Low-Energy Routes View", `${scenario.name} | Heuristic route-window model; route families are stable, availability and flow are dynamic.`);
  drawRelayTopology();
  const active = currentScenarioRoutes()[0];
  const metrics = active ? routeWindowMetrics(active) : null;
  drawConceptLegend([
    "Nodes are stable relay, depot, storage, source, sink, and handoff roles",
    metrics ? `Current lead route: ${active.name}; wait ${formatEta(metrics.wait)}; flow ${Math.round(metrics.flow * 100)}%` : "Availability uses heuristic cadence and duty cycle",
    "Not CR3BP, not real manifolds, and not mission-planning telemetry"
  ]);
}

function drawConceptTitle(title, subtitle) {
  const x = state.width > 900 ? Math.max(420, state.width * 0.34) : 24;
  const y = state.width > 900 ? 112 : 360;
  const maxWidth = state.width > 900 ? Math.max(360, state.width - x - 390) : state.width - 48;
  ctx.fillStyle = "#f4f7fb";
  ctx.font = "700 24px Inter, system-ui";
  ctx.fillText(title, x, y, maxWidth);
  ctx.fillStyle = "#b8c6d6";
  ctx.font = "500 14px Inter, system-ui";
  drawWrappedCanvasText(subtitle, x, y + 26, maxWidth, 18, 2);
}

function drawWrappedCanvasText(text, x, y, maxWidth, lineHeight, maxLines = 2) {
  const words = text.split(/\s+/);
  let line = "";
  let drawn = 0;
  for (let i = 0; i < words.length; i += 1) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      const suffix = drawn === maxLines - 1 ? "..." : "";
      ctx.fillText(`${line}${suffix}`, x, y + drawn * lineHeight, maxWidth);
      drawn += 1;
      if (drawn >= maxLines) return;
      line = words[i];
    } else {
      line = test;
    }
  }
  if (line && drawn < maxLines) ctx.fillText(line, x, y + drawn * lineHeight, maxWidth);
}

function projectIso(x, y, z = 0) {
  const angle = state.concept.rotation;
  const rotated = {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  };
  const scale = Math.min(state.width, state.height) * (state.width > 900 ? 0.27 : 0.34) * state.concept.zoom;
  const origin = {
    x: (state.width > 900 ? state.width * 0.50 : state.width * 0.53) + state.concept.pan.x,
    y: (state.width > 900 ? state.height * 0.52 : state.height * 0.58) + state.concept.pan.y
  };
  return {
    x: origin.x + (rotated.x - rotated.y) * scale * 0.92,
    y: origin.y + (rotated.x + rotated.y) * scale * state.concept.pitch - z * scale * 0.52
  };
}

function dynamicGravityNode(node) {
  const position = dynamicGravityPositionFor(node.id);
  if (!position) return node;
  return { ...node, x: position.x, y: position.y };
}

function dynamicGravityPositionFor(id) {
  const map = dynamicGravityLayout();
  return map.get(id) || null;
}

function dynamicGravityLayout() {
  if (state.scenarioId === "earth-moon") return earthMoonGravityLayout();
  if (state.scenarioId === "earth-mars") return earthMarsGravityLayout();
  return volatileGravityLayout();
}

function earthMoonGravityLayout() {
  const map = new Map();
  const earth = { x: -0.46, y: 0.02 };
  const moonAngleValue = lunarAngle();
  const leoAngleValue = leoAngle();
  const moon = {
    x: earth.x + Math.cos(moonAngleValue) * 0.82,
    y: earth.y + Math.sin(moonAngleValue) * 0.58
  };
  const leo = {
    x: earth.x + Math.cos(leoAngleValue) * 0.22,
    y: earth.y + Math.sin(leoAngleValue) * 0.16
  };
  const eml1 = {
    x: lerp(earth.x, moon.x, 0.66),
    y: lerp(earth.y, moon.y, 0.66)
  };
  map.set("earth", earth);
  map.set("moon", moon);
  map.set("leo-port", leo);
  map.set("earth-moon-l1", eml1);
  return map;
}

function earthMarsGravityLayout() {
  const map = normalizedOrbitLayout(["earth", "mars", "cycler"]);
  const earth = map.get("earth");
  const mars = map.get("mars");
  if (earth) {
    map.set("leo-port", {
      x: earth.x + Math.cos(leoAngle()) * 0.12,
      y: earth.y + Math.sin(leoAngle()) * 0.09
    });
  }
  if (mars) {
    map.set("mars-cycler-point", {
      x: mars.x + Math.cos(marsMoonAngle(0.9)) * 0.16,
      y: mars.y + Math.sin(marsMoonAngle(0.9)) * 0.11
    });
    map.set("phobos-port", {
      x: mars.x + Math.cos(marsMoonAngle(1.0)) * 0.10,
      y: mars.y + Math.sin(marsMoonAngle(1.0)) * 0.07
    });
  }
  return map;
}

function volatileGravityLayout() {
  const map = normalizedOrbitLayout(["earth", "mars", "ceres"]);
  const earth = map.get("earth");
  const mars = map.get("mars");
  const ceres = map.get("ceres");
  if (earth) {
    const earthAngle = bodyAngle(getBody("earth"));
    map.set("sun-earth-l1", {
      x: earth.x + Math.cos(earthAngle + Math.PI) * 0.13,
      y: earth.y + Math.sin(earthAngle + Math.PI) * 0.09
    });
    map.set("earth-l4", {
      x: earth.x + Math.cos(earthAngle + Math.PI / 3) * 0.30,
      y: earth.y + Math.sin(earthAngle + Math.PI / 3) * 0.22
    });
    map.set("earth-moon-l1", {
      x: earth.x + Math.cos(lunarAngle()) * 0.16,
      y: earth.y + Math.sin(lunarAngle()) * 0.12
    });
  }
  if (mars) {
    map.set("deimos-port", {
      x: mars.x + Math.cos(marsMoonAngle(2.4)) * 0.14,
      y: mars.y + Math.sin(marsMoonAngle(2.4)) * 0.10
    });
  }
  if (ceres) {
    map.set("ceres-drift-hub", {
      x: ceres.x - 0.12,
      y: ceres.y + 0.08
    });
  }
  return map;
}

function normalizedOrbitLayout(ids) {
  const worlds = ids.map((id) => ({ id, world: getBodyWorld(id) }));
  const center = {
    x: worlds.reduce((sum, item) => sum + item.world.x, 0) / worlds.length,
    y: worlds.reduce((sum, item) => sum + item.world.y, 0) / worlds.length
  };
  const radius = Math.max(0.001, ...worlds.map((item) => Math.hypot(item.world.x - center.x, item.world.y - center.y)));
  const scale = 0.88 / radius;
  return new Map(worlds.map((item) => [item.id, {
    x: (item.world.x - center.x) * scale,
    y: (item.world.y - center.y) * scale * 0.72
  }]));
}

function dynamicGravityPrimitives() {
  const terrain = currentScenario().terrain;
  const layout = dynamicGravityLayout();
  const wells = gravityBodyIdsForScenario()
    .map((id) => {
      const position = layout.get(id);
      const depth = fixedWellDepthFor(id);
      if (!position || !depth) return null;
      return {
        id,
        x: position.x,
        y: position.y,
        mass: visualMassForWellDepth(depth.value),
        soft: id === "earth" ? 0.11 : id === "moon" ? 0.09 : 0.14
      };
    })
    .filter(Boolean);
  const saddles = terrain.saddles.map((saddle, index) => {
    const node = terrain.nodes.find((item) => item.role.includes("saddle") || item.role.includes("pass"));
    const dynamicNode = node ? dynamicGravityNode(node) : null;
    return dynamicNode && index === 0
      ? { ...saddle, x: dynamicNode.x, y: dynamicNode.y }
      : saddle;
  });
  const shelves = terrain.shelves.map((shelf, index) => {
    const shelfNodes = terrain.nodes.filter((item) => item.role.includes("shelf"));
    const dynamicNode = shelfNodes[index] ? dynamicGravityNode(shelfNodes[index]) : null;
    return dynamicNode ? { ...shelf, x: dynamicNode.x, y: dynamicNode.y } : shelf;
  });
  return { wells, saddles, shelves };
}

function gravityBodyIdsForScenario() {
  if (state.scenarioId === "earth-moon") return ["earth", "moon"];
  if (state.scenarioId === "earth-mars") return ["earth", "mars"];
  return ["earth", "mars", "ceres"];
}

function visualMassForWellDepth(value) {
  return Math.max(0.16, Math.pow(value, 0.42));
}

function gravityWellAnchors() {
  return [
    { id: "sun", x: -1.18, y: -0.36, mass: 0.92, soft: 0.20 },
    { id: "earth", x: -0.48, y: 0.05, mass: 1.35, soft: 0.11 },
    { id: "moon", x: 0.02, y: 0.34, mass: 0.36, soft: 0.10 },
    { id: "mars", x: 0.88, y: -0.25, mass: 0.58, soft: 0.15 }
  ];
}

function gravityConceptNodes() {
  return [
    { id: "earth", name: "Earth Well", x: -0.48, y: 0.05, z: -1.50, color: "#78bfff", role: "deep gravity well" },
    { id: "leo-port", name: "LEO Port", x: -0.36, y: -0.11, z: -0.94, color: "#90f0c6", role: "exit shelf" },
    { id: "sun-earth-l1", name: "Sun-Earth L1/L2", x: -0.68, y: -0.12, z: -0.26, color: "#ffa96f", role: "solar saddle" },
    { id: "earth-moon-l1", name: "Earth-Moon L1", x: -0.12, y: 0.23, z: -0.36, color: "#c6a7ff", role: "lunar saddle" },
    { id: "moon", name: "Moon Well", x: 0.02, y: 0.34, z: -0.72, color: "#d7dce3", role: "secondary well" },
    { id: "phobos-port", name: "Mars / Phobos Shelf", x: 0.82, y: -0.18, z: -0.52, color: "#9ff1c7", role: "Mars gateway shelf" },
    { id: "mars", name: "Mars Well", x: 0.88, y: -0.25, z: -0.82, color: "#e9785f", role: "planetary well" }
  ];
}

function lowEnergyConceptNodes() {
  return [
    { id: "sun-earth-l1", name: "Sun-Earth L1/L2", x: -0.82, y: -0.22, z: 0.02, color: "#ffa96f", role: "halo gateway" },
    { id: "earth-moon-l1", name: "Earth-Moon L1", x: -0.38, y: 0.34, z: 0.04, color: "#c6a7ff", role: "lunar gateway" },
    { id: "mars-cycler-point", name: "Mars Cycler Node", x: 0.28, y: -0.28, z: 0.02, color: "#ffd06f", role: "cycler intercept" },
    { id: "phobos-port", name: "Phobos / Deimos", x: 0.74, y: 0.20, z: 0.04, color: "#9ff1c7", role: "Mars gateway" },
    { id: "ceres", name: "Ceres Belt Hub", x: 1.12, y: -0.08, z: 0.02, color: "#c5cbd4", role: "slow cargo target" }
  ];
}

function effectivePotential(x, y, primitives = dynamicGravityPrimitives()) {
  const terrain = currentScenario().terrain;
  const wells = primitives.wells;
  const slope = terrain.slope || { x: 0, y: 0 };
  const centrifugal = 0.09 * (x * x + y * y) + x * slope.x + y * slope.y;
  const pull = wells.reduce((sum, well) => {
    const d = Math.hypot(x - well.x, y - well.y) + well.soft;
    return sum - well.mass / d;
  }, 0);
  return Math.max(-1.70, Math.min(0.62, pull * 0.31 + centrifugal));
}

function drawPotentialSurface(primitives = dynamicGravityPrimitives()) {
  drawTerrainColorWash(primitives);
  const levels = [];
  for (let level = -1.34; level <= -0.14; level += 0.10) levels.push(Number(level.toFixed(2)));
  levels.forEach((level, index) => drawContour(level, contourColorForLevel(level), index, primitives));
}

function contourColorForLevel(level) {
  if (level < -0.98) return "rgba(92, 159, 236, 0.24)";
  if (level < -0.72) return "rgba(126, 205, 244, 0.30)";
  if (level < -0.48) return "rgba(184, 181, 255, 0.31)";
  if (level < -0.28) return "rgba(157, 241, 199, 0.28)";
  return "rgba(255, 208, 111, 0.24)";
}

function drawTerrainColorWash(primitives = dynamicGravityPrimitives()) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  primitives.wells.forEach((well) => {
    const center = projectIso(well.x, well.y, effectivePotential(well.x, well.y, primitives) + 0.02);
    const radius = (95 + well.mass * 52) * (state.width > 900 ? 1 : 0.72);
    const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
    gradient.addColorStop(0, "rgba(76, 144, 226, 0.24)");
    gradient.addColorStop(0.45, "rgba(76, 144, 226, 0.10)");
    gradient.addColorStop(1, "rgba(76, 144, 226, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawSolarSlope(slope, primitives = dynamicGravityPrimitives()) {
  const strength = Math.min(1, Math.hypot(slope.x, slope.y) * 4);
  if (strength <= 0.04) return;
  const left = projectIso(-1.32, 0.68, effectivePotential(-1.32, 0.68, primitives) + 0.03);
  const right = projectIso(1.20, -0.62, effectivePotential(1.20, -0.62, primitives) + 0.03);
  const gradient = ctx.createLinearGradient(left.x, left.y, right.x, right.y);
  gradient.addColorStop(0, "rgba(255, 169, 111, 0.02)");
  gradient.addColorStop(1, `rgba(255, 169, 111, ${0.08 + strength * 0.13})`);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);
  ctx.restore();
}

function drawFixedWellDepthGauge() {
  const wells = currentScenario().terrain.nodes
    .map((node) => ({ node, depth: fixedWellDepthFor(node.id) }))
    .filter((item) => item.depth);
  if (!wells.length) return;

  const x = state.width > 900 ? Math.max(488, state.width * 0.40) : 24;
  const y = state.width > 900 ? 172 : 414;
  const width = state.width > 900 ? Math.min(440, state.width - x - 410) : state.width - 48;
  if (width < 230) return;
  const rowHeight = 18;
  const height = 30 + wells.length * rowHeight;
  const scan = (performance.now() * 0.00018) % 1;

  ctx.save();
  roundedRect(x, y, width, height, 7);
  ctx.fillStyle = "rgba(8, 12, 17, 0.58)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.11)";
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#9edbff";
  ctx.font = "800 11px Inter, system-ui";
  ctx.fillText("Fixed well depth (EEU)", x + 12, y + 18);
  ctx.fillStyle = "#98a9ba";
  ctx.font = "600 10px Inter, system-ui";
  ctx.fillText("Earth escape-energy unit; values stay fixed", x + 150, y + 18, width - 162);

  wells.forEach(({ node, depth }, index) => {
    const rowY = y + 34 + index * rowHeight;
    const labelWidth = Math.min(110, width * 0.34);
    const barX = x + labelWidth + 18;
    const barWidth = width - labelWidth - 92;
    const normalized = Math.sqrt(Math.min(1, depth.value));
    const pulse = 0.55 + Math.sin(performance.now() * 0.003 + index) * 0.12;
    ctx.fillStyle = "#dce8f4";
    ctx.font = "700 11px Inter, system-ui";
    ctx.fillText(node.name.replace(" Well", ""), x + 12, rowY, labelWidth);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundedRect(barX, rowY - 9, barWidth, 6, 3);
    ctx.fill();
    ctx.fillStyle = withAlpha(node.color, 0.38 + pulse * 0.24);
    roundedRect(barX, rowY - 9, Math.max(2, barWidth * normalized), 6, 3);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 11px Inter, system-ui";
    ctx.fillText(formatWellDepth(depth.value), barX + barWidth + 10, rowY);
  });

  const scanX = x + 12 + (width - 24) * scan;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(scanX, y + 25);
  ctx.lineTo(scanX, y + height - 10);
  ctx.stroke();
  ctx.restore();
}

function drawEnergyProfileCue() {
  const nodes = currentScenario().terrain.nodes;
  const profileIds = currentScenario().terrain.profile || nodes.map((node) => node.id);
  const profile = profileIds.map((id) => nodes.find((node) => node.id === id)).filter(Boolean);
  if (profile.length < 2) return;
  const projected = profile.map((node) => projectIso(node.x, node.y, node.z + 0.13));
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.26)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  projected.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  const progress = ((state.simDays * 0.012) % 1 + 1) % 1;
  const marker = pointOnPolyline(projected, progress);
  ctx.beginPath();
  ctx.arc(marker.x, marker.y, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
}

function drawContour(level, color, index = 0, primitives = dynamicGravityPrimitives()) {
  const step = state.width > 900 ? 0.035 : 0.055;
  const minX = -1.36;
  const maxX = 1.32;
  const minY = -0.78;
  const maxY = 0.80;
  ctx.strokeStyle = color;
  ctx.lineWidth = index % 3 === 0 ? 1.08 : 0.72;
  ctx.setLineDash([]);
  ctx.beginPath();
  for (let y = minY; y < maxY; y += step) {
    for (let x = minX; x < maxX; x += step) {
      const cell = [
        { x, y, z: effectivePotential(x, y, primitives) },
        { x: x + step, y, z: effectivePotential(x + step, y, primitives) },
        { x: x + step, y: y + step, z: effectivePotential(x + step, y + step, primitives) },
        { x, y: y + step, z: effectivePotential(x, y + step, primitives) }
      ];
      contourSegmentsForCell(cell, level).forEach(([from, to]) => {
        const a = projectIso(from.x, from.y, level + 0.035);
        const b = projectIso(to.x, to.y, level + 0.035);
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      });
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function contourSegmentsForCell(cell, level) {
  const edges = [
    [cell[0], cell[1]],
    [cell[1], cell[2]],
    [cell[2], cell[3]],
    [cell[3], cell[0]]
  ];
  const crossings = edges
    .map(([from, to]) => interpolateContourEdge(from, to, level))
    .filter(Boolean);
  if (crossings.length < 2) return [];
  if (crossings.length === 2) return [[crossings[0], crossings[1]]];
  return [
    [crossings[0], crossings[1]],
    [crossings[2], crossings[3]]
  ];
}

function interpolateContourEdge(from, to, level) {
  const fromDelta = from.z - level;
  const toDelta = to.z - level;
  if (fromDelta === 0 && toDelta === 0) return null;
  if ((fromDelta > 0) === (toDelta > 0)) return null;
  const tValue = Math.max(0, Math.min(1, (level - from.z) / (to.z - from.z || 1)));
  return {
    x: lerp(from.x, to.x, tValue),
    y: lerp(from.y, to.y, tValue)
  };
}

function drawScenarioRouteFamiliesConcept() {
  const terrainNodes = new Map(currentScenario().terrain.nodes.map((node) => [node.id, node]));
  currentScenario().terrain.saddles.forEach((saddle, index) => {
    drawHaloLoop(saddle.x, saddle.y, index % 2 ? "#c6a7ff" : "#ffa96f");
  });
  currentScenarioRoutes().forEach((route, index) => {
    const metrics = routeWindowMetrics(route);
    const points = route.path
      .map((id, pathIndex) => terrainNodes.get(id) || conceptFallbackPoint(route, pathIndex))
      .filter(Boolean)
      .map((node) => [node.x, node.y, node.z + 0.04]);
    if (points.length < 2) return;
    drawDynamicConceptPath(points, route.color, 8 + index * 2, metrics);
    const marker = conceptPointOnPath(points, 0.56);
    if (state.selectedId === route.id || state.hoverId === route.id) {
      drawLabel(route.name, marker, route.color, true, `Wait ${formatEta(metrics.wait)}`);
    }
    state.hitTargets.push({ id: route.id, x: marker.x, y: marker.y, radius: 24 });
  });
}

function topologyNodesForScenario() {
  const roles = {
    "earth-moon": [
      ["earth", "Earth Demand", "sink / demand node", 0.12, 0.62],
      ["leo-port", "LEO Depot", "depot", 0.30, 0.42],
      ["earth-moon-l1", "EM L1/L2 Gateway", "gateway", 0.52, 0.34],
      ["moon", "Lunar Surface", "source / sink", 0.76, 0.55]
    ],
    "earth-mars": [
      ["earth", "Earth Demand", "sink / demand node", 0.10, 0.58],
      ["leo-port", "LEO Depot", "depot", 0.25, 0.38],
      ["cycler", "Cycler Relay", "relay", 0.48, 0.28],
      ["mars-cycler-point", "Mars Handoff", "handoff node", 0.66, 0.42],
      ["phobos-port", "Phobos Gateway", "gateway", 0.82, 0.30],
      ["mars", "Mars Demand", "sink / demand node", 0.90, 0.62]
    ],
    "lagrange-volatile": [
      ["sun-earth-l1", "SE L1/L2 Gateway", "gateway", 0.12, 0.50],
      ["earth-moon-l1", "EM Handoff", "handoff node", 0.30, 0.34],
      ["earth-l5", "L4/L5 Storage", "storage shelf", 0.46, 0.52],
      ["deimos-port", "Mars Relay Shelf", "relay", 0.64, 0.32],
      ["ceres-drift-hub", "Belt Depot", "depot", 0.78, 0.52],
      ["ceres", "Ceres Volatiles", "source", 0.92, 0.38]
    ]
  };
  return (roles[state.scenarioId] || roles["earth-moon"]).map(([id, name, role, x, y]) => ({
    id,
    name,
    role,
    x,
    y,
    color: colorForId(id)
  }));
}

function colorForId(id) {
  if (id === "cycler") return cyclerOrbit.color;
  const body = bodies.find((item) => item.id === id);
  if (body) return body.color;
  const node = gatewayNodes.find((item) => item.id === id);
  return node?.color || "#9edbff";
}

function topologyPoint(node) {
  const left = state.width > 900 ? Math.max(430, state.width * 0.32) : 24;
  const right = state.width > 900 ? state.width - 390 : state.width - 24;
  const top = state.width > 900 ? 180 : 360;
  const bottom = state.width > 900 ? state.height - 150 : state.height - 120;
  return {
    x: left + node.x * Math.max(120, right - left),
    y: top + node.y * Math.max(150, bottom - top)
  };
}

function drawRelayTopology() {
  const nodes = topologyNodesForScenario();
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  drawTopologyBackbone(nodes.map(topologyPoint));
  currentScenarioRoutes().forEach((route, index) => drawTopologyEdge(route, nodeMap, index));
  nodes.forEach((node) => drawTopologyNode(node, topologyPoint(node)));
}

function drawTopologyBackbone(points) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 10]);
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawTopologyEdge(route, nodeMap, index) {
  const points = route.path
    .map((id, pathIndex) => nodeMap.get(id) || topologyFallbackNode(route, pathIndex))
    .filter(Boolean)
    .map(topologyPoint);
  if (points.length < 2) return;
  const metrics = routeWindowMetrics(route);
  const selected = state.selectedId === route.id || state.hoverId === route.id;
  const alpha = metrics.availability ? 0.36 + metrics.pulse * 0.42 : 0.13;
  const width = 2.2 + metrics.flow * 8;
  ctx.save();
  drawScreenRoutePath(points, withAlpha(route.color, alpha), metrics.availability ? [] : [8, 10], width, index % 2 ? 0.09 : -0.08);
  const labelPoint = pointOnRoutePath(points, 0.54, index % 2 ? 0.09 : -0.08);
  drawTopologyEdgeBadge(route, metrics, labelPoint, selected);
  const packetCount = Math.max(1, Math.round(1 + metrics.flow * 5));
  for (let i = 0; i < packetCount; i += 1) {
    const progress = metrics.availability ? ((state.simDays / Math.max(80, route.cadence * 0.32)) + i / packetCount) % 1 : (0.16 + i * 0.12) % 1;
    const packet = pointOnRoutePath(points, progress, index % 2 ? 0.09 : -0.08);
    ctx.beginPath();
    ctx.arc(packet.x, packet.y, metrics.availability ? 3.4 + metrics.flow * 3 : 2.3, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(route.color, metrics.availability ? 0.74 : 0.24);
    ctx.fill();
  }
  state.hitTargets.push({ id: route.id, x: labelPoint.x, y: labelPoint.y, radius: 28 });
  ctx.restore();
}

function drawTopologyEdgeBadge(route, metrics, point, selected) {
  const text = `${metrics.availability ? "open" : "wait"} | ${formatEta(metrics.wait)} | flow ${Math.round(metrics.flow * 100)}%`;
  ctx.font = selected ? "800 12px Inter, system-ui" : "700 11px Inter, system-ui";
  const width = Math.min(210, ctx.measureText(text).width + 18);
  const height = 25;
  roundedRect(point.x - width / 2, point.y - height / 2, width, height, 6);
  ctx.fillStyle = selected ? "rgba(18, 28, 36, 0.94)" : "rgba(8, 12, 17, 0.78)";
  ctx.strokeStyle = metrics.availability ? "rgba(134, 240, 189, 0.52)" : "rgba(255, 208, 111, 0.34)";
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#eaf4ff";
  ctx.fillText(text, point.x - width / 2 + 9, point.y + 4);
}

function topologyFallbackNode(route, index) {
  const routeIndex = currentScenarioRoutes().findIndex((item) => item.id === route.id);
  return {
    id: `${route.id}-${index}`,
    x: Math.min(0.92, 0.16 + index * 0.22),
    y: 0.28 + routeIndex * 0.18 + Math.sin(index + route.phaseOffset) * 0.06,
    color: route.color
  };
}

function drawTopologyNode(node, point) {
  const selected = state.selectedId === node.id || state.hoverId === node.id;
  ctx.save();
  ctx.beginPath();
  ctx.arc(point.x, point.y, selected ? 18 : 15, 0, Math.PI * 2);
  ctx.fillStyle = `${node.color}2e`;
  ctx.fill();
  ctx.strokeStyle = roleStrokeStyle(node.role);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(point.x, point.y, 6.5, 0, Math.PI * 2);
  ctx.fillStyle = node.color;
  ctx.shadowColor = node.color;
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.shadowBlur = 0;
  drawLabel(node.name, point, node.color, selected, node.role);
  state.hitTargets.push({ id: node.id, x: point.x, y: point.y, radius: 24 });
  ctx.restore();
}

function roleStrokeStyle(role) {
  if (role.includes("gateway")) return "rgba(198, 167, 255, 0.78)";
  if (role.includes("relay")) return "rgba(143, 212, 255, 0.72)";
  if (role.includes("storage")) return "rgba(255, 145, 187, 0.72)";
  if (role.includes("depot")) return "rgba(144, 240, 198, 0.72)";
  if (role.includes("source")) return "rgba(255, 208, 111, 0.72)";
  if (role.includes("handoff")) return "rgba(255, 169, 111, 0.72)";
  return "rgba(255,255,255,0.42)";
}

function conceptFallbackPoint(route, index) {
  const routeIndex = currentScenarioRoutes().findIndex((item) => item.id === route.id);
  const spread = currentScenarioRoutes().length > 1 ? routeIndex / (currentScenarioRoutes().length - 1) : 0.5;
  return {
    x: -0.88 + index * 0.44,
    y: -0.34 + spread * 0.72 + Math.sin(index + route.phaseOffset) * 0.08,
    z: -0.08 + index * 0.03
  };
}

function drawDynamicConceptPath(points, color, width, metrics) {
  for (let offset = -2; offset <= 2; offset += 1) {
    const projected = points.map((point, index) => {
      const wave = Math.sin(index * 1.7 + offset + state.simDays * 0.018) * 0.018;
      return projectIso(point[0], point[1] + offset * 0.024 + wave, point[2] + Math.abs(offset) * 0.022);
    });
    ctx.beginPath();
    projected.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else if (index < projected.length - 1) {
        const next = projected[index + 1];
        ctx.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = offset === 0 ? withAlpha(color, 0.24 + metrics.pulse * 0.50) : withAlpha(color, 0.12);
    ctx.lineWidth = offset === 0 ? width * 0.24 : width * 0.10;
    ctx.setLineDash(offset === 0 ? [9, 10] : [3, 13]);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  const packets = Math.max(1, Math.round(1 + metrics.flow * 4));
  for (let i = 0; i < packets; i += 1) {
    const progress = ((state.simDays / 180) + i / packets) % 1;
    const packet = conceptPointOnPath(points, progress);
    ctx.beginPath();
    ctx.arc(packet.x, packet.y, 4 + metrics.flow * 3, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(color, 0.42 + metrics.pulse * 0.32);
    ctx.fill();
  }
}

function conceptPointOnPath(points, progress) {
  const segments = points.length - 1;
  const scaled = Math.min(0.999, Math.max(0, progress)) * segments;
  const index = Math.min(segments - 1, Math.floor(scaled));
  const tValue = scaled - index;
  const from = points[index];
  const to = points[index + 1];
  const midpoint = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2 - 0.12,
    (from[2] + to[2]) / 2 + 0.10
  ];
  const inv = 1 - tValue;
  return projectIso(
    inv * inv * from[0] + 2 * inv * tValue * midpoint[0] + tValue * tValue * to[0],
    inv * inv * from[1] + 2 * inv * tValue * midpoint[1] + tValue * tValue * to[1],
    inv * inv * from[2] + 2 * inv * tValue * midpoint[2] + tValue * tValue * to[2]
  );
}

function drawManifoldTubes() {
  drawHaloLoop(-0.82, -0.18, "#ffa96f");
  drawHaloLoop(-0.38, 0.34, "#c6a7ff");
  drawHaloLoop(0.74, 0.20, "#9ff1c7");
  drawManifoldPath([
    [-0.82, -0.22, 0.12],
    [-0.62, -0.42, 0.30],
    [-0.28, -0.34, 0.44],
    [0.04, -0.06, 0.36],
    [0.28, -0.28, 0.18],
    [0.52, -0.04, 0.16],
    [0.74, 0.20, 0.08]
  ], "#8da7ff", 13);
  drawManifoldPath([
    [-0.38, 0.34, 0.10],
    [-0.18, 0.56, 0.30],
    [0.16, 0.46, 0.36],
    [0.46, 0.30, 0.24],
    [0.74, 0.20, 0.10],
    [0.98, 0.10, 0.05],
    [1.12, -0.08, 0.02]
  ], "#7ee0ff", 10);
  drawManifoldPath([
    [-0.88, -0.12, -0.02],
    [-0.58, -0.62, 0.06],
    [-0.18, -0.54, 0.10],
    [0.28, -0.28, 0.06],
    [0.66, -0.22, 0.03],
    [1.12, -0.08, 0.00]
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
  for (let offset = -2; offset <= 2; offset += 1) {
    const offsetScale = offset * 0.026;
    const projected = points.map((point, index) => {
      const wave = Math.sin(index * 1.7 + offset) * 0.018;
      return projectIso(point[0], point[1] + offsetScale + wave, point[2] + Math.abs(offset) * 0.026);
    });
    ctx.beginPath();
    projected.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else if (index < projected.length - 1) {
        const next = projected[index + 1];
        ctx.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = offset === 0 ? `${color}b8` : `${color}32`;
    ctx.lineWidth = offset === 0 ? width * 0.24 : width * 0.10;
    ctx.setLineDash(dash);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawConceptNode(item, x, y, hint, showLabel = true) {
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
  if (showLabel) drawLabel(item.name, { x, y }, item.color, selected, hint);
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
  const model = viewModels[state.viewMode];
  const contract = currentViewContract();
  const scenario = currentScenario();
  modelBadge.textContent = model.label;
  modelNote.textContent = `${scenario.name}: ${scenario.problem} ${model.note}`;
  frameBadge.textContent = contract.frame;
  scaleBadge.textContent = contract.scale;
  routeBadge.textContent = contract.routes;
  statusPill.textContent = conceptual ? t("research") : state.paused ? t("paused") : t("running");
  statusPill.style.color = conceptual ? "#8fd4ff" : state.paused ? "#ffd06f" : "#79e4b0";
  pauseButton.disabled = conceptual;
  orbitToggle.disabled = conceptual;
  scaleButtons.forEach((button) => {
    button.disabled = conceptual;
    button.setAttribute("aria-disabled", String(conceptual));
  });
  if (state.selectedId) updateInspector(state.selectedId);
}

function currentViewContract() {
  if (state.viewMode !== "orbit") {
    const model = viewModels[state.viewMode];
    return { frame: model.frame, scale: model.scale, routes: model.routes };
  }
  const scale = scaleModes[state.scaleMode];
  return {
    frame: scale.frame,
    scale: scale.scaleClaim,
    routes: scale.routeClaim
  };
}

function describeObject(id) {
  if (state.viewMode === "gravity") {
    const terrainNode = currentScenario().terrain.nodes.find((item) => item.id === id);
    if (terrainNode) return gravityNodeInfo(terrainNode);
  }
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
  const probe = probeOrbits.find((item) => item.id === id);
  if (probe) return objectInfo(probe, probe.position ? positionSummary(probe.position()) : `${angleDegrees(bodyAngle(probe))} deg / educational orbit`);
  if (id === "cycler") {
    const stop = nextCyclerStop();
    return objectInfo(
      cyclerOrbit,
      `${stop.label} in ${formatEta(stop.eta)}`,
      stop.label,
      formatEta(stop.eta),
      "Stylized Aldrin-cycler approximation; taxi arcs are timing symbols, not rendezvous trajectories."
    );
  }
  const shuttle = shuttleRoutes.find((item) => item.id === id);
  if (shuttle) {
    const trip = routeProgress(shuttle);
    const arrivalDay = trip.active ? trip.nextArrival : trip.nextDeparture + shuttle.duration;
    return objectInfo(
      shuttle,
      trip.active ? "in transfer" : "staged for next window",
      `${trip.active ? "Arrives" : "Launches"} ${formatDate(trip.active ? arrivalDay : trip.nextDeparture)}`,
      formatEta((trip.active ? arrivalDay : trip.nextDeparture) - state.simDays),
      "Schematic taxi leg; real cycler rendezvous requires substantial maneuvering."
    );
  }
  const dynamicRoute = dynamicRouteFamilies.find((item) => item.id === id);
  if (dynamicRoute) return dynamicRouteInfo(dynamicRoute);
  const route = routeClasses.find((item) => item.id === id);
  if (route) return objectInfo(route, "conceptual route class");
  return null;
}

function gravityNodeInfo(node) {
  const terrain = currentScenario().terrain;
  const dynamicNode = dynamicGravityNode(node);
  const primitives = dynamicGravityPrimitives();
  const nearestWell = nearestPrimitive(dynamicNode, primitives.wells);
  const nearestSaddle = nearestPrimitive(dynamicNode, primitives.saddles);
  const nearestShelf = nearestPrimitive(dynamicNode, primitives.shelves);
  const fixedDepth = fixedWellDepthFor(node.id);
  const nearWellProxy = nearestWell ? Math.min(1, nearestWell.mass / Math.max(0.2, distance2d(dynamicNode, nearestWell) + nearestWell.soft)) : 0;
  const wellDepthProxy = fixedDepth ? nearWellProxy : null;
  const escapeEnergyProxy = Math.min(1, Math.abs(dynamicNode.z) * 0.72 + nearWellProxy * 0.18);
  const shelfHeightProxy = nearestShelf ? Math.max(0.05, 1 - Math.min(1, distance2d(dynamicNode, nearestShelf) * 2.2)) * (0.45 + nearestShelf.lift) : Math.max(0.04, 1 + dynamicNode.z) * 0.32;
  const saddleThresholdProxy = nearestSaddle ? Math.max(0.08, 1 - Math.min(1, distance2d(dynamicNode, nearestSaddle) * 2.4)) * (0.50 + nearestSaddle.lift) : 0.12;
  const solarSlopeProxy = Math.min(1, Math.hypot(terrain.slope?.x || 0, terrain.slope?.y || 0) * 3.2);
  return {
    id: node.id,
    name: node.name,
    lead: `${node.role}. Scenario-normalized proxy terrain; not mission-grade delta-v.`,
    articleId: "gravity-view",
    details: [
      ["Model class", "Conceptual energy terrain"],
      ["Scenario", currentScenario().name],
      ["Terrain role", node.role],
      ["Fixed well depth", fixedDepth ? formatWellDepth(fixedDepth.value) : "--"],
      ["Well-depth unit", fixedDepth ? fixedDepth.basis : "Only massive body wells get fixed EEU values"],
      ["Mass model", fixedDepth ? "Massive body well source" : masslessGravityRoleFor(node)],
      ["wellDepthProxy", wellDepthProxy === null ? "not applicable; massless marker" : `${Math.round(wellDepthProxy * 100)}% normalized proxy`],
      ["escapeEnergyProxy", `${Math.round(escapeEnergyProxy * 100)}% normalized proxy`],
      ["shelfHeightProxy", `${Math.round(shelfHeightProxy * 100)}% normalized proxy`],
      ["saddleThresholdProxy", `${Math.round(saddleThresholdProxy * 100)}% normalized proxy`],
      ["solarSlopeProxy", `${Math.round(solarSlopeProxy * 100)}% normalized proxy`],
      ["routeEnergyClass", routeEnergyClassFor(node)],
      ["Model limit", "Proxy values are hand-normalized teaching values, not solved potential fields, CR3BP, delta-v, or mission optimization."]
    ]
  };
}

function masslessGravityRoleFor(node) {
  if (node.id === "leo-port") return "Massless orbital state marker; contributes no gravity well";
  if (node.role.includes("saddle") || node.role.includes("pass")) return "Massless pass / saddle marker; contributes no gravity well";
  if (node.role.includes("shelf")) return "Massless staging shelf marker; contributes no gravity well";
  return "Massless concept marker; contributes no gravity well";
}

function fixedWellDepthFor(id) {
  return gravityWellDepthUnits[id] || null;
}

function formatWellDepth(value) {
  if (value < 0.01) return `${value.toFixed(3)} EEU`;
  return `${value.toFixed(2)} EEU`;
}

function nearestPrimitive(node, primitives) {
  if (!primitives?.length) return null;
  return primitives.reduce((best, primitive) => {
    if (!best) return primitive;
    return distance2d(node, primitive) < distance2d(node, best) ? primitive : best;
  }, null);
}

function distance2d(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function routeEnergyClassFor(node) {
  if (node.role.includes("well")) return "well climb";
  if (node.role.includes("saddle") || node.role.includes("pass")) return "saddle / pass";
  if (node.role.includes("shelf")) return "staging shelf";
  return "terrain handoff";
}

function dynamicRouteInfo(route) {
  const metrics = routeWindowMetrics(route);
  const open = metrics.availability ? "open / usable" : "waiting for next window";
  return {
    id: route.id,
    name: route.name,
    lead: route.role,
    articleId: "low-energy-routes-view",
    details: [
      ["Type", route.type],
      ["Model class", "Heuristic route-window model"],
      ["Route claim", claimLabel(route.claim)],
      ["Geometry", route.geometry],
      ["Scenario", scenarios[route.scenarioId].name],
      ["Window state", open],
      ["Next window", metrics.wait <= 0 ? "now" : formatDate(metrics.nextWindow)],
      ["Wait proxy", formatEta(metrics.wait)],
      ["Travel time class", route.travelClass],
      ["Cadence", `${Math.round(route.cadence)} d ${route.waitUnit}`],
      ["Duty cycle", `${Math.round(route.dutyCycle * 100)}%`],
      ["Reliability proxy", `${Math.round(route.reliability * 100)}%`],
      ["Capacity proxy", `${Math.round(route.capacity * 100)}%`],
      ["Suitability", `${Math.round(route.suitability * 100)}% ${route.payload}`],
      ["Flow proxy", `${Math.round(metrics.flow * 100)}%`],
      ["Waiting cost", `${Math.round(metrics.waitingCost)} conceptual days`],
      ["Model limit", "Route family is conceptual; availability, waiting, and flow are heuristic values for future economics."]
    ]
  };
}

function objectInfo(item, phase, nextEvent = "--", eta = "--", modelNoteText = "") {
  const connected = connectedRoutes(item.id);
  const modelClass = objectModelClass(item);
  const details = [
    ["Type", item.type || "Infrastructure node"],
    ["Model class", modelClass],
    ["Role", item.role],
    ["Parent system", item.parent || "--"],
    ["Position / phase", phase],
    ["Next event", nextEvent],
    ["Connected routes", connected.length ? connected.join(", ") : "--"],
    ["Infrastructure potential", item.infrastructure || "Medium"],
    ["ETA", eta],
    ["Model limit", modelNoteText || modelLimitFor(modelClass)]
  ];
  if (item.claim) details.splice(2, 0, ["Route claim", claimLabel(item.claim)], ["Geometry", item.geometry || "--"]);
  return {
    id: item.id,
    name: item.name,
    lead: item.role,
    articleId: articleIdFor(item.id),
    details
  };
}

function modelLimitFor(modelClass) {
  if (modelClass.includes("Keplerian")) return `Epoch ${modelEpochLabel}; ${modelTimeSpan}`;
  if (modelClass.includes("Lagrange")) return "Distances and local layouts are exaggerated for readability.";
  if (modelClass.includes("Local")) return "Local distances are exaggerated; LEO phase advances faster than the Moon as a schematic orbital cue.";
  if (modelClass.includes("Route")) return "Route class only; not an optimized transfer.";
  if (modelClass.includes("Educational")) return "Shown to explain an energy regime, not as infrastructure.";
  return "Conceptual visualization; not mission software.";
}

function connectedRoutes(id) {
  return [...routeClasses, ...shuttleRoutes, ...dynamicRouteFamilies]
    .filter((route) => route.from === id || route.to === id || (id === "cycler" && (route.from === "cycler" || route.to === "cycler")))
    .map((route) => route.name);
}

function updateInspector(id) {
  const info = describeObject(id);
  if (!info) return;
  state.activeArticleId = info.articleId;
  inspectName.textContent = info.name;
  inspectRoute.textContent = info.lead;
  inspectDetails.innerHTML = info.details.map(([label, value]) => `
    <div>
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>
  `).join("");
}

function applyLanguage(language = state.language) {
  state.language = language;
  document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  languageButtons.forEach((button) => button.classList.toggle("active", button.dataset.language === language));
  reviewEyebrow.textContent = t("offlineReview");
  reviewSnapshotLabel.textContent = t("includeSnapshot");
  reviewSubmit.textContent = t("saveLocally");
  reviewCancel.textContent = t("cancel");
  reviewRatingButtons.forEach((button) => {
    button.textContent = button.dataset.rating === "up" ? t("ratingGood") : t("ratingNeedsWork");
  });
  if (!state.selectedId) {
    inspectName.textContent = t("selectObject");
    inspectRoute.textContent = t("inspectHint");
  }
  updateReviewCopy();
}

function openArticle(id = state.activeArticleId) {
  state.activeArticleId = id;
  const entry = explanationEntries[id] || explanationEntries["orbit-view"];
  articleTitle.textContent = entry.title;
  articleBody.innerHTML = `
    <section>
      <h3>Definition</h3>
      <p>${entry.definition}</p>
    </section>
    <section>
      <h3>Why It Matters</h3>
      <p>${entry.matters}</p>
    </section>
    <section>
      <h3>What This Demo Models</h3>
      <p>${entry.models}</p>
    </section>
    <section>
      <h3>What This Demo Simplifies</h3>
      <p>${entry.simplifies}</p>
    </section>
  `;
  articleDrawer.classList.add("open");
  articleDrawer.setAttribute("aria-hidden", "false");
}

function closeArticle() {
  articleDrawer.classList.remove("open");
  articleDrawer.setAttribute("aria-hidden", "true");
}

function updateSchedule() {
  const shuttleRows = shuttleRoutes
    .map((route) => {
      const trip = routeProgress(route);
      const active = trip.active;
      const event = trip.currentEvent;
      const time = active ? event.arrival : event.departure;
      return {
        id: route.id,
        group: "Shuttle schedule",
        name: route.name,
        route: `${labelFor(route.from)} -> ${labelFor(route.to)}`,
        eta: formatEta(time - state.simDays),
        meta: `${active ? "Arrives" : "Departs"} ${formatDate(time)} near ${event.window}`,
        active,
        sortDay: time
      };
    });
  const dynamicRows = currentScenarioRoutes().map((route) => {
    const metrics = routeWindowMetrics(route);
    return {
      id: route.id,
      group: "Scenario route windows",
      name: route.name,
      route: `${labelFor(route.from)} -> ${labelFor(route.to)}`,
      eta: metrics.wait <= 0 ? "open" : formatEta(metrics.wait),
      meta: `${route.travelClass}; flow ${Math.round(metrics.flow * 100)}%; ${route.payload}; ${route.geometry}`,
      active: metrics.availability > 0,
      sortDay: metrics.nextWindow
    };
  });
  const rows = [...dynamicRows, ...shuttleRows]
    .sort((a, b) => a.group.localeCompare(b.group) || a.sortDay - b.sortDay);
  const groups = ["Scenario route windows", "Shuttle schedule"];

  scheduleList.innerHTML = groups.map((group) => {
    const groupRows = rows.filter((row) => row.group === group);
    if (!groupRows.length) return "";
    return `
      <div class="schedule-group-label">${group}</div>
      ${groupRows.map((row) => `
        <button class="schedule-item ${row.group === "Scenario route windows" ? "scenario-row" : ""}" type="button" data-route-id="${row.id}">
          <span class="schedule-route">${row.route}</span>
          <span class="schedule-eta">${row.active ? t("eta") : t("timePrefix")} ${row.eta}</span>
          <span class="schedule-meta">${row.name} - ${row.meta}</span>
        </button>
      `).join("")}
    `;
  }).join("");
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

function showReviewMenu(clientX, clientY, targetId = state.selectedId) {
  state.reviewTargetId = targetId || state.selectedId || null;
  const viewerRect = canvas.parentElement.getBoundingClientRect();
  const menuWidth = 170;
  const menuHeight = 86;
  reviewMenu.style.left = `${Math.min(clientX - viewerRect.left, viewerRect.width - menuWidth - 12)}px`;
  reviewMenu.style.top = `${Math.min(clientY - viewerRect.top, viewerRect.height - menuHeight - 12)}px`;
  reviewMenu.hidden = false;
}

function hideReviewMenu() {
  reviewMenu.hidden = true;
}

function updateReviewCopy() {
  const isFeedback = state.reviewAction === "feedback";
  reviewTitle.textContent = isFeedback ? t("feedbackTitle") : t("questionTitle");
  reviewPromptLabel.textContent = isFeedback ? t("feedbackSummaryLabel") : t("questionLabel");
  reviewFeedbackLabel.textContent = t("feedbackDetailLabel");
  reviewFeedbackWrap.hidden = !isFeedback;
  reviewRatingGroup.hidden = !isFeedback;
}

function openReviewDrawer(action) {
  state.reviewAction = action;
  state.reviewRating = "";
  reviewPrompt.value = "";
  reviewFeedback.value = "";
  reviewStatus.textContent = "";
  reviewSnapshot.checked = true;
  reviewRatingButtons.forEach((button) => button.classList.remove("active"));
  updateReviewCopy();
  reviewDrawer.classList.add("open");
  reviewDrawer.setAttribute("aria-hidden", "false");
  reviewPrompt.focus();
}

function closeReviewDrawer() {
  reviewDrawer.classList.remove("open");
  reviewDrawer.setAttribute("aria-hidden", "true");
}

function captureCanvasSnapshot() {
  if (!reviewSnapshot.checked) return null;
  const maxWidth = 960;
  const ratio = Math.min(1, maxWidth / canvas.width);
  const snapshotCanvas = document.createElement("canvas");
  snapshotCanvas.width = Math.max(1, Math.round(canvas.width * ratio));
  snapshotCanvas.height = Math.max(1, Math.round(canvas.height * ratio));
  const snapshotCtx = snapshotCanvas.getContext("2d");
  snapshotCtx.drawImage(canvas, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
  return snapshotCanvas.toDataURL("image/jpeg", 0.72);
}

function currentReviewContext() {
  const targetId = state.reviewTargetId || state.selectedId;
  const info = targetId ? describeObject(targetId) : null;
  return {
    version: demoVersion,
    url: window.location.href,
    scenarioId: state.scenarioId,
    scenarioName: currentScenario().name,
    viewMode: state.viewMode,
    scaleMode: state.scaleMode,
    simDate: formatDate(state.simDays),
    simDays: Number(state.simDays.toFixed(3)),
    selectedId: state.selectedId,
    targetId,
    targetName: info?.name || null,
    targetLead: info?.lead || null,
    targetDetails: info?.details || [],
    contract: currentViewContract(),
    layers: { ...state.layers },
    viewport: { width: state.width, height: state.height, dpr: state.dpr },
    orbitCamera: {
      zoom: Number(state.zoom.toFixed(3)),
      pan: { x: Math.round(state.pan.x), y: Math.round(state.pan.y) },
      centerWorld: {
        x: Number(state.centerWorld.x.toFixed(4)),
        y: Number(state.centerWorld.y.toFixed(4))
      }
    },
    conceptCamera: {
      rotation: Number(state.concept.rotation.toFixed(3)),
      pitch: Number(state.concept.pitch.toFixed(3)),
      zoom: Number(state.concept.zoom.toFixed(3)),
      pan: { x: Math.round(state.concept.pan.x), y: Math.round(state.concept.pan.y) }
    }
  };
}

async function saveReviewRecord() {
  const isFeedback = state.reviewAction === "feedback";
  const endpoint = isFeedback ? "/api/feedback" : "/api/ask";
  const payload = {
    language: state.language,
    prompt: reviewPrompt.value.trim(),
    feedback: reviewFeedback.value.trim(),
    rating: isFeedback ? state.reviewRating : "",
    context: currentReviewContext(),
    snapshot: captureCanvasSnapshot()
  };
  reviewSubmit.disabled = true;
  reviewStatus.textContent = t("saving");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Save failed");
    reviewStatus.textContent = isFeedback ? t("savedFeedback") : t("savedQuestion");
    setTimeout(closeReviewDrawer, 520);
  } catch {
    reviewStatus.textContent = t("saveFailed");
  } finally {
    reviewSubmit.disabled = false;
  }
}

function tick(now) {
  const elapsed = Math.min(80, now - lastFrame);
  lastFrame = now;
  updateCameraTransition(now);
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

function setViewMode(mode) {
  state.viewMode = mode;
  state.selectedId = null;
  state.activeArticleId = mode === "gravity" ? "gravity-view" : mode === "manifold" ? "low-energy-routes-view" : "orbit-view";
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
  updateInspector(mode === "gravity" ? terrainDefaultNode().id : mode === "manifold" ? currentScenario().defaultInspectId : currentScenario().defaultInspectId);
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

function setScenario(id) {
  if (!scenarios[id]) return;
  state.scenarioId = id;
  const scenario = currentScenario();
  applyScenarioLayerPreset();
  scenarioButtons.forEach((button) => button.classList.toggle("active", button.dataset.scenarioId === id));
  if (state.scaleMode !== scenario.focusMode) {
    state.scaleMode = scenario.focusMode;
    scaleButtons.forEach((button) => button.classList.toggle("active", button.dataset.scaleMode === state.scaleMode));
    state.zoom = 1;
    state.pan = { x: 0, y: 0 };
    startCameraTransition(state.scaleMode);
  }
  state.selectedId = state.viewMode === "gravity" ? terrainDefaultNode().id : scenario.defaultInspectId;
  state.activeArticleId = state.viewMode === "gravity" ? "gravity-view" : state.viewMode === "manifold" ? "low-energy-routes-view" : "orbit-view";
  updateInspector(state.selectedId);
}

function terrainDefaultNode() {
  return currentScenario().terrain.nodes[0] || { id: "earth" };
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
  return new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(date);
}

function formatEta(days) {
  if (days <= 0.05) return t("arriving");
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

layerToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => {
    state.layers[toggle.dataset.layer] = toggle.checked;
  });
});

sheetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.dataset.sheetState = button.dataset.sheetState;
    sheetButtons.forEach((item) => item.classList.toggle("active", item === button));
  });
});

articleButton.addEventListener("click", () => openArticle(state.activeArticleId));
articleClose.addEventListener("click", closeArticle);
reviewClose.addEventListener("click", closeReviewDrawer);
reviewCancel.addEventListener("click", closeReviewDrawer);

reviewMenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-review-action]");
  if (!button) return;
  hideReviewMenu();
  openReviewDrawer(button.dataset.reviewAction);
});

reviewRatingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.reviewRating = button.dataset.rating;
    reviewRatingButtons.forEach((item) => item.classList.toggle("active", item === button));
  });
});

reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveReviewRecord();
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.language);
  });
});

speedButtons.forEach((button) => {
  button.addEventListener("click", () => setSpeed(Number(button.dataset.speed)));
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setViewMode(button.dataset.viewMode));
});

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => setScenario(button.dataset.scenarioId));
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
  if (event.button === 2) return;
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

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const point = pointerPosition(event);
  const targetId = hitTest(point);
  if (targetId) {
    state.selectedId = targetId;
    updateInspector(targetId);
  }
  showReviewMenu(event.clientX, event.clientY, targetId);
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

document.addEventListener("click", (event) => {
  if (!reviewMenu.hidden && !reviewMenu.contains(event.target)) hideReviewMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideReviewMenu();
    closeReviewDrawer();
  }
});

window.addEventListener("resize", resize);
resize();
setSpeed(10);
document.body.dataset.viewMode = state.viewMode;
document.body.dataset.sheetState = "peek";
setScenario(state.scenarioId);
applyLanguage("en");
updateInspector(state.selectedId);
requestAnimationFrame(tick);
