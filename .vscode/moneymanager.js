"use strict";

/*
    DayWise Login and Registration
    Complete form.js

    Note:
    localStorage authentication is suitable for a school/demo project only.
    Production websites require secure server-side authentication.
*/

document.addEventListener("DOMContentLoaded", () => {
    /* Page names - change these when your filenames are different. */
    const DASHBOARD_PAGE = "dashboard.html";

    /* Local storage keys */
    const USERS_KEY = "daywise_users";
    const SESSION_KEY = "daywise_session";

    /* Main elements */
    const container = document.querySelector(".container");
    const loginForm = document.querySelector(".form-box.login form");
    const registerForm = document.querySelector(".form-box.register form");
    const registerLink = document.querySelector(".register-link");
    const loginLink = document.querySelector(".login-link");

    if (!container || !loginForm || !registerForm) {
        console.error("The login or registration form could not be found.");
        return;
    }

    /*
        Your original HTML does not contain input IDs,
        so the fields are selected from their form and input type.
    */
    const loginUsername = loginForm.querySelector('input[type="text"]');
    const loginPassword = loginForm.querySelector('input[type="password"]');

    const registerUsername =
        registerForm.querySelector('input[type="text"]');

    const registerEmail =
        registerForm.querySelector('input[type="email"]');

    const registerPassword =
        registerForm.querySelector('input[type="password"]');

    /* Assign useful attributes without requiring HTML changes. */
    loginUsername.name = "username";
    loginUsername.autocomplete = "username";

    loginPassword.name = "password";
    loginPassword.autocomplete = "current-password";

    registerUsername.name = "username";
    registerUsername.autocomplete = "username";

    registerEmail.name = "email";
    registerEmail.autocomplete = "email";

    registerPassword.name = "password";
    registerPassword.autocomplete = "new-password";

    /* ---------------------------------
       Local storage
       --------------------------------- */

    function getUsers() {
        try {
            const storedUsers = localStorage.getItem(USERS_KEY);

            if (!storedUsers) {
                return [];
            }

            const users = JSON.parse(storedUsers);
            return Array.isArray(users) ? users : [];
        } catch (error) {
            console.error("Unable to read users:", error);
            return [];
        }
    }

    function saveUsers(users) {
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error("Unable to save users:", error);
            return false;
        }
    }

    function getSession() {
        try {
            const storedSession = localStorage.getItem(SESSION_KEY);

            if (!storedSession) {
                return null;
            }

            return JSON.parse(storedSession);
        } catch (error) {
            console.error("Unable to read session:", error);
            return null;
        }
    }

    function saveSession(user) {
        const session = {
            userId: user.id,
            username: user.username,
            email: user.email,
            loggedIn: true,
            loginTime: new Date().toISOString()
        };

        try {
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(session)
            );

            return true;
        } catch (error) {
            console.error("Unable to save session:", error);
            return false;
        }
    }

    function removeSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    /* ---------------------------------
       General helpers
       --------------------------------- */

    function normalize(value) {
        return String(value).trim().toLowerCase();
    }

    function createUserId() {
        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {
            return window.crypto.randomUUID();
        }

        return `user-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;
    }

    function getCurrentUser() {
        const session = getSession();

        if (!session || !session.loggedIn) {
            return null;
        }

        const user = getUsers().find(
            (savedUser) => savedUser.id === session.userId
        );

        if (!user) {
            removeSession();
            return null;
        }

        return user;
    }

    /* ---------------------------------
       Messages
       --------------------------------- */

    function getMessageBox(form) {
        let messageBox = form.querySelector(".form-message");

        if (!messageBox) {
            messageBox = document.createElement("div");
            messageBox.className = "form-message";
            messageBox.setAttribute("role", "status");
            messageBox.setAttribute("aria-live", "polite");

            /*
                Inline styling means messages work even if the
                extra message CSS has not been added.
            */
            messageBox.style.display = "none";
            messageBox.style.margin = "0 0 16px";
            messageBox.style.padding = "11px 14px";
            messageBox.style.border = "1px solid transparent";
            messageBox.style.borderRadius = "10px";
            messageBox.style.fontSize = "14px";
            messageBox.style.lineHeight = "1.4";

            const submitButton = form.querySelector(".btn");
            form.insertBefore(messageBox, submitButton);
        }

        return messageBox;
    }

    function showMessage(form, text, type = "error") {
        const messageBox = getMessageBox(form);

        messageBox.textContent = text;
        messageBox.style.display = "block";

        if (type === "success") {
            messageBox.style.color = "#166534";
            messageBox.style.background = "#f0fdf4";
            messageBox.style.borderColor = "#bbf7d0";
        } else if (type === "info") {
            messageBox.style.color = "#1e40af";
            messageBox.style.background = "#eff6ff";
            messageBox.style.borderColor = "#bfdbfe";
        } else {
            messageBox.style.color = "#991b1b";
            messageBox.style.background = "#fef2f2";
            messageBox.style.borderColor = "#fecaca";
        }
    }

    function clearMessage(form) {
        const messageBox = form.querySelector(".form-message");

        if (messageBox) {
            messageBox.textContent = "";
            messageBox.style.display = "none";
        }
    }

    /* ---------------------------------
       Button loading state
       --------------------------------- */

    function setButtonLoading(button, loading, loadingText) {
        if (!button) {
            return;
        }

        if (loading) {
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.disabled = true;
        } else {
            button.textContent =
                button.dataset.originalText || button.textContent;

            button.disabled = false;
        }
    }

    /* ---------------------------------
       Validation
       --------------------------------- */

    function validateUsername(username) {
        if (username.length < 3) {
            return "Username must contain at least 3 characters.";
        }

        if (username.length > 30) {
            return "Username cannot exceed 30 characters.";
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return "Use only letters, numbers, underscores, or hyphens.";
        }

        return "";
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailPattern.test(email)) {
            return "Enter a valid email address.";
        }

        return "";
    }

    function validatePassword(password) {
        if (password.length < 8) {
            return "Password must contain at least 8 characters.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must include an uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must include a lowercase letter.";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must include a number.";
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Password must include a special character.";
        }

        return "";
    }

    /* ---------------------------------
       Switch forms
       --------------------------------- */

    function openRegisterForm() {
        clearMessage(loginForm);
        container.classList.add("active");

        window.setTimeout(() => {
            registerUsername.focus();
        }, 300);
    }

    function openLoginForm() {
        clearMessage(registerForm);
        container.classList.remove("active");

        window.setTimeout(() => {
            loginUsername.focus();
        }, 300);
    }

    registerLink?.addEventListener("click", (event) => {
        event.preventDefault();
        openRegisterForm();
    });

    loginLink?.addEventListener("click", (event) => {
        event.preventDefault();
        openLoginForm();
    });

    /* ---------------------------------
       Registration
       --------------------------------- */

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearMessage(registerForm);

        const username = registerUsername.value.trim();
        const email = registerEmail.value.trim().toLowerCase();
        const password = registerPassword.value;

        const usernameError = validateUsername(username);

        if (usernameError) {
            showMessage(registerForm, usernameError);
            registerUsername.focus();
            return;
        }

        const emailError = validateEmail(email);

        if (emailError) {
            showMessage(registerForm, emailError);
            registerEmail.focus();
            return;
        }

        const passwordError = validatePassword(password);

        if (passwordError) {
            showMessage(registerForm, passwordError);
            registerPassword.focus();
            return;
        }

        const users = getUsers();

        const usernameAlreadyExists = users.some(
            (user) =>
                normalize(user.username) === normalize(username)
        );

        if (usernameAlreadyExists) {
            showMessage(
                registerForm,
                "That username is already registered."
            );

            registerUsername.focus();
            return;
        }

        const emailAlreadyExists = users.some(
            (user) => normalize(user.email) === normalize(email)
        );

        if (emailAlreadyExists) {
            showMessage(
                registerForm,
                "That email address is already registered."
            );

            registerEmail.focus();
            return;
        }

        const registerButton = registerForm.querySelector(".btn");

        setButtonLoading(
            registerButton,
            true,
            "Creating account..."
        );

        /*
            Plain-text passwords in localStorage are only acceptable
            for a basic classroom demonstration.
        */
        const newUser = {
            id: createUserId(),
            username,
            email,
            password,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        users.push(newUser);

        const accountSaved = saveUsers(users);

        setButtonLoading(registerButton, false);

        if (!accountSaved) {
            showMessage(
                registerForm,
                "The account could not be saved. Check browser storage settings."
            );

            return;
        }

        registerForm.reset();
        openLoginForm();

        loginUsername.value = username;

        showMessage(
            loginForm,
            "Account created successfully. Enter your password to log in.",
            "success"
        );

        loginPassword.focus();
    });

    /* ---------------------------------
       Login
       --------------------------------- */

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearMessage(loginForm);

        const loginValue = loginUsername.value.trim();
        const password = loginPassword.value;

        if (!loginValue) {
            showMessage(
                loginForm,
                "Enter your username or email address."
            );

            loginUsername.focus();
            return;
        }

        if (!password) {
            showMessage(loginForm, "Enter your password.");
            loginPassword.focus();
            return;
        }

        const users = getUsers();

        const user = users.find((savedUser) => {
            const usernameMatches =
                normalize(savedUser.username) === normalize(loginValue);

            const emailMatches =
                normalize(savedUser.email) === normalize(loginValue);

            return usernameMatches || emailMatches;
        });

        if (!user || user.password !== password) {
            showMessage(
                loginForm,
                "Incorrect username, email, or password."
            );

            loginPassword.value = "";
            loginPassword.focus();
            return;
        }

        const loginButton = loginForm.querySelector(".btn");

        setButtonLoading(loginButton, true, "Signing in...");

        user.lastLogin = new Date().toISOString();
        saveUsers(users);

        const sessionSaved = saveSession(user);

        if (!sessionSaved) {
            setButtonLoading(loginButton, false);

            showMessage(
                loginForm,
                "Your login session could not be saved."
            );

            return;
        }

        showMessage(
            loginForm,
            `Welcome back, ${user.username}!`,
            "success"
        );

        window.setTimeout(() => {
            window.location.href = DASHBOARD_PAGE;
        }, 700);
    });

    /* ---------------------------------
       Show and hide passwords
       --------------------------------- */

    function addPasswordToggle(passwordInput) {
        const inputBox = passwordInput.closest(".input-box");

        if (!inputBox || inputBox.querySelector(".password-toggle")) {
            return;
        }

        /*
            Remove the original lock icon because the new button
            replaces it in the same position.
        */
        const existingIcon = inputBox.querySelector("i");

        if (existingIcon) {
            existingIcon.remove();
        }

        const toggleButton = document.createElement("button");

        toggleButton.type = "button";
        toggleButton.className = "password-toggle";
        toggleButton.setAttribute("aria-label", "Show password");

        toggleButton.innerHTML =
            '<i class="bx bxs-lock-alt" aria-hidden="true"></i>';

        Object.assign(toggleButton.style, {
            position: "absolute",
            top: "50%",
            right: "10px",
            width: "36px",
            height: "36px",
            display: "grid",
            placeItems: "center",
            padding: "0",
            color: "#64748b",
            fontSize: "20px",
            cursor: "pointer",
            background: "transparent",
            border: "0",
            borderRadius: "8px",
            transform: "translateY(-50%)"
        });

        toggleButton.addEventListener("click", () => {
            const passwordIsHidden =
                passwordInput.type === "password";

            passwordInput.type =
                passwordIsHidden ? "text" : "password";

            toggleButton.setAttribute(
                "aria-label",
                passwordIsHidden
                    ? "Hide password"
                    : "Show password"
            );

            toggleButton.innerHTML = passwordIsHidden
                ? '<i class="bx bxs-lock-open-alt" aria-hidden="true"></i>'
                : '<i class="bx bxs-lock-alt" aria-hidden="true"></i>';

            passwordInput.focus();
        });

        inputBox.appendChild(toggleButton);
    }

    addPasswordToggle(loginPassword);
    addPasswordToggle(registerPassword);

    /* ---------------------------------
       Clear messages while typing
       --------------------------------- */

    loginForm.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
            clearMessage(loginForm);
        });
    });

    registerForm.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
            clearMessage(registerForm);
        });
    });

    /* Press Escape to return to login. */

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            container.classList.contains("active")
        ) {
            openLoginForm();
        }
    });

    /* ---------------------------------
       Public dashboard functions
       --------------------------------- */

    window.DayWiseAuth = {
        getCurrentUser() {
            const user = getCurrentUser();

            if (!user) {
                return null;
            }

            /*
                Do not expose the saved password to dashboard code.
            */
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            };
        },

        isLoggedIn() {
            return Boolean(getCurrentUser());
        },

        logout(redirectPage = "index.html") {
            removeSession();
            window.location.href = redirectPage;
        },

        deleteAccount(redirectPage = "index.html") {
            const user = getCurrentUser();

            if (!user) {
                removeSession();
                window.location.href = redirectPage;
                return false;
            }

            const remainingUsers = getUsers().filter(
                (savedUser) => savedUser.id !== user.id
            );

            const saved = saveUsers(remainingUsers);

            removeSession();
            window.location.href = redirectPage;

            return saved;
        },

        "delete"(redirectPage = "index.html") {
            return this.deleteAccount(redirectPage);
        }
    };
});
