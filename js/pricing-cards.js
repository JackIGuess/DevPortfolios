(function () {
  const grid = document.querySelector("[data-pricing-grid]");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll("[data-pricing-card]"));

  function clearSelection() {
    grid.classList.remove("pricing-grid--has-selection");
    cards.forEach((card) => {
      card.classList.remove("pricing-card--selected");
      card.setAttribute("aria-pressed", "false");
    });
  }

  function selectCard(card) {
    const isSelected = card.classList.contains("pricing-card--selected");

    clearSelection();
    if (isSelected) return;

    grid.classList.add("pricing-grid--has-selection");
    card.classList.add("pricing-card--selected");
    card.setAttribute("aria-pressed", "true");
  }

  cards.forEach((card) => {
    card.setAttribute("aria-pressed", "false");

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      selectCard(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.target !== card) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCard(card);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!grid.contains(event.target)) clearSelection();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") clearSelection();
  });
})();
