// Define environment configurations with emojis
const environments = [
  {
    name: "Local",
    color: "green",
    emoji: "🏡",
    match: /http:\/\/localhost:4200/,
  },
  {
    name: "Development",
    color: "orange",
    emoji: "🛠️",
    match: /https:\/\/centrum-devsite\.awarion\.com/,
  },
  {
    name: "Production",
    color: "red",
    emoji: "🚀",
    match: /https:\/\/centrum\.awarion\.com/,
  },
  {
    name: "Junction Local",
    color: "purple",
    emoji: "🔧",
    match: /http:\/\/localhost:4200.*\/admin/,
  },
  {
    name: "Junction Production",
    color: "blue",
    emoji: "🔵",
    match: /https:\/\/junction\.awarion\.com\/admin/,
  },
];

// Determine the current environment
const environment = environments.find((env) =>
  env.match.test(window.location.href)
);

if (environment) {
  // Create an indicator bar
  const indicator = document.createElement("div");

  // Set the indicator's text with emoji and environment name
  indicator.innerHTML = `
    <span style="margin-right: 10px; font-size: 24px;">${environment.emoji}</span>
    <span style="font-size: 20px; font-weight: bold;">${environment.name}</span>
  `;

  // Style the indicator
  indicator.style.position = "fixed";
  indicator.style.bottom = "0"; // Positioned at the bottom
  indicator.style.left = "0";
  indicator.style.width = "100%";
  indicator.style.backgroundColor = environment.color;
  indicator.style.color = "white";
  indicator.style.textAlign = "center";
  indicator.style.padding = "16px 24px"; // Increased padding for a larger look
  indicator.style.fontSize = "18px";
  indicator.style.fontWeight = "bold";
  indicator.style.borderTop = "6px solid #ffffff"; // Bolder border for a cleaner design
  indicator.style.zIndex = "10000";
  indicator.style.boxShadow = "0 -6px 10px rgba(0, 0, 0, 0.2)";
  indicator.style.transition = "opacity 0.3s ease-in-out";

  // Set a smooth fade-in effect when the page loads
  indicator.style.opacity = "0";
  setTimeout(() => {
    indicator.style.opacity = "1";
  }, 100);

  // Add hover effect for better interaction
  indicator.onmouseover = () => {
    indicator.style.boxShadow = "0 -8px 12px rgba(0, 0, 0, 0.3)";
  };
  indicator.onmouseout = () => {
    indicator.style.boxShadow = "0 -6px 10px rgba(0, 0, 0, 0.2)";
  };

  // Add the bar to the page
  document.body.appendChild(indicator);
}
