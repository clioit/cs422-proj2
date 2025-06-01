/*
Functions for event editor functionality. Inlcudes getting form inputs and saving.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody, Clio Tsao
Last modified: 05/30/2025
*/

const task = document.getElementById("event_editor_container");

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.querySelector('.dropdown-toggle');
    const detailsContent = document.querySelector('.details-content');
    const publishCheckbox = document.getElementById('publishCheckbox');
    const submitButton = document.getElementById('submitButton');
    const eventForm = document.getElementById('eventForm');
    const eventEditorContainer = document.getElementById('event_editor_container');

  //Toggle the dropdown section when you click the button
    if (toggleButton && detailsContent) {
      toggleButton.addEventListener('click', () => {
        detailsContent.classList.toggle('hidden');
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

  //Handle form submission (placeholder for now)
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();

      console.log("Form submitted! (Just testing for now)");

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
    // THESE VARIABLES ARE CURRENTLY HARDCODED! GET IT FROM URL HANDLE WHEN UPDATED
    // const org_id = "683a2b2770c588a14a8ef926";
    const dummy_start = "2025-05-30T12:00"
    const dummy_end = "2025-05-30T16:00"
    const dummy_poc = "683a2b2770c588a14a8ef928"
    let publish = publishCheckbox.checked;

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
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
        start: dummy_start,
        end: dummy_end,
        published: publish,
        info: {
          rsvp: rsvp,
          venue: venue,
          contact: contact,
          budget: budget,
          other: other
        },
        point_of_contact: dummy_poc,
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
        message.textContent = result.body.message;
        window.location.reload();
      } else {
        message.textContent = result.body.message || 'Add event failed.';
      }
    })
    .catch(error => {
      message.textContent = 'An error occurred: ' + error.message;
    });
    // display success message and redirect
    message.textContent = 'New event saved!';
    // setTimeout(() => window.location.replace(`http://localhost:5001/dashboard`), 1500);
  }

  else if (empty_fields.length > 0) {
    // prompt user to fill out fields if there are any missing
    message.textContent = 'Please fill out required fields.';
    return;
  }
}

function goDashboard(){
  // goDashboard redirects the user back to the dashboard.
  window.location.replace(`http://localhost:5001/dashboard/${org_id}`);
}