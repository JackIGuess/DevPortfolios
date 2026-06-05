(function () {
  const sliderRegistry = new WeakMap();
  let activeSlider = null;

  function initShowcaseSlider(root) {
    const slides = Array.from(root.querySelectorAll(".showcase-slider__slide"));
    const dots = Array.from(root.querySelectorAll(".showcase-slider__dot"));
    const counter = root.querySelector(".showcase-slider__counter");
    if (!slides.length) return;

    let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (index < 0) index = 0;

    function setSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });
      if (counter) {
        counter.textContent = `${index + 1} / ${slides.length}`;
      }
      if (activeSlider === root) {
        syncLightboxSlide();
      }
    }

    sliderRegistry.set(root, {
      setSlide,
      getIndex: () => index,
      getSlideCount: () => slides.length,
      getActiveSlide: () => slides[index],
      root,
    });

    setSlide(index);
  }

  function syncLightboxSlide() {
    const lightbox = document.getElementById("showcase-lightbox");
    const image = lightbox?.querySelector(".showcase-lightbox__image");
    const counter = lightbox?.querySelector(".showcase-lightbox__counter");
    const controller = activeSlider ? sliderRegistry.get(activeSlider) : null;
    if (!lightbox || !image || !controller) return;

    const active = controller.getActiveSlide();
    if (!active) return;

    image.src = active.currentSrc || active.src;
    image.alt = active.alt || "Expanded template preview";
    if (counter) {
      counter.textContent = `${controller.getIndex() + 1} / ${controller.getSlideCount()}`;
    }
  }

  function openLightbox(slider) {
    const lightbox = document.getElementById("showcase-lightbox");
    const controller = sliderRegistry.get(slider);
    if (!lightbox || !controller) return;

    activeSlider = slider;
    lightbox._lastFocus = document.activeElement;

    syncLightboxSlide();
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("showcase-lightbox-open");

    lightbox.querySelector(".showcase-lightbox__nav--prev")?.focus();
  }

  function closeLightbox() {
    const lightbox = document.getElementById("showcase-lightbox");
    if (!lightbox || !lightbox.classList.contains("is-open")) return;

    const image = lightbox.querySelector(".showcase-lightbox__image");
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("showcase-lightbox-open");

    if (image) {
      image.removeAttribute("src");
      image.alt = "";
    }

    const lastFocus = lightbox._lastFocus;
    activeSlider = null;
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function initShowcaseCards() {
    document.querySelectorAll("[data-showcase-card]").forEach((card) => {
      const slider = card.querySelector("[data-showcase-slider]");
      if (!slider) return;

      function openFromCard() {
        openLightbox(slider);
      }

      card.addEventListener("click", () => {
        openFromCard();
      });

      card.addEventListener("keydown", (event) => {
        if (event.target !== card) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFromCard();
        }
      });
    });
  }

  function initShowcaseLightbox() {
    const lightbox = document.getElementById("showcase-lightbox");
    if (!lightbox) return;

    lightbox.querySelectorAll("[data-lightbox-close]").forEach((button) => {
      button.addEventListener("click", closeLightbox);
    });

    lightbox.querySelector(".showcase-lightbox__nav--prev")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const controller = activeSlider ? sliderRegistry.get(activeSlider) : null;
      if (controller) controller.setSlide(controller.getIndex() - 1);
    });

    lightbox.querySelector(".showcase-lightbox__nav--next")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const controller = activeSlider ? sliderRegistry.get(activeSlider) : null;
      if (controller) controller.setSlide(controller.getIndex() + 1);
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const controller = activeSlider ? sliderRegistry.get(activeSlider) : null;
        if (controller) controller.setSlide(controller.getIndex() - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const controller = activeSlider ? sliderRegistry.get(activeSlider) : null;
        if (controller) controller.setSlide(controller.getIndex() + 1);
      }
    });
  }

  document.querySelectorAll("[data-showcase-slider]").forEach(initShowcaseSlider);
  initShowcaseCards();
  initShowcaseLightbox();
})();
