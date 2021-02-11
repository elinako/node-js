const { Router } = require("express");
const ContactsController = require("./contact.controllers");

const contactsRouter = Router();

contactsRouter.get("/", ContactsController.getContacts);
contactsRouter.post(
  "/",
  ContactsController.validateCreateContact,
  ContactsController.createContact
);
contactsRouter.get(
  "/:contactId",
  ContactsController.validateId,
  ContactsController.getById
);
contactsRouter.delete(
  "/:contactId",
  ContactsController.validateId,
  ContactsController.removeContact
);
contactsRouter.patch(
  "/:contactId",
  ContactsController.validateId,
  ContactsController.validateUpdateContact,
  ContactsController.updateContact
);

module.exports = contactsRouter;
