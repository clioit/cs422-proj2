

function patchColors(){
}


async function atEditor(idx){
  
     console.log('running');
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
    // await loadEventsEdit();
    let thisEvent = idx;

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
    taskSelect.appendChild(newTask);
  })
}

function loadTask(){
  const taskSelect = document.getElementById(`taskDropdown`).value;
  const descBox = document.getElementById('newTask');
  descBox.value = taskSelect;
}
