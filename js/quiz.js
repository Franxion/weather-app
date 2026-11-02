const form = document.querySelector(".quiz_form");
const track = form.querySelector(".quiz_track");
const submitButton = form.querySelector(".quiz_submit");
const submitLabel = submitButton.querySelector(".quiz_submit_label");
const scoreShort = document.querySelector(".score_short");
const scoreLong = document.querySelector(".score_long");
const count = document.querySelector(".quiz_count");
const progress = document.querySelector(".quiz_progress");
const progressSteps = [...progress.children];
const quiz = document.querySelector(".quiz");
const results = document.querySelector(".results");
const resultsRing = document.querySelector(".results_ring");
const questionTemplate = document.querySelector("#question-template");
const optionTemplate = document.querySelector("#option-template");

let QUESTIONNAIRE = { slide: 0, score: 0, answers: [] };

const questions = await loadQuestions();

const scenarioQuestions = questions.scenarios.find(
  (scenario) => scenario.id === document.body.dataset.scenarioId,
).questions;

renderQuestions();
const slides = [...track.children];
accessibilitySlidingQuestions(0);

const RING_LENGTH = 427;

const ICON_CHECK =
  '<svg aria-hidden="true" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const ICON_CROSS =
  '<svg aria-hidden="true" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const ICON_EXTERNAL =
  '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B7A68" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

async function loadQuestions() {
  try {
    const response = await fetch("data/questions.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    const message = createElement(
      "p",
      "quiz_error",
      "The questions could not be loaded. Please reload the page.",
    );
    message.setAttribute("role", "alert");
    form.replaceChildren(message);
    throw error;
  }
}

function renderQuestions() {
  const slidesToRender = scenarioQuestions.map((question) => {
    const slide = questionTemplate.content.firstElementChild.cloneNode(true);
    slide.querySelector(".quiz_question").textContent = question.text;
    slide.querySelector(".quiz_options").append(
      ...question.options.map((option) => {
        const label = optionTemplate.content.firstElementChild.cloneNode(true);
        const input = label.querySelector(".quiz_option_input");
        input.name = question.id;
        input.value = option.id;
        label.querySelector(".quiz_option_letter").textContent =
          option.id.toUpperCase();
        label.querySelector(".quiz_option_text").textContent = option.text;
        return label;
      }),
    );
    return slide;
  });
  track.replaceChildren(...slidesToRender);
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createMark(isCorrect, size) {
  const mark = createElement("span", "quiz_result_mark");
  mark.innerHTML = (isCorrect ? ICON_CHECK : ICON_CROSS).replaceAll(
    "{size}",
    size,
  );
  mark.append(
    createElement(
      "span",
      "visually_hidden",
      isCorrect ? "Correct answer" : "Wrong answer",
    ),
  );
  return mark;
}

function createFeedback(isCorrect, { explanation, source }) {
  const feedback = createElement(
    "section",
    `quiz_feedback ${isCorrect ? "" : "quiz_feedback_wrong"}`,
  );

  const head = createElement("div", "quiz_feedback_head");
  const icon = createElement("div", "quiz_feedback_icon");
  icon.innerHTML = (isCorrect ? ICON_CHECK : ICON_CROSS).replaceAll(
    "{size}",
    isCorrect ? 22 : 18,
  );
  head.append(
    icon,
    createElement(
      "h2",
      "quiz_feedback_title",
      isCorrect ? "Correct!" : "Not quite",
    ),
  );

  const link = createElement("a", "quiz_source");
  link.href = source.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  const linkText = createElement("span", "quiz_source_text");
  linkText.append(
    createElement("span", "quiz_source_label", "OFFICIAL SOURCE"),
    createElement("span", "quiz_source_name", source.label),
  );
  const linkHint = createElement(
    "span",
    "visually_hidden",
    "(opens in a new tab)",
  );
  link.append(linkText, linkHint);
  link.insertAdjacentHTML("beforeend", ICON_EXTERNAL);

  const text = createElement("p", "quiz_feedback_text", explanation);
  text.tabIndex = -1;

  feedback.append(head, text, link);
  return feedback;
}

form.addEventListener("change", toggleButtonState);
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isSlideAnswered()) {
    revealAnswer();
  } else if (!isLastQuestion()) {
    showSlide();
  } else {
    showResults();
  }
});

function currentSlide() {
  return slides[QUESTIONNAIRE.slide];
}

function isLastQuestion() {
  return QUESTIONNAIRE.slide === slides.length - 1;
}

function showSlide() {
  QUESTIONNAIRE = { ...QUESTIONNAIRE, slide: QUESTIONNAIRE.slide + 1 };
  track.style.setProperty("--index", QUESTIONNAIRE.slide);

  updateStyleProgessQuestions(QUESTIONNAIRE.slide);
  accessibilitySlidingQuestions(QUESTIONNAIRE.slide);
  updateScore(false);
  updateButton();
  focusQuestionTitle();
}

function focusQuestionTitle() {
  currentSlide().querySelector(".quiz_question").focus({ preventScroll: true });
}

function updateStyleProgessQuestions(index) {
  const total = String(slides.length).padStart(2, "0");
  progressSteps.forEach((step, i) => {
    step.classList.toggle("quiz_progress_step_done", i <= index);
  });
  count.textContent = `QUESTION ${String(index + 1).padStart(2, "0")} / ${total}`;
}

function accessibilitySlidingQuestions(index) {
  slides.forEach((slide, i) => {
    slide.inert = i !== index;
  });
  progress.setAttribute(
    "aria-label",
    `Question ${index + 1} of ${slides.length}`,
  );
  progress.setAttribute("aria-valuenow", index + 1);
}

function isSlideAnswered() {
  return currentSlide().dataset.answered === "true";
}

function revealAnswer() {
  const slide = currentSlide();
  const currentQuestion = scenarioQuestions[QUESTIONNAIRE.slide];
  const correctOptionId = currentQuestion.correctOptionId;
  const userAnswer = slide.querySelector(":checked").value;
  const isCorrect = userAnswer === correctOptionId;

  QUESTIONNAIRE = {
    ...QUESTIONNAIRE,
    answers: [...QUESTIONNAIRE.answers, isCorrect],
  };
  if (isCorrect) {
    QUESTIONNAIRE = { ...QUESTIONNAIRE, score: QUESTIONNAIRE.score + 1 };
    updateScore(true);
  }

  highlightOptions(slide, userAnswer, correctOptionId);
  lockAnsweredSlide(slide);
  updateButton();
  showFeedbackPopup(isCorrect, currentQuestion);
}

function highlightOptions(slide, userAnswer, correctOptionId) {
  slide.querySelectorAll(".quiz_option_input").forEach((input) => {
    const isCorrectOption = input.value === correctOptionId;
    const isWrongChoice = input.value === userAnswer && !isCorrectOption;
    if (!isCorrectOption && !isWrongChoice) return;

    const option = input.closest(".quiz_option");
    option.classList.add(
      isCorrectOption ? "quiz_option_right" : "quiz_option_wrong",
    );
    option.append(createMark(isCorrectOption, 16));
  });
}

function showFeedbackPopup(isCorrect, question) {
  const dialog = createElement("dialog", "quiz_dialog");
  dialog.setAttribute("aria-label", isCorrect ? "Correct!" : "Not quite");

  const feedback = createFeedback(isCorrect, question);
  const closeButton = createElement("button", "quiz_submit", "Close");
  closeButton.type = "button";
  closeButton.addEventListener("click", () => dialog.close());
  feedback.append(closeButton);

  dialog.append(feedback);
  dialog.addEventListener("close", () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
  dialog.querySelector(".quiz_feedback_text").focus();
}

function showResults() {
  const { score, answers } = QUESTIONNAIRE;
  const total = scenarioQuestions.length;
  const percent = (score / total) * 100;
  const { headings, message } = questions.ui.results;
  const title = results.querySelector(".results_title");

  resultsRing.querySelector(".results_ring_score").textContent =
    `${score}/${total}`;
  resultsRing
    .querySelector(".results_ring_value")
    .setAttribute(
      "stroke-dasharray",
      `${(RING_LENGTH * score) / total} ${RING_LENGTH}`,
    );
  title.textContent = headings.find(
    (heading) => percent >= heading.minPercent,
  ).text;
  results.querySelector(".results_message").textContent = message
    .replace("{score}", score)
    .replace("{total}", total);
  results
    .querySelector(".results_list")
    .replaceChildren(
      ...scenarioQuestions.map((question, i) =>
        createSummaryItem(question.summary, answers[i]),
      ),
    );

  document.body.classList.add("page_results");
  quiz.hidden = true;
  resultsRing.hidden = false;
  results.hidden = false;
  window.scrollTo(0, 0);
  title.focus();
}

function createSummaryItem(summary, isCorrect) {
  const { markCorrect, markIncorrect } = questions.ui.results;
  const item = createElement("li", "results_item");
  const mark = createElement(
    "span",
    `results_mark ${isCorrect ? "results_mark_right" : "results_mark_wrong"}`,
  );
  mark.setAttribute("role", "img");
  mark.setAttribute("aria-label", isCorrect ? markCorrect : markIncorrect);
  mark.innerHTML = (isCorrect ? ICON_CHECK : ICON_CROSS).replaceAll(
    "{size}",
    13,
  );
  item.append(mark, createElement("span", "", summary));
  return item;
}

function updateScore(isUp) {
  scoreLong.textContent = ` · SCORE ${QUESTIONNAIRE.score}`;
  scoreShort.textContent = `SCORE ${QUESTIONNAIRE.score}`;
  scoreShort.classList.toggle("quiz_score_up", isUp);
  if (isUp) {
    const arrow = createElement("span", "quiz_score_arrow", "▲");
    arrow.setAttribute("aria-hidden", "true");
    scoreShort.append(" ", arrow);
  }
}

function lockAnsweredSlide(slide) {
  slide.dataset.answered = "true";
  slide.querySelector(".quiz_options").disabled = true;
}

function updateButton() {
  toggleButtonState();
  changeButtonText();
}

function toggleButtonState() {
  submitButton.disabled = currentSlide().querySelector(":checked") === null;
}

function changeButtonText() {
  if (!isSlideAnswered()) {
    submitLabel.textContent = "Check answer";
    return;
  }
  submitLabel.textContent = isLastQuestion()
    ? "See your results"
    : "Next question";
}
