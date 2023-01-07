const form = document.querySelector<HTMLFormElement>("form")!;
const ageInput = document.querySelector<HTMLInputElement>("#age")!;
const themesInput = document.querySelector<HTMLInputElement>("#themes")!;
const submitButton = document.querySelector<HTMLButtonElement>("button")!;
const footer = document.querySelector<HTMLElement>("footer")!;

const generatePromptByAgeAndThemes = (age: number, themes = "") => {
  let prompt = `Propose moi, avec un ton joyeux et amical, 5 idées de cadeau pour une personné de ${age} ans`;
  if (themes.trim()) {
    prompt += `et qui aime ${themes}`;
  }
  return prompt + " !";
};

const setLoadingItems = () => {
  footer.textContent = "Chargement de supers idées en cours !";
  footer.setAttribute("aria-busy", "true");
  submitButton.setAttribute("aria-busy", "true");
  submitButton.disabled = true;
};

const removeLoadingItems = () => {
  footer.setAttribute("aria-busy", "false");
  submitButton.setAttribute("aria-busy", "false");
  submitButton.disabled = false;
};

//translate \n to <p></p>
const translateTextToHtml = (text: string) =>
  text
    .split("\n")
    .map((str) => `<p>${str}</p>`)
    .join("");

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  setLoadingItems();

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: generatePromptByAgeAndThemes(
        ageInput.valueAsNumber,
        themesInput.value
      ),
      max_tokens: 2000,
      model: "text-davinci-003", //text-curie-001
    }),
  })
    .then((response) => response.json())
    // .then((data) => console.log(data.choices[0].text))
    .then((data) => {
      footer.innerHTML = translateTextToHtml(data.choices[0].text);
    })
    .finally(() => removeLoadingItems());
});
