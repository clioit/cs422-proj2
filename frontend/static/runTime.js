async function main(){
    await getOrgInfo();
    await getOrg();
    await getUser();
    await loadEvents();
    for (let i = 0; i<EventList.length;i++){
    await loadTasks(EventList[i].id);}
    EventList.sort((a, b) => new Date(a.start) - new Date(b.start));
    await loadPeople();
    await taskFill();

    // loadTaskSelect();
    loadOrg();
    setUser();
    taskManagerMain();
    scheduler();
    // eventMaker();
    
}
main();