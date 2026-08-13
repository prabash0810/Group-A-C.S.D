"use strict";

/*
  Daywise front-end authentication demo.
  - Users + remembered email are stored in localStorage.
  - A remembered login session uses localStorage.
  - A non-remembered login session uses sessionStorage.
  - Passwords are SHA-256 hashed before storage.

  This is appropriate for a coursework/front-end demo, not production auth.
*/

const STORAGE_KEYS = {
  users: "daywise.users.v1",
  rememberedEmail: "daywise.rememberedEmail.v1",
  persistentSession: "daywise.session.v1",
  rememberPreference: "daywise.rememberPreference.v1"
};

const SESSION_KEY = "daywise.session.v1";

const byId = (id) => document.getElementById(id);

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getUsers() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.users), []);
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function normaliseEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    bytes
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setMessage(element, text = "", type = "") {
  if (!element) return;

  element.textContent = text;

  element.classList.remove(
    "success",
    "error"
  );

  if (type) {
    element.classList.add(type);
  }
}

function markInvalid(input, invalid) {
  if (!input) return;

  input.classList.toggle(
    "input-error",
    Boolean(invalid)
  );

  input.setAttribute(
    "aria-invalid",
    invalid ? "true" : "false"
  );
}

function showToast(message) {
  const toast = byId("toast");

  toast.textContent = message;
  toast.hidden = false;

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

function openModal(id) {
  const modal = byId(id);

  if (!modal) return;

  modal.hidden = false;

  const firstInput =
    modal.querySelector("input");

  if (firstInput) {
    setTimeout(() => {
      firstInput.focus();
    }, 0);
  }
}

function closeModal(id) {
  const modal = byId(id);

  if (modal) {
    modal.hidden = true;
  }
}

/* ===============================
   SESSION MANAGEMENT
================================ */

function readActiveSession() {
  return (
    safeParse(
      localStorage.getItem(
        STORAGE_KEYS.persistentSession
      ),
      null
    ) ||
    safeParse(
      sessionStorage.getItem(
        SESSION_KEY
      ),
      null
    )
  );
}

function writeSession(user, remember) {

  const session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date().toISOString(),
    persistent: Boolean(remember)
  };

  localStorage.removeItem(
    STORAGE_KEYS.persistentSession
  );

  sessionStorage.removeItem(
    SESSION_KEY
  );

  if (remember) {

    localStorage.setItem(
      STORAGE_KEYS.persistentSession,
      JSON.stringify(session)
    );

  } else {

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );

  }

  return session;
}

function clearSession() {

  localStorage.removeItem(
    STORAGE_KEYS.persistentSession
  );

  sessionStorage.removeItem(
    SESSION_KEY
  );

}

function renderSession() {

  const loginCard =
    byId("loginCard");

  const signedInCard =
    byId("signedInCard");

  const session =
    readActiveSession();

  if (!session) {

    loginCard.hidden = false;
    signedInCard.hidden = true;

    return;

  }

  const users =
    getUsers();

  const user =
    users.find(
      (item) =>
        item.id === session.userId ||
        item.email === session.email
    );

  if (!user) {

    clearSession();

    loginCard.hidden = false;
    signedInCard.hidden = true;

    return;

  }

  loginCard.hidden = true;
  signedInCard.hidden = false;

  byId("welcomeName").textContent =
    `Welcome, ${
      user.name.split(" ")[0] ||
      user.name
    }`;

  byId("welcomeEmail").textContent =
    user.email;

  byId("userAvatar").textContent =
    (
      user.name ||
      user.email
    )
      .charAt(0)
      .toUpperCase();

  byId("sessionType").textContent =
    session.persistent
      ? "Remembered on this device"
      : "This browser tab";
}

/* ===============================
   PARTICLES
================================ */

(function initParticles() {

  const field =
    byId("particles");

  if (!field) return;

  const colors = [
    "#f4a93b",
    "#8aa0ff",
    "#ff8266",
    "#52d68a",
    "#c9a6ff",
    "#ffc857"
  ];

  for (
    let i = 0;
    i < 20;
    i++
  ) {

    const particle =
      document.createElement("div");

    particle.className =
      "particle";

    const size =
      2 + Math.random() * 4;

    const duration =
      6 + Math.random() * 10;

    particle.style.width =
      `${size}px`;

    particle.style.height =
      `${size}px`;

    particle.style.left =
      `${Math.random() * 100}%`;

    particle.style.top =
      `${Math.random() * 100}%`;

    particle.style.background =
      colors[
        i % colors.length
      ];

    particle.style.opacity =
      0.1 +
      Math.random() *
        0.25;

    particle.style.setProperty(
      "--p-dx",
      `${(
        Math.random() * 50 -
        25
      ).toFixed(0)}px`
    );

    particle.style.setProperty(
      "--p-dy",
      `${(
        Math.random() * 60 -
        20
      ).toFixed(0)}px`
    );

    particle.style.setProperty(
      "--p-op-a",
      (
        0.12 +
        Math.random() *
          0.3
      ).toFixed(2)
    );

    particle.style.setProperty(
      "--p-op-b",
      (
        0.04 +
        Math.random() *
          0.12
      ).toFixed(2)
    );

    particle.style.setProperty(
      "--p-base",
      `${duration}s`
    );

    particle.style.animationDelay =
      `${
        Math.random() *
        -duration
      }s`;

    field.appendChild(
      particle
    );
  }

})();

/* ===============================
   SLIDESHOW
================================ */

(function initSlideshow() {

  const slides =
    document.querySelectorAll(
      ".slide"
    );

  const dotsWrap =
    byId("dots");

  if (
    !slides.length ||
    !dotsWrap
  ) {
    return;
  }

  const total =
    slides.length;

  const BASE_INTERVAL =
    4200;

  let current = 0;
  let timer = null;
  let paused = false;

  slides.forEach(
    (_, index) => {

      const dot =
        document.createElement(
          "button"
        );

      dot.type =
        "button";

      dot.className =
        `dot${
          index === 0
            ? " active"
            : ""
        }`;

      dot.setAttribute(
        "aria-label",
        `Show slide ${
          index + 1
        }`
      );

      dot.addEventListener(
        "click",
        () => {

          goTo(index);
          resetTimer();

        }
      );

      dotsWrap.appendChild(
        dot
      );

    }
  );

  const dotEls =
    dotsWrap.querySelectorAll(
      ".dot"
    );

  function goTo(index) {

    slides[
      current
    ].classList.remove(
      "active"
    );

    dotEls[
      current
    ].classList.remove(
      "active"
    );

    current =
      (
        index +
        total
      ) %
      total;

    slides[
      current
    ].classList.add(
      "active"
    );

    dotEls[
      current
    ].classList.add(
      "active"
    );

  }

  function resetTimer() {

    if (timer) {
      clearInterval(timer);
    }

    timer =
      setInterval(
        () =>
          goTo(
            current + 1
          ),
        BASE_INTERVAL *
          (
            paused
              ? 3.2
              : 1
          )
      );

  }

  resetTimer();

  window.__daywiseSlideshowFocus =
    (on) => {

      paused = on;
      resetTimer();

    };

})();

/* ===============================
   LOGIN FOCUS EFFECT
================================ */

(function initFocusEffect() {

  const root =
    document.documentElement;

  const card =
    byId("loginCard");

  if (!card) return;

  let active = false;

  function setFocus(on) {

    if (
      on === active
    ) {
      return;
    }

    active = on;

    root.style.setProperty(
      "--speed-scale",
      on
        ? "3"
        : "1"
    );

    root.style.setProperty(
      "--stage-blur",
      on
        ? "6px"
        : "0px"
    );

    root.style.setProperty(
      "--stage-dim",
      on
        ? "0.42"
        : "0"
    );

    if (
      window
        .__daywiseSlideshowFocus
    ) {

      window
        .__daywiseSlideshowFocus(
          on
        );

    }

  }

  card.addEventListener(
    "mouseenter",
    () =>
      setFocus(true)
  );

  card.addEventListener(
    "mouseleave",
    () => {

      if (
        !card.contains(
          document.activeElement
        )
      ) {

        setFocus(false);

      }

    }
  );

  card
    .querySelectorAll(
      "input"
    )
    .forEach(
      (input) => {

        input.addEventListener(
          "focus",
          () =>
            setFocus(true)
        );

        input.addEventListener(
          "blur",
          () => {

            if (
              !card.matches(
                ":hover"
              )
            ) {

              setFocus(
                false
              );

            }

          }
        );

      }
    );

})();

/* ===============================
   REMEMBER ME
================================ */

(function initRememberMe() {

  const checkbox =
    byId("rememberMe");

  const switchEl =
    byId("toggleSwitch");

  const rememberedEmail =
    localStorage.getItem(
      STORAGE_KEYS
        .rememberedEmail
    );

  const preference =
    localStorage.getItem(
      STORAGE_KEYS
        .rememberPreference
    );

  if (
    preference !== null
  ) {

    checkbox.checked =
      preference ===
      "true";

  }

  switchEl.classList.toggle(
    "on",
    checkbox.checked
  );

  if (
    rememberedEmail
  ) {

    byId("email").value =
      rememberedEmail;

  }

  checkbox.addEventListener(
    "change",
    () => {

      switchEl.classList.toggle(
        "on",
        checkbox.checked
      );

      localStorage.setItem(
        STORAGE_KEYS
          .rememberPreference,

        String(
          checkbox.checked
        )
      );

    }
  );

})();

/* ===============================
   LOGIN
================================ */

byId("loginCard")
  .addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const emailInput =
        byId("email");

      const passwordInput =
        byId("password");

      const remember =
        byId(
          "rememberMe"
        ).checked;

      const message =
        byId(
          "loginMessage"
        );

      const button =
        byId(
          "signInBtn"
        );

      const email =
        normaliseEmail(
          emailInput.value
        );

      const password =
        passwordInput.value;

      markInvalid(
        emailInput,
        !emailInput.validity
          .valid
      );

      markInvalid(
        passwordInput,
        password.length <
          8
      );

      if (
        !emailInput
          .validity.valid ||
        password.length <
          8
      ) {

        setMessage(
          message,
          "Enter a valid email and a password with at least 8 characters.",
          "error"
        );

        return;

      }

      button.disabled =
        true;

      button.textContent =
        "Signing in…";

      setMessage(
        message,
        "Checking your account…"
      );

      try {

        const users =
          getUsers();

        const user =
          users.find(
            (item) =>
              item.email ===
              email
          );

        const passwordHash =
          await hashPassword(
            password
          );

        if (
          !user ||
          user.passwordHash !==
            passwordHash
        ) {

          setMessage(
            message,
            "Email or password is incorrect.",
            "error"
          );

          return;

        }

        user.lastLoginAt =
          new Date()
            .toISOString();

        saveUsers(users);

        writeSession(
          user,
          remember
        );

        if (
          remember
        ) {

          localStorage.setItem(
            STORAGE_KEYS
              .rememberedEmail,
            email
          );

        } else {

          localStorage.removeItem(
            STORAGE_KEYS
              .rememberedEmail
          );

        }

        passwordInput.value =
          "";

        setMessage(
          message
        );

        window.location.replace("../dashboard.html");

      } catch (error) {

        console.error(
          error
        );

        setMessage(
          message,
          "Something went wrong while signing in.",
          "error"
        );

      } finally {

        button.disabled =
          false;

        button.textContent =
          "Sign in";

      }

    }
  );

/* ===============================
   CREATE ACCOUNT
================================ */

byId("createAccountBtn")
  .addEventListener(
    "click",
    () => {

      const currentEmail =
        normaliseEmail(
          byId("email").value
        );

      if (renderSession()) {

        byId(
          "signupEmail"
        ).value =
          currentEmail;

      }

      setMessage(
        byId(
          "signupMessage"
        )
      );

      openModal(
        "signupModal"
      );

    }
  );

byId("signupForm")
  .addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const nameInput =
        byId(
          "signupName"
        );

      const emailInput =
        byId(
          "signupEmail"
        );

      const passwordInput =
        byId(
          "signupPassword"
        );

      const confirmInput =
        byId(
          "signupConfirm"
        );

      const message =
        byId(
          "signupMessage"
        );

      const name =
        nameInput.value.trim();

      const email =
        normaliseEmail(
          emailInput.value
        );

      const password =
        passwordInput.value;

      const confirmPassword =
        confirmInput.value;

      const invalidName =
        name.length < 2;

      const invalidEmail =
        !emailInput
          .validity.valid;

      const invalidPassword =
        password.length <
        8;

      const mismatch =
        password !==
        confirmPassword;

      markInvalid(
        nameInput,
        invalidName
      );

      markInvalid(
        emailInput,
        invalidEmail
      );

      markInvalid(
        passwordInput,
        invalidPassword
      );

      markInvalid(
        confirmInput,
        mismatch ||
          confirmPassword
            .length < 8
      );

      if (
        invalidName ||
        invalidEmail ||
        invalidPassword ||
        mismatch
      ) {

        setMessage(
          message,

          mismatch
            ? "Passwords do not match."
            : "Complete every field. Passwords must be at least 8 characters.",

          "error"
        );

        return;

      }

      const users =
        getUsers();

      if (
        users.some(
          (item) =>
            item.email ===
            email
        )
      ) {

        setMessage(
          message,
          "An account with this email already exists.",
          "error"
        );

        return;

      }

      users.push({

        id: createId(),

        name: name,

        email: email,

        passwordHash:
          await hashPassword(
            password
          ),

        createdAt:
          new Date()
            .toISOString(),

        lastLoginAt:
          null

      });

      saveUsers(users);

      localStorage.setItem(
        STORAGE_KEYS
          .rememberedEmail,
        email
      );

      byId("email").value =
        email;

      byId("password").value =
        "";

      event.currentTarget
        .reset();

      setMessage(
        message,
        "Account created. You can sign in now.",
        "success"
      );

      setTimeout(
        () => {

          closeModal(
            "signupModal"
          );

          setMessage(
            message
          );

          byId(
            "password"
          ).focus();

          showToast(
            "Account created successfully."
          );

        },
        650
      );

    }
  );

/* ===============================
   FORGOT PASSWORD
================================ */

byId("forgotPasswordBtn")
  .addEventListener(
    "click",
    () => {

      const currentEmail =
        normaliseEmail(
          byId("email").value
        );

      if (
        currentEmail
      ) {

        byId(
          "resetEmail"
        ).value =
          currentEmail;

      }

      setMessage(
        byId(
          "resetMessage"
        )
      );

      openModal(
        "resetModal"
      );

    }
  );

byId("resetForm")
  .addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const emailInput =
        byId(
          "resetEmail"
        );

      const passwordInput =
        byId(
          "resetPassword"
        );

      const message =
        byId(
          "resetMessage"
        );

      const email =
        normaliseEmail(
          emailInput.value
        );

      const password =
        passwordInput.value;

      if (
        !emailInput
          .validity.valid ||
        password.length <
          8
      ) {

        setMessage(
          message,
          "Enter a valid email and a password with at least 8 characters.",
          "error"
        );

        return;

      }

      const users =
        getUsers();

      const user =
        users.find(
          (item) =>
            item.email ===
            email
        );

      if (!user) {

        setMessage(
          message,
          "No local Daywise account was found for that email.",
          "error"
        );

        return;

      }

      user.passwordHash =
        await hashPassword(
          password
        );

      user.passwordUpdatedAt =
        new Date()
          .toISOString();

      saveUsers(users);

      byId("email").value =
        email;

      event.currentTarget
        .reset();

      setMessage(
        message,
        "Password updated.",
        "success"
      );

      setTimeout(
        () => {

          closeModal(
            "resetModal"
          );

          setMessage(
            message
          );

          byId(
            "password"
          ).focus();

          showToast(
            "Password updated. Sign in with your new password."
          );

        },
        650
      );

    }
  );

/* ===============================
   MODAL CONTROLS
================================ */

document
  .querySelectorAll(
    "[data-close-modal]"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () =>
          closeModal(
            button.dataset
              .closeModal
          )
      );

    }
  );

document
  .querySelectorAll(
    ".modal-backdrop"
  )
  .forEach(
    (backdrop) => {

      backdrop.addEventListener(
        "click",
        (event) => {

          if (
            event.target ===
            backdrop
          ) {

            backdrop.hidden =
              true;

          }

        }
      );

    }
  );

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
      "Escape"
    ) {

      document
        .querySelectorAll(
          ".modal-backdrop:not([hidden])"
        )
        .forEach(
          (modal) => {

            modal.hidden =
              true;

          }
        );

    }

  }
);

/* ===============================
   GOOGLE / APPLE BUTTONS
================================ */

document
  .querySelectorAll(
    ".oauth-demo"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          showToast(
            `${
              button.dataset
                .provider
            } sign-in needs provider credentials and a backend callback.`
          );

        }
      );

    }
  );

/* ===============================
   LOGOUT
================================ */
/* ===============================
   LOGOUT
================================ */

const logoutBtn = byId("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

        clearSession();

        showToast("You have been signed out.");

        setTimeout(() => {
            window.location.href = "webpage/webpage.html";
        }, 500);

    });
}
/* ===============================
   REMOVE INPUT ERRORS WHILE TYPING
================================ */

document
  .querySelectorAll(
    "input"
  )
  .forEach(
    (input) => {

      input.addEventListener(
        "input",
        () =>
          markInvalid(
            input,
            false
          )
      );

    }
  );

  renderSession();

/* ===============================
   JQUERY PROGRESSIVE ENHANCEMENTS
   Authentication continues to use the existing JavaScript above.
================================ */

(function initialiseLoginJQuery($) {
  if (!$) return;

  $(function () {
    // Add accessible focus state hooks without changing form validation.
    $(document).on("focusin.daywiseJquery", ".field input", function () {
      $(this).closest(".field").addClass("field-focused");
    });

    $(document).on("focusout.daywiseJquery", ".field input", function () {
      $(this).closest(".field").removeClass("field-focused");
    });

    // Provide subtle press feedback for login and modal buttons.
    $(document).on("mousedown.daywiseJquery", "button", function () {
      $(this).css("transform", "scale(0.98)");
    });

    $(document).on("mouseup.daywiseJquery mouseleave.daywiseJquery", "button", function () {
      $(this).css("transform", "");
    });

    // Preserve the existing modal controls and focus the first field smoothly.
    $(document).on("click.daywiseJquery", "#createAccountBtn, #forgotPasswordBtn", function () {
      window.setTimeout(function () {
        $(".modal-backdrop:not([hidden]) input:first").trigger("focus");
      }, 0);
    });
  });
})(window.jQuery);
