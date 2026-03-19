import { App } from "@matheusmntt/ion";
import { todosStore } from "../stores/todos.js";
import { draftStore } from "../stores/draft.js";
import { showToast } from "../utils/toast.js";

function addTodo() {
  const text = draftStore.state.text.trim();

  if (!text) {
    const input = document.getElementById("new-input");
    input.classList.add("shake");
    input.addEventListener(
      "animationend",
      () => input.classList.remove("shake"),
      { once: true },
    );
    return;
  }

  const newItem = {
    id: Date.now(),
    text,
    done: false,
    priority: draftStore.state.priority,
    createdAt: new Date().toISOString(),
  };

  // Use Array.from to get a plain array of plain objects from the reactive proxy.
  // Spreading the proxy directly could produce an array of proxied items which,
  // when stored back, create proxy-of-proxy chains.
  const current = Array.from(todosStore.state.items).map((i) => ({ ...i }));

  App.batch(() => {
    todosStore.state.items = [newItem, ...current];
    draftStore.state.text = "";
    draftStore.state.priority = "medium";
  });
}

function clearDone() {
  const n = todosStore.state.doneCount;
  const kept = Array.from(todosStore.state.items)
    .filter((i) => !i.done)
    .map((i) => ({ ...i }));
  todosStore.state.items = kept;
  showToast(`Removed ${n} completed task${n !== 1 ? "s" : ""}.`);
}

export function registerTodoApp() {
  App.component("[data-todo-app]", (el) => {
    const input = el.querySelector("#new-input");
    const addBtn = el.querySelector("#add-btn");
    const filterBar = el.querySelector("#filter-bar");
    const clearBtn = el.querySelector("#clear-btn");

    const onKey = (e) => {
      if (e.key === "Enter") addTodo();
    };
    const onAdd = () => addTodo();
    const onClear = () => clearDone();

    const onFilter = (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      todosStore.state.filter = btn.dataset.filter;
      filterBar
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.classList.toggle("on", b === btn));
    };

    input.addEventListener("keydown", onKey);
    if (addBtn) addBtn.addEventListener("click", onAdd);
    filterBar.addEventListener("click", onFilter);
    if (clearBtn) clearBtn.addEventListener("click", onClear);

    return {
      cleanup() {
        input.removeEventListener("keydown", onKey);
        if (addBtn) addBtn.removeEventListener("click", onAdd);
        filterBar.removeEventListener("click", onFilter);
        if (clearBtn) clearBtn.removeEventListener("click", onClear);
      },
    };
  });
}
