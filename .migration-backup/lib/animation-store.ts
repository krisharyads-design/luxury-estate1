export type ExperienceState = {
  progress: number;
  targetX: number;
  targetY: number;
  velocity: number;
  phase: number;
};

export const experienceState: ExperienceState = {
  progress: 0,
  targetX: 0,
  targetY: 0,
  velocity: 0,
  phase: 0
};
