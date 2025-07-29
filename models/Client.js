const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Client email is required"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Client phone is required"],
    },
    address: {
      type: String,
      required: [true, "Client address is required"],
    },
    // The user who created this client (for ownership/tracking)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
