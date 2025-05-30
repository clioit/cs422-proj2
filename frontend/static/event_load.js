let org_id;
let go = false;
window.onload = async function getOrg() {
  // get organization id
  //

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
        org_id = org.id;
        console.log(org_id);
      });
      loadEvents();
      return;
    });
};

async function loadEvents() {
  //loads live events into EventList
  EventList = [];
  //getOrg();
  return fetch(`http://localhost:5001/orgs/${org_id}/events`)
    .then((response) => {
      // if (!response.ok) {
      //   return response.json().then((errorData) => {
      //     throw new Error(errorData.description || "Unknown error");
      //   });
      // }
      return response.json();
    })
    .then((data) => {
      data.forEach((event) => {
        let tasks = [];
        loadTasks(event.id, tasks);
        console.log(tasks);
        EventList.push({
          title: event.title,
          id: event.id,
          description: event.description,
          start: event.start,
          end: event.end,
          tasks: tasks,
        });
      });
      // scheduler();
      // taskManagerMain();
      // console.log(EventList);
      go = true;
      return;
    });
}

async function loadTasks(i, taskList) {
  // let taskList = [];
  console.log("org_id" + org_id);
  return fetch(`http://localhost:5001/orgs/${org_id}/events/${i}/tasks`)
    .then((response) =>
      // if (!response.ok) {
      //   return response.json().then((errorData) => {
      //     throw new Error(errorData.description || "Unknown error");
      //   });
      // }
      response.json()
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

function runMain() {
  if (go===true){
  taskManagerMain();
  EventList.sort((a, b) => a.tasks.length - b.tasks.length);
  EventList.sort((a, b) => a.start - b.start);
  scheduler();
  go = false;}
}

 setTimeout(runMain, 2000);
