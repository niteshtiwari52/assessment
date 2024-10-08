const mongoose = require("mongoose");

const MarketingSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    contacts: [
      {
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MarketingModel = mongoose.model("Marketing", MarketingSchema);

module.exports = MarketingModel;
