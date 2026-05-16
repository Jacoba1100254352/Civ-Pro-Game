export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function activeByTopic(items, activeTopics) {
  return items.filter((item) => item.topics?.some((topic) => activeTopics.has(topic)) || activeTopics.has(item.topic));
}

export function withInstance(card, sequence) {
  return { ...clone(card), instanceId: `${card.id}-${sequence}` };
}

export function hasCompleteDiversity(c, d) {
  if (!c || !d) return false;
  const defendantStates = new Set([d.state, d.ppb].filter(Boolean));
  if (c.joinedForumDefendant || c.blockedRemoval) {
    defendantStates.add(c.forumState);
  }
  return !defendantStates.has(c.plaintiff.state);
}

export function hasFederalSmj(c, d) {
  if (!c) return false;
  if (c.federalQuestion) return true;
  return Boolean(d && hasCompleteDiversity(c, d) && c.amount > 75000);
}

export function statusFacts(c, d) {
  const currentCourt = c.currentCourt || c.court;
  const currentForum = c.currentForum || c.forumState;
  const diversity = hasCompleteDiversity(c, d);
  const federalSmj = hasFederalSmj(c, d);
  const pj = Boolean(d && (d.contacts.includes(currentForum) || d.state === currentForum || d.ppb === currentForum));
  const removable = currentCourt === "state" && federalSmj && !d?.forumDefendant && !c.blockedRemoval;
  return {
    diversity: diversity ? "Complete" : "Broken",
    smj: federalSmj ? "Yes" : currentCourt === "state" ? "State general" : "No",
    pj: pj ? "Present" : "Weak",
    service: c.serviceProper ? "Proper" : "Defective",
    removal: removable ? "Available" : "Blocked",
    supplemental: c.supplementalClaim
      ? c.supplementalClaim.related && c.supplementalClaim.anchorFederal
        ? "Likely"
        : "Weak"
      : "None"
  };
}

export function evaluateAttack({ attack, activeCase: c, selectedDefendant: d, attackCount, missingEvidence }) {
  const currentCourt = c.currentCourt || c.court;
  const currentForum = c.currentForum || c.forumState;
  const diversity = hasCompleteDiversity(c, d);
  const federalSmj = hasFederalSmj(c, d);
  const venueProper = currentForum === c.eventState || d.contacts.includes(currentForum);
  const localJoiner = c.defendants.find((item) => item.forumDefendant && item.id !== d.id && item.sameTransaction);
  const waivableLate = attackCount > 0 && ["pj", "late-rule12", "venue", "service"].includes(attack.id) && !c.rule12Preserved;

  if (waivableLate) {
    return {
      hasMerit: false,
      counterWorks: true,
      prompt: "Plaintiff can object that this waivable Rule 12 defense came too late.",
      body: "The defense was not consolidated into the first Rule 12 response in this simplified model.",
      winDetail: `${attack.subtitle} is waived because it was raised after an earlier threshold move.`,
      source: "FRCP 12(g) and 12(h)"
    };
  }

  switch (attack.id) {
    case "pj": {
      const hasContacts = d.contacts.includes(currentForum) || d.state === currentForum || d.ppb === currentForum;
      return {
        hasMerit: !hasContacts,
        counterWorks: hasContacts,
        prompt: "Plaintiff must point to forum contacts, domicile, consent, or forum-linked conduct.",
        body: `${d.name} has no meaningful ${currentForum} contact in the case data.`,
        winDetail: `${d.name} has forum contacts tied to ${currentForum}, so the personal-jurisdiction attack fails.`,
        source: "Personal jurisdiction and FRCP 12(b)(2)"
      };
    }
    case "late-rule12": {
      const hasContacts = d.contacts.includes(currentForum) || d.state === currentForum || d.ppb === currentForum;
      return {
        hasMerit: !hasContacts,
        counterWorks: hasContacts,
        prompt: "This card tests Rule 12 consolidation and the underlying waivable defense.",
        body: `${d.name} lacks forum contacts and the defense was raised in time.`,
        winDetail: hasContacts
          ? "The underlying defense is weak because forum contacts are present."
          : "The defense was raised in the first threshold window.",
        source: "FRCP 12(g) and 12(h)"
      };
    }
    case "service": {
      return {
        hasMerit: !c.serviceProper,
        counterWorks: true,
        prompt: "Plaintiff can cure defective service if the problem is caught early.",
        body: "Service is defective in the case data.",
        winDetail: "Service is already proper, so the attack fails.",
        cureDetail: "Service is cured and the case stays alive.",
        source: "FRCP 4 and FRCP 12(b)(5)"
      };
    }
    case "smj": {
      const attackHasMerit = currentCourt === "federal" && !federalSmj;
      return {
        hasMerit: attackHasMerit,
        counterWorks: federalSmj,
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
        body: `${currentForum} is weak because the events and selected defendant do not connect there.`,
        winDetail: `${currentForum} has venue connections through the events or defendant contacts.`,
        cureDetail: `The case is transferred to ${c.eventState}, keeping the claim alive but costing tempo.`,
        source: "Venue and Rule 12(b)(3)"
      };
    }
    case "remove": {
      const removable = currentCourt === "state" && federalSmj && !d.forumDefendant && !c.blockedRemoval;
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
        winDetail: currentCourt !== "state"
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
    case "supplemental": {
      const claim = c.supplementalClaim;
      const supported = Boolean(claim?.related && claim?.anchorFederal);
      return {
        hasMerit: Boolean(claim && !supported),
        counterWorks: supported,
        prompt: "Plaintiff must show the added state claim shares a common nucleus with an anchor federal claim.",
        body: claim
          ? `${claim.title} is too unrelated to ride with the anchor claim.`
          : "There is no supplemental claim to attack.",
        winDetail: claim
          ? `${claim.title} shares operative facts with the federal anchor claim.`
          : "No supplemental claim is in play.",
        source: "28 U.S.C. 1367"
      };
    }
    case "erie": {
      const erieProblem = currentCourt === "federal" && Boolean(c.stateLawConflict);
      return {
        hasMerit: erieProblem,
        counterWorks: true,
        prompt: "Plaintiff must identify state substantive law versus federal procedure.",
        body: "The case is in federal court on state-law rights and has an unresolved state-law conflict.",
        winDetail: "No Erie conflict is live in this case state.",
        cureDetail: "State substantive law is applied and federal procedure remains available.",
        source: "Erie doctrine preview"
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
    case "class-cert": {
      const problem = Boolean(c.classAction && !c.rule23Ready);
      return {
        hasMerit: problem,
        counterWorks: true,
        prompt: "Plaintiff must show Rule 23 fit in this preview module.",
        body: "The class device is not yet supported by the case record.",
        winDetail: c.classAction ? "Rule 23 fit has already been shown." : "This is not a class-action claim.",
        cureDetail: "The class-action preview gate is satisfied.",
        source: "FRCP 23 preview"
      };
    }
    case "summary-judgment": {
      return {
        hasMerit: missingEvidence.length > 0,
        counterWorks: missingEvidence.length === 0,
        prompt: "Plaintiff must show record evidence for each listed proof item.",
        body: missingEvidence.length
          ? `The discovery record is missing ${missingEvidence.map((item) => item.title).join(", ")}.`
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

export function allEvidenceCollected(activeCase) {
  return Boolean(activeCase?.evidence.every((item) => item.complete));
}

export function missingEvidence(activeCase) {
  if (!activeCase) return [];
  return activeCase.evidence.filter((item) => !item.complete);
}

export function toolName(tool) {
  const names = {
    deposition: "Deposition",
    rfp: "Request for production",
    admission: "Request for admission",
    expert: "Expert proof"
  };
  return names[tool] || tool;
}

export function resistanceLabel(resistance) {
  const labels = {
    burden: "undue burden",
    privacy: "privacy/proportionality",
    privilege: "privilege",
    resistance: "general resistance"
  };
  return labels[resistance] || resistance;
}

export function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
