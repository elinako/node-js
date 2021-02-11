const contacts = require("../db/contacts.json");
const Joi = require("joi");

class ContactsController {
  async listContacts(req, res) {
    await res.json(contacts);
    return res.status(200).send();
  }

  createContact(req, res) {
    const { name, email, phone } = req.body;
    const newContact = { name, email, phone, id: contacts.length + 1 };
    contacts.push(newContact);
    res.json(newContact);
    return res.status(201).send();
  }

  getById(req, res) {
    const contactId = parseInt(req.params.contactId);
    const contactIndex = contacts.findIndex(({ id }) => contactId === id);
    if (contactIndex === -1) {
      return res.status(400).send({ message: "Not found" });
    }
    const searchUser = contacts[contactIndex];
    res.json(searchUser);
    return res.status(201).send();
  }

  updateContact(req, res) {
    const contactId = parseInt(req.params.contactId);
    const contactIndex = contacts.findIndex(({ id }) => contactId === id);
    const updatedContact = {
      ...contacts[contactIndex],
      ...req.body,
    };
    if (contactIndex === -1) {
      return res.status(400).send({ message: "Not found" });
    }
    contacts[contactIndex] = updatedContact;
    res.json(updatedContact);
    return res.status(201).send();
  }

  removeContact(req, res) {
    const contactId = parseInt(req.params.contactId);
    const contactIndex = contacts.findIndex(({ id }) => contactId === id);
    contacts.splice(contactIndex, 1);
    if (contactIndex === -1) {
      return res.send(400).send({ message: "Not found" });
    }
    return res.status(200).send({ message: "contact deleted" });
  }

  validateCreateContact(req, res, next) {
    const validationRules = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const validationResult = validationRules.validate(req.body);
    console.log("req.body", req.body);
    console.log("validate", validationResult);

    if (validationResult.error) {
      return res.status(400).send({ message: "missing required name field" });
    }
    next();
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send({ message: "missing fields" });
    }
    next();
  }
}

module.exports = new ContactsController();
