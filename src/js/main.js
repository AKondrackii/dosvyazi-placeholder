import '../scss/main.scss'

const button = document.querySelector(".hero__button");

button.addEventListener("click", () => {
  button.textContent = "Вы в списке ожидания ✅";
  button.classList.add("hero__button--success");
});
