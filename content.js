// Load user-defined environment rules and global style options from chrome.storage.sync
chrome.storage.sync.get(
  ["envRules", "globalFontSize", "globalBorderRadius"],
  function (result) {
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
      showEnvIndicator(
        matched,
        result.globalFontSize,
        result.globalBorderRadius
      );
    }
  }
);

function showEnvIndicator(env, globalFontSize, globalBorderRadius) {
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

  // Compute style based on size and position
  const size = env.size || "strip";
  const position = env.position || "bottom";
  const fontSize = globalFontSize ? `${globalFontSize}px` : "15px";
  const borderRadius = globalBorderRadius
    ? `${globalBorderRadius}px`
    : size === "badge"
    ? "999px"
    : "8px";
  let containerStyle =
    "position:fixed;z-index:999999;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);opacity:1;";

  // Positioning logic
  if (size === "strip") {
    if (position === "top") {
      containerStyle += "top:0;left:0;right:0;";
    } else {
      containerStyle += "bottom:0;left:0;right:0;";
    }
  } else if (size === "badge") {
    let pos = {
      "bottom-right": "bottom:24px;right:24px;",
      "bottom-left": "bottom:24px;left:24px;",
      "top-right": "top:24px;right:24px;",
      "top-left": "top:24px;left:24px;",
      top: "top:24px;left:50%;transform:translateX(-50%);",
      bottom: "bottom:24px;left:50%;transform:translateX(-50%);",
    };
    containerStyle += pos[position] || pos["bottom-right"];
  }

  indicatorContainer.setAttribute("style", containerStyle);

  // Add styles to head
  const styles = document.createElement("style");
  styles.textContent = `
    #env-indicator {
      background: ${env.color || "#333"};
      color: white;
      padding: ${size === "badge" ? "8px 20px" : "12px 24px"};
      box-shadow: 0 2px 12px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
      border-radius: ${borderRadius};
      border-top: ${
        size === "strip" && (env.position === "bottom" || !env.position)
          ? "1px solid rgba(255,255,255,0.1)"
          : "none"
      };
      border-bottom: ${
        size === "strip" && env.position === "top"
          ? "1px solid rgba(255,255,255,0.1)"
          : "none"
      };
      position: relative;
      overflow: hidden;
      min-width: ${size === "badge" ? "120px" : "auto"};
      max-width: 90vw;
      margin: ${size === "badge" ? "0 auto" : "0"};
      font-size: ${fontSize};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .indicator-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
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
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
    }
    .indicator-text {
      font-size: 1em;
      font-weight: 700;
      letter-spacing: 0.5px;
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      text-transform: uppercase;
    }
    .indicator-right {
      display: flex;
      align-items: center;
    }
    .indicator-url {
      font-size: 0.9em;
      font-weight: 500;
      opacity: 0.9;
      font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
      background: rgba(255,255,255,0.1);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    #env-indicator-toggle {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
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
      background: rgba(255,255,255,0.25);
      transform: translateY(-50%) scale(1.1);
    }
    #env-indicator-toggle:active {
      transform: translateY(-50%) scale(0.95);
    }
    @media (max-width: 768px) {
      #env-indicator {
        padding: ${size === "badge" ? "6px 12px" : "10px 16px"};
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
      ${
        size === "strip"
          ? position === "top"
            ? "top:12px;left:50%;transform:translateX(-50%);"
            : "bottom:12px;left:50%;transform:translateX(-50%);"
          : position === "bottom-right"
          ? "bottom:12px;right:12px;"
          : position === "bottom-left"
          ? "bottom:12px;left:12px;"
          : position === "top-right"
          ? "top:12px;right:12px;"
          : position === "top-left"
          ? "top:12px;left:12px;"
          : "bottom:12px;right:12px;"
      }
      background: ${env.color || "#333"};
      border: 2px solid white;
      box-shadow: 0 2px 12px rgba(0,0,0,0.2);
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
