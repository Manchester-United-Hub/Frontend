const matchesKeys = {
  all: ['matches'] as const,
  schedules: () => [...matchesKeys.all, 'schedule'] as const,
};

export { matchesKeys };
