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

    loadMoneySummary();

});


/*
   Dashboard Data
*/

function initQuickActions() {

    const navigableItems = document.querySelectorAll(".action-card[data-href], .dashboard-card[data-href], .finance-preview[data-href]");

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

    let dashboardData;

    try {
        dashboardData = JSON.parse(localStorage.getItem("dashboardData") || "null");
    } catch (error) {
        console.warn("Invalid dashboard data was reset.", error);
        localStorage.removeItem("dashboardData");
        loadDashboard();
        return;
    }

    if (!dashboardData) {
        loadDashboard();
        return;
    }

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

    let dashboardData;

    try {
        dashboardData = JSON.parse(localStorage.getItem("dashboardData") || "null");
    } catch (error) {
        console.warn("Weekly progress could not use stored dashboard data.", error);
        return;
    }

    if (!dashboardData || !dashboardData.previousWeek || !dashboardData.currentWeek) {
        return;
    }

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
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", function () {

    if (!confirm("Are you sure you want to logout?")) return;

    // Remove Daywise login session
    localStorage.removeItem("daywise.session.v1");
    sessionStorage.removeItem("daywise.session.v1");

    // Go back to login page
    window.location.replace("webpage/webpage.html");
  });
});

function loadMoneySummary() {
    const currency = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
    let transactions = [];

    try {
        const saved = JSON.parse(localStorage.getItem("daywise.money.transactions.v1") || "[]");
        transactions = Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.warn("Dashboard could not read Money Manager data.", error);
    }

    const totals = transactions.reduce(function (result, item) {
        const amount = Number(item.amount) || 0;
        if (item.type === "income") result.income += amount;
        if (item.type === "expense") result.expenses += amount;
        return result;
    }, { income: 0, expenses: 0 });

    const balance = totals.income - totals.expenses;
    const budget = Number(localStorage.getItem("daywise.money.budget.v1")) || 0;
    const set = function (id, value) {
        const node = document.getElementById(id);
        if (node) node.textContent = value;
    };

    set("moneyCardBalance", `${currency.format(balance)} Balance`);
    set("dashboardMoneyBalance", currency.format(balance));
    set("dashboardMoneyExpenses", currency.format(totals.expenses));
    set("dashboardMoneySavings", `${currency.format(Math.max(0, balance))} Saved`);
    set("dashboardMoneyBudget", budget > 0 ? `${currency.format(budget)} Budget` : "Not Started");
}
