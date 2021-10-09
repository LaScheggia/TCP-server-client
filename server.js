// Including Nodejs' net module.
const net = require("net");
const { endianness } = require("os");

//Loading server config
const config = require("./driver_config.json");

//Requesting event.json
const event = require("./event.json");

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
    const payload = command.examples[0].command.payload;
    const sumResult = sumNumbers(payload.x, payload.y);
    event.examples[0].event.payload.result = sumResult;

    socket.write(JSON.stringify(event));
    //console.log(command);
    //console.log(payload);
    //console.log(sumResult);
    //console.log(JSON.stringify(event));
  });
});

//Putting the server on listen
server.listen(config.port, () => {
  console.log(`Server listening for connection requests on socket localhost:${config.port}.`);
});

