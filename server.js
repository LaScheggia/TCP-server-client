// Including Nodejs' net module and json scheme validator.
const net = require("net");
const Ajv = require("ajv");

//Loading server config
const config = require("./driver_config.json");

//Ajv instance ⧈
const ajv = new Ajv();
const commandSchema = require("./schemas/command.json");

//Creating a func to sum
function sumNumbers(x, y){
  return x+y;
}

//Creating server with net.createServer
let server = net.createServer(socket => {
  console.log('Client connected');

  socket.on('end', () => {
    console.log('Client disconnected');
  })

  socket.on('data', data => {
    const command = JSON.parse(data.toString("utf8"));

    let event = null;

    if (ajv.validate(commandSchema, command)) {
      console.log("Received valid command from client");
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
      console.log("Received invalid command from client");
      event = {
        event: {
          type: "UNKNOWN",
          payload: {
            result: 0,
            error: "Command not recognized"
          }
        }
      };
    }

    socket.write(JSON.stringify(event));
  });
});

//Putting the server on listen
server.listen(config.port, () => {
  console.log(`Server listening for connection requests on socket localhost:${config.port}.`);
});

