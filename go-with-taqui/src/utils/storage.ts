import type { AppProgressState } from '../types';

export const STORAGE_KEY = 'go_with_taqui_state_v1';

const DEFAULT_STATE: AppProgressState = {
  completed: {},
  completedSubtopics: {},
  quizScores: {},
  reps: [false, false, false, false, false],
  lastVisitedSlug: 'go-development-environment',
};

export function loadProgressState(): AppProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        completed: parsed.completed && typeof parsed.completed === 'object' ? parsed.completed : {},
        completedSubtopics:
          parsed.completedSubtopics && typeof parsed.completedSubtopics === 'object'
            ? parsed.completedSubtopics
            : {},
        quizScores:
          parsed.quizScores && typeof parsed.quizScores === 'object' ? parsed.quizScores : {},
        reps:
          Array.isArray(parsed.reps) && parsed.reps.length === 5
            ? parsed.reps.map(Boolean)
            : [false, false, false, false, false],
        lastVisitedSlug:
          typeof parsed.lastVisitedSlug === 'string' && parsed.lastVisitedSlug.length > 0
            ? parsed.lastVisitedSlug
            : 'go-development-environment',
      };
    }
  } catch {
    // Ignore storage read errors in restricted iframes
  }
  return { ...DEFAULT_STATE };
}

export function saveProgressState(state: AppProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage write errors
  }
}
