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


