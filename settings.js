document.addEventListener("DOMContentLoaded", function () {
    const themeSelector = document.getElementById("themeSelector");

    loadSavedTheme();

    if (themeSelector) {
        themeSelector.addEventListener("change", function () {
            const selectedTheme = this.value;

            applyTheme(selectedTheme);

            localStorage.setItem("daywiseTheme", selectedTheme);
        });
    }
});

/* Apply the selected theme to the page */
function applyTheme(theme) {
    document.body.classList.remove(
        "theme-default",
        "theme-dark",
        "theme-light"
    );

    document.body.classList.add(`theme-${theme}`);
}

/* Load the user's saved theme */
function loadSavedTheme() {
    const savedTheme =
        localStorage.getItem("daywiseTheme") || "default";

    applyTheme(savedTheme);

    const themeSelector = document.getElementById("themeSelector");

    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
}
/* Load the DayWise theme saved in Settings */
document.addEventListener("DOMContentLoaded", function () {
    const savedTheme = localStorage.getItem("daywiseTheme") || "default";

    document.body.classList.add(`theme-${savedTheme}`);
});