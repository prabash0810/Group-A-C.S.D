document.addEventListener("DOMContentLoaded", function () {

    const themeSelector = document.getElementById("themeSelector");
    const animationToggle = document.getElementById("animationToggle");

    /* Load saved theme */
    const savedTheme =
        localStorage.getItem("daywiseTheme") || "default";

    applyTheme(savedTheme);

    if (themeSelector) {
        themeSelector.value = savedTheme;

        themeSelector.addEventListener("change", function () {

            const selectedTheme = this.value;

            applyTheme(selectedTheme);

            localStorage.setItem(
                "daywiseTheme",
                selectedTheme
            );
        });
    }


    /* Load saved animation preference */
    const savedAnimations =
        localStorage.getItem("daywiseAnimations");

    if (animationToggle) {

        if (savedAnimations !== null) {
            animationToggle.checked =
                savedAnimations === "true";
        }

        animationToggle.addEventListener("change", function () {

            localStorage.setItem(
                "daywiseAnimations",
                this.checked
            );

            document.body.classList.toggle(
                "animations-disabled",
                !this.checked
            );
        });

        document.body.classList.toggle(
            "animations-disabled",
            !animationToggle.checked
        );
    }

});


/* Apply selected theme */
function applyTheme(theme) {

    document.body.classList.remove(
        "theme-default",
        "theme-dark",
        "theme-light"
    );

    document.body.classList.add(
        `theme-${theme}`
    );
}