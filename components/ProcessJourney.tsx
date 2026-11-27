import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { CmsIcon } from "./cms/Icon";

export type JourneyStep = { icon: string; tag: string; title: string; short: string; body: string };

// Flat illustration palette (an artwork, so it keeps its colours in dark mode too).
const OLIVE = "#66774d";
const TAN = "#a68a64";
const LINE = "#2f3a2a";
const PAPER = "#faf8f2";

const Nut = ({ x, y, rx = 6, ry = 4.5 }: { x: number; y: number; rx?: number; ry?: number }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={TAN} stroke={LINE} strokeWidth={1.6} />
);

/** One drawing per stock step icon; anything else falls back to the icon itself. */
const art: Record<string, ReactNode> = {
  tree: (
    <>
      <rect x={77} y={60} width={6} height={36} rx={1} fill={TAN} />
      <circle cx={63} cy={47} r={16} fill={OLIVE} />
      <circle cx={80} cy={38} r={18} fill={OLIVE} />
      <circle cx={97} cy={47} r={16} fill={OLIVE} />
      <circle cx={71} cy={58} r={13} fill={OLIVE} />
      <circle cx={90} cy={58} r={13} fill={OLIVE} />
      <Nut x={68} y={58} rx={5} ry={4} />
      <Nut x={85} y={45} rx={5} ry={4} />
      <Nut x={97} y={59} rx={5} ry={4} />
    </>
  ),
  basket: (
    <>
      <path d="M58 62 Q58 32 80 32 Q102 32 102 62" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />
      <rect x={50} y={60} width={60} height={32} rx={4} fill={TAN} stroke={LINE} strokeWidth={2.5} />
      <Nut x={61} y={59} />
      <Nut x={74} y={56} />
      <Nut x={87} y={59} />
      <Nut x={99} y={56} />
    </>
  ),
  grade: (
    <>
      {[44, 60, 76].map((y) => [64, 80, 96].map((x) => <Nut key={`${x}-${y}`} x={x} y={y} rx={6.5} ry={4.5} />))}
    </>
  ),
  roast: (
    <>
      {[66, 80, 94].map((x) => (
        <path key={x} d={`M${x} 42 q-5 -6 0 -12 q5 -6 0 -12`} fill="none" stroke={TAN} strokeWidth={2.5} strokeLinecap="round" />
      ))}
      <rect x={54} y={48} width={52} height={44} rx={5} fill={OLIVE} stroke={LINE} strokeWidth={3} />
      <rect x={62} y={58} width={36} height={22} rx={3} fill={PAPER} stroke={LINE} strokeWidth={2.5} />
    </>
  ),
  inspect: (
    <>
      <line x1={85} y1={70} x2={104} y2={90} stroke={LINE} strokeWidth={7} strokeLinecap="round" />
      <circle cx={72} cy={56} r={18} fill={PAPER} stroke={LINE} strokeWidth={5} />
      <Nut x={72} y={56} rx={6} ry={4.5} />
      <path d="M96 38 l6 6 l12 -14" fill="none" stroke={OLIVE} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pack: (
    <>
      <rect x={61} y={32} width={38} height={58} rx={4} fill={OLIVE} stroke={LINE} strokeWidth={2.5} />
      <rect x={67} y={50} width={26} height={18} rx={3} fill={PAPER} stroke={LINE} strokeWidth={2} />
      <Nut x={80} y={59} rx={5} ry={3.5} />
    </>
  ),
  truck: (
    <>
      <rect x={42} y={48} width={56} height={32} rx={3} fill={OLIVE} stroke={LINE} strokeWidth={2.5} />
      <rect x={98} y={58} width={22} height={22} rx={3} fill={TAN} stroke={LINE} strokeWidth={2.5} />
      <circle cx={59} cy={84} r={7} fill={LINE} />
      <circle cx={107} cy={84} r={7} fill={LINE} />
    </>
  ),
  plate: (
    <>
      <ellipse cx={80} cy={62} rx={36} ry={27} fill={PAPER} stroke={LINE} strokeWidth={3} />
      <Nut x={69} y={53} rx={5.5} ry={4} />
      <Nut x={86} y={50} rx={5.5} ry={4} />
      <Nut x={63} y={66} rx={5.5} ry={4} />
      <Nut x={79} y={69} rx={5.5} ry={4} />
      <Nut x={95} y={63} rx={5.5} ry={4} />
    </>
  ),
};

const iconArt: Record<string, keyof typeof art> = {
  sprout: "tree",
  trees: "tree",
  "tree-deciduous": "tree",
  leaf: "tree",
  wheat: "basket",
  "shopping-basket": "basket",
  "scan-search": "grade",
  "layout-grid": "grade",
  factory: "roast",
  flame: "roast",
  "shield-check": "inspect",
  search: "inspect",
  microscope: "inspect",
  "package-check": "pack",
  package: "pack",
  truck: "truck",
  ship: "truck",
  heart: "plate",
  utensils: "plate",
  "hand-heart": "plate",
};

function Illustration({ icon }: { icon: string }) {
  const drawing = art[iconArt[icon]];
  return (
    <div aria-hidden="true" className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#f1ebdf] sm:aspect-[16/9] dark:bg-mist-100">
      {drawing ? (
        <svg viewBox="0 0 160 120" className="h-full w-auto">
          <circle cx={80} cy={60} r={46} fill="#e2e5d4" />
          {drawing}
        </svg>
      ) : (
        <span className="grid size-[62%] max-h-24 max-w-24 place-items-center rounded-full bg-[#e2e5d4] text-forest-700">
          <CmsIcon name={icon} className="size-1/2" />
        </span>
      )}
    </div>
  );
}

const num = (i: number) => String(i + 1).padStart(2, "0");
const PER_ROW = 4;

/** The steps again as small numbered boxes, snaking four to a row: 1→4, then 5←8 underneath. */
function Summary({ steps, brand, title }: { steps: JourneyStep[]; brand: string; title: string }) {
  const rows: { step: JourneyStep; i: number }[][] = [];
  steps.forEach((step, i) => {
    if (i % PER_ROW === 0) rows.push([]);
    rows[rows.length - 1].push({ step, i });
  });
  const box = ({ step, i }: { step: JourneyStep; i: number }) => (
    <li key={i} className="flex min-h-20 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#e4e4d4] px-1 py-3 text-center dark:bg-mist-200">
      <span className="grid size-7 place-items-center rounded-full bg-forest-700 text-[11px] lg:text-[10px] font-bold text-white dark:text-forest-950">{num(i)}</span>
      <span className="text-[11px] leading-tight font-semibold text-ink-900 sm:text-xs">{step.short || step.title}</span>
    </li>
  );
  const arrow = (dir: "left" | "right", key: string) => {
    const Icon = dir === "right" ? ArrowRight : ArrowLeft;
    return (
      <li key={key} aria-hidden="true" className="flex w-3 shrink-0 items-center justify-center text-[#8c7a5e] sm:w-8">
        <Icon className="size-3 sm:size-4" strokeWidth={2.5} />
      </li>
    );
  };

  return (
    <div className="mx-auto mt-16 max-w-3xl text-center">
      <p className="heading text-4xl text-forest-700 sm:text-5xl">{brand}</p>
      {title && <p className="heading mt-1 text-lg tracking-wide text-forest-700 uppercase sm:text-2xl">{title}</p>}
      <div className="mt-8 rounded-2xl bg-[#f3efe4] p-3 sm:p-6 dark:bg-mist-100">
        {rows.map((row, r) => {
          const reversed = r % 2 === 1;
          const cells: ReactNode[] = [];
          row.forEach((item, k) => {
            if (k > 0) cells.push(arrow(reversed ? "left" : "right", `a${item.i}`));
            cells.push(box(item));
          });
          // A short last row keeps the boxes under the ones they follow.
          for (let k = row.length; k < PER_ROW; k++) {
            cells.push(<li key={`g${k}`} aria-hidden="true" className="w-3 shrink-0 sm:w-8" />, <li key={`s${k}`} aria-hidden="true" className="flex-1" />);
          }
          if (reversed) cells.reverse();
          const turn = r < rows.length - 1;
          return (
            <div key={r}>
              <ol className="flex items-stretch" aria-label={row.map(({ step, i }) => `${num(i)} ${step.short || step.title}`).join(", ")}>
                {cells}
              </ol>
              {turn && (
                <div aria-hidden="true" className={`flex py-1.5 text-[#8c7a5e] ${reversed ? "justify-start" : "justify-end"}`}>
                  <span className="flex w-[calc((100%-3*0.75rem)/4)] justify-center sm:w-[calc((100%-3*2rem)/4)]">
                    <ArrowDown className="size-3.5 sm:size-4" strokeWidth={2.5} />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * "From farm to table" as a journey: each step is a flat illustration beside its
 * label, title and text, joined by arrows, then the whole route once more as a
 * compact numbered diagram.
 */
export function ProcessJourney({ steps, stepLabel, brand, summary }: { steps: JourneyStep[]; stepLabel: string; brand: string; summary: string }) {
  return (
    <div>
      <ol className="mx-auto max-w-4xl">
        {steps.map((s, i) => (
          <li key={i}>
            {i > 0 && (
              <div aria-hidden="true" className="flex justify-center py-3 text-forest-600 sm:py-4">
                <ArrowDown className="size-5" />
              </div>
            )}
            <div data-reveal className="grid grid-cols-[7rem_1fr] items-center gap-4 sm:grid-cols-[minmax(0,19rem)_1fr] sm:gap-8">
              <Illustration icon={s.icon} />
              <div className="min-w-0">
                <p className="text-[11px] font-medium tracking-wide text-forest-600 uppercase sm:text-xs">
                  {stepLabel} {num(i)}
                  {s.tag && <span> · {s.tag}</span>}
                </p>
                <h3 className="heading mt-1.5 text-lg leading-snug text-heading sm:text-2xl">{s.title}</h3>
                {s.body && <p className="mt-2 text-sm leading-relaxed text-ink-600 sm:text-base">{s.body}</p>}
              </div>
            </div>
          </li>
        ))}
      </ol>
      {steps.length > 1 && <Summary steps={steps} brand={brand} title={summary} />}
    </div>
  );
}
