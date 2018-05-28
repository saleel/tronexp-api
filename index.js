import 'babel-polyfill';
import logger from 'winston';
import app from './app';

const port = app.get('PORT');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise ', p, reason);
});

server.on('listening', () => {
  logger.info('Server started on port %d', port);
});
