const URL_API_BACKEND_LOCAL = "http://localhost:5000";
const URL_API_BACKEND_PROD = "";

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

form.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();
  setLoadingItems();

  //fetch data from server -> bot's response

  const response = await fetch(`${URL_API_BACKEND_LOCAL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: generatePromptByAgeAndThemes(
        ageInput.valueAsNumber,
        themesInput.value
      ),
    }),
  });

  if (response.ok) {
    const data = await response.json();
    footer.innerHTML = translateTextToHtml(data.bot.trim());
  } else {
    const err = await response.text();

    footer.innerHTML = "Something went wrong";
    alert(err);
  }

  removeLoadingItems();
});
