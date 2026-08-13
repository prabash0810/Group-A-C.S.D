document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

function updateDateTime() {
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const dayElement = document.getElementById("current-day");
    const dateElement = document.getElementById("current-date");
    const timeElement = document.getElementById("current-time");

    if (dayElement) {
        dayElement.textContent = dayNames[now.getDay()];
    }

    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
    }
}
