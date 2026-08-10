const rankKeys = {
  all: ['rank'] as const,
  pl: () => [...rankKeys.all, 'premierLeague'] as const,
};

export { rankKeys };
