"use client";

// Resizable Studio columns (react-resizable-panels). A view renders its columns as
// <Pane>s with a <PaneHandle> between them, inside the <Panes> group Studio puts
// after the nav rail; each view remembers its own column widths in this browser.
import type { ComponentProps } from "react";
import { Group, Panel, Separator, useDefaultLayout, type LayoutStorage } from "react-resizable-panels";

// localStorage can be missing or throw (private mode, blocked storage): sizes then just aren't remembered.
const storage: LayoutStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
};

/** The columns of one Studio view; `id` keys its remembered layout. Remount (key) when the set of columns changes. */
export function Panes({ id, children }: { id: string; children: React.ReactNode }) {
  const layout = useDefaultLayout({ id: `vsap-studio:${id}`, storage, onlySaveAfterUserInteractions: true });
  return (
    <Group
      id={`studio-${id}`}
      orientation="horizontal"
      defaultLayout={layout.defaultLayout}
      onLayoutChanged={layout.onLayoutChanged}
      // While a handle is dragged the preview iframe must not swallow the pointer.
      className="min-h-0 min-w-0 flex-1 [&:has([data-separator=active])_iframe]:pointer-events-none"
    >
      {children}
    </Group>
  );
}

type PaneProps = Omit<ComponentProps<typeof Panel>, "className"> & { className?: string };

/**
 * One column. Sizes take CSS units ("18rem"); a column with `fill` takes what the
 * others leave and absorbs window resizes, the rest keep their width.
 */
export function Pane({ className = "", fill = false, ...props }: PaneProps & { fill?: boolean }) {
  return <Panel groupResizeBehavior={fill ? "preserve-relative-size" : "preserve-pixel-size"} className={`flex h-full min-h-0 flex-col ${className}`} {...props} />;
}

/** Drag handle between two columns: a hairline that turns green on hover/drag; double-click resets. */
export function PaneHandle() {
  return (
    <Separator className="relative w-px bg-mist-200 outline-none transition-colors data-[separator=active]:bg-forest-600 data-[separator=hover]:bg-forest-600 focus-visible:bg-forest-600 after:absolute after:inset-y-0 after:-inset-x-1 after:content-[''] data-[separator=active]:after:bg-forest-600/15 data-[separator=hover]:after:bg-forest-600/10" />
  );
}
