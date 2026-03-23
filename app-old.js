(function () {
  const targetDate = new Date("2026-12-31T23:59:59");
  const launchEl = document.querySelector(".launch");

  if (!launchEl) return;

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      launchEl.innerHTML = '<span class="badge launched">Launched</span>';
      return;
    }

    launchEl.innerHTML = '<span class="badge">Launching December 31, 2026</span>';
  }

  update();
})();

// Pause ambient animations when tab is not visible (saves battery, feels pro)
document.addEventListener("visibilitychange", () => {
  const paused = document.hidden;
  document.documentElement.style.setProperty(
    "--anim-play",
    paused ? "paused" : "running"
  );
});
