import { App } from "@matheusmntt/ion";
import { todosStore } from "../stores/todos.js";

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
   * Runs again every time items changes.
   */
  App.effect(() => {
    localStorage.setItem("ion-demo", JSON.stringify(todosStore.state.items));
  });

  /**
   * Sync progress bar visual width.
   *
   * Uses store.subscribe() instead of App.effect() because `progress` is a
   * computed property defined via Object.defineProperty on the proxy — its
   * getter bypasses the Proxy get trap, so activeEffect is never registered
   * as a dependency. subscribe() fires on any store mutation, which is the
   * correct trigger here since progress always derives from items.
   */
  todosStore.subscribe(() => {
    const el = document.getElementById("progress-fill");
    if (el) el.style.width = todosStore.state.progress + "%";
  });

  /**
   * Update browser tab title.
   *
   * Reads `pendingCount` → re-runs when pending tasks change.
   */
  App.effect(() => {
    const n = todosStore.state.pendingCount;
    document.title = n > 0 ? `(${n}) Ion — Todo` : "Ion — Todo";
  });

  /**
   * Live clock.
   *
   * This effect has NO reactive dependencies — it reads no store state.
   * It runs once on mount and uses setInterval for updates.
   *
   * The returned function is the cleanup: Ion calls it when the effect
   * is stopped (e.g. on page unload). This pattern prevents interval leaks.
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
  });
}
