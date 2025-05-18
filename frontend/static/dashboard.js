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

const BROWN = `#ffffff`;
const ORANGE = `#cccccc`;
const WHITE = `#444444`;

const now = new Date();
const dateA = new Date(2025, 0, 25);
const dateB = new Date(2025, 1, 25);
const dateC = new Date(2025, 2, 25);

const taskLists = [
  [`print surveys`, `make name tents`],
  [`task a`, `task b`, `task c`],
  [`random this`, `random that`, `lol`],
  []
];

const EventList = [
  {
    title: `Meeting 1`,
    description: `Introductions and information exchange`,
    start: dateA,
    tasks: taskLists[1],
  },
  {
    title: `Officer Meeting 1`,
    description: `Introductions and information exchange`,
    start: dateA,
    tasks: taskLists[3],
  },
  {
    title: `Meeting 2`,
    description: `Friendly Tournament`,
    start: dateB,
    tasks: taskLists[0],
  },
  {
    title: `Meeting 3`,
    description: `Lesson 1: Strategic Game Play`,
    start: dateC,
    tasks: taskLists[2],
  },
];

/******************* */



EventList.sort((a, b) => a.start - b.start);

function scheduler() {
  /** This function utilizes eventMaker() to populate schedule side with OSO for
   * events sorted by their dates
   */
  const schedule = document.getElementById("schedule-zone");
  console.log(schedule);

  let currDate = 0;
  //  const firstDate = document.createElement("div");
  //  firstDate.className = "top-date";
  //  firstDate.textContent = currDate;

  let newDate = document.createElement("div");
  for (let i = 0; i < EventList.length; i++) {
    if (currDate === 0) {
      // first iteration
      //  TODO: USE NOW VARIABLE TO DETERMINE IF DAY SHOULD SAY TODAY

      newDate.className = `top-date`;
      newDate.textContent = EventList[i].start.toString().split(`00:00:00`)[0];
      newDate.style.fontWeight = 900;
      newDate.style.textAlign = `left`;
      console.log(newDate);
      schedule.appendChild(newDate);
      currDate = EventList[i].start;
      console.log(EventList[i]);
      let newEvent = eventMaker(EventList[i]);
      newDate.appendChild(newEvent);
      currDate = EventList[i].start;
    } else if (currDate === EventList[i].start) {
      //under same day
      console.log(newDate);
      let newEvent = eventMaker(EventList[i]);
      console.log(newEvent);
      newDate.appendChild(newEvent);
    } else {
      //under new day
      newDate = document.createElement("h3");
      newDate.className = "top-date";
      newDate.textContent = EventList[i].start.toString().split(`00:00:00`)[0];
      newDate.style.fontWeight = 900;
      newDate.style.textAlign = `left`;
      console.log(newDate);
      schedule.appendChild(newDate);
      currDate = EventList[i].start;
      console.log(EventList[i]);
      newEvent = eventMaker(EventList[i]);
      newDate.appendChild(newEvent);
      currDate = EventList[i].start;
    }
  }
}

scheduler();




function eventMaker(addMe) {
// creating OSO for event 'addMe'
// add me must contain fields:
    // title, descriptions & *tasks*
  console.log(addMe);
  console.log(addMe.title);

  // creating new event object
  const newEvent = document.createElement("div");
  newEvent.className = "event-obj";

  //creating Title
  const eventTitle = document.createElement("h4");
  eventTitle.className = `event-title`;
  eventTitle.innerHTML = addMe.title;
  eventTitle.style.textAlign = `left`;
  //adding Title to event object
  newEvent.appendChild(eventTitle);

  //creating Description
  const eventDesc = document.createElement("h5");
  eventDesc.className = `event-desc`;
  eventDesc.innerHTML = addMe.description;
  eventDesc.style.textAlign = `left`;
  //adding description
  newEvent.appendChild(eventDesc);

  console.log(newEvent);

  // color assignments
  if (addMe.tasks.length >2){
  newEvent.style.backgroundColor = ORANGE;}
  else if (addMe.tasks.length >1){
  newEvent.style.backgroundColor = BROWN;}
    else if (addMe.tasks.length ==0){
  newEvent.style.backgroundColor = WHITE;
    newEvent.style.color = BROWN;}
  return newEvent;
}




function taskManagerMain() {
    // populates Event manager OSO (On-Screen Object)
  const eventManager = document.getElementById(`event-manager-zone`);
  console.log(eventManager);
  EventList.sort((a, b) => b.tasks.length - a.tasks.length);
  for (let i = 0; i < EventList.length; i++) {
    let newEvent = eventMaker(EventList[i]);

    let taskArea = document.createElement("div");
    taskArea.className = "task-area";
    let taskCount = document.createElement("div");
    taskCount.id = `task-${i}`;
    taskCount.innerHTML = EventList[i].tasks;
    taskArea.appendChild(taskCount);
    newEvent.appendChild(taskArea);
    eventManager.appendChild(newEvent);
    let showButton = document.createElement("button");
    showButton.textContent = `SHOW`;
    showButton.id = `show-button`;
    taskArea.appendChild(showButton);
    showButton.onclick = taskFlip(i);
  }

  /** TODO: when adding tasks, make a visible and not visible style
   * class so we can show and not show the list of tasks
   */
}

taskManagerMain();

function taskFlip(i){
    let task = document.getElementById(`task-${i}`);
    task.id = ("show");

}