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
  

function saveEvent(){
  // saveEvent currently redirects the user back to the dashboard after a delay.
  // TODO: update function so that it creates and saves a new event
  // get message and any empty fields
  const message = document.getElementById('message');
  const empty_fields = document.querySelector(":invalid");

  if (empty_fields == null) {
    message.textContent = 'New event saved!';
    setTimeout(() => window.location.replace(`http://localhost:5001/dashboard`), 1500);
  }
  // check if valid pdf type
  else if (empty_fields.length > 0) {
    message.textContent = 'Please fill out required fields.';
    return;
  }
}