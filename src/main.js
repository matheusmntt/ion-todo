import { App, applyBindings } from "@matheusmntt/ion";

import { TooltipPlugin } from "./plugins/tooltip.js";
import { todosStore } from "./stores/todos.js";
import { draftStore } from "./stores/draft.js";
import { registerEffects } from "./effects/index.js";
import { registerTodoApp } from "./components/TodoApp.js";
import { registerTodoList } from "./components/TodoList.js";
import { showToast } from "./utils/toast.js";

// 1. Plugins
App.use(TooltipPlugin);

// 2. Effects
registerEffects();

// 3. Components
registerTodoApp();
registerTodoList();

// 4. Bindings
//
// Rule: each store is bound only to the exact elements that carry its attributes.
// Binding a store to a wide root causes it to connect data-show/data-bind on
// elements that belong to a different store, hiding them or writing wrong values.
//
// todosStore attributes live in:
//   - #app-header        → data-bind="progress"
//   - #stats-row         → data-bind="totalCount" etc, data-show="hasHighPriority"
//   - #filter-bar        → data-show="hasDone"
//   - [data-show=isEmpty] → the empty state div
//
// draftStore attributes live in:
//   - #draft-form        → data-model="text", data-model="priority", data-show="typing"
//
// Binding todosStore to the full card would also reach #draft-form and connect
// data-show="typing" to todosStore (where `typing` is undefined → hidden=true).
// Binding draftStore to the full card would reach #stats-row and connect
// data-bind="totalCount" to draftStore (undefined → empty string).

const header = document.getElementById("app-header");
const statsRow = document.getElementById("stats-row");
const filterBar = document.getElementById("filter-bar");
const emptyState = document.querySelector('[data-show="isEmpty"]');
const draftForm = document.getElementById("draft-form");

// todosStore → each element individually, never the full card
App.bind(header, todosStore);
App.bind(statsRow, todosStore);
App.bind(filterBar, todosStore);
if (emptyState) App.bind(emptyState, todosStore);

// draftStore → only the input row
applyBindings(draftForm, draftStore);

// 5. Watchers
todosStore.watch("progress", (value) => {
  if (value === 100 && todosStore.state.totalCount > 0) {
    showToast("All done! Great work.");
  }
});

todosStore.onChange((prop, value) => {
  if (prop === "items") return;
  console.log(`[ion:todos] ${String(prop)} →`, value);
});

// 6. Start
App.start();
