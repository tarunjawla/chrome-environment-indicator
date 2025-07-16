function renderRules(rules) {
  const rulesDiv = document.getElementById("rules");
  rulesDiv.innerHTML = "";
  rules.forEach((rule, idx) => {
    const div = document.createElement("div");
    div.className = "rule";
    div.innerHTML = `
      <div class="rule-info">
        <span class="rule-emoji">${rule.emoji || ""}</span>
        <b>${rule.name}</b><br>
        <span class="help">Pattern:</span> <code>${rule.pattern}</code><br>
        <span class="help">Color:</span> <span class="rule-color" style="background:${
          rule.color
        }"></span> ${rule.color}<br>
        <span class="help">Size:</span> ${rule.size || "strip"}<br>
        <span class="help">Position:</span> ${rule.position || "bottom"}
      </div>
      <div class="rule-actions">
        <button data-idx="${idx}" class="deleteBtn">Delete</button>
      </div>
    `;
    rulesDiv.appendChild(div);
  });
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.onclick = function () {
      const idx = +this.getAttribute("data-idx");
      rules.splice(idx, 1);
      chrome.storage.sync.set({ envRules: rules }, () => renderRules(rules));
    };
  });
}

function loadGlobalOptions() {
  chrome.storage.sync.get(
    ["globalFontSize", "globalBorderRadius"],
    function (result) {
      document.getElementById("globalFontSize").value =
        result.globalFontSize || 15;
      document.getElementById("globalBorderRadius").value =
        result.globalBorderRadius || 8;
    }
  );
}

function saveGlobalOptions() {
  const fontSize = parseInt(
    document.getElementById("globalFontSize").value,
    10
  );
  const borderRadius = parseInt(
    document.getElementById("globalBorderRadius").value,
    10
  );
  chrome.storage.sync.set({
    globalFontSize: fontSize,
    globalBorderRadius: borderRadius,
  });
}

document
  .getElementById("globalFontSize")
  .addEventListener("change", saveGlobalOptions);
document
  .getElementById("globalBorderRadius")
  .addEventListener("change", saveGlobalOptions);

chrome.storage.sync.get(["envRules"], function (result) {
  renderRules(result.envRules || []);
});

loadGlobalOptions();

document.getElementById("addRuleForm").onsubmit = function (e) {
  e.preventDefault();
  const pattern = document.getElementById("pattern").value.trim();
  const name = document.getElementById("name").value.trim();
  const color = document.getElementById("color").value;
  const emoji = document.getElementById("emoji").value.trim();
  const size = document.getElementById("size").value;
  const position = document.getElementById("position").value;
  chrome.storage.sync.get(["envRules"], function (result) {
    const rules = result.envRules || [];
    rules.push({ pattern, name, color, emoji, size, position });
    chrome.storage.sync.set({ envRules: rules }, () => {
      renderRules(rules);
      document.getElementById("addRuleForm").reset();
    });
  });
};
