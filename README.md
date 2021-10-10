# TCP server client connection
This project uses a TCP socket to connect a client and a server to run remote commands.

## What does this project do?
The client sends commands to the server, the server receives and validate them. After that, the server sends back a response to the client. 

## Setup
Download or clone the repository and inside its folder run the following command:
```shell
$ npm install
```

To configure the communication port between the client and the server use: 
* _Client side_: set an environment variable named __CLIENT_TCP_PORT__ 
  * You can find a default value in the `package.json` file
* _Server side_: use the `driver_config.json` file

## Usage
To start the program run the following commands in separated terminals: 
```shell
$ npm run server
$ npm run client-win #if running on windows
$ npm run client-unix #if running on unix systems
```

### Logging
Both client and server generate log files called `client.log` and `server.log` in which you can find all the executed operations and any generated error. 
