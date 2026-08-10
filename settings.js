```javascript
document.addEventListener("DOMContentLoaded", function () {

    const animationToggle =
        document.getElementById("animationToggle");

    const aboutUsBtn =
        document.getElementById("aboutUsBtn");

    const aboutUsContent =
        document.getElementById("aboutUsContent");


    /* =========================
       ANIMATIONS
       ========================= */

    const savedAnimations =
        localStorage.getItem("daywiseAnimations");

    if (animationToggle) {

        if (savedAnimations !== null) {

            animationToggle.checked =
                savedAnimations === "true";

        }

        document.body.classList.toggle(
            "animations-disabled",
            !animationToggle.checked
        );


        animationToggle.addEventListener(
            "change",
            function () {

                localStorage.setItem(
                    "daywiseAnimations",
                    this.checked
                );

                document.body.classList.toggle(
                    "animations-disabled",
                    !this.checked
                );

            }
        );

    }


    /* =========================
       ABOUT US
       ========================= */

    if (aboutUsBtn && aboutUsContent) {

        aboutUsBtn.addEventListener(
            "click",
            function () {

                aboutUsContent.classList.toggle("active");


                if (
                    aboutUsContent.classList.contains("active")
                ) {

                    aboutUsBtn.textContent =
                        "Hide About Us";

                } else {

                    aboutUsBtn.textContent =
                        "About Us";

                }

            }
        );

    }

});
```
