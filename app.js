const SOURCES = [
  {
    label: "FRCP 12(b), 12(h)",
    href: "https://www.law.cornell.edu/rules/frcp/rule_12",
    note: "Threshold defenses and waiver timing"
  },
  {
    label: "28 U.S.C. 1332",
    href: "https://www.law.cornell.edu/uscode/text/28/1332",
    note: "Diversity amount and citizenship"
  },
  {
    label: "28 U.S.C. 1441",
    href: "https://www.law.cornell.edu/uscode/text/28/1441",
    note: "Removal and forum-defendant rule"
  },
  {
    label: "FRCP 26, 30, 34, 37",
    href: "https://www.law.cornell.edu/rules/frcp/rule_26",
    note: "Discovery scope, depositions, production, motions to compel"
  },
  {
    label: "FRCP 56",
    href: "https://www.law.cornell.edu/rules/frcp/rule_56",
    note: "Summary judgment after the discovery record"
  }
];

const PHASES = [
  ["claim", "File Claim"],
  ["defendant", "Pick Defendant"],
  ["attack", "Rule 12 / Removal"],
  ["response", "Motion Response"],
  ["discovery", "Discovery"],
  ["summary", "Summary Judgment"],
  ["trial", "Trial Ready"]
];

const CASES = [
  {
    id: "tire-failure",
    title: "Interstate Tire Failure",
    type: "Products liability",
    plaintiff: { name: "Riley Driver", state: "OK" },
    forumState: "OK",
    court: "state",
    eventState: "OK",
    amount: 120000,
    federalQuestion: false,
    pleadingLevel: 2,
    venueFacts: "Crash and injury treatment happened in Oklahoma.",
    summary: "An Oklahoma driver alleges a highway blowout caused serious injuries.",
    defendants: [
      {
        id: "tireco",
        name: "TireCo Manufacturing",
        state: "DE",
        ppb: "PA",
        contacts: ["OK", "PA", "DE"],
        role: "Designed and shipped the tire line nationwide, including Oklahoma.",
        sameTransaction: true
      },
      {
        id: "carco",
        name: "CarCo Motors",
        state: "MI",
        ppb: "MI",
        contacts: ["OK", "MI"],
        role: "Sold the vehicle through authorized Oklahoma dealers.",
        sameTransaction: true
      },
      {
        id: "roadworks",
        name: "RoadWorks Engineering",
        state: "OK",
        ppb: "OK",
        contacts: ["OK"],
        role: "Maintained the construction zone where the crash happened.",
        sameTransaction: true,
        forumDefendant: true
      }
    ],
    evidence: [
      {
        id: "engineer-depo",
        title: "Engineer deposition",
        tool: "deposition",
        description: "Pin down defect knowledge and alternative designs."
      },
      {
        id: "quality-docs",
        title: "Quality-control documents",
        tool: "rfp",
        description: "Request production of internal defect reports.",
        resistance: "burden"
      },
      {
        id: "expert-report",
        title: "Expert report",
        tool: "expert",
        description: "Connect the failure mode to causation and damages."
      }
    ]
  },
  {
    id: "wage-platform",
    title: "Platform Wage Claim",
    type: "Federal statutory claim",
    plaintiff: { name: "Dana Courier", state: "GA" },
    forumState: "GA",
    court: "federal",
    eventState: "GA",
    amount: 18000,
    federalQuestion: true,
    pleadingLevel: 2,
    venueFacts: "Work, records, and supervisors are centered in Georgia.",
    summary: "A courier sues a delivery platform under a federal wage statute.",
    defendants: [
      {
        id: "deliverly",
        name: "Deliverly Inc.",
        state: "DE",
        ppb: "CA",
        contacts: ["GA", "CA", "DE"],
        role: "Operates the app and driver policies in Georgia.",
        sameTransaction: true
      },
      {
        id: "local-franchise",
        name: "Atlanta Dispatch LLC",
        state: "GA",
        ppb: "GA",
        contacts: ["GA"],
        role: "Local contractor that controlled route assignments.",
        sameTransaction: true,
        forumDefendant: true
      },
      {
        id: "payroll-vendor",
        name: "Payroll Vendor Co.",
        state: "TX",
        ppb: "TX",
        contacts: ["TX"],
        role: "Processed payroll from Texas with no Georgia-facing operations.",
        sameTransaction: false
      }
    ],
    evidence: [
      {
        id: "driver-data",
        title: "Driver app data",
        tool: "rfp",
        description: "Collect hours, routes, and pay calculations."
      },
      {
        id: "manager-depo",
        title: "Manager deposition",
        tool: "deposition",
        description: "Test control over the courier's work."
      },
      {
        id: "policy-admission",
        title: "Classification admission",
        tool: "admission",
        description: "Narrow whether the worker was treated as a contractor."
      }
    ]
  },
  {
    id: "software-contract",
    title: "Broken SaaS Rollout",
    type: "Contract",
    plaintiff: { name: "Harbor Clinic", state: "WA" },
    forumState: "WA",
    court: "state",
    eventState: "WA",
    amount: 69000,
    federalQuestion: false,
    pleadingLevel: 1,
    venueFacts: "Implementation meetings and the failed deployment were in Washington.",
    summary: "A clinic sues after an electronic-records platform fails before launch.",
    defendants: [
      {
        id: "cloudscribe",
        name: "CloudScribe LLC",
        state: "OR",
        ppb: "OR",
        contacts: ["WA", "OR"],
        role: "Sent implementation staff into Washington and negotiated there.",
        sameTransaction: true
      },
      {
        id: "consultant",
        name: "Cascade IT Consulting",
        state: "WA",
        ppb: "WA",
        contacts: ["WA"],
        role: "Local integration consultant named in the same rollout failure.",
        sameTransaction: true,
        forumDefendant: true
      },
      {
        id: "security-auditor",
        name: "Lone Star Security",
        state: "TX",
        ppb: "TX",
        contacts: ["TX"],
        role: "Remote auditor with a thin relationship to the disputed contract.",
        sameTransaction: false
      }
    ],
    evidence: [
      {
        id: "contract-redlines",
        title: "Contract redlines",
        tool: "rfp",
        description: "Show scope, deadline, and breach terms."
      },
      {
        id: "implementation-depo",
        title: "Implementation lead deposition",
        tool: "deposition",
        description: "Establish missed milestones and notice."
      },
      {
        id: "damages-calculation",
        title: "Damages calculation",
        tool: "expert",
        description: "Support lost revenue and replacement costs."
      }
    ]
  },
  {
    id: "defamation-stream",
    title: "Viral Defamation Stream",
    type: "Defamation",
    plaintiff: { name: "Mina Founder", state: "NY" },
    forumState: "NY",
    court: "state",
    eventState: "NY",
    amount: 250000,
    federalQuestion: false,
    pleadingLevel: 2,
    venueFacts: "Plaintiff resides in New York and alleges reputational harm there.",
    summary: "A founder sues over statements made during a livestream about her company.",
    defendants: [
      {
        id: "streamer",
        name: "Westcast Media",
        state: "CA",
        ppb: "CA",
        contacts: ["CA", "NY"],
        role: "Sold subscriptions and targeted New York viewers.",
        sameTransaction: true
      },
      {
        id: "guest",
        name: "Guest Analyst",
        state: "FL",
        ppb: "FL",
        contacts: ["FL"],
        role: "One-time guest with no New York targeting beyond the stream.",
        sameTransaction: true
      },
      {
        id: "ny-sponsor",
        name: "Hudson Sponsor LLC",
        state: "NY",
        ppb: "NY",
        contacts: ["NY"],
        role: "New York sponsor alleged to have republished clips.",
        sameTransaction: true,
        forumDefendant: true
      }
    ],
    evidence: [
      {
        id: "analytics",
        title: "Audience analytics",
        tool: "rfp",
        description: "Show forum targeting and scope of publication.",
        resistance: "privacy"
      },
      {
        id: "host-depo",
        title: "Host deposition",
        tool: "deposition",
        description: "Explore knowledge, fault, and source checking."
      },
      {
        id: "admission-falsity",
        title: "Admission on falsity",
        tool: "admission",
        description: "Lock down whether key statements are disputed."
      }
    ]
  },
  {
    id: "data-breach",
    title: "Bank Data Breach",
    type: "Negligence / consumer claim",
    plaintiff: { name: "Pat Account Holder", state: "IL" },
    forumState: "IL",
    court: "federal",
    eventState: "IL",
    amount: 82000,
    federalQuestion: false,
    pleadingLevel: 1,
    venueFacts: "The account holder banked in Illinois; breach response was nationwide.",
    summary: "A bank customer alleges negligent security after identity theft losses.",
    defendants: [
      {
        id: "bank",
        name: "MetroBank NA",
        state: "DE",
        ppb: "NY",
        contacts: ["IL", "NY", "DE"],
        role: "Maintained Illinois accounts and branches.",
        sameTransaction: true
      },
      {
        id: "processor",
        name: "Card Processor Inc.",
        state: "NJ",
        ppb: "NJ",
        contacts: ["NJ", "IL"],
        role: "Processed the affected transactions.",
        sameTransaction: true
      },
      {
        id: "local-branch",
        name: "Chicago Branch Services",
        state: "IL",
        ppb: "IL",
        contacts: ["IL"],
        role: "Local affiliate named for account support failures.",
        sameTransaction: true,
        forumDefendant: true
      }
    ],
    evidence: [
      {
        id: "security-audit",
        title: "Security audit",
        tool: "rfp",
        description: "Request breach-risk and remediation records.",
        resistance: "privilege"
      },
      {
        id: "ciso-depo",
        title: "CISO deposition",
        tool: "deposition",
        description: "Establish standard of care and breach response."
      },
      {
        id: "loss-proof",
        title: "Loss records",
        tool: "rfp",
        description: "Prove causation and amount in controversy."
      }
    ]
  },
  {
    id: "festival-injury",
    title: "Festival Stage Collapse",
    type: "Premises / negligence",
    plaintiff: { name: "Noah Attendee", state: "TN" },
    forumState: "TN",
    court: "state",
    eventState: "TN",
    amount: 155000,
    federalQuestion: false,
    pleadingLevel: 2,
    venueFacts: "The collapse and witnesses are in Tennessee.",
    summary: "A concertgoer sues after a temporary stage collapses during a storm.",
    defendants: [
      {
        id: "festival",
        name: "Riverfront Festival LLC",
        state: "TN",
        ppb: "TN",
        contacts: ["TN"],
        role: "Local event organizer and forum defendant.",
        sameTransaction: true,
        forumDefendant: true
      },
      {
        id: "stage-builder",
        name: "StageBuild Corp.",
        state: "IN",
        ppb: "IN",
        contacts: ["TN", "IN"],
        role: "Built the temporary stage in Tennessee.",
        sameTransaction: true
      },
      {
        id: "weather-vendor",
        name: "Weather Alerts Ltd.",
        state: "CO",
        ppb: "CO",
        contacts: ["CO"],
        role: "Remote warning vendor with limited Tennessee contacts.",
        sameTransaction: false
      }
    ],
    evidence: [
      {
        id: "inspection-photos",
        title: "Inspection photos",
        tool: "rfp",
        description: "Show the condition of the stage before collapse."
      },
      {
        id: "site-manager-depo",
        title: "Site manager deposition",
        tool: "deposition",
        description: "Establish notice of weather and structural issues."
      },
      {
        id: "engineering-report",
        title: "Engineering report",
        tool: "expert",
        description: "Tie collapse mechanics to negligent construction."
      }
    ]
  }
];

const ATTACK_CARDS = [
  {
    id: "pj",
    title: "Rule 12(b)(2)",
    subtitle: "Lack of Personal Jurisdiction",
    timing: "threshold",
    text: "Dismiss if this forum lacks power over the selected defendant.",
    color: "red"
  },
  {
    id: "smj",
    title: "Rule 12(b)(1)",
    subtitle: "Lack of Subject-Matter Jurisdiction",
    timing: "threshold",
    text: "Attack federal jurisdiction when no federal question or diversity basis exists.",
    color: "red"
  },
  {
    id: "venue",
    title: "Rule 12(b)(3)",
    subtitle: "Improper Venue",
    timing: "threshold",
    text: "Challenge location when events and defendants do not connect to the forum.",
    color: "red"
  },
  {
    id: "remove",
    title: "Notice of Removal",
    subtitle: "Move to Federal Court",
    timing: "threshold",
    text: "Remove a state case if federal court would have original jurisdiction.",
    color: "blue"
  },
  {
    id: "join",
    title: "Join Local Defendant",
    subtitle: "Destroy or block diversity",
    timing: "threshold",
    text: "Add a forum defendant from the same transaction to complicate removal.",
    color: "gold"
  },
  {
    id: "failure-state-claim",
    title: "Rule 12(b)(6)",
    subtitle: "Failure to State a Claim",
    timing: "threshold",
    text: "Attack a thin complaint before discovery begins.",
    color: "red"
  },
  {
    id: "summary-judgment",
    title: "Rule 56",
    subtitle: "Summary Judgment",
    timing: "summary",
    text: "Win if the plaintiff lacks evidence on a required element after discovery.",
    color: "red"
  }
];

const MOTION_CARDS = [
  {
    id: "show-contacts",
    title: "Show Minimum Contacts",
    kind: "motion",
    answers: ["pj"],
    text: "Point to forum contacts, domicile, consent, or conduct tied to the forum."
  },
  {
    id: "show-smj",
    title: "Show Federal Jurisdiction",
    kind: "motion",
    answers: ["smj"],
    text: "Prove federal question or diversity plus the amount in controversy."
  },
  {
    id: "transfer-venue",
    title: "Transfer Instead",
    kind: "motion",
    answers: ["venue"],
    text: "Keep the case alive by moving it to a proper court."
  },
  {
    id: "remand",
    title: "Motion to Remand",
    kind: "motion",
    answers: ["remove"],
    text: "Send an improperly removed case back to state court."
  },
  {
    id: "oppose-joinder",
    title: "Oppose Joinder",
    kind: "motion",
    answers: ["join"],
    text: "Argue the added party is outside the same transaction or is a tactical spoiler."
  },
  {
    id: "leave-amend",
    title: "Leave to Amend",
    kind: "motion",
    answers: ["failure-state-claim"],
    text: "Cure pleading defects before the claim is dismissed."
  },
  {
    id: "show-record",
    title: "Show Record Evidence",
    kind: "motion",
    answers: ["summary-judgment"],
    text: "Defeat summary judgment with evidence for each required element."
  },
  {
    id: "motion-compel",
    title: "Motion to Compel",
    kind: "discovery",
    answers: ["burden", "privacy", "resistance"],
    text: "Force a discovery response after a proper meet-and-confer."
  },
  {
    id: "narrow-request",
    title: "Narrow Request",
    kind: "discovery",
    answers: ["burden", "privacy"],
    text: "Reduce burden or privacy concerns while preserving the core evidence."
  },
  {
    id: "privilege-log",
    title: "Demand Privilege Log",
    kind: "discovery",
    answers: ["privilege"],
    text: "Challenge withheld materials without ignoring privilege boundaries."
  },
  {
    id: "notice-deposition",
    title: "Notice Deposition",
    kind: "discovery-tool",
    tool: "deposition",
    text: "Use Rule 30 style testimony to lock witnesses into the record."
  },
  {
    id: "request-production",
    title: "Request Production",
    kind: "discovery-tool",
    tool: "rfp",
    text: "Use Rule 34 style requests for documents, ESI, and tangible things."
  },
  {
    id: "request-admission",
    title: "Request Admission",
    kind: "discovery-tool",
    tool: "admission",
    text: "Narrow issues by forcing admission, denial, or explanation."
  },
  {
    id: "expert-disclosure",
    title: "Expert Disclosure",
    kind: "discovery-tool",
    tool: "expert",
    text: "Build expert proof for causation, standard of care, or damages."
  }
];

const state = {
  players: [
    { name: "Player 1", score: 0, dismissed: 0 },
    { name: "Player 2", score: 0, dismissed: 0 }
  ],
  round: 1,
  plaintiff: 0,
  defense: 1,
  phase: "claim",
  claimHand: [],
  activeCase: null,
  selectedDefendant: null,
  docket: [],
  pendingAttack: null,
  attackCount: 0,
  maxAttacks: 2,
  timer: null,
  deadline: null,
  secondsLeft: null,
  judge: {
    tone: "neutral",
    title: "File a claim to start",
    body: "Pick one case from the claim hand. Then choose the defendant you want to sue and defend the filing through threshold attacks, discovery, and summary judgment.",
    cite: "This prototype abstracts the 1L pretrial sequence into competitive card play."
  }
};

const els = {};

function init() {
  bindElements();
  bindEvents();
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
    "study-mode",
    "phase-list",
    "round-value",
    "roles-value",
    "claim-hand",
    "active-case",
    "attack-hand",
    "motion-hand",
    "discovery-list",
    "judge-output",
    "source-list"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els["new-game-button"].addEventListener("click", newGame);
  els["study-mode"].addEventListener("change", () => {
    if (els["study-mode"].checked) {
      stopTimer();
      setJudge(
        "neutral",
        "Study mode enabled",
        "Timers are paused. You can discuss the rule before choosing the next card.",
        "Use this for classroom or review sessions."
      );
    }
    render();
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
  startRound();
}

function startRound() {
  stopTimer();
  state.phase = "claim";
  state.claimHand = drawCases(3);
  state.activeCase = null;
  state.selectedDefendant = null;
  state.docket = [];
  state.pendingAttack = null;
  state.attackCount = 0;
  state.maxAttacks = 2;
  setJudge(
    "neutral",
    `${state.players[state.plaintiff].name} is plaintiff`,
    "File one claim. The defense then has a short threshold window to attack jurisdiction, venue, pleading, removal, or joinder.",
    "The game treats each round as a fresh civil action."
  );
  render();
}

function drawCases(count) {
  const offset = (state.round - 1) % CASES.length;
  return Array.from({ length: count }, (_, index) => {
    const source = CASES[(offset + index) % CASES.length];
    return cloneCase(source);
  });
}

function cloneCase(source) {
  return JSON.parse(JSON.stringify(source));
}

function fileClaim(caseId) {
  if (state.phase !== "claim") return;
  const selected = state.claimHand.find((item) => item.id === caseId);
  if (!selected) return;
  state.activeCase = selected;
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
    "Choose the defendant. That choice controls personal jurisdiction, complete diversity, forum-defendant removal limits, and discovery targets.",
    "Civil procedure strategy starts with party selection and forum selection."
  );
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
    "The defense may play up to two early attacks. Rule 12(b)(2), venue, process-style defenses, and removal are timing-sensitive in the game to reinforce waiver and deadline pressure.",
    "Rule 12 requires threshold defenses to be raised early; removal also has its own timing logic."
  );
  startTimer("Defense attack window", 25, () => passAttacks());
  render();
}

function playAttack(attackId) {
  if (!state.activeCase || !state.selectedDefendant) return;
  const attack = ATTACK_CARDS.find((card) => card.id === attackId);
  if (!attack) return;
  if (attack.timing === "summary" && state.phase !== "summary") return;
  if (attack.timing === "threshold" && state.phase !== "attack") return;

  stopTimer();
  const evaluation = evaluateAttack(attackId);
  state.pendingAttack = { attack, evaluation };
  state.phase = "response";
  state.docket.push({
    title: `${attack.title} played`,
    detail: attack.subtitle
  });
  setJudge(
    "neutral",
    `${attack.subtitle} pending`,
    evaluation.prompt,
    evaluation.source
  );
  startTimer("Motion response due", 20, () => resolveAttack(null));
  render();
}

function respondWithMotion(motionId) {
  if (state.phase !== "response" || !state.pendingAttack) return;
  const motion = MOTION_CARDS.find((card) => card.id === motionId);
  if (!motion) return;
  resolveAttack(motion);
}

function resolveAttack(motion) {
  if (!state.pendingAttack) return;
  stopTimer();
  const { attack, evaluation } = state.pendingAttack;
  state.pendingAttack = null;
  const motionIsResponsive = Boolean(motion && motion.answers.includes(attack.id));
  const correctMotion = motionIsResponsive && evaluation.counterWorks;
  const badMotion = motion && !motionIsResponsive;

  if (attack.id === "summary-judgment") {
    resolveSummaryJudgment(motion, motionIsResponsive);
    return;
  }

  if (!motion) {
    applyUnansweredAttack(attack, evaluation);
    return;
  }

  state.docket.push({
    title: `${motion.title} filed`,
    detail: motion.text
  });

  if (badMotion) {
    applyUnansweredAttack(attack, {
      ...evaluation,
      body: `That motion does not answer ${attack.subtitle}. The attack is treated as unopposed.`
    });
    return;
  }

  if (evaluation.hasMerit && !correctMotion) {
    applyMeritoriousAttack(attack, evaluation, `${motion.title} was procedurally responsive, but the facts still support the attack.`);
    return;
  }

  if (!evaluation.hasMerit && correctMotion) {
    state.attackCount += 1;
    state.docket.push({
      title: "Attack denied",
      detail: evaluation.winDetail
    });
    setJudge("good", "Motion granted", evaluation.winDetail, evaluation.source);
    continueAfterThresholdAttack();
    return;
  }

  if (evaluation.hasMerit && correctMotion) {
    state.attackCount += 1;
    state.docket.push({
      title: "Issue cured",
      detail: evaluation.cureDetail || evaluation.winDetail
    });
    if (attack.id === "failure-state-claim") {
      state.activeCase.pleadingLevel = 2;
    }
    if (attack.id === "venue") {
      state.activeCase.currentForum = state.activeCase.eventState;
    }
    setJudge("good", "Procedural save", evaluation.cureDetail || evaluation.winDetail, evaluation.source);
    continueAfterThresholdAttack();
    return;
  }

  state.attackCount += 1;
  setJudge("neutral", "Motion filed", "The attack had weak facts, and the response preserved the claim.", evaluation.source);
  continueAfterThresholdAttack();
}

function applyUnansweredAttack(attack, evaluation) {
  state.docket.push({
    title: "No timely response",
    detail: "The attack stands because the motion window expired."
  });
  if (evaluation.hasMerit) {
    applyMeritoriousAttack(attack, evaluation, evaluation.body);
  } else {
    state.attackCount += 1;
    if (attack.id === "remove") {
      setJudge("bad", "Removal fails on its own facts", "Even unopposed, a state case cannot be removed without original federal jurisdiction and compliance with removal limits in this simplified model.", evaluation.source);
    } else {
      setJudge("neutral", "Weak attack fizzles", "The card was a bluff: the facts do not support it. In a stricter variant, unanswered motions could still cause default consequences.", evaluation.source);
    }
    continueAfterThresholdAttack();
  }
}

function applyMeritoriousAttack(attack, evaluation, body) {
  if (attack.id === "remove") {
    state.activeCase.currentCourt = "federal";
    state.attackCount += 1;
    state.docket.push({
      title: "Case removed",
      detail: "The claim moves to federal court."
    });
    setJudge("bad", "Removed to federal court", body || evaluation.body, evaluation.source);
    continueAfterThresholdAttack();
    return;
  }

  if (attack.id === "join") {
    state.activeCase.blockedRemoval = true;
    if (state.activeCase.currentCourt === "federal" && !state.activeCase.federalQuestion) {
      state.activeCase.currentCourt = "state";
    }
    state.attackCount += 1;
    state.docket.push({
      title: "Local party joined",
      detail: "Diversity leverage is reduced and removal is blocked."
    });
    setJudge("bad", "Joinder changes the forum math", body || evaluation.body, evaluation.source);
    continueAfterThresholdAttack();
    return;
  }

  if (attack.id === "venue") {
    state.activeCase.currentForum = state.activeCase.eventState;
    state.attackCount += 1;
    state.docket.push({
      title: "Transferred",
      detail: `Venue moves to ${state.activeCase.eventState}.`
    });
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
  state.docket.push({
    title: "Threshold attacks closed",
    detail: "The case moves into discovery."
  });
  enterDiscovery();
}

function enterDiscovery() {
  if (!state.activeCase || state.activeCase.dismissed) return;
  stopTimer();
  state.phase = "discovery";
  setJudge(
    "neutral",
    "Discovery opened",
    "Collect every listed proof item. If discovery closes with a missing element, the defense can use Rule 56 to press for summary judgment.",
    "FRCP 26(b)(1), 30, 34, and 37 are collapsed into discovery tool cards."
  );
  render();
}

function requestEvidence(evidenceId, toolId) {
  if (state.phase !== "discovery" || !state.activeCase) return;
  const evidence = state.activeCase.evidence.find((item) => item.id === evidenceId);
  const tool = MOTION_CARDS.find((item) => item.id === toolId);
  if (!evidence || !tool || tool.kind !== "discovery-tool") return;

  if (tool.tool !== evidence.tool) {
    state.docket.push({
      title: "Wrong discovery tool",
      detail: `${tool.title} does not match ${evidence.title}.`
    });
    setJudge(
      "bad",
      "Discovery miss",
      `${evidence.title} calls for ${toolName(evidence.tool)}. Choose the tool that fits the proof item.`,
      "The game maps discovery tools to their ordinary Civ Pro use."
    );
    render();
    return;
  }

  const resistance = evidence.resistance || "resistance";
  const needsMotion = Boolean(evidence.resistance);
  state.docket.push({
    title: tool.title,
    detail: `${state.players[state.plaintiff].name} targets ${evidence.title}.`
  });

  if (!needsMotion) {
    collectEvidence(evidence);
    if (state.phase !== "trial") {
      setJudge(
        "good",
        "Discovery obtained",
        `${evidence.title} is collected. No serious objection blocked this targeted request.`,
        "Targeted discovery generally proceeds when relevant and proportional."
      );
    }
    render();
    return;
  }

  evidence.pendingResistance = resistance;
  setJudge(
    "neutral",
    "Discovery objection raised",
    `The defense objects on ${resistanceLabel(resistance)} grounds. Use a discovery motion card to solve it.`,
    "Rule 37 permits motions to compel after discovery resistance; privilege problems may require a privilege log instead."
  );
  render();
}

function answerDiscoveryResistance(evidenceId, motionId) {
  if (state.phase !== "discovery" || !state.activeCase) return;
  const evidence = state.activeCase.evidence.find((item) => item.id === evidenceId);
  const motion = MOTION_CARDS.find((item) => item.id === motionId);
  if (!evidence || !motion || !evidence.pendingResistance) return;

  const resistance = evidence.pendingResistance;
  const works = motion.answers.includes(resistance);
  state.docket.push({
    title: motion.title,
    detail: motion.text
  });

  if (!works) {
    delete evidence.pendingResistance;
    evidence.failed = true;
    setJudge(
      "bad",
      "Discovery denied",
      `${motion.title} does not solve a ${resistanceLabel(resistance)} objection. The proof item remains missing for summary judgment.`,
      "Discovery disputes require the right procedural response, not merely any motion."
    );
    render();
    return;
  }

  delete evidence.pendingResistance;
  collectEvidence(evidence);
  if (state.phase !== "trial") {
    setJudge(
      "good",
      "Discovery motion granted",
      `${motion.title} answers the objection. ${evidence.title} is now in the record.`,
      "This abstracts Rule 37 motion-to-compel practice and privilege narrowing."
    );
  }
  render();
}

function collectEvidence(evidence) {
  evidence.complete = true;
  evidence.failed = false;
  if (!state.activeCase.collectedEvidence.includes(evidence.id)) {
    state.activeCase.collectedEvidence.push(evidence.id);
  }
  state.docket.push({
    title: "Evidence collected",
    detail: evidence.title
  });
  if (allEvidenceCollected()) {
    state.phase = "trial";
    awardTrialReady();
  }
}

function closeDiscovery() {
  if (state.phase !== "discovery") return;
  state.phase = "summary";
  setJudge(
    "neutral",
    "Discovery closed",
    "The defense may now play summary judgment. The plaintiff must show record evidence for every required proof item.",
    "Rule 56 turns the discovery record into the next procedural fight."
  );
  render();
}

function resolveSummaryJudgment(motion, motionIsResponsive) {
  const missing = missingEvidence();
  state.docket.push({
    title: "Rule 56 motion",
    detail: missing.length ? `Missing proof: ${missing.map((item) => item.title).join(", ")}.` : "Plaintiff has evidence on every listed item."
  });

  if (!motion || !motionIsResponsive) {
    if (missing.length) {
      dismissCase(
        "Summary judgment",
        "The plaintiff did not answer the Rule 56 motion with record evidence for every required element.",
        "FRCP 56"
      );
      return;
    }
    awardTrialReady();
    setJudge("good", "Summary judgment denied", "The record contains every required proof item, so the claim is trial ready.", "FRCP 56");
    return;
  }

  state.docket.push({
    title: `${motion.title} filed`,
    detail: motion.text
  });

  if (missing.length) {
    dismissCase(
      "Summary judgment",
      `${motion.title} cannot invent missing evidence. Missing: ${missing.map((item) => item.title).join(", ")}.`,
      "FRCP 56"
    );
    return;
  }

  awardTrialReady();
  setJudge("good", "Summary judgment denied", "The plaintiff points to a complete discovery record. The claim scores as trial ready.", "FRCP 56");
}

function awardTrialReady() {
  const points = state.activeCase.federalQuestion ? 3 : state.activeCase.amount > 100000 ? 3 : 2;
  state.players[state.plaintiff].score += points;
  state.phase = "trial";
  state.docket.push({
    title: "Trial ready",
    detail: `${state.players[state.plaintiff].name} scores ${points} points.`
  });
  setJudge(
    "good",
    "Claim reaches trial",
    `The plaintiff survives threshold attacks and builds the record. Score ${points} points, then rotate roles.`,
    "The game treats trial readiness as the Civ Pro win condition."
  );
  stopTimer();
  render();
}

function dismissCase(title, body, source) {
  state.activeCase.dismissed = true;
  state.players[state.defense].score += 1;
  state.players[state.plaintiff].dismissed += 1;
  state.phase = "trial";
  state.docket.push({
    title: "Claim dismissed",
    detail: title
  });
  setJudge("bad", title, `${body} Defense scores 1 point.`, source);
  stopTimer();
  render();
}

function nextRound() {
  stopTimer();
  state.round += 1;
  const oldPlaintiff = state.plaintiff;
  state.plaintiff = state.defense;
  state.defense = oldPlaintiff;
  startRound();
}

function evaluateAttack(attackId) {
  const c = state.activeCase;
  const d = state.selectedDefendant;
  const diversity = hasCompleteDiversity(c, d);
  const hasFederalSmj = c.federalQuestion || (diversity && c.amount > 75000);
  const venueProper = c.currentForum === c.eventState || d.contacts.includes(c.currentForum);
  const localJoiner = c.defendants.find((item) => item.forumDefendant && item.id !== d.id && item.sameTransaction);

  switch (attackId) {
    case "pj": {
      const hasContacts = d.contacts.includes(c.currentForum) || d.state === c.currentForum || d.ppb === c.currentForum;
      return {
        hasMerit: !hasContacts,
        counterWorks: hasContacts,
        prompt: "Plaintiff must point to forum contacts, domicile, consent, or forum-linked conduct.",
        body: `${d.name} has no meaningful ${c.currentForum} contact in the case data.`,
        winDetail: `${d.name} has forum contacts tied to ${c.currentForum}, so the personal-jurisdiction attack fails.`,
        source: "Personal jurisdiction and FRCP 12(b)(2)"
      };
    }
    case "smj": {
      const attackHasMerit = c.currentCourt === "federal" && !hasFederalSmj;
      return {
        hasMerit: attackHasMerit,
        counterWorks: hasFederalSmj,
        prompt: "Plaintiff must show federal question jurisdiction or diversity plus more than $75,000.",
        body: "Federal court lacks original jurisdiction in the current setup.",
        winDetail: c.federalQuestion
          ? "The claim arises under federal law, so federal-question jurisdiction supports the case."
          : "Complete diversity and more than $75,000 support diversity jurisdiction.",
        source: "28 U.S.C. 1331/1332 and FRCP 12(b)(1)"
      };
    }
    case "venue": {
      return {
        hasMerit: !venueProper,
        counterWorks: true,
        prompt: "Plaintiff can either show venue connections or transfer instead of losing the claim.",
        body: `${c.currentForum} is weak because the events and selected defendant do not connect there.`,
        winDetail: `${c.currentForum} has venue connections through the events or defendant contacts.`,
        cureDetail: `The case is transferred to ${c.eventState}, keeping the claim alive but costing tempo.`,
        source: "Venue and Rule 12(b)(3)"
      };
    }
    case "remove": {
      const removable = c.currentCourt === "state" && hasFederalSmj && !d.forumDefendant && !c.blockedRemoval;
      const reason = c.federalQuestion
        ? "Federal question supports original jurisdiction."
        : diversity && c.amount > 75000
          ? "Complete diversity and amount in controversy support original jurisdiction."
          : "No federal-question or diversity basis supports original jurisdiction.";
      return {
        hasMerit: removable,
        counterWorks: !removable,
        prompt: "Plaintiff can remand if removal lacks original federal jurisdiction or hits the forum-defendant limit.",
        body: `${reason} Removal is proper in this simplified model.`,
        winDetail: c.currentCourt !== "state"
          ? "The case is already in federal court, so removal is unavailable."
          : d.forumDefendant || c.blockedRemoval
            ? "A properly joined forum defendant blocks diversity removal."
            : "Removal is improper because federal original jurisdiction is missing.",
        source: "28 U.S.C. 1441"
      };
    }
    case "join": {
      const canJoin = Boolean(localJoiner);
      return {
        hasMerit: canJoin,
        counterWorks: !canJoin,
        prompt: "Plaintiff can oppose if the added party is unrelated or merely tactical.",
        body: canJoin
          ? `${localJoiner.name} is a forum defendant tied to the same transaction, complicating diversity/removal.`
          : "No same-transaction forum defendant is available from the case data.",
        winDetail: "The proposed joinder is not supported by the case facts.",
        source: "Joinder strategy plus diversity/removal limits"
      };
    }
    case "failure-state-claim": {
      const thinPleading = c.pleadingLevel < 2;
      return {
        hasMerit: thinPleading,
        counterWorks: true,
        prompt: "Plaintiff can ask for leave to amend if the complaint is factually thin.",
        body: "The complaint is too bare to move into discovery without amendment.",
        winDetail: "The complaint already states enough factual matter for the game to proceed.",
        cureDetail: "Leave to amend is granted. The pleading is treated as cured.",
        source: "FRCP 12(b)(6) pleading challenge"
      };
    }
    case "summary-judgment": {
      const missing = missingEvidence();
      return {
        hasMerit: missing.length > 0,
        counterWorks: missing.length === 0,
        prompt: "Plaintiff must show record evidence for each listed proof item.",
        body: missing.length
          ? `The discovery record is missing ${missing.map((item) => item.title).join(", ")}.`
          : "The discovery record covers every proof item.",
        winDetail: "Record evidence exists for every required proof item.",
        source: "FRCP 56"
      };
    }
    default:
      return {
        hasMerit: false,
        counterWorks: false,
        prompt: "No rule found.",
        body: "No rule found.",
        winDetail: "No rule found.",
        source: "Prototype rule engine"
      };
  }
}

function hasCompleteDiversity(c, d) {
  const defendantStates = new Set([d.state, d.ppb].filter(Boolean));
  if (c.joinedForumDefendant || c.blockedRemoval) defendantStates.add(c.forumState);
  return !defendantStates.has(c.plaintiff.state);
}

function allEvidenceCollected() {
  return state.activeCase.evidence.every((item) => item.complete);
}

function missingEvidence() {
  if (!state.activeCase) return [];
  return state.activeCase.evidence.filter((item) => !item.complete);
}

function startTimer(label, seconds, onExpire) {
  stopTimer();
  if (els["study-mode"].checked) {
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
  if (state.timer) {
    window.clearInterval(state.timer);
  }
  state.timer = null;
  state.deadline = null;
  state.secondsLeft = null;
}

function setJudge(tone, title, body, cite) {
  state.judge = { tone, title, body, cite };
}

function render() {
  renderScores();
  renderTimer();
  renderPhases();
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
  els["timer-label"].textContent = state.deadline?.label || (els["study-mode"].checked ? "Study mode" : "No deadline");
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

function renderSources() {
  els["source-list"].innerHTML = SOURCES.map((source) => `
    <li><a href="${source.href}" target="_blank" rel="noreferrer">${source.label}</a>: ${source.note}</li>
  `).join("");
}

function renderClaimHand() {
  els["claim-hand"].innerHTML = state.claimHand.map((claim) => {
    const disabled = state.phase !== "claim";
    return `
      <button class="playing-card ${state.activeCase?.id === claim.id ? "selected" : ""}" ${disabled ? "disabled" : ""} data-action="file-claim" data-id="${claim.id}">
        <span class="card-type">Claim</span>
        <h3>${claim.title}</h3>
        <p>${claim.summary}</p>
        <div class="card-meta">
          <span class="tag">${claim.plaintiff.state} plaintiff</span>
          <span class="tag">${claim.forumState} ${claim.court}</span>
          <span class="tag">${formatMoney(claim.amount)}</span>
        </div>
      </button>
    `;
  }).join("");
  els["claim-hand"].querySelectorAll("[data-action='file-claim']").forEach((button) => {
    button.addEventListener("click", () => fileClaim(button.dataset.id));
  });
}

function renderActiveCase() {
  if (!state.activeCase) {
    els["active-case"].innerHTML = `
      <div class="empty-state">
        <div>
          <strong>No active claim</strong>
          <p>Pick a case card to begin a round.</p>
        </div>
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
        <div>
          <dt>Plaintiff</dt>
          <dd>${c.plaintiff.name} (${c.plaintiff.state})</dd>
        </div>
        <div>
          <dt>Forum</dt>
          <dd>${c.currentForum || c.forumState} ${c.currentCourt || c.court}</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>${formatMoney(c.amount)}</dd>
        </div>
        <div>
          <dt>Claim</dt>
          <dd>${c.type}</dd>
        </div>
      </dl>
      <p>${c.venueFacts}</p>
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
          <div><span>Removal</span><strong>${status.removal}</strong></div>
        </div>
      ` : ""}
      <ul class="docket-list">
        ${state.docket.map((entry) => `<li><strong>${entry.title}</strong>${entry.detail}</li>`).join("")}
      </ul>
    </div>
  `;

  els["active-case"].querySelectorAll("[data-action='choose-defendant']").forEach((button) => {
    button.addEventListener("click", () => chooseDefendant(button.dataset.id));
  });
  const pass = els["active-case"].querySelector("[data-action='pass-attacks']");
  const close = els["active-case"].querySelector("[data-action='close-discovery']");
  const next = els["active-case"].querySelector("[data-action='next-round']");
  if (pass) pass.addEventListener("click", passAttacks);
  if (close) close.addEventListener("click", closeDiscovery);
  if (next) next.addEventListener("click", nextRound);
}

function renderAttackHand() {
  els["attack-hand"].innerHTML = ATTACK_CARDS.map((card) => {
    const disabled = card.timing === "summary" ? state.phase !== "summary" : state.phase !== "attack";
    return `
      <button class="playing-card" ${disabled ? "disabled" : ""} data-action="attack" data-id="${card.id}">
        <span class="card-type attack">${card.title}</span>
        <h3>${card.subtitle}</h3>
        <p>${card.text}</p>
        <div class="card-meta">
          <span class="tag">${card.timing === "summary" ? "After discovery" : "Threshold"}</span>
        </div>
      </button>
    `;
  }).join("");
  els["attack-hand"].querySelectorAll("[data-action='attack']").forEach((button) => {
    button.addEventListener("click", () => playAttack(button.dataset.id));
  });
}

function renderMotionHand() {
  const cards = MOTION_CARDS.filter((card) => card.kind === "motion" || card.kind === "discovery");
  els["motion-hand"].innerHTML = cards.map((card) => {
    const isMotion = card.kind === "motion";
    const disabled = isMotion ? state.phase !== "response" : !hasPendingDiscoveryResistance();
    return `
      <button class="playing-card" ${disabled ? "disabled" : ""} data-action="${isMotion ? "motion" : "discovery-response"}" data-id="${card.id}">
        <span class="card-type ${isMotion ? "motion" : "discovery"}">${isMotion ? "Motion" : "Discovery"}</span>
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </button>
    `;
  }).join("");
  els["motion-hand"].querySelectorAll("[data-action='motion']").forEach((button) => {
    button.addEventListener("click", () => respondWithMotion(button.dataset.id));
  });
  els["motion-hand"].querySelectorAll("[data-action='discovery-response']").forEach((button) => {
    button.addEventListener("click", () => {
      const pending = state.activeCase?.evidence.find((item) => item.pendingResistance);
      if (pending) answerDiscoveryResistance(pending.id, button.dataset.id);
    });
  });
}

function renderDiscovery() {
  if (!state.activeCase || !state.selectedDefendant) {
    els["discovery-list"].innerHTML = `<div class="empty-state"><div><strong>No checklist yet</strong><p>File a claim and choose a defendant first.</p></div></div>`;
    return;
  }
  const toolCards = MOTION_CARDS.filter((card) => card.kind === "discovery-tool");
  els["discovery-list"].innerHTML = state.activeCase.evidence.map((item) => {
    const complete = item.complete;
    const pending = item.pendingResistance;
    return `
      <article class="evidence-item ${complete ? "complete" : ""}">
        <span class="card-type discovery">${complete ? "Collected" : pending ? "Objected" : "Needed"}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="card-meta">
          <span class="tag">${toolName(item.tool)}</span>
          ${item.resistance ? `<span class="tag">${resistanceLabel(item.resistance)}</span>` : ""}
        </div>
        <div class="case-actions">
          ${toolCards.map((tool) => `
            <button class="button secondary" data-action="request-evidence" data-evidence="${item.id}" data-tool="${tool.id}" ${state.phase !== "discovery" || complete || pending ? "disabled" : ""}>${tool.title}</button>
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
  els["judge-output"].innerHTML = `
    <span class="ruling ${tone}">${tone === "good" ? "Granted" : tone === "bad" ? "Problem" : "Bench note"}</span>
    <h3>${state.judge.title}</h3>
    <p>${state.judge.body}</p>
    <p><strong>Source hook:</strong> ${state.judge.cite}</p>
  `;
}

function statusFacts(c, d) {
  const diversity = hasCompleteDiversity(c, d);
  const federalSmj = c.federalQuestion || (diversity && c.amount > 75000);
  const pj = d.contacts.includes(c.currentForum || c.forumState) || d.state === (c.currentForum || c.forumState) || d.ppb === (c.currentForum || c.forumState);
  const removable = (c.currentCourt || c.court) === "state" && federalSmj && !d.forumDefendant && !c.blockedRemoval;
  return {
    diversity: diversity ? "Complete" : "Broken",
    smj: federalSmj ? "Yes" : (c.currentCourt || c.court) === "state" ? "State general" : "No",
    pj: pj ? "Present" : "Weak",
    removal: removable ? "Available" : "Blocked"
  };
}

function hasPendingDiscoveryResistance() {
  return Boolean(state.activeCase?.evidence.some((item) => item.pendingResistance));
}

function toolName(tool) {
  const names = {
    deposition: "Deposition",
    rfp: "Request for production",
    admission: "Request for admission",
    expert: "Expert proof"
  };
  return names[tool] || tool;
}

function resistanceLabel(resistance) {
  const labels = {
    burden: "undue burden",
    privacy: "privacy/proportionality",
    privilege: "privilege",
    resistance: "general resistance"
  };
  return labels[resistance] || resistance;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

document.addEventListener("DOMContentLoaded", init);
