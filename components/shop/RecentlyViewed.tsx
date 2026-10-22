"use client";

import { useEffect, useRef, useState } from "react";
import { useShop } from "./CartProvider";
import { ProductGrid } from "./ProductGrid";

/**
 * Records this pack as viewed and lists the other packs this visitor opened
 * before (kept in their browser only). Renders nothing for a first visit.
 */
export function RecentlyViewed({ current }: { current: string }) {
  const { t, catalog, recent, viewed, ready } = useShop();
  // Snapshot before recording this view, so the list doesn't reshuffle under the reader.
  const [ids, setIds] = useState<string[] | null>(null);
  const done = useRef(false);

  useEffect(() => {
    // Child effects run before the provider's, so wait until it has loaded the stored history.
    if (!ready || done.current) return;
    done.current = true;
    setIds(recent.filter((id) => id !== current));
    viewed(current);
  }, [ready, current, recent, viewed]);

  const items = (ids ?? []).flatMap((id) => catalog.filter((i) => i.id === id)).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="container-page py-16 sm:py-20">
      <h2 className="heading text-3xl text-forest-900">{t.recent}</h2>
      <div className="mt-8">
        <ProductGrid items={items} reveal={false} />
      </div>
    </section>
  );
}
