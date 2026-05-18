import { runRuleTests } from "../public/rule-tests.js";

const result = runRuleTests();

if (result.failures.length) {
  console.error(`${result.passed}/${result.total} rule tests passed.`);
  for (const failure of result.failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`${result.passed}/${result.total} rule tests passed.`);
