// Flat card illustrations for highlight cards (imageText, "stacked" layout): a pale
// circle with a simple olive drawing, as in the Sứ mệnh / Tầm nhìn artwork.
// Names are offered in Studio by lib/cms/registry.ts (illustrationOptions).

const C = {
  disc: "#dfe3d0",
  olive: "#6b7a4f",
  line: "#2f3a2a",
  nut: "#c9a982",
  wood: "#a88a6a",
  plate: "#faf8f1",
};

const Nut = ({ x, y, r = 7 }: { x: number; y: number; r?: number }) => (
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill={C.nut} stroke={C.line} strokeWidth={2} />
);

const art: Record<string, React.ReactNode> = {
  truck: (
    <>
      <rect x={56} y={50} width={96} height={52} rx={5} fill={C.olive} stroke={C.line} strokeWidth={3.5} />
      <rect x={154} y={68} width={40} height={34} rx={5} fill={C.wood} stroke={C.line} strokeWidth={3.5} />
      <circle cx={84} cy={106} r={13} fill={C.line} />
      <circle cx={174} cy={106} r={13} fill={C.line} />
    </>
  ),
  "nut-tree": (
    <>
      <rect x={114} y={78} width={12} height={58} fill={C.wood} />
      <circle cx={96} cy={64} r={24} fill={C.olive} />
      <circle cx={144} cy={64} r={24} fill={C.olive} />
      <circle cx={120} cy={42} r={25} fill={C.olive} />
      <circle cx={120} cy={74} r={22} fill={C.olive} />
      <Nut x={120} y={52} />
      <Nut x={102} y={80} />
      <Nut x={142} y={76} />
    </>
  ),
  "quality-check": (
    <>
      <line x1={126} y1={92} x2={152} y2={120} stroke={C.line} strokeWidth={9} strokeLinecap="round" />
      <circle cx={106} cy={72} r={27} fill="none" stroke={C.line} strokeWidth={8} />
      <Nut x={106} y={72} r={8} />
      <polyline points="138,40 146,49 162,30" fill="none" stroke={C.olive} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "nut-plate": (
    <>
      <ellipse cx={120} cy={80} rx={58} ry={42} fill={C.plate} stroke={C.line} strokeWidth={4} />
      <Nut x={100} y={68} />
      <Nut x={128} y={62} />
      <Nut x={146} y={82} />
      <Nut x={96} y={92} />
      <Nut x={124} y={98} />
    </>
  ),
};

export function Illustration({ name, className = "" }: { name: string; className?: string }) {
  const drawing = art[name];
  if (!drawing) return null;
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true" focusable="false">
      <circle cx={120} cy={80} r={64} fill={C.disc} />
      {drawing}
    </svg>
  );
}
