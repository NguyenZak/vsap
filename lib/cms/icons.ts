// Icons an editor can pick for list items (values, process steps, pillars…).
// Names map to lucide-react components in components/cms/Icon.tsx.
export const iconNames = [
  "badge-check",
  "leaf",
  "handshake",
  "globe",
  "factory",
  "sprout",
  "wheat",
  "scan-search",
  "package-check",
  "ship",
  "target",
  "compass",
  "heart",
  "qr-code",
  "scan-eye",
  "flask",
  "shield-check",
  "file-check",
  "truck",
  "award",
  "sun",
  "droplets",
  "mountain",
  "users",
  "star",
  "message-question",
] as const;

export type IconName = (typeof iconNames)[number];
