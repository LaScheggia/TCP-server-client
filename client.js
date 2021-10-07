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
    console.log(data.toString("utf8"));
    client.destroy();
  })
  console.log("connected!");
  
  //Sending json stringified to server
  client.write(JSON.stringify(command_success));

  
});

