import { App } from "@matheusmntt/ion";
import { STORAGE_KEY, todosStore } from "../stores/todos.js";

/**
 * Registers all application-level reactive effects.
 *
 * Effects run immediately and re-run whenever reactive state they read changes.
 * Dependencies are tracked automatically — no need to declare them.
 *
 * Ion feature used: App.effect()
 */
export function registerEffects() {
  /**
   * Persist to localStorage.
   *
   * Reads todosStore.state.items → registers it as a dependency.
   * Runs again every time items changes. The store reads the saved
   * tasks back on startup (stores/todos.js).
   */
  App.effect(
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todosStore.state.items));
    },
    { label: "persist" },
  );

  /**
   * Sync progress bar visual width.
   *
   * Reads the `progress` computed. Computeds track their own dependencies
   * (items), so this effect re-runs whenever the completion changes and
   * not when only the filter does.
   */
  App.effect(
    () => {
      const el = document.getElementById("progress-fill");
      if (el) el.style.width = todosStore.state.progress + "%";
    },
    { label: "progress-bar" },
  );

  /**
   * Update browser tab title.
   *
   * Reads `pendingCount` → re-runs when pending tasks change.
   */
  App.effect(
    () => {
      const n = todosStore.state.pendingCount;
      document.title = n > 0 ? `(${n}) Ion — Todo` : "Ion — Todo";
    },
    { label: "tab-title" },
  );

  /**
   * Live clock.
   *
   * This effect has NO reactive dependencies — it reads no store state.
   * It runs once on mount and uses setInterval for updates.
   *
   * The returned function is the cleanup: Ion calls it before a re-run and
   * when the effect is stopped. This pattern prevents interval leaks.
   */
  App.effect(() => {
    function tick() {
      const now = new Date();
      const clock = document.getElementById("clock");
      const label = document.getElementById("date-label");
      if (clock)
        clock.textContent = now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      if (label)
        label.textContent = now.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, { label: "clock" });
}
