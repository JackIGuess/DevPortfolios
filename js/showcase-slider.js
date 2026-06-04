(function () {
  function initShowcaseSlider(root) {
    const slides = Array.from(root.querySelectorAll(".showcase-slider__slide"));
    const dots = Array.from(root.querySelectorAll(".showcase-slider__dot"));
    const prevBtn = root.querySelector(".showcase-slider__nav--prev");
    const nextBtn = root.querySelector(".showcase-slider__nav--next");
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
    }

    prevBtn?.addEventListener("click", () => setSlide(index - 1));
    nextBtn?.addEventListener("click", () => setSlide(index + 1));
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => setSlide(i));
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSlide(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setSlide(index + 1);
      }
    });

    setSlide(index);
  }

  function initShowcaseLightbox() {
    const lightbox = document.getElementById("showcase-lightbox");
    if (!lightbox) return;

    const backdrop = lightbox.querySelector("[data-lightbox-close]");
    const image = lightbox.querySelector(".showcase-lightbox__image");
    let lastFocus = null;

    function openFromSlider(slider) {
      const active = slider.querySelector(".showcase-slider__slide.is-active");
      if (!active || !image) return;

      lastFocus = document.activeElement;
      image.src = active.currentSrc || active.src;
      image.alt = active.alt || "Expanded template preview";
      lightbox.hidden = false;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("showcase-lightbox-open");
    }

    function close() {
      lightbox.classList.remove("is-open");
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("showcase-lightbox-open");
      if (image) {
        image.removeAttribute("src");
        image.alt = "";
      }
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    document.querySelectorAll(".showcase-slider__expand").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const slider = button.closest("[data-showcase-slider]");
        if (slider) openFromSlider(slider);
      });
    });

    backdrop?.addEventListener("click", close);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        close();
      }
    });
  }

  document.querySelectorAll("[data-showcase-slider]").forEach(initShowcaseSlider);
  initShowcaseLightbox();
})();
