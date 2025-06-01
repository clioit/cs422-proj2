let orgInfo;
let EventList;

async function getOrgInfo() {
  // get organization id
  //
    orgInfo = [];
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
        orgInfo.push({name: org.name, id: org.id, colors: org.color_scheme});
      });
      return;
    });
}
getOrgInfo();

function patchColors(){
}

let currIdx;
async function openEditor(eventID){
    console.log('here');
    window.location.replace(`http://localhost:5001/event_editor`);
    await fetch(`http://localhost:5001/orgs/${orgInfo[0].id}/events/${eventID}`).then(
        response => response.json().then(
            data => {atEditor(data);}
        )
    );
    //  setInterval(() => {atEditor(currIdx);}, 300);
    // setInterval(() => atEditor(idx), 500);
}


async function atEditor(idx){
    
    //  window.location.replace(`http://localhost:5001/event_editor`);
    //  await loadEventsEdit();
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


async function loadEventsEdit() {
  //loads live events into EventList
  await getOrgInfo();
  EventList = [];
  //getOrg();
  return fetch(`http://localhost:5001/orgs/${orgInfo[0].id}/events`)
    .then((response) => {
      // if (!response.ok) {
      //   return response.json().then((errorData) => {
      //     throw new Error(errorData.description || "Unknown error");
      //   });
      // }
      return response.json();
    })
    .then((data) => {
      let idx = 0;
      data.forEach((event) => {
        loadTasks(event.id);
        console.log(taskList);
        console.log(idx);
        console.log(taskList[idx]);
        idx++;

        EventList.push({
          title: event.title,
          id: event.id,
          description: event.description,
          start: event.start,
          end: event.end,
          tasks: taskList
        });
      });
      // scheduler();
      // taskManagerMain();
      // console.log(EventList);
    //   go = true;
      // runMain();
      return;
    });
}
  let taskList = [];
async function loadTasksEdit(i) {
  taskList = [];
  console.log("org_id" + org_id);
  return fetch(`http://localhost:5001/orgs/${org_id}/events/${i}/tasks`)
    .then((response) =>{
      // if (!response.ok) {
      //   return response.json().then((errorData) => {
      //     throw new Error(errorData.description || "Unknown error");
      //   });
      // }
      return response.json();}
    )
    .then((data) => {
      data.forEach((task) => {
        console.log(task);
        taskList.push({
          id: task.id,
          title: task.title,
          description: task.description,
          due: task.due_date,
          assignee: task.assignee,
          done: task.completed
        });
      console.log(taskList);
      });
      return;
    });
  // return taskLists[0];
}