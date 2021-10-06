// Including Nodejs' net module.
const net = require("net"); 

//Selecting the port connection
const options = {
  port: 8080,

};

//Connection
let client = net.connect(options, () => {
  client.write("sir are u there?");
  console.log("connected!");
});

