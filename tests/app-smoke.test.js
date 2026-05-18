const elements = new Map();
const failures = [];

class StubElement {
  constructor(id) {
    this.id = id;
    this.children = [];
    this.checked = false;
    this.disabled = false;
    this.dataset = {};
    this.eventListeners = new Map();
    this.classList = {
      values: new Set(),
      toggle: (name, force) => {
        if (force === undefined ? !this.classList.values.has(name) : force) {
          this.classList.values.add(name);
        } else {
          this.classList.values.delete(name);
        }
      }
    };
    this._textContent = "";
    this._innerHTML = "";
  }

  set textContent(value) {
    this._textContent = String(value);
  }

  get textContent() {
    return this._textContent;
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
  }

  get innerHTML() {
    return this._innerHTML;
  }

  addEventListener(event, handler) {
    this.eventListeners.set(event, handler);
  }

  querySelectorAll() {
    return [];
  }

  querySelector() {
    return null;
  }
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

global.window = {
  setInterval: () => 1,
  clearInterval: () => {},
  print: () => {}
};

global.document = {
  getElementById(id) {
    if (!elements.has(id)) {
      elements.set(id, new StubElement(id));
    }
    return elements.get(id);
  },
  addEventListener(event, handler) {
    if (event === "DOMContentLoaded") {
      handler();
    }
  }
};

await import("../public/app.js");

expect(elements.get("player-one-score")?.textContent === "0", "Initial render should set player one score.");
expect(elements.get("player-two-score")?.textContent === "0", "Initial render should set player two score.");
expect(elements.get("round-value")?.textContent === "1", "Initial render should set round one.");
expect(elements.get("roles-value")?.textContent.includes("plaintiff"), "Initial render should show player roles.");
expect(elements.get("claim-hand")?.innerHTML.includes("playing-card"), "Initial render should draw claim cards.");
expect(elements.get("attack-hand")?.innerHTML.includes("playing-card"), "Initial render should draw attack cards.");
expect(elements.get("motion-hand")?.innerHTML.includes("playing-card"), "Initial render should draw motion cards.");
expect(elements.get("source-list")?.innerHTML.includes("FRCP 4"), "Initial render should include generated source cards.");
expect(elements.get("judge-output")?.innerHTML.includes("Player 1 is plaintiff"), "Initial render should populate the Rule Judge.");

if (failures.length) {
  console.error("App smoke tests failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("App smoke tests passed.");
