import { App } from "@matheusmntt/ion";
import { todosStore } from "../stores/todos.js";
import { showToast } from "../utils/toast.js";
import { escapeHtml } from "../utils/html.js";

const PRIORITY_DOT = { high: "dot-high", medium: "dot-medium", low: "dot-low" };
const PRIORITY_LABEL = { high: "urgent", medium: "medium", low: "low" };

function buildItem(item) {
  const li = document.createElement("li");
  li.className = "todo-item enter";
  li.dataset.id = String(item.id);

  li.innerHTML = `
    <button
      class="check ${item.done ? "on" : ""}"
      data-check="${item.id}"
      title="${item.done ? "Mark as pending" : "Mark as done"}"
    >
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
        <path d="M1 3.5l2.5 2.5 4.5-5"
          stroke="white" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"
        />
      </svg>
    </button>

    <span
      class="dot ${PRIORITY_DOT[item.priority] ?? "dot-medium"}"
      title="${PRIORITY_LABEL[item.priority] ?? "medium"} priority"
    ></span>

    <span
      class="flex-1 text-sm"
      style="text-decoration:${item.done ? "line-through" : "none"};color:${item.done ? "var(--muted)" : "var(--ink)"};transition:color 0.2s;"
    >${escapeHtml(String(item.text))}</span>

    <button
      class="remove-btn"
      data-remove="${item.id}"
      title="Remove task"
    >✕</button>
  `;

  return li;
}

function toggleTodo(id) {
  const updated = Array.from(todosStore.state.items).map((i) =>
    i.id === id ? { ...i, done: !i.done } : { ...i },
  );
  todosStore.state.items = updated;
}

function removeTodo(id, li) {
  li.classList.add("remove");
  li.addEventListener(
    "animationend",
    () => {
      const kept = Array.from(todosStore.state.items)
        .filter((i) => i.id !== id)
        .map((i) => ({ ...i }));
      todosStore.state.items = kept;
      showToast("Task removed.");
    },
    { once: true },
  );
}

export function registerTodoList() {
  App.component("[data-todo-list]", (el) => {
    function render() {
      // Do NOT call App.destroySubtree(el) here — that destroys THIS component's
      // own instance (removing its subscriber from the store), which means
      // render() would never be called again after the first mutation.
      // The <li> items are plain DOM, not Ion components, so no cleanup needed.
      el.innerHTML = "";

      const items = todosStore.state.filtered;
      if (!Array.isArray(items)) return;

      items.forEach((item) => el.appendChild(buildItem(item)));
    }

    const onClick = (e) => {
      const checkBtn = e.target.closest("[data-check]");
      if (checkBtn) {
        checkBtn.classList.add("pop");
        checkBtn.addEventListener(
          "animationend",
          () => checkBtn.classList.remove("pop"),
          { once: true },
        );
        toggleTodo(Number(checkBtn.dataset.check));
        return;
      }

      const removeBtn = e.target.closest("[data-remove]");
      if (removeBtn) {
        removeTodo(Number(removeBtn.dataset.remove), removeBtn.closest("li"));
      }
    };

    el.addEventListener("click", onClick);

    const unsubscribe = todosStore.subscribe(render);

    render();

    return {
      cleanup() {
        el.removeEventListener("click", onClick);
        unsubscribe();
      },
    };
  });
}
