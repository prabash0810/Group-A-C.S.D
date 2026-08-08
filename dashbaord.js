/*
   DayWise Dashboard
   File : dashboard.js
   Purpose :
   - Manage dashboard statistics
   - Save user preferences
   - Display greeting
   - Calculate weekly progress
   - Animate counters
   - Store theme in localStorage
   - Remember cookie consent
*/

"use strict";

/*
   Wait until the page is fully loaded
*/

document.addEventListener("DOMContentLoaded", function () {

    loadDashboard();

    showGreeting();

    animateNumbers();

    loadTheme();

    checkCookieStatus();

    initQuickActions();

    bindStorageSync();

    updateDashboard();

});


/*
   Dashboard Data
*/

function initQuickActions() {

    const navigableItems = document.querySelectorAll(".action-card[data-href], .dashboard-card[data-href]");

    navigableItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const target = item.getAttribute("data-href");

            if (target && target !== "#") {

                window.location.href = target;

            }

        });

        item.addEventListener("keydown", function (event) {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                const target = item.getAttribute("data-href");

                if (target && target !== "#") {

                    window.location.href = target;

                }

            }

        });

    });

}

function bindStorageSync() {

    window.addEventListener("storage", function (event) {

        if (!event.key || event.key === "events" || event.key === "achievements") {

            updateDashboard();

        }

    });

    window.addEventListener("daywise:data-changed", function () {

        updateDashboard();

    });

}

function getStoredItems(key) {

    try {

        const storedValue = localStorage.getItem(key);
        const parsedValue = storedValue ? JSON.parse(storedValue) : [];
        return Array.isArray(parsedValue) ? parsedValue : [];

    }

    catch (error) {

        console.warn("Unable to read storage for " + key, error);
        return [];

    }

}

function getWeekStart(date) {

    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;

}

function getWeekEnd(date) {

    const weekEnd = getWeekStart(date);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd;

}

function getWeekEvents() {

    const events = getStoredItems("events");
    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekEnd = getWeekEnd(now);

    return events.filter(function (item) {

        const eventDate = new Date(item.date);
        return !Number.isNaN(eventDate.getTime()) && eventDate >= weekStart && eventDate <= weekEnd;

    });

}

function calculateEventProgress(events) {

    const completed = events.filter(function (item) {
        return item.completed;
    }).length;

    return {
        total: events.length,
        completed: completed,
        pending: events.length - completed
    };

}

function calculateAchievementProgress(achievements) {

    const completed = achievements.filter(function (item) {
        return item.completed;
    }).length;

    const completionRate = achievements.length > 0
        ? Math.round((completed / achievements.length) * 100)
        : 0;

    return {
        total: achievements.length,
        completed: completed,
        completionRate: completionRate
    };

}

function calculateOverallProgress(eventStats, achievementStats) {

    const totalItems = eventStats.total + achievementStats.total;
    const completedItems = eventStats.completed + achievementStats.completed;

    if (totalItems === 0) {
        return 0;
    }

    return Math.round((completedItems / totalItems) * 100);

}

function calculateWeeklyProgress() {

    const weekEvents = getWeekEvents();
    const completedThisWeek = weekEvents.filter(function (item) {
        return item.completed;
    }).length;

    if (weekEvents.length === 0) {
        return 0;
    }

    return Math.round((completedThisWeek / weekEvents.length) * 100);

}

function loadDashboard() {

    // Default dashboard values
    const defaultData = {

        planner: 12,
        completedTasks: 8,
        achievements: 4,
        events: 6,
        savings: 450,

        previousWeek: {
            tasks: 6,
            savings: 250,
            events: 3
        },

        currentWeek: {
            tasks: 8,
            savings: 450,
            events: 6
        }

    };

    // Store default values only once
    if (!localStorage.getItem("dashboardData")) {

        localStorage.setItem(
            "dashboardData",
            JSON.stringify(defaultData)
        );

    }

    updateDashboard();

}


/* 
   Update Cards
 */

function updateDashboard() {

    const events = getStoredItems("events");
    const achievements = getStoredItems("achievements");
    const eventStats = calculateEventProgress(events);
    const achievementStats = calculateAchievementProgress(achievements);
    const weeklyProgress = calculateWeeklyProgress();
    const overallProgress = calculateOverallProgress(eventStats, achievementStats);

    const safeWeeklyProgress = Number.isFinite(weeklyProgress) ? Math.max(0, Math.min(100, weeklyProgress)) : 0;
    const safeOverallProgress = Number.isFinite(overallProgress) ? Math.max(0, Math.min(100, overallProgress)) : 0;

    setText("weeklyEventsScheduledText", getWeekEvents().length + " Scheduled");
    setText("weeklyEventsCompletedText", getWeekEvents().filter(function (item) {
        return item.completed;
    }).length + " Completed");
    setText("weeklyAchievementsCompletedText", achievementStats.completed + " Completed");

    setText("plannerCount", eventStats.total);
    setText("taskCount", eventStats.completed);
    setText("achievementCount", achievementStats.completed);
    setText("eventCount", eventStats.pending);

    updateEventsAchievementsCard();

}

function updateEventsAchievementsCard() {

    const events = getStoredItems("events");
    const achievements = getStoredItems("achievements");
    const eventStats = calculateEventProgress(events);
    const achievementStats = calculateAchievementProgress(achievements);
    const weeklyProgress = calculateWeeklyProgress();
    const overallProgress = calculateOverallProgress(eventStats, achievementStats);

    const achievementPercent = Number.isFinite(achievementStats.completionRate)
        ? Math.max(0, Math.min(100, achievementStats.completionRate))
        : 0;

    const weeklyPercent = Number.isFinite(weeklyProgress)
        ? Math.max(0, Math.min(100, weeklyProgress))
        : 0;

    const overallPercent = Number.isFinite(overallProgress)
        ? Math.max(0, Math.min(100, overallProgress))
        : 0;

    const ring = document.getElementById("eventCardProgressRing");
    const percentText = document.getElementById("eventCardPercent");
    const eventsCountText = document.getElementById("eventCardEventsCount");
    const achievementsCountText = document.getElementById("eventCardAchievementsCount");
    const completedCountText = document.getElementById("eventCardCompletedCount");
    const overallText = document.getElementById("eventCardOverallProgress");
    const weeklyText = document.getElementById("eventCardWeeklyProgress");
    const weeklyBar = document.getElementById("eventCardWeeklyBar");

    if (ring) {
        const circumference = 2 * Math.PI * 52;
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference * (1 - achievementPercent / 100);
    }

    if (percentText) {
        percentText.textContent = achievementPercent + "%";
    }

    if (eventsCountText) {
        eventsCountText.textContent = eventStats.total;
    }

    if (achievementsCountText) {
        achievementsCountText.textContent = achievementStats.total;
    }

    if (completedCountText) {
        completedCountText.textContent = eventStats.completed + achievementStats.completed;
    }

    if (overallText) {
        overallText.textContent = overallPercent + "%";
    }

    if (weeklyText) {
        weeklyText.textContent = weeklyPercent + "%";
    }

    if (weeklyBar) {
        weeklyBar.style.width = weeklyPercent + "%";
    }

}


/* 
   Helper Function
 */

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


/* 
   Greeting
*/

function showGreeting() {

    const greeting = document.getElementById("greeting");

    if (!greeting) return;

    const hour = new Date().getHours();

    let message = "";

    if (hour < 12) {

        message = "Good Morning";

    }

    else if (hour < 18) {

        message = "Good Afternoon";

    }

    else {

        message = "Good Evening";

    }

    greeting.textContent = message + ", Welcome to DayWise.";

}

/* 
   Counter Animation
*/

function animateNumbers() {

    const counters = document.querySelectorAll(".counter");

    counters.forEach(function (counter) {

        const target = Number(counter.innerText);

        let count = 0;

        const speed = Math.max(1, Math.floor(target / 40));

        counter.innerText = 0;

        const timer = setInterval(function () {

            count += speed;

            if (count >= target) {

                counter.innerText = target;

                clearInterval(timer);

            }

            else {

                counter.innerText = count;

            }

        }, 30);

    });

}


/*
   Weekly Progress
*/

function calculateWeeklyProgress() {

    const dashboardData =
        JSON.parse(localStorage.getItem("dashboardData"));

    const oldScore =
        dashboardData.previousWeek.tasks +
        dashboardData.previousWeek.events +
        dashboardData.previousWeek.savings;

    const newScore =
        dashboardData.currentWeek.tasks +
        dashboardData.currentWeek.events +
        dashboardData.currentWeek.savings;

    let percentage = Math.round((newScore / oldScore) * 100);

    if (percentage > 100) {

        percentage = 100;

    }

    const progressText =
        document.getElementById("progressValue");

    if (progressText) {

        progressText.innerText = percentage + "%";

    }

}


/*
   Theme Switch
*/

function changeTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

    }

    else {

        localStorage.setItem("theme", "light");

    }

}


function loadTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

    }

}


/*
   Cookie Consent
*/

function acceptCookies() {

    const expireDate = new Date();

    expireDate.setDate(expireDate.getDate() + 30);

    document.cookie =
        "daywiseCookies=accepted; expires=" +
        expireDate.toUTCString() +
        "; path=/";

    const popup = document.getElementById("cookieBox");

    if (popup) {

        popup.style.display = "none";

    }

}


function checkCookieStatus() {

    if (document.cookie.includes("daywiseCookies=accepted")) {

        const popup = document.getElementById("cookieBox");

        if (popup) {

            popup.style.display = "none";

        }

    }

}


/*
   Daily Notification
*/

function showNotification(message) {

    const notification =
        document.getElementById("notification");

    if (!notification) return;

    notification.innerText = message;

    notification.classList.add("show");

    setTimeout(function () {

        notification.classList.remove("show");

    }, 3000);

}


/*
   Save Dashboard
*/

function saveDashboard(data) {

    localStorage.setItem(
        "dashboardData",
        JSON.stringify(data)
    );

}


/*
   Reset Dashboard
*/

function resetDashboard() {

    localStorage.removeItem("dashboardData");

    location.reload();

}


/*
   Random Motivation Message
*/

function motivationalMessage() {

    const messages = [

        "Keep working towards your goals!",
        "One task at a time.",
        "Every achievement counts.",
        "Stay productive today.",
        "Small progress is still progress."

    ];

    const random =
        Math.floor(Math.random() * messages.length);

    showNotification(messages[random]);

}


/*
   Automatically show motivation
*/

setTimeout(function () {

    motivationalMessage();

}, 2000);