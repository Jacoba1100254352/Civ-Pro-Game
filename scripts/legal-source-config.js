export const REQUIRED_ENV_KEYS = [
  {
    key: "GOVINFO_API_KEY",
    provider: "govinfo",
    reason: "Fetch official federal package and collection metadata from govinfo."
  },
  {
    key: "COURTLISTENER_API_TOKEN",
    provider: "courtlistener",
    reason: "Fetch court opinions, dockets, and RECAP-backed examples from CourtListener."
  },
  {
    key: "CONGRESS_API_KEY",
    provider: "congress",
    reason: "Fetch federal bill and legislative-history metadata from Congress.gov."
  },
  {
    key: "OPENSTATES_API_KEY",
    provider: "openstates",
    reason: "Fetch state legislative metadata for future state-procedure expansions."
  },
  {
    key: "PACER_USERNAME",
    provider: "pacer",
    reason: "Optional direct PACER access for docket material; use only in server-side import jobs."
  },
  {
    key: "PACER_PASSWORD",
    provider: "pacer",
    reason: "Optional direct PACER access for docket material; use only in server-side import jobs."
  }
];

export const SOURCE_PROVIDERS = [
  {
    id: "frcp-official",
    label: "U.S. Courts Federal Rules of Civil Procedure",
    type: "official-page",
    href: "https://www.uscourts.gov/forms-rules/current-rules-practice-procedure/federal-rules-civil-procedure",
    envKeys: [],
    gameUse: "Canonical FRCP reference point for rule text, pending amendments, and committee materials."
  },
  {
    id: "cornell-lii",
    label: "Cornell Legal Information Institute",
    type: "public-web",
    href: "https://www.law.cornell.edu/rules/frcp",
    envKeys: [],
    gameUse: "Readable rule and statute pages for in-game source links and student-facing doctrine notes."
  },
  {
    id: "courtlistener",
    label: "CourtListener REST API",
    type: "api",
    href: "https://www.courtlistener.com/help/api/rest/",
    envKeys: ["COURTLISTENER_API_TOKEN"],
    gameUse: "Opinion and docket examples for procedural-card fact patterns."
  },
  {
    id: "govinfo",
    label: "govinfo API",
    type: "api",
    href: "https://api.govinfo.gov/docs",
    envKeys: ["GOVINFO_API_KEY"],
    gameUse: "Official federal package metadata for the U.S. Code, Federal Register, and rulemaking materials."
  },
  {
    id: "federal-register",
    label: "FederalRegister.gov API",
    type: "api",
    href: "https://www.federalregister.gov/developers/documentation/api/v1",
    envKeys: [],
    gameUse: "No-key public API for rulemaking notices and regulatory context."
  },
  {
    id: "ecfr",
    label: "eCFR API",
    type: "api",
    href: "https://www.ecfr.gov/developers/documentation/api/v1",
    envKeys: [],
    gameUse: "No-key public API for CFR snapshots and future regulation-based scenarios."
  },
  {
    id: "congress",
    label: "Congress.gov API",
    type: "api",
    href: "https://api.congress.gov/",
    envKeys: ["CONGRESS_API_KEY"],
    gameUse: "Legislative metadata for statutes, amendments, and future statutory-civil-procedure modules."
  },
  {
    id: "openstates",
    label: "Open States API v3",
    type: "api",
    href: "https://docs.openstates.org/api-v3/",
    envKeys: ["OPENSTATES_API_KEY"],
    gameUse: "State legislative material for later state-court and state-procedure modules."
  },
  {
    id: "pacer",
    label: "PACER / RECAP source path",
    type: "restricted-api",
    href: "https://pacer.uscourts.gov/",
    envKeys: ["PACER_USERNAME", "PACER_PASSWORD"],
    gameUse: "Optional direct docket access. Prefer CourtListener/RECAP first because direct PACER can be credentialed and fee-bearing."
  }
];

export const DOCTRINE_SOURCES = [
  {
    id: "frcp-4",
    citation: "FRCP 4",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_4",
    topic: "Service of process",
    gameUse: "Service challenge cards, cure-service motions, and waiver timing."
  },
  {
    id: "frcp-8",
    citation: "FRCP 8",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_8",
    topic: "Pleading baseline",
    gameUse: "Plausibility and complaint-sufficiency tuning for Rule 12(b)(6)."
  },
  {
    id: "frcp-12",
    citation: "FRCP 12",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_12",
    topic: "Threshold defenses and waiver",
    gameUse: "Attack timing, motion-response windows, and waived defenses."
  },
  {
    id: "frcp-13",
    citation: "FRCP 13",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_13",
    topic: "Counterclaims and crossclaims",
    gameUse: "Future expansion for compulsory counterclaim pressure."
  },
  {
    id: "frcp-14",
    citation: "FRCP 14",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_14",
    topic: "Third-party practice",
    gameUse: "Impleader attack and party-complication cards."
  },
  {
    id: "frcp-15",
    citation: "FRCP 15",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_15",
    topic: "Amended and supplemental pleadings",
    gameUse: "Leave-to-amend counters to pleading attacks."
  },
  {
    id: "frcp-18",
    citation: "FRCP 18",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_18",
    topic: "Claim joinder",
    gameUse: "Claim-stacking decisions during case setup."
  },
  {
    id: "frcp-19",
    citation: "FRCP 19",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_19",
    topic: "Required joinder of parties",
    gameUse: "Necessary-party challenge cards."
  },
  {
    id: "frcp-20",
    citation: "FRCP 20",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_20",
    topic: "Permissive party joinder",
    gameUse: "Join-party cards that can help or hurt jurisdiction."
  },
  {
    id: "frcp-23",
    citation: "FRCP 23",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_23",
    topic: "Class actions",
    gameUse: "Preview class-certification module."
  },
  {
    id: "frcp-26",
    citation: "FRCP 26",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_26",
    topic: "Discovery scope and disclosures",
    gameUse: "Discovery checklist, proportionality pressure, and expert proof."
  },
  {
    id: "frcp-30",
    citation: "FRCP 30",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_30",
    topic: "Depositions",
    gameUse: "Deposition discovery cards."
  },
  {
    id: "frcp-34",
    citation: "FRCP 34",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_34",
    topic: "Requests for production",
    gameUse: "Document-request discovery cards."
  },
  {
    id: "frcp-36",
    citation: "FRCP 36",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_36",
    topic: "Requests for admission",
    gameUse: "Admission and narrowing cards."
  },
  {
    id: "frcp-37",
    citation: "FRCP 37",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_37",
    topic: "Discovery sanctions and motions to compel",
    gameUse: "Motion-to-compel and sanction response cards."
  },
  {
    id: "frcp-56",
    citation: "FRCP 56",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/rules/frcp/rule_56",
    topic: "Summary judgment",
    gameUse: "End-of-discovery attack when proof elements remain missing."
  },
  {
    id: "usc-28-1331",
    citation: "28 U.S.C. 1331",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/uscode/text/28/1331",
    topic: "Federal question jurisdiction",
    gameUse: "Federal-question case cards and supplemental-jurisdiction anchors."
  },
  {
    id: "usc-28-1332",
    citation: "28 U.S.C. 1332",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/uscode/text/28/1332",
    topic: "Diversity jurisdiction",
    gameUse: "Complete-diversity and amount-in-controversy checks."
  },
  {
    id: "usc-28-1367",
    citation: "28 U.S.C. 1367",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/uscode/text/28/1367",
    topic: "Supplemental jurisdiction",
    gameUse: "Tagalong claim cards and supplemental-jurisdiction attacks."
  },
  {
    id: "usc-28-1391",
    citation: "28 U.S.C. 1391",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/uscode/text/28/1391",
    topic: "Venue",
    gameUse: "Improper-venue and transfer cards."
  },
  {
    id: "usc-28-1441",
    citation: "28 U.S.C. 1441",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/uscode/text/28/1441",
    topic: "Removal",
    gameUse: "Removal attack, forum-defendant rule, and remand counterplay."
  },
  {
    id: "usc-28-1446",
    citation: "28 U.S.C. 1446",
    provider: "cornell-lii",
    href: "https://www.law.cornell.edu/uscode/text/28/1446",
    topic: "Removal procedure",
    gameUse: "Removal-deadline and procedural-defect variants."
  }
];

export const LIVE_PROBES = [
  {
    id: "courtlistener-rule-12-search",
    provider: "courtlistener",
    label: "CourtListener Rule 12 opinion search",
    envKeys: ["COURTLISTENER_API_TOKEN"],
    method: "GET",
    url: "https://www.courtlistener.com/api/rest/v4/search/",
    query: {
      q: "\"Rule 12(b)(6)\" \"motion to dismiss\"",
      type: "o",
      page_size: "3"
    },
    headers: {
      Authorization: "Token ${COURTLISTENER_API_TOKEN}"
    },
    gameUse: "Seed real-world motion-to-dismiss example fact patterns."
  },
  {
    id: "govinfo-uscode-collection",
    provider: "govinfo",
    label: "govinfo U.S. Code collection probe",
    envKeys: ["GOVINFO_API_KEY"],
    method: "GET",
    url: "https://api.govinfo.gov/collections/USCODE/2024-01-01T00:00:00Z",
    query: {
      pageSize: "3",
      offsetMark: "*",
      api_key: "${GOVINFO_API_KEY}"
    },
    gameUse: "Verify official U.S. Code package access before statute ingestion."
  },
  {
    id: "federal-register-civil-procedure",
    provider: "federal-register",
    label: "Federal Register civil procedure document probe",
    envKeys: [],
    method: "GET",
    url: "https://www.federalregister.gov/api/v1/documents.json",
    query: {
      "conditions[term]": "\"civil procedure\"",
      per_page: "3",
      order: "newest"
    },
    gameUse: "Find rulemaking context and amendment notices."
  },
  {
    id: "ecfr-title-index",
    provider: "ecfr",
    label: "eCFR title index probe",
    envKeys: [],
    method: "GET",
    url: "https://www.ecfr.gov/api/versioner/v1/titles.json",
    query: {},
    gameUse: "Verify public CFR metadata access for future regulation cards."
  },
  {
    id: "congress-bill-index",
    provider: "congress",
    label: "Congress.gov recent bill probe",
    envKeys: ["CONGRESS_API_KEY"],
    method: "GET",
    url: "https://api.congress.gov/v3/bill",
    query: {
      limit: "3",
      api_key: "${CONGRESS_API_KEY}"
    },
    gameUse: "Verify legislative metadata access for statutory-update modules."
  },
  {
    id: "openstates-jurisdictions",
    provider: "openstates",
    label: "Open States jurisdiction probe",
    envKeys: ["OPENSTATES_API_KEY"],
    method: "GET",
    url: "https://v3.openstates.org/jurisdictions",
    query: {},
    headers: {
      "X-API-KEY": "${OPENSTATES_API_KEY}"
    },
    gameUse: "Verify state-legislative metadata access for state-court expansions."
  }
];
