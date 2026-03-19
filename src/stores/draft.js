import { App } from "@matheusmntt/ion";

/**
 * draft store — UI state scoped to the new-task input form.
 *
 * Kept separate from the todos store intentionally:
 * form state (what the user is typing) has a different lifecycle from
 * domain state (the saved tasks). Mixing them would cause unnecessary
 * re-renders of the list whenever the user types.
 *
 * Ion features used: App.store(), store.watch()
 */
export const draftStore = App.store("draft", {
  text: "",
  priority: "medium",

  /**
   * True when the user has typed at least one character.
   * Drives data-show="typing" on the priority <select>.
   * Set automatically by the watch below — never mutated manually.
   */
  typing: false,
});

/**
 * watch: keep `typing` in sync with `text`.
 *
 * Ion's watch fires only when the watched path value actually changes,
 * so this won't produce spurious updates.
 */
draftStore.watch("text", (value) => {
  draftStore.state.typing = String(value).trim().length > 0;
});
