/**
 * TooltipPlugin
 *
 * Registers a custom `data-tooltip` binding directive.
 * Any element with data-tooltip="Some text" gets a native title + aria-label.
 *
 * Ion feature used: App.use(), PluginContext.registerBinding()
 *
 * @type {import('@matheusmntt/ion').Plugin}
 */
export const TooltipPlugin = {
  install(ctx) {
    ctx.registerBinding("data-tooltip", (el, expression) => {
      el.setAttribute("title", expression);
      el.setAttribute("aria-label", expression);
    });
  },
};
