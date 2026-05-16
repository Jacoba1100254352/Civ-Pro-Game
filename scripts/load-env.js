import fs from "node:fs";
import path from "node:path";

export function loadEnv(filePath = ".env") {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    return {};
  }

  const env = {};
  const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    env[key] = stripQuotes(rawValue.trim());
  }

  return env;
}

export function mergedEnv(filePath = ".env") {
  return {
    ...process.env,
    ...withoutBlankValues(loadEnv(filePath))
  };
}

export function hasValue(env, key) {
  return Boolean(env[key] && String(env[key]).trim());
}

function stripQuotes(value) {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function withoutBlankValues(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => String(value).trim() !== "")
  );
}
