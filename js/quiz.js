const form = document.querySelector(".quiz_form");
const track = form.querySelector(".quiz_track");
const submitButton = form.querySelector(".quiz_submit");
const slides = [...track.children];
const count = document.querySelector(".quiz_count");
const progress = document.querySelector(".quiz_progress");
const progressSteps = [...progress.children];

const pad = (n) => String(n).padStart(2, "0");

let current = 0;

function updateSubmitButton() {
  submitButton.disabled = slides[current].querySelector(":checked") === null;
}

function showSlide(index) {
  const position = index + 1;
  const total = slides.length;

  current = index;
  track.style.setProperty("--index", index);
  slides.forEach((slide, i) => {
    slide.inert = i !== index;
  });
  progressSteps.forEach((step, i) => {
    step.classList.toggle("quiz_progress_step_done", i <= index);
  });
  count.textContent = `QUESTION ${pad(position)} / ${pad(total)}`;
  progress.setAttribute("aria-label", `Question ${position} of ${total}`);
  progress.setAttribute("aria-valuenow", position);
  updateSubmitButton();
}

form.addEventListener("change", updateSubmitButton);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (current < slides.length - 1) {
    showSlide(current + 1);
    slides[current]
      .querySelector(".quiz_question")
      .focus({ preventScroll: true });
  }
});

showSlide(0);
