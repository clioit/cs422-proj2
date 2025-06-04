/*
Functions for dashboard functionality. Inlcudes populating main interface with tasks and events.
Created for CS 422 Project 2: ETA in Spring 2025.

Authors: Claire Cody
Last modified: 06/03/2025
*/

/**
 *
 * psuedo coding for setting up schedule
 *
 * create each an OSO for each day by adding all objects from each existing
 * start date to a list of other events on that date
 *
 * these create event objects that are added to the day
 * OSO in an order based on some criteria
 *
 * add these day objects to the calendar
 *   -- Day Month dd, yyy --
 *
 *  [
 * Event Title
 *      Description
 *      --other details ??
 * ] *  [
 * Event Title
 *      Description
 *      --other details ??
 * ] *  [
 * Event Title
 *      Description
 *      --other details ??
 * ]
 *
 */

/** HARD CODED VALUES BEING USED IN PLACE OF BACKEND CONNECTION */

const now = new Date();
const dateA = new Date(2025, 0, 25);
const dateB = new Date(2025, 1, 25);
const dateC = new Date(2025, 2, 25);

const members = [`bob`, `alice`, `susan`];

const taskLists = [
  [
    { description: `print surveys`, assignee: members[0] },
    { description: `make name tents`, assignee: members[1] },
  ],
  [`task a`, `task b`, `task c`],
  [`random this`, `random that`, `lol`],
  [],
];

// let EventList = [
//   {
//     title: `Meeting 1`,
//     description: `Introductions and information exchange`,
//     start: dateA,
//     tasks: taskLists[1],
//   },
//   {
//     title: `Officer Meeting 1`,
//     description: `Introductions and information exchange`,
//     start: dateA,
//     tasks: taskLists[3],
//   },
//   {
//     title: `Meeting 2`,
//     description: `Friendly Tournament`,
//     start: dateB,
//     tasks: taskLists[0],
//   },
//   {
//     title: `Meeting 3`,
//     description: `Lesson 1: Strategic Game Play`,
//     start: dateC,
//     tasks: taskLists[2],
//   },

//   {
//     title: `Meeting 1`,
//     description: `Introductions and information exchange`,
//     start: dateA,
//     tasks: taskLists[1],
//   },
//   {
//     title: `Officer Meeting 1`,
//     description: `Introductions and information exchange`,
//     start: dateA,
//     tasks: taskLists[3],
//   },
//   {
//     title: `Meeting 2`,
//     description: `Friendly Tournament`,
//     start: dateB,
//     tasks: taskLists[0],
//   },
//   {
//     title: `Meeting 3`,
//     description: `Lesson 1: Strategic Game Play`,
//     start: dateC,
//     tasks: taskLists[2],
//   },

//   {
//     title: `Meeting 1`,
//     description: `Introductions and information exchange`,
//     start: dateA,
//     tasks: taskLists[1],
//   },
//   {
//     title: `Officer Meeting 1`,
//     description: `Introductions and information exchange`,
//     start: dateA,
//     tasks: taskLists[3],
//   },
//   {
//     title: `Meeting 2`,
//     description: `Friendly Tournament`,
//     start: dateB,
//     tasks: taskLists[0],
//   },
//   {
//     title: `Meeting 3`,
//     description: `Lesson 1: Strategic Game Play`,
//     start: dateC,
//     tasks: taskLists[2],
//   },
// ];

/******************* */

// let org_id;
// window.onload = async function getOrg() {
//   // get organization id
//   //

//   return fetch(`http://localhost:5001/orgs`)
//     .then((response) => {
//       // if (!response.ok) {
//       //   return response.json().then((errorData) => {
//       //     throw new Error(errorData.description || "Unknown error");
//       //   });
//       // }
//       return response.json();
//     })
//     .then( data => {
//       data.forEach((org) => {
//         org_id = org.id;
//         console.log(org_id);

//       });
//       loadEvents();
//       return;
//     });

// }

// async function loadEvents() {
//   //loads live events into EventList
//   EventList = [];
//   //getOrg();
//   return fetch(`http://localhost:5001/orgs/${org_id}/events`)
//     .then((response) => {
//       // if (!response.ok) {
//       //   return response.json().then((errorData) => {
//       //     throw new Error(errorData.description || "Unknown error");
//       //   });
//       // }
//       return response.json();
//     })
//     .then((data) => {
//       data.forEach((event) => {
//         EventList.push({
//           title: event.title,
//           id: event.id,
//           description: event.description,
//           start: event.start,
//           end: event.end,
//         });
//       });

//       return;
//     });
// }

// loadEvents();
/************************ */

const addNewEvent = document.getElementById("addNewEvent");
addNewEvent.addEventListener("click", function () {
  // newEvent redirects the user to the event editor page.
  window.location.replace(`http://localhost:5001/event_editor/${org_id}`);
});
let orgs = [];
async function getOrgInfo() {
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
        console.log(data);
        orgs.push({
          name: org.name,
          description: org.description,
          id: org.id,
          colors: org.color_scheme,
          join: org.join_token,
        });
      });
      // loadOrg();
      return;
    });
}

//
async function taskManagerMain() {
  // populates Event manager OSO (On-Screen Object)
  // await loadEvents();
  const eventManager = document.getElementById(`event-manager-zone`);
  console.log(eventManager);
  EventList.sort((a, b) => new Date(a.start) - new Date(b.start));
  EventList.sort((a, b) => b.tasks.length - a.tasks.length);

  for (let i = 0; i < EventList.length; i++) {
    let showButton = null;

    // ADD ANCHOR POINT - calls navigation to editor

    let toEdit = document.createElement("a");
    toEdit.addEventListener("click", function () {
      const editor = document.getElementById(`event-container`);
      editor.classList.toggle(`hide`);
      document.getElementById(`dash`).classList.toggle(`hide`);
      document.getElementById(`eventForm`).classList.toggle(`hide`);
      console.log(`here` + EventList[i]);
      // document.getElementById('event-manager-zone').classList.toggle(`hide`);
      // console.log(editor.childNodes);
      // editor.children.forEach(child => child.style.zIndex= `30`);
      // document.getElementById(`${task.id}`).style.border = `dashed 2px black`;
      // console.log(EventList[i]);
      atEditor(EventList[i]);
    });

    let newEvent = eventMaker(EventList[i]);
    let taskArea = document.createElement("div");
    taskArea.className = "event-obj__task-area";
    let taskCount = document.createElement("div");
    taskCount.id = `task-${i}`;
    taskCount.className = "task";

    // THIS NEEDS to be differENT criteria
    if (EventList[i].tasks.length == 0) {
      newEvent.style.textDecoration = `line-through`;
      //TODO
      // const done = document.createElement("div");
      // done.innerHTML = `All tasks complete`;
      // done.style.textDecoration = "none !important";
      // newEvent.append(done);
    }
    //will probably add filter to cross out completed?
    else {
      console.log(EventList[i].tasks);

      EventList[i].tasks.forEach((task) => {
        const newTask = document.createElement("div");
        newTask.classList.add(`task__info`);
        newTask.id = task.id;

        const taskDesc = document.createElement("p");
        taskDesc.innerHTML = task.title;
        taskDesc.className = `task__info--desc`;
        newTask.appendChild(taskDesc);

        // const taskAss = document.createElement("p");
        // taskAss.innerHTML = task.assignee;
        // taskAss.className = `task__info--ass`;
        // newTask.appendChild(taskAss);

        // OTHER ATTRIBUTE GO HERE

        if (task.done === true) {
          newTask.style.textDecoration = `line-through`;
        }
        taskCount.appendChild(newTask);
      });

      showButton = document.createElement("button");
      showButton.textContent = `↑↓`;
      showButton.id = `show-button`;
      showButton.style.backgroundColor = PRIMARY;
      showButton.setAttribute("onclick", `taskFlip(${i})`);
      showButton.style.minWidth = `90%`;
      newEvent.appendChild(showButton);
    }
    taskArea.appendChild(taskCount);
    toEdit.appendChild(taskArea);
    newEvent.appendChild(toEdit);
    eventManager.appendChild(newEvent);
  }
}

// taskManagerMain();

function scheduler() {
  /** This function utilizes eventMaker() to populate schedule side with OSO for
   * events sorted by their dates
   */

  console.log(EventList);
  //   EventList.sort((a, b) => a.tasks.length - b.tasks.length);
  // EventList.sort((a, b) => new Date(a.start) - new Date(b.start));
  console.log(EventList);

  /** TO DO : add TIMES */
  console.log(`here`);
  let months = [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
  ];

  let cal = document.createElement("a");
  cal.addEventListener("click", function () {
    fetch(`http://localhost:5001/orgs/${org_id}/events.ice`);
  });

  const schedule = document.getElementById("schedule-zone");
  console.log(schedule);

  let currDate = 0;

  let newDate = document.createElement("div");
  console.log(EventList);
  for (let i = 0; i < EventList.length; i++) {
    if (currDate === 0) {
      // first iteration
      //  TODO: USE NOW VARIABLE TO DETERMINE IF DAY SHOULD SAY TODAY

      // TODO: add functionality so that each day is sort by task analysis

      newDate.className = `top-date`;
      let thisDate = EventList[i].start.toString().split(`T`);
      const currentDate = new Date().toISOString().split("T")[0];
      if (currentDate === thisDate[0]) {
        console.log(`MEEE`);
        newDate.textContent = `Today`;
      } else {
        console.log(thisDate);
        thisDate = thisDate[0].split(`-`);
        console.log(thisDate);

        thisDate = [parseInt(thisDate[1], 10) - 1, thisDate[2], thisDate[0]];
        console.log(thisDate);
        thisDate = [
          months[thisDate[0]],
          ` `,
          thisDate[1],
          `, `,
          thisDate[2],
        ].join(``);
        newDate.textContent = thisDate;
      }
      newDate.style.fontWeight = 700;
      newDate.style.textAlign = `left`;
      console.log(newDate);

      schedule.appendChild(newDate);
      currDate = EventList[i].start.split(`T`)[0];
      console.log(EventList[i]);

      let newEvent = eventMaker(EventList[i]);
      newDate.appendChild(newEvent);
      currDate = EventList[i].start.split(`T`)[0];
      if (EventList[i].tasks.length == 0) {
        newEvent.style.border = `solid 1px white`;
      }
    } else if (currDate === EventList[i].start.split(`T`)[0]) {
      //under same day
      console.log(newDate);
      let newEvent = eventMaker(EventList[i]);
      console.log(newEvent);
      newDate.appendChild(newEvent);
      if (EventList[i].tasks.length == 0) {
        newEvent.style.border = `solid 1px white`;
      }
      currDate = EventList[i].start.split(`T`)[0];
    } else {
      //under new day
      newDate = document.createElement("div");
      newDate.className = "top-date";
      let thisDate = EventList[i].start.toString().split(`T`);

      console.log(thisDate);
      thisDate = thisDate[0].split(`-`);
      console.log(thisDate);

      thisDate = [parseInt(thisDate[1], 10) - 1, thisDate[2], thisDate[0]];
      console.log(thisDate);
      thisDate = [
        months[thisDate[0]],
        ` `,
        thisDate[1],
        `, `,
        thisDate[2],
      ].join(``);
      newDate.textContent = thisDate;
      // }
      newDate.style.fontWeight = 700;
      newDate.style.textAlign = `left`;
      console.log(newDate);
      schedule.appendChild(newDate);

      currDate = EventList[i].start;
      console.log(EventList[i]);

      newEvent = eventMaker(EventList[i]);
      // const myAnchor = document.createElement("a");

      // if (EventList[i].tasks.length == 0) {
      //   newEvent.style.border = `solid 1px white`;
      // }
      newDate.appendChild(newEvent);
      currDate = EventList[i].start.split(`T`)[0];
      if (EventList[i].tasks.length == 0) {
        newEvent.style.border = `solid 1px white`;
      }
    }
  }
}

function eventMaker(addMe) {
  /* creating OSO for event, 'addMe'*/
  // add me must contain fields:
  // title, descriptions & *tasks*
  console.log(addMe);
  console.log(addMe.title);

  // creating new event object
  const newEvent = document.createElement("div");
  newEvent.className = "event-obj";

  //creating Title
  const eventTitle = document.createElement("h4");
  eventTitle.className = `event-obj__title`;
  eventTitle.innerHTML =
    addMe.title + ` @ ` + addMe.start.toString().split(`T`)[1];
  eventTitle.style.textAlign = `left`;
  //adding Title to event object
  newEvent.appendChild(eventTitle);

  //creating Description
  const eventDesc = document.createElement("h5");
  eventDesc.className = `event-obj__desc`;
  eventDesc.innerHTML = addMe.description;
  eventDesc.style.textAlign = `left`;
  //adding description
  newEvent.appendChild(eventDesc);

  console.log(newEvent);

  // color assignments -
  console.log(addMe.tasks);
  if (addMe.tasks.length >= 2) {
    newEvent.style.backgroundColor = PRIMARY;
  } else if (addMe.tasks.length >= 1) {
    newEvent.style.backgroundColor = SECONDARY;
  } else if (addMe.tasks.length == 0) {
    newEvent.style.backgroundColor = TERTIARY;
    newEvent.style.color = PRIMARY;
  }
  return newEvent;
}

function taskFlip(i) {
  let task = document.getElementById(`task-${i}`);
  console.log(task);
  if (task.classList.contains("hide")) {
    task.classList.remove("hide");
  } else {
    task.classList.add("hide");
  }
}

let taskState = false;
function allTaskToggle() {
  taskState = !taskState;
  let taskField = document.querySelectorAll(".task");
  taskField.forEach((task) => {
    if (!taskState) {
      if (task.classList.contains("hide")) {
        task.classList.remove("hide");
      }
    } else {
      if (!task.classList.contains("hide")) {
        task.classList.add("hide");
      }
    }
    return;
  });
}

function loadOrg() {
  console.log(orgs[0].name);

  document.getElementById("name").innerHTML = orgs[0].name;
  document.getElementById("orgDesc").innerHTML = orgs[0].description;

}

function setUser() {
  console.log(user);
  const username = document.getElementById(`user`);
  username.innerHTML = user.toUpperCase();
}

function logout() {
  // logout logs the user out of their account and returns to the login screen
  console.log("logging out...");
  window.location.replace(`http://localhost:5001/logout`);
}

//loadOrg();
