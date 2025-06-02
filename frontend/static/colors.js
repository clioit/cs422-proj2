let PRIMARY;
let SECONDARY;
let TERTIARY;
const primaries = document.querySelectorAll(`.primary`);
const secondaries = document.querySelectorAll(`.secondary`);
const tertiaries = document.querySelectorAll(`.tertiary`);


window.onload = async function getOrg() {
  // get organization id
  //

  return fetch(`http://localhost:5001/orgs`)
    .then((response) => {
      // if (!response.ok) {
      //   return response.json().then((errorData) => {
      //     throw new Error(errorData.description || "Unknown error");
      //   });
      // }
      return response.json();
    })
    .then((data) => {
      data.forEach((org) => {
        colors = org.color_scheme;
      });
      PRIMARY = colors[0];
      SECONDARY = colors[1];
      TERTIARY = colors[2];
      primaries.forEach(obj => obj.style.backgroundColor = PRIMARY);
      secondaries.forEach(obj => obj.style.backgroundColor = SECONDARY);
      tertiaries.forEach(obj => obj.style.backgroundColor = TERTIARY);
      document.documentElement.style.setProperty("--primary-color", PRIMARY);
      document.documentElement.style.setProperty("--secondary-color", SECONDARY);
      document.documentElement.style.setProperty("--tertiary-color", TERTIARY);
      console.log(colors);
      return;
    });
}