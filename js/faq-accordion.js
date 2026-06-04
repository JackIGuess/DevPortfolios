(function () {
  const list = document.querySelector("[data-faq-list]");
  if (!list) return;

  const items = Array.from(list.querySelectorAll(".faq-item"));

  function syncListState() {
    const hasOpen = items.some((item) => item.open);
    list.classList.toggle("faq-list--has-open", hasOpen);
  }

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
      syncListState();
    });
  });

  syncListState();
})();
