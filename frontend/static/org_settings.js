/*
Functions for org editor page. Inlcudes selecting dynamic colors for the org color scheme.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody
Last modified: 05/29/2025
*/

let org_id = [];
const primary = document.getElementById("primary");
const secondary = document.getElementById("secondary");
const tertiary = document.getElementById("tertiary");



async function getOrgInfo() {
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
  // hardcoded because user has only one club
  console.log(org_id);
  document.getElementById('org-name').value = org_id[0].name; 

  document.getElementById('desc').value = org_id[0].description;
}


async function patchOrg(){
  console.log(primary.value.toString());
const orgName = document.getElementById(`org-name`).value;
const desc = document.getElementById(`desc`).value;

const url = `http://localhost:5001/orgs/${org_id[0].id}`; // Replace with your API endpoint
const data = {
        name: orgName,
        description: desc,
        color_scheme: [
          primary.value.toString(),
          secondary.value.toString(),
          tertiary.value.toString()
        ]
};

fetch(url, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json', // Specify JSON format
    // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Optional: Add auth if required
  },
  body: JSON.stringify(data) // Convert data to JSON string
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse JSON response
  })
  .then(updatedResource => {
    console.log('Resource updated successfully:', updatedResource);
  })
  .catch(error => {
    console.error('Error updating resource:', error);
  });


}

async function setColor() {

  primary.style.backgroundColor = primary.value;
  secondary.style.backgroundColor = secondary.value;
  tertiary.style.backgroundColor = tertiary.value;

  const light = document.querySelectorAll(".primary");
  const dark = document.querySelectorAll(".tertiary");
  const mid = document.querySelectorAll(".secondary");

  light.forEach((thing) => (thing.style.backgroundColor = primary.value));
  dark.forEach((thing) => (thing.style.backgroundColor = tertiary.value));
  mid.forEach((thing) => (thing.style.backgroundColor = secondary.value));
  // patchColors();
}
getOrgInfo();


async function firstLoad(){
  await getOrgInfo();
  primary.value = org_id[0].colors[0];
  secondary.value = org_id[0].colors[1];
  tertiary.value = org_id[0].colors[2];

    primary.style.backgroundColor = primary.value;
  secondary.style.backgroundColor = secondary.value;
  tertiary.style.backgroundColor = tertiary.value;

  setColor();
}
firstLoad();