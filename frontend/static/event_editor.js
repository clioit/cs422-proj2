const task = document.getElementById("event_editor_container");

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.querySelector('.dropdown-toggle');
    const detailsContent = document.querySelector('.details-content');

    if (toggleButton && detailsContent) {
        toggleButton.addEventListener('click', () => {
            detailsContent.classList.toggle('hidden');
        });
    } else {
        console.error('Required elements are missing in the DOM.');
    }
});