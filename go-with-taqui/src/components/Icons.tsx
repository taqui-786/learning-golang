import React from 'react';
import type { TrackIconName } from '../types';

export type IconName =
  | TrackIconName
  | 'home'
  | 'compass'
  | 'award'
  | 'menu'
  | 'close'
  | 'search'
  | 'arrowLeft'
  | 'arrowRight'
  | 'chevronRight'
  | 'chevronDown'
  | 'check'
  | 'checkCircle'
  | 'copy'
  | 'external'
  | 'alert'
  | 'play'
  | 'refresh'
  | 'bulb'
  | 'shield'
  | 'list'
  | 'zap'
  | 'lock'
  | 'unlock'
  | 'star';

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M9 7h6M9 11h6" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5,8.5 13.5,13.5 8.5,15.5 10.5,10.5" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.2 7 21l5-2.5L17 21l-1.5-6.8" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  check: <path d="M5 12.5 9.5 17 19 7.5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  external: (
    <>
      <path d="M15 4h5v5" />
      <path d="M10 14 20 4" />
      <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </>
  ),
  code: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 5-3 14" />
    </>
  ),
  cpu: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </>
  ),
  cloud: (
    <path d="M7 18h10a4 4 0 0 0 .8-7.92A5.5 5.5 0 0 0 7.2 8.4 3.5 3.5 0 0 0 7 18Z" />
  ),
  sparkles: (
    <>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="m7 9 3 3-3 3" />
      <path d="M12.5 15H17" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 3 19h18L12 4Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.8" r="0.6" fill="currentColor" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </>
  ),
  play: <polygon points="7,5 19,12 7,19" />,
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0 2 5.3" />
      <path d="M20 4v7h-7" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.7.5 1 1.2 1 2.1h5c0-.9.3-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.8 3 7.8 7 9 4-1.2 7-4.2 7-9V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.5-3.8" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </>
  ),
  zap: <path d="M13 2 5 13h6l-1 9 9-12h-6l0-8Z" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.4-2" />
    </>
  ),
  star: (
    <polygon points="12,2.5 14.9,8.4 21.4,9.3 16.7,13.9 17.8,20.4 12,17.3 6.2,20.4 7.3,13.9 2.6,9.3 9.1,8.4" />
  ),
};

interface SketchIconProps {
  name: IconName;
  className?: string;
}

export function SketchIcon({ name, className = 'w-4 h-4' }: SketchIconProps) {
  return (
    <svg
      className={`${className} inline-block shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export function GopherBrandMark({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="36" height="36" rx="9" fill="#53B7BE" stroke="#222" strokeWidth="2.8" />
      <circle cx="16" cy="18" r="4.5" fill="#FFFDF7" stroke="#222" strokeWidth="2.2" />
      <circle cx="28" cy="18" r="4.5" fill="#FFFDF7" stroke="#222" strokeWidth="2.2" />
      <circle cx="17" cy="18" r="1.8" fill="#222" />
      <circle cx="29" cy="18" r="1.8" fill="#222" />
      <ellipse cx="22" cy="25" rx="4" ry="2.6" fill="#F9EE75" stroke="#222" strokeWidth="2" />
      <path d="M19 28 v4 h3 v-4 M22 28 v4 h3 v-4" fill="#FFFDF7" stroke="#222" strokeWidth="1.8" />
    </svg>
  );
}

export function MiniSketchnoteBookCover({
  completedCount,
  totalCount,
}: {
  completedCount: number;
  totalCount: number;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[270px] select-none">
      {/* Stacked sketchbook pages shadow */}
      <div
        className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl border-[2.6px] border-ink bg-yellowHi"
        aria-hidden="true"
      />
      {/* Main Pocket Book Cover */}
      <div className="relative rounded-2xl border-[2.6px] border-ink bg-tealInk p-5 text-ink shadow-[4px_4px_0px_#222]">
        {/* Spine binding holes */}
        <div className="absolute left-2.5 top-5 bottom-5 flex flex-col justify-between" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className="w-2.5 h-2.5 rounded-full bg-paper border-2 border-ink" />
          ))}
        </div>

        <div className="pl-4 space-y-3">
          <div className="font-mono text-[11px] font-bold tracking-wide text-ink/85">
            POCKET SKETCHBOOK EDITION
          </div>

          <div className="bg-paper border-[2.4px] border-ink rounded-xl p-3.5 text-center shadow-[3px_3px_0px_#222]">
            <div className="flex justify-center mb-2">
              <GopherBrandMark className="w-12 h-12" />
            </div>
            <div className="font-display font-extrabold text-2xl leading-tight text-ink">
              Go with taqui
            </div>
            <div className="mt-1 text-sm text-ink/75 font-hand">
              Zero to Agentic Systems
            </div>
          </div>

          <div className="flex items-center justify-between bg-yellowHi border-2 border-ink rounded-xl px-3 py-2 font-mono text-xs font-bold tabular-nums">
            <span>MODULES 0–54</span>
            <span>
              {completedCount}/{totalCount}
            </span>
          </div>

          <div className="text-xs font-display font-bold text-ink/90 text-center">
            Visual Notes · Labs · Quizzes
          </div>
        </div>
      </div>
    </div>
  );
}
