function renderRules(rules) {
  const rulesDiv = document.getElementById("rules");
  rulesDiv.innerHTML = "";
  rules.forEach((rule, idx) => {
    const div = document.createElement("div");
    div.className = "rule";
    // Check if this rule is being edited
    if (renderRules.editingIdx === idx) {
      div.innerHTML = `
        <form class="edit-rule-form">
          <label>Pattern:<input type="text" name="pattern" value="${rule.pattern}" required /></label><br>
          <label>Name:<input type="text" name="name" value="${rule.name}" required /></label><br>
          <label>Color:<input type="color" name="color" value="${rule.color}" /></label><br>
          <label>Emoji:<input type="text" name="emoji" maxlength="2" value="${rule.emoji || ''}" /></label><br>
          <label>Size:
            <select name="size">
              <option value="strip" ${rule.size === 'strip' ? 'selected' : ''}>Strip (full bar)</option>
              <option value="badge" ${rule.size === 'badge' ? 'selected' : ''}>Badge (small pill)</option>
            </select>
          </label><br>
          <label>Position:
            <select name="position">
              <option value="bottom" ${rule.position === 'bottom' ? 'selected' : ''}>Bottom (full width)</option>
              <option value="top" ${rule.position === 'top' ? 'selected' : ''}>Top (full width)</option>
              <option value="bottom-right" ${rule.position === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
              <option value="bottom-left" ${rule.position === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
              <option value="top-right" ${rule.position === 'top-right' ? 'selected' : ''}>Top Right</option>
              <option value="top-left" ${rule.position === 'top-left' ? 'selected' : ''}>Top Left</option>
            </select>
          </label><br>
          <button type="submit">Save</button>
          <button type="button" class="cancelEditBtn">Cancel</button>
        </form>
      `;
      rulesDiv.appendChild(div);
      // Save handler
      div.querySelector(".edit-rule-form").onsubmit = function (e) {
        e.preventDefault();
        const form = e.target;
        const updatedRule = {
          pattern: form.pattern.value.trim(),
          name: form.name.value.trim(),
          color: form.color.value,
          emoji: form.emoji.value.trim(),
          size: form.size.value,
          position: form.position.value,
        };
        rules[idx] = updatedRule;
        chrome.storage.sync.set({ envRules: rules }, () => {
          renderRules.editingIdx = null;
          renderRules(rules);
        });
      };
      // Cancel handler
      div.querySelector(".cancelEditBtn").onclick = function () {
        renderRules.editingIdx = null;
        renderRules(rules);
      };
    } else {
      div.innerHTML = `
        <div class="rule-info">
          <span class="rule-emoji">${rule.emoji || ""}</span>
          <b>${rule.name}</b><br>
          <span class="help">Pattern:</span> <code>${rule.pattern}</code><br>
          <span class="help">Color:</span> <span class="rule-color" style="background:${rule.color}"></span> ${rule.color}<br>
          <span class="help">Size:</span> ${rule.size || "strip"}<br>
          <span class="help">Position:</span> ${rule.position || "bottom"}
        </div>
        <div class="rule-actions">
          <button data-idx="${idx}" class="editBtn">Edit</button>
          <button data-idx="${idx}" class="deleteBtn">Delete</button>
        </div>
      `;
      rulesDiv.appendChild(div);
    }
  });
  // Delete handlers
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.onclick = function () {
      const idx = +this.getAttribute("data-idx");
      rules.splice(idx, 1);
      chrome.storage.sync.set({ envRules: rules }, () => renderRules(rules));
    };
  });
  // Edit handlers
  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.onclick = function () {
      renderRules.editingIdx = +this.getAttribute("data-idx");
      renderRules(rules);
    };
  });
}
renderRules.editingIdx = null;

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
