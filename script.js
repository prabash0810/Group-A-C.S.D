// LifeSync Dashboard JavaScript


document.addEventListener(
    "DOMContentLoaded",
    updateDashboard
);



function updateDashboard(){


    // Get Events from Local Storage

    let events = JSON.parse(
        localStorage.getItem("events")
    ) || [];



    // Get Achievements from Local Storage

    let achievements = JSON.parse(
        localStorage.getItem("achievements")
    ) || [];




    // Total Events

    let totalEvents =
    document.getElementById("totalEvents");


    if(totalEvents){

        totalEvents.innerHTML =
        events.length;

    }




    // Completed Events

    let completedEvents =
    events.filter(
        event => event.completed === true
    ).length;



    let completed =
    document.getElementById("completedEvents");


    if(completed){

        completed.innerHTML =
        completedEvents;

    }




    // Total Achievements

    let totalAchievements =
    document.getElementById("totalAchievements");



    if(totalAchievements){

        totalAchievements.innerHTML =
        achievements.length;

    }



}