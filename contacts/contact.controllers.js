const Joi = require("joi");
const ContactModel = require("./contact.model");
const {
  Types: { ObjectId },
} = require("mongoose");

class ContactsController {
  async getContacts(req, res, next) {
    try {
      const contacts = await ContactModel.find();

      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.contactId;

      const contact = await ContactModel.findById(id);

      if (!contact) {
        return res.status(404).send();
      }

      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async createContact(req, res, next) {
    try {
      const contact = await ContactModel.create(req.body);
      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    const id = req.params.contactId;

    const updateResult = await ContactModel.findContactByIdAndUpdate(
      id,
      req.body
    );
    if (!updateResult) {
      return res.status(404).send();
    }

    return res.status(204).send(updateResult);
  }

  async removeContact(req, res, next) {
    try {
      const id = req.params.contactId;

      const deletedContact = await ContactModel.findByIdAndDelete(id);

      if (!deletedContact) {
        return res.status(404).send();
      }

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
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

  validateId(req, res, next) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
    }
    next();
  }
}

module.exports = new ContactsController();
