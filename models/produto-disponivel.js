const { Schema } = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');

const produtoSchema = new Schema({
  description: { type: String, required: [true, "Entre com modelo do produto"] },
  serialNumber: { type: String, required: [true, "Entre com o serial do produto!"], unique: true },
  productID: { type: String, required: [true, "Entre com id do produto"] },
  buyID: { type: String, required: [true, "Entre com codigo da compra"] },
  baseStock: { type: String, required: [true, "Entre com a base do estoque do produto"] },
  status: { type: String, enum: ["pre-reservado", "reservado", "disponivel", "baixado"], default: "disponivel", required: [true, "Entre com a origem do evento"]},
  originID: { type: String, required: [true, "Entre com id da compra"] },
}, { versionKey: false });

produtoSchema.plugin(timestamps);
produtoSchema.plugin(userAudit);

module.exports = dbConnection.model("produtosdisponiveis", produtoSchema);