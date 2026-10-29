const form = document.querySelector(".quiz_form");
const submitButton = form.querySelector(".quiz_submit");

form.addEventListener("change", () => {
  submitButton.disabled = !form.checkValidity();
});
