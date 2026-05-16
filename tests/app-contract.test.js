import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const uniqueHtmlIds = new Set(htmlIds);
expect(htmlIds.length === uniqueHtmlIds.size, "index.html should not contain duplicate ids.");

const bindElementsMatch = app.match(/function bindElements\(\) \{[\s\S]*?\]\.forEach/);
expect(Boolean(bindElementsMatch), "app.js bindElements id list could not be found.");

if (bindElementsMatch) {
  const referencedIds = [...bindElementsMatch[0].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  for (const id of referencedIds) {
    expect(uniqueHtmlIds.has(id), `app.js references missing DOM id ${id}.`);
  }
}

expect(/<script type="module" src="app\.js"><\/script>/.test(html), "index.html should load app.js as a module.");
expect(app.includes("showRuleTests"), "app.js should keep the in-browser test runner hook.");
expect(app.includes("printCards"), "app.js should keep the print deck hook.");
expect(app.includes("startTutorial"), "app.js should keep the tutorial hook.");
expect(app.includes("renderSources"), "app.js should render source cards in the Rule Judge panel.");

if (failures.length) {
  console.error("App contract tests failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("App contract tests passed.");
