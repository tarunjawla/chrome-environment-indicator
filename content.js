// Load user-defined environment rules from chrome.storage.sync
chrome.storage.sync.get(["envRules"], function (result) {
  const rules = result.envRules || [];
  const url = window.location.href;
  const matched = rules.find((rule) => {
    try {
      // Try regex match first
      const regex = new RegExp(rule.pattern);
      return regex.test(url);
    } catch (e) {
      // Fallback to substring match
      return url.includes(rule.pattern);
    }
  });
  if (matched) {
    showEnvIndicator(matched);
  }
});

function showEnvIndicator(env) {
  // Create the main indicator container
  const indicatorContainer = document.createElement("div");
  indicatorContainer.id = "env-indicator-container";

  // Create the indicator bar
  const indicator = document.createElement("div");
  indicator.id = "env-indicator";

  // Create toggle button
  const toggleButton = document.createElement("button");
  toggleButton.id = "env-indicator-toggle";
  toggleButton.innerHTML = "×";

  // Set the indicator's content
  indicator.innerHTML = `
    <div class="indicator-content">
      <div class="indicator-left">
        <span class="indicator-emoji">${env.emoji || ""}</span>
        <span class="indicator-text">${env.name || ""}</span>
      </div>
      <div class="indicator-right">
        <span class="indicator-url">${window.location.hostname}</span>
      </div>
    </div>
  `;

  // Add styles to head
  const styles = document.createElement("style");
  styles.textContent = `
    #env-indicator-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 999999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateY(0);
    }
    
    #env-indicator-container.hidden {
      transform: translateY(100%);
    }
    
    #env-indicator {
      background: ${env.color || "#333"};
      color: white;
      padding: 12px 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    
    .indicator-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    
    .indicator-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .indicator-emoji {
      font-size: 20px;
      line-height: 1;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }
    
    .indicator-text {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      text-transform: uppercase;
    }
    
    .indicator-right {
      display: flex;
      align-items: center;
    }
    
    .indicator-url {
      font-size: 12px;
      font-weight: 500;
      opacity: 0.9;
      font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    #env-indicator-toggle {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 2;
      line-height: 1;
    }
    
    #env-indicator-toggle:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-50%) scale(1.1);
    }
    
    #env-indicator-toggle:active {
      transform: translateY(-50%) scale(0.95);
    }
    
    @media (max-width: 768px) {
      #env-indicator {
        padding: 10px 16px;
      }
      .indicator-content {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
      .indicator-url {
        font-size: 11px;
      }
      .indicator-text {
        font-size: 13px;
      }
      #env-indicator-toggle {
        right: 8px;
        width: 24px;
        height: 24px;
        font-size: 14px;
      }
    }
    #env-indicator-container.hidden #env-indicator-toggle {
      position: fixed;
      bottom: 12px;
      right: 12px;
      background: ${env.color || "#333"};
      border: 2px solid white;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
      transform: none;
    }
    #env-indicator-container.hidden #env-indicator-toggle:hover {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(styles);

  // Assemble the indicator
  indicator.appendChild(toggleButton);
  indicatorContainer.appendChild(indicator);

  // Add toggle functionality
  let isHidden = false;
  toggleButton.addEventListener("click", (e) => {
    e.stopPropagation();
    isHidden = !isHidden;
    if (isHidden) {
      indicatorContainer.classList.add("hidden");
      toggleButton.innerHTML = "↓";
      toggleButton.title = "Show environment indicator";
    } else {
      indicatorContainer.classList.remove("hidden");
      toggleButton.innerHTML = "×";
      toggleButton.title = "Hide environment indicator";
    }
  });

  // Add to page with smooth entrance
  document.body.appendChild(indicatorContainer);
  requestAnimationFrame(() => {
    indicatorContainer.style.opacity = "1";
  });
}
