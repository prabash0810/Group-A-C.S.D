// LifeSync Events & Achievements Overview

document.addEventListener("DOMContentLoaded", updateDashboard);

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
