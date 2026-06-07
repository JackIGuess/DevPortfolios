/**
 * Minimal analytics cookie consent — GA4 loads only after Accept.
 * Preference stored in localStorage (no analytics cookies until accepted).
 */
(function () {
  if (!document.body.classList.contains("service-site")) return;

  var MEASUREMENT_ID = "G-C951BJKH1B";
  var STORAGE_KEY = "devportfolios_analytics_consent";

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage blocked — consent not persisted */
    }
  }

  /** Load GA4 gtag once (called only after consent). */
  function loadAnalytics() {
    if (window.__GA4_LOADED__) return;
    window.__GA4_LOADED__ = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function hideBanner() {
    var banner = document.getElementById("cookie-consent");
    if (!banner) return;
    banner.hidden = true;
    banner.classList.remove("is-visible");
  }

  function showBanner() {
    var banner = document.getElementById("cookie-consent");
    if (!banner) return;
    banner.hidden = false;
    banner.classList.add("is-visible");
  }

  var consent = getConsent();

  if (consent === "accepted") {
    loadAnalytics();
  } else if (consent !== "declined") {
    showBanner();
  }

  document.getElementById("cookie-consent-accept")?.addEventListener("click", function () {
    setConsent("accepted");
    hideBanner();
    loadAnalytics();
  });

  document.getElementById("cookie-consent-decline")?.addEventListener("click", function () {
    setConsent("declined");
    hideBanner();
  });
})();
