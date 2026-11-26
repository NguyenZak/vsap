"use client";

// Resizable Studio columns (react-resizable-panels). A view renders its columns as
// <Pane>s with a <PaneHandle> between them, inside the <Panes> group Studio puts
// after the nav rail; each view remembers its own column widths in this browser.
//
// Below 1024px (phones, portrait tablets) the same markup turns into one column at a
// time: <Panes> shows a tab bar (Danh sách / Chỉnh sửa / Xem trước…) and only the
// active <Pane>; views call useMobilePane().show("editor") when an item is picked.
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ComponentProps } from "react";
import { Group, Panel, Separator, useDefaultLayout, type LayoutStorage } from "react-resizable-panels";

const MOBILE_QUERY = "(max-width: 1023px)";

/** True below 1024px. False during the first render, then follows the window width. */
export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

const MobileContext = createContext(false);
/** Studio puts the result of useIsMobile() here so every Pane agrees. */
export const MobileProvider = MobileContext.Provider;
export const useMobile = () => useContext(MobileContext);

type PaneGroup = { active: string | null; register: (id: string) => () => void; show: (id: string) => void };
const GroupContext = createContext<PaneGroup | null>(null);

/** In the phone layout, switch the nearest group of columns to `id` (no-op on desktop). */
export function useMobilePane() {
  const group = useContext(GroupContext);
  return useMemo(() => ({ show: (id: string) => group?.show(id) }), [group]);
}

const PANE_LABELS: Record<string, string> = { list: "Danh sách", editor: "Chỉnh sửa", detail: "Chi tiết", preview: "Xem trước" };

type Controlled = { mobileActive?: string | null; onMobileActive?: (id: string) => void };

function MobilePanes({ children, mobileActive, onMobileActive }: { children: React.ReactNode } & Controlled) {
  const [ids, setIds] = useState<string[]>([]);
  const [own, setOwn] = useState<string | null>(null);
  const wanted = mobileActive !== undefined ? mobileActive : own;
  const setWanted = onMobileActive ?? setOwn;
  const register = useCallback((id: string) => {
    setIds((all) => (all.includes(id) ? all : [...all, id]));
    return () => setIds((all) => all.filter((x) => x !== id));
  }, []);
  const show = useCallback((id: string) => setWanted(id), [setWanted]);
  // Columns keep their markup order; fall back to the first one when the wanted column is not there.
  const active = wanted && ids.includes(wanted) ? wanted : (ids[0] ?? null);
  const group = useMemo(() => ({ active, register, show }), [active, register, show]);
  return (
    <GroupContext.Provider value={group}>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {ids.length > 1 && (
          <div role="tablist" className="flex shrink-0 gap-1 border-b border-mist-200 bg-white px-2 py-1.5">
            {ids.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={id === active}
                onClick={() => setWanted(id)}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition ${id === active ? "bg-forest-900 text-white" : "text-ink-600 hover:bg-mist-100"}`}
              >
                {PANE_LABELS[id] ?? id}
              </button>
            ))}
          </div>
        )}
        {children}
      </div>
    </GroupContext.Provider>
  );
}

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
export function Panes({ id, children, ...controlled }: { id: string; children: React.ReactNode } & Controlled) {
  return useMobile() ? <MobilePanes {...controlled}>{children}</MobilePanes> : <DesktopPanes id={id}>{children}</DesktopPanes>;
}

function DesktopPanes({ id, children }: { id: string; children: React.ReactNode }) {
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
  const group = useContext(GroupContext);
  if (group) return <MobilePane id={String(props.id)} group={group} className={className}>{props.children}</MobilePane>;
  return <Panel groupResizeBehavior={fill ? "preserve-relative-size" : "preserve-pixel-size"} className={`flex h-full min-h-0 flex-col ${className}`} {...props} />;
}

function MobilePane({ id, group, className, children }: { id: string; group: PaneGroup; className: string; children: React.ReactNode }) {
  const { register } = group;
  useLayoutEffect(() => register(id), [id, register]);
  return (
    <div data-pane={id} hidden={group.active !== id} className={`min-h-0 min-w-0 flex-1 flex-col [&:not([hidden])]:flex ${className}`}>
      {children as React.ReactNode}
    </div>
  );
}

/** Drag handle between two columns: a hairline that turns green on hover/drag; double-click resets. */
export function PaneHandle() {
  if (useContext(GroupContext)) return null;
  return (
    <Separator className="relative w-px bg-mist-200 outline-none transition-colors data-[separator=active]:bg-forest-600 data-[separator=hover]:bg-forest-600 focus-visible:bg-forest-600 after:absolute after:inset-y-0 after:-inset-x-1 after:content-[''] data-[separator=active]:after:bg-forest-600/15 data-[separator=hover]:after:bg-forest-600/10" />
  );
}
