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

// const MONGO_URL = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.5sjtw.mongodb.net/db?retryWrites=true&w=majority`;
// let contactsCollection;

// async function start() {
//   const app = express();
//   app.use(express.json());

//   app.listen(PORT, () => {
//     console.log("Server is listening on PORT:", PORT);
//   });

//   const client = await MongoClient.connect(MONGO_URL);

//   const db = client.db();
//   contactsCollection = db.collection("contacts");

//   app.get("/api/contacts", getContacts);
//   app.post("/api/contacts", validateCreateContact, createContact);
//   app.get("/api/contacts/:contactId", getById);
// }

// start();

// async function getContacts(req, res) {
//   const contacts = await contactsCollection.find().toArray();
//   res.json(contacts);
// }

// async function createContact(req, res) {
//   const result = await contactsCollection.insertOne(req.body);
//   res.json(result.ops[0]);
// }

// async function getById(req, res) {
//   const {
//     params: { contactId },
//   } = req;

//   if (!ObjectID.isValid(contactId)) {
//     return res.status(400).send("User id is not valid");
//   }
//   const contact = await contactsCollection.findOne({
//     _id: ObjectID(contactId),
//   });

//   if (!contact) {
//     return res.status(404).send("User is not found");
//   }
//   res.json(contact);
// }

// function validateCreateContact(req, res, next) {
//   const validationRules = Joi.object().keys({
//     name: Joi.string().required(),
//     email: Joi.string().required(),
//     phone: Joi.string().required(),
//   });
//   const validationResult = validationRules.validate(req.body);
//   console.log("req.body", req.body);
//   console.log("validate", validationResult);

//   if (validationResult.error) {
//     return res.status(400).send({ message: "missing required name field" });
//   }
//   next();
// }

// class Server {
//   constructor() {
//     this.server = null;
//   }

//   start() {
//     this.server = express();
//     this.initMiddlewares();
//     this.initRoutes();
//     this.listen();
//   }

//   initMiddlewares() {
//     this.server.use(express.json());
//     this.server.use(cors());
//   }

//   initRoutes() {
//     this.server.use("/api/contacts", contactsRouter);
//   }

//   listen() {
//     this.server.listen(PORT, () => {
//       console.log("Server is listening on PORT:", PORT);
//     });
//   }
// }

// const server = new Server();
// server.start();
