document.addEventListener("DOMContentLoaded", function () {
    displayEvents();
    displayAchievements();
    updateOverview();

    const eventForm = document.getElementById("eventForm");
    if (eventForm) {
        eventForm.addEventListener("submit", function (event) {
            event.preventDefault();
            addEvent();
        });
    }

    const achievementForm = document.getElementById("achievementForm");
    if (achievementForm) {
        achievementForm.addEventListener("submit", function (event) {
            event.preventDefault();
            addAchievement();
        });
    }
});

function getStoredItems(key) {
    try {
        const storedValue = localStorage.getItem(key);
        const parsedValue = storedValue ? JSON.parse(storedValue) : [];
        return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (error) {
        console.warn("Unable to read storage for " + key, error);
        return [];
    }
}

function saveStoredItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
}

function addEvent() {
    const eventNameInput = document.getElementById("eventName");
    const eventDateInput = document.getElementById("eventDate");

    if (!eventNameInput || !eventDateInput) {
        return;
    }

    const name = eventNameInput.value.trim();
    const date = eventDateInput.value.trim();

    if (name === "" || date === "") {
        alert("Please enter an event name and date");
        return;
    }

    const events = getStoredItems("events");
    const newEvent = {
        id: Date.now(),
        title: name,
        date: date,
        completed: false
    };

    events.push(newEvent);
    saveStoredItems("events", events);
    alert("Event Added Successfully!");

    eventNameInput.value = "";
    eventDateInput.value = "";

    displayEvents();
    updateOverview();
}

function displayEvents() {
    const events = getStoredItems("events");
    const list = document.getElementById("eventList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (events.length === 0) {
        list.innerHTML = "<p>No events added yet.</p>";
        return;
    }

    events.forEach((item) => {
        const card = document.createElement("div");
        card.className = "achievement-card";

        const title = document.createElement("h4");
        title.textContent = item.title;

        const date = document.createElement("p");
        date.textContent = `Date: ${item.date}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${item.completed ? "Completed ✅" : "Pending ⏳"}`;

        const actions = document.createElement("div");

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.textContent = "Complete";
        completeButton.addEventListener("click", () => completeEvent(item.id));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteEvent(item.id));

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(status);
        card.appendChild(actions);

        list.appendChild(card);
    });
}

function completeEvent(id) {
    const events = getStoredItems("events").map((item) => {
        if (item.id === id) {
            item.completed = true;
        }
        return item;
    });

    saveStoredItems("events", events);
    displayEvents();
    updateOverview();
}

function deleteEvent(id) {
    const events = getStoredItems("events").filter((item) => item.id !== id);
    saveStoredItems("events", events);
    displayEvents();
    updateOverview();
}

function addAchievement() {
    const titleInput = document.getElementById("achievementTitle");
    const descriptionInput = document.getElementById("achievementDescription");

    if (!titleInput || !descriptionInput) {
        return;
    }

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title === "" || description === "") {
        alert("Please enter achievement details");
        return;
    }

    const achievements = getStoredItems("achievements");
    const newAchievement = {
        id: Date.now(),
        title: title,
        description: description,
        completed: false
    };

    achievements.push(newAchievement);
    saveStoredItems("achievements", achievements);
    alert("Achievement Added Successfully!");

    titleInput.value = "";
    descriptionInput.value = "";

    displayAchievements();
    updateOverview();
}

function displayAchievements() {
    const achievements = getStoredItems("achievements");
    const list = document.getElementById("achievementList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (achievements.length === 0) {
        list.innerHTML = "<p>No achievements added yet.</p>";
        return;
    }

    achievements.forEach((item) => {
        const card = document.createElement("div");
        card.className = "achievement-card";

        const title = document.createElement("h4");
        title.textContent = item.title;

        const description = document.createElement("p");
        description.textContent = item.description;

        const status = document.createElement("p");
        status.textContent = `Status: ${item.completed ? "Completed ✅" : "Pending ⏳"}`;

        const actions = document.createElement("div");

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.textContent = "Complete";
        completeButton.addEventListener("click", () => completeAchievement(item.id));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteAchievement(item.id));

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(status);
        card.appendChild(actions);

        list.appendChild(card);
    });
}

function completeAchievement(id) {
    const achievements = getStoredItems("achievements").map((item) => {
        if (item.id === id) {
            item.completed = true;
        }
        return item;
    });

    saveStoredItems("achievements", achievements);
    displayAchievements();
    updateOverview();
}

function deleteAchievement(id) {
    const achievements = getStoredItems("achievements").filter((item) => item.id !== id);
    saveStoredItems("achievements", achievements);
    displayAchievements();
    updateOverview();
}

function updateOverview() {
    const events = getStoredItems("events");
    const achievements = getStoredItems("achievements");

    const totalEventsEl = document.getElementById("totalEvents");
    const completedEventsEl = document.getElementById("completedEvents");
    const totalAchievementsEl = document.getElementById("totalAchievements");
    const completionRateEl = document.getElementById("completionRate");

    if (totalEventsEl) {
        totalEventsEl.textContent = events.length;
    }

    if (completedEventsEl) {
        completedEventsEl.textContent = events.filter((item) => item.completed).length;
    }

    if (totalAchievementsEl) {
        totalAchievementsEl.textContent = achievements.length;
    }

    if (completionRateEl) {
        const completedAchievements = achievements.filter((item) => item.completed).length;
        const rate = achievements.length > 0
            ? Math.round((completedAchievements / achievements.length) * 100)
            : 0;
        completionRateEl.textContent = rate + "%";
    }
}
