/* ==================================
   DAYWISE - SCRIPT.JS
   Updated for dashboard UI
================================== */

/* ================================
   ELEMENTS
================================ */

const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const historyList = document.getElementById("historyList");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progressText");

/* ================================
   TASK DATA
================================ */

let tasks = [];
let completedTasks = [];

/* ================================
   LOAD DATA WHEN PAGE OPENS
================================ */

window.onload = function () {
    loadTasks();
    updateProgress();
};

/* ================================
   ADD TASK
================================ */

addTaskBtn.addEventListener("click", function () {
    let title = document.getElementById("taskTitle").value.trim();
    let subject = document.getElementById("subject").value;
    let priority = document.getElementById("priority").value;
    let start = document.getElementById("startTime").value;
    let end = document.getElementById("endTime").value;
    let deadline = document.getElementById("deadline").value;

    if (title === "" || subject === "" || priority === "") {
        alert("Please complete task details");
        return;
    }

    let task = {
        id: Date.now(),
        title: title,
        subject: subject,
        priority: priority,
        start: start,
        end: end,
        deadline: deadline,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    displayTasks();
    clearForm();
    updateProgress();
});

/* ================================
   DISPLAY ACTIVE TASKS
================================ */

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        let card = document.createElement("div");
        card.className = "task-card";

        let priorityClass =
            task.priority === "High"
                ? "high-priority"
                : task.priority === "Medium"
                ? "medium-priority"
                : "low-priority";

        let subjectClass =
            task.subject === "Computer Science"
                ? "cs"
                : task.subject === "Mathematics"
                ? "math"
                : task.subject === "English"
                ? "english"
                : "chemistry";

        card.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>
                    <span class="subject-tag ${subjectClass}">
                        ${task.subject}
                    </span>
                </p>
                <p>
                    <span class="priority ${priorityClass}">
                        ${task.priority}
                    </span>
                </p>
                <p>⏰ ${task.start || "--:--"} - ${task.end || "--:--"}</p>
                <p>📅 Due: ${task.deadline || "No deadline set"}</p>
            </div>

            <div class="task-right">
                <button class="complete-btn" onclick="completeTask(${task.id})">
                    ✔ Complete
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    🗑 Delete
                </button>
            </div>
        `;

        taskList.appendChild(card);
    });
}

/* ================================
   COMPLETE TASK
================================ */

function completeTask(id) {
    let task = tasks.find(function (item) {
        return item.id === id;
    });

    if (task) {
        task.completed = true;
        task.completedDate = new Date().toLocaleDateString();

        completedTasks.push(task);

        tasks = tasks.filter(function (item) {
            return item.id !== id;
        });

        saveTasks();
        displayTasks();
        displayHistory();
        updateProgress();
    }
}

/* ================================
   DELETE TASK
================================ */

function deleteTask(id) {
    tasks = tasks.filter(function (item) {
        return item.id !== id;
    });

    saveTasks();
    displayTasks();
    updateProgress();
}

/* ================================
   DISPLAY HISTORY
================================ */

function displayHistory() {
    if (!historyList) return;

    historyList.innerHTML = "";

    completedTasks.forEach(function (task) {
        let historyCard = document.createElement("div");
        historyCard.className = "history-card";

        historyCard.innerHTML = `
            <h3>✔ ${task.title}</h3>
            <p>${task.subject}</p>
            <span class="status">Completed: ${task.completedDate}</span>
        `;

        historyList.appendChild(historyCard);
    });
}

/* ================================
   CLEAR FORM
================================ */

function clearForm() {
    document.getElementById("taskTitle").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("deadline").value = "";
}

/* ================================
   LOCAL STORAGE
================================ */

function saveTasks() {
    localStorage.setItem("daywiseTasks", JSON.stringify(tasks));
    localStorage.setItem("daywiseHistory", JSON.stringify(completedTasks));
}

function loadTasks() {
    let savedTasks = localStorage.getItem("daywiseTasks");
    let savedHistory = localStorage.getItem("daywiseHistory");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    if (savedHistory) {
        completedTasks = JSON.parse(savedHistory);
    }

    displayTasks();
    displayHistory();
}

/* ================================
   PROGRESS UPDATE
================================ */

function updateProgress() {
    let total = tasks.length + completedTasks.length;

    let percent = 0;
    if (total > 0) {
        percent = Math.round((completedTasks.length / total) * 100);
    }

    if (progressBar) {
        progressBar.style.width = percent + "%";
    }

    if (progressText) {
        progressText.textContent = percent + "%";
    }
}
