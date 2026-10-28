import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { staticAssetsAdapter } from "@vinext/cloudflare/cache/static-assets-adapter";

export default defineConfig({
  environments: {
    // Dev only: pre-bundled into the server-components environment, vinext's next/link and
    // next/navigation skip the "use client" handling and crash with "createContext is not a function".
    rsc: { optimizeDeps: { exclude: ["next/link", "next/navigation"] } },
  },
  plugins: [
    vinext({
      // Pages render per request from CMS content (lib/cms/store.ts), so nothing is prerendered.
      cache: { cdn: staticAssetsAdapter() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
