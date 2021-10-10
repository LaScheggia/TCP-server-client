// Including Nodejs' net module and json scheme validator.
const net = require("net");
const Ajv = require("ajv");
const winston = require('winston');

//Importing requests to be sent to server
const commandSuccess = require("./commands/success.json");
const commandError = require("./commands/error.json");

//Ajv instance △
const ajv = new Ajv();
const eventSchema = require("./schemas/event.json");

//Selecting the port connection
const options = {
  port: process.env.CLIENT_TCP_PORT,
};

//Add winston logger instance with custom format
const logFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({ label: 'tcp-client' }),
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'client.log' }),
  ],
});

//Connection
let client = net.connect(options, () => {
  client.on('end', () => {
    logger.info('Disconnected from server');
  });

  client.on('error', error => {
    logger.error(`An error was encountered: ${error}`);
  });

  client.on('data', data => {
    logger.info("Received message from server");
    const event = JSON.parse(data.toString("utf8"));
    
    if (ajv.validate(eventSchema, event)) {
      const error = event.event.payload.error;

      if (error !== null) {
        logger.error(`The command encountered an error: ${error}`);
      } else {
        logger.info(`The result is: ${event.event.payload.result}`);
      }
    } else {
      logger.error('The schema is not validated');
    }
  });

  logger.error('Connected to Server!');
  
  //Sending json stringified to server
  logger.info('Sending command success to server');
  client.write(JSON.stringify(commandSuccess));

  logger.info('Sending command error to server');
  client.write(JSON.stringify(commandError));
});

