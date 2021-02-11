const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const contactModel = mongoose.model("Contact", ContactSchema);

ContactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;

async function findContactByIdAndUpdate(id, updateParams) {
  return this.findByIdAndUpdate(id, { $set: updateParams }, { new: true });
}

module.exports = contactModel;
