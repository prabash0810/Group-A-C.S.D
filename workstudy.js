// ==========================
// DayWise JavaScript
// ==========================


let university = JSON.parse(localStorage.getItem("university")) || [];
let work = JSON.parse(localStorage.getItem("work")) || [];


const uniForm = document.getElementById("uniForm");
const workForm = document.getElementById("workForm");

const uniTable = document.getElementById("uniTable");
const workTable = document.getElementById("workTable");

const uniCount = document.getElementById("uniCount");
const workCount = document.getElementById("workCount");
const hours = document.getElementById("hours");
const reminder = document.getElementById("reminder");



function saveData() {

    localStorage.setItem("university", JSON.stringify(university));
    localStorage.setItem("work", JSON.stringify(work));

}


function calculateHours(start,end){

    let s = start.split(":");
    let e = end.split(":");

    let startMinutes = Number(s[0])*60 + Number(s[1]);
    let endMinutes = Number(e[0])*60 + Number(e[1]);

    return (endMinutes-startMinutes)/60;

}



