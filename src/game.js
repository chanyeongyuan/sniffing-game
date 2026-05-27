const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE = 32;
const MAP_W = 24;
const MAP_H = 16;
const TOTAL_REVENUE = 64000;

const dom = {
  primaryListTitle: document.getElementById("primaryListTitle"),
  touchpointCount: document.getElementById("touchpointCount"),
  touchpointList: document.getElementById("touchpointList"),
  secondaryListTitle: document.getElementById("secondaryListTitle"),
  savePointCount: document.getElementById("savePointCount"),
  savePointList: document.getElementById("savePointList"),
  routeLength: document.getElementById("routeLength"),
  nextBestStep: document.getElementById("nextBestStep"),
  routeMeterFill: document.getElementById("routeMeterFill"),
  routeInsight: document.getElementById("routeInsight"),
  pathfindButton: document.getElementById("pathfindButton"),
  touchPathfindButton: document.getElementById("touchPathfindButton"),
  resetButton: document.getElementById("resetButton"),
  stageButton: document.getElementById("stageButton"),
  breezeButton: document.getElementById("breezeButton"),
  routeName: document.getElementById("routeName"),
  dialogueSpeaker: document.getElementById("dialogueSpeaker"),
  dialogueText: document.getElementById("dialogueText"),
  revenueTotal: document.getElementById("revenueTotal"),
  leadScoreTotal: document.getElementById("leadScoreTotal"),
  dealScoreTotal: document.getElementById("dealScoreTotal"),
  journeyStatus: document.getElementById("journeyStatus"),
  mathTitle: document.getElementById("mathTitle"),
  conversionRate: document.getElementById("conversionRate"),
  journeyMath: document.getElementById("journeyMath"),
  mixTitle: document.getElementById("mixTitle"),
  modelName: document.getElementById("modelName"),
  creditBars: document.getElementById("creditBars"),
  eventCount: document.getElementById("eventCount"),
  eventLog: document.getElementById("eventLog"),
  questionModal: document.getElementById("questionModal"),
  questionTitle: document.getElementById("questionTitle"),
  questionProgress: document.getElementById("questionProgress"),
  questionText: document.getElementById("questionText"),
  questionAnswer: document.getElementById("questionAnswer"),
  questionSaveButton: document.getElementById("questionSaveButton"),
  questionLaterButton: document.getElementById("questionLaterButton")
};

const colors = {
  ink: "#17212b",
  grass: "#74b85d",
  grass2: "#81c569",
  path: "#d1ad68",
  path2: "#bc9355",
  plaza: "#c1985b",
  water: "#43a9c8",
  water2: "#6ad5e6",
  forest: "#2c724b",
  forest2: "#45a65a",
  rock: "#5e6470",
  paper: "#fff6d8",
  text: "#f8f4df",
  cyan: "#54d9ff",
  coral: "#ff7a4d",
  yellow: "#ffd866",
  orange: "#ff8a3d",
  pink: "#ff2f70"
};

const touchpoints = [
  {
    id: "email",
    label: "Email",
    kind: "Nurture",
    x: 3,
    y: 3,
    color: "#54d9ff",
    weight: 14,
    insight: "Email captured the first intent signal and opened the journey."
  },
  {
    id: "ads",
    label: "Ads",
    kind: "Paid",
    x: 10,
    y: 5,
    color: "#ff8a3d",
    weight: 18,
    insight: "Ads added campaign influence and strengthened the route."
  },
  {
    id: "webinar",
    label: "Webinar",
    kind: "Event",
    x: 17,
    y: 5,
    color: "#ffd866",
    weight: 24,
    insight: "Webinar created a high-intent touch with strong revenue pull."
  },
  {
    id: "community",
    label: "Review",
    kind: "Social",
    x: 7,
    y: 12,
    color: "#5ed88f",
    weight: 16,
    insight: "Review proof added an assist before the buying decision."
  },
  {
    id: "call",
    label: "Sales Call",
    kind: "Sales",
    x: 20,
    y: 11,
    color: "#a98bff",
    weight: 28,
    insight: "Sales Call closed the loop and became a decisive late touch."
  }
];

const savePoints = [
  {
    id: "leads",
    label: "Lead Volume",
    x: 2,
    y: 8,
    color: "#54d9ff",
    question: "How many leads are we getting per month?",
    placeholder: "Example: 1,200 leads per month",
    weight: 12
  },
  {
    id: "budget",
    label: "SEO Budget",
    x: 10,
    y: 8,
    color: "#ffd866",
    question: "How much budget is given to SEO or marketing, and what is the rough conversion rate?",
    placeholder: "Example: $25,000 per month, around 3.5% conversion",
    weight: 16
  },
  {
    id: "systems",
    label: "Tracking Stack",
    x: 17,
    y: 8,
    color: "#a98bff",
    question: "What are the other systems the team is using to help track attribution?",
    placeholder: "Example: GA4, LinkedIn Ads, Salesforce, spreadsheets",
    weight: 14
  },
  {
    id: "dropout",
    label: "Drop-off Rate",
    x: 21,
    y: 8,
    color: "#ff7a4d",
    question: "What is the average number or percentage of customers that drops out the marketing journey?",
    placeholder: "Example: 42% drop out before sales qualification",
    weight: 18
  }
];

const salesSequences = [
  {
    id: "intro",
    label: "Intro Sequence",
    kind: "Sequence",
    x: 3,
    y: 12,
    color: "#54d9ff",
    weight: 16,
    insight: "Intro sequence warmed the account and created the first sales signal."
  },
  {
    id: "followup",
    label: "Smart Follow-up",
    kind: "Sequence",
    x: 8,
    y: 10,
    color: "#ffd866",
    weight: 18,
    insight: "Smart follow-up kept the deal moving after the first reply."
  },
  {
    id: "mutual",
    label: "MAP Sequence",
    kind: "Plan",
    x: 14,
    y: 6,
    color: "#5ed88f",
    weight: 20,
    insight: "Mutual action plan aligned next steps with the buying team."
  },
  {
    id: "exec",
    label: "Exec Sequence",
    kind: "Stakeholder",
    x: 19,
    y: 11,
    color: "#a98bff",
    weight: 22,
    insight: "Executive sequence found the sponsor needed to close."
  }
];

const dealStages = [
  { id: "qualified", label: "Qualified", x: 5, y: 13, required: 1, progress: 25, color: "#54d9ff" },
  { id: "demo", label: "Demo", x: 11, y: 9, required: 2, progress: 48, color: "#ffd866" },
  { id: "proposal", label: "Proposal", x: 17, y: 5, required: 3, progress: 72, color: "#5ed88f" },
  { id: "close", label: "Close Deal", x: 22, y: 2, required: 4, progress: 100, color: "#ff7a4d" }
];

const breezeAgent = {
  x: 12,
  y: 4,
  label: "Breeze Agent"
};

const salesBlocks = new Set(
  [
    [4, 4],
    [5, 4],
    [8, 3],
    [9, 3],
    [14, 3],
    [15, 3],
    [19, 4],
    [3, 6],
    [7, 6],
    [8, 6],
    [12, 7],
    [16, 7],
    [20, 7],
    [5, 9],
    [6, 9],
    [13, 10],
    [17, 10],
    [21, 10],
    [3, 14],
    [10, 13],
    [15, 13],
    [18, 14]
  ].map(([x, y]) => key(x, y))
);

const salesSafeCells = new Set([
  key(1, 14),
  key(2, 14),
  key(1, 13),
  key(breezeAgent.x, breezeAgent.y),
  ...salesSequences.map((item) => key(item.x, item.y)),
  ...dealStages.map((item) => key(item.x, item.y))
]);

const portal = {
  x: 22,
  y: 8,
  label: "Conversion"
};

const state = createInitialState();
const map = buildMap();

function createInitialState(mode = "marketing") {
  return {
    mode,
    player: { x: 1, y: 8 },
    marketingPlayer: { x: 1, y: 8 },
    collected: [],
    route: [],
    routeActive: false,
    routeTarget: null,
    routeScore: 0,
    completed: false,
    saveAnswers: {},
    activeSavePoint: null,
    sales: createSalesState(),
    events: [],
    speaker: mode === "sales" ? "Breeze Agent" : "Growth Gabby",
    message:
      mode === "sales"
        ? "Navigate the space pipeline, avoid timed deal-risk bombs, and close the deal."
        : "Sniff touchpoints, answer save point questions, and reveal the conversion route.",
    pulse: 0
  };
}

function createSalesState() {
  return {
    player: { x: 1, y: 14 },
    sequences: [],
    stages: [],
    bombs: createSalesBombs(7, 0),
    dealScore: 100,
    dealHealth: 100,
    dealProgress: 0,
    agentCharges: 0,
    agentCollected: false,
    agentUsed: 0,
    closed: false,
    lost: false
  };
}

function createSalesBombs(count, now) {
  const bombs = [];
  let attempts = 0;

  while (bombs.length < count && attempts < 240) {
    attempts += 1;
    const x = 2 + Math.floor(Math.random() * (MAP_W - 4));
    const y = 2 + Math.floor(Math.random() * (MAP_H - 4));
    const cell = key(x, y);
    if (salesBlocks.has(cell) || salesSafeCells.has(cell) || bombs.some((bomb) => bomb.x === x && bomb.y === y)) continue;
    bombs.push(createSalesBomb(x, y, now));
  }

  return bombs;
}

function createSalesBomb(x, y, now) {
  return {
    x,
    y,
    explodeAt: now + 2.8 + Math.random() * 5.4,
    explodingUntil: 0,
    blast: 2,
    hit: false
  };
}

function resetGame() {
  const fresh = createInitialState(state.mode);
  Object.assign(state, fresh);
  dom.questionModal.classList.add("hidden");
  updateUI();
}

function switchStage() {
  if (state.mode === "marketing") {
    state.marketingPlayer = { ...state.player };
    state.mode = "sales";
    state.player = { ...state.sales.player };
  } else {
    state.mode = "marketing";
    state.player = { ...(state.marketingPlayer || { x: 1, y: 8 }) };
  }

  state.route = [];
  state.routeActive = false;
  state.routeTarget = null;
  state.activeSavePoint = null;
  dom.questionModal.classList.add("hidden");

  if (state.mode === "sales") {
    state.speaker = "Breeze Agent";
    state.message = "Stage 2 opened. Navigate the space pipeline, avoid deal-risk bombs, and close the deal.";
  } else {
    state.speaker = "Growth Gabby";
    state.message = "Back to the marketing journey. Sniff touchpoints and save the attribution inputs.";
  }

  updateUI();
}

function buildMap() {
  const tiles = Array.from({ length: MAP_H }, () => Array.from({ length: MAP_W }, () => "grass"));

  function set(x, y, type) {
    if (x >= 0 && y >= 0 && x < MAP_W && y < MAP_H) {
      tiles[y][x] = type;
    }
  }

  for (let x = 0; x < MAP_W; x += 1) {
    set(x, 0, "forest");
    set(x, MAP_H - 1, "forest");
  }

  for (let y = 0; y < MAP_H; y += 1) {
    set(0, y, "forest");
    set(MAP_W - 1, y, "forest");
  }

  for (let x = 1; x <= 22; x += 1) set(x, 8, "path");
  for (let y = 2; y <= 13; y += 1) set(3, y, "path");
  for (let y = 3; y <= 12; y += 1) set(10, y, "path");
  for (let y = 2; y <= 12; y += 1) set(17, y, "path");
  for (let x = 3; x <= 10; x += 1) set(x, 3, "path");
  for (let x = 10; x <= 17; x += 1) set(x, 5, "path");
  for (let x = 17; x <= 22; x += 1) set(x, 11, "path");
  for (let x = 6; x <= 17; x += 1) set(x, 12, "path");

  for (let y = 1; y <= 5; y += 1) {
    for (let x = 19; x <= 22; x += 1) set(x, y, "water");
  }

  for (let y = 12; y <= 14; y += 1) {
    for (let x = 1; x <= 4; x += 1) set(x, y, "water");
  }

  const forests = [
    [5, 5],
    [6, 5],
    [6, 6],
    [7, 6],
    [12, 2],
    [13, 2],
    [14, 2],
    [14, 3],
    [13, 9],
    [14, 9],
    [14, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [20, 13],
    [21, 13],
    [20, 14]
  ];

  forests.forEach(([x, y]) => set(x, y, "forest"));

  const rocks = [
    [11, 9],
    [12, 9],
    [11, 10],
    [15, 6],
    [16, 6],
    [2, 5],
    [4, 10]
  ];

  rocks.forEach(([x, y]) => set(x, y, "rock"));

  touchpoints.forEach((point) => {
    set(point.x, point.y, "plaza");
    set(point.x + 1, point.y, "path");
    set(point.x - 1, point.y, "path");
  });

  set(portal.x, portal.y, "plaza");
  set(18, 8, "path");
  set(19, 8, "path");
  set(20, 8, "path");
  set(21, 8, "path");

  savePoints.forEach((point) => {
    set(point.x, point.y, "plaza");
  });

  return tiles;
}

function tileAt(x, y) {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return "forest";
  return map[y][x];
}

function tileCost(x, y) {
  const tile = tileAt(x, y);
  if (tile === "forest" || tile === "water" || tile === "rock") return Infinity;
  if (tile === "grass") return 2;
  if (tile === "plaza") return 1;
  return 1;
}

function isPassable(x, y) {
  return Number.isFinite(tileCost(x, y));
}

function movePlayer(dx, dy) {
  if (state.mode === "sales") {
    moveSalesPlayer(dx, dy);
    return;
  }

  if (state.activeSavePoint) {
    return;
  }

  if (state.completed) {
    state.message = "The deal is converted. Reset to scout the journey again.";
    updateUI();
    return;
  }

  const nextX = state.player.x + dx;
  const nextY = state.player.y + dy;

  if (!isPassable(nextX, nextY)) {
    state.speaker = "Pathfinder";
    state.message = "That route is blocked. Try the open trail or reveal a smarter route.";
    updateUI();
    return;
  }

  state.player.x = nextX;
  state.player.y = nextY;
  state.marketingPlayer = { x: nextX, y: nextY };

  if (state.routeActive) {
    computeBestRoute(false);
  }

  checkTileInteraction();
  updateUI();
}

function moveSalesPlayer(dx, dy) {
  const sales = state.sales;
  if (sales.closed || sales.lost) {
    state.speaker = sales.closed ? "Breeze Agent" : "Deal Desk";
    state.message = sales.closed
      ? "The deal is closed. Reset Stage 2 to run the space pipeline again."
      : "The deal was lost. Reset Stage 2 and dodge the risk bombs earlier.";
    updateUI();
    return;
  }

  const nextX = sales.player.x + dx;
  const nextY = sales.player.y + dy;

  if (!isSalesPassable(nextX, nextY)) {
    state.speaker = "Space Pipeline";
    state.message = "Asteroid block ahead. Use the open sales lanes or ask Breeze for help.";
    updateUI();
    return;
  }

  sales.player.x = nextX;
  sales.player.y = nextY;

  if (state.routeActive) {
    computeSalesRoute(false);
  }

  checkSalesInteraction();
  updateUI();
}

function isSalesPassable(x, y) {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return false;
  return !salesBlocks.has(key(x, y));
}

function checkSalesInteraction() {
  const sales = state.sales;

  const sequence = salesSequences.find((item) => item.x === sales.player.x && item.y === sales.player.y);
  if (sequence && !sales.sequences.includes(sequence.id)) {
    collectSalesSequence(sequence);
    return;
  }

  if (sales.player.x === breezeAgent.x && sales.player.y === breezeAgent.y && !sales.agentCollected) {
    collectBreezeAgent();
    return;
  }

  const stage = dealStages.find((item) => item.x === sales.player.x && item.y === sales.player.y);
  if (stage && !sales.stages.includes(stage.id)) {
    progressDealStage(stage);
  }
}

function collectSalesSequence(sequence) {
  const sales = state.sales;
  sales.sequences.push(sequence.id);
  sales.dealProgress = Math.max(sales.dealProgress, sales.sequences.length * 14);
  state.speaker = sequence.label;
  state.message = `${sequence.insight} Lead score is now ${calculateJourneyModel().leadScore}.`;
  state.events.unshift({
    title: sequence.label,
    body: `${sequence.kind} collected. Smart deal progression recalculated.`
  });
  state.routeActive = true;
  computeSalesRoute(false);
}

function collectBreezeAgent() {
  const sales = state.sales;
  sales.agentCollected = true;
  sales.agentCharges = 2;
  sales.dealProgress = Math.max(sales.dealProgress, 18);
  state.speaker = "Breeze Agent";
  state.message = "Breeze Agent joined the deal room. Press B or Breeze to delay risk bombs and summarize next steps.";
  state.events.unshift({
    title: "Breeze Agent",
    body: "Agent assist unlocked with two charges for deal-risk control."
  });
}

function progressDealStage(stage) {
  const sales = state.sales;
  if (sales.sequences.length < stage.required) {
    state.speaker = stage.label;
    state.message = `${stage.label} needs ${stage.required} sequence signal${stage.required > 1 ? "s" : ""} before the deal can move forward.`;
    return;
  }

  sales.stages.push(stage.id);
  sales.dealProgress = Math.max(sales.dealProgress, stage.progress);
  state.speaker = stage.label;

  if (stage.id === "close") {
    closeSalesDeal();
    return;
  }

  state.message = `${stage.label} completed. Smart deal progression moved to ${sales.dealProgress}%.`;
  state.events.unshift({
    title: stage.label,
    body: `Deal advanced to ${sales.dealProgress}% with ${sales.sequences.length} sequence signals.`
  });
  computeSalesRoute(false);
}

function closeSalesDeal() {
  const sales = state.sales;
  sales.closed = true;
  sales.dealProgress = 100;
  state.routeActive = false;
  state.route = [];
  state.routeTarget = null;
  state.speaker = "Breeze Agent";
  state.message = "Deal closed. Sequences, smart progression, and Breeze Agent worked together before risk bombs could derail it.";
  state.events.unshift({
    title: "Closed Won",
    body: "Stage 2 complete. Breeze Agent helped protect the deal path."
  });
}

function useBreezeAgent() {
  if (state.mode !== "sales") return;
  const sales = state.sales;
  if (sales.closed || sales.lost) return;

  if (!sales.agentCollected) {
    state.speaker = "Breeze Agent";
    state.message = "Find the Breeze Agent sparkle on the space map to unlock deal assist.";
    updateUI();
    return;
  }

  if (sales.agentCharges <= 0) {
    state.speaker = "Breeze Agent";
    state.message = "Breeze charges are spent. Keep moving through the smart deal path.";
    updateUI();
    return;
  }

  sales.agentCharges -= 1;
  sales.agentUsed += 1;
  sales.dealProgress = Math.min(96, sales.dealProgress + 12);
  sales.bombs.forEach((bomb) => {
    bomb.explodeAt = Math.max(bomb.explodeAt, state.pulse + 5.5);
    bomb.explodingUntil = 0;
    bomb.hit = false;
  });
  state.speaker = "Breeze Agent";
  state.message = "Breeze delayed deal-risk bombs, summarized objections, and nudged the next best sales step.";
  state.events.unshift({
    title: "Breeze Assist",
    body: `Risk bombs delayed. Deal progression lifted to ${sales.dealProgress}%.`
  });
  computeSalesRoute(false);
  updateUI();
}

function checkTileInteraction() {
  const savePoint = savePoints.find((item) => item.x === state.player.x && item.y === state.player.y);
  if (savePoint && !state.saveAnswers[savePoint.id]) {
    openSavePoint(savePoint);
    return;
  }

  const point = touchpoints.find((item) => item.x === state.player.x && item.y === state.player.y);
  if (point && !state.collected.includes(point.id)) {
    collectTouchpoint(point);
    return;
  }

  if (state.player.x === portal.x && state.player.y === portal.y) {
    if (state.collected.length >= 3) {
      completeConversion();
      return;
    }

    state.speaker = "Conversion Portal";
    state.message = "The portal needs at least three journey signals before it can assign credit.";
    return;
  }

  const nearby = touchpoints.find(
    (item) =>
      !state.collected.includes(item.id) &&
      Math.abs(item.x - state.player.x) + Math.abs(item.y - state.player.y) <= 2
  );

  if (nearby) {
    state.speaker = "Pathfinder";
    state.message = `${nearby.label} is nearby. Add it to the journey to improve attribution confidence.`;
  }
}

function openSavePoint(savePoint) {
  const index = savePoints.findIndex((point) => point.id === savePoint.id) + 1;
  state.activeSavePoint = savePoint.id;
  state.speaker = "Save Point";
  state.message = `${savePoint.label} checkpoint found. Answer the question to improve the journey math.`;
  dom.questionTitle.textContent = savePoint.label;
  dom.questionProgress.textContent = `${index}/${savePoints.length}`;
  dom.questionText.textContent = savePoint.question;
  dom.questionAnswer.value = state.saveAnswers[savePoint.id] || "";
  dom.questionAnswer.placeholder = savePoint.placeholder;
  dom.questionModal.classList.remove("hidden");
  window.setTimeout(() => dom.questionAnswer.focus(), 0);
}

function closeSavePoint() {
  const savePoint = savePoints.find((point) => point.id === state.activeSavePoint);
  state.activeSavePoint = null;
  dom.questionModal.classList.add("hidden");
  if (savePoint) {
    state.speaker = "Save Point";
    state.message = `${savePoint.label} can be answered later. Keep sniffing the route.`;
  }
  updateUI();
}

function saveCheckpointAnswer() {
  const savePoint = savePoints.find((point) => point.id === state.activeSavePoint);
  if (!savePoint) return;

  const answer = dom.questionAnswer.value.trim() || "Not sure yet";
  const isNew = !state.saveAnswers[savePoint.id];
  state.saveAnswers[savePoint.id] = answer;
  state.activeSavePoint = null;
  dom.questionModal.classList.add("hidden");

  const model = calculateJourneyModel();
  state.speaker = "Growth Gabby";
  state.message = `${savePoint.label} saved. Lead score is now ${model.leadScore}.`;
  state.events.unshift({
    title: savePoint.label,
    body: isNew
      ? `Checkpoint answer added. ${savePoint.label} now affects lead score and revenue credit.`
      : `Checkpoint answer updated. ${savePoint.label} recalculated the journey.`
  });

  if (state.routeActive) {
    computeBestRoute(false);
  }

  updateUI();
}

function collectTouchpoint(point) {
  state.collected.push(point.id);
  const model = calculateJourneyModel();
  state.speaker = point.label;
  state.message = `${point.insight} Lead score is now ${model.leadScore}.`;
  state.events.unshift({
    title: point.label,
    body: `${point.kind} touch added. Lead score recalculated to ${model.leadScore}.`
  });
  state.routeActive = true;
  computeBestRoute(false);
}

function completeConversion() {
  state.completed = true;
  state.routeActive = false;
  state.route = [];
  state.routeTarget = null;
  state.speaker = "Sniffing Ops Lab";
  state.message =
    "Conversion reached. Multi-touch attribution now shares revenue credit across the journey instead of handing it to one touch.";
  state.events.unshift({
    title: "Conversion",
    body: "Revenue credit assigned across the collected path."
  });
}

function togglePathfinder() {
  if (state.mode === "sales") {
    toggleSalesPathfinder();
    return;
  }

  if (state.completed) return;
  state.routeActive = !state.routeActive;
  if (state.routeActive) {
    computeBestRoute(true);
  } else {
    state.route = [];
    state.routeTarget = null;
    state.speaker = "Pathfinder";
    state.message = "Route overlay paused.";
  }
  updateUI();
}

function toggleSalesPathfinder() {
  const sales = state.sales;
  if (sales.closed || sales.lost) return;
  state.routeActive = !state.routeActive;

  if (state.routeActive) {
    computeSalesRoute(true);
  } else {
    state.route = [];
    state.routeTarget = null;
    state.speaker = "Smart Deal Progression";
    state.message = "Smart route paused.";
  }

  updateUI();
}

function computeSalesRoute(showMessage) {
  const target = nextSalesObjective();
  state.routeTarget = target;

  if (!target) {
    state.route = [];
    state.routeScore = 0;
    return;
  }

  const path = findSalesPath(state.sales.player, target);
  state.route = path ? path.slice(1) : [];
  state.routeScore = state.route.length ? Math.max(12, Math.min(100, 112 - state.route.length * 3)) : 0;

  if (showMessage) {
    state.speaker = "Smart Deal Progression";
    state.message = `Route found. Best next step: ${target.label}.`;
  }
}

function nextSalesObjective() {
  const sales = state.sales;
  const nextStage = dealStages.find((stage) => !sales.stages.includes(stage.id));

  if (!sales.agentCollected && sales.sequences.length >= 1) {
    return { ...breezeAgent, label: "Breeze Agent" };
  }

  if (nextStage && sales.sequences.length >= nextStage.required) {
    return nextStage;
  }

  const nextSequence = salesSequences.find((sequence) => !sales.sequences.includes(sequence.id));
  if (nextSequence) return nextSequence;

  return nextStage || null;
}

function findSalesPath(start, goal) {
  const startKey = key(start.x, start.y);
  const goalKey = key(goal.x, goal.y);
  const open = [startKey];
  const cameFrom = new Map();
  const gScore = new Map([[startKey, 0]]);
  const fScore = new Map([[startKey, heuristic(start, goal)]]);

  while (open.length > 0) {
    open.sort((a, b) => (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity));
    const currentKey = open.shift();
    const current = fromKey(currentKey);

    if (currentKey === goalKey) {
      return reconstructPath(cameFrom, currentKey);
    }

    neighbors(current).forEach((neighbor) => {
      if (!isSalesPassable(neighbor.x, neighbor.y)) return;
      const neighborKey = key(neighbor.x, neighbor.y);
      const hazardCost = salesHazardCells().has(neighborKey) ? 6 : 1;
      const tentativeScore = (gScore.get(currentKey) ?? Infinity) + hazardCost;

      if (tentativeScore < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeScore);
        fScore.set(neighborKey, tentativeScore + heuristic(neighbor, goal));
        if (!open.includes(neighborKey)) open.push(neighborKey);
      }
    });
  }

  return null;
}

function salesHazardCells() {
  const cells = new Set();
  state.sales.bombs.forEach((bomb) => {
    if (bomb.explodeAt - state.pulse < 2.2 || bomb.explodingUntil > state.pulse) {
      blastCells(bomb).forEach((cell) => cells.add(key(cell.x, cell.y)));
    } else {
      cells.add(key(bomb.x, bomb.y));
    }
  });
  return cells;
}

function blastCells(bomb) {
  const cells = [{ x: bomb.x, y: bomb.y }];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  directions.forEach(([dx, dy]) => {
    for (let distance = 1; distance <= bomb.blast; distance += 1) {
      const x = bomb.x + dx * distance;
      const y = bomb.y + dy * distance;
      if (!isSalesPassable(x, y)) break;
      cells.push({ x, y });
    }
  });

  return cells;
}

function computeBestRoute(showMessage) {
  const start = { x: state.player.x, y: state.player.y };
  const remainingTouchpoints = touchpoints.filter((item) => !state.collected.includes(item.id));
  const remainingSavePoints = savePoints.filter((item) => !state.saveAnswers[item.id]);
  const remaining = [...remainingSavePoints, ...remainingTouchpoints];
  const route = [];
  const order = [];
  let current = start;
  let candidates = remaining.slice();

  while (candidates.length > 0) {
    let best = null;
    let bestPath = null;
    let bestScore = -Infinity;

    candidates.forEach((candidate) => {
      const path = findPath(current, candidate);
      if (!path) return;
      const distance = Math.max(path.length - 1, 1);
      const closingBoost = candidate.id === "call" && state.collected.length >= 2 ? 10 : 0;
      const score = (candidate.weight + closingBoost) / distance;
      if (score > bestScore) {
        best = candidate;
        bestPath = path;
        bestScore = score;
      }
    });

    if (!best || !bestPath) break;

    route.push(...bestPath.slice(1));
    order.push(best);
    current = { x: best.x, y: best.y };
    candidates = candidates.filter((candidate) => candidate.id !== best.id);
  }

  const futureTouchpointCount =
    state.collected.length + order.filter((item) => touchpoints.some((point) => point.id === item.id)).length;

  if (futureTouchpointCount >= 3 || order.length === 0) {
    const portalPath = findPath(current, portal);
    if (portalPath) route.push(...portalPath.slice(1));
  }

  state.route = route;
  state.routeTarget = order[0] || portal;
  state.routeScore = route.length ? Math.max(12, Math.min(100, 120 - route.length * 2.1)) : 0;

  if (showMessage) {
    const targetName = state.routeTarget.label || "Conversion";
    state.speaker = "Pathfinder";
    state.message = `Route found. Best next step: ${targetName}.`;
  }
}

function findPath(start, goal) {
  const startKey = key(start.x, start.y);
  const goalKey = key(goal.x, goal.y);
  const open = [startKey];
  const cameFrom = new Map();
  const gScore = new Map([[startKey, 0]]);
  const fScore = new Map([[startKey, heuristic(start, goal)]]);

  while (open.length > 0) {
    open.sort((a, b) => (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity));
    const currentKey = open.shift();
    const current = fromKey(currentKey);

    if (currentKey === goalKey) {
      return reconstructPath(cameFrom, currentKey);
    }

    neighbors(current).forEach((neighbor) => {
      const cost = tileCost(neighbor.x, neighbor.y);
      if (!Number.isFinite(cost)) return;

      const neighborKey = key(neighbor.x, neighbor.y);
      const tentativeScore = (gScore.get(currentKey) ?? Infinity) + cost;

      if (tentativeScore < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeScore);
        fScore.set(neighborKey, tentativeScore + heuristic(neighbor, goal));
        if (!open.includes(neighborKey)) open.push(neighborKey);
      }
    });
  }

  return null;
}

function reconstructPath(cameFrom, currentKey) {
  const path = [fromKey(currentKey)];
  let cursor = currentKey;

  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor);
    path.unshift(fromKey(cursor));
  }

  return path;
}

function neighbors(point) {
  return [
    { x: point.x + 1, y: point.y },
    { x: point.x - 1, y: point.y },
    { x: point.x, y: point.y + 1 },
    { x: point.x, y: point.y - 1 }
  ].filter((candidate) => candidate.x >= 0 && candidate.y >= 0 && candidate.x < MAP_W && candidate.y < MAP_H);
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function key(x, y) {
  return `${x},${y}`;
}

function fromKey(value) {
  const [x, y] = value.split(",").map(Number);
  return { x, y };
}

function calculateJourneyModel() {
  const numbers = {
    leads: numbersFromAnswer(state.saveAnswers.leads),
    budget: numbersFromAnswer(state.saveAnswers.budget),
    systems: numbersFromAnswer(state.saveAnswers.systems),
    dropout: numbersFromAnswer(state.saveAnswers.dropout)
  };

  const monthlyLeads = clamp(Math.round(numbers.leads[0] || 400), 25, 200000);
  const budget = clamp(Math.round(numbers.budget[0] || 12000), 0, 2000000);
  const conversionRate = clamp(numbers.budget[1] || findPercent(state.saveAnswers.budget) || 2.2, 0.1, 80);
  const systemsCount = clamp(extractSystemsCount(state.saveAnswers.systems, numbers.systems), 1, 12);
  const dropoutRate = clamp(numbers.dropout[0] || findPercent(state.saveAnswers.dropout) || 45, 0, 95);
  const answeredCount = Object.keys(state.saveAnswers).length;
  const touchpointScore = state.collected.reduce((sum, id) => {
    const point = touchpoints.find((item) => item.id === id);
    return sum + (point ? point.weight : 0);
  }, 0);
  const saveScore = savePoints.reduce((sum, point) => {
    if (!state.saveAnswers[point.id]) return sum;
    return sum + point.weight;
  }, 0);
  const sales = state.sales;
  const salesSequenceScore = sales
    ? sales.sequences.reduce((sum, id) => {
        const sequence = salesSequences.find((item) => item.id === id);
        return sum + (sequence ? sequence.weight : 0);
      }, 0)
    : 0;
  const salesStageScore = sales ? sales.stages.length * 11 + sales.agentUsed * 12 - Math.round((100 - sales.dealHealth) / 8) : 0;
  const qualityScore =
    Math.min(26, monthlyLeads / 65) +
    Math.min(24, budget / 2200) +
    Math.min(22, conversionRate * 4) +
    Math.min(18, systemsCount * 3) -
    Math.min(28, dropoutRate / 2.4);
  const leadScore = clamp(Math.round(20 + touchpointScore + saveScore + salesSequenceScore + salesStageScore + qualityScore), 0, 999);
  const reachableLeads = monthlyLeads * (1 - dropoutRate / 100);
  const expectedDeals = reachableLeads * (conversionRate / 100);
  const averageDealValue = 1450 + leadScore * 9;
  const salesLift = sales ? sales.dealProgress / 100 + sales.agentUsed * 0.04 : 0;
  const riskDrag = sales ? (100 - sales.dealHealth) / 250 : 0;
  const attributionLift = Math.max(0.4, 1 + state.collected.length * 0.08 + answeredCount * 0.05 + salesLift - riskDrag);
  const projectedRevenue = Math.max(
    1200,
    Math.round((expectedDeals * averageDealValue * attributionLift) / 100) * 100
  );

  return {
    monthlyLeads,
    budget,
    conversionRate,
    systemsCount,
    dropoutRate,
    answeredCount,
    leadScore,
    projectedRevenue
  };
}

function numbersFromAnswer(answer) {
  if (!answer) return [];
  const matches = answer.replace(/,/g, "").match(/\d+(\.\d+)?/g);
  return matches ? matches.map(Number).filter((value) => Number.isFinite(value)) : [];
}

function findPercent(answer) {
  if (!answer) return null;
  const match = answer.replace(/,/g, "").match(/(\d+(\.\d+)?)\s*%/);
  return match ? Number(match[1]) : null;
}

function extractSystemsCount(answer, numbers) {
  if (numbers.length) return Math.max(1, Math.round(numbers[0]));
  if (!answer) return 1;
  return answer
    .split(/,|\/|;|\+| and /i)
    .map((item) => item.trim())
    .filter(Boolean).length;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computeCredits() {
  const collectedPoints = state.collected.map((id) => touchpoints.find((point) => point.id === id));
  if (collectedPoints.length === 0) {
    return new Map(touchpoints.map((point) => [point.id, 0]));
  }

  const positionShares = new Map();
  const n = collectedPoints.length;

  if (n === 1) {
    positionShares.set(collectedPoints[0].id, 1);
  } else if (n === 2) {
    positionShares.set(collectedPoints[0].id, 0.5);
    positionShares.set(collectedPoints[1].id, 0.5);
  } else {
    collectedPoints.forEach((point, index) => {
      if (index === 0 || index === n - 1) {
        positionShares.set(point.id, 0.3);
      } else {
        positionShares.set(point.id, 0.4 / (n - 2));
      }
    });
  }

  const totalWeight = collectedPoints.reduce((sum, point) => sum + point.weight, 0);
  const raw = new Map();
  let rawTotal = 0;

  collectedPoints.forEach((point) => {
    const score = (positionShares.get(point.id) || 0) * 0.72 + (point.weight / totalWeight) * 0.28;
    raw.set(point.id, score);
    rawTotal += score;
  });

  return new Map(touchpoints.map((point) => [point.id, raw.has(point.id) ? raw.get(point.id) / rawTotal : 0]));
}

function activeRevenue() {
  const model = calculateJourneyModel();
  if (state.mode === "sales") {
    const sales = state.sales;
    if (sales.lost) return 0;
    if (sales.closed) return model.projectedRevenue;
    return Math.round(model.projectedRevenue * clamp(sales.dealProgress / 100, 0.08, 0.92) * (sales.dealHealth / 100));
  }
  if (state.completed) return model.projectedRevenue;
  const progress = state.collected.length / touchpoints.length;
  const answerBoost = model.answeredCount / savePoints.length;
  return Math.round(model.projectedRevenue * (0.12 + progress * 0.6 + answerBoost * 0.18));
}

function updateUI() {
  if (state.mode === "sales") {
    updateSalesUI();
    return;
  }

  const credits = computeCredits();
  const revenue = activeRevenue();
  const model = calculateJourneyModel();
  const collectedSet = new Set(state.collected);
  const answeredSet = new Set(Object.keys(state.saveAnswers));

  dom.primaryListTitle.textContent = "Touchpoints";
  dom.secondaryListTitle.textContent = "Save Points";
  dom.mathTitle.textContent = "Journey Math";
  dom.mixTitle.textContent = "Multi-Touch Mix";
  dom.stageButton.querySelector("span").textContent = "Sales Stage";
  dom.breezeButton.classList.remove("visible", "active");
  dom.dealScoreTotal.classList.remove("visible");

  dom.touchpointCount.textContent = `${state.collected.length}/${touchpoints.length}`;
  dom.touchpointList.innerHTML = touchpoints
    .map((point) => {
      const done = collectedSet.has(point.id);
      const credit = credits.get(point.id) || 0;
      return `
        <div class="touchpoint-row ${done ? "done" : ""}">
          <span class="touchpoint-dot" style="background:${point.color}"></span>
          <span>
            <span class="touchpoint-name">${point.label}</span>
            <span class="touchpoint-kind">${point.kind}</span>
          </span>
          <span class="touchpoint-value">${done ? `${Math.round(credit * 100)}%` : "--"}</span>
        </div>
      `;
    })
    .join("");

  dom.savePointCount.textContent = `${answeredSet.size}/${savePoints.length}`;
  dom.savePointList.innerHTML = savePoints
    .map((point, index) => {
      const done = answeredSet.has(point.id);
      return `
        <div class="savepoint-row ${done ? "done" : ""}">
          <span class="savepoint-icon">${done ? "OK" : index + 1}</span>
          <span>
            <span class="touchpoint-name">${point.label}</span>
            <span class="touchpoint-kind">${done ? "Saved" : "Question"}</span>
          </span>
          <span class="touchpoint-value">${done ? "+LS" : "--"}</span>
        </div>
      `;
    })
    .join("");

  dom.creditBars.innerHTML = touchpoints
    .map((point) => {
      const share = credits.get(point.id) || 0;
      const dollars = Math.round(revenue * share);
      return `
        <div class="credit-row">
          <div class="credit-head">
            <span>${point.label}</span>
            <span>${share > 0 ? `${formatMoney(dollars)} | ${Math.round(share * 100)}%` : "$0 | 0%"}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${share * 100}%;background:${point.color}"></div></div>
        </div>
      `;
    })
    .join("");

  dom.routeLength.textContent = state.routeActive && state.route.length ? `${state.route.length} tiles` : "-- tiles";
  const nextStep = state.completed ? "Complete" : state.routeTarget ? state.routeTarget.label : "Email";
  dom.nextBestStep.textContent = `Next best step: ${nextStep}`;
  dom.routeMeterFill.style.width = `${state.routeActive ? state.routeScore || 18 : 18}%`;
  dom.routeInsight.textContent = state.completed
    ? "Revenue credit is now assigned across the collected route."
    : state.routeActive
      ? "Pathfinder ranks touchpoints by signal value and distance."
      : "Press Pathfind to light the conversion route.";
  dom.pathfindButton.classList.toggle("active", state.routeActive);
  dom.pathfindButton.setAttribute("aria-pressed", String(state.routeActive));
  dom.revenueTotal.textContent = formatMoney(revenue);
  dom.leadScoreTotal.textContent = `LS ${model.leadScore}`;
  dom.journeyStatus.textContent = state.completed ? "Converted" : state.collected.length >= 3 ? "Ready" : "Exploring";
  dom.conversionRate.textContent = `${model.conversionRate.toFixed(1)}%`;
  dom.journeyMath.innerHTML = `
    <div class="math-row"><span>Leads/mo</span><strong>${model.monthlyLeads.toLocaleString("en-US")}</strong></div>
    <div class="math-row"><span>Budget</span><strong>${formatMoney(model.budget)}</strong></div>
    <div class="math-row"><span>Systems</span><strong>${model.systemsCount}</strong></div>
    <div class="math-row"><span>Drop-off</span><strong>${Math.round(model.dropoutRate)}%</strong></div>
  `;
  dom.modelName.textContent = "Position";
  dom.eventCount.textContent = String(state.events.length);
  dom.eventLog.innerHTML = state.events.length
    ? state.events
        .slice(0, 5)
        .map((event) => `<li><strong>${escapeHtml(event.title)}</strong><br>${escapeHtml(event.body)}</li>`)
        .join("")
    : "<li><strong>Trail opened</strong><br>Scout the route to begin the journey.</li>";
  dom.dialogueSpeaker.textContent = state.speaker;
  dom.dialogueText.textContent = state.message;
  dom.routeName.textContent = state.completed ? "Growth Gabby: Converted Journey" : "Growth Gabby's First Trail";
}

function updateSalesUI() {
  const sales = state.sales;
  const model = calculateJourneyModel();
  const revenue = activeRevenue();
  const collectedSequences = new Set(sales.sequences);
  const completedStages = new Set(sales.stages);
  const target = state.routeTarget || nextSalesObjective();

  dom.primaryListTitle.textContent = "Sequences";
  dom.secondaryListTitle.textContent = "Deal Stages";
  dom.mathTitle.textContent = "Deal Signals";
  dom.mixTitle.textContent = "Sequence Impact";
  dom.stageButton.querySelector("span").textContent = "Marketing Stage";
  dom.breezeButton.classList.add("visible");
  dom.breezeButton.classList.toggle("active", sales.agentCharges > 0);
  dom.dealScoreTotal.classList.add("visible");

  dom.touchpointCount.textContent = `${sales.sequences.length}/${salesSequences.length}`;
  dom.touchpointList.innerHTML = salesSequences
    .map((sequence) => {
      const done = collectedSequences.has(sequence.id);
      return `
        <div class="touchpoint-row ${done ? "done" : ""}">
          <span class="touchpoint-dot" style="background:${sequence.color}"></span>
          <span>
            <span class="touchpoint-name">${sequence.label}</span>
            <span class="touchpoint-kind">${sequence.kind}</span>
          </span>
          <span class="touchpoint-value">${done ? "+LS" : "--"}</span>
        </div>
      `;
    })
    .join("");

  dom.savePointCount.textContent = `${sales.stages.length}/${dealStages.length}`;
  dom.savePointList.innerHTML = dealStages
    .map((stage, index) => {
      const done = completedStages.has(stage.id);
      const locked = sales.sequences.length < stage.required;
      return `
        <div class="savepoint-row ${done ? "done" : ""}">
          <span class="savepoint-icon">${done ? "OK" : locked ? "!" : index + 1}</span>
          <span>
            <span class="touchpoint-name">${stage.label}</span>
            <span class="touchpoint-kind">${done ? "Advanced" : `${stage.required} seq needed`}</span>
          </span>
          <span class="touchpoint-value">${done ? `${stage.progress}%` : "--"}</span>
        </div>
      `;
    })
    .join("");

  dom.routeLength.textContent = state.routeActive && state.route.length ? `${state.route.length} tiles` : "-- tiles";
  dom.nextBestStep.textContent = `Next best step: ${sales.closed ? "Closed Won" : sales.lost ? "Reset Deal" : target ? target.label : "Close Deal"}`;
  dom.routeMeterFill.style.width = `${state.routeActive ? state.routeScore || 18 : sales.dealProgress}%`;
  dom.routeInsight.textContent = sales.lost
    ? "Deal-risk bombs exploded at the wrong moment. Reset to recover."
    : "Smart deal progression routes around timed deal-risk bombs.";
  dom.pathfindButton.classList.toggle("active", state.routeActive);
  dom.pathfindButton.setAttribute("aria-pressed", String(state.routeActive));
  dom.revenueTotal.textContent = formatMoney(revenue);
  dom.leadScoreTotal.textContent = `LS ${model.leadScore}`;
  dom.dealScoreTotal.textContent = `DS ${sales.dealScore}`;
  dom.journeyStatus.textContent = sales.lost ? "Deal Lost" : sales.closed ? "Closed Won" : "Selling";
  dom.conversionRate.textContent = `${sales.dealProgress}%`;
  dom.journeyMath.innerHTML = `
    <div class="math-row"><span>Deal score</span><strong>${sales.dealScore}</strong></div>
    <div class="math-row"><span>Deal health</span><strong>${sales.dealHealth}%</strong></div>
    <div class="math-row"><span>Progress</span><strong>${sales.dealProgress}%</strong></div>
    <div class="math-row"><span>Breeze</span><strong>${sales.agentCharges} charge${sales.agentCharges === 1 ? "" : "s"}</strong></div>
    <div class="math-row"><span>Risk bombs</span><strong>${sales.bombs.filter((bomb) => bomb.explodingUntil <= state.pulse).length}</strong></div>
  `;
  dom.modelName.textContent = "Smart";
  dom.creditBars.innerHTML = salesSequences
    .map((sequence) => {
      const done = collectedSequences.has(sequence.id);
      const share = done ? sequence.weight / salesSequences.reduce((sum, item) => sum + item.weight, 0) : 0;
      return `
        <div class="credit-row">
          <div class="credit-head">
            <span>${sequence.label}</span>
            <span>${done ? `${Math.round(share * 100)}% impact` : "Waiting"}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${done ? Math.max(18, share * 100) : 0}%;background:${sequence.color}"></div></div>
        </div>
      `;
    })
    .join("");
  dom.eventCount.textContent = String(state.events.length);
  dom.eventLog.innerHTML = state.events.length
    ? state.events
        .slice(0, 5)
        .map((event) => `<li><strong>${escapeHtml(event.title)}</strong><br>${escapeHtml(event.body)}</li>`)
        .join("")
    : "<li><strong>Space pipeline</strong><br>Dodge deal-risk bombs and sequence your way to close.</li>";
  dom.dialogueSpeaker.textContent = state.speaker;
  dom.dialogueText.textContent = state.message;
  dom.routeName.textContent = sales.closed ? "Stage 2: Closed Won Orbit" : sales.lost ? "Stage 2: Deal Lost Drift" : "Stage 2: Space Pipeline";
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function draw(timestamp) {
  state.pulse = timestamp / 1000;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  if (state.mode === "sales") {
    updateSalesTimers();
    drawSalesStage();
    requestAnimationFrame(draw);
    return;
  }

  drawMap();

  if (state.routeActive && state.route.length) {
    drawRoute();
  }

  savePoints.forEach(drawSavePoint);
  touchpoints.forEach(drawTouchpoint);
  drawPortal();
  drawPlayer();
  drawMiniLabels();

  requestAnimationFrame(draw);
}

function updateSalesTimers() {
  const sales = state.sales;
  if (sales.closed || sales.lost || state.activeSavePoint) return;

  sales.bombs.forEach((bomb, index) => {
    if (bomb.explodingUntil > state.pulse) {
      if (!bomb.hit && blastCells(bomb).some((cell) => cell.x === sales.player.x && cell.y === sales.player.y)) {
        bomb.hit = true;
        sales.dealScore = Math.max(0, sales.dealScore - 10);
        sales.dealHealth = Math.max(0, sales.dealHealth - 25);
        sales.dealProgress = Math.max(0, sales.dealProgress - 8);
        state.speaker = "Deal Risk";
        state.message = `A risk bomb exploded near the opportunity. Deal score dropped by 10 to ${sales.dealScore}.`;
        state.events.unshift({
          title: "Risk Bomb",
          body: `Explosion hit the deal path. Deal score -10, now ${sales.dealScore}. Health now ${sales.dealHealth}%.`
        });
        if (sales.dealHealth <= 0) {
          loseSalesDeal();
        }
        updateUI();
      }
      return;
    }

    if (bomb.explodingUntil && bomb.explodingUntil <= state.pulse) {
      sales.bombs[index] = createSalesBombAtRandom(state.pulse);
      if (state.routeActive) computeSalesRoute(false);
      return;
    }

    if (bomb.explodeAt <= state.pulse) {
      bomb.explodingUntil = state.pulse + 0.72;
      bomb.hit = false;
      if (state.routeActive) computeSalesRoute(false);
    }
  });
}

function createSalesBombAtRandom(now) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const x = 2 + Math.floor(Math.random() * (MAP_W - 4));
    const y = 2 + Math.floor(Math.random() * (MAP_H - 4));
    const cell = key(x, y);
    const tooClose = Math.abs(x - state.sales.player.x) + Math.abs(y - state.sales.player.y) < 4;
    if (salesBlocks.has(cell) || salesSafeCells.has(cell) || tooClose) continue;
    return createSalesBomb(x, y, now);
  }

  return createSalesBomb(20, 12, now);
}

function loseSalesDeal() {
  const sales = state.sales;
  sales.lost = true;
  sales.dealHealth = 0;
  sales.dealProgress = 0;
  state.routeActive = false;
  state.route = [];
  state.routeTarget = null;
  state.speaker = "Deal Desk";
  state.message = "Deal lost. The risk bombs were left unmanaged for too long.";
  state.events.unshift({
    title: "Closed Lost",
    body: "Deal health reached 0 after timed risk explosions."
  });
}

function drawSalesStage() {
  drawSpaceBackground();

  if (state.routeActive && state.route.length) {
    drawRoute();
  }

  drawSalesBlocks();
  salesSequences.forEach(drawSalesSequence);
  dealStages.forEach(drawDealStage);
  drawBreezeAgentPickup();
  state.sales.bombs.forEach(drawSalesBomb);
  const marketingPosition = { ...state.player };
  state.player.x = state.sales.player.x;
  state.player.y = state.sales.player.y;
  drawPlayer();
  state.player = marketingPosition;
  drawSalesLabels();
}

function drawSpaceBackground() {
  ctx.fillStyle = "#07131f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < MAP_H; y += 1) {
    for (let x = 0; x < MAP_W; x += 1) {
      const px = x * TILE;
      const py = y * TILE;
      const stamp = hash(x + 17, y + 31);
      ctx.fillStyle = stamp % 2 === 0 ? "#0c1d31" : "#0a1828";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = "rgba(84,217,255,0.08)";
      ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      if (stamp % 7 === 0) {
        ctx.fillStyle = stamp % 14 === 0 ? colors.yellow : "#b7d9ff";
        ctx.fillRect(px + 7 + (stamp % 12), py + 5 + (stamp % 15), 2, 2);
      }
    }
  }

  ctx.fillStyle = "rgba(84,217,255,0.08)";
  ctx.fillRect(0, 7 * TILE, canvas.width, TILE);
  ctx.fillRect(10 * TILE, 0, TILE, canvas.height);
}

function drawSalesBlocks() {
  salesBlocks.forEach((cell) => {
    const { x, y } = fromKey(cell);
    const px = x * TILE;
    const py = y * TILE;
    ctx.fillStyle = colors.ink;
    ctx.fillRect(px + 4, py + 5, 24, 22);
    ctx.fillStyle = "#4c5a72";
    ctx.fillRect(px + 6, py + 7, 20, 18);
    ctx.fillStyle = "#7b879b";
    ctx.fillRect(px + 9, py + 8, 9, 4);
    ctx.fillStyle = "#303a4c";
    ctx.fillRect(px + 18, py + 18, 6, 5);
  });
}

function drawSalesSequence(sequence) {
  if (state.sales.sequences.includes(sequence.id)) return;
  const x = sequence.x * TILE;
  const y = sequence.y * TILE;
  const bob = Math.round(Math.sin(state.pulse * 4 + sequence.x) * 2);

  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 6, y + 10 + bob, 20, 14);
  ctx.fillStyle = sequence.color;
  ctx.fillRect(x + 8, y + 12 + bob, 16, 10);
  ctx.fillStyle = colors.paper;
  ctx.fillRect(x + 10, y + 14 + bob, 12, 2);
  ctx.fillRect(x + 10, y + 18 + bob, 8, 2);
}

function drawDealStage(stage) {
  const x = stage.x * TILE;
  const y = stage.y * TILE;
  const done = state.sales.stages.includes(stage.id);
  const unlocked = state.sales.sequences.length >= stage.required;

  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 3, y + 6, 26, 21);
  ctx.fillStyle = done ? colors.green : unlocked ? stage.color : "#3d4a5f";
  ctx.fillRect(x + 5, y + 8, 22, 17);
  ctx.fillStyle = done ? colors.yellow : colors.paper;
  ctx.fillRect(x + 9, y + 12, 14, 3);
  ctx.fillRect(x + 9, y + 18, 10, 3);
}

function drawBreezeAgentPickup() {
  const sales = state.sales;
  if (sales.agentCollected) return;
  const x = breezeAgent.x * TILE;
  const y = breezeAgent.y * TILE;
  const bob = Math.round(Math.sin(state.pulse * 5) * 2);

  ctx.fillStyle = "rgba(255,47,112,0.24)";
  ctx.fillRect(x + 4, y + 4 + bob, 24, 24);
  drawBreezeSpark(x + 15, y + 15 + bob, 2);
}

function drawSalesBomb(bomb) {
  const x = bomb.x * TILE;
  const y = bomb.y * TILE;

  if (bomb.explodingUntil > state.pulse) {
    drawSalesExplosion(bomb);
    return;
  }

  const remaining = Math.max(0, bomb.explodeAt - state.pulse);
  const hot = remaining < 1.6;
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 8, y + 9, 17, 17);
  ctx.fillStyle = hot ? colors.coral : "#45556f";
  ctx.fillRect(x + 10, y + 11, 13, 13);
  ctx.fillStyle = colors.yellow;
  ctx.fillRect(x + 18, y + 6, 4, 5);
  ctx.fillStyle = hot ? colors.yellow : colors.cyan;
  for (let i = 0; i < Math.min(4, Math.ceil(remaining)); i += 1) {
    ctx.fillRect(x + 9 + i * 4, y + 27, 3, 3);
  }
}

function drawSalesExplosion(bomb) {
  ctx.save();
  ctx.globalAlpha = 0.88;
  blastCells(bomb).forEach((cell) => {
    const x = cell.x * TILE;
    const y = cell.y * TILE;
    ctx.fillStyle = colors.coral;
    ctx.fillRect(x + 3, y + 3, 26, 26);
    ctx.fillStyle = colors.yellow;
    ctx.fillRect(x + 9, y + 9, 14, 14);
  });
  ctx.restore();
}

function drawSalesLabels() {
  drawMapLabel(2, 11, "Intro Seq");
  drawMapLabel(7, 9, "Follow-up");
  drawMapLabel(11, 3, "Breeze");
  drawMapLabel(13, 5, "MAP");
  drawMapLabel(18, 10, "Exec Seq");
  drawMapLabel(4, 12, "Qualified");
  drawMapLabel(10, 8, "Demo");
  drawMapLabel(15, 4, "Proposal");
  drawMapLabel(20, 1, "Close");
}

function drawMap() {
  for (let y = 0; y < MAP_H; y += 1) {
    for (let x = 0; x < MAP_W; x += 1) {
      drawTile(x, y, tileAt(x, y));
    }
  }
}

function drawTile(x, y, type) {
  const px = x * TILE;
  const py = y * TILE;
  const stamp = hash(x, y);

  if (type === "grass") {
    ctx.fillStyle = stamp % 3 === 0 ? colors.grass2 : colors.grass;
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = "rgba(23,33,43,0.16)";
    if (stamp % 2 === 0) ctx.fillRect(px + 8, py + 21, 7, 3);
    if (stamp % 5 === 0) ctx.fillRect(px + 22, py + 10, 4, 8);
  }

  if (type === "path" || type === "plaza") {
    ctx.fillStyle = type === "plaza" ? colors.plaza : colors.path;
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = colors.path2;
    if (stamp % 2 === 0) ctx.fillRect(px + 5, py + 8, 5, 3);
    if (stamp % 3 === 0) ctx.fillRect(px + 20, py + 22, 6, 3);
  }

  if (type === "water") {
    ctx.fillStyle = colors.water;
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = colors.water2;
    ctx.fillRect(px + ((stamp % 4) * 3), py + 10, 14, 3);
    ctx.fillRect(px + 12, py + 22, 12, 3);
  }

  if (type === "forest") {
    ctx.fillStyle = "#27663f";
    ctx.fillRect(px, py, TILE, TILE);
    drawTree(px + 4, py + 5, stamp % 2 === 0);
  }

  if (type === "rock") {
    ctx.fillStyle = "#687383";
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = colors.rock;
    ctx.fillRect(px + 6, py + 10, 18, 13);
    ctx.fillStyle = "#8d98a7";
    ctx.fillRect(px + 9, py + 8, 10, 4);
  }

  ctx.strokeStyle = "rgba(23,33,43,0.12)";
  ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
}

function drawTree(px, py, tall) {
  ctx.fillStyle = "#6b4a2f";
  ctx.fillRect(px + 11, py + 16, 6, 10);
  ctx.fillStyle = tall ? colors.forest2 : colors.forest;
  ctx.fillRect(px + 5, py + 8, 18, 12);
  ctx.fillRect(px + 9, py + 3, 11, 10);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(px + 8, py + 8, 4, 4);
}

function drawRoute() {
  const points = [{ x: state.player.x, y: state.player.y }, ...state.route];
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = colors.cyan;
  ctx.shadowColor = "rgba(84,217,255,0.7)";
  ctx.shadowBlur = 14;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = -state.pulse * 18;
  ctx.beginPath();
  points.forEach((point, index) => {
    const cx = point.x * TILE + TILE / 2;
    const cy = point.y * TILE + TILE / 2;
    if (index === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
  ctx.fillStyle = colors.cyan;
  points.filter((_, index) => index % 3 === 0).forEach((point) => {
    ctx.fillRect(point.x * TILE + 13, point.y * TILE + 13, 6, 6);
  });
  ctx.restore();
}

function drawSavePoint(point) {
  const x = point.x * TILE;
  const y = point.y * TILE;
  const done = Boolean(state.saveAnswers[point.id]);
  const glow = 0.35 + Math.sin(state.pulse * 4 + point.x) * 0.16;

  ctx.save();
  ctx.globalAlpha = done ? 0.9 : 1;
  ctx.fillStyle = `rgba(255,216,102,${done ? glow : 0.18})`;
  ctx.fillRect(x + 5, y + 5, 22, 22);
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 7, y + 8, 18, 18);
  ctx.fillStyle = done ? colors.yellow : "#35516c";
  ctx.fillRect(x + 9, y + 10, 14, 14);
  ctx.fillStyle = done ? colors.ink : colors.cyan;
  ctx.fillRect(x + 12, y + 12, 8, 3);
  ctx.fillRect(x + 12, y + 18, 8, 3);
  ctx.fillStyle = done ? colors.green : colors.paper;
  ctx.fillRect(x + 20, y + 9, 3, 5);
  ctx.restore();
}

function drawTouchpoint(point) {
  const x = point.x * TILE;
  const y = point.y * TILE;
  const done = state.collected.includes(point.id);
  const bob = Math.round(Math.sin(state.pulse * 4 + point.x) * 2);

  ctx.save();
  ctx.globalAlpha = done ? 0.72 : 1;

  if (point.id === "email") drawMailbox(x, y, point.color);
  if (point.id === "ads") drawBillboard(x, y, point.color);
  if (point.id === "webinar") drawTent(x, y, point.color);
  if (point.id === "community") drawReviewStand(x, y, point.color);
  if (point.id === "call") drawPhoneBooth(x, y, point.color);

  drawCrystal(x + 12, y + 2 + bob, done ? "#d7e2ea" : point.color);

  if (done) {
    ctx.fillStyle = colors.ink;
    ctx.fillRect(x + 21, y + 4, 8, 8);
    ctx.fillStyle = colors.yellow;
    ctx.fillRect(x + 23, y + 7, 2, 2);
    ctx.fillRect(x + 25, y + 5, 2, 2);
  }

  ctx.restore();
}

function drawMailbox(x, y, color) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 7, y + 19, 18, 8);
  ctx.fillRect(x + 13, y + 24, 5, 6);
  ctx.fillStyle = color;
  ctx.fillRect(x + 8, y + 14, 16, 11);
  ctx.fillStyle = colors.paper;
  ctx.fillRect(x + 11, y + 17, 9, 5);
}

function drawBillboard(x, y, color) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 8, y + 10, 18, 11);
  ctx.fillRect(x + 11, y + 21, 4, 8);
  ctx.fillRect(x + 20, y + 21, 4, 8);
  ctx.fillStyle = color;
  ctx.fillRect(x + 9, y + 11, 16, 9);
  ctx.fillStyle = colors.paper;
  ctx.fillRect(x + 12, y + 14, 9, 3);
}

function drawTent(x, y, color) {
  ctx.fillStyle = colors.ink;
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 26);
  ctx.lineTo(x + 16, y + 9);
  ctx.lineTo(x + 27, y + 26);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 25);
  ctx.lineTo(x + 16, y + 11);
  ctx.lineTo(x + 25, y + 25);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c85d42";
  ctx.fillRect(x + 15, y + 18, 3, 7);
}

function drawReviewStand(x, y, color) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 7, y + 13, 19, 15);
  ctx.fillStyle = color;
  ctx.fillRect(x + 8, y + 14, 17, 12);
  ctx.fillStyle = colors.paper;
  ctx.fillRect(x + 11, y + 17, 4, 4);
  ctx.fillRect(x + 17, y + 17, 4, 4);
}

function drawPhoneBooth(x, y, color) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 10, y + 8, 14, 22);
  ctx.fillStyle = color;
  ctx.fillRect(x + 12, y + 10, 10, 18);
  ctx.fillStyle = colors.paper;
  ctx.fillRect(x + 14, y + 13, 6, 6);
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 18, y + 22, 2, 3);
}

function drawCrystal(x, y, color) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 3, y, 6, 2);
  ctx.fillRect(x + 1, y + 2, 10, 6);
  ctx.fillRect(x + 3, y + 8, 6, 3);
  ctx.fillStyle = color;
  ctx.fillRect(x + 4, y + 1, 4, 2);
  ctx.fillRect(x + 2, y + 3, 8, 4);
  ctx.fillRect(x + 4, y + 7, 4, 2);
}

function drawPortal() {
  const x = portal.x * TILE;
  const y = portal.y * TILE;
  const active = state.collected.length >= 3;
  const glow = active ? 0.52 + Math.sin(state.pulse * 5) * 0.18 : 0.24;

  ctx.save();
  ctx.globalAlpha = active ? 1 : 0.65;
  ctx.fillStyle = `rgba(84,217,255,${glow})`;
  ctx.fillRect(x + 5, y + 7, 22, 20);
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 4, y + 8, 5, 20);
  ctx.fillRect(x + 23, y + 8, 5, 20);
  ctx.fillRect(x + 8, y + 5, 16, 5);
  ctx.fillStyle = colors.coral;
  ctx.fillRect(x + 7, y + 10, 4, 18);
  ctx.fillRect(x + 21, y + 10, 4, 18);
  ctx.fillRect(x + 10, y + 7, 12, 4);
  ctx.fillStyle = active ? colors.yellow : "#8ca1ad";
  ctx.fillRect(x + 14, y + 13, 4, 4);
  ctx.fillRect(x + 12, y + 15, 8, 4);
  ctx.fillRect(x + 14, y + 19, 4, 4);
  ctx.restore();
}

function drawPlayer() {
  const x = state.player.x * TILE;
  const y = state.player.y * TILE;
  const bob = Math.round(Math.sin(state.pulse * 6) * 1);
  const score = calculateJourneyModel().leadScore;

  drawLeadScoreBoard(x, y, score);

  // Growth Gabby is an original fire-lizard mascot with a Breeze-style spark in the tail flame.
  ctx.fillStyle = "rgba(23,33,43,0.25)";
  ctx.fillRect(x + 7, y + 26, 19, 5);

  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 22, y + 17 + bob, 7, 4);
  ctx.fillStyle = colors.orange;
  ctx.fillRect(x + 21, y + 18 + bob, 7, 3);
  drawTailFlame(x + 27, y + 15 + bob);

  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 10, y + 10 + bob, 13, 16);
  ctx.fillRect(x + 8, y + 24 + bob, 5, 5);
  ctx.fillRect(x + 20, y + 24 + bob, 5, 5);

  ctx.fillStyle = colors.orange;
  ctx.fillRect(x + 11, y + 9 + bob, 11, 17);
  ctx.fillRect(x + 9, y + 13 + bob, 15, 8);
  ctx.fillStyle = "#ffd3a3";
  ctx.fillRect(x + 13, y + 16 + bob, 7, 9);

  ctx.fillStyle = colors.ink;
  ctx.fillRect(x + 10, y + 5 + bob, 13, 10);
  ctx.fillRect(x + 8, y + 8 + bob, 5, 5);
  ctx.fillStyle = "#ff9e48";
  ctx.fillRect(x + 11, y + 4 + bob, 11, 10);
  ctx.fillRect(x + 9, y + 8 + bob, 15, 5);
  ctx.fillStyle = "#fff0cf";
  ctx.fillRect(x + 10, y + 11 + bob, 7, 3);
  ctx.fillStyle = colors.cyan;
  ctx.fillRect(x + 18, y + 8 + bob, 2, 2);
  ctx.fillStyle = "#ffcc7b";
  ctx.fillRect(x + 11, y + 2 + bob, 3, 3);
  ctx.fillRect(x + 17, y + 2 + bob, 3, 3);
}

function drawLeadScoreBoard(x, y, score) {
  const label = `LS ${score}`;
  const boardWidth = Math.max(38, label.length * 7);
  const boardX = clamp(x + 16 - boardWidth / 2, 2, canvas.width - boardWidth - 2);
  const boardY = Math.max(2, y - 14);

  ctx.fillStyle = colors.ink;
  ctx.fillRect(boardX - 2, boardY - 2, boardWidth + 4, 13);
  ctx.fillStyle = colors.yellow;
  ctx.fillRect(boardX, boardY, boardWidth, 9);
  ctx.fillStyle = colors.ink;
  ctx.font = "8px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "top";
  ctx.fillText(label, boardX + 4, boardY + 1);
}

function drawTailFlame(x, y) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(x - 3, y - 5, 8, 13);
  ctx.fillStyle = colors.coral;
  ctx.fillRect(x - 2, y - 4, 6, 11);
  ctx.fillStyle = colors.yellow;
  ctx.fillRect(x, y - 2, 3, 7);
  drawBreezeSpark(x + 1, y + 1, 1);
}

function drawBreezeSpark(x, y, scale) {
  ctx.fillStyle = "#fff6d8";
  ctx.fillRect(x - 2 * scale, y, 5 * scale, 1 * scale);
  ctx.fillRect(x, y - 2 * scale, 1 * scale, 5 * scale);
  ctx.fillStyle = colors.pink;
  ctx.fillRect(x + 3 * scale, y + 1 * scale, 3 * scale, 1 * scale);
  ctx.fillRect(x + 4 * scale, y, 1 * scale, 3 * scale);
}

function drawMiniLabels() {
  drawMapLabel(1, 7, "Save 1");
  drawMapLabel(2, 1, "Email");
  drawMapLabel(9, 4, "Ads");
  drawMapLabel(15, 4, "Webinar");
  drawMapLabel(9, 7, "Save 2");
  drawMapLabel(16, 7, "Save 3");
  drawMapLabel(5, 11, "Review");
  drawMapLabel(18, 10, "Sales Call");
  drawMapLabel(18, 7, "Save 4");
  drawMapLabel(20, 6, "Conversion");
}

function drawMapLabel(x, y, text) {
  const px = x * TILE;
  const py = y * TILE;
  const width = Math.min(92, text.length * 6 + 10);
  ctx.fillStyle = "rgba(23,33,43,0.8)";
  ctx.fillRect(px, py, width, 14);
  ctx.fillStyle = colors.paper;
  ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "top";
  ctx.fillText(text, px + 5, py + 3);
}

function hash(x, y) {
  return Math.abs((x * 73856093) ^ (y * 19349663)) % 101;
}

dom.pathfindButton.addEventListener("click", togglePathfinder);
dom.touchPathfindButton.addEventListener("click", togglePathfinder);
dom.resetButton.addEventListener("click", resetGame);
dom.stageButton.addEventListener("click", switchStage);
dom.breezeButton.addEventListener("click", useBreezeAgent);
dom.questionSaveButton.addEventListener("click", saveCheckpointAnswer);
dom.questionLaterButton.addEventListener("click", closeSavePoint);

document.addEventListener("keydown", (event) => {
  const keyName = event.key.toLowerCase();
  if (state.activeSavePoint) {
    if (keyName === "escape") {
      event.preventDefault();
      closeSavePoint();
    }
    return;
  }

  const moves = {
    arrowup: [0, -1],
    w: [0, -1],
    arrowdown: [0, 1],
    s: [0, 1],
    arrowleft: [-1, 0],
    a: [-1, 0],
    arrowright: [1, 0],
    d: [1, 0]
  };

  if (moves[keyName]) {
    event.preventDefault();
    movePlayer(moves[keyName][0], moves[keyName][1]);
  }

  if (keyName === "p") {
    event.preventDefault();
    togglePathfinder();
  }

  if (keyName === "b") {
    event.preventDefault();
    useBreezeAgent();
  }
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("pointerdown", () => {
    const dir = button.dataset.dir;
    if (dir === "up") movePlayer(0, -1);
    if (dir === "down") movePlayer(0, 1);
    if (dir === "left") movePlayer(-1, 0);
    if (dir === "right") movePlayer(1, 0);
  });
});

canvas.addEventListener("click", (event) => {
  if (state.activeSavePoint) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor(((event.clientX - rect.left) * scaleX) / TILE);
  const y = Math.floor(((event.clientY - rect.top) * scaleY) / TILE);

  if (state.mode === "sales") {
    if (!isSalesPassable(x, y) || state.sales.closed || state.sales.lost) return;

    const path = findSalesPath(state.sales.player, { x, y });
    if (path && path.length > 1) {
      state.routeActive = true;
      state.route = path.slice(1);
      state.routeTarget = { x, y, label: "Pinned tile" };
      state.routeScore = Math.max(12, Math.min(100, 112 - state.route.length * 3));
      state.speaker = "Smart Deal Progression";
      state.message = "Pinned sales route ready. Watch the timers before crossing a bomb lane.";
      updateUI();
    }
    return;
  }

  if (!isPassable(x, y) || state.completed) return;

  const path = findPath(state.player, { x, y });
  if (path && path.length > 1) {
    state.routeActive = true;
    state.route = path.slice(1);
    state.routeTarget = { x, y, label: "Pinned tile" };
    state.routeScore = Math.max(12, Math.min(100, 120 - state.route.length * 2.1));
    state.speaker = "Pathfinder";
    state.message = "Pinned route ready. Follow the lit trail or press Pathfind for the conversion route.";
    updateUI();
  }
});

computeBestRoute(false);
updateUI();
requestAnimationFrame(draw);
