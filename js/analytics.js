/**
 * GA4 custom event tracking for Dev Portfolios (service site).
 * Requires the gtag snippet in <head> — do not load gtag again here.
 */
(function () {
  if (!document.body.classList.contains("service-site")) return;
  if (window.__GA4_EVENTS_BOUND__) return;
  window.__GA4_EVENTS_BOUND__ = true;

  /** Fire a GA4 event when gtag is available. */
  function trackEvent(eventName, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, params);
  }

  function pageLocation() {
    return window.location.href;
  }

  /** contact_button_click — Contact / Get Started / email / Discord CTAs */
  var CONTACT_BUTTON_SELECTOR = [
    'a[href="#contact"]',
    ".contact-channel",
    'a[href^="mailto:gweninj@gmail.com"]',
  ].join(", ");

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target.closest(CONTACT_BUTTON_SELECTOR);
      if (!target) return;

      trackEvent("contact_button_click", {
        page_location: pageLocation(),
        link_url: target.getAttribute("href") || "",
        link_text: (target.textContent || "").trim().slice(0, 100),
      });
    },
    { passive: true }
  );

  /**
   * contact_form_submit — fires on successful form submit (before navigation).
   * Attach data-contact-form to any <form> in the contact section.
   */
  function bindContactForm(form) {
    if (!form || form.dataset.ga4FormBound === "1") return;
    form.dataset.ga4FormBound = "1";

    form.addEventListener("submit", function () {
      if (form.dataset.ga4Submitted === "1") return;
      form.dataset.ga4Submitted = "1";

      trackEvent("contact_form_submit", {
        method: "website_form",
        page_location: pageLocation(),
      });
    });
  }

  document.querySelectorAll("form[data-contact-form]").forEach(bindContactForm);

  /** Pick up forms injected after initial parse (e.g. lazy widgets). */
  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches("form[data-contact-form]")) {
            bindContactForm(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll("form[data-contact-form]").forEach(bindContactForm);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
