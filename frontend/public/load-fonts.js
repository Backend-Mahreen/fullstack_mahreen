(() => {
  const fontStyles = document.getElementById("mahreen-font-styles");
  if (!fontStyles) return;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const prefersLightweightLoad =
    window.matchMedia("(max-width: 768px)").matches ||
    connection?.saveData === true ||
    ["slow-2g", "2g"].includes(connection?.effectiveType);
  let activated = false;

  const activate = () => {
    if (activated) return;
    const href = fontStyles.dataset.href;
    if (!href) return;

    activated = true;
    fontStyles.href = href;
    fontStyles.media = "all";
    fontStyles.addEventListener(
      "load",
      () => {
        try {
          sessionStorage.setItem("mahreen:fonts-ready", "1");
        } catch {
          // Session storage may be unavailable in privacy-restricted browsers.
        }
      },
      { once: true },
    );
  };

  try {
    if (sessionStorage.getItem("mahreen:fonts-ready") === "1") {
      activate();
      return;
    }
  } catch {
    // Continue with the interaction-based strategy.
  }

  if (!prefersLightweightLoad) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(activate, { timeout: 2500 });
    } else {
      window.setTimeout(activate, 1800);
    }
    return;
  }

  ["pointerdown", "touchstart", "keydown", "scroll"].forEach((eventName) => {
    window.addEventListener(eventName, activate, { once: true, passive: true });
  });
})();
