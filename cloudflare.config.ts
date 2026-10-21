import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "vsap-web",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-16",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      // CMS: content documents + revisions (D1) and uploaded images (R2).
      DB: bindings.d1({ name: "vsap-cms" }),
      MEDIA: bindings.r2({ name: "vsap-media" }),
      // Admin login. Locally from .dev.vars; in production: npx cf workers secrets update ADMIN_PASSWORD
      ADMIN_PASSWORD: bindings.secret(),
      ADMIN_SESSION_SECRET: bindings.secret(),
    },
  }),
});
