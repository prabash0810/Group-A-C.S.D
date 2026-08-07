// LifeSync Events & Achievements Overview

document.addEventListener("DOMContentLoaded", initPage);

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

function initPage() {
    displayEvents();
    displayAchievements();
    updateDashboard();
}

function addEvent() {
    const name = document.getElementById("eventName").value.trim();
    const date = document.getElementById("eventDate").value.trim();

    if (!name || !date) {
        alert("Please enter both an event name and a date.");
        return;
    }

    const events = getStoredItems("events");
    events.push({
        id: Date.now(),
        name,
        date,
        completed: false
    });

    saveStoredItems("events", events);
    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    displayEvents();
    updateDashboard();
}

function addAchievement() {
    const title = document.getElementById("achievementTitle").value.trim();
    const description = document.getElementById("achievementDescription").value.trim();

    if (!title || !description) {
        alert("Please enter both an achievement title and description.");
        return;
    }

    const achievements = getStoredItems("achievements");
    achievements.push({
        id: Date.now(),
        title,
        description,
        completed: false
    });

    saveStoredItems("achievements", achievements);
    document.getElementById("achievementTitle").value = "";
    document.getElementById("achievementDescription").value = "";
    displayAchievements();
    updateDashboard();
}

function displayEvents() {
    const events = getStoredItems("events");
    const list = document.getElementById("eventList");

    if (!list) {
        return;
    }

    if (events.length === 0) {
        list.innerHTML = '<div class="empty-state">No events added yet.</div>';
        return;
    }

    list.innerHTML = events.map(event => `
        <div class="item-card">
            <h4>${event.name}</h4>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Status:</strong> ${event.completed ? "Completed ✅" : "Pending ⏳"}</p>
            <div class="item-actions">
                <button class="complete-btn" onclick="toggleEventComplete(${event.id})">${event.completed ? "Undo" : "Complete"}</button>
                <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

function displayAchievements() {
    const achievements = getStoredItems("achievements");
    const list = document.getElementById("achievementList");

    if (!list) {
        return;
    }

    if (achievements.length === 0) {
        list.innerHTML = '<div class="empty-state">No achievements added yet.</div>';
        return;
    }

    list.innerHTML = achievements.map(item => `
        <div class="item-card">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <p><strong>Status:</strong> ${item.completed ? "Completed ✅" : "Pending ⏳"}</p>
            <div class="item-actions">
                <button class="complete-btn" onclick="toggleAchievementComplete(${item.id})">${item.completed ? "Undo" : "Complete"}</button>
                <button class="delete-btn" onclick="deleteAchievement(${item.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

function toggleEventComplete(id) {
    const events = getStoredItems("events").map(event => event.id === id ? { ...event, completed: !event.completed } : event);
    saveStoredItems("events", events);
    displayEvents();
    updateDashboard();
}

function toggleAchievementComplete(id) {
    const achievements = getStoredItems("achievements").map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    saveStoredItems("achievements", achievements);
    displayAchievements();
    updateDashboard();
}

function deleteEvent(id) {
    const events = getStoredItems("events").filter(event => event.id !== id);
    saveStoredItems("events", events);
    displayEvents();
    updateDashboard();
}

function deleteAchievement(id) {
    const achievements = getStoredItems("achievements").filter(item => item.id !== id);
    saveStoredItems("achievements", achievements);
    displayAchievements();
    updateDashboard();
}

function updateDashboard() {
    const events = getStoredItems("events");
    const achievements = getStoredItems("achievements");

    const totalEvents = document.getElementById("totalEvents");
    if (totalEvents) {
        totalEvents.innerHTML = events.length;
    }

    const completedEvents = events.filter(event => event.completed === true).length;
    const completed = document.getElementById("completedEvents");
    if (completed) {
        completed.innerHTML = completedEvents;
    }

    const totalAchievements = document.getElementById("totalAchievements");
    if (totalAchievements) {
        totalAchievements.innerHTML = achievements.length;
    }

    const completionRate = document.getElementById("completionRate");
    if (completionRate) {
        const rate = events.length > 0 ? Math.round((completedEvents / events.length) * 100) : 0;
        completionRate.innerHTML = rate + "%";
    }
}
