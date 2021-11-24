import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  // defaultMeta: { service: 'your-service-name' },
  transports: [new transports.File({ filename: 'error.log', level: 'error' })],
});

// TODO: this should not be used as a side effice
// put this into a class init or something similar or handle it in another place
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
