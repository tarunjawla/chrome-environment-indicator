// Define environment configurations with emojis
const environments = [
  { name: "Local", color: "green", emoji: "🏡", match: /http:\/\/localhost:4200/ },
  { name: "Development", color: "orange", emoji: "🛠️", match: /https:\/\/centrum-devsite\.awarion\.com/ },
  { name: "Production", color: "red", emoji: "🚀", match: /https:\/\/centrum\.awarion\.com/ },
  { name: "Junction Local", color: "purple", emoji: "🔧", match: /http:\/\/localhost:4200.*\/admin/ },
  { name: "Junction Production", color: "blue", emoji: "🔵", match: /https:\/\/junction\.awarion\.com\/admin/ }
];

// Determine the current environment
const environment = environments.find(env => env.match.test(window.location.href));

if (environment) {
  // Create an indicator bar
  const indicator = document.createElement('div');
  
  // Set the indicator's text with emoji and environment name
  indicator.textContent = `${environment.emoji} Environment: ${environment.name}`;
  
  // Style the indicator
  indicator.style.position = "fixed";
  indicator.style.top = "0";
  indicator.style.left = "0";
  indicator.style.width = "100%";
  indicator.style.backgroundColor = environment.color;
  indicator.style.color = "white";
  indicator.style.textAlign = "center";
  indicator.style.padding = "12px 20px";
  indicator.style.fontSize = "18px";
  indicator.style.fontWeight = "bold";
  indicator.style.borderBottom = "4px solid #ffffff";
  indicator.style.zIndex = "10000";
  indicator.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  indicator.style.transition = "all 0.3s ease-in-out";
  
  // Set a smooth fade-in effect when the page loads
  indicator.style.opacity = "0";
  setTimeout(() => {
    indicator.style.opacity = "1";
  }, 100);

  // Add the bar to the page
  document.body.appendChild(indicator);
}
