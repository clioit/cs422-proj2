/*
Factored functions for loading lists. Inlcudes loading events and tasks.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody
Last modified: 05/29/2025
*/

let org_id;
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
    .then( data => {
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
      data.forEach((event) => {
        let tasks = loadTasks(event.id);
        EventList.push({
          title: event.title,
          id: event.id,
          description: event.description,
          start: event.start,
          end: event.end,
          tasks: tasks
        });
      });
      scheduler();
      taskManagerMain();
      console.log(EventList);
      return;
    });
}

function loadTasks(i){
    let taskList = [];
    console.log('org_id' + org_id);
    return fetch(`http://localhost:5001/orgs/${org_id}/events/${i}/tasks`)
    .then((response) => {
      // if (!response.ok) {
      //   return response.json().then((errorData) => {
      //     throw new Error(errorData.description || "Unknown error");
      //   });
      // }
      return response.json();
    })
    .then((data) => {
      data.forEach((task) => {
        taskList.push({

        });
      });
      // scheduler();
      // taskManagerMain();
      // console.log(EventList);
      return;
    });
    // return taskLists[0];
}