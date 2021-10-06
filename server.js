// Including Nodejs' net module.
const net = require("net");

//This is server's listening port
const port = 8080;

//Creating server with net.createServer
let server = net.createServer(socket => {
  socket.on('data', data => {
    // do something with data
    console.log(data.toString("utf8"));
  });
});

//Putting the server on listen
server.listen(port, () => {
  
  console.log(`Server listening for connection requests on socket localhost:${port}.`);
});