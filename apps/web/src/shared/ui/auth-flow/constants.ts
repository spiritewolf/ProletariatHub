/** Total segments in the auth flow progress bar (must match product copy). */
export const AUTH_FLOW_TOTAL_STEPS = 4;

export const AUTH_FLOW_STEP_NUMBERS: readonly number[] = Array.from(
  { length: AUTH_FLOW_TOTAL_STEPS },
  (_, index) => index + 1,
);
