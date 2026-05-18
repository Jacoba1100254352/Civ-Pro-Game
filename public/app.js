import {
  ATTACK_CARDS,
  CASES,
  MOTION_CARDS,
  PHASES,
  SOURCES,
  TOPIC_MODULES,
  TUTORIAL_STEPS
} from "./data.js";
import { runRuleTests } from "./rule-tests.js";
import {
  activeByTopic,
  allEvidenceCollected,
  clone,
  evaluateAttack,
  formatMoney,
  hasFederalSmj,
  missingEvidence,
  resistanceLabel,
  statusFacts,
  toolName,
  withInstance
} from "./rules.js";

const DEFAULT_TOPICS = new Set(TOPIC_MODULES.filter((item) => item.default).map((item) => item.id));
const HAND_LIMITS = { attacks: 6, motions: 8 };
const state = {
  players: [
    { name: "Player 1", score: 0, dismissed: 0 },
    { name: "Player 2", score: 0, dismissed: 0 }
  ],
  round: 1,
  plaintiff: 0,
  defense: 1,
  phase: "claim",
  decks: { claims: [], attacks: [], motions: [] },
  hands: { claims: [], attacks: [], motions: [] },
  discards: { attacks: [], motions: [] },
  resources: { plaintiff: 5, defense: 4 },
  activeCase: null,
  selectedDefendant: null,
  docket: [],
  pendingAttack: null,
  attackCount: 0,
  maxAttacks: 2,
  timer: null,
  deadline: null,
  secondsLeft: null,
  sequence: 1,
  settings: {
    activeTopics: new Set(DEFAULT_TOPICS),
    noTimer: false,
    examMode: false,
    showExplanations: true
  },
  tutorial: {
    enabled: false,
    step: 0
  },
  judge: {
    tone: "neutral",
    title: "File a claim to start",
    body: "Pick one case from the claim hand. Then choose the defendant you want to sue and defend the filing through threshold attacks, discovery, and summary judgment.",
    cite: "This prototype abstracts the 1L pretrial sequence into competitive card play.",
    revealed: true
  }
};

const els = {};

function init() {
  bindElements();
  bindEvents();
  renderSettings();
  newGame();
}

function bindElements() {
  [
    "player-one-label",
    "player-one-score",
    "player-two-label",
    "player-two-score",
    "timer-card",
    "timer-label",
    "timer-value",
    "new-game-button",
    "tutorial-button",
    "print-button",
    "test-button",
    "study-mode",
    "phase-list",
    "round-value",
    "roles-value",
    "resource-panel",
    "tutorial-panel",
    "topic-toggles",
    "mode-toggles",
    "jurisdiction-preset",
    "discovery-preset",
    "claim-hand",
    "active-case",
    "draw-attack-button",
    "draw-motion-button",
    "attack-hand",
    "motion-hand",
    "discovery-list",
    "judge-output",
    "source-list",
    "print-deck"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els["new-game-button"].addEventListener("click", () => {
    state.tutorial.enabled = false;
    newGame();
  });
  els["tutorial-button"].addEventListener("click", startTutorial);
  els["print-button"].addEventListener("click", printCards);
  els["test-button"].addEventListener("click", showRuleTests);
  els["draw-attack-button"].addEventListener("click", () => drawToHand("attacks", 1, HAND_LIMITS.attacks));
  els["draw-motion-button"].addEventListener("click", () => drawToHand("motions", 1, HAND_LIMITS.motions));
  els["study-mode"].addEventListener("change", () => {
    if (els["study-mode"].checked) {
      stopTimer();
      setJudge("neutral", "Study mode enabled", "Timers are paused. Talk through the rule before choosing a card.", "Classroom review mode.");
    }
    render();
  });
  els["jurisdiction-preset"].addEventListener("click", () => {
    state.settings.activeTopics = new Set(["jurisdiction", "service", "joinder"]);
    state.tutorial.enabled = false;
    renderSettings();
    newGame();
  });
  els["discovery-preset"].addEventListener("click", () => {
    state.settings.activeTopics = new Set(["jurisdiction", "discovery"]);
    state.tutorial.enabled = false;
    renderSettings();
    newGame();
  });
}

function newGame() {
  stopTimer();
  state.players = [
    { name: "Player 1", score: 0, dismissed: 0 },
    { name: "Player 2", score: 0, dismissed: 0 }
  ];
  state.round = 1;
  state.plaintiff = 0;
  state.defense = 1;
  buildDecks();
  state.hands.attacks = [];
  state.hands.motions = [];
  state.discards.attacks = [];
  state.discards.motions = [];
  drawToHand("attacks", 5, HAND_LIMITS.attacks, false);
  drawToHand("motions", 7, HAND_LIMITS.motions, false);
  startRound();
}

function startTutorial() {
  state.settings.noTimer = true;
  state.settings.showExplanations = true;
  state.settings.examMode = false;
  state.settings.activeTopics = new Set(["jurisdiction", "service", "joinder", "discovery"]);
  state.tutorial.enabled = true;
  state.tutorial.step = 0;
  els["study-mode"].checked = true;
  renderSettings();
  newGame();
  setJudge("neutral", "Tutorial started", "Follow the tutorial panel from filing through discovery and trial readiness.", "Tutorial mode uses the same rules with timers paused.");
  render();
}

function buildDecks() {
  state.decks.claims = shuffle(activeByTopic(CASES, state.settings.activeTopics).map(clone));
  state.decks.attacks = shuffle(activeByTopic(ATTACK_CARDS, state.settings.activeTopics).map(clone));
  state.decks.motions = shuffle(activeByTopic(MOTION_CARDS, state.settings.activeTopics).map(clone));
}

function startRound() {
  stopTimer();
  state.phase = "claim";
  state.resources = { plaintiff: 5, defense: 4 };
  state.activeCase = null;
  state.selectedDefendant = null;
  state.docket = [];
  state.pendingAttack = null;
  state.attackCount = 0;
  state.maxAttacks = 2;
  state.hands.claims = drawCards("claims", 3);
  drawToHand("attacks", 2, HAND_LIMITS.attacks, false);
  drawToHand("motions", 2, HAND_LIMITS.motions, false);
  if (state.tutorial.enabled) seedTutorialHands();
  setJudge(
    "neutral",
    `${state.players[state.plaintiff].name} is plaintiff`,
    "File one claim. The defense then has a short threshold window to attack jurisdiction, service, venue, pleading, removal, joinder, supplemental jurisdiction, or preview modules.",
    "The game treats each round as a fresh civil action."
  );
  render();
}

function seedTutorialHands() {
  state.hands.claims = [withInstance(CASES.find((item) => item.id === "tire-failure"), state.sequence++)];
  state.hands.attacks = ATTACK_CARDS.filter((card) => ["pj", "remove", "summary-judgment"].includes(card.id)).map((card) => withInstance(card, state.sequence++));
  state.hands.motions = MOTION_CARDS.filter((card) =>
    ["notice-deposition", "request-production", "motion-compel", "expert-disclosure", "remand", "show-record"].includes(card.id)
  ).map((card) => withInstance(card, state.sequence++));
}

function drawCards(type, count) {
  if (!state.decks[type].length) buildDecks();
  const cards = [];
  for (let index = 0; index < count; index += 1) {
    if (!state.decks[type].length) break;
    cards.push(withInstance(state.decks[type].shift(), state.sequence++));
  }
  return cards;
}

function drawToHand(type, count, limit, shouldRender = true) {
  if (state.hands[type].length >= limit) return;
  const room = limit - state.hands[type].length;
  state.hands[type].push(...drawCards(type, Math.min(room, count)));
  if (shouldRender) render();
}

function fileClaim(instanceId) {
  if (state.phase !== "claim") return;
  const selected = state.hands.claims.find((item) => item.instanceId === normalizeInstanceId(instanceId));
  if (!selected) return;
  state.activeCase = clone(selected);
  state.selectedDefendant = null;
  state.phase = "defendant";
  state.docket = [
    {
      title: "Complaint drafted",
      detail: `${selected.plaintiff.name} files a ${selected.type.toLowerCase()} claim in ${selected.forumState} ${selected.court} court.`
    }
  ];
  setJudge(
    "neutral",
    "Complaint on the table",
    "Choose the defendant. That choice controls personal jurisdiction, complete diversity, forum-defendant removal limits, joinder, and discovery targets.",
    "Civil procedure strategy starts with party selection and forum selection."
  );
  advanceTutorial("file-claim");
  render();
}

function chooseDefendant(defendantId) {
  if (state.phase !== "defendant" || !state.activeCase) return;
  const defendant = state.activeCase.defendants.find((item) => item.id === defendantId);
  if (!defendant) return;
  state.selectedDefendant = defendant;
  state.activeCase.currentCourt = state.activeCase.court;
  state.activeCase.currentForum = state.activeCase.forumState;
  state.activeCase.dismissed = false;
  state.activeCase.collectedEvidence = [];
  state.activeCase.blockedRemoval = Boolean(defendant.forumDefendant);
  state.phase = "attack";
  state.docket.push({
    title: "Defendant selected",
    detail: `${defendant.name} is named. ${defendant.role}`
  });
  setJudge(
    "neutral",
    "Threshold window opened",
    "The defense may play up to two early attacks. Waivable defenses become harder to use after the first threshold response.",
    "Rule 12(g) and 12(h) make timing part of the game."
  );
  advanceTutorial("choose-defendant");
  startTimer("Defense attack window", 25, () => passAttacks());
  render();
}

function playAttack(instanceId) {
  if (!state.activeCase || !state.selectedDefendant) return;
  const attack = state.hands.attacks.find((card) => card.instanceId === normalizeInstanceId(instanceId));
  if (!attack || !canPlayAttack(attack) || !spend("defense", attack.cost)) return;
  removeFromHand("attacks", instanceId);
  state.discards.attacks.push(attack);
  stopTimer();
  const evaluation = evaluateAttack({
    attack,
    activeCase: state.activeCase,
    selectedDefendant: state.selectedDefendant,
    attackCount: state.attackCount,
    missingEvidence: missingEvidence(state.activeCase)
  });
  state.pendingAttack = { attack, evaluation };
  state.phase = "response";
  state.docket.push({
    title: `${attack.title} played`,
    detail: attack.subtitle
  });
  setJudge("neutral", `${attack.subtitle} pending`, evaluation.prompt, evaluation.source);
  startTimer("Motion response due", 20, () => resolveAttack(null));
  render();
}

function canPlayAttack(attack) {
  if (attack.timing === "summary") return state.phase === "summary";
  return state.phase === "attack";
}

function respondWithMotion(instanceId) {
  if (state.phase !== "response" || !state.pendingAttack) return;
  const motion = state.hands.motions.find((card) => card.instanceId === normalizeInstanceId(instanceId));
  if (!motion || motion.kind !== "motion" || !spend("plaintiff", motion.cost)) return;
  removeFromHand("motions", instanceId);
  state.discards.motions.push(motion);
  resolveAttack(motion);
}

function resolveAttack(motion) {
  if (!state.pendingAttack) return;
  stopTimer();
  const { attack, evaluation } = state.pendingAttack;
  state.pendingAttack = null;
  const motionIsResponsive = Boolean(motion && motion.answers.includes(attack.id));
  const correctMotion = motionIsResponsive && evaluation.counterWorks;

  if (attack.id === "summary-judgment") {
    resolveSummaryJudgment(motion, motionIsResponsive);
    return;
  }

  if (motion) {
    state.docket.push({
      title: `${motion.title} filed`,
      detail: motion.text
    });
  } else {
    state.docket.push({
      title: "No timely response",
      detail: "The attack stands because the motion window expired."
    });
  }

  if (motion && !motionIsResponsive) {
    applyUnansweredAttack(attack, {
      ...evaluation,
      body: `That motion does not answer ${attack.subtitle}. The attack is treated as unopposed.`
    });
    return;
  }

  if (evaluation.hasMerit && !correctMotion) {
    applyMeritoriousAttack(attack, evaluation, motion ? `${motion.title} was procedurally responsive, but the facts still support the attack.` : evaluation.body);
    return;
  }

  if (evaluation.hasMerit && correctMotion) {
    state.attackCount += 1;
    applyCure(attack.id);
    state.docket.push({
      title: "Issue cured",
      detail: evaluation.cureDetail || evaluation.winDetail
    });
    setJudge("good", "Procedural save", evaluation.cureDetail || evaluation.winDetail, evaluation.source);
    continueAfterThresholdAttack();
    return;
  }

  state.attackCount += 1;
  state.docket.push({
    title: "Attack denied",
    detail: evaluation.winDetail
  });
  setJudge("good", "Motion granted", evaluation.winDetail, evaluation.source);
  continueAfterThresholdAttack();
}

function applyUnansweredAttack(attack, evaluation) {
  if (evaluation.hasMerit) {
    applyMeritoriousAttack(attack, evaluation, evaluation.body);
    return;
  }
  state.attackCount += 1;
  setJudge("neutral", "Attack fails", evaluation.winDetail || "The facts do not support the procedural attack.", evaluation.source);
  continueAfterThresholdAttack();
}

function applyCure(attackId) {
  if (attackId === "failure-state-claim") state.activeCase.pleadingLevel = 2;
  if (attackId === "venue") state.activeCase.currentForum = state.activeCase.eventState;
  if (attackId === "service") state.activeCase.serviceProper = true;
  if (attackId === "erie") state.activeCase.stateLawConflict = false;
  if (attackId === "class-cert") state.activeCase.rule23Ready = true;
  if (attackId === "supplemental" && state.activeCase.supplementalClaim) {
    state.activeCase.supplementalClaim.secured = true;
  }
}

function applyMeritoriousAttack(attack, evaluation, body) {
  if (attack.id === "remove") {
    state.activeCase.currentCourt = "federal";
    state.attackCount += 1;
    state.docket.push({ title: "Case removed", detail: "The claim moves to federal court." });
    setJudge("bad", "Removed to federal court", body || evaluation.body, evaluation.source);
    continueAfterThresholdAttack();
    return;
  }

  if (attack.id === "join") {
    state.activeCase.blockedRemoval = true;
    state.activeCase.joinedForumDefendant = true;
    if (state.activeCase.currentCourt === "federal" && !hasFederalSmj(state.activeCase, state.selectedDefendant)) {
      state.activeCase.currentCourt = "state";
    }
    state.attackCount += 1;
    state.docket.push({ title: "Local party joined", detail: "Diversity leverage is reduced and removal is blocked." });
    setJudge("bad", "Joinder changes the forum math", body || evaluation.body, evaluation.source);
    continueAfterThresholdAttack();
    return;
  }

  if (attack.id === "venue") {
    state.activeCase.currentForum = state.activeCase.eventState;
    state.attackCount += 1;
    state.docket.push({ title: "Transferred", detail: `Venue moves to ${state.activeCase.eventState}.` });
    setJudge("bad", "Venue attack succeeds", body || evaluation.body, evaluation.source);
    continueAfterThresholdAttack();
    return;
  }

  dismissCase(attack.subtitle, body || evaluation.body, evaluation.source);
}

function continueAfterThresholdAttack() {
  if (state.activeCase.dismissed) return;
  if (state.attackCount >= state.maxAttacks) {
    enterDiscovery();
    return;
  }
  state.phase = "attack";
  startTimer("Defense attack window", 18, () => passAttacks());
  render();
}

function passAttacks() {
  if (state.phase !== "attack") return;
  stopTimer();
  state.docket.push({ title: "Threshold attacks closed", detail: "The case moves into discovery." });
  advanceTutorial("pass-attacks");
  enterDiscovery();
}

function enterDiscovery() {
  if (!state.activeCase || state.activeCase.dismissed) return;
  state.phase = "discovery";
  setJudge(
    "neutral",
    "Discovery opened",
    "Collect every listed proof item. If discovery closes with a missing element, the defense can use Rule 56 to press for summary judgment.",
    "FRCP 26, 30, 34, 36, and 37 are collapsed into discovery tool cards."
  );
  render();
}

function requestEvidence(evidenceId, instanceId) {
  if (state.phase !== "discovery" || !state.activeCase) return;
  const evidence = state.activeCase.evidence.find((item) => item.id === evidenceId);
  const tool = state.hands.motions.find((item) => item.instanceId === normalizeInstanceId(instanceId));
  if (!evidence || !tool || tool.kind !== "discovery-tool" || !spend("plaintiff", tool.cost)) return;
  removeFromHand("motions", instanceId);
  state.discards.motions.push(tool);

  if (tool.tool !== evidence.tool) {
    state.docket.push({ title: "Wrong discovery tool", detail: `${tool.title} does not match ${evidence.title}.` });
    setJudge("bad", "Discovery miss", `${evidence.title} calls for ${toolName(evidence.tool)}.`, "The game maps discovery tools to their ordinary Civ Pro use.");
    render();
    return;
  }

  state.docket.push({ title: tool.title, detail: `${state.players[state.plaintiff].name} targets ${evidence.title}.` });
  const resistance = evidence.resistance || "resistance";
  if (evidence.resistance) {
    evidence.pendingResistance = resistance;
    setJudge(
      "neutral",
      "Discovery objection raised",
      `The defense objects on ${resistanceLabel(resistance)} grounds. Use a discovery motion card to solve it.`,
      "Rule 37 permits motions to compel after discovery resistance."
    );
    advanceTutorial("request-resistant-docs");
    render();
    return;
  }

  collectEvidence(evidence);
  if (state.phase !== "trial") {
    setJudge("good", "Discovery obtained", `${evidence.title} is collected.`, "Targeted discovery generally proceeds when relevant and proportional.");
  }
  if (evidence.tool === "deposition") advanceTutorial("collect-deposition");
  if (evidence.tool === "expert") advanceTutorial("expert-proof");
  render();
}

function answerDiscoveryResistance(instanceId) {
  if (state.phase !== "discovery" || !state.activeCase) return;
  const evidence = state.activeCase.evidence.find((item) => item.pendingResistance);
  const motion = state.hands.motions.find((item) => item.instanceId === normalizeInstanceId(instanceId));
  if (!evidence || !motion || motion.kind !== "discovery" || !spend("plaintiff", motion.cost)) return;
  removeFromHand("motions", instanceId);
  state.discards.motions.push(motion);
  const resistance = evidence.pendingResistance;
  const works = motion.answers.includes(resistance);
  state.docket.push({ title: motion.title, detail: motion.text });

  if (!works) {
    delete evidence.pendingResistance;
    evidence.failed = true;
    setJudge("bad", "Discovery denied", `${motion.title} does not solve a ${resistanceLabel(resistance)} objection.`, "Discovery disputes require the right procedural response.");
    render();
    return;
  }

  delete evidence.pendingResistance;
  collectEvidence(evidence);
  if (state.phase !== "trial") {
    setJudge("good", "Discovery motion granted", `${motion.title} answers the objection. ${evidence.title} is now in the record.`, "This abstracts Rule 37 motion-to-compel practice.");
  }
  advanceTutorial("motion-to-compel");
  render();
}

function collectEvidence(evidence) {
  evidence.complete = true;
  evidence.failed = false;
  if (!state.activeCase.collectedEvidence.includes(evidence.id)) {
    state.activeCase.collectedEvidence.push(evidence.id);
  }
  state.docket.push({ title: "Evidence collected", detail: evidence.title });
  if (allEvidenceCollected(state.activeCase)) {
    awardTrialReady();
  }
}

function closeDiscovery() {
  if (state.phase !== "discovery") return;
  state.phase = "summary";
  setJudge("neutral", "Discovery closed", "The defense may now play summary judgment. The plaintiff must show record evidence for every required proof item.", "Rule 56 turns the discovery record into the next procedural fight.");
  render();
}

function resolveSummaryJudgment(motion, motionIsResponsive) {
  const missing = missingEvidence(state.activeCase);
  state.docket.push({
    title: "Rule 56 motion",
    detail: missing.length ? `Missing proof: ${missing.map((item) => item.title).join(", ")}.` : "Plaintiff has evidence on every listed item."
  });

  if (!motion || !motionIsResponsive || missing.length) {
    if (missing.length) {
      dismissCase("Summary judgment", "The plaintiff lacks record evidence for every required element.", "FRCP 56");
      return;
    }
  }

  awardTrialReady();
  setJudge("good", "Summary judgment denied", "The record contains every required proof item, so the claim is trial ready.", "FRCP 56");
}

function awardTrialReady() {
  const points = state.activeCase.federalQuestion || state.activeCase.amount > 100000 || state.activeCase.classAction ? 3 : 2;
  state.players[state.plaintiff].score += points;
  state.phase = "trial";
  state.docket.push({ title: "Trial ready", detail: `${state.players[state.plaintiff].name} scores ${points} points.` });
  setJudge("good", "Claim reaches trial", `The plaintiff survives threshold attacks and builds the record. Score ${points} points, then rotate roles.`, "The game treats trial readiness as the Civ Pro win condition.");
  stopTimer();
  render();
}

function dismissCase(title, body, source) {
  state.activeCase.dismissed = true;
  state.players[state.defense].score += 1;
  state.players[state.plaintiff].dismissed += 1;
  state.phase = "trial";
  state.docket.push({ title: "Claim dismissed", detail: title });
  setJudge("bad", title, `${body} Defense scores 1 point.`, source);
  stopTimer();
  render();
}

function nextRound() {
  stopTimer();
  advanceTutorial("next-round");
  state.round += 1;
  const oldPlaintiff = state.plaintiff;
  state.plaintiff = state.defense;
  state.defense = oldPlaintiff;
  startRound();
}

function canAfford(role, cost) {
  return state.resources[role] >= cost;
}

function spend(role, cost) {
  if (!canAfford(role, cost)) {
    setJudge("bad", "Budget exhausted", `${role === "plaintiff" ? "Plaintiff" : "Defense"} needs ${cost} litigation budget. Draw or wait for the next round.`, "Budget is a game abstraction, not a Civ Pro rule.");
    render();
    return false;
  }
  state.resources[role] -= cost;
  return true;
}

function removeFromHand(type, instanceId) {
  const index = state.hands[type].findIndex((card) => card.instanceId === normalizeInstanceId(instanceId));
  if (index === -1) return null;
  return state.hands[type].splice(index, 1)[0];
}

function normalizeInstanceId(instanceId) {
  return String(instanceId);
}

function startTimer(label, seconds, onExpire) {
  stopTimer();
  if (els["study-mode"].checked || state.settings.noTimer) {
    state.secondsLeft = null;
    state.deadline = null;
    return;
  }
  state.secondsLeft = seconds;
  state.deadline = { label, onExpire };
  state.timer = window.setInterval(() => {
    state.secondsLeft -= 1;
    if (state.secondsLeft <= 0) {
      const expire = state.deadline?.onExpire;
      stopTimer();
      if (expire) expire();
      return;
    }
    renderTimer();
  }, 1000);
}

function stopTimer() {
  if (state.timer) window.clearInterval(state.timer);
  state.timer = null;
  state.deadline = null;
  state.secondsLeft = null;
}

function setJudge(tone, title, body, cite) {
  state.judge = {
    tone,
    title,
    body,
    cite,
    revealed: !state.settings.examMode || tone === "neutral"
  };
}

function advanceTutorial(action) {
  if (!state.tutorial.enabled) return;
  const current = TUTORIAL_STEPS[state.tutorial.step];
  if (current?.action === action) {
    state.tutorial.step = Math.min(state.tutorial.step + 1, TUTORIAL_STEPS.length - 1);
  }
}

function render() {
  renderScores();
  renderTimer();
  renderPhases();
  renderResources();
  renderTutorial();
  renderSources();
  renderClaimHand();
  renderActiveCase();
  renderAttackHand();
  renderMotionHand();
  renderDiscovery();
  renderJudge();
}

function renderScores() {
  els["player-one-label"].textContent = state.players[0].name;
  els["player-one-score"].textContent = state.players[0].score;
  els["player-two-label"].textContent = state.players[1].name;
  els["player-two-score"].textContent = state.players[1].score;
  els["round-value"].textContent = state.round;
  els["roles-value"].textContent = `${state.players[state.plaintiff].name} plaintiff; ${state.players[state.defense].name} defense.`;
}

function renderTimer() {
  const card = els["timer-card"];
  card.classList.toggle("idle", !state.deadline);
  card.classList.toggle("warning", Number.isFinite(state.secondsLeft) && state.secondsLeft <= 5);
  els["timer-label"].textContent = state.deadline?.label || (state.settings.noTimer || els["study-mode"].checked ? "Timer off" : "No deadline");
  els["timer-value"].textContent = Number.isFinite(state.secondsLeft) ? `${state.secondsLeft}s` : "--";
}

function renderPhases() {
  els["phase-list"].innerHTML = PHASES.map(([id, label], index) => `
    <li class="phase-step ${state.phase === id ? "active" : ""}">
      <span>${index + 1}</span>
      <strong>${label}</strong>
    </li>
  `).join("");
}

function renderResources() {
  els["resource-panel"].innerHTML = `
    <div class="resource-card"><span>Plaintiff budget</span><strong>${state.resources.plaintiff}</strong></div>
    <div class="resource-card"><span>Defense budget</span><strong>${state.resources.defense}</strong></div>
    <div class="resource-card"><span>Discards</span><strong>${state.discards.attacks.length + state.discards.motions.length}</strong></div>
  `;
}

function renderTutorial() {
  if (!state.tutorial.enabled) {
    els["tutorial-panel"].innerHTML = "";
    return;
  }
  const step = TUTORIAL_STEPS[state.tutorial.step];
  els["tutorial-panel"].innerHTML = `
    <span class="section-label">Tutorial</span>
    <h2>${step.title}</h2>
    <p>${step.body}</p>
    <p class="tutorial-count">Step ${state.tutorial.step + 1} of ${TUTORIAL_STEPS.length}</p>
  `;
}

function renderSettings() {
  const modes = [
    ["noTimer", "No timer"],
    ["examMode", "Exam mode"],
    ["showExplanations", "Show explanations"]
  ];
  els["mode-toggles"].innerHTML = modes.map(([id, label]) => `
    <label class="toggle small">
      <input type="checkbox" data-mode="${id}" ${state.settings[id] ? "checked" : ""}>
      <span>${label}</span>
    </label>
  `).join("");
  els["topic-toggles"].innerHTML = TOPIC_MODULES.map((topic) => `
    <label class="toggle small">
      <input type="checkbox" data-topic="${topic.id}" ${state.settings.activeTopics.has(topic.id) ? "checked" : ""}>
      <span>${topic.label}${topic.preview ? " (preview)" : ""}</span>
    </label>
  `).join("");
  els["mode-toggles"].querySelectorAll("[data-mode]").forEach((input) => {
    input.addEventListener("change", () => {
      state.settings[input.dataset.mode] = input.checked;
      if (input.dataset.mode === "noTimer" && input.checked) stopTimer();
      render();
    });
  });
  els["topic-toggles"].querySelectorAll("[data-topic]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) state.settings.activeTopics.add(input.dataset.topic);
      else state.settings.activeTopics.delete(input.dataset.topic);
      if (!state.settings.activeTopics.size) state.settings.activeTopics.add("jurisdiction");
      state.tutorial.enabled = false;
      renderSettings();
      newGame();
    });
  });
}

function renderSources() {
  els["source-list"].innerHTML = SOURCES.map((source) => `
    <li><a href="${source.href}" target="_blank" rel="noreferrer">${source.label}</a>: ${source.note}</li>
  `).join("");
}

function renderClaimHand() {
  els["claim-hand"].innerHTML = state.hands.claims.map((claim) => `
    <button class="playing-card ${state.activeCase?.id === claim.id ? "selected" : ""}" ${state.phase !== "claim" ? "disabled" : ""} data-action="file-claim" data-id="${claim.instanceId}">
      <span class="card-type">Claim</span>
      <h3>${claim.title}</h3>
      <p>${claim.summary}</p>
      <div class="card-meta">
        <span class="tag">${claim.plaintiff.state} plaintiff</span>
        <span class="tag">${claim.forumState} ${claim.court}</span>
        <span class="tag">${formatMoney(claim.amount)}</span>
      </div>
    </button>
  `).join("");
  els["claim-hand"].querySelectorAll("[data-action='file-claim']").forEach((button) => {
    button.addEventListener("click", () => fileClaim(button.dataset.id));
  });
}

function renderActiveCase() {
  if (!state.activeCase) {
    els["active-case"].innerHTML = `
      <div class="empty-state">
        <div><strong>No active claim</strong><p>Pick a case card to begin a round.</p></div>
      </div>
    `;
    return;
  }

  const c = state.activeCase;
  const d = state.selectedDefendant;
  const status = d ? statusFacts(c, d) : null;
  els["active-case"].innerHTML = `
    <div class="case-facts">
      <span class="section-label">Active claim</span>
      <h2>${c.title}</h2>
      <p>${c.summary}</p>
      <dl>
        <div><dt>Plaintiff</dt><dd>${c.plaintiff.name} (${c.plaintiff.state})</dd></div>
        <div><dt>Forum</dt><dd>${c.currentForum || c.forumState} ${c.currentCourt || c.court}</dd></div>
        <div><dt>Amount</dt><dd>${formatMoney(c.amount)}</dd></div>
        <div><dt>Claim</dt><dd>${c.type}</dd></div>
      </dl>
      <p>${c.venueFacts}</p>
      ${c.supplementalClaim ? `<p><strong>Supplemental claim:</strong> ${c.supplementalClaim.title}</p>` : ""}
      <div class="defendant-options">
        ${c.defendants.map((option) => `
          <button class="option-button ${d?.id === option.id ? "selected" : ""}" ${state.phase !== "defendant" ? "disabled" : ""} data-action="choose-defendant" data-id="${option.id}">
            <strong>${option.name}</strong>
            <span>${option.state}${option.ppb && option.ppb !== option.state ? ` / PPB ${option.ppb}` : ""}. ${option.role}</span>
          </button>
        `).join("")}
      </div>
      <div class="case-actions">
        <button class="button blue" data-action="pass-attacks" ${state.phase !== "attack" ? "disabled" : ""}>Pass to discovery</button>
        <button class="button red" data-action="close-discovery" ${state.phase !== "discovery" ? "disabled" : ""}>Close discovery</button>
        <button class="button green" data-action="next-round" ${state.phase !== "trial" ? "disabled" : ""}>Next round</button>
      </div>
    </div>
    <div class="case-docket">
      <span class="section-label">Docket</span>
      ${status ? `
        <div class="status-grid">
          <div><span>Diversity</span><strong>${status.diversity}</strong></div>
          <div><span>Federal SMJ</span><strong>${status.smj}</strong></div>
          <div><span>PJ contacts</span><strong>${status.pj}</strong></div>
          <div><span>Service</span><strong>${status.service}</strong></div>
          <div><span>Removal</span><strong>${status.removal}</strong></div>
          <div><span>Supp. Jx</span><strong>${status.supplemental}</strong></div>
        </div>
      ` : ""}
      <ul class="docket-list">${state.docket.map((entry) => `<li><strong>${entry.title}</strong>${entry.detail}</li>`).join("")}</ul>
    </div>
  `;
  els["active-case"].querySelectorAll("[data-action='choose-defendant']").forEach((button) => button.addEventListener("click", () => chooseDefendant(button.dataset.id)));
  els["active-case"].querySelector("[data-action='pass-attacks']")?.addEventListener("click", passAttacks);
  els["active-case"].querySelector("[data-action='close-discovery']")?.addEventListener("click", closeDiscovery);
  els["active-case"].querySelector("[data-action='next-round']")?.addEventListener("click", nextRound);
}

function renderAttackHand() {
  els["draw-attack-button"].disabled = state.hands.attacks.length >= HAND_LIMITS.attacks;
  els["attack-hand"].innerHTML = state.hands.attacks.map((card) => {
    const disabled = !canPlayAttack(card) || !canAfford("defense", card.cost);
    return `
      <button class="playing-card" ${disabled ? "disabled" : ""} data-action="attack" data-id="${card.instanceId}">
        <span class="card-type attack">${card.title}</span>
        <h3>${card.subtitle}</h3>
        <p>${card.text}</p>
        <div class="card-meta"><span class="tag">${card.timing === "summary" ? "After discovery" : "Threshold"}</span><span class="tag">${card.cost} budget</span></div>
      </button>
    `;
  }).join("");
  els["attack-hand"].querySelectorAll("[data-action='attack']").forEach((button) => button.addEventListener("click", () => playAttack(button.dataset.id)));
}

function renderMotionHand() {
  els["draw-motion-button"].disabled = state.hands.motions.length >= HAND_LIMITS.motions;
  els["motion-hand"].innerHTML = state.hands.motions.map((card) => {
    const isMotion = card.kind === "motion";
    const isDiscoveryAnswer = card.kind === "discovery";
    const disabled = isMotion
      ? state.phase !== "response" || !canAfford("plaintiff", card.cost)
      : isDiscoveryAnswer
        ? !hasPendingDiscoveryResistance() || !canAfford("plaintiff", card.cost)
        : state.phase !== "discovery" || !canAfford("plaintiff", card.cost);
    return `
      <button class="playing-card" ${disabled ? "disabled" : ""} data-action="${isMotion ? "motion" : isDiscoveryAnswer ? "discovery-response" : "tool"}" data-id="${card.instanceId}">
        <span class="card-type ${isMotion ? "motion" : "discovery"}">${isMotion ? "Motion" : "Discovery"}</span>
        <h3>${card.title}</h3>
        <p>${card.text}</p>
        <div class="card-meta"><span class="tag">${card.cost} budget</span></div>
      </button>
    `;
  }).join("");
  els["motion-hand"].querySelectorAll("[data-action='motion']").forEach((button) => button.addEventListener("click", () => respondWithMotion(button.dataset.id)));
  els["motion-hand"].querySelectorAll("[data-action='discovery-response']").forEach((button) => button.addEventListener("click", () => answerDiscoveryResistance(button.dataset.id)));
}

function renderDiscovery() {
  if (!state.activeCase || !state.selectedDefendant) {
    els["discovery-list"].innerHTML = `<div class="empty-state"><div><strong>No checklist yet</strong><p>File a claim and choose a defendant first.</p></div></div>`;
    return;
  }
  const tools = state.hands.motions.filter((card) => card.kind === "discovery-tool");
  els["discovery-list"].innerHTML = state.activeCase.evidence.map((item) => {
    const complete = item.complete;
    const pending = item.pendingResistance;
    return `
      <article class="evidence-item ${complete ? "complete" : ""}">
        <span class="card-type discovery">${complete ? "Collected" : pending ? "Objected" : "Needed"}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="card-meta"><span class="tag">${toolName(item.tool)}</span>${item.resistance ? `<span class="tag">${resistanceLabel(item.resistance)}</span>` : ""}</div>
        <div class="case-actions">
          ${tools.map((tool) => `
            <button class="button secondary" data-action="request-evidence" data-evidence="${item.id}" data-tool="${tool.instanceId}" ${state.phase !== "discovery" || complete || pending || !canAfford("plaintiff", tool.cost) ? "disabled" : ""}>${tool.title}</button>
          `).join("")}
        </div>
      </article>
    `;
  }).join("");
  els["discovery-list"].querySelectorAll("[data-action='request-evidence']").forEach((button) => {
    button.addEventListener("click", () => requestEvidence(button.dataset.evidence, button.dataset.tool));
  });
}

function renderJudge() {
  const tone = state.judge.tone || "neutral";
  const hidden = state.settings.examMode && !state.judge.revealed;
  els["judge-output"].innerHTML = `
    <span class="ruling ${tone}">${tone === "good" ? "Granted" : tone === "bad" ? "Problem" : "Bench note"}</span>
    <h3>${state.judge.title}</h3>
    ${hidden ? `<p>Analysis hidden for exam mode.</p><button class="button secondary" data-action="reveal-ruling">Reveal analysis</button>` : `
      <p>${state.settings.showExplanations ? state.judge.body : "Ruling recorded. Enable explanations to show the full rule note."}</p>
      ${state.settings.showExplanations ? `<p><strong>Source hook:</strong> ${state.judge.cite}</p>` : ""}
    `}
  `;
  els["judge-output"].querySelector("[data-action='reveal-ruling']")?.addEventListener("click", () => {
    state.judge.revealed = true;
    renderJudge();
  });
}

function hasPendingDiscoveryResistance() {
  return Boolean(state.activeCase?.evidence.some((item) => item.pendingResistance));
}

function printCards() {
  const cases = activeByTopic(CASES, state.settings.activeTopics);
  const attacks = activeByTopic(ATTACK_CARDS, state.settings.activeTopics);
  const motions = activeByTopic(MOTION_CARDS, state.settings.activeTopics);
  els["print-deck"].innerHTML = `
    <h1>Civ Pro: Trial Ready Printable Deck</h1>
    <h2>Case Cards</h2>
    <div class="print-grid">${cases.map(printCaseCard).join("")}</div>
    <h2>Attack Cards</h2>
    <div class="print-grid">${attacks.map((card) => printRuleCard(card, "Attack")).join("")}</div>
    <h2>Motion and Discovery Cards</h2>
    <div class="print-grid">${motions.map((card) => printRuleCard(card, card.kind === "discovery-tool" ? "Discovery Tool" : card.kind === "discovery" ? "Discovery Motion" : "Motion")).join("")}</div>
  `;
  window.print();
}

function printCaseCard(card) {
  return `
    <article class="print-card">
      <span>Claim</span>
      <h3>${card.title}</h3>
      <p>${card.summary}</p>
      <p><strong>Forum:</strong> ${card.forumState} ${card.court}</p>
      <p><strong>Amount:</strong> ${formatMoney(card.amount)}</p>
      <p><strong>Proof:</strong> ${card.evidence.map((item) => item.title).join("; ")}</p>
    </article>
  `;
}

function printRuleCard(card, type) {
  return `
    <article class="print-card">
      <span>${type}</span>
      <h3>${card.title}</h3>
      <h4>${card.subtitle || card.kind}</h4>
      <p>${card.text}</p>
      <p><strong>Cost:</strong> ${card.cost || 0}</p>
    </article>
  `;
}

function showRuleTests() {
  const result = runRuleTests();
  const body = result.failures.length
    ? `${result.passed}/${result.total} rule tests passed. Failing: ${result.failures.join("; ")}`
    : `${result.passed}/${result.total} rule tests passed.`;
  setJudge(result.failures.length ? "bad" : "good", "Rule tests complete", body, "Same tests are available with npm test.");
  renderJudge();
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

document.addEventListener("DOMContentLoaded", init);
