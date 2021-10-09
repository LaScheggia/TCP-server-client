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

//Connection
let client = net.connect(options, () => {
  client.on('end', () => {
    console.log('Disconnected from server');
  })

  client.on('data', data => {
    const event = JSON.parse(data.toString("utf8"));
    if (ajv.validate(eventSchema, event)) {
      const error = event.event.payload.error;

      if (error !== null) {
        console.log("The command encountered an error:", error);
      } else {
        console.log('The result is:', event.event.payload.result);
      }
    } else {
      console.log('The schema is not validated');
    }
  });

  console.log('Connected to Server!');
  
  //Sending json stringified to server
  client.write(JSON.stringify(commandSuccess));
  client.write(JSON.stringify(commandError));
});

