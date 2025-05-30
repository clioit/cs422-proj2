/*
Functions for org editor page. Inlcudes selecting dynamic colors for the org color scheme.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody
Last modified: 05/29/2025
*/

const primary = document.getElementById("primary");
const secondary = document.getElementById("secondary");
const tertiary = document.getElementById("tertiary");

function setColor() {
  primary.style.backgroundColor = primary.value;
  secondary.style.backgroundColor = secondary.value;
  tertiary.style.backgroundColor = tertiary.value;

  const light = document.querySelectorAll(".primary");
  const dark = document.querySelectorAll(".tertiary");
  const mid = document.querySelectorAll(".secondary");

  light.forEach((thing) => (thing.style.backgroundColor = primary.value));
  dark.forEach((thing) => (thing.style.backgroundColor = tertiary.value));
  mid.forEach((thing) => (thing.style.backgroundColor = secondary.value));
}
setColor();

let org_id = [];
window.onload = async function getOrgInfo() {
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
        console.log(data);
        org_id.push({
          name: org.name,
          description: org.description,
          id: org.id,
          colors: org.color_scheme,
          join: org.join_token,
        });
        
      });
      loadOrg();
      return;
    });
};

function loadOrg(){
  console.log(org_id);
  document.getElementById('org-name').value = org_id[0].name;

  document.getElementById('desc').value = org_id[0].description;
}