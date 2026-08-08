document.addEventListener("DOMContentLoaded", function () {
    loadSavedTheme();

    const themeOptions = document.querySelectorAll(".theme-option");

    themeOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            const selectedTheme = this.dataset.theme;

            applyTheme(selectedTheme);
            localStorage.setItem("daywiseTheme", selectedTheme);

            updateSelectedTheme(selectedTheme);
        });
    });
});

function applyTheme(theme) {
    document.body.classList.remove(
        "theme-default",
        "theme-dark",
        "theme-light"
    );

    document.body.classList.add(`theme-${theme}`);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem("daywiseTheme") || "default";

    applyTheme(savedTheme);
    updateSelectedTheme(savedTheme);
}

function updateSelectedTheme(theme) {
    const themeOptions = document.querySelectorAll(".theme-option");

    themeOptions.forEach(function (option) {
        option.classList.remove("active");

        if (option.dataset.theme === theme) {
            option.classList.add("active");
        }
    });
}