const svgBox = document.querySelector(".second__column");
const first__column = document.querySelector(".first__column");
const third__column = document.querySelector(".third__column");

svgBox.addEventListener("click", (e) => {
  svgBox.classList.toggle("rotate");
  first__column.classList.toggle('translate__first')
  third__column.classList.toggle('translate__third')
});
