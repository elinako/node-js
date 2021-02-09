const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactsRouter = require("./routers/contacts.routes");

const PORT = process.env.PORT || 8080;

class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRoutes();
    this.listen();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }

  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening on PORT:", PORT);
    });
  }
}

const server = new Server();
server.start();
