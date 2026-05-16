import { LEGAL_SOURCE_CARDS, LEGAL_SOURCE_MANIFEST } from "../legal-sources.generated.js";

const failures = [];

const requiredProviders = [
  "frcp-official",
  "cornell-lii",
  "courtlistener",
  "govinfo",
  "federal-register",
  "ecfr",
  "congress",
  "openstates",
  "pacer"
];

const requiredCitations = [
  "FRCP 4",
  "FRCP 12",
  "FRCP 26",
  "FRCP 56",
  "28 U.S.C. 1331",
  "28 U.S.C. 1332",
  "28 U.S.C. 1367",
  "28 U.S.C. 1441"
];

for (const providerId of requiredProviders) {
  if (!LEGAL_SOURCE_MANIFEST.providers.some((provider) => provider.id === providerId)) {
    failures.push(`Missing source provider ${providerId}.`);
  }
}

for (const citation of requiredCitations) {
  if (!LEGAL_SOURCE_MANIFEST.doctrineSources.some((source) => source.citation === citation)) {
    failures.push(`Missing doctrine source ${citation}.`);
  }
}

if (!Array.isArray(LEGAL_SOURCE_CARDS) || LEGAL_SOURCE_CARDS.length < requiredCitations.length) {
  failures.push("Generated source cards are missing or too small.");
}

if (!LEGAL_SOURCE_MANIFEST.liveProbes.some((probe) => probe.provider === "courtlistener")) {
  failures.push("CourtListener live probe is not configured.");
}

if (!LEGAL_SOURCE_MANIFEST.liveProbes.some((probe) => probe.provider === "pacer" && probe.restricted)) {
  failures.push("Restricted PACER account probe is not configured.");
}

const manifestText = JSON.stringify(LEGAL_SOURCE_MANIFEST);
if (/COURTLISTENER_API_TOKEN=|GOVINFO_API_KEY=|CONGRESS_API_KEY=|OPENSTATES_API_KEY=/.test(manifestText)) {
  failures.push("Manifest includes raw .env assignment text.");
}

if (/"api_key":"[^"<][^"]+|Authorization":"Token\s+[^"<]/i.test(manifestText)) {
  failures.push("Manifest appears to include an unredacted key or token.");
}

if (failures.length) {
  console.error("Legal source tests failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Legal source tests passed.");
