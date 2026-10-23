// Runs before the page paints. Closes the giveaway at the end of
// November 1, 2026 (Central), which is 2026-11-02 06:00:00 UTC.
// To run the page again, update this instant and the matching
// timestamp in .htaccess.
(function () {
  var closeAt = "2026-11-02T06:00:00Z";
  window.GIVEAWAY_CLOSE = closeAt;

  if (Date.now() < Date.parse(closeAt)) return;

  document.documentElement.classList.add("giveaway-closed");

  if (/\/giveaway(?:\/index\.html)?\/?$/.test(location.pathname)) {
    location.replace("/");
  }
})();
