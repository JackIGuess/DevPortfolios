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

  document.querySelectorAll("[data-showcase-slider]").forEach(initShowcaseSlider);
})();
