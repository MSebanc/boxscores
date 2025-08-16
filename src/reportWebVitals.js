const PERFORMANCE_METRICS = ['getCLS', 'getFID', 'getFCP', 'getLCP', 'getTTFB'];

const isValidCallback = (callback) =>
    callback && callback instanceof Function;

const loadWebVitalsModule = async () => {
  try {
    return await import('web-vitals');
  } catch (error) {
    console.error('Failed to load web-vitals module:', error);
    return null;
  }
};

const executeMetricCallback = (metricFunction, callback) => {
  try {
    metricFunction(callback);
  } catch (error) {
    console.error('Error executing metric callback:', error);
  }
};

const collectAllMetrics = (webVitalsModule, callback) => {
  PERFORMANCE_METRICS.forEach(metricName => {
    const metricFunction = webVitalsModule[metricName];
    if (metricFunction) {
      executeMetricCallback(metricFunction, callback);
    }
  });
};

const reportWebVitals = async (onPerfEntry) => {
  if (!isValidCallback(onPerfEntry)) return;

  const webVitalsModule = await loadWebVitalsModule();
  if (!webVitalsModule) return;

  collectAllMetrics(webVitalsModule, onPerfEntry);
};

export default reportWebVitals;