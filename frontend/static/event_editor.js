/*
Functions for event editor functionality. Includes getting form inputs and saving.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody, Clio Tsao, Evelyn Orozco
Last modified: 06/01/2025
*/

const task = document.getElementById("event_editor_container");
let userArray = [];
let taskArray = [];

document.addEventListener("DOMContentLoaded", () => {
    const eventToggleButton = document.querySelector('.dropdown-toggle');
    const detailsContent = document.querySelector('.details-content');
    const taskToggleButton = document.querySelector('.dropdown-task-toggle');
    const taskContent = document.querySelector('.task-content');
    const taskDropdown = document.getElementById('taskDropdown');
    const publishCheckbox = document.getElementById('publishCheckbox');
    const submitButton = document.getElementById('submitButton');
    const eventForm = document.getElementById('eventForm');
    const saveTaskButton = document.getElementById('saveTaskBtn');
    loadPeople();

  // Toggle Event Details
  if (eventToggleButton && detailsContent) {
    eventToggleButton.addEventListener('click', () => {
      detailsContent.classList.toggle('hidden');
    });
  }

  // Toggle Task Section
  if (taskToggleButton && taskContent) {
    taskToggleButton.addEventListener('click', () => {
      taskContent.classList.toggle('hidden');
    });
  }
  
  // Update button label based on checkbox
  if (publishCheckbox && submitButton) {
    publishCheckbox.addEventListener('change', () => {
      if (publishCheckbox.checked) {
        submitButton.textContent = "Save and Publish";
      } else {
        submitButton.textContent = "Save Event";
      }
    });
  }

  // Interactive task dropdown
  if (taskDropdown) {
    taskDropdown.addEventListener('change', () => {
      const idx = document.getElementById('taskDropdown').value;
      if (idx == '') {
          document.getElementById('task-title').value = '';
          document.getElementById('due-date').value = '';
          document.getElementById('newTask').value = '';
        }      
        else {
          let selectedTask = taskArray[idx];
          document.getElementById('task-title').value = selectedTask.title;
          document.getElementById('due-date').value = (selectedTask.due_date).slice(0, -6);
          document.getElementById('newTask').value = selectedTask.description;
        } 
    });
  }

  if (saveTaskButton) {
    saveTaskButton.addEventListener('click', function() {
      const task_id = document.getElementById('taskDropdown').value;
      console.log(task_id);
      const task_title = document.getElementById('task-title').value;
      console.log(task_title);
      const due_date = document.getElementById('due-date').value;
      console.log(due_date);
      const task_description = document.getElementById('newTask').value;
      console.log(newTask);
      const task_msg = document.getElementById('tsk-msg');
      console.log(task_msg);
      
      // if required fields are filled out,
      if (task_title && due_date)
        // if it is a new task (indicated by "Create New Task" selection),       
        if (task_id== '') {
          // get task fields and save in json format
          console.log("saving new task...");
          let tsk = {
            title: task_title,
            description: task_description,
            due_date: due_date+"T22:00",
          }

          // add it to an array for saving with event later
          taskArray.push(tsk);
          console.log(taskArray);

          // clear inputs
          document.getElementById('taskDropdown').value = '';
          document.getElementById('task-title').value = '';
          document.getElementById('due-date').value = '';
          document.getElementById('newTask').value = '';
          task_msg.textContent = "Task "+taskArray.length+" saved.";

          // populate dropdown with the event
          let idx = taskArray.length - 1;
          taskItem = document.createElement(`option`);
          taskItem.textContent = taskArray[idx].title;
          taskItem.value = idx;
          taskDropdown.appendChild(taskItem);
        }      
        else {
          // update the correct item in the array
          taskArray[task_id] = {
            title: task_title,
            description: task_description,
            due_date: due_date+"T22:00",
          }
          let taskNum =Number(task_id) + 1;
          taskDropdown.options[taskNum].textContent = task_title;
          task_msg.textContent = "Task "+taskNum+" updated.";
        } 
      else { // missing required fields
        task_msg.textContent = "Task Title and Due Date are required fields for creating a task!";
      }
    })
  }

  //Handle form submission (placeholder for now)
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // console.log("Form submitted! (Just testing for now)");

      //Gather form data to send to the backend
    });
  }
});

function postEvent(){
  // postEvent creates and saves a new event, then redirects the user back to the dashboard after a delay.

  // get message and any empty fields
  const message = document.getElementById('message');
  const empty_fields = document.querySelector(":invalid");

  if (empty_fields == null) {
    console.log("saving new event...");
    // postEvent adds a new event to the database
    // get inputs
    // DUMMY VARIABLES ARE HARDCODED and for testing only
    // const org_id = "683a2b2770c588a14a8ef926";
    // const dummy_start = "2025-05-30T12:00"
    // const dummy_end = "2025-05-30T16:00"
    // const dummy_poc = "683a2b2770c588a14a8ef928"
    let publish = publishCheckbox.checked;

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const start = document.getElementById('start').value;
    const startTime = document.getElementById('startTime').value;
    console.log(start);
    const end = document.getElementById('end').value;
    const endTime = document.getElementById('endTime').value;
    console.log(end);
    const rsvp = document.getElementById('rsvpDetail').value;
    const contact = document.getElementById('contactDetail').value;
    const venue = document.getElementById('venueDetail').value;
    const budget = document.getElementById('budgetDetail').value;
    const other = document.getElementById('other').value;
    const poc = document.getElementById('person').value;
    console.log(publish);

    // POST request to endpoint
    fetch(`/orgs/${org_id}/events`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        description: description,
        start: start+"T"+startTime,
        end: end+"T"+endTime,
        published: publish,
        tasks: taskArray,
        info: {
          rsvp: rsvp,
          venue: venue,
          contact: contact,
          budget: budget,
          other: other
        },
        point_of_contact: poc,
      })
    })
    // check response is json
    .then(async response => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return { status: response.status, body: data };
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }
    })
    // handle result
    .then(result => {
      if (result.status === 201) {
        message.textContent = 'New event saved!';
        // window.location.reload();
      } else {
        message.textContent = result.body.message || 'Add event failed.';
      }
    })
    .catch(error => {
      message.textContent = 'An error occurred: ' + error.message;
    });
    // display success message and redirect
    // setTimeout(() => window.location.replace(`http://localhost:5001/dashboard`), 1500);
  }

  else if (empty_fields.length > 0) {
    // prompt user to fill out fields if there are any missing
    message.textContent = 'Please fill out required fields.';
    return;
  }
}

function goDashboard() {
  // goDashboard redirects the user back to the dashboard.
  window.location.replace(`http://localhost:5001/dashboard/${org_id}`);
}
