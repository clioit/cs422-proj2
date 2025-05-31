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

  //Making event submission with a function
  
  if (eventForm && eventEditorContainer) {
    eventForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(eventForm);
      const data = Object.fromEntries(formData.entries());

      // Send a POST request to save the event
      fetch('/events/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // redirect
      })
    
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }
});
  