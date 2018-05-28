import logger from 'winston';

// To see more detailed messages, uncomment the following line
// logger.level = 'debug';

function setup() {
  return (context) => {
    // This debugs the service call and a stringified version of the hook context
    // You can customize the mssage (and logger) to your needs
    logger.debug(`${context.type} app.service('${context.path}').${context.method}()`);

    if (typeof context.toJSON === 'function') {
      logger.debug('Hook Context', JSON.stringify(context, null, '  '));
    }

    if (context.error) {
      logger.error(context.error);
    }
  };
}

export default setup;
