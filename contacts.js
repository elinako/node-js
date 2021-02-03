const fs = require("fs");

const path = require("path");

const contactsPath = path.join("db", "/contacts.json");

function listContacts() {
  return fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data));
  });
}

function getContactById(contactId) {
  return fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data).find((contact) => contact.id === contactId));
  });
}

function removeContact(contactId) {
  return fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    const index = JSON.parse(data).findIndex(
      (contact) => contact.id === contactId
    );
    console.log(JSON.parse(data).splice(index, 1));
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    const contacts = JSON.parse(data);
    const newContact = {
      id: contacts.length + 1,
      name: `${name}`,
      email: `${email}`,
      phone: `${phone}`,
    };

    contacts.push(newContact);
    const newArr = contacts;

    return fs.writeFile(contactsPath, newContact, "utf8", (err) => {
      if (err) throw err;
      console.log(newArr);
    });
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
