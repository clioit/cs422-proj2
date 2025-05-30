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

  //Making event submission
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();

      //console.log("Form submitted(Just testing for now)");

      //Data to be sent to the server?
    });
  }
});
  