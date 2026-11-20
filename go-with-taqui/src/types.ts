export type TrackIconName =
  | 'book'
  | 'code'
  | 'cpu'
  | 'terminal'
  | 'database'
  | 'layers'
  | 'cloud'
  | 'sparkles';

export type LabType =
  | 'env-vars'
  | 'loops-arrays'
  | 'slices'
  | 'maps'
  | 'pointers'
  | 'interfaces-errors'
  | 'concurrency'
  | 'http-db'
  | 'memory-perf'
  | 'distributed-ai';

export interface Track {
  id: string;
  name: string;
  range: [number, number];
  icon: TrackIconName;
  color: string;
  desc: string;
}

export interface Subtopic {
  code: string;
  title: string;
  anchor: string;
}

export interface SyllabusModule {
  id: number;
  title: string;
  slug: string;
  track: Track;
  subtopics: Subtopic[];
}

export interface QuizQuestion {
  type: string;
  q: string;
  opts: [string, string, string];
  ans: number;
  why: string;
}

export interface ModuleContent {
  summary: string;
  mentalModel: string;
  lab: LabType;
  goCode: string;
  goOut: string;
  lines: [string, string][];
  jsBridge: string;
  pyBridge: string;
  realApp: string;
  mistake: string;
  quiz: QuizQuestion[];
}

export interface AppProgressState {
  completed: Record<number, boolean>;
  completedSubtopics: Record<string, boolean>;
  quizScores: Record<number, { score: number; total: number }>;
  reps: boolean[];
  lastVisitedSlug: string;
}
