const { Router } = require("express");
const ContactsController = require("../controllers/contacts.controllers");

const router = Router();

router.get("/", ContactsController.listContacts);
router.post(
  "/",
  ContactsController.validateCreateContact,
  ContactsController.createContact
);
router.get("/:contactId", ContactsController.getById);
router.delete("/:contactId", ContactsController.removeContact);
router.patch(
  "/:contactId",
  ContactsController.validateUpdateContact,
  ContactsController.updateContact
);

module.exports = router;
