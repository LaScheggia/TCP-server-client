// Including Nodejs' net module.
const net = require("net"); 

const command_success = require("./command_success.json");

//Selecting the port connection
const options = {
  port: 8080,
};

//Connection
let client = net.connect(options, () => {
  client.on('data', data =>{

    const commandRes = JSON.parse(data.toString("utf8"));
    const sumRes = commandRes.examples[0].event.payload.result;

    console.log(sumRes);
    client.destroy();
  })
  console.log("connected!");
  
  //Sending json stringified to server
  client.write(JSON.stringify(command_success));
});

