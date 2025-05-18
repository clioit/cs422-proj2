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

const now = new Date();
const dateA = new Date(2025, 0, 25);
const dateB = new Date(2025, 1, 25);
const dateC = new Date(2025, 2, 25);

const EventList = [
    {title: `Meeting 1`, description: `Introductions and information exchange`, start: dateA, tasks: 1 },
    {title: `Meeting 2`, description: `Friendly Tournament`, start: dateB, tasks: 0 },
    {title: `Meeting 3`, description: `Lesson 1: Strategic Game Play`, start: dateC, tasks: 2 }
];

const taskLists = [
[`print surveys`, `make name tents`],
[`task a`, `task b`, `task c`],
[`random this`, `random that`, `lol`]
];


EventList.sort((a,b) => a.start - b.start);

function scheduler(){

    const schedule = document.getElementById("schedule");
    console.log(schedule);

    let currDate  = 0;
    //  const firstDate = document.createElement("div");
    //  firstDate.className = "top-date";
    //  firstDate.textContent = currDate;


    //  TODO: USE NOW VARIABLE TO DETERMINE IF DAY SHOULD SAY TODAY

    for (let i = 0; i < EventList.length; i++){

        if (currDate === 0){
            let newDate = document.createElement("div");
            newDate.className = "top-date";
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
        }

        else if (currDate === EventList[i].start){
            newEvent = eventMaker(EventList[i]);
            newDate.appendChild(newEvent);
        }
        else {
            newDate = document.createElement("div");
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

function eventMaker(addMe){

    console.log(addMe);
    console.log(addMe.title);
    const newEvent = document.createElement("div");
    const eventTitle = document.createElement("div");
    eventTitle.className = `event-title`;
    eventTitle.innerHTML = addMe.title;
    eventTitle.style.textAlign = `left`;
    newEvent.appendChild(eventTitle);
    const eventDesc = document.createElement("div");
    eventDesc.className = `event-desc`;
    eventDesc.innerHTML = addMe.description;
    eventDesc.style.textAlign = `left`;
    newEvent.appendChild(eventDesc);
    console.log(newEvent);
    newEvent.style.backgroundColor = `white`;
    return newEvent;


}

function taskManagerMain(){

    const eventManager = document.getElementById(`event-manager`);
    console.log(eventManager);
    EventList.sort((a,b) => b.tasks - a.tasks);
    for(let i=0; i<EventList.length; i++){
        let newEvent = eventMaker(EventList[i]);
        let taskCount = document.createElement("div");
        taskCount.className = `task-count`;
        taskCount.innerHTML = EventList[i].tasks;
        newEvent.appendChild(taskCount);
        eventManager.appendChild(newEvent);
    }
}

taskManagerMain();