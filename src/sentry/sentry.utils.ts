const getSamples = () => ({
  'api/back-office': +process.env.SENTRY_BACKOFFICE_TRACES_SAMPLE_RATE || 0,
  'api/mobile': +process.env.SENTRY_MOBILE_TRACES_SAMPLE_RATE || 0,
  '/health': 0,
  default: 1,
});

export const sampler: (url: string) => number = (url) => {
  const sampleKeys = Object.keys(getSamples());
  const index = sampleKeys.findIndex((key) => url.includes(key));
  const result =
    index === -1 ? getSamples().default : getSamples()[sampleKeys[index]];
  console.log(
    url,
    getSamples()[sampleKeys[index]],
    Math.trunc(new Date().getTime() / 1000),
  );
  return result;
};
