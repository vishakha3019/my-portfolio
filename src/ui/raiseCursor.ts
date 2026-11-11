/**
 * Modal dialogs live in the browser's top layer, above any z-index. The cursor is a popover so it can
 * live there too; re-showing it after a dialog opens puts it back on top.
 */
export function raiseCursor() {
  const el = document.querySelector<HTMLElement>('.cursor')
  if (!el?.showPopover) return
  try {
    if (el.matches(':popover-open')) el.hidePopover()
    el.showPopover()
  } catch {
    // popover unsupported or element detached: the cursor simply stays under the dialog
  }
}
