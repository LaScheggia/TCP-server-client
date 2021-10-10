// Including Nodejs' net module and json scheme validator.
const net = require("net");
const Ajv = require("ajv");
const winston = require('winston');

//Loading server config
const config = require("./driver_config.json");

//Ajv instance ⧈
const ajv = new Ajv();
const commandSchema = require("./schemas/command.json");

//Add winston logger instance with custom format
const logFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({ label: 'tcp-server' }),
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' }),
  ],
});

//Creating a func to sum
function sumNumbers(x, y) {
  return x + y;
}

//Creating server with net.createServer
let server = net.createServer(socket => {
  logger.info('Client connected');

  socket.on('end', () => {
    logger.info('Client disconnected');
  });

  socket.on('error', error => {
    logger.error(`An error was encountered: ${error}`);
  });

  socket.on('data', data => {
    logger.info("Received message from client");
    const command = JSON.parse(data.toString("utf8"));

    let event = null;

    if (ajv.validate(commandSchema, command)) {
      logger.info("Received valid command from client");
      const sum = sumNumbers(command.command.payload.x, command.command.payload.y);
      event = {
        event: {
          type: command.command.type,
          payload: {
            result: sum,
            error: null
          }
        }
      };      
    } else {
      logger.error("Received invalid command from client");
      event = {
        event: {
          type: "EVENT_ERROR_COMMAND",
          payload: {
            result: 0,
            error: "Command not recognized"
          }
        }
      };
    }

    logger.info("Sending response to client");
    socket.write(JSON.stringify(event));
  });
});

//Putting the server on listen
server.listen(config.port, () => {
  logger.info(`Server listening for connection requests on socket localhost:${config.port}.`);
});

