function renderRules(rules) {
  const rulesDiv = document.getElementById("rules");
  rulesDiv.innerHTML = "";
  rules.forEach((rule, idx) => {
    const div = document.createElement("div");
    div.className = "rule";
    div.innerHTML = `
        <b>${rule.name}</b> <span>${rule.emoji || ""}</span><br>
        Pattern: <code>${rule.pattern}</code><br>
        Color: <span style="background:${rule.color};padding:0 10px;">${
      rule.color
    }</span>
        <br>
        <button data-idx="${idx}" class="deleteBtn">Delete</button>
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

chrome.storage.sync.get(["envRules"], function (result) {
  renderRules(result.envRules || []);
});

document.getElementById("addRuleForm").onsubmit = function (e) {
  e.preventDefault();
  const pattern = document.getElementById("pattern").value.trim();
  const name = document.getElementById("name").value.trim();
  const color = document.getElementById("color").value;
  const emoji = document.getElementById("emoji").value.trim();
  chrome.storage.sync.get(["envRules"], function (result) {
    const rules = result.envRules || [];
    rules.push({ pattern, name, color, emoji });
    chrome.storage.sync.set({ envRules: rules }, () => {
      renderRules(rules);
      document.getElementById("addRuleForm").reset();
    });
  });
};
