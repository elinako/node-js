const { json } = require("express");
const { listContacts } = require("../controllers/contacts.controllers");
const contacts = require("../db/contacts.json");

const listOfCOntacts = JSON.parse(contacts);

module.exports = listContacts;
