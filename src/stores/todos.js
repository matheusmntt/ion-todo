import { App } from "@matheusmntt/ion";

/**
 * todos store — domain state.
 *
 * Holds the task list and the active filter.
 * All derived values are computed properties: they are cached and only
 * recalculated when their dependencies change.
 *
 * Ion feature used: App.store() with computed option.
 */
export const todosStore = App.store(
  "todos",
  {
    items: [],
    filter: "all",
  },
  {
    computed: {
      /** Total number of tasks */
      totalCount: (s) => s.items.length,

      /** Number of completed tasks */
      doneCount: (s) => s.items.filter((i) => i.done).length,

      /** Number of pending tasks */
      pendingCount: (s) => s.items.filter((i) => !i.done).length,

      /** Number of high-priority pending tasks */
      highPriorityCount: (s) =>
        s.items.filter((i) => i.priority === "high" && !i.done).length,

      /** True when there is at least one high-priority pending task */
      hasHighPriority: (s) =>
        s.items.some((i) => i.priority === "high" && !i.done),

      /** True when there is at least one completed task */
      hasDone: (s) => s.items.some((i) => i.done),

      /** True when the task list is empty */
      isEmpty: (s) => s.items.length === 0,

      /** Completion percentage (0–100) */
      progress: (s) =>
        s.items.length === 0
          ? 0
          : Math.round(
              (s.items.filter((i) => i.done).length / s.items.length) * 100,
            ),

      /**
       * The subset of items to display given the active filter.
       * Consumed by the TodoList component to know what to render.
       */
      filtered: (s) => {
        if (s.filter === "pending") return s.items.filter((i) => !i.done);
        if (s.filter === "done") return s.items.filter((i) => i.done);
        if (s.filter === "high")
          return s.items.filter((i) => i.priority === "high");
        return s.items;
      },
    },
  },
);
