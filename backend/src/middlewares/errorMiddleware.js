export function errorMiddleware(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Ocurrió un error interno.';

  res.status(statusCode).json({ error: message });
}
