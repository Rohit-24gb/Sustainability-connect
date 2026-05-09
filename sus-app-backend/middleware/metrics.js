const metrics = {
  startedAt: new Date(),
  totalRequests: 0,
  statusCodes: {},
  routes: {}
};

const metricsMiddleware = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    metrics.totalRequests += 1;
    metrics.statusCodes[res.statusCode] = (metrics.statusCodes[res.statusCode] || 0) + 1;

    const key = `${req.method} ${req.route?.path || req.path}`;
    const route = metrics.routes[key] || { count: 0, totalDurationMs: 0 };
    route.count += 1;
    route.totalDurationMs += Date.now() - startedAt;
    metrics.routes[key] = route;
  });

  next();
};

const getMetrics = () => ({
  uptimeSeconds: Math.round(process.uptime()),
  startedAt: metrics.startedAt,
  totalRequests: metrics.totalRequests,
  statusCodes: metrics.statusCodes,
  routes: Object.fromEntries(
    Object.entries(metrics.routes).map(([key, value]) => [
      key,
      {
        count: value.count,
        avgDurationMs: Math.round(value.totalDurationMs / value.count)
      }
    ])
  )
});

module.exports = { metricsMiddleware, getMetrics };
