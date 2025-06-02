/*
Factored out logic for loading the users of an organization.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody, Clio Tsao
Last modified: 06/01/2025
*/

async function loadPeople() {
  // loads people to select for POC
  people = [];
  return fetch(`/orgs/${org_id}/users`, {
        method: 'GET'
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.description || 'Unknown error');
          });
        }
        return response.json();
      })
      .then(data => {
        // people = data;
        console.log(data);
        people.length = 0;
        for (let key in data) {
          people.push({id: key, username: data[key]});
        }
        console.log(people);
        loadPersonSelect(people);
        })
      .catch(error => {
        console.error("Error: ", error.message);
        return [];
      });
  }

function loadPersonSelect(people){
  const personSelect = document.getElementById('person');

  people.forEach(person =>{
    newPerson = document.createElement(`option`);
    newPerson.textContent = person.username;
    newPerson.value = person.id;
    personSelect.appendChild(newPerson);
  })
}