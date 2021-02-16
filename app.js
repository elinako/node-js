const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Joi = require("joi");
const contactsRouter = require("./contacts/contact.routes");
const userRouter = require("./users/user.routes");

require("dotenv").config();

class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
    await this.initDataBase();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
    this.server.use("/auth", userRouter);
  }

  async initDataBase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Database connection successful");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server listening on port:", process.env.PORT);
    });
  }
}

new ContactsServer().start();
