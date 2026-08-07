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

    calculateWeeklyProgress();

    loadTheme();

    checkCookieStatus();

    initQuickActions();

});


/*
   Dashboard Data
*/

function initQuickActions() {

    const actionButtons = document.querySelectorAll(".action-card[data-href]");

    actionButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const target = button.getAttribute("data-href");

            if (target && target !== "#") {

                window.location.href = target;

            }

        });

    });

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

    updateDashboardCards();

}


/* 
   Update Cards
 */

function updateDashboardCards() {

    const dashboardData =
        JSON.parse(localStorage.getItem("dashboardData"));

    setText("plannerCount", dashboardData.planner);
    setText("taskCount", dashboardData.completedTasks);
    setText("achievementCount", dashboardData.achievements);
    setText("eventCount", dashboardData.events);

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