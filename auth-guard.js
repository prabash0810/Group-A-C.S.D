"use strict";

/* Shared protection for pages that require a Daywise login. */
(function protectPage() {
  const sessionKey = "daywise.session.v1";
  let session = null;

  try {
    session = JSON.parse(
      localStorage.getItem(sessionKey) ||
      sessionStorage.getItem(sessionKey) ||
      "null"
    );
  } catch {
    localStorage.removeItem(sessionKey);
    sessionStorage.removeItem(sessionKey);
  }

  if (!session || !session.email || !session.userId) {
    const loginUrl = new URL("webpage/webpage.html", document.currentScript.src);
    window.location.replace(loginUrl.href);
  }
})();
