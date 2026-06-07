/**
 * Terms and Privacy open in a modal from footer / cookie bar links.
 */
(function () {
  var modal = document.getElementById("legal-modal");
  if (!modal) return;

  var panels = Array.from(modal.querySelectorAll("[data-legal-panel]"));
  var lastFocus = null;

  function showPanel(name) {
    panels.forEach(function (panel) {
      panel.hidden = panel.dataset.legalPanel !== name;
    });

    var active = panels.find(function (panel) {
      return panel.dataset.legalPanel === name;
    });
    var title = active && active.querySelector(".site-privacy__title");
    modal.setAttribute("aria-label", title ? title.textContent.trim() : "Legal information");
  }

  function openLegal(name) {
    if (name !== "terms" && name !== "privacy") return;

    lastFocus = document.activeElement;
    showPanel(name);
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("legal-modal-open");

    if (modal.querySelector(".legal-modal__scroll")) {
      modal.querySelector(".legal-modal__scroll").scrollTop = 0;
    }
  }

  function closeLegal() {
    if (!modal.classList.contains("is-open")) return;

    modal.classList.remove("is-open");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("legal-modal-open");

    if (window.location.hash === "#terms" || window.location.hash === "#privacy") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  }

  function panelFromHash() {
    var hash = window.location.hash.replace("#", "");
    return hash === "terms" || hash === "privacy" ? hash : "";
  }

  document.querySelectorAll('a[href="#terms"], a[href="#privacy"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var name = link.getAttribute("href").replace("#", "");
      openLegal(name);
      history.replaceState(null, "", "#" + name);
    });
  });

  modal.querySelectorAll("[data-legal-close]").forEach(function (button) {
    button.addEventListener("click", closeLegal);
  });

  document.addEventListener("keydown", function (event) {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLegal();
  });

  var initial = panelFromHash();
  if (initial) openLegal(initial);

  window.addEventListener("hashchange", function () {
    var name = panelFromHash();
    if (name) {
      openLegal(name);
    } else {
      closeLegal();
    }
  });
})();
