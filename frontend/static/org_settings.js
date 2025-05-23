function setColor() {
  const primary = document.getElementById("primary");
  const secondary = document.getElementById("secondary");
  const tertiary = document.getElementById("tertiary");

  primary.style.backgroundColor = primary.value;
  secondary.style.backgroundColor = secondary.value;
  tertiary.style.backgroundColor = tertiary.value;
}
setColor();
