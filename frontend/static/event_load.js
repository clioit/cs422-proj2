/*
Factored functions for loading lists. Inlcudes loading events and tasks.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody
Last modified: 05/29/2025
*/

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
}

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
          tasks: taskList,
          info: event.info
        });
      });
      // scheduler();
      // taskManagerMain();
      // console.log(EventList);
      go = true;
      // runMain();
      return;
    });
}
  // let taskList = [];
async function loadTasks(i) {
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


async function getUser() {
  return fetch(`http://localhost:5001/users/me`)
    .then((response) => {return response.json();})
    .then((data) => {
      user = data.username;
      console.log(`user ` + user);
    });
}
getUser();

function runMain() {
  console.log(`running` + EventList);
  taskManagerMain();
  EventList.sort((a, b) => a.tasks.length - b.tasks.length);
  EventList.sort((a, b) => a.start - b.start);
  scheduler();
}


 setTimeout(runMain, 300);
 
 setTimeout(setUser, 300);

