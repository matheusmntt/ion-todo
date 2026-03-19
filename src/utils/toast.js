let _timer = null;

/**
 * Displays a temporary toast notification at the bottom of the screen.
 * Auto-dismisses after 2.4s. Calling again resets the timer.
 *
 * @param {string} msg
 */
export function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(_timer);
  _timer = setTimeout(() => el.classList.remove("show"), 2400);
}
