import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { hasValue, mergedEnv } from "./load-env.js";
import { buildRequest, redactHeaders, redactUrl } from "./sync-legal-sources.js";

const outputPath = path.resolve("data/ingestion/provider-candidates.local.json");

const COURTLISTENER_QUERIES = [
  {
    id: "rule12-pleading-candidates",
    label: "Rule 12 pleading candidates",
    q: "\"Rule 12(b)(6)\" \"motion to dismiss\"",
    topic: "pleading"
  },
  {
    id: "personal-jurisdiction-candidates",
    label: "Personal jurisdiction candidates",
    q: "\"personal jurisdiction\" \"minimum contacts\"",
    topic: "personal-jurisdiction"
  },
  {
    id: "summary-judgment-candidates",
    label: "Summary judgment candidates",
    q: "\"Rule 56\" \"summary judgment\"",
    topic: "summary-judgment"
  }
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}

export async function main(env = mergedEnv()) {
  const artifact = await buildCandidateArtifact(env);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  printCandidateSummary(artifact);
}

export async function buildCandidateArtifact(env) {
  const providers = [];
  providers.push(await fetchCourtListenerCandidates(env));
  providers.push(await fetchGovinfoCandidates(env));
  providers.push(await fetchCongressCandidates(env));
  providers.push(await fetchOpenStatesCandidates(env));

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    reviewRequired: true,
    reviewInstruction: "Do not import these candidates directly into gameplay. Promote only reviewed, fictionalized, source-backed artifacts into data/reviewed-game-artifacts.json, then run npm run artifacts:build.",
    providers
  };
}

async function fetchCourtListenerCandidates(env) {
  if (!hasValue(env, "COURTLISTENER_API_TOKEN")) {
    return skippedProvider("courtlistener", ["COURTLISTENER_API_TOKEN"]);
  }

  const lanes = [];
  for (const query of COURTLISTENER_QUERIES) {
    const probe = {
      method: "GET",
      url: "https://www.courtlistener.com/api/rest/v4/search/",
      query: { q: query.q, type: "o", page_size: "5" },
      headers: { Authorization: "Token ${COURTLISTENER_API_TOKEN}" }
    };
    const { json, request, status } = await fetchJsonProbe(probe, env);
    lanes.push({
      id: query.id,
      label: query.label,
      topic: query.topic,
      status,
      request,
      candidates: (json?.results || []).map((item) => ({
        provider: "courtlistener",
        sourceId: item.cluster_id || item.id || item.resource_uri || item.absolute_url,
        title: item.caseName || item.caseNameFull || item.caseNameShort || item.case_name || "Untitled opinion",
        court: item.court || item.court_citation_string || null,
        dateFiled: item.dateFiled || item.date_filed || null,
        url: item.absolute_url ? `https://www.courtlistener.com${item.absolute_url}` : item.resource_uri || null,
        snippet: compactText(item.snippet || item.text || item.syllabus || ""),
        gameUse: "Candidate source pattern for a reviewed, fictionalized procedural dispute."
      }))
    });
  }

  return { provider: "courtlistener", status: "ok", lanes };
}

async function fetchGovinfoCandidates(env) {
  if (!hasValue(env, "GOVINFO_API_KEY")) {
    return skippedProvider("govinfo", ["GOVINFO_API_KEY"]);
  }

  const probe = {
    method: "GET",
    url: "https://api.govinfo.gov/collections/USCODE/2024-01-01T00:00:00Z",
    query: { pageSize: "5", offsetMark: "*", api_key: "${GOVINFO_API_KEY}" },
    headers: {}
  };
  const { json, request, status } = await fetchJsonProbe(probe, env);
  return {
    provider: "govinfo",
    status,
    request,
    candidates: (json?.packages || []).map((item) => ({
      provider: "govinfo",
      packageId: item.packageId,
      title: item.title,
      dateIssued: item.dateIssued,
      url: item.packageLink || item.detailsLink || null,
      gameUse: "Candidate authority lane for statutory source checks."
    }))
  };
}

async function fetchCongressCandidates(env) {
  if (!hasValue(env, "CONGRESS_API_KEY")) {
    return skippedProvider("congress", ["CONGRESS_API_KEY"]);
  }

  const probe = {
    method: "GET",
    url: "https://api.congress.gov/v3/bill",
    query: { limit: "5", api_key: "${CONGRESS_API_KEY}" },
    headers: {}
  };
  const { json, request, status } = await fetchJsonProbe(probe, env);
  return {
    provider: "congress",
    status,
    request,
    candidates: (json?.bills || []).map((item) => ({
      provider: "congress",
      congress: item.congress,
      type: item.type,
      number: item.number,
      title: item.title,
      latestAction: item.latestAction?.text || null,
      url: item.url || null,
      gameUse: "Candidate legislative-update lane for future statutory modules."
    }))
  };
}

async function fetchOpenStatesCandidates(env) {
  if (!hasValue(env, "OPENSTATES_API_KEY")) {
    return skippedProvider("openstates", ["OPENSTATES_API_KEY"]);
  }

  const probe = {
    method: "GET",
    url: "https://v3.openstates.org/jurisdictions",
    query: {},
    headers: { "X-API-KEY": "${OPENSTATES_API_KEY}" }
  };
  const { json, request, status } = await fetchJsonProbe(probe, env);
  return {
    provider: "openstates",
    status,
    request,
    candidates: ((json?.results || json?.jurisdictions || [])).slice(0, 10).map((item) => ({
      provider: "openstates",
      id: item.id,
      name: item.name,
      classification: item.classification,
      url: item.url || item.openstates_url || null,
      gameUse: "Candidate jurisdiction lane for state-procedure expansion decks."
    }))
  };
}

async function fetchJsonProbe(probe, env) {
  const runtimeRequest = buildRequest(probe, env);
  const publicRequest = {
    method: probe.method,
    url: redactUrl(runtimeRequest.url),
    headers: redactHeaders(runtimeRequest.headers)
  };
  try {
    const response = await fetch(runtimeRequest.url, {
      method: probe.method,
      headers: runtimeRequest.headers
    });
    const contentType = response.headers.get("content-type") || "";
    const json = contentType.includes("application/json") ? await response.json() : null;
    return { json, request: publicRequest, status: response.ok ? "ok" : `http-${response.status}` };
  } catch (error) {
    return {
      json: null,
      request: publicRequest,
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function skippedProvider(provider, missingEnv) {
  return {
    provider,
    status: "skipped",
    missingEnv,
    candidates: []
  };
}

function compactText(value) {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

function printCandidateSummary(artifact) {
  console.log(`Provider candidates written to ${path.relative(process.cwd(), outputPath)}`);
  for (const provider of artifact.providers) {
    const count = provider.lanes
      ? provider.lanes.reduce((total, lane) => total + lane.candidates.length, 0)
      : provider.candidates.length;
    console.log(`${provider.provider}: ${provider.status}; candidates=${count}`);
  }
}
