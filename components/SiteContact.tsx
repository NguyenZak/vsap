"use client";

import { createContext, useContext } from "react";
import { site } from "@/lib/site";

type Contact = { phone: string; phoneE164: string; email: string };

// The built-in values are only the fallback for global-error, which renders
// without the layout (and so without the CMS) when the layout itself failed.
const SiteContactContext = createContext<Contact>({ phone: site.phone, phoneE164: site.phoneE164, email: site.email });

/** Hands the CMS contact details to client-only screens such as not-found/error. */
export function SiteContactProvider({ value, children }: { value: Contact; children: React.ReactNode }) {
  return <SiteContactContext.Provider value={value}>{children}</SiteContactContext.Provider>;
}

export const useSiteContact = () => useContext(SiteContactContext);
