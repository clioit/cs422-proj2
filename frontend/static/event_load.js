/*
Factored functions for loading lists. Inlcudes loading events and tasks.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody, Clio Tsao
Last modified: 06/01/2025
*/

// let org_id;
let go = false;
let colors  = [];
taskArray = [];
let PRIMARY;
let SECONDARY;
let TERTIARY;
const primaries = document.querySelectorAll(`.primary`);
const secondaries = document.querySelectorAll(`.secondary`);
const tertiaries = document.querySelectorAll(`.tertiary`);
let EventList;


// window.onload = 
 async function getOrg() {
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
      //   org_id = org.id;
      //   console.log(org_id);
        colors = org.color_scheme;
      });
      PRIMARY = colors[0];
      SECONDARY = colors[1];
      TERTIARY = colors[2];
      primaries.forEach(obj => obj.style.backgroundColor = PRIMARY);
      secondaries.forEach(obj => obj.style.backgroundColor = SECONDARY);
      tertiaries.forEach(obj => obj.style.backgroundColor = TERTIARY);
      document.documentElement.style.setProperty("--primary-color", PRIMARY);
      document.documentElement.style.setProperty("--secondary-color", SECONDARY);
      document.documentElement.style.setProperty("--tertiary-color", TERTIARY);
      console.log(colors);
      // setUp();
      
      return;
    });
}
// getOrg();

async function setUp(){
  // await loadEvents();
  setTimeout(runMain, 300);
  setUser();

}

async function loadEvents() {
  //loads live events into EventList
  EventList = [];
  // taskList = [];
  //getOrg();
  console.log(`running`);
  console.log(org_id);
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
      // let idx = 0;
      taskArray = [];
      // data.forEach((event) => {
      //   loadTasks(event.id);
      //   console.log(taskList);
      //   console.log(idx);
      //   console.log(taskList[idx]);
      //   idx++;
      //   })
        data.forEach((event) => {
        EventList.push({
          title: event.title,
          id: event.id,
          description: event.description,
          start: event.start,
          end: event.end,
          tasks: null,
          info: event.info
        });
        
        
      });
      // scheduler();
      // taskManagerMain();
      // console.log(EventList);
      // taskFill();
      // runMain();
      // setUser();
      go = true;
      return;
    });
}


async function loadTasks(i) {
  console.log("org_id" + org_id);
  console.log(`loading tasks  ` + taskArray);
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
      let newList = [];
      data.forEach((task) => {
        console.log(task); 
        newList.push({
          id: task.id,
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          assignee: task.assignee,
          done: task.completed
        });
      });
      console.log(newList + `!!!`);
      taskArray.push(newList);
      console.log(taskArray);
      return;
    });
  // return taskLists[0];
}


async function getUser() {
  return fetch(`http://localhost:5001/users/me`)
    .then((response) => {return response.json();})
    .then((data) => {
      user = data.username;
      console.log(`user ` + user);
    });
}
//getUser();


function runMain() {
  console.log(`running` + EventList);
  taskFill();
  taskManagerMain();
  EventList.sort((a, b) => a.tasks.length - b.tasks.length);
  EventList.sort((a, b) => a.start - b.start);
  scheduler();
}

async function taskFill(){

  console.log(`taskFill`)
  console.log(taskArray);
  for (let i = 0; i<EventList.length;i++){
    await loadTasks(EventList[i].id);
     EventList[i].tasks = taskArray[i];
  }
}


//  setTimeout(runMain, 300);
 
//  setTimeout(setUser, 300);