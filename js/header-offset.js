(function () {
  if (!document.body.classList.contains("service-site")) return;

  const header = document.querySelector(".site-header");
  if (!header) return;

  const mobileQuery = window.matchMedia("(max-width: 640px)");

  function clearOffset() {
    document.body.style.removeProperty("--site-header-offset");
    document.documentElement.style.removeProperty("scroll-padding-top");
  }

  function syncHeaderOffset() {
    if (!mobileQuery.matches) {
      clearOffset();
      return;
    }

    const height = Math.ceil(header.getBoundingClientRect().height);
    document.body.style.setProperty("--site-header-offset", `${height}px`);
    document.documentElement.style.setProperty("scroll-padding-top", `${height}px`);
  }

  syncHeaderOffset();
  window.addEventListener("resize", syncHeaderOffset);
  window.addEventListener("load", syncHeaderOffset);
  mobileQuery.addEventListener("change", syncHeaderOffset);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderOffset);
  }

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(syncHeaderOffset);
    observer.observe(header);
  }
})();
