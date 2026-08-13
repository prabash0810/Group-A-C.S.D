// Select the main container and the links
const container = document.querySelector(".container");
const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".login-link");

// Show the registration form
registerLink.addEventListener("click", function (event) {
    event.preventDefault();
    container.classList.add("active");
});

// Show the login form
loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    container.classList.remove("active");
});