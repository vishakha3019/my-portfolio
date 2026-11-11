import type { CSSProperties } from 'react'
import type { MockKind } from '../../content/projects'

// Illustrative interfaces that suggest what each kind of app does. Not production screenshots.
type P = { hue: string; on: boolean }
const bar = 'rounded-[3px] bg-ivory/10'

export function Mock({ kind, hue, on }: { kind: MockKind } & P) {
  const style = { '--hue': hue, animationPlayState: on ? 'running' : 'paused' } as CSSProperties
  const Inner = mocks[kind]
  return (
    <div className="absolute inset-0 grid p-4 text-[10px] [&_*]:[animation-play-state:inherit]" style={style}>
      <Inner hue={hue} on={on} />
    </div>
  )
}

const mocks: Record<MockKind, (p: P) => React.ReactElement> = {
  delivery: ({ hue }) => (
    <div className="grid grid-cols-[22%_1fr_30%] gap-3">
      <div className="space-y-2">
        {['Admin', 'Driver', 'Customer'].map((r, i) => (
          <div key={r} className="rounded-md px-2 py-1.5 font-mono" style={{ background: i === 0 ? hue : 'rgb(255 255 255 / .05)', color: i === 0 ? '#070708' : undefined }}>
            {r}
          </div>
        ))}
        <div className={`${bar} h-16`} />
      </div>
      <div className="relative overflow-hidden rounded-md bg-[#141418]">
        <svg viewBox="0 0 200 140" className="absolute inset-0 size-full">
          <path id="route" d="M20 120 C 60 120, 50 60, 100 60 S 150 20, 180 24" fill="none" stroke={hue} strokeWidth="1.5" strokeDasharray="4 4" />
          <circle r="4" fill={hue}>
            <animateMotion dur="5s" repeatCount="indefinite">
              <mpath href="#route" />
            </animateMotion>
          </circle>
          <circle cx="180" cy="24" r="5" fill="none" stroke="#ede8de" />
        </svg>
      </div>
      <div className="space-y-2">
        {['Order #2041', 'Order #2042', 'Order #2043'].map((o, i) => (
          <div key={o} className="rounded-md bg-ivory/5 p-2 [animation:blink-in_6s_infinite]" style={{ animationDelay: `${i * 0.6}s` }}>
            <div className="font-mono">{o}</div>
            <div className="mt-1 inline-block rounded px-1.5 py-0.5 text-[9px]" style={{ background: hue, color: '#070708' }}>
              {['Preparing', 'On the way', 'Delivered'][i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  vitals: ({ hue }) => (
    <div className="grid grid-cols-2 gap-4">
      {[
        { k: 'LCP', from: '4.5s', to: '2.3s', pct: 0.51 },
        { k: 'CLS', from: '0.25', to: '0.08', pct: 0.32 },
      ].map((m) => (
        <div key={m.k} className="flex flex-col items-center justify-center rounded-md bg-ivory/5 p-3">
          <svg viewBox="0 0 100 60" className="w-4/5">
            <path d="M10 55 A 40 40 0 0 1 90 55" fill="none" stroke="rgb(255 255 255 / .1)" strokeWidth="8" strokeLinecap="round" />
            <path d="M10 55 A 40 40 0 0 1 90 55" fill="none" stroke={hue} strokeWidth="8" strokeLinecap="round" pathLength={1} strokeDasharray={`${m.pct} 1`} />
          </svg>
          <div className="mt-1 font-mono text-[11px] text-silver">{m.k}</div>
          <div className="text-xl font-bold" style={{ color: hue }}>
            {m.to}
          </div>
          <div className="font-mono text-silver line-through">{m.from}</div>
        </div>
      ))}
      <div className="col-span-2 space-y-1.5">
        {[0.9, 0.7, 0.55, 0.8].map((w, i) => (
          <div key={i} className="h-2 origin-left rounded-full [animation:shrink_3s_var(--ease-expo)_infinite_alternate]" style={{ width: `${w * 100}%`, background: i % 2 ? hue : 'rgb(255 255 255 / .15)', '--to': 0.5 } as CSSProperties} />
        ))}
      </div>
    </div>
  ),
  board: ({ hue }) => (
    <div className="grid grid-cols-3 gap-2">
      {['To do', 'In progress', 'Done'].map((c) => (
        <div key={c} className="space-y-2 rounded-md bg-ivory/5 p-2">
          <div className="font-mono text-silver">{c}</div>
          <div className={`${bar} h-8`} />
          <div className={`${bar} h-8`} />
        </div>
      ))}
      <div className="col-span-3 -mt-[46%] w-[calc((100%-16px)/3)] px-2 [animation:hop_6s_var(--ease-expo)_infinite]">
        <div className="rounded-md p-2 font-mono text-[#070708]" style={{ background: hue }}>
          Timesheet · 6h
        </div>
      </div>
    </div>
  ),
  map: ({ hue }) => (
    <div className="grid grid-cols-[1fr_32%] gap-3">
      <div className="relative overflow-hidden rounded-md bg-[#141418] [background-image:linear-gradient(rgb(255_255_255/.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/.04)_1px,transparent_1px)] [background-size:22px_22px]">
        {[
          [24, 30],
          [62, 52],
          [40, 74],
        ].map(([x, y], i) => (
          <span key={i} className="absolute size-2.5 rounded-full" style={{ left: `${x}%`, top: `${y}%`, background: hue }}>
            <span className="absolute inset-0 rounded-full [animation:ping_2s_infinite]" style={{ background: hue, animationDelay: `${i * 0.5}s` }} />
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {['Employees', 'Projects', 'Equipment', 'Tasks'].map((r) => (
          <div key={r} className="flex items-center justify-between rounded-md bg-ivory/5 px-2 py-1.5">
            <span>{r}</span>
            <span className="size-1.5 rounded-full" style={{ background: hue }} />
          </div>
        ))}
      </div>
    </div>
  ),
  chat: ({ hue }) => (
    <div className="grid grid-cols-[26%_1fr] gap-3">
      <div className="space-y-2">
        <div className={`${bar} h-6`} />
        <div className={`${bar} h-6`} />
        <div className={`${bar} h-6`} />
      </div>
      <div className="flex flex-col justify-end gap-2 rounded-md bg-ivory/5 p-3">
        {['Hi! How can I help?', 'Track my order', 'Here is the latest status.'].map((m, i) => (
          <div
            key={m}
            className={`max-w-[70%] rounded-xl px-3 py-2 [animation:blink-in_6s_infinite] ${i === 1 ? 'self-end text-[#070708]' : 'bg-ivory/10'}`}
            style={{ animationDelay: `${i * 0.9}s`, background: i === 1 ? hue : undefined }}
          >
            {m}
          </div>
        ))}
      </div>
    </div>
  ),
  shop: ({ hue }) => (
    <div className="grid grid-rows-[auto_1fr] gap-3">
      <div className="flex items-center justify-between">
        <div className={`${bar} h-3 w-24`} />
        <span className="rounded-full px-2 py-0.5 font-mono text-[#070708] [animation:bump_2.4s_infinite]" style={{ background: hue }}>
          Cart 3
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-md bg-ivory/5 p-2">
            <div className="aspect-square rounded" style={{ background: i === 1 ? hue : 'rgb(255 255 255 / .06)', opacity: i === 1 ? 0.8 : 1 }} />
            <div className={`${bar} mt-2 h-1.5 w-3/4`} />
          </div>
        ))}
      </div>
    </div>
  ),
}
