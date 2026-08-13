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
const calendarGrid = document.getElementById("calendarGrid");
const calendarMonth = document.getElementById("calendarMonth");
const calendarSelection = document.getElementById("calendarSelection");
let visibleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedDate = "";

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
    updateDateAndClock();
    setInterval(updateDateAndClock, 1000);
};

document.getElementById("previousMonth").addEventListener("click", function () {
    visibleMonth.setMonth(visibleMonth.getMonth() - 1);
    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", function () {
    visibleMonth.setMonth(visibleMonth.getMonth() + 1);
    renderCalendar();
});

document.getElementById("todayButton").addEventListener("click", function () {
    const today = new Date();
    visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    selectCalendarDate(toDateKey(today));
});

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
    renderCalendar();
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
        renderCalendar();
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
    renderCalendar();
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
    renderCalendar();
}

/* ================================
   INTERACTIVE MONTHLY CALENDAR
================================ */

function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function selectCalendarDate(dateKey) {
    selectedDate = dateKey;
    document.getElementById("deadline").value = dateKey;
    const date = new Date(`${dateKey}T00:00:00`);
    calendarSelection.textContent = `Selected: ${date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`;
    renderCalendar();
}

function renderCalendar() {
    if (!calendarGrid) return;
    calendarMonth.textContent = visibleMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    calendarGrid.innerHTML = "";

    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - mondayOffset);
    const todayKey = toDateKey(new Date());

    for (let index = 0; index < 42; index += 1) {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + index);
        const dateKey = toDateKey(date);
        const dayTasks = tasks.filter(function (task) { return task.deadline === dateKey; });
        const button = document.createElement("button");
        button.type = "button";
        button.className = "calendar-day";
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-label", `${date.toDateString()}, ${dayTasks.length} tasks`);
        if (date.getMonth() !== visibleMonth.getMonth()) button.classList.add("outside-month");
        if (dateKey === todayKey) button.classList.add("today");
        if (dateKey === selectedDate) button.classList.add("selected");

        const number = document.createElement("span");
        number.className = "calendar-day-number";
        number.textContent = date.getDate();
        button.appendChild(number);

        dayTasks.slice(0, 2).forEach(function (task) {
            const item = document.createElement("span");
            item.className = "calendar-task";
            item.textContent = task.title;
            button.appendChild(item);
        });

        if (dayTasks.length > 2) {
            const more = document.createElement("span");
            more.className = "calendar-more";
            more.textContent = `+${dayTasks.length - 2} more`;
            button.appendChild(more);
        }

        button.addEventListener("click", function () {
            if (date.getMonth() !== visibleMonth.getMonth()) visibleMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            selectCalendarDate(dateKey);
        });
        calendarGrid.appendChild(button);
    }
}

function updateDateAndClock() {
    const now = new Date();
    document.getElementById("date").textContent = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    document.getElementById("clock").textContent = now.toLocaleTimeString();
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

/* ================================
   JQUERY PROGRESSIVE ENHANCEMENTS
   Existing planner behavior remains unchanged.
================================ */

(function initialisePlannerJQuery($) {
    if (!$) return;

    $(function () {
        // Give keyboard and mouse users subtle button feedback.
        $(document).on("mousedown", "button, .dashboard-back-btn", function () {
            $(this).css("transform", "scale(0.98)");
        });

        $(document).on("mouseup mouseleave", "button, .dashboard-back-btn", function () {
            $(this).css("transform", "");
        });

        // Smoothly reveal newly rendered tasks without changing task logic.
        $("#addTask").on("click.daywiseJquery", function () {
            window.setTimeout(function () {
                $("#taskList .task-card").last().hide().fadeIn(280);
            }, 0);
        });

        // Keep the selected calendar date visible on smaller screens.
        $(document).on("click.daywiseJquery", ".calendar-day", function () {
            $(".calendar-day").attr("aria-selected", "false");
            $(this).attr("aria-selected", "true");
        });
    });
})(window.jQuery);
