const seasonKeys = {
  all: ['season'] as const,
  current: () => [...seasonKeys.all, 'current'] as const,
};

export { seasonKeys };
