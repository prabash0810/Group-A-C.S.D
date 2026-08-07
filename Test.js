// ==========================
// DayWise JavaScript
// ==========================

// Arrays
let university = JSON.parse(localStorage.getItem("university")) || [];
let work = JSON.parse(localStorage.getItem("work")) || [];

// HTML Elements
const uniForm = document.getElementById("uniForm");
const workForm = document.getElementById("workForm");

const uniTable = document.getElementById("uniTable");
const workTable = document.getElementById("workTable");

const uniCount = document.getElementById("uniCount");
const workCount = document.getElementById("workCount");
const hours = document.getElementById("hours");
const reminder = document.getElementById("reminder");

// ==========================
// Save Data
// ==========================

function saveData() {

    localStorage.setItem("university", JSON.stringify(university));
    localStorage.setItem("work", JSON.stringify(work));

}

// ==========================
// Calculate Hours
// ==========================

function calculateHours(start,end){

    let s = start.split(":");
    let e = end.split(":");

    let startMinutes = Number(s[0])*60 + Number(s[1]);
    let endMinutes = Number(e[0])*60 + Number(e[1]);

    return (endMinutes-startMinutes)/60;

}

// ==========================
// Dashboard
// ==========================

function updateDashboard(){

    uniCount.textContent = university.length + " Classes";

    workCount.textContent = work.length + " Shifts";

    let totalHours = 0;

    work.forEach(item=>{

        totalHours += item.hours;

    });

    hours.textContent = totalHours + " hrs";

    if(university.length>0){

        reminder.textContent = university[0].day;

    }
    else{

        reminder.textContent="None";

    }

}

// ==========================
// University Form
// ==========================

uniForm.addEventListener("submit",function(e){

    e.preventDefault();

    let item={

        module:document.getElementById("moduleName").value,

        lecturer:document.getElementById("lecturer").value,

        day:document.getElementById("uniDay").value,

        start:document.getElementById("uniStart").value,

        end:document.getElementById("uniEnd").value,

        room:document.getElementById("room").value

    };

    university.push(item);

    saveData();

    displayUniversity();

    updateDashboard();

    uniForm.reset();

});

// ==========================
// Work Form
// ==========================

workForm.addEventListener("submit",function(e){

    e.preventDefault();

    let h = calculateHours(

        document.getElementById("workStart").value,

        document.getElementById("workEnd").value

    );

    let item={

        company:document.getElementById("company").value,

        role:document.getElementById("jobRole").value,

        day:document.getElementById("workDay").value,

        start:document.getElementById("workStart").value,

        end:document.getElementById("workEnd").value,

        location:document.getElementById("location").value,

        hours:h

    };

    work.push(item);

    saveData();

    displayWork();

    updateDashboard();

    workForm.reset();

});
// ==========================
// University Table
// ==========================

function displayUniversity() {

    uniTable.innerHTML = "";

    university.forEach((item, index) => {

        uniTable.innerHTML += `

        <tr>

            <td>${item.module}</td>

            <td>${item.day}</td>

            <td>${item.start} - ${item.end}</td>

            <td>

                <button class="delete-btn" onclick="deleteUniversity(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ==========================
// Work Table
// ==========================

function displayWork() {

    workTable.innerHTML = "";

    work.forEach((item, index) => {

        workTable.innerHTML += `

        <tr>

            <td>${item.company}</td>

            <td>${item.day}</td>

            <td>${item.hours} hrs</td>

            <td>

                <button class="delete-btn" onclick="deleteWork(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}


displayUniversity();

displayWork();

updateDashboard();

function deleteUniversity(index){

    university.splice(index,1);

    saveData();

    displayUniversity();

    updateDashboard();

    showMessage("University class deleted.");

}

function deleteWork(index){

    work.splice(index,1);

    saveData();

    displayWork();

    updateDashboard();

    showMessage("Work shift deleted.");

}

function showMessage(message){

    const box = document.getElementById("messageBox");

    box.innerText = message;

    box.classList.add("show");

    setTimeout(function(){

        box.classList.remove("show");

    },3000);

}