<div align="center">
    <img src="https://github.com/0liveiraVictor/websockets-communication/assets/106946476/91f56e19-07d0-4a29-821c-050a2e87879a" alt="websockets-communication">
</div>
<br>

# **Websockets Communication**

## A simple example of websocket communication between a client and a web server.

<br>

[![license](https://img.shields.io/static/v1?label=license&message=ISC&color=RGB&style=plastic)](./LICENSE)
<br>
<br>

# Content Table

- [Websockets Communication Project](#websockets-communication)
  - [Description](#a-simple-example-of-websocket-communication-between-a-client-and-a-web-server)
- [About Websocket Connections](#about-websocket-connections)
- [Overview](#overview)
- [Installation (Step by Step)](#installation-step-by-step)
  - [Clone this Repository](#step-1---clone-this-github-repository)
  - [Installation of Server and Client Dependencies](#step-2---install-client-and-server-project-dependencies)
    - [Server Dependencies](#server-dependencies)
    - [Client Dependencies](#client-dependencies)
- [Environment Variables](#environment-variables)
  - [Server Params](#server-params)
  - [Client Params](#client-params)
- [Running (Step by Step)](#running-step-by-step)
  - [Run the Server](#step-1---run-the-server)
  - [Run the Client](#step-2---run-the-client)
- [Technologies Used](#technologies-used)
  - [Languages](#languages)
  - [Web Execution Platform](#web-execution-platform)
  - [Package Manager](#package-manager)
  - [Dependency Libraries](#dependency-libraries)
- [Author](#author)
- [License](#license)

# About Websocket Connections

A websocket connection is a bidirectional and real-time communication technology that enables efficient data exchange between a client and a server. Unlike the traditional client-server communication model based on requests and responses (HTTP), websocket establishes a persistent connection that allows for asynchronous real-time data transmission.

The key features of a websocket connection are as follows:

- **Connection establishment:**<br>
  _The process of establishing a websocket connection involves an initial handshake. The client sends an HTTP request to the server, including a special header called "Upgrade" with the value "websocket," indicating the desire to establish a websocket connection. If the server supports this upgrade, it responds with a confirming response header and establishes the websocket connection._

- **Bidirectional communication:**<br>
  _Once the websocket connection is established, both the client and the server can asynchronously send messages in both directions. This enables the server to send real-time updates or notifications to the client, and the client to send requests or information to the server without the need for a new HTTP request._

- **Low overhead:**<br>
  _Websocket technology has lower communication overhead compared to the traditional HTTP protocol. This is because, once the websocket connection is established, there is no need to repeatedly send HTTP headers with each message, resulting in more efficient communication._

- **Support for different data types:**<br>
  _Websocket supports the transmission of various data types, such as text and binary data. This allows for sending structured messages in JSON format, images, audio, video, and more._

- **Events and APIs:**<br>
  _To handle websocket communication, both the client and the server implement APIs that provide events and methods for sending and receiving messages. In JavaScript, for example, in the browser, you can use the websocket API to establish and interact with a websocket connection._

Overall, websocket connections are widely used in real-time web applications such as real-time chats, push notifications, multiplayer games, and other scenarios where real-time communication is required. They offer an efficient and low-latency alternative to traditional HTTP-based communication.

<br>

<div align="center">
    <img src="https://github.com/0liveiraVictor/websockets-communication/assets/106946476/14a44a3f-64d5-4cd0-b2af-16c8bc68c8fc" alt="websockets-communication" width="600px" height="337.5px">
</div>

# Overview

The purpose of the project was to demonstrate the operation of a simple websocket connection between a client and a web server. In this process, the client can connect to the web server and be in a position to receive messages (actions) from the server at any time, without the need for an external request (via the HTTP protocol).

In the proposed example, the web server exposes (in the websocket connection) an endpoint that triggers the sending of an action to the client; in this case, the action is to check the status of an account on the client's machine (demonstration example). Additionally, the server keeps a record of all executed actions for all connected clients, storing them in a list (array) called 'commandList', which could be easily replaced by a database table for data persistence. Overall, the handling of these actions, regardless of their nature, follows the same websocket connection approach.

Regarding the instances of socket connections for each client linked to the server, they are identified and stored within a variable named 'clients', of type map. Each connection created with the server is stored in the variable as a key-value pair, where the value represents the instance of the client's websocket associated with its client name upon connection. This allows for controlled message sending (actions) to each client or group of clients.

# Installation (Step by Step)

### **Step 1 - Clone this github repository:**

```
$ git clone https://github.com/0liveiraVictor/websockets-communication.git
```

### **Step 2 - Install client and server project dependencies**

#### **Server dependencies**

- **In the root folder of the project access the server directory:**
  ```
  $ cd server
  ```
- **Install all required dependencies for the server:**
  ```
  $ npm install
  ```

#### **Client dependencies**

- **In the root folder of the project access the client directory:**
  ```
  $ cd client
  ```
- **Install all required dependencies for the client:**
  ```
  $ npm install
  ```

# Environment Variables

The configuration of environment variables was defined in a .env file within each base application directory (server and client). Below are listed the parameters used as environment variables in each application:

### **Server params**

| Name                  | Description                                         |
| --------------------- | --------------------------------------------------- |
| APP_PORT_SERVER       | Port on which the server application is running.    |
| APP_HOST_SERVER       | Server application hostname.                        |
| SECRET_KEY_JWT_SERVER | Secret key used in creating server JWT token.       |
| SECRET_KEY_JWT_CLIENT | Secret key used in decoding the client's JWT token. |
| EXPIRES_IN_JWT_SERVER | Value for expiry of JWT token created on server.    |
| OBJECT_COMMAND_NAME   | Name of run command.                                |
| OBJECT_COMMAND_SQL    | SQL execution command.                              |
| OBJECT_COMMAND_FIELD  | Attribute (field/column) of the command.            |
| OBJECT_COMMAND_FILTER | Comparison operator used to filter the command.     |
| OBJECT_COMMAND_STATUS | Command status [default = OPEN].                    |

### **Client params**

| Name                  | Description                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| URL_WS_CLIENT         | URL used by client to establish websocket connection; e.g. ws://[server_hostname]:[server_port]?name=[client_name]. |
| SECRET_KEY_JWT_CLIENT | Secret key used in creating client JWT token.                                                                       |
| SECRET_KEY_JWT_SERVER | Secret key used in decoding the server's JWT token.                                                                 |
| EXPIRES_IN_JWT_CLIENT | Value for expiry of JWT token created on client.                                                                    |
| RECONNECTION_INTERVAL | Time interval (ms) for client reconnection in case of server connection drop [default = 5000].                      |

# Running (Step by Step)

### **Step 1 - Run the server**

- **In the root folder of the project access the server directory:**
  ```
  $ cd server
  ```
- **Turn on the server by running the script:**
  ```
  $ npm start
  ```

### **Step 2 - Run the client**

For each client that wishes to connect to the websocket server, it will be necessary to run in separate terminals. To do this, open a new terminal (or multiple client) and follow the steps:

- **In the root folder of the project access the client directory:**
  ```
  $ cd client
  ```
- **Connect to the websocket server:**
  ```
  $ npm start
  ```

# Technologies Used

### **Languages:**

- [Javascript](https://www.javascript.com/)

### **Web execution platform:**

- [NodeJS](https://nodejs.org/en)

### **Package manager:**

- [NPM](https://www.npmjs.com/)

### **Dependency libraries:**

- [cors](https://github.com/expressjs/cors)
- [dotenv](https://github.com/motdotla/dotenv)
- [express](https://github.com/expressjs/express)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [nodemon](https://github.com/remy/nodemon)
- [readline-sync](https://github.com/anseki/readline-sync)
- [ws](https://github.com/websockets/ws)

# Author

<div style="display: flex; justify-content: space-around; align-items: center;">
  <div>
<<<<<<< HEAD
    <p><strong>Made by Victor Oliveira.</strong></p>
    <a href="https://github.com/0liveiraVictor" style="display: inline-block; margin-right: 25px;">
      <img src="https://img.shields.io/badge/GitHub-Profile-black?logo=github" alt="GitHub">
    </a>
    <a href="https://www.linkedin.com/in/oliveiravictorrs/">
      <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin" alt="LinkedIn">
    </a>
  </div><br>
=======
    <p><strong>Made by Victor Oliveira.</strong></p><br>
    <div style="display:flex; justify-content: space-between; align-items: center;">
      <a href="https://github.com/0liveiraVictor" style="margin-right: 20px;">
        <img src="https://img.shields.io/badge/GitHub-Profile-black?logo=github" alt="GitHub">
      </a>
      <a href="https://www.linkedin.com/in/oliveiravictorrs/">
        <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin" alt="LinkedIn">
      </a>
    </div>
  </div>
>>>>>>> d5c5055 (docs: readme update)
  <div>
      <img src="https://avatars.githubusercontent.com/u/106946476?s=400&u=32d0a37dfe0b00021769868aa9483ed396468f81&v=4" alt="Victor0liveira" width="125" height="125">
  </div>
</div>

# License

```
ISC License

Copyright (c) 2023 VICTOR OLIVEIRA

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
