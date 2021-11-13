const { model, Schema } = require("mongoose");

module.exports = model(
  "ShopItem",
  new Schema({
    itemName: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    isPurchased: { type: Boolean, default: false },
  })
);
