import app from './server';

let serverInstance = null;

export function startServer(done: () => void) {
  const PORT = process.env.PORT || 3002;
  serverInstance = app.listen(PORT, done);
}

export function stopServer(done: () => void) {
  serverInstance.close(done);
}
