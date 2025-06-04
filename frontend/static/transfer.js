/*
Handles loading existing events to editor from dashboard.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody
Last modified: 06/01/2025
*/

    const eventName = document.getElementById('title');
    const desc = document.getElementById('description');
    const start = document.getElementById('start');
    const end = document.getElementById('end');
        const startT = document.getElementById('startTime');
    const endT = document.getElementById('endTime');
    const rsvp = document.getElementById('rsvpDetail');
    const contact = document.getElementById(`contactDetail`);
    const venue = document.getElementById(`venueDetail`);
    const budget = document.getElementById(`budgetDetail`);

let thisEvent;
async function atEditor(idx){
  
     console.log('running');
    // await loadEventsEdit();
    thisEvent = idx;
    console.log(thisEvent);

    let top = thisEvent.start.split('T');
    let bottom = thisEvent.end.split(`T`);

    eventName.value = thisEvent.title;
    desc.value = thisEvent.description;
    console.log(thisEvent.start);
    start.value = top[0];
    startT.value = top[1];
    end.value = bottom[0];
    endT.value = bottom[1];
    rsvp.value = thisEvent.info.rsvp;
    contact.value = thisEvent.info.contact;
    venue.value = thisEvent.info.venue;
    budget.value = thisEvent.info.budget;

    loadTaskSelect(thisEvent.tasks);
}

function loadTaskSelect(tasks){
  const taskSelect = document.getElementById('taskDropdown');

  tasks.forEach(task =>{
    newTask = document.createElement(`option`);
    newTask.textContent = task.title;
    newTask.value = task.description;
    newTask.id = task.id;
    taskSelect.appendChild(newTask);
  })
}

function loadTask(){
  const taskSelect = document.getElementById(`taskDropdown`).value;
  const descBox = document.getElementById('newTask');
  descBox.value = taskSelect;
}

async function patchEvent(){
  
      const editor = document.getElementById(`event-container`);
      editor.classList.toggle(`hide`);
      document.getElementById(`dash`).classList.toggle(`hide`);
      document.getElementById(`eventForm`).classList.toggle(`hide`);

const url = `http://localhost:5001/orgs/${org_id}/events/${thisEvent.id}`; // Replace with your API endpoint
const data = {
        title: eventName.value,
        description: desc.value,
        // "start": "2025-07-31T08:02",
         start: [start.value,startT.value].join('T'),
        // "end": "2025-07-31T12:02",
        // published: false,
        // point_of_contact: "683c08ff796f2a380d1fb788",
        // "tasks": [
        //     "683c08ff796f2a380d1fb783",
        //     "683c08ff796f2a380d1fb784"
        // ],
        "info": {
            rsvp: rsvp.value,
            venue: venue.value,
            contact: contact.value,
            budget: budget.value,
            // "other": null
        }
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
    window.location.reload();
  })
  .catch(error => {
    console.error('Error updating resource:', error);
  });

}

function patchTask(){
  // uses id of selected task to patch that task
  let selectValue = document.getElementById('taskDropdown')
  let desc = document.getElementById(`newTask`);
let taskID = selectValue.options[selectValue.selectedIndex].id;
let check = document.getElementById(`taskCheck`).value;
console.log(check);


  const url = `http://localhost:5001/orgs/${org_id}/events/${thisEvent.id}/tasks/${taskID}`; // Replace with your API endpoint
const data = {
        description: desc.value,
        completed: check
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