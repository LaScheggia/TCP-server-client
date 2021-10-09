// Including Nodejs' net module.
const net = require("net"); 

const command_success = require("./command_success.json");

//Selecting the port connection
const options = {
  port: process.env.CLIENT_TCP_PORT,
};

//Connection
let client = net.connect(options, () => {
  client.on('end', () => {
    console.log('Disconnected from server');
  })

  client.on('data', data => {
    const commandRes = JSON.parse(data.toString("utf8"));
    const sumRes = commandRes.examples[0].event.payload.result;

    console.log(sumRes);
    client.destroy();
  });

  console.log('Connected to Server!');
  
  //Sending json stringified to server
  client.write(JSON.stringify(command_success));
});

