const env = () => {
  const envValues = process.env;
  return {
    baseUrl: envValues['BASE_URL'],
  };
};

export { env };
