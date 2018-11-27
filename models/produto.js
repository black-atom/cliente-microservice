const { Schema } = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');

const StockItem = new Schema({
  quantity: {
    type: Number,
    default: 0,
  },
  baseStock: {
    type: String,
    required: [true, "Entre com a base do stock"],
  },
})

const produtoSchema = new Schema({
  description: { type: String, required: [true, "Entre com modelo do produto"] },
  category: { type: String, enum: ["ACESSÓRIO","EQUIPAMENTO","SERVIÇO", "PEÇA", "SOFTWARE"], required: [true, "Entre com a categoria!"] },
  brand: { type: String, required: [true, "Entre com modelo do produto"] },
  productCode: { type: String, required: [true, "Entre com codigo do produto"] },
  serialControl: { type: Boolean, default: false, required: [true, "Entre com modelo do produto"] },
  buyPrice: { type: Number, default: 0 },
  sellPrice: { type: Number, default: 0 },
  stockInfo: {
    type: [StockItem],
    default: [],
  },
}, { versionKey: false });

produtoSchema.plugin(timestamps);
produtoSchema.plugin(userAudit);

module.exports = dbConnection.model("produtos", produtoSchema);