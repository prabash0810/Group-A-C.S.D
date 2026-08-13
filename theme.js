"use strict";

(function applySavedTheme() {
  const isDark = localStorage.getItem("daywise.theme") === "dark";
  document.documentElement.classList.toggle("daywise-dark", isDark);

  if (document.body) {
    document.body.classList.toggle("daywise-dark", isDark);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      document.body.classList.toggle("daywise-dark", isDark);
    });
  }
})();

window.setDaywiseTheme = function (isDark) {
  localStorage.setItem("daywise.theme", isDark ? "dark" : "light");
  document.documentElement.classList.toggle("daywise-dark", isDark);
  document.body.classList.toggle("daywise-dark", isDark);
};
